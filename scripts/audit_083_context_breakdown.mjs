import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #083 CONTEXT BREAKDOWN ---');
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
  await page.goto(`${BASE_URL}?id=default-application-83-context-breakdown--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-breakdown"]');

  const card = page.locator('[data-slot="context-breakdown"]');
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
  assert(cardStyles.padding === '16px', `Card padding is 16px (got ${cardStyles.padding})`);
  assert(cardStyles.gap === '12px', `Card gap is 12px (got ${cardStyles.gap})`);

  // Meter track
  const track = page.locator('.ds-context-meter-track');
  const trackBox = await track.boundingBox();
  const trackStyles = await track.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius };
  });
  assert(Math.round(trackBox.height) === 8, `Meter track height is 8px (h-2) (got ${Math.round(trackBox.height)}px)`);
  assert(parseInt(trackStyles.borderRadius, 10) >= 4, `Meter track radius is full pill (got ${trackStyles.borderRadius})`);

  // Typography (Strict 400 Rule)
  const titleStyles = await page.locator('.ds-context-breakdown-title').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(titleStyles.fontSize === '13.5px' && (titleStyles.fontWeight === '500' || titleStyles.fontWeight === '600'), `Title typography is 13.5px/500 (got ${titleStyles.fontSize}/${titleStyles.fontWeight})`);

  const usageStyles = await page.locator('[data-slot="context-breakdown-usage"]').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(usageStyles.fontSize === '11px' && usageStyles.fontWeight === '400', `Usage typography is 11px/400 (got ${usageStyles.fontSize}/${usageStyles.fontWeight})`);

  const labelStyles = await page.locator('.ds-context-legend-label').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(labelStyles.fontSize === '13px' && labelStyles.fontWeight === '400', `Legend label typography is 13px/400 (got ${labelStyles.fontSize}/${labelStyles.fontWeight})`);

  const dot = page.locator('.ds-context-legend-dot').first();
  const dotBox = await dot.boundingBox();
  assert(Math.round(dotBox.width) === 8 && Math.round(dotBox.height) === 8, `Legend dot is 8x8px (got ${Math.round(dotBox.width)}x${Math.round(dotBox.height)}px)`);

  const headroomText = await page.locator('[data-slot="context-headroom-val"]').textContent();
  assert(headroomText === '122,000', `Fresh thread headroom is 122,000 (got "${headroomText}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-breakdown-default-dark.png') });

  // 2. Warning State
  await page.goto(`${BASE_URL}?id=default-application-83-context-breakdown--warning&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-breakdown"]');

  const warnAttr = await page.locator('[data-slot="context-breakdown-usage"]').getAttribute('data-warn');
  assert(warnAttr === 'true', `Warning state has data-warn="true"`);

  const warnColor = await page.locator('[data-slot="context-breakdown-usage"]').evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  // Amber color in dark theme is rgb(251, 191, 36) (#fbbf24) and in light is rgb(245, 158, 11) (#f59e0b)
  assert(warnColor.includes('251, 191, 36') || warnColor.includes('245, 158, 11') || warnColor.includes('217, 119, 6'), `Warning usage text uses amber series quaternary token (got ${warnColor})`);

  const warnHeadroom = await page.locator('[data-slot="context-headroom-val"]').textContent();
  assert(warnHeadroom === '5,300', `Warning state headroom drops to 5,300 (got "${warnHeadroom}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-breakdown-warning-dark.png') });

  // 3. Overflow State
  await page.goto(`${BASE_URL}?id=default-application-83-context-breakdown--overflow&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-breakdown"]');

  const overflowHeadroom = await page.locator('[data-slot="context-headroom-val"]').textContent();
  assert(overflowHeadroom === '0', `Overflow state headroom reads 0 (got "${overflowHeadroom}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-breakdown-overflow-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-83-context-breakdown--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="context-breakdown"]');

  // Click Near limit
  await page.click('[data-btn-preset="warning"]');
  const interWarnUsage = await page.locator('[data-slot="context-breakdown-usage"]').textContent();
  assert(interWarnUsage.includes('122,700 / 128,000'), `Switching to Near limit displays 122,700 (got "${interWarnUsage.trim()}")`);

  // Click Over limit
  await page.click('[data-btn-preset="overflow"]');
  const interOverHeadroom = await page.locator('[data-slot="context-headroom-val"]').textContent();
  assert(interOverHeadroom === '0', `Switching to Over limit sets headroom to 0`);

  // Click Fresh thread
  await page.click('[data-btn-preset="empty"]');
  const interFreshHeadroom = await page.locator('[data-slot="context-headroom-val"]').textContent();
  assert(interFreshHeadroom === '122,000', `Switching back to Fresh thread restores headroom to 122,000`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-breakdown-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-83-context-breakdown--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="context-breakdown"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'context-breakdown-default-light.png') });

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
