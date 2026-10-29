#!/usr/bin/env node
// Docs check: relative links and #anchors resolve; ARCHITECTURE.md has a TL;DR and Terms.
// Usage: node scripts/check-docs.mjs   → prints problems (one per line) and a summary; exit 1 on any.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const docs = ['CLAUDE.md', 'PLAN.md', 'ARCHITECTURE.md', 'README.md']
  .filter((f) => existsSync(join(root, f)));

// GitHub-style heading slug: lowercase, drop punctuation (keeps word chars, spaces, hyphens), spaces → hyphens.
const slug = (h) => h.trim().toLowerCase().replace(/[^\p{L}\p{N}_\- ]/gu, '').replace(/ /g, '-');
const text = Object.fromEntries(docs.map((f) => [f, readFileSync(join(root, f), 'utf8')]));
const anchors = (f) => new Set([...text[f].matchAll(/^#+ (.*)$/gm)].map((m) => slug(m[1])));

const problems = [];
let links = 0;
for (const f of docs) {
  for (const [, path, anchor] of text[f].matchAll(/\]\(([^)#\s]*)(#[^)\s]+)?\)/g)) {
    if (/^https?:/.test(path)) continue;
    links++;
    const target = path ? normalize(join(dirname(f), path)) : f;
    if (path && !existsSync(join(root, target))) { problems.push(`${f}: missing file ${path}`); continue; }
    if (anchor && target.endsWith('.md')) {
      if (!text[target]) text[target] = readFileSync(join(root, target), 'utf8');
      if (!anchors(target).has(anchor.slice(1))) problems.push(`${f}: no heading for ${path}${anchor}`);
    }
  }
  if (f === 'ARCHITECTURE.md') {
    if (!/^## TL;DR$/m.test(text[f])) problems.push(`${f}: no "## TL;DR" section`);
    if (!/^\*\*Terms:\*\*/m.test(text[f])) problems.push(`${f}: no "**Terms:**" line`);
  }
}
problems.forEach((p) => console.log(p));
console.log(`docs: ${docs.length} files, ${links} relative links, ${problems.length} problems`);
process.exit(problems.length ? 1 : 0);
