// Mobile Lighthouse runs against public/ served with public/_headers. Prints 4 lines (medians); exit 1 over budget.
// PERF_RUNS=1 for a quick look.
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
async function lighthouse() {
  const child = spawn('npx', ['-y', 'lighthouse@12', url, '--only-categories=performance', '--form-factor=mobile', '--screenEmulation.mobile',
    '--throttling-method=simulate', '--output=json', '--output-path=stdout', `--port=${port}`, '--quiet'],
  { stdio: ['ignore', 'pipe', 'pipe'], env: native ? { ...process.env, NODE_OPTIONS: "--import=data:text/javascript,Object.defineProperty(process,'arch',{value:'arm64'})" } : process.env });
  let out = '', err = '';
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { err += d; });
  await new Promise((r) => child.on('close', r));
  try { return JSON.parse(out); } catch { console.log('perf: Lighthouse produced no JSON: ' + err.slice(0, 400)); process.exit(1); }
}

// Median of RUNS: one simulated run is noisy (±0.2 s seen), and Lantern charges every early request, so treat it
// as a trend. LCP over WARN prints a warning only; budgets fail.
const RUNS = Number(process.env.PERF_RUNS || 5), WARN = 1.3;
const runs = [];
for (let i = 0; i < RUNS; i++) {
  const a = (await lighthouse()).audits;
  runs.push({
    fcp: a['first-contentful-paint'].numericValue / 1000, lcp: a['largest-contentful-paint'].numericValue / 1000,
    cls: a['cumulative-layout-shift'].numericValue, kb: a['total-byte-weight'].numericValue / 1024,
    req: a['network-requests'].details.items.length,
    own: a['network-requests'].details.items.filter((r) => r.url.startsWith(url)).length, tti: (a.interactive?.numericValue ?? NaN) / 1000,
  });
}
server.close();
chrome.kill();
const med = (k) => runs.map((r) => r[k]).sort((x, y) => x - y)[Math.floor(RUNS / 2)];
const fcp = med('fcp'), lcp = med('lcp'), cls = med('cls'), req = med('req'), own = med('own'), tti = med('tti');
console.log(`perf: median of ${RUNS} runs (simulated Slow 4G); LCP range ${Math.min(...runs.map((r) => r.lcp)).toFixed(2)}–${Math.max(...runs.map((r) => r.lcp)).toFixed(2)} s`);
console.log(`FCP ${fcp.toFixed(2)} s (budget 1.5) · LCP ${lcp.toFixed(2)} s (budget 2.0${lcp > WARN ? `, over the ${WARN} s warning` : ''})`);
console.log(`first tap (TTI) ${tti.toFixed(2)} s (budget 2.5) · CLS ${cls.toFixed(3)} (budget 0.1${cls > 0.05 ? ', over the 0.05 warning' : ''})`);
console.log(`requests: ours ${own} (budget 20), all ${req} (budget 25) · transfer ${med('kb').toFixed(1)} KB`);
process.exit(fcp > 1.5 || lcp > 2.0 || tti > 2.5 || cls > 0.1 || own > 20 || req > 25 ? 1 : 0);
