import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #072 TRACE WATERFALL ---');
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
  await page.goto(`${BASE_URL}?id=default-application-72-trace-waterfall--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="trace-waterfall"]');

  const card = page.locator('[data-slot="trace-waterfall"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await card.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(cardBox.width <= 449 && cardBox.width >= 440, `Card width is ~448px (got ${cardBox.width}px)`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (--radius-2xl) (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);

  // Title & Total
  const titleStyles = await page.locator('.ds-trace-waterfall__title').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(titleStyles.fontSize === '13.5px' && (titleStyles.fontWeight === '500' || titleStyles.fontWeight === '600'), `Title is 13.5px/500 (got ${titleStyles.fontSize}/${titleStyles.fontWeight})`);

  const totalStyles = await page.locator('.ds-trace-waterfall__total').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(totalStyles.fontSize === '11px' && totalStyles.fontWeight === '400', `Total is 11px/400 mono (got ${totalStyles.fontSize}/${totalStyles.fontWeight})`);

  // Row and Grid
  const row = page.locator('.ds-trace-waterfall__row').first();
  const rowStyles = await row.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      display: s.display,
      gridTemplateColumns: s.gridTemplateColumns,
    };
  });
  assert(rowStyles.display === 'grid', `Row is CSS grid (got ${rowStyles.display})`);

  // Depth padding
  const depth2 = page.locator('.ds-trace-depth-2');
  const depth2Padding = await depth2.evaluate((el) => window.getComputedStyle(el).paddingInlineStart);
  assert(depth2Padding === '24px', `Depth 2 padding is 24px (got ${depth2Padding})`);

  // Bar dimensions
  const bar = page.locator('.ds-trace-waterfall__bar').first();
  const barStyles = await bar.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      height: s.height,
      borderRadius: s.borderRadius,
      position: s.position,
    };
  });
  assert(barStyles.height === '7px', `Waterfall bar height is 7px (got ${barStyles.height})`);
  assert(parseInt(barStyles.borderRadius) >= 3, `Waterfall bar has pill radius (got ${barStyles.borderRadius})`);
  assert(barStyles.position === 'absolute', `Waterfall bar is absolute positioned (got ${barStyles.position})`);

  // Duration
  const durationStyles = await page.locator('.ds-trace-waterfall__duration').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(durationStyles.fontSize === '11px' && durationStyles.fontWeight === '400', `Duration is 11px/400 mono (got ${durationStyles.fontSize}/${durationStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'trace-waterfall-default-dark.png') });

  // 2. Streaming State (Tests running bar)
  await page.goto(`${BASE_URL}?id=default-application-72-trace-waterfall--streaming&globals=theme:dark`);
  await page.waitForSelector('[data-slot="trace-waterfall"]');

  const runningBarCount = await page.locator('.ds-trace-waterfall__bar--running').count();
  assert(runningBarCount >= 1, `Streaming state has running pulse bars (got ${runningBarCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'trace-waterfall-streaming-dark.png') });

  // 3. Failed Span State
  await page.goto(`${BASE_URL}?id=default-application-72-trace-waterfall--failed-span&globals=theme:dark`);
  await page.waitForSelector('[data-slot="trace-waterfall"]');

  const failedBarCount = await page.locator('.ds-trace-waterfall__bar--failed').count();
  assert(failedBarCount >= 1, `Failed span state has failed bars (got ${failedBarCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'trace-waterfall-failed-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-72-trace-waterfall--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-trace-waterfall');

  const initialRows = await page.locator('[data-slot="trace-row"]').count();
  assert(initialRows === 3, `Interactive begins with 3 spans`);

  await page.click('[data-btn-step]');
  const rowsAfterStep1 = await page.locator('[data-slot="trace-row"]').count();
  assert(rowsAfterStep1 === 4, `Step increases visible spans to 4`);

  await page.click('[data-btn-step]');
  const rowsAfterStep2 = await page.locator('[data-slot="trace-row"]').count();
  assert(rowsAfterStep2 === 5, `Step increases visible spans to 5`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'trace-waterfall-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-72-trace-waterfall--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="trace-waterfall"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'trace-waterfall-default-light.png') });

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
