import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const [, , referencePath, actualPath, xArg, yArg, widthArg, heightArg, diffPath = 'reports/fidelity/fixture-diff.png'] = process.argv;
if (!referencePath || !actualPath || [xArg, yArg, widthArg, heightArg].some(value => value === undefined)) {
  console.error('Usage: node scripts/visual_fixture_diff.mjs <reference.png> <actual.png> <x> <y> <width> <height> [diff.png]');
  process.exit(2);
}

const reference = PNG.sync.read(fs.readFileSync(referencePath));
const actual = PNG.sync.read(fs.readFileSync(actualPath));
const x = Number(xArg);
const y = Number(yArg);
const width = Number(widthArg);
const height = Number(heightArg);
if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width <= 0 || height <= 0) {
  console.error('Fixture crop must use non-negative integer coordinates and positive dimensions.');
  process.exit(2);
}
if (reference.width !== actual.width || reference.height !== actual.height || x + width > reference.width || y + height > reference.height) {
  console.error(`Invalid fixture crop: reference=${reference.width}x${reference.height} actual=${actual.width}x${actual.height}`);
  process.exit(1);
}

const referenceCrop = new PNG({ width, height });
const actualCrop = new PNG({ width, height });
PNG.bitblt(reference, referenceCrop, x, y, width, height, 0, 0);
PNG.bitblt(actual, actualCrop, x, y, width, height, 0, 0);
const diff = new PNG({ width, height });
const changedPixels = pixelmatch(referenceCrop.data, actualCrop.data, diff.data, width, height, { threshold: 0.1, includeAA: false });
fs.mkdirSync(path.dirname(diffPath), { recursive: true });
fs.writeFileSync(diffPath, PNG.sync.write(diff));
const changedRatio = changedPixels / (width * height);
console.log(JSON.stringify({ reference: referencePath, actual: actualPath, diff: diffPath, crop: { x, y, width, height }, changedPixels, changedRatio, pass: changedRatio <= 0.02 }, null, 2));
process.exit(changedRatio <= 0.02 ? 0 : 1);
