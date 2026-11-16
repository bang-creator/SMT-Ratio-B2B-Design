import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #120: Composer trigger popover AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-120-composer-trigger-popover-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="composer-trigger-popover"]');

  const cardStyles = await page.$eval('[data-slot="composer-trigger-popover"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(cardStyles.maxWidth === '320px', `Card max-width is 320px (got ${cardStyles.maxWidth})`);
  assert(parseInt(cardStyles.borderRadius, 10) >= 12, `Card border-radius is >= 12px (got ${cardStyles.borderRadius})`);
  assert(cardStyles.borderTopWidth === '1px', `Card border is 1px (got ${cardStyles.borderTopWidth})`);

  // Tab category header typography
  const tabStyles = await page.$eval('[data-slot="popover-tab"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      textTransform: cs.textTransform,
    };
  });
  assert(tabStyles.fontSize === '10px', `Category tab font-size is 10px (got ${tabStyles.fontSize})`);
  assert(tabStyles.fontWeight === '400', `Category tab font-weight is 400 (strict 400 rule) (got ${tabStyles.fontWeight})`);
  assert(tabStyles.fontFamily.includes('mono'), `Category tab uses monospace font (got ${tabStyles.fontFamily})`);
  assert(tabStyles.textTransform === 'uppercase', `Category tab is uppercase (got ${tabStyles.textTransform})`);

  // Item typography (Strict 400 Rule)
  const itemStyles = await page.evaluate(() => {
    const label = document.querySelector('[data-slot="item-label"]');
    const desc = document.querySelector('[data-slot="item-desc"]');
    const item = document.querySelector('[data-slot="trigger-item"]');
    const csLabel = window.getComputedStyle(label);
    const csDesc = window.getComputedStyle(desc);
    return {
      labelFontSize: csLabel.fontSize,
      labelFontWeight: csLabel.fontWeight,
      descFontSize: csDesc.fontSize,
      descFontWeight: csDesc.fontWeight,
      role: item.getAttribute('role'),
    };
  });
  assert(itemStyles.labelFontSize === '13px', `Item label font-size is 13px (got ${itemStyles.labelFontSize})`);
  assert(itemStyles.labelFontWeight === '400', `Item label font-weight is 400 (strict 400 rule) (got ${itemStyles.labelFontWeight})`);
  assert(itemStyles.descFontSize === '11px', `Item desc font-size is 11px (got ${itemStyles.descFontSize})`);
  assert(itemStyles.descFontWeight === '400', `Item desc font-weight is 400 (strict 400 rule) (got ${itemStyles.descFontWeight})`);
  assert(itemStyles.role === 'option', `Trigger item has role="option" (got ${itemStyles.role})`);

  // Category counts
  const tabs = await page.$$('[data-slot="popover-tab"]');
  assert(tabs.length === 3, `3 category tabs rendered (Tools, Files, People) (got ${tabs.length})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'composer-trigger-popover-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-120-composer-trigger-popover-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="composer-trigger-popover"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'composer-trigger-popover-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: SlashCommands ---
  console.log('\n--- Auditing SlashCommands Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-120-composer-trigger-popover-aui--slash-commands&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="composer-trigger-popover"]');
  const slashTab = await page.$eval('[data-slot="popover-tab"]', el => el.textContent.trim());
  assert(slashTab === 'Commands', `Category is "Commands" (got "${slashTab}")`);

  // --- Story 3: Interactive Stage ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-120-composer-trigger-popover-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="composer-input"]');

  // Trigger popover by typing "@"
  await page.fill('[data-slot="composer-input"]', 'Tell me about @');
  await page.waitForTimeout(100);

  const isPopoverOpen = await page.$eval('[data-slot="popover-container"]', el => !el.classList.contains('is-hidden'));
  assert(isPopoverOpen === true, 'Popover appears when typing @');

  // Click on "Priya Shah"
  await page.click('[data-id="priya_shah"]');
  await page.waitForTimeout(100);

  const updatedInputValue = await page.$eval('[data-slot="composer-input"]', el => el.value);
  const isPopoverClosed = await page.$eval('[data-slot="popover-container"]', el => el.classList.contains('is-hidden'));
  assert(updatedInputValue.includes('Priya Shah'), `Composer input updated with mention (got "${updatedInputValue}")`);
  assert(isPopoverClosed === true, 'Popover closed after selecting mention');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'composer-trigger-popover-interactive-dark.png'),
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
