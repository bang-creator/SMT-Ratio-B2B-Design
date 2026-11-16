import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #077 COMPOSER MENTIONS ---');
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
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--default&globals=theme:dark`);
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

  const itemsCount = await page.locator('[data-slot="composer-person-item"]').count();
  assert(itemsCount === 4, `Default shows 4 person items (got ${itemsCount})`);

  // Avatar initial circle
  const avatar = page.locator('.ds-composer-person-avatar').first();
  const avatarBox = await avatar.boundingBox();
  const avatarStyles = await avatar.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      textTransform: s.textTransform,
    };
  });
  assert(avatarBox.width === 20 && avatarBox.height === 20, `Avatar size is 20x20px (got ${avatarBox.width}x${avatarBox.height}px)`);
  assert(avatarStyles.borderRadius === '9999px', `Avatar radius is full pill (got ${avatarStyles.borderRadius})`);
  assert(avatarStyles.fontSize === '9px', `Avatar font size is 9px (got ${avatarStyles.fontSize})`);

  // Person name typography (Strict 400 Rule)
  const nameStyles = await page.locator('.ds-composer-person-name').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13.5px' && nameStyles.fontWeight === '400', `Person name is 13.5px/400 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  // Person role typography
  const roleStyles = await page.locator('.ds-composer-person-role').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(roleStyles.fontSize === '11px' && roleStyles.fontWeight === '400', `Person role is 11px/400 (got ${roleStyles.fontSize}/${roleStyles.fontWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-default-dark.png') });

  // 2. Filtered State (@Ma)
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--filtered&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  const filteredCount = await page.locator('[data-slot="composer-person-item"]').count();
  assert(filteredCount === 2, `Filtered state narrows to 2 items (Mara, Max) (got ${filteredCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-filtered-dark.png') });

  // 3. No Matches State (@Zoe)
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--no-matches&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer"]');

  const noMenuCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(noMenuCount === 0, `No matches state hides the menu (got ${noMenuCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-nomatches-dark.png') });

  // 4. Long Content State
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');
  const longCount = await page.locator('[data-slot="composer-person-item"]').count();
  assert(longCount === 2, `Long content displays 2 long-named items (got ${longCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-longcontent-dark.png') });

  // 5. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-menu"]');

  // Click on first person (Mara)
  await page.locator('[data-slot="composer-person-item"]').first().click();

  const inputValueAfterClick = await page.locator('[data-slot="composer-input"]').inputValue();
  assert(inputValueAfterClick === 'Loop in @Mara ', `Clicking person populates input with 'Loop in @Mara ' (got "${inputValueAfterClick}")`);

  const menuClosedCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(menuClosedCount === 0, `Menu closes after selecting person`);

  // Click Reset
  await page.click('[data-btn-reset]');
  const menuReopenedCount = await page.locator('[data-slot="composer-menu"]').count();
  assert(menuReopenedCount === 1, `Reset restores @ and re-opens menu`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-interactive-dark.png') });

  // 6. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-77-mentions--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-menu"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-mentions-default-light.png') });

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
