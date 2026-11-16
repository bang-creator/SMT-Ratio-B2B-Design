import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #122: Markdown text AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="markdown-card"]');

  const cardStyles = await page.$eval('[data-slot="markdown-card"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      padding: cs.padding,
    };
  });

  assert(cardStyles.maxWidth === '680px', `Card max-width is 680px (got ${cardStyles.maxWidth})`);
  assert(parseInt(cardStyles.borderRadius, 10) >= 12, `Card border-radius is >= 12px (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '20px', `Card padding is 20px (got ${cardStyles.padding})`);

  // Typography inspection (Strict 400 Rule)
  const typography = await page.evaluate(() => {
    const p = document.querySelector('.ds-markdown-card p');
    const h2 = document.querySelector('.ds-markdown-card h2');
    const csP = window.getComputedStyle(p);
    const csH2 = window.getComputedStyle(h2);
    return {
      pFontSize: csP.fontSize,
      pFontWeight: csP.fontWeight,
      h2FontSize: csH2.fontSize,
      h2FontWeight: csH2.fontWeight,
    };
  });

  assert(typography.pFontSize === '14px', `Paragraph font-size is 14px (got ${typography.pFontSize})`);
  assert(typography.pFontWeight === '400', `Paragraph font-weight is 400 (strict 400 rule) (got ${typography.pFontWeight})`);
  assert(typography.h2FontSize === '16px', `H2 heading font-size is 16px (got ${typography.h2FontSize})`);
  assert(typography.h2FontWeight === '500', `H2 heading font-weight is 500 (got ${typography.h2FontWeight})`);

  // Code block inspection
  const hasCodeFrame = await page.$('[data-slot="code-frame"]');
  assert(Boolean(hasCodeFrame), 'Code block frame is rendered');

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'markdown-text-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="markdown-card"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'markdown-text-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: Streaming ---
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--streaming&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="streaming-caret"]');
  const hasCaret = await page.$('[data-slot="streaming-caret"]');
  assert(Boolean(hasCaret), 'Streaming caret is rendered at end of incomplete code block');

  // --- Story 3: RichLists ---
  console.log('\n--- Auditing RichLists Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--rich-lists&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="blockquote"]');

  const bqBorder = await page.$eval('[data-slot="blockquote"]', el => window.getComputedStyle(el).borderLeftWidth);
  assert(bqBorder === '2px', `Blockquote has 2px left border (got ${bqBorder})`);

  // --- Story 4: WideTable ---
  console.log('\n--- Auditing WideTable Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--wide-table&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="table-wrapper"]');

  const wrapperOverflow = await page.$eval('[data-slot="table-wrapper"]', el => window.getComputedStyle(el).overflowX);
  assert(wrapperOverflow === 'auto', `Table wrapper has overflow-x: auto (got ${wrapperOverflow})`);

  // Table header typography (Strict 400 Rule)
  const thTypography = await page.$eval('.ds-markdown-table th', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(thTypography.fontSize === '12px', `Table th font-size is 12px (got ${thTypography.fontSize})`);
  assert(thTypography.fontWeight === '400', `Table th font-weight is 400 (strict 400 rule) (got ${thTypography.fontWeight})`);

  // Screenshot Wide Table
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'markdown-text-wide-table-dark.png'),
    fullPage: true,
  });

  // --- Story 5: Interactive Copy ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-122-markdown-text-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="copy-code"]');

  // Click copy button
  await page.click('[data-action="copy-code"]');
  await page.waitForTimeout(100);

  const copyHtml = await page.$eval('[data-action="copy-code"]', el => el.innerHTML);
  assert(copyHtml.includes('polyline'), 'Copy code button shows checkmark feedback after click');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'markdown-text-interactive-dark.png'),
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
