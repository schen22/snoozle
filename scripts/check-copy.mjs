#!/usr/bin/env node
// Copy check: every fragment in spec/copy.json appears in public/index.html (after decoding JS escapes).
// Usage: node scripts/check-copy.mjs → count + first 5 misses; exit 1 on any miss.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const spec = JSON.parse(readFileSync(join(root, 'spec/copy.json'), 'utf8'));
const decode = (s) => s
  .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\(['"`\\])/g, '$1');
const page = decode(readFileSync(join(root, 'public/index.html'), 'utf8'));

let total = 0;
const misses = [];
for (const [key, val] of Object.entries(spec)) {
  for (const frag of [val].flat()) {
    total++;
    if (!page.includes(frag.trim())) misses.push(`${key}: ${frag}`);
  }
}
console.log(`copy: ${total - misses.length}/${total} fragments found`);
for (const m of misses.slice(0, 5)) console.log(`  missing ${m}`);
if (misses.length > 5) console.log(`  …and ${misses.length - 5} more`);
process.exit(misses.length ? 1 : 0);
