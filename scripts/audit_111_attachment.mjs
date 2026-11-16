import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #111: Attachment AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="attachment"]');

  const cards = await page.$$('[data-slot="attachment"]');
  assert(cards.length === 3, `Rendered 3 attachment cards (got ${cards.length})`);

  // Card geometry
  const cardStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
    };
  }, cards[0]);

  assert(cardStyles.maxWidth === '260px', `Card max-width is 260px (got ${cardStyles.maxWidth})`);
  assert(cardStyles.borderRadius === '14px', `Card border radius is 14px (got ${cardStyles.borderRadius})`);

  // Thumb geometry
  const thumbStyles = await page.$eval('.ds-attachment-thumb', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      height: cs.height,
      borderRadius: cs.borderRadius,
    };
  });
  assert(thumbStyles.width === '36px', `Thumb width is 36px (got ${thumbStyles.width})`);
  assert(thumbStyles.height === '36px', `Thumb height is 36px (got ${thumbStyles.height})`);
  assert(thumbStyles.borderRadius === '10px', `Thumb border radius is 10px (got ${thumbStyles.borderRadius})`);

  // Name typography
  const nameStyles = await page.$eval('.ds-attachment-name', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(nameStyles.fontSize === '12px', `Name font-size is 12px (got ${nameStyles.fontSize})`);
  assert(nameStyles.fontWeight === '500', `Name font-weight is 500 (got ${nameStyles.fontWeight})`);

  // Meta typography (strict 400 rule)
  const metaStyles = await page.$eval('.ds-attachment-meta', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(metaStyles.fontSize === '11px', `Meta font-size is 11px (got ${metaStyles.fontSize})`);
  assert(metaStyles.fontWeight === '400', `Meta font-weight is 400 (got ${metaStyles.fontWeight})`);

  // Remove button
  const removeBtn = await page.$('[data-action="remove-attachment"]');
  assert(removeBtn !== null, 'Remove button present');
  const removeAria = await removeBtn.getAttribute('aria-label');
  assert(removeAria.startsWith('Remove '), `Remove button has descriptive aria-label (got "${removeAria}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'attachment-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="attachment"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'attachment-default-light.png') });

  // --- Story 2: Uploading ---
  console.log('\n--- Auditing Uploading Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--uploading&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="attachment"]');

  const uploadBar = await page.$('[data-slot="progress-bar"]');
  assert(uploadBar !== null, 'Progress bar present for uploading status');

  const barWidth = await page.$eval('[data-slot="progress-bar"]', (el) => el.style.width);
  assert(barWidth === '45%', `Progress bar width reflects progress 45% (got ${barWidth})`);

  // --- Story 3: Error ---
  console.log('\n--- Auditing Error Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--error&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="attachment"]');

  const errStatus = await page.$eval('[data-slot="attachment"]', (el) => el.getAttribute('data-status'));
  assert(errStatus === 'error', 'Attachment status is error');

  const alertIcon = await page.$('.ds-text-danger');
  assert(alertIcon !== null, 'Alert icon present for failed attachment');

  // --- Story 4: InMessage ---
  console.log('\n--- Auditing InMessage Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--in-message&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="attachment"]');

  const sentRemoves = await page.$$('[data-action="remove-attachment"]');
  assert(sentRemoves.length === 0, 'Sent message attachments omit remove buttons');

  // --- Story 5: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-111-attachment-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="attachment"]');

  let interCards = await page.$$('[data-slot="attachment"]');
  assert(interCards.length === 2, 'Interactive starts with 2 cards');

  // Click remove button on first card
  const firstRemove = await page.$('[data-action="remove-attachment"]');
  await firstRemove.click();
  await page.waitForTimeout(100);

  interCards = await page.$$('[data-slot="attachment"]');
  assert(interCards.length === 1, `Card removed from DOM (remaining: ${interCards.length})`);

  // Click reset
  const resetBtn = await page.$('[data-action="reset"]');
  await resetBtn.click();
  await page.waitForTimeout(100);

  interCards = await page.$$('[data-slot="attachment"]');
  assert(interCards.length === 2, `Reset restored cards (count: ${interCards.length})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'attachment-interactive-dark.png') });

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
