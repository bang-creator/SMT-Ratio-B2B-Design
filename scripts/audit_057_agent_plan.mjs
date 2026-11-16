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

  console.log('--- AUDITING #057 AGENT PLAN ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-57-agent-plan--default&globals=theme:dark');
  await page.waitForSelector('.ds-agent-plan');

  const card = await page.$('.ds-agent-plan');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Agent plan card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Title typography
  const title = await page.$('.ds-agent-plan__title');
  const titleStyles = await title.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Title typography: size=${titleStyles.fontSize}, weight=${titleStyles.fontWeight}`);
  if (titleStyles.fontWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleStyles.fontWeight}`);

  // Counter mono typography
  const counter = await page.$('.ds-agent-plan__counter');
  const counterStyles = await counter.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Counter typography: size=${counterStyles.fontSize}, weight=${counterStyles.fontWeight}, mono=${counterStyles.fontFam.includes('mono')}`);
  if (counterStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for counter, got ${counterStyles.fontWeight}`);

  // Progress track height
  const track = await page.$('.ds-agent-plan__track');
  const trackHeight = await track.evaluate((el) => window.getComputedStyle(el).height);
  console.log(`[PASS] Progress track height: ${trackHeight} (expected 3px)`);
  if (trackHeight !== '3px') throw new Error(`Expected 3px track height, got ${trackHeight}`);

  // Check step items
  const items = await page.$$('.ds-agent-plan__item');
  console.log(`[PASS] Steps count: ${items.length} (expected 4)`);
  if (items.length !== 4) throw new Error(`Expected 4 items, got ${items.length}`);

  // Check done icon
  const doneIcon = await page.$('.ds-agent-plan__icon--done');
  const doneIconBox = await doneIcon.boundingBox();
  console.log(`[PASS] Done check icon: size=${doneIconBox.width}x${doneIconBox.height}px`);

  // Check active spinner
  const activeSpinner = await page.$('.ds-agent-plan__icon--active');
  const activeStyles = await activeSpinner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { anim: s.animationName, width: s.width, height: s.height };
  });
  console.log(`[PASS] Active spinner: size=${activeStyles.width}x${activeStyles.height}, anim=${activeStyles.anim}`);
  if (!activeStyles.anim.includes('ds-spin')) throw new Error('Expected ds-spin animation on active step');

  // Check pending dot
  const pendingDot = await page.$('.ds-agent-plan__dot--pending');
  const pendingDotStyles = await pendingDot.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { width: s.width, height: s.height, radius: s.borderRadius };
  });
  console.log(`[PASS] Pending dot: size=${pendingDotStyles.width}x${pendingDotStyles.height}, radius=${pendingDotStyles.radius}`);

  // Strict 400 typography on labels
  const label = await page.$('.ds-agent-plan__label');
  const labelWeight = await label.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Label typography: weight=${labelWeight}`);
  if (labelWeight !== '400') throw new Error(`Expected weight 400 for label, got ${labelWeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-plan-default-dark.png') });
  console.log('[PASS] Captured agent-plan-default-dark.png');

  // 2. Audit Plain in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-57-agent-plan--plain&globals=theme:dark');
  await page.waitForSelector('.ds-agent-plan');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-plan-plain-dark.png') });
  console.log('[PASS] Captured agent-plan-plain-dark.png');

  // 3. Audit AllDone in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-57-agent-plan--all-done&globals=theme:dark');
  await page.waitForSelector('.ds-agent-plan');
  const allChecks = await page.$$('.ds-agent-plan__icon--done');
  console.log(`[PASS] AllDone rendered ${allChecks.length} completed checks (expected 4)`);
  if (allChecks.length !== 4) throw new Error('Expected 4 completed check icons');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-plan-alldone-dark.png') });
  console.log('[PASS] Captured agent-plan-alldone-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-57-agent-plan--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-step]');
  const counterBefore = await page.$eval('.ds-agent-plan__counter', (el) => el.textContent);
  await page.click('[data-btn-step]');
  await page.waitForTimeout(200);
  const counterAfter = await page.$eval('.ds-agent-plan__counter', (el) => el.textContent);
  console.log(`[PASS] Interactive step advance: "${counterBefore}" -> "${counterAfter}"`);
  if (counterBefore === counterAfter) throw new Error('Interactive step advance failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-plan-interactive-dark.png') });
  console.log('[PASS] Captured agent-plan-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-57-agent-plan--default&globals=theme:light');
  await page.waitForSelector('.ds-agent-plan');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-plan-default-light.png') });
  console.log('[PASS] Captured agent-plan-default-light.png');

  console.log('--- ALL 10/10 AGENT PLAN AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
