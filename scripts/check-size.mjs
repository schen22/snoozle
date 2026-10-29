#!/usr/bin/env node
// Size check: every public/js/**/*.js and public/css/*.css is <= 200 lines, public/index.html <= 150.
// public/js/copy.js is exempt (all copy stays in one file). At the cap, split first in a no-behaviour commit.
// Usage: node scripts/check-size.mjs → one summary line (+ up to 5 problems); exit 1 on any.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const pub = join(dirname(new URL(import.meta.url).pathname), '..', 'public');
const walk = (d, ext) => readdirSync(join(pub, d), { recursive: true }).filter((f) => f.endsWith(ext)).map((f) => `${d}/${f}`);
const caps = [['index.html', 150], ...[...walk('js', '.js'), ...walk('css', '.css')].filter((f) => f !== 'js/copy.js').map((f) => [f, 200])];
const lines = (f) => readFileSync(join(pub, f), 'utf8').split('\n').length;
const over = caps.map(([f, cap]) => [f, lines(f), cap]).filter(([, n, cap]) => n > cap);
const biggest = caps.map(([f]) => [f, lines(f)]).sort((a, b) => b[1] - a[1])[0];
console.log(`size: ${caps.length} files, largest ${biggest[0]} ${biggest[1]} lines, ${over.length} over cap`);
over.slice(0, 5).forEach(([f, n, cap]) => console.log(`  ${f}: ${n} lines > ${cap}`));
process.exit(over.length ? 1 : 0);
