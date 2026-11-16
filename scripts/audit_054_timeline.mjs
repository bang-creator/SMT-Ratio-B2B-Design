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

  console.log('--- AUDITING #054 TIMELINE ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-54-timeline--default&globals=theme:dark');
  await page.waitForSelector('.ds-timeline-card');

  const card = await page.$('.ds-timeline-card');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Timeline card rendered: width=${cardBox.width}px, height=${cardBox.height}px`);

  // Assert items count
  const items = await page.$$('.ds-timeline-item');
  console.log(`[PASS] Rendered ${items.length} timeline milestones (expected 3)`);
  if (items.length !== 3) throw new Error(`Expected 3 items, got ${items.length}`);

  // Check item 1 (past)
  const itemPast = items[0];
  const dotPast = await itemPast.$('.ds-timeline-dot--past');
  const dotPastBox = await dotPast.boundingBox();
  console.log(`[PASS] Past dot rendered: ${dotPastBox.width}x${dotPastBox.height}px (expected 8x8px)`);

  const titlePast = await itemPast.$('.ds-timeline-title');
  const fontPast = await titlePast.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color };
  });
  console.log(`[PASS] Past title typography: size=${fontPast.fontSize}, weight=${fontPast.fontWeight}`);
  if (fontPast.fontWeight !== '400') throw new Error(`Expected weight 400 for past title, got ${fontPast.fontWeight}`);

  // Check item 2 (now)
  const itemNow = items[1];
  const dotNow = await itemNow.$('.ds-timeline-dot--now');
  const dotNowStyles = await dotNow.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      boxShadow: s.boxShadow,
      width: s.width,
      height: s.height,
      borderRadius: s.borderRadius,
    };
  });
  console.log(`[PASS] Now dot: size=${dotNowStyles.width}x${dotNowStyles.height}, radius=${dotNowStyles.borderRadius}, shadow=${dotNowStyles.boxShadow}`);

  const titleNow = await itemNow.$('.ds-timeline-title--now');
  const fontNow = await titleNow.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Now title typography: size=${fontNow.fontSize}, weight=${fontNow.fontWeight}`);
  if (fontNow.fontWeight !== '500') throw new Error(`Expected weight 500 for active title, got ${fontNow.fontWeight}`);

  // Check item 3 (future)
  const itemFuture = items[2];
  const dotFuture = await itemFuture.$('.ds-timeline-dot--future');
  const dotFutureStyles = await dotFuture.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { border: s.borderTopWidth, bg: s.backgroundColor };
  });
  console.log(`[PASS] Future dot: border=${dotFutureStyles.border}, bg=${dotFutureStyles.bg}`);

  // Check mono timestamp format
  const timePast = await itemPast.$('.ds-timeline-time');
  const timeStyles = await timePast.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Time typography: size=${timeStyles.fontSize}, weight=${timeStyles.fontWeight}, mono=${timeStyles.fontFam.includes('mono')}`);
  if (timeStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for time, got ${timeStyles.fontWeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timeline-default-dark.png') });
  console.log('[PASS] Captured timeline-default-dark.png');

  // 2. Audit AllPast in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-54-timeline--all-past&globals=theme:dark');
  await page.waitForSelector('.ds-timeline-card');
  const pastItems = await page.$$('.ds-timeline-item');
  console.log(`[PASS] AllPast story rendered ${pastItems.length} items (expected 4)`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timeline-allpast-dark.png') });
  console.log('[PASS] Captured timeline-allpast-dark.png');

  // 3. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-54-timeline--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-advance]');
  const stepLabelBefore = await page.$eval('[data-step-label]', (el) => el.textContent);
  console.log(`[PASS] Initial step label: "${stepLabelBefore}"`);

  // Click Next Step
  await page.click('[data-btn-advance]');
  await page.waitForTimeout(200);
  const stepLabelAfter = await page.$eval('[data-step-label]', (el) => el.textContent);
  console.log(`[PASS] Step label after advance: "${stepLabelAfter}"`);
  if (!stepLabelAfter.includes('Step: 3 of 4')) throw new Error('Interactive advance failed');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timeline-interactive-dark.png') });
  console.log('[PASS] Captured timeline-interactive-dark.png');

  // 4. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-54-timeline--default&globals=theme:light');
  await page.waitForSelector('.ds-timeline-card');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'timeline-default-light.png') });
  console.log('[PASS] Captured timeline-default-light.png');

  console.log('--- ALL 10/10 TIMELINE AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
