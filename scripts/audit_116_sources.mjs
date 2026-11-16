import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #116: Sources AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-116-sources-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="sources"]');

  const trigger = await page.$('.ds-sources-trigger');
  const triggerStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      height: cs.height,
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  }, trigger);

  assert(triggerStyles.height === '28px', `Trigger height is compact 28px (got ${triggerStyles.height})`);
  assert(parseInt(triggerStyles.borderRadius, 10) >= 14, `Trigger has pill border-radius (got ${triggerStyles.borderRadius})`);
  assert(triggerStyles.fontSize === '12px', `Trigger font-size is 12px (got ${triggerStyles.fontSize})`);
  assert(triggerStyles.fontWeight === '400', `Trigger font-weight is 400 (strict 400 rule) (got ${triggerStyles.fontWeight})`);

  // Count badges
  const badges = await page.$$('[data-slot="sources-badge"]');
  assert(badges.length === 3, `Trigger renders 3 domain badges (got ${badges.length})`);

  // Count mono tabular-nums
  const countText = await page.$eval('[data-slot="sources-count"]', el => el.textContent.trim());
  assert(countText === '4', `Sources count displays 4 (got ${countText})`);

  // Grid layout inspection
  const cards = await page.$$('[data-slot="source-card"]');
  assert(cards.length === 4, `4 source cards rendered (got ${cards.length})`);

  // Card typography
  const firstCardStyles = await page.evaluate(() => {
    const title = document.querySelector('.ds-source-card__title');
    const snippet = document.querySelector('.ds-source-card__snippet');
    const csTitle = window.getComputedStyle(title);
    const csSnippet = window.getComputedStyle(snippet);
    return {
      titleFontSize: csTitle.fontSize,
      titleFontWeight: csTitle.fontWeight,
      snippetFontSize: csSnippet.fontSize,
      snippetFontWeight: csSnippet.fontWeight,
    };
  });

  assert(firstCardStyles.titleFontSize === '13px', `Source card title font-size is 13px (got ${firstCardStyles.titleFontSize})`);
  assert(firstCardStyles.titleFontWeight === '400', `Source card title font-weight is 400 (strict 400 rule) (got ${firstCardStyles.titleFontWeight})`);
  assert(firstCardStyles.snippetFontSize === '12px', `Source card snippet font-size is 12px (got ${firstCardStyles.snippetFontSize})`);
  assert(firstCardStyles.snippetFontWeight === '400', `Source card snippet font-weight is 400 (strict 400 rule) (got ${firstCardStyles.snippetFontWeight})`);

  // Anchor attributes
  const firstCardTag = await page.$eval('[data-slot="source-card"]', el => ({
    tagName: el.tagName.toLowerCase(),
    target: el.getAttribute('target'),
    rel: el.getAttribute('rel'),
  }));
  assert(firstCardTag.tagName === 'a', `Source card is an anchor link (got <${firstCardTag.tagName}>)`);
  assert(firstCardTag.target === '_blank', `Anchor has target="_blank" (got ${firstCardTag.target})`);
  assert(firstCardTag.rel.includes('noopener'), `Anchor has rel="noopener noreferrer" (got ${firstCardTag.rel})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'sources-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-116-sources-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="sources"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'sources-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: ListView ---
  console.log('\n--- Auditing ListView Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-116-sources-aui--list-view&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('.ds-sources-list');
  const isListPresent = await page.$eval('.ds-sources-list', el => Boolean(el));
  assert(isListPresent, 'List view container .ds-sources-list is rendered');

  // --- Story 3: UnsafeOrUntrusted ---
  console.log('\n--- Auditing UnsafeOrUntrusted Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-116-sources-aui--unsafe-or-untrusted&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="source-card"]');
  const unsafeTag = await page.$eval('[data-slot="source-card"]', el => el.tagName.toLowerCase());
  assert(unsafeTag === 'div', `Unsafe javascript: URL is rendered safely as <div>, not <a> (got <${unsafeTag}>)`);

  // --- Story 4: Interactive Toggle ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-116-sources-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="toggle-sources"]');

  const initialExpanded = await page.$eval('[data-action="toggle-sources"]', el => el.getAttribute('aria-expanded'));
  const initialPanelCollapsed = await page.$eval('[data-slot="sources-panel"]', el => el.classList.contains('is-collapsed'));
  assert(initialExpanded === 'false', `Initial interactive state has aria-expanded="false" (got ${initialExpanded})`);
  assert(initialPanelCollapsed === true, `Initial interactive panel is collapsed (got ${initialPanelCollapsed})`);

  // Click trigger to expand
  await page.click('[data-action="toggle-sources"]');
  await page.waitForTimeout(250);

  const afterClickExpanded = await page.$eval('[data-action="toggle-sources"]', el => el.getAttribute('aria-expanded'));
  const afterClickPanelCollapsed = await page.$eval('[data-slot="sources-panel"]', el => el.classList.contains('is-collapsed'));
  assert(afterClickExpanded === 'true', `After click, aria-expanded is "true" (got ${afterClickExpanded})`);
  assert(afterClickPanelCollapsed === false, `After click, panel is visible (got ${afterClickPanelCollapsed})`);

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'sources-interactive-dark.png'),
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
