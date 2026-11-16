import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #118: File AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-root"]');

  const rootStyles = await page.$eval('[data-slot="file-root"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      height: cs.height,
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(rootStyles.height === '36px', `Default root height is 36px (got ${rootStyles.height})`);
  assert(rootStyles.maxWidth === '340px', `Default root max-width is 340px (got ${rootStyles.maxWidth})`);
  assert(parseInt(rootStyles.borderRadius, 10) >= 12, `Root border-radius is >= 12px (got ${rootStyles.borderRadius})`);
  assert(rootStyles.borderTopWidth === '1px', `Root border is 1px (got ${rootStyles.borderTopWidth})`);

  // Typography inspection (Strict 400 Rule)
  const typography = await page.evaluate(() => {
    const nameEl = document.querySelector('[data-slot="file-name"]');
    const metaEl = document.querySelector('[data-slot="file-meta"]');
    const csName = window.getComputedStyle(nameEl);
    const csMeta = window.getComputedStyle(metaEl);
    return {
      nameFontSize: csName.fontSize,
      nameFontWeight: csName.fontWeight,
      metaFontSize: csMeta.fontSize,
      metaFontWeight: csMeta.fontWeight,
      metaFontFamily: csMeta.fontFamily,
    };
  });

  assert(typography.nameFontSize === '12px', `File name font-size is 12px (got ${typography.nameFontSize})`);
  assert(typography.nameFontWeight === '400', `File name font-weight is 400 (strict 400 rule) (got ${typography.nameFontWeight})`);
  assert(typography.metaFontSize === '11px', `File meta font-size is 11px (got ${typography.metaFontSize})`);
  assert(typography.metaFontWeight === '400', `File meta font-weight is 400 (strict 400 rule) (got ${typography.metaFontWeight})`);
  assert(typography.metaFontFamily.includes('mono'), `File meta uses mono font family (got ${typography.metaFontFamily})`);

  // Download action button
  const downloadBtn = await page.$eval('[data-slot="file-download"]', (el) => ({
    width: window.getComputedStyle(el).width,
    height: window.getComputedStyle(el).height,
    ariaLabel: el.getAttribute('aria-label'),
    download: el.getAttribute('download'),
  }));
  assert(downloadBtn.width === '22px', `Download button width is 22px (got ${downloadBtn.width})`);
  assert(downloadBtn.height === '22px', `Download button height is 22px (got ${downloadBtn.height})`);
  assert(downloadBtn.ariaLabel.includes('system-metrics.json'), `Download button has descriptive aria-label (got ${downloadBtn.ariaLabel})`);
  assert(downloadBtn.download === 'system-metrics.json', `Download button has download filename attribute (got ${downloadBtn.download})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'file-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-root"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'file-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: CompactSmall ---
  console.log('\n--- Auditing CompactSmall Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--compact-small&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-root"]');
  const smallHeight = await page.$eval('[data-slot="file-root"]', el => window.getComputedStyle(el).height);
  assert(smallHeight === '30px', `Small variant height is 30px (got ${smallHeight})`);

  // --- Story 3: IdReference ---
  console.log('\n--- Auditing IdReference Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--id-reference&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-root"]');
  const hasDownloadButton = await page.$('[data-slot="file-download"]');
  assert(!hasDownloadButton, 'Download button is omitted when sourceType="id"');

  // --- Story 4: NoFilename ---
  console.log('\n--- Auditing NoFilename Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--no-filename&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-name"]');
  const fallbackLabel = await page.$eval('[data-slot="file-name"]', el => el.textContent.trim());
  assert(fallbackLabel === 'PDF file', `Fallback filename displays "PDF file" (got "${fallbackLabel}")`);

  // --- Story 5: Audio ---
  console.log('\n--- Auditing Audio Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--audio&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-icon"]');
  const iconHtml = await page.$eval('[data-slot="file-icon"]', el => el.innerHTML);
  assert(iconHtml.includes('circle'), 'Audio file displays music note icon');

  // --- Story 6: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-118-file-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="file-root"]');
  await page.hover('[data-slot="file-root"]');
  await page.waitForTimeout(100);

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'file-interactive-dark.png'),
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
