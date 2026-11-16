import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #123: Syntax highlighter AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-123-syntax-highlighter-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="highlighter-frame"]');

  const frameStyles = await page.$eval('[data-slot="highlighter-frame"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(frameStyles.maxWidth === '600px', `Frame max-width is 600px (got ${frameStyles.maxWidth})`);
  assert(parseInt(frameStyles.borderRadius, 10) >= 12, `Frame border-radius is >= 12px (got ${frameStyles.borderRadius})`);
  assert(frameStyles.borderTopWidth === '1px', `Frame border is 1px (got ${frameStyles.borderTopWidth})`);

  // Language badge typography (Strict 400 Rule)
  const langStyles = await page.$eval('[data-slot="highlighter-language"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      text: el.textContent.trim(),
    };
  });
  assert(langStyles.text === 'python', `Language label displays "python" (got ${langStyles.text})`);
  assert(langStyles.fontSize === '12px', `Language label font-size is 12px (got ${langStyles.fontSize})`);
  assert(langStyles.fontWeight === '400', `Language label font-weight is 400 (strict 400 rule) (got ${langStyles.fontWeight})`);
  assert(langStyles.fontFamily.includes('mono'), `Language label uses monospace font (got ${langStyles.fontFamily})`);

  // Code area typography (Strict 400 Rule)
  const codeStyles = await page.$eval('[data-slot="highlighter-code"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      lineHeight: cs.lineHeight,
      overflowX: cs.overflowX,
    };
  });
  assert(codeStyles.fontSize === '12px', `Code area font-size is 12px (got ${codeStyles.fontSize})`);
  assert(codeStyles.fontWeight === '400', `Code area font-weight is 400 (strict 400 rule) (got ${codeStyles.fontWeight})`);
  assert(codeStyles.fontFamily.includes('mono'), `Code area uses monospace font (got ${codeStyles.fontFamily})`);
  assert(codeStyles.overflowX === 'auto', `Code area has overflow-x: auto (got ${codeStyles.overflowX})`);

  // Token classes presence
  const hasKeyword = await page.$('.ds-token-keyword');
  const hasString = await page.$('.ds-token-string');
  const hasFunction = await page.$('.ds-token-function');
  assert(Boolean(hasKeyword), 'Syntax highlighter renders keyword token (.ds-token-keyword)');
  assert(Boolean(hasString), 'Syntax highlighter renders string token (.ds-token-string)');
  assert(Boolean(hasFunction), 'Syntax highlighter renders function token (.ds-token-function)');

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'syntax-highlighter-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-123-syntax-highlighter-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="highlighter-frame"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'syntax-highlighter-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: UnknownLanguage ---
  console.log('\n--- Auditing UnknownLanguage Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-123-syntax-highlighter-aui--unknown-language&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="highlighter-language"]');
  const unknownLang = await page.$eval('[data-slot="highlighter-language"]', el => el.textContent.trim());
  assert(unknownLang === 'gleam', `Language displays "gleam" (got ${unknownLang})`);

  // --- Story 3: LongLine Horizontal Scroll ---
  console.log('\n--- Auditing LongLine Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-123-syntax-highlighter-aui--long-line&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="highlighter-code"]');
  const isHorizontallyScrollable = await page.$eval('[data-slot="highlighter-code"]', (el) => el.scrollWidth > el.clientWidth);
  assert(isHorizontallyScrollable, 'Long line exceeds client width and is horizontally scrollable');

  // --- Story 4: Interactive Copy ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-123-syntax-highlighter-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="copy-code"]');

  await page.click('[data-action="copy-code"]');
  await page.waitForTimeout(100);

  const copyHtml = await page.$eval('[data-action="copy-code"]', el => el.innerHTML);
  assert(copyHtml.includes('polyline'), 'Copy button changes to checkmark feedback icon upon click');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'syntax-highlighter-interactive-dark.png'),
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
