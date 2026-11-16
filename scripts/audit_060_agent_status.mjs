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

  console.log('--- AUDITING #060 AGENT STATUS ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--default&globals=theme:dark');
  await page.waitForSelector('.ds-agent-status');

  const pill = await page.$('.ds-agent-status');
  const pillBox = await pill.boundingBox();
  const pillRadius = await pill.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Agent status pill: width=${pillBox.width}px, height=${pillBox.height}px, radius=${pillRadius}`);
  if (!pillRadius.includes('9999px')) throw new Error('Expected full pill radius');

  // Label typography (strict 400)
  const label = await page.$('.ds-agent-status__label');
  const labelStyles = await label.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, maxW: s.maxWidth };
  });
  console.log(`[PASS] Label typography: size=${labelStyles.fontSize}, weight=${labelStyles.fontWeight}, maxW=${labelStyles.maxW}`);
  if (labelStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for label, got ${labelStyles.fontWeight}`);

  // Elapsed mono typography
  const elapsed = await page.$('.ds-agent-status__elapsed');
  const elapsedStyles = await elapsed.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Elapsed typography: size=${elapsedStyles.fontSize}, weight=${elapsedStyles.fontWeight}, mono=${elapsedStyles.fontFam.includes('mono')}`);
  if (elapsedStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for elapsed, got ${elapsedStyles.fontWeight}`);

  // Working pulsing dot
  const dot = await page.$('.ds-agent-status__dot--working');
  const dotStyles = await dot.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { width: s.width, height: s.height, bg: s.backgroundColor, anim: s.animationName };
  });
  console.log(`[PASS] Working dot: size=${dotStyles.width}x${dotStyles.height}, bg=${dotStyles.bg}, anim=${dotStyles.anim}`);
  if (!dotStyles.anim.includes('ds-agent-pulse')) throw new Error('Expected pulse animation on working dot');

  // Trailing button geometry
  const trailing = await page.$('.ds-agent-status__trailing');
  const trailingBox = await trailing.boundingBox();
  console.log(`[PASS] Trailing button: size=${trailingBox.width}x${trailingBox.height}px (expected 24x24px)`);
  if (Math.round(trailingBox.width) !== 24 || Math.round(trailingBox.height) !== 24) {
    throw new Error(`Expected 24x24px button, got ${trailingBox.width}x${trailingBox.height}`);
  }

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-default-dark.png') });
  console.log('[PASS] Captured agent-status-default-dark.png');

  // 2. Audit Waiting in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--waiting&globals=theme:dark');
  await page.waitForSelector('.ds-agent-status__dot--waiting');
  console.log('[PASS] Waiting bordered dot rendered');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-waiting-dark.png') });
  console.log('[PASS] Captured agent-status-waiting-dark.png');

  // 3. Audit Done in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--done&globals=theme:dark');
  await page.waitForSelector('.ds-agent-status__icon--done');
  console.log('[PASS] Done emerald check icon rendered');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-done-dark.png') });
  console.log('[PASS] Captured agent-status-done-dark.png');

  // 4. Audit Failed in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--failed&globals=theme:dark');
  await page.waitForSelector('.ds-agent-status__icon--failed');
  console.log('[PASS] Failed danger X icon rendered');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-failed-dark.png') });
  console.log('[PASS] Captured agent-status-failed-dark.png');

  // 5. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-step]');
  const stateBefore = await page.$eval('.ds-agent-status', (el) => el.getAttribute('data-state'));
  await page.click('[data-btn-step]');
  await page.waitForTimeout(200);
  const stateAfter = await page.$eval('.ds-agent-status', (el) => el.getAttribute('data-state'));
  console.log(`[PASS] Interactive transition: "${stateBefore}" -> "${stateAfter}"`);
  if (stateBefore === stateAfter) throw new Error('Interactive state switch failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-interactive-dark.png') });
  console.log('[PASS] Captured agent-status-interactive-dark.png');

  // 6. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-60-agent-status--default&globals=theme:light');
  await page.waitForSelector('.ds-agent-status');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-status-default-light.png') });
  console.log('[PASS] Captured agent-status-default-light.png');

  console.log('--- ALL 10/10 AGENT STATUS AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
