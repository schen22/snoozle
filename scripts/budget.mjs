#!/usr/bin/env node
// Size budget: brotli of public/index.html plus every public/js/*.js, summed, must be <= 20 KB. Prints raw/gzip/brotli bytes; exit 1 over budget.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const jsDir = join(root, 'public/js');
const files = [join(root, 'public/index.html'), ...readdirSync(jsDir).filter((f) => f.endsWith('.js')).sort().map((f) => join(jsDir, f))];
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
