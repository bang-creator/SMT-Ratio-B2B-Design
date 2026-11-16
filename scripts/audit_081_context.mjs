import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #081 COMPOSER CONTEXT ---');
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

  // 1. Default Dark State (Popover Open)
  await page.goto(`${BASE_URL}?id=default-application-81-context--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-context-trigger"]');

  const trigger = page.locator('[data-slot="composer-context-trigger"]');
  const triggerBox = await trigger.boundingBox();
  const triggerStyles = await trigger.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius };
  });

  assert(Math.round(triggerBox.width) === 32 && Math.round(triggerBox.height) === 32, `Trigger is 32x32px (got ${Math.round(triggerBox.width)}x${Math.round(triggerBox.height)}px)`);
  assert(parseInt(triggerStyles.borderRadius, 10) >= 16, `Trigger radius is full pill (got ${triggerStyles.borderRadius})`);

  // Ring SVG
  const ringSvg = page.locator('.ds-composer-context-ring-svg');
  const ringBox = await ringSvg.boundingBox();
  assert(Math.round(ringBox.width) === 16 && Math.round(ringBox.height) === 16, `Ring SVG is 16x16px (got ${Math.round(ringBox.width)}x${Math.round(ringBox.height)}px)`);

  // Popover metrics
  const popover = page.locator('[data-slot="composer-context-popover"]');
  const popoverBox = await popover.boundingBox();
  const popoverStyles = await popover.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });

  assert(Math.round(popoverBox.width) === 240, `Popover width is 240px (w-60) (got ${Math.round(popoverBox.width)}px)`);
  assert(popoverStyles.borderRadius === '16px', `Popover border radius is 16px (got ${popoverStyles.borderRadius})`);
  assert(popoverStyles.padding === '16px', `Popover padding is 16px (got ${popoverStyles.padding})`);

  // Typography
  const titleStyles = await page.locator('.ds-composer-context-title').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(titleStyles.fontSize === '13.5px' && (titleStyles.fontWeight === '500' || titleStyles.fontWeight === '600'), `Popover title is 13.5px/500 (got ${titleStyles.fontSize}/${titleStyles.fontWeight})`);

  const pctText = await page.locator('[data-slot="composer-context-pct"]').textContent();
  assert(pctText.trim() === '10%', `Fresh thread context is 10% (got "${pctText.trim()}")`);

  const rowStyles = await page.locator('.ds-composer-context-row').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(rowStyles.fontSize === '13px' && rowStyles.fontWeight === '400', `Breakdown row is 13px/400 (got ${rowStyles.fontSize}/${rowStyles.fontWeight})`);

  const totalText = await page.locator('[data-slot="composer-context-total"]').textContent();
  assert(totalText.trim() === '20k / 200k', `Total text is '20k / 200k' (got "${totalText.trim()}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-context-default-dark.png') });

  // 2. Warning State (> 85%)
  await page.goto(`${BASE_URL}?id=default-application-81-context--warning&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-context-popover"]');

  const warnPctText = await page.locator('[data-slot="composer-context-pct"]').textContent();
  assert(warnPctText.trim() === '91%', `Warning context is 91% (got "${warnPctText.trim()}")`);

  const warnTriggerColor = await page.locator('[data-slot="composer-context-trigger"]').evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  assert(warnTriggerColor.includes('250, 66, 62') || warnTriggerColor.includes('186, 38, 35'), `Warning trigger uses danger color token (got ${warnTriggerColor})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-context-warning-dark.png') });

  // 3. Full State
  await page.goto(`${BASE_URL}?id=default-application-81-context--full&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-context-trigger"]');

  const fullPopoverVis = await page.locator('[data-slot="composer-context-popover"]').getAttribute('data-visible');
  assert(fullPopoverVis === 'false', `Full state popover rests closed (got ${fullPopoverVis})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-context-full-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-81-context--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-context-trigger"]');

  // Toggle popover visibility
  await page.click('[data-btn-toggle]');
  assert(await page.locator('[data-slot="composer-context-popover"]').getAttribute('data-visible') === 'true', `Toggle button opens popover`);

  // Click Near limit preset
  await page.click('[data-btn-preset="warning"]');
  const interWarnPct = await page.locator('[data-slot="composer-context-pct"]').textContent();
  assert(interWarnPct.trim() === '91%', `Switching to Near limit preset updates pct to 91% (got "${interWarnPct.trim()}")`);

  // Click Full preset
  await page.click('[data-btn-preset="full"]');
  const interFullTotal = await page.locator('[data-slot="composer-context-total"]').textContent();
  assert(interFullTotal.trim() === '216k / 200k', `Switching to Full preset updates total to 216k / 200k (got "${interFullTotal.trim()}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-context-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-81-context--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-context-popover"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-context-default-light.png') });

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
