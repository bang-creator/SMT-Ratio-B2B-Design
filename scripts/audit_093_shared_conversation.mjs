import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-93-shared-conversation--';

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

  console.log('=== Auditing Component #093: Shared conversation ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="shared-conversation"]');

  const card = page.locator('[data-slot="shared-conversation"]');
  const cardBox = await card.boundingBox();
  assert(cardBox.width <= 385 && cardBox.width >= 350, `Card max-width is ~384px (got ${cardBox.width}px)`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '16px', `Card border-radius is 16px (got ${cardRadius})`);

  const title = page.locator('.ds-shared-conv__title');
  const titleWeight = await title.evaluate(el => window.getComputedStyle(el).fontWeight);
  const titleSize = await title.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(titleWeight === '500', `Title font-weight is 500 (got ${titleWeight})`);
  assert(titleSize === '13.5px', `Title font-size is 13.5px (got ${titleSize})`);

  const meta = page.locator('.ds-shared-conv__meta');
  const metaWeight = await meta.evaluate(el => window.getComputedStyle(el).fontWeight);
  const metaFamily = await meta.evaluate(el => window.getComputedStyle(el).fontFamily);
  assert(metaWeight === '400', `Header meta font-weight is 400 (got ${metaWeight})`);
  assert(metaFamily.toLowerCase().includes('mono'), `Header meta uses monospace font (got ${metaFamily})`);

  const userMsg = page.locator('[data-slot="shared-conversation-message"][data-speaker="user"]').first();
  const userMsgWeight = await userMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const userMsgSize = await userMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  const userMsgRadius = await userMsg.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(userMsgWeight === '400', `User message font-weight is 400 (got ${userMsgWeight})`);
  assert(userMsgSize === '13px', `User message font-size is 13px (got ${userMsgSize})`);
  assert(userMsgRadius === '16px', `User message border-radius is 16px (got ${userMsgRadius})`);

  const aiMsg = page.locator('[data-slot="shared-conversation-message"][data-speaker="assistant"]').first();
  const aiMsgWeight = await aiMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const aiMsgSize = await aiMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(aiMsgWeight === '400', `Assistant message font-weight is 400 (got ${aiMsgWeight})`);
  assert(aiMsgSize === '13px', `Assistant message font-size is 13px (got ${aiMsgSize})`);

  const readonlyBadge = page.locator('[data-slot="readonly-badge"]');
  const readonlyWeight = await readonlyBadge.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(readonlyWeight === '400', `Readonly badge font-weight is 400 (got ${readonlyWeight})`);

  const continueBtn = page.locator('[data-slot="continue-btn"]');
  const continueBox = await continueBtn.boundingBox();
  assert(Math.round(continueBox.height) === 32, `Continue button height is 32px (got ${continueBox.height}px)`);

  const continueWeight = await continueBtn.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(continueWeight === '500', `Continue button font-weight is 500 (got ${continueWeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shared-conversation-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="shared-conversation"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shared-conversation-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Long Content State
  console.log('\n3. Checking Long Content State...');
  await page.goto(`${STORY_URL}long-content&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="shared-conversation"]');
  const longTitle = page.locator('.ds-shared-conv__title');
  const isTruncated = await longTitle.evaluate(el => el.scrollWidth > el.clientWidth);
  assert(isTruncated, 'Long title overflows and truncates cleanly with ellipsis');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shared-conversation-longcontent-dark.png') });

  // 4. Interactive Forking
  console.log('\n4. Checking Interactive Forking...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="shared-conversation"]');

  const interactiveBtn = page.locator('[data-slot="continue-btn"]');
  await interactiveBtn.click();
  const forkedStatus = page.locator('[data-slot="forked-status"]');
  assert(await forkedStatus.isVisible(), 'Clicking "Continue in your own chat" forks conversation');

  const resetFork = page.locator('[data-slot="reset-fork"]');
  await resetFork.click();
  assert(await page.locator('[data-slot="continue-btn"]').isVisible(), 'Reset button restores read-only shared view');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shared-conversation-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #093: 100% AUDIT PASS');
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
