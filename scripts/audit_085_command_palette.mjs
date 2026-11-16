import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #085 COMMAND PALETTE ---');
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
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="command-palette"]');

  const palette = page.locator('[data-slot="command-palette"]');
  const paletteBox = await palette.boundingBox();
  const paletteStyles = await palette.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      overflow: s.overflow,
    };
  });

  assert(Math.round(paletteBox.width) === 384, `Palette max-width is 384px (w-sm) (got ${Math.round(paletteBox.width)}px)`);
  assert(paletteStyles.borderRadius === '20px', `Palette border radius is 20px (got ${paletteStyles.borderRadius})`);
  assert(paletteStyles.overflow === 'hidden', `Palette overflow is hidden`);

  // Search icon
  const icon = page.locator('.ds-cmd-palette-icon svg');
  const iconBox = await icon.boundingBox();
  assert(Math.round(iconBox.width) === 14 && Math.round(iconBox.height) === 14, `Search icon is 14x14px (got ${Math.round(iconBox.width)}x${Math.round(iconBox.height)}px)`);

  // Input typography
  const inputStyles = await page.locator('[data-slot="command-palette-input"]').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(inputStyles.fontSize === '13.5px' && inputStyles.fontWeight === '400', `Input typography is 13.5px/400 (got ${inputStyles.fontSize}/${inputStyles.fontWeight})`);

  // Esc badge
  const escBadge = page.locator('.ds-cmd-palette-header .ds-cmd-palette-kbd');
  const escStyles = await escBadge.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(escStyles.fontSize === '10px' && escStyles.fontWeight === '400', `Esc badge is 10px/400 mono (got ${escStyles.fontSize}/${escStyles.fontWeight})`);

  // Default item count
  const itemsCount = await page.locator('[data-slot="command-palette-item"]').count();
  assert(itemsCount === 5, `Default shows 5 commands (got ${itemsCount})`);

  // Command label typography (Strict 400 Rule)
  const labelStyles = await page.locator('.ds-cmd-palette-label').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(labelStyles.fontSize === '13px' && labelStyles.fontWeight === '400', `Command label is 13px/400 (got ${labelStyles.fontSize}/${labelStyles.fontWeight})`);

  // Group header typography
  const groupStyles = await page.locator('.ds-cmd-palette-group-title').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(groupStyles.fontSize === '11px' && groupStyles.fontWeight === '400', `Group header is 11px/400 mono (got ${groupStyles.fontSize}/${groupStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-default-dark.png') });

  // 2. Filtered State
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--filtered&globals=theme:dark`);
  await page.waitForSelector('[data-slot="command-palette"]');

  const filteredItemsCount = await page.locator('[data-slot="command-palette-item"]').count();
  assert(filteredItemsCount === 2, `Filtered state narrows to 2 matching thread commands (got ${filteredItemsCount})`);

  const activeSelected = await page.locator('[data-slot="command-palette-item"][data-id="search"]').getAttribute('aria-selected');
  assert(activeSelected === 'true', `Command #search is active selected`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-filtered-dark.png') });

  // 3. No Matches State
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--no-matches&globals=theme:dark`);
  await page.waitForSelector('[data-slot="command-palette"]');

  const noMatchesCount = await page.locator('[data-slot="command-palette-item"]').count();
  assert(noMatchesCount === 0, `No matches state renders 0 commands (got ${noMatchesCount})`);

  const emptyText = await page.locator('[data-slot="command-palette-empty"]').textContent();
  assert(emptyText.includes('No command matches “deploy to staging”'), `Empty notice displayed properly (got "${emptyText.trim()}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-nomatches-dark.png') });

  // 4. Long Content State
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="command-palette"]');

  const longCount = await page.locator('[data-slot="command-palette-item"]').count();
  assert(longCount === 13, `Long content renders 13 commands (got ${longCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-longcontent-dark.png') });

  // 5. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="command-palette"]');

  // Click 'Switch model'
  await page.locator('[data-slot="command-palette-item"][data-id="model"]').click();
  const executedText = await page.locator('[data-slot="executed-action"] strong').textContent();
  assert(executedText === 'Switch model', `Clicking command updates executed status to 'Switch model'`);

  // Type in search input
  await page.fill('[data-slot="command-palette-input"]', 'stop');
  const countAfterSearch = await page.locator('[data-slot="command-palette-item"]').count();
  assert(countAfterSearch === 1, `Searching 'stop' filters to 1 command (got ${countAfterSearch})`);

  // Reset
  await page.click('[data-btn-reset]');
  const countAfterReset = await page.locator('[data-slot="command-palette-item"]').count();
  assert(countAfterReset === 5, `Reset restores full command list (got ${countAfterReset})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-interactive-dark.png') });

  // 6. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-85-command-palette--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="command-palette"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'command-palette-default-light.png') });

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
