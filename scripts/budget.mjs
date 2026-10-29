#!/usr/bin/env node
// Size budget: brotli of public/index.html must be <= 20 KB. Prints raw/gzip/brotli bytes; exit 1 over budget.
import { readFileSync } from 'node:fs';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const buf = readFileSync(join(root, 'public/index.html'));
const gz = gzipSync(buf, { level: 9 }).length;
const br = brotliCompressSync(buf, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const LIMIT = 20 * 1024;
console.log(`budget: raw ${buf.length} B, gzip ${gz} B, brotli ${br} B (limit ${LIMIT})`);
if (br > LIMIT) { console.log(`budget: FAIL brotli over by ${br - LIMIT} B`); process.exit(1); }
console.log('budget: ok');
