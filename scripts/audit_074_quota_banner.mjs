import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #074 QUOTA BANNER ---');
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
  await page.goto(`${BASE_URL}?id=default-application-74-quota-banner--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="quota-banner"]');

  const banner = page.locator('[data-slot="quota-banner"]');
  const bannerBox = await banner.boundingBox();
  const bannerStyles = await banner.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(bannerBox.width <= 385 && bannerBox.width >= 380, `Banner width is ~384px (got ${bannerBox.width}px)`);
  assert(bannerStyles.borderRadius === '16px', `Banner border radius is 16px (--radius-2xl) (got ${bannerStyles.borderRadius})`);
  assert(bannerStyles.padding === '14px', `Banner padding is 14px (got ${bannerStyles.padding})`);

  // Left count & Resets in
  const leftStyles = await page.locator('.ds-quota-banner__left').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(leftStyles.fontSize === '13.5px' && (leftStyles.fontWeight === '500' || leftStyles.fontWeight === '600'), `Left count is 13.5px/500 (got ${leftStyles.fontSize}/${leftStyles.fontWeight})`);

  const resetsStyles = await page.locator('.ds-quota-banner__resets').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(resetsStyles.fontSize === '11px' && resetsStyles.fontWeight === '400', `Resets in is 11px/400 mono (got ${resetsStyles.fontSize}/${resetsStyles.fontWeight})`);

  // Track & Fill
  const trackStyles = await page.locator('.ds-quota-banner__track').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, borderRadius: s.borderRadius };
  });
  assert(trackStyles.height === '4px', `Track height is 4px (got ${trackStyles.height})`);

  // Footer & Button
  const btn = page.locator('.ds-quota-banner__btn');
  const btnStyles = await btn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      height: s.height,
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  });
  assert(btnStyles.height === '28px', `Upgrade button is 28px height (got ${btnStyles.height})`);
  assert(parseInt(btnStyles.borderRadius) >= 14, `Upgrade button is full pill radius (got ${btnStyles.borderRadius})`);
  assert(btnStyles.fontSize === '12px', `Upgrade button font size is 12px (got ${btnStyles.fontSize})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quota-banner-default-dark.png') });

  // 2. Tight State (Amber)
  await page.goto(`${BASE_URL}?id=default-application-74-quota-banner--tight&globals=theme:dark`);
  await page.waitForSelector('[data-slot="quota-banner"]');

  const tightBar = page.locator('.ds-quota-banner__bar--tight');
  const hasTightBar = await tightBar.count();
  assert(hasTightBar === 1, `Tight state applies amber bar modifier`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quota-banner-tight-dark.png') });

  // 3. Exhausted State (Red)
  await page.goto(`${BASE_URL}?id=default-application-74-quota-banner--exhausted&globals=theme:dark`);
  await page.waitForSelector('[data-slot="quota-banner"]');

  const exhaustedBar = page.locator('.ds-quota-banner__bar--exhausted');
  const hasExhaustedBar = await exhaustedBar.count();
  assert(hasExhaustedBar === 1, `Exhausted state applies danger red bar modifier`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quota-banner-exhausted-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-74-quota-banner--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-quota-banner');

  const state1 = await page.locator('[data-slot="quota-banner"]').getAttribute('data-state');
  assert(state1 === 'normal', `Interactive starts at normal state`);

  await page.click('[data-btn-step]');
  const state2 = await page.locator('[data-slot="quota-banner"]').getAttribute('data-state');
  assert(state2 === 'tight', `Step advances to tight state`);

  await page.click('[data-btn-step]');
  const state3 = await page.locator('[data-slot="quota-banner"]').getAttribute('data-state');
  assert(state3 === 'exhausted', `Step advances to exhausted state`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quota-banner-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-74-quota-banner--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="quota-banner"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'quota-banner-default-light.png') });

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
