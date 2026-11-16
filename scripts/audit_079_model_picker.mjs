import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #079 COMPOSER MODEL PICKER ---');
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

  // 1. Default Open Dark State
  await page.goto(`${BASE_URL}?id=default-application-79-models--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  // Trigger metrics
  const trigger = page.locator('[data-slot="composer-model-trigger"]');
  const triggerBox = await trigger.boundingBox();
  const triggerStyles = await trigger.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      height: s.height,
    };
  });

  assert(Math.round(triggerBox.height) === 32, `Trigger height is 32px (got ${Math.round(triggerBox.height)}px)`);
  assert(parseInt(triggerStyles.borderRadius, 10) >= 16, `Trigger radius is full pill (got ${triggerStyles.borderRadius})`);
  assert(triggerStyles.fontSize === '12.5px' && triggerStyles.fontWeight === '400', `Trigger typography is 12.5px/400 (got ${triggerStyles.fontSize}/${triggerStyles.fontWeight})`);

  // Menu metrics
  const menu = page.locator('[data-slot="composer-menu"]');
  const menuBox = await menu.boundingBox();
  assert(menuBox.width === 288, `Menu width is 288px (got ${menuBox.width}px)`);

  const itemsCount = await page.locator('[data-slot="composer-model-item"]').count();
  assert(itemsCount === 3, `Default shows 3 models (got ${itemsCount})`);

  // Selected item checkmark
  const activeItem = page.locator('[data-slot="composer-model-item"][data-active="true"]');
  const checkCount = await activeItem.locator('.ds-composer-model-check svg').count();
  assert(checkCount === 1, `Selected model item has checkmark icon`);

  // Typography
  const nameStyles = await page.locator('.ds-composer-model-name').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13.5px' && nameStyles.fontWeight === '400', `Model name is 13.5px/400 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  const metaStyles = await page.locator('.ds-composer-model-meta').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(metaStyles.fontSize === '11px' && metaStyles.fontWeight === '400', `Model meta is 11px/400 (got ${metaStyles.fontSize}/${metaStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-model-picker-default-dark.png') });

  // 2. Closed State
  await page.goto(`${BASE_URL}?id=default-application-79-models--closed&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-model-trigger"]');

  const closedMenuCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(closedMenuCount === 0, `Closed state hides the menu (got ${closedMenuCount})`);

  const closedExpanded = await page.locator('[data-slot="composer-model-trigger"]').getAttribute('aria-expanded');
  assert(closedExpanded === 'false', `Closed trigger has aria-expanded="false" (got ${closedExpanded})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-model-picker-closed-dark.png') });

  // 3. Long Content State
  await page.goto(`${BASE_URL}?id=default-application-79-models--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  const longItemsCount = await page.locator('[data-slot="composer-model-item"]').count();
  assert(longItemsCount === 5, `Long content renders 5 models (got ${longItemsCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-model-picker-longcontent-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-79-models--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-model-trigger"]');

  // Initially closed
  assert(await page.locator('[data-slot="composer-menu"]').count() === 0, `Interactive starts with closed menu`);

  // Click trigger to open
  await page.click('[data-slot="composer-model-trigger"]');
  assert(await page.locator('[data-slot="composer-menu"]').count() === 1, `Clicking trigger opens menu`);

  // Click 'Opus 5'
  await page.locator('[data-slot="composer-model-item"][data-model="Opus 5"]').click();

  // Menu should close
  assert(await page.locator('[data-slot="composer-menu"]').count() === 0, `Selecting model closes menu`);

  // Trigger should display 'Opus 5'
  const updatedTriggerText = await page.locator('.ds-composer-model-trigger-label').textContent();
  assert(updatedTriggerText === 'Opus 5', `Trigger label updated to 'Opus 5' (got "${updatedTriggerText}")`);

  // Reset
  await page.click('[data-btn-reset]');
  const resetTriggerText = await page.locator('.ds-composer-model-trigger-label').textContent();
  assert(resetTriggerText === 'Fable 5', `Reset restores trigger to 'Fable 5' (got "${resetTriggerText}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-model-picker-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-79-models--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-menu"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-model-picker-default-light.png') });

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
