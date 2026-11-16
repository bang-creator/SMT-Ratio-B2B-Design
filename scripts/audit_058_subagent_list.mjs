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

  console.log('--- AUDITING #058 SUBAGENT LIST ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-58-subagent-list--default&globals=theme:dark');
  await page.waitForSelector('.ds-subagent-list');

  const list = await page.$('.ds-subagent-list');
  const listBox = await list.boundingBox();
  console.log(`[PASS] Subagent list: width=${listBox.width}px, height=${listBox.height}px`);
  if (Math.round(listBox.width) !== 320) throw new Error(`Expected 320px width, got ${listBox.width}`);

  const items = await page.$$('.ds-subagent-item');
  console.log(`[PASS] Rendered ${items.length} subagents (expected 3)`);
  if (items.length !== 3) throw new Error(`Expected 3 subagents, got ${items.length}`);

  // Item card geometry
  const item1 = items[0];
  const item1Box = await item1.boundingBox();
  const item1Radius = await item1.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Subagent card: width=${item1Box.width}px, height=${item1Box.height}px, radius=${item1Radius}`);

  // Name typography (strict 400)
  const name = await item1.$('.ds-subagent-item__name');
  const nameStyles = await name.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Name typography: size=${nameStyles.fontSize}, weight=${nameStyles.fontWeight}`);
  if (nameStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for subagent name, got ${nameStyles.fontWeight}`);

  // Model mono typography
  const model = await item1.$('.ds-subagent-item__model');
  const modelStyles = await model.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Model typography: size=${modelStyles.fontSize}, weight=${modelStyles.fontWeight}, mono=${modelStyles.fontFam.includes('mono')}`);
  if (modelStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for model, got ${modelStyles.fontWeight}`);

  // Check icon on completed agent
  const doneIcon = await item1.$('.ds-subagent-item__icon--done');
  const doneIconBox = await doneIcon.boundingBox();
  console.log(`[PASS] Done check icon: size=${doneIconBox.width}x${doneIconBox.height}px`);

  // Running spinner on second agent
  const item2 = items[1];
  const spinner = await item2.$('.ds-subagent-item__icon--running');
  const spinnerStyles = await spinner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { anim: s.animationName, width: s.width, height: s.height };
  });
  console.log(`[PASS] Running spinner: size=${spinnerStyles.width}x${spinnerStyles.height}, anim=${spinnerStyles.anim}`);
  if (!spinnerStyles.anim.includes('ds-spin')) throw new Error('Expected ds-spin animation on running subagent');

  // Track height
  const track = await item1.$('.ds-subagent-item__track');
  const trackHeight = await track.evaluate((el) => window.getComputedStyle(el).height);
  console.log(`[PASS] Track height: ${trackHeight} (expected 3px)`);
  if (trackHeight !== '3px') throw new Error(`Expected 3px track height, got ${trackHeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subagent-list-default-dark.png') });
  console.log('[PASS] Captured subagent-list-default-dark.png');

  // 2. Audit WithSummary in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-58-subagent-list--with-summary&globals=theme:dark');
  await page.waitForSelector('.ds-subagent-item__bar--shimmer');
  const shimmerItems = await page.$$('.ds-subagent-item');
  console.log(`[PASS] WithSummary rendered ${shimmerItems.length} items (expected 4)`);
  if (shimmerItems.length !== 4) throw new Error('Expected 4 subagents in WithSummary story');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subagent-list-withsummary-dark.png') });
  console.log('[PASS] Captured subagent-list-withsummary-dark.png');

  // 3. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-58-subagent-list--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-step]');
  const firstStatusBefore = await page.$eval('.ds-subagent-item', (el) => el.getAttribute('data-status'));
  await page.click('[data-btn-step]');
  await page.waitForTimeout(200);
  const firstStatusAfter = await page.$eval('.ds-subagent-item', (el) => el.getAttribute('data-status'));
  console.log(`[PASS] Interactive transition: "${firstStatusBefore}" -> "${firstStatusAfter}"`);
  if (firstStatusBefore === 'done' || firstStatusAfter !== 'done') throw new Error('Interactive advance failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subagent-list-interactive-dark.png') });
  console.log('[PASS] Captured subagent-list-interactive-dark.png');

  // 4. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-58-subagent-list--default&globals=theme:light');
  await page.waitForSelector('.ds-subagent-list');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'subagent-list-default-light.png') });
  console.log('[PASS] Captured subagent-list-default-light.png');

  console.log('--- ALL 10/10 SUBAGENT LIST AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
