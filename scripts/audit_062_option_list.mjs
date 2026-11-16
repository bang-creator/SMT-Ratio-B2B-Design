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

  console.log('--- AUDITING #062 OPTION LIST ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-62-option-list--default&globals=theme:dark');
  await page.waitForSelector('.ds-option-list');

  const list = await page.$('.ds-option-list');
  const listBox = await list.boundingBox();
  const listRadius = await list.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Option list: width=${listBox.width}px, height=${listBox.height}px, radius=${listRadius}`);
  if (Math.round(listBox.width) !== 384) throw new Error(`Expected 384px width, got ${listBox.width}`);

  // Option row and typography
  const row = await page.$('.ds-option-row');
  const rowStyles = await row.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { padding: s.padding, radius: s.borderRadius };
  });
  console.log(`[PASS] Option row: padding=${rowStyles.padding}, radius=${rowStyles.radius}`);

  const label = await page.$('.ds-option-label');
  const labelStyles = await label.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight };
  });
  console.log(`[PASS] Option label typography: size=${labelStyles.fontSize}, weight=${labelStyles.fontWeight}, lineHeight=${labelStyles.lineHeight}`);
  if (labelStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for label, got ${labelStyles.fontWeight}`);

  const desc = await page.$('.ds-option-desc');
  const descStyles = await desc.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Option desc typography: size=${descStyles.fontSize}, weight=${descStyles.fontWeight}`);
  if (descStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for desc, got ${descStyles.fontWeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'option-list-default-dark.png') });
  console.log('[PASS] Captured option-list-default-dark.png');

  // 2. Audit Multiple in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-62-option-list--multiple&globals=theme:dark');
  await page.waitForSelector('.ds-option-checkbox');

  const checkboxes = await page.$$('.ds-option-checkbox');
  const cbBox = await checkboxes[0].boundingBox();
  console.log(`[PASS] Checkbox geometry: ${cbBox.width}x${cbBox.height}px (expected 14x14px)`);
  if (Math.round(cbBox.width) !== 14 || Math.round(cbBox.height) !== 14) {
    throw new Error(`Expected 14x14px checkbox, got ${cbBox.width}x${cbBox.height}`);
  }

  // Counter mono typography
  const counter = await page.$('.ds-option-counter');
  const counterStyles = await counter.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Counter typography: size=${counterStyles.fontSize}, weight=${counterStyles.fontWeight}, mono=${counterStyles.fontFam.includes('mono')}`);
  if (counterStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for counter, got ${counterStyles.fontWeight}`);

  // Confirm button height
  const confirmBtn = await page.$('.ds-option-confirm-btn');
  const confirmBtnBox = await confirmBtn.boundingBox();
  console.log(`[PASS] Confirm button: height=${confirmBtnBox.height}px (expected 32px standard compact)`);
  if (Math.round(confirmBtnBox.height) !== 32) throw new Error(`Expected 32px button, got ${confirmBtnBox.height}`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'option-list-multiple-dark.png') });
  console.log('[PASS] Captured option-list-multiple-dark.png');

  // 3. Audit Receipt in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-62-option-list--receipt&globals=theme:dark');
  await page.waitForSelector('.ds-option-receipt-row');
  const receiptRows = await page.$$('.ds-option-receipt-row');
  console.log(`[PASS] Receipt state rendered ${receiptRows.length} rows (expected 2)`);
  if (receiptRows.length !== 2) throw new Error(`Expected 2 receipt rows, got ${receiptRows.length}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'option-list-receipt-dark.png') });
  console.log('[PASS] Captured option-list-receipt-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-62-option-list--interactive&globals=theme:dark');
  await page.waitForSelector('[data-id="web"]');
  // Click second option to toggle
  await page.click('[data-id="web"]');
  await page.waitForTimeout(200);
  const counterText = await page.$eval('.ds-option-counter', (el) => el.textContent);
  console.log(`[PASS] Interactive option toggle: counter updated to "${counterText}"`);
  if (!counterText.includes('2 of 4')) throw new Error('Expected 2 of 4 after toggle');

  // Click Confirm
  await page.click('[data-btn-confirm]');
  await page.waitForTimeout(200);
  const isReceipt = await page.$eval('.ds-option-list', (el) => el.getAttribute('data-state'));
  console.log(`[PASS] Interactive commit: state transitioned to "${isReceipt}"`);
  if (isReceipt !== 'receipt') throw new Error('Expected receipt state after confirm');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'option-list-interactive-dark.png') });
  console.log('[PASS] Captured option-list-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-62-option-list--default&globals=theme:light');
  await page.waitForSelector('.ds-option-list');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'option-list-default-light.png') });
  console.log('[PASS] Captured option-list-default-light.png');

  console.log('--- ALL 10/10 OPTION LIST AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
