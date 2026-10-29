// Mobile Lighthouse run against public/ served with public/_headers. Prints 5 lines; exit 1 over budget.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromePath } from '../test/helpers.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

// _headers: a path pattern line, then indented "Name: value" lines. Patterns: exact path or a trailing "*".
const rules = [];
for (const line of fs.readFileSync(path.join(ROOT, '_headers'), 'utf8').split('\n')) {
  if (!line.trim()) continue;
  if (!/^\s/.test(line)) rules.push({ pat: line.trim(), h: {} });
  else { const i = line.indexOf(':'); rules.at(-1).h[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
}
const headersFor = (p) => Object.assign({}, ...rules.filter((r) => r.pat === p || (r.pat.endsWith('*') && p.startsWith(r.pat.slice(0, -1)))).map((r) => r.h));

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const reqPath = p;
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', ...headersFor(reqPath) });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

// Start the installed Chrome ourselves and hand Lighthouse its debugging port: Lighthouse's own launcher refuses
// an x64 Node on Apple Silicon, and a native (arm64) Chrome is what we want measured. On such a Mac the arch
// check in the Lighthouse CLI is also bypassed (it attaches to our Chrome, so it never launches one).
const port = 9300 + Math.floor(Math.random() * 500);
const chromeArgs = ['--headless=new', '--no-sandbox', `--remote-debugging-port=${port}`, `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'snoozle-perf-'))}`, '--no-first-run', 'about:blank'];
const native = process.platform === 'darwin' && process.arch === 'x64' && os.cpus()[0].model.includes('Apple');
const chrome = native ? spawn('arch', ['-arm64', chromePath(), ...chromeArgs], { stdio: 'ignore' }) : spawn(chromePath(), chromeArgs, { stdio: 'ignore' });
for (let i = 0; i < 100; i++) {
  if (await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.ok, () => false)) break;
  await new Promise((r) => setTimeout(r, 100));
}

// Async spawn: the server must keep answering while Lighthouse loads the page.
const child = spawn('npx', ['-y', 'lighthouse@12', url, '--only-categories=performance', '--form-factor=mobile', '--screenEmulation.mobile',
  '--throttling-method=simulate', '--output=json', '--output-path=stdout', `--port=${port}`, '--quiet'],
{ stdio: ['ignore', 'pipe', 'pipe'], env: native ? { ...process.env, NODE_OPTIONS: "--import=data:text/javascript,Object.defineProperty(process,'arch',{value:'arm64'})" } : process.env });
let out = '', err = '';
child.stdout.on('data', (d) => { out += d; });
child.stderr.on('data', (d) => { err += d; });
await new Promise((r) => child.on('close', r));
server.close();
chrome.kill();

let lhr;
try { lhr = JSON.parse(out); } catch { console.log('perf: Lighthouse produced no JSON: ' + err.slice(0, 400)); process.exit(1); }

const a = lhr.audits;
const fcp = a['first-contentful-paint'].numericValue / 1000;
const lcp = a['largest-contentful-paint'].numericValue / 1000;
const cls = a['cumulative-layout-shift'].numericValue;
const score = Math.round(lhr.categories.performance.score * 100);
const kb = a['total-byte-weight'].numericValue / 1024;
console.log(`FCP ${fcp.toFixed(2)} s (budget 1.5)`);
console.log(`LCP ${lcp.toFixed(2)} s (budget 2.0)`);
console.log(`CLS ${cls.toFixed(3)} (budget 0.1)`);
console.log(`Performance score ${score} (budget 95)`);
console.log(`Transfer ${kb.toFixed(1)} KB`);
process.exit(fcp > 1.5 || lcp > 2.0 || cls > 0.1 || score < 95 ? 1 : 0);
