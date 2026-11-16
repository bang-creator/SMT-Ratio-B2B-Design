import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #078 COMPOSER ATTACHMENTS ---');
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
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-attachment"]');

  const chip = page.locator('[data-slot="composer-attachment"]').first();
  const chipStyles = await chip.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      gap: s.gap,
      padding: s.padding,
      display: s.display,
    };
  });

  assert(chipStyles.borderRadius === '14px', `Chip border radius is 14px (got ${chipStyles.borderRadius})`);
  assert(chipStyles.gap === '10px', `Chip gap is 10px (got ${chipStyles.gap})`);
  assert(chipStyles.display === 'inline-flex' || chipStyles.display === 'flex', `Chip display is flex/inline-flex (got ${chipStyles.display})`);

  // Icon box
  const iconBox = page.locator('.ds-composer-attachment-icon-box').first();
  const iconBoxRect = await iconBox.boundingBox();
  const iconBoxStyles = await iconBox.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius };
  });

  assert(iconBoxRect.width === 32 && iconBoxRect.height === 32, `Icon box is 32x32px (got ${iconBoxRect.width}x${iconBoxRect.height}px)`);
  assert(iconBoxStyles.borderRadius === '10px', `Icon box border radius is 10px (got ${iconBoxStyles.borderRadius})`);

  // Typography
  const nameStyles = await page.locator('.ds-composer-attachment-name').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, maxWidth: s.maxWidth };
  });
  assert(nameStyles.fontSize === '12px' && (nameStyles.fontWeight === '500' || nameStyles.fontWeight === '600'), `Attachment name is 12px/500 (got ${nameStyles.fontSize}/${nameStyles.fontWeight})`);
  assert(nameStyles.maxWidth === '144px', `Attachment name max-width is 144px (got ${nameStyles.maxWidth})`);

  const metaStyles = await page.locator('.ds-composer-attachment-meta').first().evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(metaStyles.fontSize === '11px' && metaStyles.fontWeight === '400', `Attachment meta is 11px/400 (got ${metaStyles.fontSize}/${metaStyles.fontWeight})`);

  // Remove button
  const removeBtn = page.locator('[data-slot="composer-attachment-remove"]').first();
  const removeBox = await removeBtn.boundingBox();
  assert(removeBox.width === 20 && removeBox.height === 20, `Remove button is 20x20px (got ${removeBox.width}x${removeBox.height}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-default-dark.png') });

  // 2. Uploading State
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--uploading&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-attachment"]');

  const uploadingCount = await page.locator('[data-state="uploading"]').count();
  assert(uploadingCount === 2, `Uploading state renders 2 uploading chips (got ${uploadingCount})`);

  const spinnerCount = await page.locator('.ds-composer-attachment-spinner').count();
  assert(spinnerCount === 2, `Uploading chips have 2 spinning loaders (got ${spinnerCount})`);

  const progressCount = await page.locator('.ds-composer-attachment-progress').count();
  assert(progressCount === 2, `Uploading chips have 2 bottom progress bars (got ${progressCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-uploading-dark.png') });

  // 3. Error State
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--error&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-attachment"]');

  const errorChip = page.locator('[data-state="error"]');
  const errorMetaColor = await errorChip.locator('.ds-composer-attachment-meta').evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  // Danger color in dark is rgb(250, 66, 62)
  assert(errorMetaColor.includes('250, 66, 62') || errorMetaColor.includes('186, 38, 35'), `Error chip meta text uses danger color token (got ${errorMetaColor})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-error-dark.png') });

  // 4. Many Files State
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--many-files&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-attachment"]');
  const manyCount = await page.locator('[data-slot="composer-attachment"]').count();
  assert(manyCount === 5, `Many files state renders 5 attachments (got ${manyCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-manyfiles-dark.png') });

  // 5. Interactive State
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-attachment"]');

  const initialChipCount = await page.locator('[data-slot="composer-attachment"]').count();
  assert(initialChipCount === 2, `Interactive begins with 2 attachments (got ${initialChipCount})`);

  // Remove first attachment (design-spec.pdf)
  await page.locator('[data-slot="composer-attachment-remove"]').first().click();
  const countAfterRemove = await page.locator('[data-slot="composer-attachment"]').count();
  assert(countAfterRemove === 1, `Clicking remove deletes attachment from list (got ${countAfterRemove})`);

  // Click reset
  await page.click('[data-btn-reset]');
  const countAfterReset = await page.locator('[data-slot="composer-attachment"]').count();
  assert(countAfterReset === 2, `Reset button restores 2 attachments (got ${countAfterReset})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-interactive-dark.png') });

  // 6. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-78-attachments--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-attachment"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-attachments-default-light.png') });

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
