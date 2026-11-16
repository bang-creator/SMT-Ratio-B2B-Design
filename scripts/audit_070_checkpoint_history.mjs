import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #070 CHECKPOINT HISTORY ---');
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
  await page.goto(`${BASE_URL}?id=default-application-70-checkpoint-history--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="checkpoint-history"]');

  const container = page.locator('[data-slot="checkpoint-history"]');
  const containerBox = await container.boundingBox();
  const containerStyles = await container.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(containerBox.width <= 385 && containerBox.width >= 380, `Container width is ~384px (got ${containerBox.width}px)`);
  assert(containerStyles.borderRadius === '16px', `Container border radius is 16px (--radius-2xl) (got ${containerStyles.borderRadius})`);
  assert(containerStyles.padding === '12px', `Container padding is 12px (got ${containerStyles.padding})`);

  // Title
  const titleStyles = await page.locator('.ds-checkpoint-history__title').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(titleStyles.fontSize === '13.5px' && (titleStyles.fontWeight === '500' || titleStyles.fontWeight === '600'), `Title is 13.5px/500 (got ${titleStyles.fontSize}/${titleStyles.fontWeight})`);

  // Dot
  const dot = page.locator('.ds-checkpoint-history__dot').first();
  const dotBox = await dot.boundingBox();
  assert(dotBox.width === 6 && dotBox.height === 6, `Dot is 6x6px (got ${dotBox.width}x${dotBox.height})`);

  // Label & Meta
  const labelStyles = await page.locator('.ds-checkpoint-history__label').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(labelStyles.fontSize === '13px' && labelStyles.fontWeight === '400', `Label typography is 13px/400 (got ${labelStyles.fontSize}/${labelStyles.fontWeight})`);

  const metaStyles = await page.locator('.ds-checkpoint-history__meta').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(metaStyles.fontSize === '11px' && metaStyles.fontWeight === '400', `Meta typography is 11px/400 mono (got ${metaStyles.fontSize}/${metaStyles.fontWeight})`);

  // Restore button
  const restoreBtn = page.locator('.ds-checkpoint-history__restore-btn').first();
  const restoreBtnStyles = await restoreBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      height: s.height,
      borderRadius: s.borderRadius,
      opacity: s.opacity,
    };
  });
  assert(restoreBtnStyles.height === '24px', `Restore button height is 24px (got ${restoreBtnStyles.height})`);
  assert(parseInt(restoreBtnStyles.borderRadius) >= 12, `Restore button is full pill radius (got ${restoreBtnStyles.borderRadius})`);
  assert(restoreBtnStyles.opacity === '0', `Restore button is hidden at rest (opacity 0) (got ${restoreBtnStyles.opacity})`);

  // Hover item reveals restore button
  await page.locator('.ds-checkpoint-history__item:not(.ds-checkpoint-history__item--current)').first().hover();
  await page.waitForTimeout(200);
  const hoverOpacity = await restoreBtn.evaluate((el) => window.getComputedStyle(el).opacity);
  assert(hoverOpacity === '1', `Restore button becomes visible on item hover (opacity 1) (got ${hoverOpacity})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'checkpoint-history-default-dark.png') });

  // 2. At Middle Checkpoint State (Tests ahead state)
  await page.goto(`${BASE_URL}?id=default-application-70-checkpoint-history--at-middle-checkpoint&globals=theme:dark`);
  await page.waitForSelector('[data-slot="checkpoint-history"]');

  const aheadItemOpacity = await page.locator('[data-ahead="true"]').evaluate((el) => window.getComputedStyle(el).opacity);
  assert(parseFloat(aheadItemOpacity) <= 0.45 && parseFloat(aheadItemOpacity) >= 0.35, `Ahead item opacity is ~0.40 (got ${aheadItemOpacity})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'checkpoint-history-middle-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-70-checkpoint-history--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-checkpoint-history-interactive-wrapper');

  // Hover over oldest item (cp-1) and click restore
  await page.locator('[data-id="cp-1"]').hover();
  await page.locator('[data-btn-restore="cp-1"]').click();

  // Verify cp-1 is now current
  const isCp1Current = await page.locator('[data-id="cp-1"][data-current="true"]').count();
  assert(isCp1Current === 1, `Clicking Restore on cp-1 makes it current`);

  // Verify cp-3 is now ahead
  const isCp3Ahead = await page.locator('[data-id="cp-3"][data-ahead="true"]').count();
  assert(isCp3Ahead === 1, `Previous latest item cp-3 is now ahead`);

  // Click Jump to Latest
  await page.click('[data-btn-reset]');
  const isCp3CurrentAgain = await page.locator('[data-id="cp-3"][data-current="true"]').count();
  assert(isCp3CurrentAgain === 1, `Jump to Latest resets cp-3 to current`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'checkpoint-history-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-70-checkpoint-history--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="checkpoint-history"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'checkpoint-history-default-light.png') });

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
