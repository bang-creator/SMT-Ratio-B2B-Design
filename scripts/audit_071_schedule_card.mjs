import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #071 SCHEDULE CARD ---');
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

  // 1. Default Dark State (Enabled)
  await page.goto(`${BASE_URL}?id=default-application-71-schedule-card--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="schedule-card"]');

  const card = page.locator('[data-slot="schedule-card"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await card.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(cardBox.width <= 385 && cardBox.width >= 380, `Card width is ~384px (got ${cardBox.width}px)`);
  assert(cardStyles.borderRadius === '16px', `Card border radius is 16px (--radius-2xl) (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);

  // Icon Badge
  const iconBadge = page.locator('.ds-schedule-card__icon-badge');
  const badgeBox = await iconBadge.boundingBox();
  const badgeStyles = await iconBadge.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius };
  });
  assert(badgeBox.width === 28 && badgeBox.height === 28, `Icon badge is 28x28px (got ${badgeBox.width}x${badgeBox.height})`);
  assert(badgeStyles.borderRadius === '8px', `Icon badge radius is 8px (--radius-md) (got ${badgeStyles.borderRadius})`);

  // Name & Cadence
  const nameStyles = await page.locator('.ds-schedule-card__name').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13.5px' && (nameStyles.fontWeight === '500' || nameStyles.fontWeight === '600'), `Name is 13.5px/500 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  const cadenceStyles = await page.locator('.ds-schedule-card__cadence').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(cadenceStyles.fontSize === '11px' && cadenceStyles.fontWeight === '400', `Cadence is 11px/400 mono (got ${cadenceStyles.fontSize}/${cadenceStyles.fontWeight})`);

  // Switch
  const switchBtn = page.locator('.ds-schedule-card__switch');
  const switchBox = await switchBtn.boundingBox();
  assert(switchBox.width === 36 && switchBox.height === 20, `Switch is 36x20px (got ${switchBox.width}x${switchBox.height})`);

  const thumb = page.locator('.ds-schedule-card__switch-thumb');
  const thumbBox = await thumb.boundingBox();
  assert(thumbBox.width === 16 && thumbBox.height === 16, `Switch thumb is 16x16px (got ${thumbBox.width}x${thumbBox.height})`);

  // Next Run
  const nextVal = await page.locator('.ds-schedule-card__next-val').innerText();
  assert(nextVal.includes('Tomorrow'), `Next run displays upcoming time when enabled (got "${nextVal}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'schedule-card-default-dark.png') });

  // 2. Paused State
  await page.goto(`${BASE_URL}?id=default-application-71-schedule-card--paused&globals=theme:dark`);
  await page.waitForSelector('[data-slot="schedule-card"]');

  const pausedOpacity = await page.locator('.ds-schedule-card__next').evaluate((el) => window.getComputedStyle(el).opacity);
  assert(parseFloat(pausedOpacity) <= 0.5 && parseFloat(pausedOpacity) >= 0.4, `Next run row is dimmed (opacity ~0.45) when paused (got ${pausedOpacity})`);

  const pausedVal = await page.locator('.ds-schedule-card__next-val').innerText();
  assert(pausedVal === 'paused', `Next run text displays 'paused' (got "${pausedVal}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'schedule-card-paused-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-71-schedule-card--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-schedule-card');

  // Toggle switch to paused
  await page.click('.ds-schedule-card__switch');
  const isAriaCheckedFalse = await page.locator('.ds-schedule-card__switch').getAttribute('aria-checked');
  assert(isAriaCheckedFalse === 'false', `Clicking switch toggles aria-checked to false`);

  const nextValAfterPause = await page.locator('.ds-schedule-card__next-val').innerText();
  assert(nextValAfterPause === 'paused', `Next run toggles to paused`);

  // Toggle switch back to active
  await page.click('.ds-schedule-card__switch');
  const isAriaCheckedTrue = await page.locator('.ds-schedule-card__switch').getAttribute('aria-checked');
  assert(isAriaCheckedTrue === 'true', `Clicking switch toggles aria-checked back to true`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'schedule-card-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-71-schedule-card--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="schedule-card"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'schedule-card-default-light.png') });

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
