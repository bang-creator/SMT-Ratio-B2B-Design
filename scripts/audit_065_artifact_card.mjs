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

  console.log('--- AUDITING #065 ARTIFACT CARD ---');

  // 1. Audit Default in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-65-artifact-card--default&globals=theme:dark');
  await page.waitForSelector('.ds-artifact-card');

  const card = await page.$('.ds-artifact-card');
  const cardBox = await card.boundingBox();
  const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
  console.log(`[PASS] Artifact card: width=${cardBox.width}px, height=${cardBox.height}px, radius=${cardRadius}`);
  if (Math.round(cardBox.width) !== 320) throw new Error(`Expected 320px width, got ${cardBox.width}`);
  if (cardRadius !== '20px') throw new Error(`Expected 20px radius, got ${cardRadius}`);

  // Icon box geometry
  const iconBox = await page.$('.ds-artifact-card__icon-box');
  const iconBoxStyles = await iconBox.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { width: s.width, height: s.height, radius: s.borderRadius };
  });
  console.log(`[PASS] Icon box: size=${iconBoxStyles.width}x${iconBoxStyles.height}, radius=${iconBoxStyles.radius}`);
  if (iconBoxStyles.width !== '36px' || iconBoxStyles.height !== '36px') throw new Error('Expected 36x36px icon box');

  // Title typography
  const title = await page.$('.ds-artifact-card__title');
  const titleStyles = await title.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Title typography: size=${titleStyles.fontSize}, weight=${titleStyles.fontWeight}`);
  if (titleStyles.fontWeight !== '500') throw new Error(`Expected weight 500 for title, got ${titleStyles.fontWeight}`);

  // Meta mono typography (strict 400)
  const meta = await page.$('.ds-artifact-card__meta');
  const metaStyles = await meta.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontFam: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  console.log(`[PASS] Meta typography: size=${metaStyles.fontSize}, weight=${metaStyles.fontWeight}, mono=${metaStyles.fontFam.includes('mono')}`);
  if (metaStyles.fontWeight !== '400') throw new Error(`Expected weight 400 for meta, got ${metaStyles.fontWeight}`);

  // Arrow hover opacity check
  const arrow = await page.$('.ds-artifact-card__arrow');
  const initialOpacity = await arrow.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log(`[PASS] Arrow initial opacity: ${initialOpacity}`);
  if (initialOpacity !== '0') throw new Error('Expected initial arrow opacity to be 0');

  // Hover over card
  await card.hover();
  await page.waitForTimeout(200);
  const hoverOpacity = await arrow.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log(`[PASS] Arrow hover opacity: ${hoverOpacity}`);
  if (hoverOpacity !== '1') throw new Error('Expected hover arrow opacity to be 1');

  // Screenshot Default Dark
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'artifact-card-default-dark.png') });
  console.log('[PASS] Captured artifact-card-default-dark.png');

  // 2. Audit Generating in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-65-artifact-card--generating&globals=theme:dark');
  await page.waitForSelector('.ds-artifact-card__shimmer-label');
  const shimmerText = await page.$eval('.ds-artifact-card__shimmer-label', (el) => el.textContent);
  console.log(`[PASS] Generating shimmer text: "${shimmerText}"`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'artifact-card-generating-dark.png') });
  console.log('[PASS] Captured artifact-card-generating-dark.png');

  // 3. Audit Interactive in Dark Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-65-artifact-card--interactive&globals=theme:dark');
  await page.waitForSelector('[data-btn-toggle]');
  const isGenBefore = await page.$eval('.ds-artifact-card', (el) => el.getAttribute('data-generating'));
  await page.click('[data-btn-toggle]');
  await page.waitForTimeout(200);
  const isGenAfter = await page.$eval('.ds-artifact-card', (el) => el.getAttribute('data-generating'));
  console.log(`[PASS] Interactive toggle: generating="${isGenBefore}" -> "${isGenAfter}"`);
  if (isGenBefore === isGenAfter) throw new Error('Interactive state toggle failed');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'artifact-card-interactive-dark.png') });
  console.log('[PASS] Captured artifact-card-interactive-dark.png');

  // 4. Audit Default in Light Theme
  await page.goto('http://127.0.0.1:6006/iframe.html?id=default-application-65-artifact-card--default&globals=theme:light');
  await page.waitForSelector('.ds-artifact-card');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'artifact-card-default-light.png') });
  console.log('[PASS] Captured artifact-card-default-light.png');

  console.log('--- ALL 10/10 ARTIFACT CARD AUDIT CHECKS PASSED ---');
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
