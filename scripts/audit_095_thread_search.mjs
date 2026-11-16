import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-95-thread-search--';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
  });

  let totalChecks = 0;
  let passedChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      passedChecks++;
      console.log(`  ✓ ${message}`);
    } else {
      console.error(`  ✗ ${message}`);
    }
  }

  console.log('=== Auditing Component #095: Thread search ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="thread-search"]');

  const card = page.locator('[data-slot="thread-search"]');
  const cardBox = await card.boundingBox();
  assert(cardBox.width <= 385 && cardBox.width >= 350, `Card max-width is ~384px (got ${cardBox.width}px)`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '16px', `Card border-radius is 16px (got ${cardRadius})`);

  const inputBox = page.locator('[data-slot="search-input-box"]');
  const inputBoxRadius = await inputBox.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(inputBoxRadius === '12px' || inputBoxRadius === '10px', `Search input box border-radius is 10-12px (got ${inputBoxRadius})`);

  const searchInput = page.locator('[data-slot="search-input"]');
  const inputSize = await searchInput.evaluate(el => window.getComputedStyle(el).fontSize);
  const inputWeight = await searchInput.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(inputSize === '13px', `Search input font-size is 13px (got ${inputSize})`);
  assert(inputWeight === '400', `Search input font-weight is 400 (got ${inputWeight})`);

  const groupLabel = page.locator('.ds-thread-search__group-label').first();
  const groupLabelWeight = await groupLabel.evaluate(el => window.getComputedStyle(el).fontWeight);
  const groupLabelFamily = await groupLabel.evaluate(el => window.getComputedStyle(el).fontFamily);
  assert(groupLabelWeight === '400', `Group header font-weight is 400 (got ${groupLabelWeight})`);
  assert(groupLabelFamily.toLowerCase().includes('mono'), `Group header uses monospace font (got ${groupLabelFamily})`);

  const threadTitle = page.locator('.ds-thread-search__title').first();
  const titleWeight = await threadTitle.evaluate(el => window.getComputedStyle(el).fontWeight);
  const titleSize = await threadTitle.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(titleWeight === '400', `Thread item title font-weight is 400 (got ${titleWeight})`);
  assert(titleSize === '13px', `Thread item title font-size is 13px (got ${titleSize})`);

  const threadPreview = page.locator('.ds-thread-search__preview').first();
  const previewWeight = await threadPreview.evaluate(el => window.getComputedStyle(el).fontWeight);
  const previewSize = await threadPreview.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(previewWeight === '400', `Thread item preview font-weight is 400 (got ${previewWeight})`);
  assert(previewSize === '12px', `Thread item preview font-size is 12px (got ${previewSize})`);

  const pinIcon = page.locator('.ds-thread-search__pin-icon');
  const hasPin = await pinIcon.first().isVisible();
  assert(hasPin, 'Pinned thread displays pin icon');

  const activeItem = page.locator('[data-slot="thread-option"][aria-selected="true"]');
  assert(await activeItem.isVisible(), 'Initial active item has aria-selected="true"');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'thread-search-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="thread-search"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'thread-search-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Filtered State
  console.log('\n3. Checking Filtered State...');
  await page.goto(`${STORY_URL}filtered&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="thread-search"]');
  const filteredCount = await page.locator('[data-slot="thread-option"]').count();
  assert(filteredCount === 1, `Query "draft" filters list down to 1 match (got ${filteredCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'thread-search-filtered-dark.png') });

  // 4. No Matches State
  console.log('\n4. Checking No Matches State...');
  await page.goto(`${STORY_URL}no-matches&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="thread-search"]');
  const emptyMsg = await page.locator('[data-slot="search-empty"]').textContent();
  assert(emptyMsg.includes('No thread matches'), `Empty message reads "No thread matches" (got "${emptyMsg.trim()}")`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'thread-search-nomatches-dark.png') });

  // 5. Interactive Navigation
  console.log('\n5. Checking Interactive Selection & Keyboard Navigation...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="thread-search"]');

  const interactiveInput = page.locator('[data-slot="search-input"]');
  await interactiveInput.focus();
  await page.keyboard.press('ArrowDown');

  const newActiveItem = page.locator('[data-slot="thread-option"][aria-selected="true"]');
  const newActiveId = await newActiveItem.getAttribute('data-thread-id');
  assert(newActiveId === '2', `Pressing ArrowDown moves active selection to thread id 2 (got ${newActiveId})`);

  // Direct click selection
  const thirdOption = page.locator('[data-slot="thread-option"][data-thread-id="3"]');
  await thirdOption.click();
  const clickedActiveId = await page.locator('[data-slot="thread-option"][aria-selected="true"]').getAttribute('data-thread-id');
  assert(clickedActiveId === '3', `Clicking thread option selects thread id 3 (got ${clickedActiveId})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'thread-search-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #095: 100% AUDIT PASS');
    process.exit(0);
  } else {
    console.error('Audit failed checks.');
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
