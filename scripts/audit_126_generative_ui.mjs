import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #126: Generative UI AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-126-generative-ui-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="generative-card"]');

  const cardStyles = await page.$eval('[data-slot="generative-card"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      padding: cs.padding,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(cardStyles.maxWidth === '400px', `Card max-width is 400px (got ${cardStyles.maxWidth})`);
  assert(parseInt(cardStyles.borderRadius, 10) >= 12, `Card border-radius is >= 12px (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);
  assert(cardStyles.borderTopWidth === '1px', `Card border is 1px (got ${cardStyles.borderTopWidth})`);

  // Typography inspection (Strict 400 Rule)
  const typography = await page.evaluate(() => {
    const title = document.querySelector('[data-slot="card-title"]');
    const li = document.querySelector('[data-slot="card-list"] li');
    const csTitle = window.getComputedStyle(title);
    const csLi = window.getComputedStyle(li);
    return {
      titleFontSize: csTitle.fontSize,
      titleFontWeight: csTitle.fontWeight,
      liFontSize: csLi.fontSize,
      liFontWeight: csLi.fontWeight,
    };
  });

  assert(typography.titleFontSize === '14px', `Card title font-size is 14px (got ${typography.titleFontSize})`);
  assert(typography.titleFontWeight === '500', `Card title font-weight is 500 (got ${typography.titleFontWeight})`);
  assert(typography.liFontSize === '12px', `List item font-size is 12px (got ${typography.liFontSize})`);
  assert(typography.liFontWeight === '400', `List item font-weight is 400 (strict 400 rule) (got ${typography.liFontWeight})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'generative-ui-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-126-generative-ui-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="generative-card"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'generative-ui-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: Diagram ---
  console.log('\n--- Auditing Diagram Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-126-generative-ui-aui--diagram&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="card-diagram"]');
  const hasDiagram = await page.$('[data-slot="card-diagram"]');
  assert(Boolean(hasDiagram), 'Generative diagram node is rendered');

  // --- Story 3: Map / Itinerary ---
  console.log('\n--- Auditing Map Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-126-generative-ui-aui--map&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="map-itinerary"]');

  const rows = await page.$$('[data-slot="itinerary-row"]');
  assert(rows.length === 3, `3 itinerary stops rendered (Lisbon, Porto, Madrid) (got ${rows.length})`);

  const cityNameTypography = await page.$eval('[data-slot="city-name"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(cityNameTypography.fontSize === '12px', `City name font-size is 12px (got ${cityNameTypography.fontSize})`);
  assert(cityNameTypography.fontWeight === '400', `City name font-weight is 400 (strict 400 rule) (got ${cityNameTypography.fontWeight})`);

  // Screenshot Map
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'generative-ui-map-dark.png'),
    fullPage: true,
  });

  // --- Story 4: Interactive Selection ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-126-generative-ui-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="itinerary-row"]');

  // Click on Lisbon row
  await page.click('[data-city="Lisbon"]');
  await page.waitForTimeout(100);

  const isLisbonSelected = await page.$eval('[data-city="Lisbon"]', el => el.classList.contains('is-selected'));
  assert(isLisbonSelected === true, 'Clicking itinerary row activates selection background (.is-selected)');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'generative-ui-interactive-dark.png'),
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
