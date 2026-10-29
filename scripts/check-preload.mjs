#!/usr/bin/env node
// Preload check: every public/js/**/*.js is a modulepreload <link> in index.html and every public/css/*.css a
// stylesheet <link>, with nothing listed that doesn't exist.
// Usage: node scripts/check-preload.mjs → one summary line (+ up to 5 problems); exit 1 on any.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const pub = join(dirname(new URL(import.meta.url).pathname), '..', 'public');
const html = readFileSync(join(pub, 'index.html'), 'utf8');
const walk = (d, ext) => readdirSync(join(pub, d), { recursive: true }).filter((f) => f.endsWith(ext)).map((f) => `${d}/${f}`);
const files = new Set([...walk('js', '.js'), ...walk('css', '.css')]);
const inHtml = new Set([...html.matchAll(/<link rel="(?:modulepreload|stylesheet)" href="((?:js|css)\/[^"]+)">/g)].map((m) => m[1]));
const problems = [];
for (const [name, set] of [['index.html', inHtml]]) {
  for (const f of files) if (!set.has(f)) problems.push(`${name}: missing ${f}`);
  for (const f of set) if (!files.has(f)) problems.push(`${name}: lists ${f}, which doesn't exist`);
}
if (!html.includes('<script type="module" src="js/main.js"></script>')) problems.push('index.html: no module script for js/main.js');
console.log(`preload: ${files.size} files, ${problems.length} problem(s)`);
problems.slice(0, 5).forEach((p) => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
