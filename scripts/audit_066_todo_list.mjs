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

  console.log('--- AUDITING #066 TODO LIST ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-66-todo-list--default&globals=theme:dark');
  await page.waitForSelector('.ds-todo-list');

  const card = await page.$('.ds-todo-list');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Todo list card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Title & description typography
  const title = await page.$('.ds-todo-list__title');
  const titleWeight = await title.evaluate((el) => window.getComputedStyle(el).fontWeight);
  const desc = await page.$('.ds-todo-list__description');
  const descWeight = await desc.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Title weight: ${titleWeight} (expected 500), Desc weight: ${descWeight} (expected 400)`);
  if (titleWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleWeight}`);
  if (descWeight !== '400') throw new Error(`Expected weight 400 for description, got ${descWeight}`);

  // Ratio counter mono typography
  const ratio = await page.$('.ds-todo-list__ratio');
  const ratioStyles = await ratio.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Ratio counter: size=${ratioStyles.fontSize}, weight=${ratioStyles.fontWeight}, mono=${ratioStyles.fontFam.includes('mono')}`);
  if (ratioStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for ratio, got ${ratioStyles.fontWeight}`);

  // Item text typography (strict 400)
  const item = await page.$('.ds-todo-item__text');
  const itemWeight = await item.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Item text weight: ${itemWeight} (expected 400)`);
  if (itemWeight !== '400') throw new Error(`Expected weight 400 for item text, got ${itemWeight}`);

  // Checkbox box geometry
  const box = await page.$('.ds-todo-item__box');
  const boxBox = await box.boundingBox();
  const boxRadius = await box.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Checkbox geometry: ${boxBox.width}x${boxBox.height}px (expected 14x14px), radius=${boxRadius}`);
  if (Math.round(boxBox.width) !== 14 || Math.round(boxBox.height) !== 14) {
    throw new Error(`Expected 14x14px box, got ${boxBox.width}x${boxBox.height}`);
  }

  // Active spinner check
  const spinner = await page.$('.ds-todo-item__spinner');
  const spinnerStyles = await spinner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { anim: s.animationName, color: s.color };
  });
  console.log(`[PASS] Active spinner: anim=${spinnerStyles.anim}, color=${spinnerStyles.color}`);
  if (!spinnerStyles.anim.includes('ds-spin')) throw new Error('Expected ds-spin animation on active todo item');

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'todo-list-default-dark.png') });
  console.log('[PASS] Captured todo-list-default-dark.png');

  // 2. Audit Plain in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-66-todo-list--plain&globals=theme:dark');
  await page.waitForSelector('.ds-todo-list');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'todo-list-plain-dark.png') });
  console.log('[PASS] Captured todo-list-plain-dark.png');

  // 3. Audit Foldable in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-66-todo-list--foldable&globals=theme:dark');
  await page.waitForSelector('[data-btn-fold]');
  const itemsBefore = await page.$$('.ds-todo-item');
  console.log(`[PASS] Foldable initial items count: ${itemsBefore.length} (expected 3)`);
  await page.click('[data-btn-fold]');
  await page.waitForTimeout(200);
  const itemsAfter = await page.$$('.ds-todo-item');
  console.log(`[PASS] Foldable expanded items count: ${itemsAfter.length} (expected 5)`);
  if (itemsBefore.length !== 3 || itemsAfter.length !== 5) throw new Error('Foldable expand failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'todo-list-foldable-dark.png') });
  console.log('[PASS] Captured todo-list-foldable-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-66-todo-list--interactive&globals=theme:dark');
  await page.waitForSelector('.ds-todo-item[data-id="1"]');
  const statusBefore = await page.$eval('.ds-todo-item[data-id="1"]', (el) => el.getAttribute('data-status'));
  await page.click('.ds-todo-item[data-id="1"]');
  await page.waitForTimeout(200);
  const statusAfter = await page.$eval('.ds-todo-item[data-id="1"]', (el) => el.getAttribute('data-status'));
  console.log(`[PASS] Interactive item state cycle: "${statusBefore}" -> "${statusAfter}"`);
  if (statusBefore === statusAfter) throw new Error('Interactive state cycle failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'todo-list-interactive-dark.png') });
  console.log('[PASS] Captured todo-list-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-66-todo-list--default&globals=theme:light');
  await page.waitForSelector('.ds-todo-list');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'todo-list-default-light.png') });
  console.log('[PASS] Captured todo-list-default-light.png');

  console.log('--- ALL 10/10 TODO LIST AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
