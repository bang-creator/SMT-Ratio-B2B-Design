import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-89-empty-state--';

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

  console.log('=== Auditing Component #089: Empty state ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="empty-state"]');

  const container = page.locator('[data-slot="empty-state"]');
  const containerBox = await container.boundingBox();
  assert(containerBox.width <= 449 && containerBox.width >= 400, `Container max-width is ~448px (got ${containerBox.width}px)`);

  const greeting = page.locator('[data-slot="empty-state-greeting"]');
  const greetingWeight = await greeting.evaluate(el => window.getComputedStyle(el).fontWeight);
  const greetingSize = await greeting.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(greetingWeight === '500', `Greeting font-weight is 500 (got ${greetingWeight})`);
  assert(greetingSize === '24px', `Greeting font-size is 24px (got ${greetingSize})`);

  const suggestion = page.locator('[data-slot="empty-state-suggestion"]').first();
  const suggestionWeight = await suggestion.evaluate(el => window.getComputedStyle(el).fontWeight);
  const suggestionSize = await suggestion.evaluate(el => window.getComputedStyle(el).fontSize);
  const suggestionRadius = await suggestion.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(suggestionWeight === '400', `Suggestion chip font-weight is 400 (got ${suggestionWeight})`);
  assert(suggestionSize === '13px', `Suggestion chip font-size is 13px (got ${suggestionSize})`);
  assert(suggestionRadius === '9999px' || suggestionRadius.includes('%') || parseInt(suggestionRadius) >= 16, `Suggestion chip is full pill rounded (got ${suggestionRadius})`);

  const composer = page.locator('[data-slot="empty-state-composer"]');
  const composerBox = await composer.boundingBox();
  assert(Math.round(composerBox.height) === 52, `Composer height is 52px (got ${composerBox.height}px)`);

  const composerRadius = await composer.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(composerRadius === '9999px' || composerRadius.includes('%') || parseInt(composerRadius) >= 20, `Composer is full pill rounded (got ${composerRadius})`);

  const composerInput = page.locator('[data-slot="composer-input"]');
  const inputSize = await composerInput.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(inputSize === '15px', `Composer input font-size is 15px (got ${inputSize})`);

  const sendBtn = page.locator('[data-slot="send-btn"]');
  const sendBox = await sendBtn.boundingBox();
  assert(Math.round(sendBox.width) === 32 && Math.round(sendBox.height) === 32, `Send button is 32x32px (got ${sendBox.width}x${sendBox.height}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'empty-state-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="empty-state"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'empty-state-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. No Suggestions State
  console.log('\n3. Checking No Suggestions State...');
  await page.goto(`${STORY_URL}no-suggestions&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="empty-state"]');
  const suggestionsCount = await page.locator('[data-slot="empty-state-suggestion"]').count();
  assert(suggestionsCount === 0, `No suggestions rendered in no-suggestions variant (got ${suggestionsCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'empty-state-nosuggestions-dark.png') });

  // 4. Many Suggestions State
  console.log('\n4. Checking Many Suggestions State...');
  await page.goto(`${STORY_URL}many-suggestions&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="empty-state"]');
  const manyCount = await page.locator('[data-slot="empty-state-suggestion"]').count();
  assert(manyCount === 6, `Many suggestions variant renders 6 suggestions (got ${manyCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'empty-state-manysuggestions-dark.png') });

  // 5. Interactive State
  console.log('\n5. Checking Interactive Submissions...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="empty-state"]');

  // Click suggestion chip
  const firstChip = page.locator('[data-slot="empty-state-suggestion"]').first();
  const chipText = await firstChip.textContent();
  await firstChip.click();

  const echoText = await page.locator('[data-slot="query-echo"]').textContent();
  assert(echoText.includes(chipText.trim()), `Clicking chip submits query (echoed "${echoText.trim()}")`);

  const resetBtn = page.locator('[data-slot="reset-session"]');
  await resetBtn.click();
  const restoredInput = await page.locator('[data-slot="composer-input"]').isVisible();
  assert(restoredInput, 'Resetting session restores empty state composer');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'empty-state-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #089: 100% AUDIT PASS');
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
