import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #076 SLASH COMMANDS ---');
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
  await page.goto(`${BASE_URL}?id=default-application-76-slash-commands--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  const menu = page.locator('[data-slot="composer-menu"]');
  const menuBox = await menu.boundingBox();
  const menuStyles = await menu.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(menuBox.width === 288, `Menu width is 288px (w-72) (got ${menuBox.width}px)`);
  assert(menuStyles.borderRadius === '16px', `Menu border radius is 16px (--radius-2xl) (got ${menuStyles.borderRadius})`);
  assert(menuStyles.padding === '6px', `Menu padding is 6px (got ${menuStyles.padding})`);

  const itemsCount = await page.locator('[data-slot="composer-menu-item"]').count();
  assert(itemsCount === 4, `Default shows 4 slash commands (got ${itemsCount})`);

  // Item typography
  const nameStyles = await page.locator('.ds-composer-cmd-name').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13.5px' && (nameStyles.fontWeight === '500' || nameStyles.fontWeight === '600'), `Command name is 13.5px/500 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  const descStyles = await page.locator('.ds-composer-cmd-desc').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(descStyles.fontSize === '12px' && descStyles.fontWeight === '400', `Command description is 12px/400 (got ${descStyles.fontSize}/${descStyles.fontWeight})`);

  const kbdCount = await page.locator('.ds-composer-cmd-kbd').count();
  assert(kbdCount === 1, `Active command has return key kbd hint`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-slash-commands-default-dark.png') });

  // 2. Filtered State (/re)
  await page.goto(`${BASE_URL}?id=default-application-76-slash-commands--filtered&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  const filteredCount = await page.locator('[data-slot="composer-menu-item"]').count();
  assert(filteredCount === 1, `Filtered state narrows to 1 command (got ${filteredCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-slash-commands-filtered-dark.png') });

  // 3. No Matches State (/deploy)
  await page.goto(`${BASE_URL}?id=default-application-76-slash-commands--no-matches&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer"]');

  const noMenuCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(noMenuCount === 0, `No matches state hides the menu (got ${noMenuCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-slash-commands-nomatches-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-76-slash-commands--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  // Click on first command (/review)
  await page.locator('[data-slot="composer-menu-item"]').first().click();

  const inputValueAfterClick = await page.locator('[data-slot="composer-input"]').inputValue();
  assert(inputValueAfterClick === '/review ', `Clicking command populates input with '/review ' (got "${inputValueAfterClick}")`);

  const menuClosedCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(menuClosedCount === 0, `Menu closes after selecting command`);

  // Click Reset
  await page.click('[data-btn-reset]');
  const menuReopenedCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(menuReopenedCount === 1, `Reset restores / and re-opens menu`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-slash-commands-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-76-slash-commands--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-menu"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-slash-commands-default-light.png') });

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
