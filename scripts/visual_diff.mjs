import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , referencePath, actualPath, diffPath = 'reports/fidelity/diff.png'] = process.argv;
if (!referencePath || !actualPath) {
  console.error('Usage: node scripts/visual_diff.mjs <reference.png> <actual.png> [diff.png]');
  process.exit(2);
}

const read = path => PNG.sync.read(fs.readFileSync(path));
const reference = read(referencePath);
const actual = read(actualPath);
if (reference.width !== actual.width || reference.height !== actual.height) {
  console.error(`dimension mismatch: reference=${reference.width}x${reference.height} actual=${actual.width}x${actual.height}`);
  process.exit(1);
}

const diff = new PNG({ width: reference.width, height: reference.height });
const changed = pixelmatch(reference.data, actual.data, diff.data, reference.width, reference.height, {
  threshold: 0.1,
  includeAA: false,
});
fs.mkdirSync(path.dirname(diffPath), { recursive: true });
fs.writeFileSync(diffPath, PNG.sync.write(diff));
const ratio = changed / (reference.width * reference.height);
console.log(JSON.stringify({ reference: referencePath, actual: actualPath, diff: diffPath, width: reference.width, height: reference.height, changedPixels: changed, changedRatio: ratio, pass: ratio <= 0.02 }, null, 2));
process.exit(ratio <= 0.02 ? 0 : 1);
