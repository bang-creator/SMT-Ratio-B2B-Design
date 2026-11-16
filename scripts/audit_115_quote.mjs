import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #115: Quote AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-115-quote-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="quote-block"]');

  const quoteBlock = await page.$('[data-slot="quote-block"]');
  const quoteStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      borderLeftWidth: cs.borderLeftWidth,
      borderLeftStyle: cs.borderLeftStyle,
      borderRadius: cs.borderRadius,
    };
  }, quoteBlock);

  assert(quoteStyles.borderLeftWidth === '2px', `Border-left width is 2px (got ${quoteStyles.borderLeftWidth})`);
  assert(quoteStyles.borderLeftStyle === 'solid', `Border-left style is solid (got ${quoteStyles.borderLeftStyle})`);

  // Inspect quote text typography (strict 400 rule)
  const textStyles = await page.$eval('.ds-quote-block__text', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(textStyles.fontSize === '12px', `Quote text font-size is 12px (got ${textStyles.fontSize})`);
  assert(textStyles.fontWeight === '400', `Quote text font-weight is 400 (got ${textStyles.fontWeight})`);

  // User text typography
  const userTextStyles = await page.$eval('[data-slot="user-text"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(userTextStyles.fontSize === '14px', `User text font-size is 14px (got ${userTextStyles.fontSize})`);
  assert(userTextStyles.fontWeight === '400', `User text font-weight is 400 (got ${userTextStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quote-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-115-quote-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="quote-block"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quote-default-light.png') });

  // --- Story 2: InComposer ---
  console.log('\n--- Auditing InComposer Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-115-quote-aui--in-composer&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-quote"]');

  const compQuote = await page.$('[data-slot="composer-quote"]');
  const compQuoteStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      borderLeftWidth: cs.borderLeftWidth,
      borderLeftStyle: cs.borderLeftStyle,
    };
  }, compQuote);

  assert(compQuoteStyles.borderLeftWidth === '2px', `Composer quote border-left width is 2px (got ${compQuoteStyles.borderLeftWidth})`);

  const dismissBtn = await page.$('[data-action="dismiss-quote"]');
  assert(dismissBtn !== null, 'Dismiss quote button present');

  const dismissAria = await dismissBtn.getAttribute('aria-label');
  assert(dismissAria === 'Remove quote', `Dismiss button has aria-label="Remove quote" (got "${dismissAria}")`);

  const dismissBox = await dismissBtn.boundingBox();
  assert(Math.round(dismissBox.width) === 20, `Dismiss button width is 20px (got ${Math.round(dismissBox.width)}px)`);

  // --- Story 3: LongContent ---
  console.log('\n--- Auditing LongContent Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-115-quote-aui--long-content&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="quote-block"]');

  const isClamped = await page.$eval('.ds-quote-block__text', (el) => {
    const cs = window.getComputedStyle(el);
    return cs.webkitLineClamp === '2';
  });
  assert(isClamped, 'Long quote text is clamped to 2 lines');

  // --- Story 4: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-115-quote-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-quote"]');

  const activeDismiss = await page.$('[data-action="dismiss-quote"]');
  await activeDismiss.click();
  await page.waitForTimeout(100);

  const isHidden = await page.$eval('[data-slot="composer-quote"]', (el) => el.classList.contains('is-hidden'));
  assert(isHidden, 'Clicking dismiss hides the composer quote preview');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quote-interactive-dark.png') });

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
