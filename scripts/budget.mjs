#!/usr/bin/env node
// Size budget: per-file brotli of public/index.html, public/css/*.css and public/js/**/*.js, summed, must be <= 20 KB. Prints raw/gzip/brotli bytes; exit 1 over budget.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const walk = (d, ext) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name), ext) : e.name.endsWith(ext) ? [join(d, e.name)] : []));
const files = [join(root, 'public/index.html'), ...walk(join(root, 'public/css'), '.css').sort(), ...walk(join(root, 'public/js'), '.js').sort()];
let raw = 0, gz = 0, br = 0;
for (const f of files) {
  const buf = readFileSync(f);
  raw += buf.length;
  gz += gzipSync(buf, { level: 9 }).length;
  br += brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
}
const LIMIT = 20 * 1024;
console.log(`budget: total of ${files.length} files: raw ${raw} B, gzip ${gz} B, brotli ${br} B (limit ${LIMIT})`);
if (br > LIMIT) { console.log(`budget: FAIL brotli over by ${br - LIMIT} B`); process.exit(1); }
console.log('budget: ok');
