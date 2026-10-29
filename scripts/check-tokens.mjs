#!/usr/bin/env node
// Token check: no #hex colour in public/index.html outside the TOKENS block; no digits in COPY strings
// (placeholders and one allowlisted line excepted). Prints problems (capped) and a summary; exit 1 on any.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const html = readFileSync(join(root, 'public/index.html'), 'utf8');
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

// 2. Digits in COPY strings, after removing ${…} placeholders.
const c0 = html.indexOf('const COPY = {');
const c1 = html.indexOf('// ── ', c0 + 5);
let strings = 0;
if (c0 < 0 || c1 < 0) problems.push('COPY block markers not found');
else {
  const copy = html.slice(c0, c1);
  for (const [, , body] of copy.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
    strings++;
    const s = body.replace(/\$\{[^}]*\}/g, '');
    if (/\d/.test(s) && !ALLOW.some((a) => s === a)) problems.push(`digit in COPY string: ${s.slice(0, 60)}`);
  }
}
console.log(`tokens: ${problems.length} problem(s); ${strings} COPY strings scanned`);
for (const p of problems.slice(0, 5)) console.log(`  ${p}`);
process.exit(problems.length ? 1 : 0);
