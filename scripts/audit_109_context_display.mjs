import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #109: Context display AUI...');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
  });

  const page = await context.newPage();
  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- Story 1: Default (Dark & Light) ---
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-display-root"]');

  const triggers = await page.$$('[data-slot="context-display-trigger"]');
  assert(triggers.length === 3, `Has 3 variant triggers (ring, bar, text) (got ${triggers.length})`);

  // Inspect ring trigger geometry
  const triggerStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      height: cs.height,
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      tabularNums: cs.fontVariantNumeric,
    };
  }, triggers[0]);

  assert(triggerStyles.height === '28px', `Trigger height is compact 28px (got ${triggerStyles.height})`);
  assert(triggerStyles.borderRadius === '8px', `Trigger border radius is 8px (got ${triggerStyles.borderRadius})`);
  assert(triggerStyles.fontSize === '12px', `Trigger font-size is 12px (got ${triggerStyles.fontSize})`);
  assert(triggerStyles.fontWeight === '400', `Trigger font-weight is 400 (got ${triggerStyles.fontWeight})`);
  assert(triggerStyles.tabularNums.includes('tabular-nums'), `Tabular numbers enabled (got ${triggerStyles.tabularNums})`);

  // Ring SVG inspection
  const ringSvg = await page.$('.ds-context-ring-svg');
  assert(ringSvg !== null, 'Ring SVG element present');
  const ringBox = await ringSvg.boundingBox();
  assert(Math.round(ringBox.width) === 18, `Ring SVG width is 18px (got ${Math.round(ringBox.width)}px)`);

  // Bar track inspection
  const barTrack = await page.$('.ds-context-bar-track');
  assert(barTrack !== null, 'Bar track element present');
  const barTrackBox = await barTrack.boundingBox();
  assert(Math.round(barTrackBox.width) === 64, `Bar track width is 64px (got ${Math.round(barTrackBox.width)}px)`);
  assert(Math.round(barTrackBox.height) === 6, `Bar track height is 6px (got ${Math.round(barTrackBox.height)}px)`);

  // Text variant inspection
  const textLabel = await page.$eval('[data-slot="text-label"]', (el) => el.textContent.trim());
  assert(textLabel.includes('128k'), `Text variant shows model window (got "${textLabel}")`);

  // Test Hover Popover on first trigger
  console.log('\n--- Testing Popover on Hover ---');
  const popover = await page.$('[data-slot="context-display-popover"]');
  let isPopVisible = await page.$eval('[data-slot="context-display-popover"]', (el) => el.classList.contains('is-visible'));
  assert(!isPopVisible, 'Popover is hidden initially');

  await triggers[0].hover();
  await page.waitForTimeout(200);

  isPopVisible = await page.$eval('[data-slot="context-display-popover"]', (el) => el.classList.contains('is-visible'));
  assert(isPopVisible, 'Popover is visible on trigger hover');

  const popoverStyles = await page.$eval('[data-slot="context-display-popover"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      borderRadius: cs.borderRadius,
    };
  });
  assert(popoverStyles.width === '224px', `Popover width is 224px (got ${popoverStyles.width})`);
  assert(popoverStyles.borderRadius === '12px', `Popover border radius is 12px (got ${popoverStyles.borderRadius})`);

  const popoverPct = await page.$eval('[data-slot="popover-pct"]', (el) => el.textContent.trim());
  assert(popoverPct.includes('% full'), `Popover header shows percent full (got "${popoverPct}")`);

  const segmentRows = await page.$$('.ds-context-popover__seg-row');
  assert(segmentRows.length >= 2, `Popover has segment breakdown rows (got ${segmentRows.length})`);

  await page.mouse.move(0, 0);
  await page.waitForTimeout(200);
  isPopVisible = await page.$eval('[data-slot="context-display-popover"]', (el) => el.classList.contains('is-visible'));
  assert(!isPopVisible, 'Popover hides on mouse leave');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-display-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="context-display-root"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-display-default-light.png') });

  // --- Story 2: Warning ---
  console.log('\n--- Auditing Warning Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--warning&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-display-root"]');

  const warningTier = await page.$eval('[data-slot="context-display-root"]', (el) => el.getAttribute('data-tier'));
  assert(warningTier === 'warning', `Tier is warning (got "${warningTier}")`);

  // --- Story 3: Critical ---
  console.log('\n--- Auditing Critical Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--critical&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-display-root"]');

  const criticalTier = await page.$eval('[data-slot="context-display-root"]', (el) => el.getAttribute('data-tier'));
  assert(criticalTier === 'critical', `Tier is critical (got "${criticalTier}")`);

  // --- Story 4: Overflow ---
  console.log('\n--- Auditing Overflow Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--overflow&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-display-root"]');

  const overflowPct = await page.$eval('[data-slot="percent-label"]', (el) => el.textContent.trim());
  assert(overflowPct === '100%', `Overflow caps at 100% (got "${overflowPct}")`);

  // --- Story 5: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-109-context-display-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="interactive-mount"]');

  // Click 92k Warning button
  const warningBtn = await page.$('[data-tokens="92000"]');
  await warningBtn.click();
  await page.waitForTimeout(100);

  let currentTier = await page.$eval('[data-slot="context-display-root"]', (el) => el.getAttribute('data-tier'));
  assert(currentTier === 'warning', `Clicked 92k switched tier to warning (got "${currentTier}")`);

  // Click 118k Critical button
  const critBtn = await page.$('[data-tokens="118000"]');
  await critBtn.click();
  await page.waitForTimeout(100);

  currentTier = await page.$eval('[data-slot="context-display-root"]', (el) => el.getAttribute('data-tier'));
  assert(currentTier === 'critical', `Clicked 118k switched tier to critical (got "${currentTier}")`);

  // Click 16k Low button
  const lowBtn = await page.$('[data-tokens="16000"]');
  await lowBtn.click();
  await page.waitForTimeout(100);

  currentTier = await page.$eval('[data-slot="context-display-root"]', (el) => el.getAttribute('data-tier'));
  assert(currentTier === 'normal', `Clicked 16k switched tier to normal (got "${currentTier}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-display-interactive-dark.png') });

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
