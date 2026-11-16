import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #084 PROMPT LIBRARY ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 800 });

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // 1. Default Dark State
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  const card = page.locator('[data-slot="prompt-library"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await card.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
      gap: s.gap,
    };
  });

  assert(Math.round(cardBox.width) === 384, `Card max-width is 384px (w-sm) (got ${Math.round(cardBox.width)}px)`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (--radius-2xl) (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '12px', `Card padding is 12px (got ${cardStyles.padding})`);
  assert(cardStyles.gap === '8px', `Card gap is 8px (got ${cardStyles.gap})`);

  // Search input
  const icon = page.locator('.ds-prompt-search-icon svg');
  const iconBox = await icon.boundingBox();
  assert(Math.round(iconBox.width) === 14 && Math.round(iconBox.height) === 14, `Bookmark icon is 14x14px (got ${Math.round(iconBox.width)}x${Math.round(iconBox.height)}px)`);

  const inputStyles = await page.locator('[data-slot="prompt-search-input"]').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(inputStyles.fontSize === '13px' && inputStyles.fontWeight === '400', `Search input typography is 13px/400 (got ${inputStyles.fontSize}/${inputStyles.fontWeight})`);

  // Listbox items
  const itemsCount = await page.locator('[data-slot="prompt-item"]').count();
  assert(itemsCount === 3, `Default shows 3 prompts (got ${itemsCount})`);

  const nameStyles = await page.locator('.ds-prompt-item-name').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13px' && nameStyles.fontWeight === '400', `Prompt name is 13px/400 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  // Preview card
  const previewCount = await page.locator('[data-slot="prompt-preview"]').count();
  assert(previewCount === 1, `Default state displays selected prompt preview card`);

  const bodyStyles = await page.locator('.ds-prompt-preview-body').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(bodyStyles.fontSize === '12px' && bodyStyles.fontWeight === '400', `Preview body typography is 12px/400 (got ${bodyStyles.fontSize}/${bodyStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-default-dark.png') });

  // 2. Filtered State
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--filtered&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  const filteredItemsCount = await page.locator('[data-slot="prompt-item"]').count();
  assert(filteredItemsCount === 1, `Filtered state narrows to 1 prompt (got ${filteredItemsCount})`);

  const filteredPreviewText = await page.locator('.ds-prompt-preview-body').textContent();
  assert(filteredPreviewText.includes('Write a patch changeset'), `Filtered state previews matching prompt body`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-filtered-dark.png') });

  // 3. No Matches State
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--no-matches&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  const noMatchesCount = await page.locator('[data-slot="prompt-item"]').count();
  assert(noMatchesCount === 0, `No matches state renders 0 list items (got ${noMatchesCount})`);

  const emptyText = await page.locator('[data-slot="prompt-empty"]').textContent();
  assert(emptyText.includes('Nothing matches “deploy checklist”'), `Empty state displays matching notice (got "${emptyText}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-nomatches-dark.png') });

  // 4. No Selection State
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--no-selection&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  const noSelPreviewCount = await page.locator('[data-slot="prompt-preview"]').count();
  assert(noSelPreviewCount === 0, `No selection state hides preview card (got ${noSelPreviewCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-noselection-dark.png') });

  // 5. Long Content State
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  const varChipsCount = await page.locator('.ds-prompt-var-tag').count();
  assert(varChipsCount === 5, `Long content renders 5 variable chips (got ${varChipsCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-longcontent-dark.png') });

  // 6. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="prompt-library"]');

  // Click second prompt (Write a changeset)
  await page.locator('[data-slot="prompt-item"][data-id="2"]').click();
  const activePromptText = await page.locator('.ds-prompt-preview-body').textContent();
  assert(activePromptText.includes('Write a patch changeset'), `Clicking prompt #2 updates preview card`);

  // Type in search
  await page.fill('[data-slot="prompt-search-input"]', 'Explain');
  const countAfterType = await page.locator('[data-slot="prompt-item"]').count();
  assert(countAfterType === 1, `Typing 'Explain' filters to 1 prompt (got ${countAfterType})`);

  // Reset
  await page.click('[data-btn-reset]');
  const countAfterReset = await page.locator('[data-slot="prompt-item"]').count();
  assert(countAfterReset === 3, `Reset restores full prompt list of 3 items (got ${countAfterReset})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-interactive-dark.png') });

  // 7. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-84-prompt-library--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="prompt-library"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'prompt-library-default-light.png') });

  console.log(`\nRESULT: ${passed}/${total} assertions passed.`);
  await browser.close();

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
