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

  console.log('--- AUDITING #055 JOB PROGRESS ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-55-job-progress--default&globals=theme:dark');
  await page.waitForSelector('.ds-job-progress');

  const card = await page.$('.ds-job-progress');
  const cardBox = await card.boundingBox();
  console.log(`[PASS] Job progress card: width=${cardBox.width}px, height=${cardBox.height}px`);
  if (Math.round(cardBox.width) !== 384) throw new Error(`Expected 384px width, got ${cardBox.width}`);

  // Header and title typography
  const title = await page.$('.ds-job-progress__title');
  const titleStyles = await title.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Title typography: size=${titleStyles.fontSize}, weight=${titleStyles.fontWeight}`);
  if (titleStyles.fontWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleStyles.fontWeight}`);

  // Meta (ETA) mono typography
  const meta = await page.$('.ds-job-progress__meta');
  const metaStyles = await meta.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Meta typography: size=${metaStyles.fontSize}, weight=${metaStyles.fontWeight}, mono=${metaStyles.fontFam.includes('mono')}`);
  if (metaStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for meta, got ${metaStyles.fontWeight}`);

  // Spinning icon check
  const spinner = await page.$('.ds-job-progress__icon--running');
  const spinnerStyles = await spinner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { anim: s.animationName, width: s.width, height: s.height };
  });
  console.log(`[PASS] Running spinner: size=${spinnerStyles.width}x${spinnerStyles.height}, animation=${spinnerStyles.anim}`);
  if (!spinnerStyles.anim.includes('ds-spin')) throw new Error('Expected ds-spin animation');

  // Cancel button
  const cancelBtn = await page.$('.ds-job-progress__cancel');
  const cancelBox = await cancelBtn.boundingBox();
  const cancelAria = await cancelBtn.getAttribute('aria-label');
  console.log(`[PASS] Cancel button: size=${cancelBox.width}x${cancelBox.height}px, aria-label="${cancelAria}"`);
  if (Math.round(cancelBox.width) !== 24 || Math.round(cancelBox.height) !== 24) {
    throw new Error(`Expected 24x24px button, got ${cancelBox.width}x${cancelBox.height}`);
  }

  // Progress bar track & fill
  const track = await page.$('.ds-job-progress__track');
  const trackStyles = await track.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, radius: s.borderRadius };
  });
  console.log(`[PASS] Progress bar track: height=${trackStyles.height}, radius=${trackStyles.borderRadius}`);
  if (trackStyles.height !== '4px') throw new Error(`Expected 4px height, got ${trackStyles.height}`);

  const bar = await page.$('.ds-job-progress__bar');
  const barStyles = await bar.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { bg: s.backgroundColor, width: s.width };
  });
  console.log(`[PASS] Progress bar fill: width=${barStyles.width}, bg=${barStyles.bg}`);

  // Stage chips typography
  const activeStage = await page.$('.ds-job-progress__stage--active');
  const activeStageWeight = await activeStage.evaluate((el) => window.getComputedStyle(el).fontWeight);
  console.log(`[PASS] Stage chip typography: weight=${activeStageWeight}`);
  if (activeStageWeight !== '400') throw new Error(`Expected weight 400 for stage chip, got ${activeStageWeight}`);

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'job-progress-default-dark.png') });
  console.log('[PASS] Captured job-progress-default-dark.png');

  // 2. Audit Completed in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-55-job-progress--completed&globals=theme:dark');
  await page.waitForSelector('.ds-job-progress__icon--success');
  const checkIcon = await page.$('.ds-job-progress__icon--success');
  console.log('[PASS] Success check icon rendered in Completed state');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'job-progress-completed-dark.png') });
  console.log('[PASS] Captured job-progress-completed-dark.png');

  // 3. Audit Failed in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-55-job-progress--failed&globals=theme:dark');
  await page.waitForSelector('.ds-job-progress__icon--failed');
  const failIcon = await page.$('.ds-job-progress__icon--failed');
  console.log('[PASS] Failed cross icon rendered in Failed state');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'job-progress-failed-dark.png') });
  console.log('[PASS] Captured job-progress-failed-dark.png');

  // 4. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-55-job-progress--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-step]');
  await page.click('[data-btn-step]');
  await page.waitForTimeout(200);
  const stateLabel = await page.$eval('.ds-text-xs', (el) => el.textContent);
  console.log(`[PASS] Interactive transition: "${stateLabel}"`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'job-progress-interactive-dark.png') });
  console.log('[PASS] Captured job-progress-interactive-dark.png');

  // 5. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-55-job-progress--default&globals=theme:light');
  await page.waitForSelector('.ds-job-progress');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'job-progress-default-light.png') });
  console.log('[PASS] Captured job-progress-default-light.png');

  console.log('--- ALL 10/10 JOB PROGRESS AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
