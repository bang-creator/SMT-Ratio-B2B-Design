import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-11-message-queue--default&viewMode=story';

async function audit() {
  console.log('Auditing Clean Refactored Component #011 Message Queue...');
  const startTime = Date.now();

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 750 } });
  const page = await context.newPage();

  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message, detail = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passCount++;
    } else {
      console.error(`  ✗ ${message} — ${detail}`);
    }
  }

  await page.goto(STORYBOOK_URL);
  await page.waitForSelector('.ds-message-queue');

  // 1. Container & Spacing
  console.log('\n[Phase 1: Accurate Geometry & Spacing Verification]');
  const queue = page.locator('.ds-message-queue');
  const queueBox = await queue.boundingBox();
  assert(queueBox && queueBox.width <= 385 && queueBox.width >= 350, 'Queue max-width is accurately constrained (384px)', `${queueBox?.width}px`);

  // Running Card
  const runningCard = page.locator('.ds-message-queue__running-card');
  const cardRadius = await runningCard.evaluate(el => window.getComputedStyle(el).borderRadius);
  const cardPadding = await runningCard.evaluate(el => window.getComputedStyle(el).padding);
  assert(cardRadius === '16px', 'Running card has 16px border radius (radius-2xl)', cardRadius);
  assert(cardPadding === '12px', 'Running card has 12px padding (space-3)', cardPadding);

  // Status Beacon
  const beacon = page.locator('.ds-message-queue__beacon');
  const beaconBox = await beacon.boundingBox();
  assert(beaconBox && Math.round(beaconBox.width) === 8 && Math.round(beaconBox.height) === 8, 'Status beacon renders at 8x8px', `${beaconBox?.width}x${beaconBox?.height}`);

  // Running Title
  const runningTitle = page.locator('.ds-message-queue__running-title');
  const titleText = await runningTitle.innerText();
  assert(titleText === 'Fix the converter and add a guard', 'Running title renders text', titleText);

  // Header & List Items
  const header = page.locator('.ds-message-queue__header');
  const headerText = await header.innerText();
  assert(headerText.includes('2 queued') && headerText.includes('sends when this finishes'), 'Header displays queue count and timing note', headerText);

  const items = page.locator('.ds-message-queue__item');
  const itemCount = await items.count();
  assert(itemCount === 2, 'Initial queue renders 2 items', `${itemCount}`);

  // Item Spacing
  const firstItemPadding = await items.first().evaluate(el => ({
    paddingTop: window.getComputedStyle(el).paddingTop,
    paddingRight: window.getComputedStyle(el).paddingRight,
    paddingBottom: window.getComputedStyle(el).paddingBottom,
    paddingLeft: window.getComputedStyle(el).paddingLeft,
  }));
  assert(
    firstItemPadding.paddingTop === '8px' &&
    firstItemPadding.paddingRight === '8px' &&
    firstItemPadding.paddingBottom === '8px' &&
    firstItemPadding.paddingLeft === '12px',
    'Item padding accurately matches ground-truth py-2 pr-2 pl-3 (8px 8px 8px 12px)',
    JSON.stringify(firstItemPadding)
  );

  // Shared Cancel Icon Button
  const cancelBtn = page.locator('.ds-message-queue__cancel').first();
  const cancelBtnBox = await cancelBtn.boundingBox();
  const isIconButton = await cancelBtn.evaluate(el => el.classList.contains('ds-icon-button'));
  assert(isIconButton, 'Cancel button composes shared .ds-icon-button class', `${isIconButton}`);
  assert(cancelBtnBox && Math.round(cancelBtnBox.width) === 24 && Math.round(cancelBtnBox.height) === 24, 'Cancel icon button size is 24x24px', `${cancelBtnBox?.width}x${cancelBtnBox?.height}`);

  // 2. Interactive State Transitions
  console.log('\n[Phase 2: Direct Interactive State Transitions]');

  // Click cancel on item 1
  await page.locator('.ds-message-queue__cancel').first().click();
  await page.waitForTimeout(100);

  const afterFirstCancelCount = await page.locator('.ds-message-queue__item').count();
  const afterFirstCancelHeader = await page.locator('.ds-message-queue__header').innerText();
  assert(afterFirstCancelCount === 1, 'Clicking cancel removes item 1 from queue', `count: ${afterFirstCancelCount}`);
  assert(afterFirstCancelHeader.includes('1 queued'), 'Header updates to "1 queued"', afterFirstCancelHeader);

  // Click cancel on item 2 (transitions naturally to empty state)
  await page.locator('.ds-message-queue__cancel').first().click();
  await page.waitForTimeout(100);

  const afterSecondCancelCount = await page.locator('.ds-message-queue__item').count();
  const headerVisible = await page.locator('.ds-message-queue__header').count();
  const resetBtnVisible = await page.locator('.ds-queue-reset-btn').isVisible();
  assert(afterSecondCancelCount === 0, 'Clicking cancel on all items empties queue (Nothing Queued state)', `count: ${afterSecondCancelCount}`);
  assert(headerVisible === 0, 'Header disappears naturally when queue is empty', `header count: ${headerVisible}`);
  assert(resetBtnVisible, 'Reset button appears when queue is empty to allow testing again', `reset visible: ${resetBtnVisible}`);

  // Click reset button to restore
  await page.locator('.ds-queue-reset-btn').click();
  await page.waitForTimeout(100);

  const restoredCount = await page.locator('.ds-message-queue__item').count();
  assert(restoredCount === 2, 'Reset button restores initial queue state', `restored count: ${restoredCount}`);

  // 3. Screenshots in Light & Dark Mode
  console.log('\n[Phase 3: Visual Captures]');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-011-message-queue-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean-011-message-queue-light.png') });

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  console.log(`\nAudit completed in ${elapsed}s: ${passCount}/${totalTests} passed`);

  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

audit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
