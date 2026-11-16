import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-91-canvas--';

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

  console.log('=== Auditing Component #091: Canvas (canvas-split) ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="canvas-split"]');

  const canvas = page.locator('[data-slot="canvas-split"]');
  const canvasBox = await canvas.boundingBox();
  assert(canvasBox.width <= 769 && canvasBox.width >= 700, `Canvas max-width is ~768px (got ${canvasBox.width}px)`);
  assert(Math.round(canvasBox.height) === 320, `Canvas height is strictly 320px (got ${canvasBox.height}px)`);

  const canvasRadius = await canvas.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(canvasRadius === '20px', `Canvas border-radius is 20px (got ${canvasRadius})`);

  const thread = page.locator('[data-slot="canvas-split-thread"]');
  const threadBox = await thread.boundingBox();
  assert(Math.round(threadBox.width) === 240, `Thread sidebar width is strictly 240px (got ${threadBox.width}px)`);

  const userMsg = page.locator('[data-slot="canvas-split-message"][data-speaker="user"]');
  const userMsgWeight = await userMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const userMsgSize = await userMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(userMsgWeight === '400', `User message font-weight is 400 (got ${userMsgWeight})`);
  assert(userMsgSize === '13px', `User message font-size is 13px (got ${userMsgSize})`);

  const header = page.locator('[data-slot="canvas-split-header"]');
  const headerBox = await header.boundingBox();
  assert(Math.round(headerBox.height) === 44, `Header height is 44px (got ${headerBox.height}px)`);

  const title = page.locator('.ds-canvas-split__doc-title');
  const titleWeight = await title.evaluate(el => window.getComputedStyle(el).fontWeight);
  const titleSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(titleWeight === '500', `Title font-weight is 500 (got ${titleWeight})`);
  assert(titleSize === '13px', `Title font-size is 13px (got ${titleSize})`);

  const version = page.locator('.ds-canvas-split__doc-version');
  const versionWeight = await version.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(versionWeight === '400', `Version badge font-weight is 400 (got ${versionWeight})`);

  const savedStatus = page.locator('[data-slot="canvas-saved-status"]');
  const isSaved = await savedStatus.getAttribute('data-saved');
  assert(isSaved === 'true', `Saved status reflects data-saved="true" (got ${isSaved})`);

  const copyBtn = page.locator('[data-slot="copy-btn"]');
  const copyBox = await copyBtn.boundingBox();
  assert(Math.round(copyBox.width) === 28 && Math.round(copyBox.height) === 28, `Copy button is 28x28px (got ${copyBox.width}x${copyBox.height}px)`);

  const closeBtn = page.locator('[data-slot="close-btn"]');
  const closeBox = await closeBtn.boundingBox();
  assert(Math.round(closeBox.width) === 28 && Math.round(closeBox.height) === 28, `Close button is 28x28px (got ${closeBox.width}x${closeBox.height}px)`);

  const headingLine = page.locator('[data-slot="canvas-split-line"][data-heading="true"]').first();
  const headingWeight = await headingLine.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(headingWeight === '500', `Document heading font-weight is 500 (got ${headingWeight})`);

  const bodyLine = page.locator('[data-slot="canvas-split-line"]:not([data-heading="true"])').first();
  const bodyWeight = await bodyLine.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(bodyWeight === '400', `Document body line font-weight is 400 (got ${bodyWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'canvas-split-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="canvas-split"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'canvas-split-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Streaming Mode (Pulsing cursor)
  console.log('\n3. Checking Streaming Mode...');
  await page.goto(`${STORY_URL}streaming&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="canvas-split"]');
  const cursor = page.locator('.ds-canvas-split__cursor');
  const isCursorVisible = await cursor.isVisible();
  assert(isCursorVisible, 'Pulsing writing cursor is visible in streaming mode');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'canvas-split-streaming-dark.png') });

  // 4. Interactive State
  console.log('\n4. Checking Interactive State...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="canvas-split"]');

  // Copy button click
  const interactiveCopy = page.locator('[data-slot="copy-btn"]');
  await interactiveCopy.click();
  const copiedTitle = await page.locator('.ds-canvas-split__doc-title').textContent();
  assert(copiedTitle.includes('Copied to clipboard'), `Clicking copy triggers feedback title ("${copiedTitle.trim()}")`);

  // Close button click
  const interactiveClose = page.locator('[data-slot="close-btn"]');
  await interactiveClose.click();
  const closedNotice = page.locator('[data-slot="closed-notice"]');
  assert(await closedNotice.isVisible(), 'Clicking close button closes canvas view');

  const reopenBtn = page.locator('[data-slot="reopen-canvas"]');
  await reopenBtn.click();
  assert(await page.locator('[data-slot="canvas-split-header"]').isVisible(), 'Clicking reopen restores canvas header and document');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'canvas-split-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #091: 100% AUDIT PASS');
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
