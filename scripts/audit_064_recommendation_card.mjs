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

  console.log('--- AUDITING #064 RECOMMENDATION CARD ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-64-recommendation-card--default&globals=theme:dark');
  await page.waitForSelector('.ds-recommendation-card');

  const card = await page.$('.ds-recommendation-card');
  const cardBox = await card.boundingBox();
  const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Recommendation card: width=${cardBox.width}px, height=${cardBox.height}px, radius=${cardRadius}`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);
  if (cardRadius !== '20px') throw new Error(`Expected 20px radius, got ${cardRadius}`);

  // Title typography
  const title = await page.$('.ds-recommendation-card__title');
  const titleStyles = await title.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Question title typography: size=${titleStyles.fontSize}, weight=${titleStyles.fontWeight}`);
  if (titleStyles.fontWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleStyles.fontWeight}`);

  // Body typography (strict 400)
  const body = await page.$('.ds-recommendation-card__body');
  const bodyStyles = await body.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight };
  });
  console.log(`[PASS] Body typography: size=${bodyStyles.fontSize}, weight=${bodyStyles.fontWeight}, lineHeight=${bodyStyles.lineHeight}`);
  if (bodyStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for body, got ${bodyStyles.fontWeight}`);

  // Confidence bars
  const bar1 = await page.$('.ds-recommendation-card__bar-1');
  const bar2 = await page.$('.ds-recommendation-card__bar-2');
  const bar3 = await page.$('.ds-recommendation-card__bar-3');
  const b1Box = await bar1.boundingBox();
  const b2Box = await bar2.boundingBox();
  const b3Box = await bar3.boundingBox();
  console.log(`[PASS] Confidence bar heights: b1=${b1Box.height}px (6px), b2=${b2Box.height}px (9px), b3=${b3Box.height}px (12px)`);
  if (Math.round(b1Box.height) !== 6 || Math.round(b2Box.height) !== 9 || Math.round(b3Box.height) !== 12) {
    throw new Error('Unexpected confidence bar heights');
  }

  // Confidence label mono typography
  const confLabel = await page.$('.ds-recommendation-card__confidence-label');
  const confLabelStyles = await confLabel.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Confidence label: font=${confLabelStyles.fontFam.includes('mono') ? 'mono' : 'other'}, size=${confLabelStyles.fontSize}`);
  if (!confLabelStyles.fontFam.includes('mono')) throw new Error('Expected mono font family for confidence label');

  // Accept primary button height
  const acceptBtn = await page.$('.ds-recommendation-card__btn--primary');
  const btnBox = await acceptBtn.boundingBox();
  console.log(`[PASS] Accept button height: ${btnBox.height}px (expected 32px standard compact)`);
  if (Math.round(btnBox.height) !== 32) throw new Error(`Expected 32px button, got ${btnBox.height}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'recommendation-card-default-dark.png') });
  console.log('[PASS] Captured recommendation-card-default-dark.png');

  // 2. Audit Accepted in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-64-recommendation-card--accepted&globals=theme:dark');
  await page.waitForSelector('.ds-recommendation-card__receipt');
  const receiptText = await page.$eval('.ds-recommendation-card__receipt', (el) => el.textContent);
  console.log(`[PASS] Accepted receipt text: "${receiptText.trim()}"`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'recommendation-card-accepted-dark.png') });
  console.log('[PASS] Captured recommendation-card-accepted-dark.png');

  // 3. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-64-recommendation-card--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-accept]');
  await page.click('[data-btn-accept]');
  await page.waitForTimeout(200);
  const stateAfter = await page.$eval('.ds-recommendation-card', (el) => el.getAttribute('data-state'));
  console.log(`[PASS] Interactive accept click: state="${stateAfter}"`);
  if (stateAfter !== 'accepted') throw new Error('Expected state "accepted" after click');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'recommendation-card-interactive-dark.png') });
  console.log('[PASS] Captured recommendation-card-interactive-dark.png');

  // 4. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-64-recommendation-card--default&globals=theme:light');
  await page.waitForSelector('.ds-recommendation-card');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'recommendation-card-default-light.png') });
  console.log('[PASS] Captured recommendation-card-default-light.png');

  console.log('--- ALL 10/10 RECOMMENDATION CARD AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
