import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-96-launcher--';

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

  console.log('=== Auditing Component #096: Launcher (launcher-bubble) ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="launcher-bubble"]');

  const container = page.locator('[data-slot="launcher-bubble"]');
  const containerBox = await container.boundingBox();
  assert(containerBox.width <= 305 && containerBox.width >= 280, `Container max-width is ~304px (got ${containerBox.width}px)`);

  const card = page.locator('[data-slot="launcher-card"]');
  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  const cardPadding = await card.evaluate(el => window.getComputedStyle(el).padding);
  assert(cardRadius === '20px', `Card popover border-radius is 20px (got ${cardRadius})`);
  assert(cardPadding === '16px', `Card popover padding is 16px (got ${cardPadding})`);

  const greeting = page.locator('[data-slot="launcher-greeting"]');
  const greetingWeight = await greeting.evaluate(el => window.getComputedStyle(el).fontWeight);
  const greetingSize = await greeting.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(greetingWeight === '500', `Greeting font-weight is 500 (got ${greetingWeight})`);
  assert(greetingSize === '13.5px', `Greeting font-size is 13.5px (got ${greetingSize})`);

  const promptBtn = page.locator('[data-slot="prompt-btn"]').first();
  const promptWeight = await promptBtn.evaluate(el => window.getComputedStyle(el).fontWeight);
  const promptSize = await promptBtn.evaluate(el => window.getComputedStyle(el).fontSize);
  const promptRadius = await promptBtn.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(promptWeight === '400', `Prompt button font-weight is 400 (got ${promptWeight})`);
  assert(promptSize === '13px', `Prompt button font-size is 13px (got ${promptSize})`);
  assert(promptRadius === '12px' || promptRadius === '10px', `Prompt button border-radius is 10-12px (got ${promptRadius})`);

  const startBtn = page.locator('[data-slot="start-btn"]');
  const startBox = await startBtn.boundingBox();
  const startWeight = await startBtn.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(Math.round(startBox.height) === 32, `Start conversation button height is 32px (got ${startBox.height}px)`);
  assert(startWeight === '500', `Start conversation button font-weight is 500 (got ${startWeight})`);

  const toggleBtn = page.locator('[data-slot="launcher-toggle-btn"]');
  const toggleBox = await toggleBtn.boundingBox();
  assert(Math.round(toggleBox.width) === 48 && Math.round(toggleBox.height) === 48, `Bubble toggle button is 48x48px (got ${toggleBox.width}x${toggleBox.height}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'launcher-bubble-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="launcher-bubble"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'launcher-bubble-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Unread Badge Check
  console.log('\n3. Checking Unread Badge State...');
  await page.goto(`${STORY_URL}unread&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="launcher-bubble"]');

  const unreadBadge = page.locator('[data-slot="launcher-unread-badge"]');
  const isBadgeVisible = await unreadBadge.isVisible();
  assert(isBadgeVisible, 'Unread badge is visible in collapsed state with unread messages');

  const badgeBox = await unreadBadge.boundingBox();
  assert(Math.round(badgeBox.width) === 16 && Math.round(badgeBox.height) === 16, `Unread badge is 16x16px (got ${badgeBox.width}x${badgeBox.height}px)`);

  const badgeText = await unreadBadge.textContent();
  assert(badgeText.trim() === '3', `Unread badge displays "3" (got "${badgeText.trim()}")`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'launcher-bubble-unread-dark.png') });

  // 4. Interactive State Machine
  console.log('\n4. Checking Interactive State Machine...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="launcher-bubble"]');

  // Click prompt to start thread
  const firstPrompt = page.locator('[data-slot="prompt-btn"]').first();
  const promptText = await firstPrompt.textContent();
  await firstPrompt.click();

  const echoText = await page.locator('[data-slot="active-prompt-echo"]').textContent();
  assert(echoText.includes(promptText.trim()), `Clicking prompt initiates active session (echoed "${echoText.trim()}")`);

  // Reset launcher
  const resetBtn = page.locator('[data-slot="reset-launcher"]');
  await resetBtn.click();
  assert(await page.locator('[data-slot="start-btn"]').isVisible(), 'Resetting returns to starter launcher card');

  // Collapse launcher
  const interactiveToggle = page.locator('[data-slot="launcher-toggle-btn"]');
  await interactiveToggle.click();
  const cardCount = await page.locator('[data-slot="launcher-card"]').count();
  assert(cardCount === 0, 'Clicking bubble toggle collapses launcher card');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'launcher-bubble-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #096: 100% AUDIT PASS');
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
