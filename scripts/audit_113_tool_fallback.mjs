import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #113: Tool fallback AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const card = await page.$('[data-slot="tool-fallback"]');
  const cardStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
    };
  }, card);

  assert(cardStyles.maxWidth === '480px', `Card max-width is 480px (got ${cardStyles.maxWidth})`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (got ${cardStyles.borderRadius})`);

  // Inspect tool name typography
  const nameStyles = await page.$eval('.ds-tool-fallback__name', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
    };
  });
  assert(nameStyles.fontSize === '13.5px', `Tool name font-size is 13.5px (got ${nameStyles.fontSize})`);
  assert(nameStyles.fontFamily.includes('mono'), `Tool name is monospace (got ${nameStyles.fontFamily})`);

  // Default is open
  const isExp = await page.$eval('[data-action="toggle-tool"]', (el) => el.getAttribute('aria-expanded'));
  assert(isExp === 'true', 'Default state is open (aria-expanded=true)');

  // Request code block
  const codeStyles = await page.$eval('.ds-tool-fallback__code', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      borderRadius: cs.borderRadius,
    };
  });
  assert(codeStyles.fontSize === '11px', `Code block font-size is 11px (got ${codeStyles.fontSize})`);
  assert(codeStyles.borderRadius === '8px', `Code block border radius is 8px (got ${codeStyles.borderRadius})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-fallback-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="tool-fallback"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-fallback-default-light.png') });

  // --- Story 2: Running ---
  console.log('\n--- Auditing Running Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--running&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const runningBadge = await page.$eval('[data-slot="status-badge"]', (el) => el.textContent.trim());
  assert(runningBadge === 'running', `Running badge displayed (got "${runningBadge}")`);

  // --- Story 3: RequiresAction ---
  console.log('\n--- Auditing RequiresAction Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--requires-action&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const approvalBox = await page.$('[data-slot="approval-box"]');
  assert(approvalBox !== null, 'Approval box displayed for requires-action');

  const approveBtn = await page.$('[data-action="approve-tool"]');
  assert(approveBtn !== null, 'Approve action button present');

  const denyBtn = await page.$('[data-action="deny-tool"]');
  assert(denyBtn !== null, 'Deny action button present');

  // --- Story 4: Denied ---
  console.log('\n--- Auditing Denied Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--denied&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const denialReceipt = await page.$('[data-slot="denial-receipt"]');
  assert(denialReceipt !== null, 'Denial receipt card displayed');

  // --- Story 5: ToolError ---
  console.log('\n--- Auditing ToolError Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--tool-error&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const errorCard = await page.$('[data-slot="error-card"]');
  assert(errorCard !== null, 'Error card displayed for failed run');

  // --- Story 6: Collapsed ---
  console.log('\n--- Auditing Collapsed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--collapsed&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  const isCollapsedExp = await page.$eval('[data-action="toggle-tool"]', (el) => el.getAttribute('aria-expanded'));
  assert(isCollapsedExp === 'false', 'Collapsed story has aria-expanded=false');

  const isContentClosed = await page.$eval('[data-slot="tool-content"]', (el) => el.classList.contains('is-closed'));
  assert(isContentClosed, 'Content is hidden with is-closed class');

  // --- Story 7: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-113-tool-fallback-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="tool-fallback"]');

  // Test accordion toggle
  const trigger = await page.$('[data-action="toggle-tool"]');
  await trigger.click();
  await page.waitForTimeout(100);

  let nowClosed = await page.$eval('[data-slot="tool-content"]', (el) => el.classList.contains('is-closed'));
  assert(nowClosed, 'Clicking trigger collapsed content');

  await trigger.click();
  await page.waitForTimeout(100);

  nowClosed = await page.$eval('[data-slot="tool-content"]', (el) => el.classList.contains('is-closed'));
  assert(!nowClosed, 'Clicking trigger expanded content again');

  // Test approval click
  const interactiveApprove = await page.$('[data-action="approve-tool"]');
  await interactiveApprove.click();
  await page.waitForTimeout(100);

  const newStatus = await page.$eval('[data-slot="tool-fallback"]', (el) => el.getAttribute('data-status'));
  assert(newStatus === 'complete', `Clicking Approve transitioned status to complete (got "${newStatus}")`);

  const resultEl = await page.$('[data-slot="tool-result"]');
  assert(resultEl !== null, 'Result code block appended after approval');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tool-fallback-interactive-dark.png') });

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
