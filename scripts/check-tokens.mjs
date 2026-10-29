#!/usr/bin/env node
// Token check: #hex colours only in public/css/tokens.css (none in index.html, app.css, motion.css, public/js/**);
// no digits in COPY strings (in public/js/copy.js)
// (placeholders excepted); Recharge cards fit their card (title ≤ 14, small line ≤ 20, replies ≤ 2 sentences);
// choice buttons are five words at most.
// Prints problems (capped) and a summary; exit 1 on any.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { COPY } from '../public/js/copy.js';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const copyJs = readFileSync(join(root, 'public/js/copy.js'), 'utf8');
const problems = [];

// 1. Hex colours: allowed only in public/css/tokens.css. Flag them in index.html, app.css, motion.css and every public/js/**/*.js.
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.js') ? [join(d, e.name)] : []));
const lineOf = (s, i) => s.slice(0, i).split('\n').length;
const targets = [join(root, 'public/index.html'), join(root, 'public/css/app.css'), join(root, 'public/css/motion.css'), ...walk(join(root, 'public/js')).sort()];
for (const f of targets) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
    problems.push(`hex ${m[0]} outside tokens.css (${f.slice(root.length + 1)} line ${lineOf(text, m.index)})`);
  }
}

// 2. Digits in COPY strings, after removing ${…} placeholders.
let strings = 0;
// Drop comment lines first (they hold apostrophes), then scan every string literal.
const copy = copyJs.split('\n').filter((l) => !l.trim().startsWith('//')).join('\n');
if (!copy.includes('const COPY = {')) problems.push('const COPY not found in public/js/copy.js');
for (const [, , body] of copy.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
  strings++;
  const s = body.replace(/\$\{[^}]*\}/g, '');
  if (/\d/.test(s)) problems.push(`digit in COPY string: ${s.slice(0, 60)}`);
}
// 3. Recharge cards: two columns at 320 px, so long text makes one card taller than its row. "…" is not a sentence end.
for (const c of COPY.recharge.cards) {
  if (c.t.length > 14) problems.push(`card ${c.k} title over 14 characters: ${c.t}`);
  if (c.s.length > 20) problems.push(`card ${c.k} small line over 20 characters: ${c.s}`);
  for (const r of c.r) if ((r.match(/[.!?]+(?=\s|$)/g) || []).length > 2) problems.push(`card ${c.k} reply over 2 sentences: ${r.slice(0, 60)}`);
}
// 4. Choice buttons (thought kinds, their sheet options, the heavy-backpack sheet): five words at most.
const T = COPY.thoughts, M = COPY.moves;
for (const b of [...T.kinds.flatMap((k) => [k.t, ...k.opts.map((o) => o.label)]), T.wander.label, M.heavySave, M.heavyCarry]) {
  if (b.trim().split(/\s+/).length > 5) problems.push(`choice button over 5 words: ${b}`);
}
console.log(`tokens: ${problems.length} problem(s); ${strings} COPY strings scanned`);
for (const p of problems.slice(0, 5)) console.log(`  ${p}`);
process.exit(problems.length ? 1 : 0);
