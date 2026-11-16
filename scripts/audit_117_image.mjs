import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #117: Image AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="image-root"]');

  const rootStyles = await page.$eval('[data-slot="image-root"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(rootStyles.maxWidth === '384px', `Root max-width is 384px (got ${rootStyles.maxWidth})`);
  assert(parseInt(rootStyles.borderRadius, 10) >= 12, `Root border-radius is >= 12px (got ${rootStyles.borderRadius})`);
  assert(rootStyles.borderTopWidth === '1px', `Root border is 1px (got ${rootStyles.borderTopWidth})`);

  // Preview aspect ratio
  const previewStyles = await page.$eval('[data-slot="image-preview"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      aspectRatio: cs.aspectRatio,
    };
  });
  assert(previewStyles.aspectRatio === '16 / 9', `Preview aspect-ratio is 16 / 9 (got ${previewStyles.aspectRatio})`);

  // Image element check
  const imgElement = await page.$('[data-slot="image-element"]');
  assert(Boolean(imgElement), 'Image element is rendered in preview');

  // Strict Typography inspection (400 rule)
  const typography = await page.evaluate(() => {
    const title = document.querySelector('[data-slot="image-title"]');
    const meta = document.querySelector('[data-slot="image-meta"]');
    const csTitle = window.getComputedStyle(title);
    const csMeta = window.getComputedStyle(meta);
    return {
      titleFontSize: csTitle.fontSize,
      titleFontWeight: csTitle.fontWeight,
      metaFontSize: csMeta.fontSize,
      metaFontWeight: csMeta.fontWeight,
      metaFontFamily: csMeta.fontFamily,
    };
  });

  assert(typography.titleFontSize === '12px', `Title font-size is 12px (got ${typography.titleFontSize})`);
  assert(typography.titleFontWeight === '400', `Title font-weight is 400 (strict 400 rule) (got ${typography.titleFontWeight})`);
  assert(typography.metaFontSize === '11px', `Meta font-size is 11px (got ${typography.metaFontSize})`);
  assert(typography.metaFontWeight === '400', `Meta font-weight is 400 (strict 400 rule) (got ${typography.metaFontWeight})`);
  assert(typography.metaFontFamily.includes('monospace') || typography.metaFontFamily.includes('mono'), `Meta uses monospace font (got ${typography.metaFontFamily})`);

  // Action buttons
  const copyBtn = await page.$('[data-action="copy-image"]');
  const copyBtnStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      height: cs.height,
      ariaLabel: el.getAttribute('aria-label'),
    };
  }, copyBtn);

  assert(copyBtnStyles.width === '24px', `Action button width is 24px (got ${copyBtnStyles.width})`);
  assert(copyBtnStyles.height === '24px', `Action button height is 24px (got ${copyBtnStyles.height})`);
  assert(copyBtnStyles.ariaLabel === 'Copy image', `Copy button has aria-label="Copy image" (got ${copyBtnStyles.ariaLabel})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'image-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="image-root"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'image-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: SquareRatio ---
  console.log('\n--- Auditing SquareRatio Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--square-ratio&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="image-root"]');

  const squareStyles = await page.evaluate(() => {
    const root = document.querySelector('[data-slot="image-root"]');
    const preview = document.querySelector('[data-slot="image-preview"]');
    const csRoot = window.getComputedStyle(root);
    const csPreview = window.getComputedStyle(preview);
    return {
      maxWidth: csRoot.maxWidth,
      aspectRatio: csPreview.aspectRatio,
    };
  });
  assert(squareStyles.maxWidth === '256px', `Small size max-width is 256px (got ${squareStyles.maxWidth})`);
  assert(squareStyles.aspectRatio === '1 / 1', `Square preview aspect-ratio is 1 / 1 (got ${squareStyles.aspectRatio})`);

  // --- Story 3: Loading ---
  console.log('\n--- Auditing Loading Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--loading&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="image-loading"]');
  const hasLoading = await page.$eval('[data-slot="image-loading"]', el => Boolean(el));
  assert(hasLoading, 'Loading placeholder indicator is present');

  // --- Story 4: Error ---
  console.log('\n--- Auditing Error Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--error&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="image-error"]');
  const hasError = await page.$eval('[data-slot="image-error"]', el => Boolean(el));
  assert(hasError, 'Error placeholder indicator is present');

  // --- Story 5: Interactive Lightbox Zoom & Copy ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-117-image-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="zoom-image"]');

  // Initially lightbox is hidden
  const isInitiallyHidden = await page.$eval('[data-slot="image-lightbox"]', el => el.classList.contains('is-hidden'));
  assert(isInitiallyHidden === true, 'Lightbox is initially hidden (.is-hidden)');

  // Click zoom trigger
  await page.click('[data-action="zoom-image"]');
  await page.waitForTimeout(100);

  const isVisibleAfterClick = await page.$eval('[data-slot="image-lightbox"]', el => !el.classList.contains('is-hidden'));
  assert(isVisibleAfterClick === true, 'Lightbox is visible after clicking zoom trigger');

  // Click close button
  await page.click('[data-action="close-lightbox"]');
  await page.waitForTimeout(100);

  const isHiddenAfterClose = await page.$eval('[data-slot="image-lightbox"]', el => el.classList.contains('is-hidden'));
  assert(isHiddenAfterClose === true, 'Lightbox is hidden after clicking close button');

  // Click copy button
  await page.click('[data-action="copy-image"]');
  await page.waitForTimeout(50);
  const copyHtml = await page.$eval('[data-action="copy-image"]', el => el.innerHTML);
  assert(copyHtml.includes('polyline'), 'Copy button changes to checkmark feedback icon');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'image-interactive-dark.png'),
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
