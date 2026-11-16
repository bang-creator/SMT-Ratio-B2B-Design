import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #119: Model selector AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-119-model-selector-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="model-selector-trigger"]');

  const triggerStyles = await page.$eval('[data-slot="model-selector-trigger"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      height: cs.height,
      borderRadius: cs.borderRadius,
      role: el.getAttribute('role'),
      hasPopup: el.getAttribute('aria-haspopup'),
      expanded: el.getAttribute('aria-expanded'),
    };
  });

  assert(triggerStyles.height === '32px', `Trigger height is compact 32px (got ${triggerStyles.height})`);
  assert(parseInt(triggerStyles.borderRadius, 10) >= 8, `Trigger border-radius is >= 8px (got ${triggerStyles.borderRadius})`);
  assert(triggerStyles.role === 'combobox', `Trigger has role="combobox" (got ${triggerStyles.role})`);
  assert(triggerStyles.hasPopup === 'listbox', `Trigger has aria-haspopup="listbox" (got ${triggerStyles.hasPopup})`);
  assert(triggerStyles.expanded === 'false', `Trigger has initial aria-expanded="false" (got ${triggerStyles.expanded})`);

  // Strict Typography inspection (400 Rule)
  const triggerTextStyles = await page.$eval('[data-slot="trigger-model-name"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(triggerTextStyles.fontSize === '12px', `Trigger name font-size is 12px (got ${triggerTextStyles.fontSize})`);
  assert(triggerTextStyles.fontWeight === '400', `Trigger name font-weight is 400 (strict 400 rule) (got ${triggerTextStyles.fontWeight})`);

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'model-selector-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-119-model-selector-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="model-selector-trigger"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'model-selector-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: OpenPopover ---
  console.log('\n--- Auditing OpenPopover Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-119-model-selector-aui--open-popover&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="model-selector-popover"]');

  const popoverStyles = await page.$eval('[data-slot="model-selector-popover"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      borderRadius: cs.borderRadius,
    };
  });
  assert(popoverStyles.width === '288px', `Popover width is 288px (got ${popoverStyles.width})`);
  assert(parseInt(popoverStyles.borderRadius, 10) >= 12, `Popover border-radius is >= 12px (got ${popoverStyles.borderRadius})`);

  // Item typography check (Strict 400 rule)
  const itemTypography = await page.evaluate(() => {
    const itemName = document.querySelector('.ds-model-selector-item__name');
    const itemDesc = document.querySelector('.ds-model-selector-item__desc');
    const csName = window.getComputedStyle(itemName);
    const csDesc = window.getComputedStyle(itemDesc);
    return {
      nameFontSize: csName.fontSize,
      nameFontWeight: csName.fontWeight,
      descFontSize: csDesc.fontSize,
      descFontWeight: csDesc.fontWeight,
    };
  });
  assert(itemTypography.nameFontSize === '13px', `Model item name font-size is 13px (got ${itemTypography.nameFontSize})`);
  assert(itemTypography.nameFontWeight === '400', `Model item name font-weight is 400 (strict 400 rule) (got ${itemTypography.nameFontWeight})`);
  assert(itemTypography.descFontSize === '11px', `Model item desc font-size is 11px (got ${itemTypography.descFontSize})`);
  assert(itemTypography.descFontWeight === '400', `Model item desc font-weight is 400 (strict 400 rule) (got ${itemTypography.descFontWeight})`);

  // Search input present
  const searchInput = await page.$('[data-slot="model-search-input"]');
  assert(Boolean(searchInput), 'Search input is present in popover');

  // Disabled model item
  const disabledItem = await page.$('.ds-model-selector-item.is-disabled');
  assert(Boolean(disabledItem), 'Disabled model item exists with .is-disabled');

  // --- Story 3: ReasoningEffort ---
  console.log('\n--- Auditing ReasoningEffort Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-119-model-selector-aui--reasoning-effort&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="effort-section"]');

  const effortBadge = await page.$eval('[data-slot="trigger-effort-badge"]', el => el.textContent.trim());
  assert(effortBadge === 'high', `Effort badge in trigger displays "high" (got "${effortBadge}")`);

  const activeEffortBtn = await page.$eval('.ds-model-selector-effort__btn.is-active', el => ({
    effort: el.getAttribute('data-effort'),
    checked: el.getAttribute('aria-checked'),
  }));
  assert(activeEffortBtn.effort === 'high', `Active effort button is "high" (got ${activeEffortBtn.effort})`);
  assert(activeEffortBtn.checked === 'true', `Active effort button has aria-checked="true" (got ${activeEffortBtn.checked})`);

  // --- Story 4: Interactive Toggle, Select, and Effort Switch ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-119-model-selector-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="toggle-popover"]');

  // Initially hidden
  const initialPopoverHidden = await page.$eval('[data-slot="model-selector-popover"]', el => el.classList.contains('is-hidden'));
  assert(initialPopoverHidden === true, 'Popover is initially hidden');

  // Click trigger to open
  await page.click('[data-action="toggle-popover"]');
  await page.waitForTimeout(100);

  const isPopoverOpen = await page.$eval('[data-slot="model-selector-popover"]', el => !el.classList.contains('is-hidden'));
  const triggerExpanded = await page.$eval('[data-action="toggle-popover"]', el => el.getAttribute('aria-expanded'));
  assert(isPopoverOpen === true, 'Popover opens after trigger click');
  assert(triggerExpanded === 'true', 'Trigger has aria-expanded="true" when open');

  // Switch reasoning effort to "Low"
  await page.click('[data-effort="low"]');
  await page.waitForTimeout(100);

  const updatedEffortBadge = await page.$eval('[data-slot="trigger-effort-badge"]', el => el.textContent.trim());
  assert(updatedEffortBadge === 'low', `Trigger effort badge updated to "low" after click (got "${updatedEffortBadge}")`);

  // Select "gpt-4o-mini"
  await page.click('[data-model-id="gpt-4o-mini"]');
  await page.waitForTimeout(100);

  const selectedName = await page.$eval('[data-slot="trigger-model-name"]', el => el.textContent.trim());
  const isClosedAfterSelect = await page.$eval('[data-slot="model-selector-popover"]', el => el.classList.contains('is-hidden'));
  assert(selectedName === 'gpt-4o-mini', `Trigger model name updated to "gpt-4o-mini" (got "${selectedName}")`);
  assert(isClosedAfterSelect === true, 'Popover automatically closed after selecting model');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'model-selector-interactive-dark.png'),
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
