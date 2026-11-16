import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function run() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('--- AUDITING #063 QUESTION FLOW ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-63-question-flow--default&globals=theme:dark');
  await page.waitForSelector('.ds-question-flow');

  const card = await page.$('.ds-question-flow');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Question flow card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Counter mono typography
  const counter = await page.$('.ds-question-flow__counter');
  const counterStyles = await counter.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Counter typography: size=${counterStyles.fontSize}, weight=${counterStyles.fontWeight}, mono=${counterStyles.fontFam.includes('mono')}`);
  if (counterStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for counter, got ${counterStyles.fontWeight}`);

  // Back button disabled on step 1
  const backBtn = await page.$('.ds-question-flow__back-btn');
  const isBackDisabled = await backBtn.evaluate((el) => el.disabled);
  console.log(`[PASS] Back button disabled on step 1: ${isBackDisabled}`);
  if (!isBackDisabled) throw new Error('Expected Back button to be disabled on step 1');

  // Progress track
  const track = await page.$('.ds-question-flow__track');
  const trackHeight = await track.evaluate((el) => window.getComputedStyle(el).height);
  console.log(`[PASS] Track height: ${trackHeight} (expected 3px)`);
  if (trackHeight !== '3px') throw new Error(`Expected 3px track height, got ${trackHeight}`);

  // Title and description typography
  const title = await page.$('.ds-question-flow__title');
  const titleWeight = await title.evaluate((el) => window.getComputedStyle(el).fontWeight);
  const desc = await page.$('.ds-question-flow__description');
  const descWeight = await desc.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Title weight: ${titleWeight} (expected 500), Desc weight: ${descWeight} (expected 400)`);
  if (titleWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleWeight}`);
  if (descWeight !== '400') throw new Error(`Expected weight 400 for description, got ${descWeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question-flow-default-dark.png') });
  console.log('[PASS] Captured question-flow-default-dark.png');

  // 2. Audit StepTwo in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-63-question-flow--step-two&globals=theme:dark');
  await page.waitForSelector('.ds-question-flow__back-btn:not([disabled])');
  console.log('[PASS] Back button enabled on StepTwo');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question-flow-steptwo-dark.png') });
  console.log('[PASS] Captured question-flow-steptwo-dark.png');

  // 3. Audit Receipt in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-63-question-flow--receipt&globals=theme:dark');
  await page.waitForSelector('.ds-question-flow__receipt-item');
  const receiptItems = await page.$$('.ds-question-flow__receipt-item');
  console.log(`[PASS] Receipt state rendered ${receiptItems.length} items (expected 3)`);
  if (receiptItems.length !== 3) throw new Error(`Expected 3 receipt items, got ${receiptItems.length}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question-flow-receipt-dark.png') });
  console.log('[PASS] Captured question-flow-receipt-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-63-question-flow--interactive&globals=theme:dark');
  await page.waitForSelector('[data-id="edge"]');
  // Click first option to advance to step 2
  await page.click('[data-id="edge"]');
  await page.waitForTimeout(200);
  const counterStep2 = await page.$eval('.ds-question-flow__counter', (el) => el.textContent);
  console.log(`[PASS] Advanced to step 2: counter="${counterStep2}"`);
  if (!counterStep2.includes('2 of 3')) throw new Error('Expected 2 of 3 after click');

  // Click Back button
  await page.click('[data-btn-back]');
  await page.waitForTimeout(200);
  const counterBack = await page.$eval('.ds-question-flow__counter', (el) => el.textContent);
  console.log(`[PASS] Clicked back: counter="${counterBack}"`);
  if (!counterBack.includes('1 of 3')) throw new Error('Expected 1 of 3 after back click');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question-flow-interactive-dark.png') });
  console.log('[PASS] Captured question-flow-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-63-question-flow--default&globals=theme:light');
  await page.waitForSelector('.ds-question-flow');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'question-flow-default-light.png') });
  console.log('[PASS] Captured question-flow-default-light.png');

  console.log('--- ALL 10/10 QUESTION FLOW AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
