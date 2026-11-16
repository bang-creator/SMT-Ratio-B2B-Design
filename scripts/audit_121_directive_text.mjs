import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #121: Directive text AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-121-directive-text-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="directive-text-chip"]');

  const chips = await page.$$('[data-slot="directive-text-chip"]');
  assert(chips.length === 3, `3 directive chips rendered in default sentence (got ${chips.length})`);

  // Chip geometry & styling
  const chipStyles = await page.$eval('[data-slot="directive-text-chip"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      borderTopWidth: cs.borderTopWidth,
      ariaLabel: el.getAttribute('aria-label'),
      type: el.getAttribute('data-directive-type'),
    };
  });

  assert(parseInt(chipStyles.borderRadius, 10) >= 10, `Chip has pill border-radius (got ${chipStyles.borderRadius})`);
  assert(chipStyles.fontSize === '13px', `Chip font-size is 13px (got ${chipStyles.fontSize})`);
  assert(chipStyles.fontWeight === '400', `Chip font-weight is 400 (strict 400 rule) (got ${chipStyles.fontWeight})`);
  assert(chipStyles.borderTopWidth === '1px', `Chip border is 1px (got ${chipStyles.borderTopWidth})`);
  assert(chipStyles.ariaLabel.includes('user: Priya Shah'), `Chip has descriptive aria-label (got ${chipStyles.ariaLabel})`);
  assert(chipStyles.type === 'user', `Chip directive type is "user" (got ${chipStyles.type})`);

  // Parent bubble typography
  const bubbleFontWeight = await page.$eval('.ds-user-bubble', el => window.getComputedStyle(el).fontWeight);
  assert(bubbleFontWeight === '400', `Bubble text font-weight is 400 (strict 400 rule) (got ${bubbleFontWeight})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'directive-text-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-121-directive-text-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="directive-text-chip"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'directive-text-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: PlainText ---
  console.log('\n--- Auditing PlainText Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-121-directive-text-aui--plain-text&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('.ds-user-bubble');
  const plainChips = await page.$$('[data-slot="directive-text-chip"]');
  assert(plainChips.length === 0, `No directive chips in plain text story (got ${plainChips.length})`);

  // --- Story 3: Streaming / Partial ---
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-121-directive-text-aui--streaming&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('.ds-user-bubble');
  const bubbleText = await page.$eval('.ds-user-bubble', el => el.textContent.trim());
  assert(bubbleText.includes(':tool[Sea'), `Unclosed streaming directive remains as raw text (got "${bubbleText}")`);

  // Screenshot Streaming
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'directive-text-streaming-dark.png'),
    fullPage: true,
  });

  await browser.close();

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
