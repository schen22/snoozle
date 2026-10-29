#!/usr/bin/env node
// Sprite check: every SVG shape in reference/prototype.html appears in public/index.html or public/js/** with the same tag
// and geometry attributes (compared as attribute sets). Attributes whose value uses ${…} are ignored.
// Usage: node scripts/check-sprites.mjs → matched/missing counts; exit 1 on any missing.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const root = join(dirname(new URL(import.meta.url).pathname), '..');
const GEO = new Set(['d', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'points', 'transform']);
const shapes = (src) => {
  const out = [];
  for (const [, tag, attrs] of src.matchAll(/<(path|circle|ellipse|rect|polygon|line|text)(?=[\s/>])((?:"[^"]*"|'[^']*'|`[^`]*`|[^>"'`])*)>/g)) {
    const kv = [];
    for (const [, k, v] of attrs.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) {
      if (GEO.has(k) && !v.includes('${')) kv.push(`${k}=${v}`);
    }
    out.push({ key: `${tag} ${kv.sort().join(' ')}`, raw: `<${tag}${attrs.slice(0, 70)}` });
  }
  return out;
};
const proto = shapes(readFileSync(join(root, 'reference/prototype.html'), 'utf8'));
// The page's shapes live in index.html (the scene) and in SVG strings under public/js/.
const js = readdirSync(join(root, 'public/js'), { recursive: true }).filter((f) => f.endsWith('.js')).map((f) => join(root, 'public/js', f));
const src = [join(root, 'public/index.html'), ...js].map((f) => readFileSync(f, 'utf8')).join('\n');
const page = new Set(shapes(src).map((s) => s.key));
const missing = proto.filter((s) => !page.has(s.key));
console.log(`sprites: ${proto.length - missing.length} matched, ${missing.length} missing`);
for (const m of missing.slice(0, 5)) console.log(`  missing ${m.raw}`);
process.exit(missing.length ? 1 : 0);
