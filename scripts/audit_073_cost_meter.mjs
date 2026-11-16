import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #073 COST METER ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 800 });

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // 1. Default Dark State
  await page.goto(`${BASE_URL}?id=default-application-73-cost-meter--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="cost-meter"]');

  const card = page.locator('[data-slot="cost-meter"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await card.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(cardBox.width <= 385 && cardBox.width >= 380, `Card width is ~384px (got ${cardBox.width}px)`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (--radius-2xl) (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);

  // Run Cost & Labels
  const runCostStyles = await page.locator('.ds-cost-meter__run-cost').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(runCostStyles.fontSize === '24px' && (runCostStyles.fontWeight === '500' || runCostStyles.fontWeight === '600'), `Run cost is 24px/500 (got ${runCostStyles.fontSize}/${runCostStyles.fontWeight})`);

  const labelStyles = await page.locator('.ds-cost-meter__label').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(labelStyles.fontSize === '11px' && labelStyles.fontWeight === '400', `Label is 11px/400 mono (got ${labelStyles.fontSize}/${labelStyles.fontWeight})`);

  const sessionStyles = await page.locator('.ds-cost-meter__session-cost').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(sessionStyles.fontSize === '11px' && sessionStyles.fontWeight === '400', `Session cost is 11px/400 mono (got ${sessionStyles.fontSize}/${sessionStyles.fontWeight})`);

  // Track & Segments
  const track = page.locator('.ds-cost-meter__track');
  const trackStyles = await track.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, borderRadius: s.borderRadius };
  });
  assert(trackStyles.height === '6px', `Track height is 6px (got ${trackStyles.height})`);

  const segmentCount = await page.locator('[data-slot="cost-segment"]').count();
  assert(segmentCount === 2, `Default has 2 meter segments (got ${segmentCount})`);

  // Breakdown lines
  const modelStyles = await page.locator('.ds-cost-meter__model').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(modelStyles.fontSize === '13px' && modelStyles.fontWeight === '400', `Model name is 13px/400 (got ${modelStyles.fontSize}/${modelStyles.fontWeight})`);

  const tokensStyles = await page.locator('.ds-cost-meter__tokens').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(tokensStyles.fontSize === '11px' && tokensStyles.fontWeight === '400', `Token telemetry is 11px/400 mono (got ${tokensStyles.fontSize}/${tokensStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cost-meter-default-dark.png') });

  // 2. MultiModel State
  await page.goto(`${BASE_URL}?id=default-application-73-cost-meter--multi-model&globals=theme:dark`);
  await page.waitForSelector('[data-slot="cost-meter"]');

  const multiSegments = await page.locator('[data-slot="cost-segment"]').count();
  assert(multiSegments === 3, `MultiModel state has 3 segments (got ${multiSegments})`);

  const multiLines = await page.locator('[data-slot="cost-line"]').count();
  assert(multiLines === 3, `MultiModel state has 3 model lines (got ${multiLines})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cost-meter-multimodel-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-73-cost-meter--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-cost-meter');

  const initialCost = await page.locator('.ds-cost-meter__run-cost').innerText();
  assert(initialCost === '$0.042', `Interactive begins with $0.042`);

  await page.click('[data-btn-step]');
  const updatedCost = await page.locator('.ds-cost-meter__run-cost').innerText();
  assert(updatedCost === '$0.089', `Clicking Toggle Step updates run cost to $0.089`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cost-meter-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-73-cost-meter--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="cost-meter"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cost-meter-default-light.png') });

  console.log(`\nRESULT: ${passed}/${total} assertions passed.`);
  await browser.close();

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
