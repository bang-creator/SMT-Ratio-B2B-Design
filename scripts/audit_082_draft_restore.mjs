import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #082 DRAFT RESTORE ---');
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
  await page.goto(`${BASE_URL}?id=default-application-82-draft-restore--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="draft-restore"]');

  const card = page.locator('[data-slot="draft-restore"]');
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
  assert(cardStyles.gap === '10px', `Card gap is 10px (got ${cardStyles.gap})`);

  // Icon metrics
  const icon = page.locator('.ds-draft-restore-icon svg');
  const iconBox = await icon.boundingBox();
  assert(Math.round(iconBox.width) === 14 && Math.round(iconBox.height) === 14, `Pencil icon is 14x14px (got ${Math.round(iconBox.width)}x${Math.round(iconBox.height)}px)`);

  // Typography (Strict 400 Rule)
  const textStyles = await page.locator('.ds-draft-restore-text').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(textStyles.fontSize === '13px' && textStyles.fontWeight === '400', `Draft text typography is 13px/400 (got ${textStyles.fontSize}/${textStyles.fontWeight})`);

  const metaStyles = await page.locator('.ds-draft-restore-meta').evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(metaStyles.fontSize === '11px' && metaStyles.fontWeight === '400', `Meta text typography is 11px/400 (got ${metaStyles.fontSize}/${metaStyles.fontWeight})`);

  // Restore button
  const restoreBtn = page.locator('[data-slot="draft-restore-action"]');
  const restoreBox = await restoreBtn.boundingBox();
  assert(Math.round(restoreBox.height) === 26, `Restore button height is 26px (got ${Math.round(restoreBox.height)}px)`);

  // Discard button
  const discardBtn = page.locator('[data-slot="draft-restore-discard"]');
  const discardBox = await discardBtn.boundingBox();
  assert(Math.round(discardBox.width) === 28 && Math.round(discardBox.height) === 28, `Discard button is 28x28px (size-7) (got ${Math.round(discardBox.width)}x${Math.round(discardBox.height)}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft-restore-default-dark.png') });

  // 2. Long Content State
  await page.goto(`${BASE_URL}?id=default-application-82-draft-restore--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="draft-restore"]');

  const longTextOverflow = await page.locator('.ds-draft-restore-text').evaluate((el) => {
    return el.scrollWidth > el.clientWidth;
  });
  assert(longTextOverflow, `Long draft text properly truncates with ellipsis inside container`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft-restore-longcontent-dark.png') });

  // 3. MultiLine State
  await page.goto(`${BASE_URL}?id=default-application-82-draft-restore--multi-line&globals=theme:dark`);
  await page.waitForSelector('[data-slot="draft-restore"]');

  const multiLineContent = await page.locator('.ds-draft-restore-text').textContent();
  assert(!multiLineContent.includes('\n'), `Multi-line draft text collapses whitespace to single line`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft-restore-multiline-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-82-draft-restore--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="draft-restore"]');

  // Click Restore
  await page.click('[data-slot="draft-restore-action"]');
  assert(await page.locator('[data-slot="draft-restore"]').count() === 0, `Clicking Restore dismisses draft card`);
  assert(await page.locator('.ds-border.ds-bg-subtle').count() === 1, `Restored content displays below`);

  // Click Reset
  await page.click('[data-btn-reset]');
  assert(await page.locator('[data-slot="draft-restore"]').count() === 1, `Reset restores the draft card`);

  // Click Discard
  await page.click('[data-slot="draft-restore-discard"]');
  assert(await page.locator('[data-slot="draft-restore"]').count() === 0, `Clicking Discard dismisses draft card`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft-restore-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-82-draft-restore--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="draft-restore"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'draft-restore-default-light.png') });

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
