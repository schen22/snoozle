import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

export function chromePath() {
  const c = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'];
  const p = c.find((x) => x && fs.existsSync(x));
  if (!p) throw new Error('No Chrome found; set CHROME_PATH');
  return p;
}

let server;
export async function serve() {
  server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const f = path.join(ROOT, path.normalize(p));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return `http://127.0.0.1:${server.address().port}/`;
}

let browser;
export async function getBrowser() {
  browser ??= await puppeteer.launch({ executablePath: chromePath(), headless: true, args: ['--no-sandbox'] });
  return browser;
}
export async function closeAll() { await browser?.close(); server?.close(); }

// Page with .errors and .fakeDate(iso) (call before goto); window.__setFake(iso) jumps the fake clock.
export async function openAt(width) {
  const b = await getBrowser();
  const ctx = await b.createBrowserContext();
  const page = await ctx.newPage();
  const close = page.close.bind(page);
  page.close = async () => { await close().catch(() => {}); await ctx.close().catch(() => {}); };
  await page.setViewport({ width, height: 800 });
  const errors = [];
  page.errors = errors;
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.setRequestInterception(true);
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) r.respond({ status: 200, body: '', contentType: 'text/css' });
    else r.continue();
  });
  page.fakeDate = (iso) => page.evaluateOnNewDocument((iso) => {
    const Real = Date;
    const start = Real.now();
    let base = new Real(iso).getTime();
    const cur = () => base + (Real.now() - start);
    window.__setFake = (s) => { base = new Real(s).getTime() - (Real.now() - start); };
    class FD extends Real {
      constructor(...a) { if (a.length) super(...a); else super(cur()); }
      static now() { return cur(); }
    }
    window.Date = FD;
  }, iso);
  return page;
}
