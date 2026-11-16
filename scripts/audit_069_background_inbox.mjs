import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #069 BACKGROUND INBOX ---');
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
  await page.goto(`${BASE_URL}?id=default-application-69-background-inbox--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="background-inbox"]');

  const container = page.locator('[data-slot="background-inbox"]');
  const containerBox = await container.boundingBox();
  const containerStyles = await container.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
      backgroundColor: s.backgroundColor,
      borderColor: s.borderColor,
    };
  });

  assert(containerBox.width <= 385 && containerBox.width >= 380, `Container width is ~384px (got ${containerBox.width}px)`);
  assert(containerStyles.borderRadius === '16px', `Container border radius is 16px (--radius-2xl) (got ${containerStyles.borderRadius})`);
  assert(containerStyles.padding === '12px', `Container padding is 12px (got ${containerStyles.padding})`);

  // Header Title and Counter
  const titleStyles = await page.locator('.ds-background-inbox__title').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(titleStyles.fontSize === '13.5px' && (titleStyles.fontWeight === '500' || titleStyles.fontWeight === '600'), `Header title is 13.5px/500 (got ${titleStyles.fontSize}/${titleStyles.fontWeight})`);

  const counterStyles = await page.locator('.ds-background-inbox__counter').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(counterStyles.fontSize === '11px' && counterStyles.fontWeight === '400', `Header counter is 11px/400 mono (got ${counterStyles.fontSize}/${counterStyles.fontWeight})`);

  // Item Row
  const item = page.locator('.ds-background-inbox__item').first();
  const itemStyles = await item.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });
  assert(itemStyles.borderRadius === '12px', `Item border radius is 12px (got ${itemStyles.borderRadius})`);

  // Item Title and Summary
  const itemTitleStyles = await page.locator('.ds-background-inbox__item-title').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(itemTitleStyles.fontSize === '13px' && itemTitleStyles.fontWeight === '400', `Item title is 13px/400 (got ${itemTitleStyles.fontSize}/${itemTitleStyles.fontWeight})`);

  const itemSummaryStyles = await page.locator('.ds-background-inbox__item-summary').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(itemSummaryStyles.fontSize === '11px' && itemSummaryStyles.fontWeight === '400', `Item summary is 11px/400 mono (got ${itemSummaryStyles.fontSize}/${itemSummaryStyles.fontWeight})`);

  const elapsedStyles = await page.locator('.ds-background-inbox__elapsed').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(elapsedStyles.fontSize === '11px' && elapsedStyles.fontWeight === '400', `Elapsed time is 11px/400 mono (got ${elapsedStyles.fontSize}/${elapsedStyles.fontWeight})`);

  // Running item disabled
  const runningItemDisabled = await page.locator('[data-state="running"]').isDisabled();
  assert(runningItemDisabled === true, `Running state item is disabled from click collection`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'background-inbox-default-dark.png') });

  // 2. All Running State
  await page.goto(`${BASE_URL}?id=default-application-69-background-inbox--all-running&globals=theme:dark`);
  await page.waitForSelector('[data-slot="background-inbox"]');

  const inFlightText = await page.locator('.ds-background-inbox__counter').innerText();
  assert(inFlightText.includes('in flight'), `Counter displays 'in flight' when 0 ready (got "${inFlightText}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'background-inbox-allrunning-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-69-background-inbox--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-background-inbox-interactive-wrapper');

  const initialItemsCount = await page.locator('[data-slot="inbox-item"]').count();
  assert(initialItemsCount === 3, `Interactive starts with 3 items`);

  // Click first ready item to collect
  await page.locator('[data-slot="inbox-item"]:not(:disabled)').first().click();
  const countAfterCollect = await page.locator('[data-slot="inbox-item"]').count();
  assert(countAfterCollect === 2, `Item collected and removed (got ${countAfterCollect} items)`);

  const collectedText = await page.locator('.ds-background-inbox-interactive-toolbar span').innerText();
  assert(collectedText.includes('Collected items: 1'), `Toolbar tracks collected items (got "${collectedText}")`);

  // Click Reset
  await page.click('[data-btn-reset]');
  const countAfterReset = await page.locator('[data-slot="inbox-item"]').count();
  assert(countAfterReset === 3, `Reset button restores items to initial list`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'background-inbox-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-69-background-inbox--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="background-inbox"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'background-inbox-default-light.png') });

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
