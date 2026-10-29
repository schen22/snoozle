#!/usr/bin/env node
// Token check: no #hex colour in public/index.html outside the TOKENS block or anywhere in public/js/copy.js;
// no digits in COPY strings (in public/js/copy.js)
// (placeholders and one allowlisted line excepted). Prints problems (capped) and a summary; exit 1 on any.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const html = readFileSync(join(root, 'public/index.html'), 'utf8');
const copyJs = readFileSync(join(root, 'public/js/copy.js'), 'utf8');
const ALLOW = ['What would 70% look like? Good enough is still good.'];
const problems = [];

// 1. Hex colours outside the TOKENS block (from "/* ── TOKENS ── */" to the next "/* ── " marker).
const t0 = html.indexOf('/* ── TOKENS ── */');
const t1 = html.indexOf('/* ── ', t0 + 5);
if (t0 < 0 || t1 < 0) problems.push('TOKENS block markers not found');
const outside = t0 < 0 ? html : html.slice(0, t0) + html.slice(t1);
const lineOf = (s, i) => s.slice(0, i).split('\n').length;
for (const m of outside.matchAll(/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
  problems.push(`hex ${m[0]} outside TOKENS (outside-block line ${lineOf(outside, m.index)})`);
}

for (const m of copyJs.matchAll(/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
  problems.push(`hex ${m[0]} in copy.js (line ${lineOf(copyJs, m.index)})`);
}

// 2. Digits in COPY strings, after removing ${…} placeholders.
let strings = 0;
// Drop comment lines first (they hold apostrophes), then scan every string literal.
const copy = copyJs.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
if (!copy.includes('const COPY = {')) problems.push('const COPY not found in public/js/copy.js');
for (const [, , body] of copy.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
  strings++;
  const s = body.replace(/\$\{[^}]*\}/g, '');
  if (/\d/.test(s) && !ALLOW.some((a) => s === a)) problems.push(`digit in COPY string: ${s.slice(0, 60)}`);
}
console.log(`tokens: ${problems.length} problem(s); ${strings} COPY strings scanned`);
for (const p of problems.slice(0, 5)) console.log(`  ${p}`);
process.exit(problems.length ? 1 : 0);
