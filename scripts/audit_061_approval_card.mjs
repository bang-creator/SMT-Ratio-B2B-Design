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

  console.log('--- AUDITING #061 APPROVAL CARD ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-61-approval-card--default&globals=theme:dark');
  await page.waitForSelector('.ds-approval-card');

  const card = await page.$('.ds-approval-card');
  const cardBox = await card.boundingBox();
  const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Approval card: width=${cardBox.width}px, height=${cardBox.height}px, radius=${cardRadius}`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);
  if (cardRadius !== '20px') throw new Error(`Expected 20px radius, got ${cardRadius}`);

  // Icon box
  const iconBox = await page.$('.ds-approval-card__icon-box');
  const iconBoxStyles = await iconBox.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { width: s.width, height: s.height, radius: s.borderRadius };
  });
  console.log(`[PASS] Icon box: size=${iconBoxStyles.width}x${iconBoxStyles.height}, radius=${iconBoxStyles.radius}`);
  if (iconBoxStyles.width !== '36px' || iconBoxStyles.height !== '36px') throw new Error('Expected 36x36px icon box');

  // Title & Subtitle typography
  const title = await page.$('.ds-approval-card__title');
  const titleWeight = await title.evaluate((el) => window.getComputedStyle(el).fontWeight);
  const subtitle = await page.$('.ds-approval-card__subtitle');
  const subtitleWeight = await subtitle.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Title weight: ${titleWeight} (expected 500), Subtitle weight: ${subtitleWeight} (expected 400)`);
  if (titleWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleWeight}`);
  if (subtitleWeight !== '400') throw new Error(`Expected weight 400 for subtitle, got ${subtitleWeight}`);

  // Command block
  const cmd = await page.$('.ds-approval-card__command');
  const cmdStyles = await cmd.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, radius: s.borderRadius, padding: s.padding };
  });
  console.log(`[PASS] Command block: font=${cmdStyles.fontFam.includes('mono') ? 'mono' : 'other'}, size=${cmdStyles.fontSize}, radius=${cmdStyles.radius}`);
  if (!cmdStyles.fontFam.includes('mono')) throw new Error('Expected mono font family for command block');

  // Action buttons height
  const primaryBtn = await page.$('.ds-approval-card__btn--primary');
  const btnBox = await primaryBtn.boundingBox();
  console.log(`[PASS] Primary button: height=${btnBox.height}px (expected 32px standard compact)`);
  if (Math.round(btnBox.height) !== 32) throw new Error(`Expected 32px button height, got ${btnBox.height}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'approval-card-default-dark.png') });
  console.log('[PASS] Captured approval-card-default-dark.png');

  // 2. Audit Destructive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-61-approval-card--destructive&globals=theme:dark');
  await page.waitForSelector('.ds-approval-card[data-variant="destructive"]');
  const destructiveIconBoxBg = await page.$eval(
    '.ds-approval-card[data-variant="destructive"] .ds-approval-card__icon-box',
    (el) => window.getComputedStyle(el).backgroundColor
  );
  console.log(`[PASS] Destructive icon box background: ${destructiveIconBoxBg}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'approval-card-destructive-dark.png') });
  console.log('[PASS] Captured approval-card-destructive-dark.png');

  // 3. Audit ReceiptStates in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-61-approval-card--receipt-states&globals=theme:dark');
  await page.waitForSelector('.ds-approval-card__receipt');
  const receipts = await page.$$('.ds-approval-card__receipt');
  console.log(`[PASS] Rendered ${receipts.length} receipt states (expected 3: running, done, denied)`);
  if (receipts.length !== 3) throw new Error(`Expected 3 receipt states, got ${receipts.length}`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'approval-card-receiptstates-dark.png') });
  console.log('[PASS] Captured approval-card-receiptstates-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-61-approval-card--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-allow]');
  await page.click('[data-btn-allow]');
  await page.waitForTimeout(200);
  const stateRunning = await page.$eval('.ds-approval-card', (el) => el.getAttribute('data-state'));
  console.log(`[PASS] Interactive allow click: state transition to "${stateRunning}"`);
  if (stateRunning !== 'running') throw new Error('Expected state "running" after click');
  await page.waitForTimeout(600);
  const stateDone = await page.$eval('.ds-approval-card', (el) => el.getAttribute('data-state'));
  console.log(`[PASS] Interactive auto-settle: state transition to "${stateDone}"`);
  if (stateDone !== 'done') throw new Error('Expected state "done" after completion');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'approval-card-interactive-dark.png') });
  console.log('[PASS] Captured approval-card-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-61-approval-card--default&globals=theme:light');
  await page.waitForSelector('.ds-approval-card');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'approval-card-default-light.png') });
  console.log('[PASS] Captured approval-card-default-light.png');

  console.log('--- ALL 10/10 APPROVAL CARD AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
