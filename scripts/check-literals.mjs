import fs from 'node:fs';
import path from 'node:path';

const roots = ['vanilla'];
const bad = [];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const file of fs.readdirSync(root, { recursive: true })) {
    const full = path.join(root, file);
    if (!/\.(js|html|css)$/.test(full) || !fs.statSync(full).isFile()) continue;
    const source = fs.readFileSync(full, 'utf8');
    if (/style=/.test(source)) bad.push(`${full}: inline style`);
    if (/#[0-9a-fA-F]{3,8}|\brgb\(|\boklch\(/.test(source) && !full.endsWith('/design-system.css')) bad.push(`${full}: color literal`);
  }
}
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
console.log('ds:check ok');
