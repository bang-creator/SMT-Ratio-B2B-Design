import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #067 AGENT CARD ---');
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
  await page.goto(`${BASE_URL}?id=default-application-67-agent-card--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="agent-card"]');

  const card = await page.locator('[data-slot="agent-card"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await card.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
      maxWidth: s.maxWidth,
      width: s.width,
      backgroundColor: s.backgroundColor,
      borderColor: s.borderColor,
    };
  });

  assert(cardBox.width <= 385 && cardBox.width >= 380, `Card width is ~384px (got ${cardBox.width}px)`);
  assert(cardStyles.borderRadius === '20px', `Card border radius is 20px (--radius-2xl) (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);

  // Header and Icon Box
  const iconBox = page.locator('.ds-agent-card__icon-box');
  const iconBoxStyles = await iconBox.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      width: s.width,
      height: s.height,
      borderRadius: s.borderRadius,
    };
  });
  assert(iconBoxStyles.width === '36px' && iconBoxStyles.height === '36px', `Icon box is 36x36px (got ${iconBoxStyles.width}x${iconBoxStyles.height})`);
  assert(iconBoxStyles.borderRadius === '12px', `Icon box radius is 12px (--radius-xl) (got ${iconBoxStyles.borderRadius})`);

  // Title and Typography
  const nameStyles = await page.locator('.ds-agent-card__name').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(nameStyles.fontSize === '13.5px' && (nameStyles.fontWeight === '500' || nameStyles.fontWeight === '600'), `Agent name is 13.5px/500 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);

  const versionStyles = await page.locator('.ds-agent-card__version').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(versionStyles.fontSize === '12px' && versionStyles.fontWeight === '400', `Agent version is 12px/400 (got ${versionStyles.fontSize}/${versionStyles.fontWeight})`);

  const descStyles = await page.locator('.ds-agent-card__description').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(descStyles.fontSize === '12px' && descStyles.fontWeight === '400', `Agent description is 12px/400 (got ${descStyles.fontSize}/${descStyles.fontWeight})`);

  // Connect Button
  const btn = page.locator('.ds-agent-card__btn--connect');
  const btnStyles = await btn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      height: s.height,
      borderRadius: s.borderRadius,
      fontWeight: s.fontWeight,
    };
  });
  assert(btnStyles.height === '32px', `Connect button is 32px height (got ${btnStyles.height})`);
  assert(parseInt(btnStyles.borderRadius) >= 16, `Connect button is full pill radius (got ${btnStyles.borderRadius})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-card-default-dark.png') });

  // 2. Connected Dark State
  await page.goto(`${BASE_URL}?id=default-application-67-agent-card--connected&globals=theme:dark`);
  await page.waitForSelector('[data-slot="agent-card"]');
  const connectedBtn = page.locator('.ds-agent-card__btn--connected');
  const isConnDisabled = await connectedBtn.isDisabled();
  assert(isConnDisabled === true, `Connected button is disabled`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-card-connected-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-67-agent-card--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-agent-card-interactive-wrapper');

  // Click Connect
  await page.click('[data-btn-connect]');
  await page.waitForSelector('[data-btn-disconnect]');
  const isNowConnected = await page.locator('.ds-agent-card__btn--connected').count();
  assert(isNowConnected === 1, `Interactive click Connect switches to connected state`);

  // Click Disconnect
  await page.click('[data-btn-disconnect]');
  await page.waitForSelector('[data-btn-connect]');
  const isNowDisconnected = await page.locator('.ds-agent-card__btn--connect').count();
  assert(isNowDisconnected === 1, `Interactive click Disconnect switches back to connect state`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-card-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-67-agent-card--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="agent-card"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-card-default-light.png') });

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
