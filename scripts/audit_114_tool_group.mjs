import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #114: Tool group AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const card = await page.$('[data-slot="tool-group"]');
  const cardStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
    };
  }, card);

  assert(cardStyles.maxWidth === '440px', `Card max-width is 440px (got ${cardStyles.maxWidth})`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (got ${cardStyles.borderRadius})`);

  // Trigger typography
  const titleStyles = await page.$eval('.ds-tool-group__title', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(titleStyles.fontSize === '14px', `Group title font-size is 14px (got ${titleStyles.fontSize})`);
  assert(titleStyles.fontWeight === '500', `Group title font-weight is 500 (got ${titleStyles.fontWeight})`);

  // Summary count
  const summaryText = await page.$eval('[data-slot="group-summary"]', (el) => el.textContent.trim());
  assert(summaryText === '3 done', `Summary shows "3 done" (got "${summaryText}")`);

  const summaryStyles = await page.$eval('[data-slot="group-summary"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      tabularNums: cs.fontVariantNumeric,
    };
  });
  assert(summaryStyles.fontSize === '11px', `Summary font-size is 11px (got ${summaryStyles.fontSize})`);
  assert(summaryStyles.fontFamily.includes('mono'), `Summary is monospace (got ${summaryStyles.fontFamily})`);

  // Tool items count
  const items = await page.$$('.ds-tool-group-item');
  assert(items.length === 3, `Rendered 3 tool items (got ${items.length})`);

  // Target typography (strict 400 rule)
  const targetStyles = await page.$eval('.ds-tool-group-item__target', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(targetStyles.fontSize === '12px', `Target font-size is 12px (got ${targetStyles.fontSize})`);
  assert(targetStyles.fontWeight === '400', `Target font-weight is 400 (got ${targetStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-group-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="tool-group"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-group-default-light.png') });

  // --- Story 2: Running ---
  console.log('\n--- Auditing Running Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--running&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const runningSummary = await page.$eval('[data-slot="group-summary"]', (el) => el.textContent.trim());
  assert(runningSummary === '2/3', `Running summary shows 2/3 (got "${runningSummary}")`);

  const hasSpinner = await page.$('.ds-animate-spin');
  assert(hasSpinner !== null, 'Spinning loader icon present for running state');

  // --- Story 3: OneFailed ---
  console.log('\n--- Auditing OneFailed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--one-failed&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const failedSummary = await page.$eval('[data-slot="group-summary"]', (el) => el.textContent.trim());
  assert(failedSummary === '1 failed', `Failed summary shows 1 failed (got "${failedSummary}")`);

  const failedIcon = await page.$('.ds-text-danger');
  assert(failedIcon !== null, 'Red X icon present for failed group');

  // --- Story 4: Single ---
  console.log('\n--- Auditing Single Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--single&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const singleItems = await page.$$('.ds-tool-group-item');
  assert(singleItems.length === 1, `Single story has 1 item (got ${singleItems.length})`);

  // --- Story 5: ManyCalls ---
  console.log('\n--- Auditing ManyCalls Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--many-calls&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const manyItems = await page.$$('.ds-tool-group-item');
  assert(manyItems.length === 8, `ManyCalls rendered 8 tool items (got ${manyItems.length})`);

  // --- Story 6: Collapsed ---
  console.log('\n--- Auditing Collapsed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--collapsed&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const isCollapsedExp = await page.$eval('[data-action="toggle-group"]', (el) => el.getAttribute('aria-expanded'));
  assert(isCollapsedExp === 'false', 'Collapsed story has aria-expanded=false');

  const isContentClosed = await page.$eval('[data-slot="group-content"]', (el) => el.classList.contains('is-closed'));
  assert(isContentClosed, 'Content is hidden with is-closed class');

  // --- Story 7: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-114-tool-group-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-group"]');

  const trigger = await page.$('[data-action="toggle-group"]');
  await trigger.click();
  await page.waitForTimeout(100);

  let nowClosed = await page.$eval('[data-slot="group-content"]', (el) => el.classList.contains('is-closed'));
  assert(nowClosed, 'Clicking trigger collapsed content');

  await trigger.click();
  await page.waitForTimeout(100);

  nowClosed = await page.$eval('[data-slot="group-content"]', (el) => el.classList.contains('is-closed'));
  assert(!nowClosed, 'Clicking trigger expanded content again');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-group-interactive-dark.png') });

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
