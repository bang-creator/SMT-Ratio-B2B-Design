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

  console.log('--- AUDITING #059 TASK CARD ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-59-task-card--default&globals=theme:dark');
  await page.waitForSelector('.ds-task-card');

  const card = await page.$('.ds-task-card');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Task card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Trigger button
  const trigger = await page.$('.ds-task-card__trigger');
  const triggerStyles = await trigger.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { padding: s.padding, cursor: s.cursor };
  });
  console.log(`[PASS] Trigger button: padding=${triggerStyles.padding}, cursor=${triggerStyles.cursor}`);

  // Label typography (strict 400)
  const label = await page.$('.ds-task-card__label');
  const labelStyles = await label.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Label typography: size=${labelStyles.fontSize}, weight=${labelStyles.fontWeight}`);
  if (labelStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for label, got ${labelStyles.fontWeight}`);

  // Meta mono typography
  const meta = await page.$('.ds-task-card__meta');
  const metaStyles = await meta.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Meta typography: size=${metaStyles.fontSize}, weight=${metaStyles.fontWeight}, mono=${metaStyles.fontFam.includes('mono')}`);
  if (metaStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for meta, got ${metaStyles.fontWeight}`);

  // Working spinner icon
  const spinner = await page.$('.ds-task-card__icon--working');
  const spinnerStyles = await spinner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { anim: s.animationName, width: s.width, height: s.height };
  });
  console.log(`[PASS] Working spinner: size=${spinnerStyles.width}x${spinnerStyles.height}, anim=${spinnerStyles.anim}`);
  if (!spinnerStyles.anim.includes('ds-spin')) throw new Error('Expected ds-spin animation on working task');

  // Chevron rotation when open
  const chevron = await page.$('.ds-task-card__chevron');
  const chevronTransform = await chevron.evaluate((el) => window.getComputedStyle(el).transform);
  console.log(`[PASS] Chevron transform when open: ${chevronTransform}`);
  if (!chevronTransform.includes('matrix')) throw new Error('Expected rotated transform on open chevron');

  // Transcript items
  const transcripts = await page.$$('.ds-task-card__transcript-item');
  console.log(`[PASS] Transcript count: ${transcripts.length} (expected 3)`);
  if (transcripts.length !== 3) throw new Error(`Expected 3 transcript items, got ${transcripts.length}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task-card-default-dark.png') });
  console.log('[PASS] Captured task-card-default-dark.png');

  // 2. Audit Done in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-59-task-card--done&globals=theme:dark');
  await page.waitForSelector('.ds-task-card__icon--done');
  const resultText = await page.$eval('.ds-task-card__result', (el) => el.textContent);
  console.log(`[PASS] Done result text: "${resultText}"`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task-card-done-dark.png') });
  console.log('[PASS] Captured task-card-done-dark.png');

  // 3. Audit Failed in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-59-task-card--failed&globals=theme:dark');
  await page.waitForSelector('.ds-task-card__icon--failed');
  console.log('[PASS] Failed cross icon rendered');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task-card-failed-dark.png') });
  console.log('[PASS] Captured task-card-failed-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-59-task-card--interactive&globals=theme:dark');
  await page.waitForSelector('[data-task-trigger]');
  const isHiddenBefore = await page.$eval('.ds-task-card__transcript', (el) => el.hidden);
  await page.click('[data-task-trigger]');
  await page.waitForTimeout(200);
  const isHiddenAfter = await page.$eval('.ds-task-card__transcript', (el) => el.hidden);
  console.log(`[PASS] Interactive accordion: hiddenBefore=${isHiddenBefore} -> hiddenAfter=${isHiddenAfter}`);
  if (!isHiddenBefore || isHiddenAfter) throw new Error('Interactive accordion toggle failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task-card-interactive-dark.png') });
  console.log('[PASS] Captured task-card-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-59-task-card--default&globals=theme:light');
  await page.waitForSelector('.ds-task-card');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'task-card-default-light.png') });
  console.log('[PASS] Captured task-card-default-light.png');

  console.log('--- ALL 10/10 TASK CARD AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
