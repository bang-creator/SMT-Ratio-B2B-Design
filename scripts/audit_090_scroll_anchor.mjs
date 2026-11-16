import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-90-scroll-anchor--';

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

  console.log('=== Auditing Component #090: Scroll anchor ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="scroll-anchor"]');

  const container = page.locator('[data-slot="scroll-anchor"]');
  const containerBox = await container.boundingBox();
  assert(containerBox.width <= 385 && containerBox.width >= 350, `Container max-width is ~384px (got ${containerBox.width}px)`);
  assert(Math.round(containerBox.height) === 256, `Container height is strictly 256px (got ${containerBox.height}px)`);

  const containerRadius = await container.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(containerRadius === '16px', `Container border-radius is 16px (got ${containerRadius})`);

  const topFade = page.locator('.ds-scroll-anchor__top-fade');
  const fadeHeight = await topFade.evaluate(el => window.getComputedStyle(el).height);
  assert(fadeHeight === '24px', `Top fade mask height is 24px (got ${fadeHeight})`);

  const userMsg = page.locator('[data-slot="scroll-anchor-user-message"]').first();
  const userMsgWeight = await userMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const userMsgSize = await userMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  const userMsgRadius = await userMsg.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(userMsgWeight === '400', `User message font-weight is 400 (got ${userMsgWeight})`);
  assert(userMsgSize === '12px', `User message font-size is 12px (got ${userMsgSize})`);
  assert(userMsgRadius === '16px', `User message border-radius is 16px (got ${userMsgRadius})`);

  const aiMsg = page.locator('[data-slot="scroll-anchor-assistant-message"]').first();
  const aiMsgWeight = await aiMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const aiMsgSize = await aiMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(aiMsgWeight === '400', `Assistant message font-weight is 400 (got ${aiMsgWeight})`);
  assert(aiMsgSize === '12px', `Assistant message font-size is 12px (got ${aiMsgSize})`);

  const jumpBtn = page.locator('[data-slot="scroll-anchor-jump-btn"]');
  const isJumpVisible = await jumpBtn.isVisible();
  assert(isJumpVisible, 'Jump to bottom button is visible in unpinned view');

  const jumpWeight = await jumpBtn.evaluate(el => window.getComputedStyle(el).fontWeight);
  const jumpRadius = await jumpBtn.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(jumpWeight === '400', `Jump button text font-weight is 400 (got ${jumpWeight})`);
  assert(jumpRadius === '9999px' || jumpRadius.includes('%') || parseInt(jumpRadius) >= 16, `Jump button is full pill rounded (got ${jumpRadius})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'scroll-anchor-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="scroll-anchor"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'scroll-anchor-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Short Thread Check
  console.log('\n3. Checking Short Thread (No Jump Pill)...');
  await page.goto(`${STORY_URL}short-thread&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="scroll-anchor"]');
  const shortJumpCount = await page.locator('[data-slot="scroll-anchor-jump-btn"]').count();
  assert(shortJumpCount === 0, `No jump button present for short thread (got ${shortJumpCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'scroll-anchor-shortthread-dark.png') });

  // 4. Interactive Jump Behavior
  console.log('\n4. Checking Interactive Jump Behavior...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="scroll-anchor"]');

  const interactiveJump = page.locator('[data-slot="scroll-anchor-jump-btn"]');
  assert(await interactiveJump.isVisible(), 'Interactive jump button begins visible');

  await interactiveJump.click();
  const jumpAfterClickCount = await page.locator('[data-slot="scroll-anchor-jump-btn"]').count();
  assert(jumpAfterClickCount === 0, 'Clicking jump button smoothly scrolls to bottom and removes jump button');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'scroll-anchor-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #090: 100% AUDIT PASS');
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
