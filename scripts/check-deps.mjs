#!/usr/bin/env node
// Import-direction check for public/js (ARCHITECTURE §2). Leaves: copy, view/dom, store, clock; state may use copy.
// view never imports act/actions/store/fx/dialog; fx and dialog use only view/dom; actions never use view or fx.
// Only act.js and main.js cross layers. Usage: node scripts/check-deps.mjs → one line (+ up to 5); exit 1 on any.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const js = join(dirname(new URL(import.meta.url).pathname), '..', 'public', 'js');
const layer = (f) => (f.startsWith('view/') ? (f === 'view/dom.js' ? 'dom' : 'view') : f.replace(/\.js$/, ''));
const ALLOW = {
  copy: [], dom: [], store: [], clock: [], state: ['copy'],
  view: ['copy', 'state', 'dom', 'view'], fx: ['dom'], dialog: ['dom'],
  actions: ['copy', 'state', 'clock'],
};
const problems = [];
let edges = 0;
for (const f of readdirSync(js, { recursive: true }).filter((x) => x.endsWith('.js'))) {
  const from = layer(f);
  for (const [, t] of readFileSync(join(js, f), 'utf8').matchAll(/from\s+'([^']+)'/g)) {
    edges++;
    const to = layer(relative(js, resolve(join(js, dirname(f)), t)));
    if (ALLOW[from] && !ALLOW[from].includes(to)) problems.push(`${f} imports ${t} (${from} → ${to} not allowed)`);
  }
}
console.log(`deps: ${edges} imports, ${problems.length} problem(s)`);
problems.slice(0, 5).forEach((p) => console.log('  ' + p));
process.exit(problems.length ? 1 : 0);
