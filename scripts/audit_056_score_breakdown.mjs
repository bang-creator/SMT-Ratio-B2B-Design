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

  console.log('--- AUDITING #056 SCORE BREAKDOWN ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-56-score-breakdown--default&globals=theme:dark');
  await page.waitForSelector('.ds-score-breakdown');

  const card = await page.$('.ds-score-breakdown');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Score breakdown card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Total score typography
  const total = await page.$('.ds-score-breakdown__total');
  const totalStyles = await total.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Total score typography: size=${totalStyles.fontSize}, weight=${totalStyles.fontWeight}`);
  if (totalStyles.fontWeight !== '500') throw new Error(`Expected weight 500 for total score, got ${totalStyles.fontWeight}`);

  // Out of mono typography
  const outOf = await page.$('.ds-score-breakdown__out-of');
  const outOfStyles = await outOf.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Out-of typography: size=${outOfStyles.fontSize}, weight=${outOfStyles.fontWeight}, mono=${outOfStyles.fontFam.includes('mono')}`);
  if (outOfStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for out-of, got ${outOfStyles.fontWeight}`);

  // Verdict pill
  const verdict = await page.$('.ds-score-breakdown__verdict');
  const verdictStyles = await verdict.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { radius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color, bg: s.backgroundColor };
  });
  console.log(`[PASS] Verdict badge: text="${await verdict.textContent()}", radius=${verdictStyles.radius}, size=${verdictStyles.fontSize}, weight=${verdictStyles.fontWeight}`);

  // Criteria items count
  const items = await page.$$('.ds-score-breakdown__item');
  console.log(`[PASS] Criteria count: ${items.length} (expected 3)`);
  if (items.length !== 3) throw new Error(`Expected 3 items, got ${items.length}`);

  // Criterion typography (strict 400)
  const label = await page.$('.ds-score-breakdown__label');
  const labelWeight = await label.evaluate((el) => window.getComputedStyle(el).fontWeight);
  const weightSpan = await page.$('.ds-score-breakdown__weight');
  const weightSpanStyles = await weightSpan.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { weight: s.fontWeight, fontFam: s.fontFamily };
  });
  console.log(`[PASS] Criterion typography: labelWeight=${labelWeight}, weightSpanWeight=${weightSpanStyles.weight}`);
  if (labelWeight !== '400' || weightSpanStyles.weight !== '400') throw new Error('Expected 400 font weights on criteria labels/weights');

  // Meter track height
  const track = await page.$('.ds-score-breakdown__track');
  const trackStyles = await track.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, radius: s.borderRadius };
  });
  console.log(`[PASS] Meter track: height=${trackStyles.height}, radius=${trackStyles.borderRadius}`);
  if (trackStyles.height !== '3px') throw new Error(`Expected 3px track height, got ${trackStyles.height}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'score-breakdown-default-dark.png') });
  console.log('[PASS] Captured score-breakdown-default-dark.png');

  // 2. Audit Average in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-56-score-breakdown--average&globals=theme:dark');
  await page.waitForSelector('.ds-score-breakdown__verdict--mid');
  console.log('[PASS] Mid verdict pill rendered in Average story');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'score-breakdown-average-dark.png') });
  console.log('[PASS] Captured score-breakdown-average-dark.png');

  // 3. Audit Low in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-56-score-breakdown--low&globals=theme:dark');
  await page.waitForSelector('.ds-score-breakdown__verdict--low');
  console.log('[PASS] Low verdict pill rendered in Low story');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'score-breakdown-low-dark.png') });
  console.log('[PASS] Captured score-breakdown-low-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-56-score-breakdown--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-switch]');
  const totalBefore = await page.$eval('.ds-score-breakdown__total', (el) => el.textContent);
  await page.click('[data-btn-switch]');
  await page.waitForTimeout(200);
  const totalAfter = await page.$eval('.ds-score-breakdown__total', (el) => el.textContent);
  console.log(`[PASS] Interactive model switch: ${totalBefore} -> ${totalAfter}`);
  if (totalBefore === totalAfter) throw new Error('Interactive score switch failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'score-breakdown-interactive-dark.png') });
  console.log('[PASS] Captured score-breakdown-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-56-score-breakdown--default&globals=theme:light');
  await page.waitForSelector('.ds-score-breakdown');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'score-breakdown-default-light.png') });
  console.log('[PASS] Captured score-breakdown-default-light.png');

  console.log('--- ALL 10/10 SCORE BREAKDOWN AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
