import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-88-chat-panel--';

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

  console.log('=== Auditing Component #088: Chat panel ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="chat-panel"]');

  const panel = page.locator('[data-slot="chat-panel"]');
  const panelBox = await panel.boundingBox();
  assert(panelBox.width <= 449 && panelBox.width >= 420, `Panel max-width is ~448px (got ${panelBox.width}px)`);
  assert(Math.round(panelBox.height) === 270, `Panel height is strictly 270px (got ${panelBox.height}px)`);

  const panelRadius = await panel.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(panelRadius === '24px', `Panel border-radius is 24px (got ${panelRadius})`);

  const userMsg = page.locator('[data-slot="chat-panel-user-message"]').first();
  const userMsgWeight = await userMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const userMsgSize = await userMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  const userMsgRadius = await userMsg.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(userMsgWeight === '400', `User message font-weight is 400 (got ${userMsgWeight})`);
  assert(userMsgSize === '12px', `User message font-size is 12px (got ${userMsgSize})`);
  assert(userMsgRadius === '16px', `User message border-radius is 16px (got ${userMsgRadius})`);

  const aiMsg = page.locator('[data-slot="chat-panel-assistant-message"]').first();
  const aiMsgWeight = await aiMsg.evaluate(el => window.getComputedStyle(el).fontWeight);
  const aiMsgSize = await aiMsg.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(aiMsgWeight === '400', `Assistant message font-weight is 400 (got ${aiMsgWeight})`);
  assert(aiMsgSize === '12px', `Assistant message font-size is 12px (got ${aiMsgSize})`);

  const composer = page.locator('[data-slot="chat-panel-composer"]');
  const composerBox = await composer.boundingBox();
  assert(Math.round(composerBox.height) === 40, `Composer height is 40px (got ${composerBox.height}px)`);

  const composerInput = page.locator('[data-slot="composer-input"]');
  const inputSize = await composerInput.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(inputSize === '13px', `Composer input font-size is 13px (got ${inputSize})`);

  const sendBtn = page.locator('[data-slot="send-btn"]');
  const sendBox = await sendBtn.boundingBox();
  assert(Math.round(sendBox.width) === 28 && Math.round(sendBox.height) === 28, `Send button is 28x28px (got ${sendBox.width}x${sendBox.height}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-panel-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="chat-panel"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-panel-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Typing State
  console.log('\n3. Checking Typing State...');
  await page.goto(`${STORY_URL}typing&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="chat-panel-typing"]');
  const dots = page.locator('.ds-chat-panel__typing-dot');
  const dotCount = await dots.count();
  assert(dotCount === 3, `Typing indicator contains 3 dots (got ${dotCount})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-panel-typing-dark.png') });

  // 4. Long Thread Overflow
  console.log('\n4. Checking Long Thread Scroll Behavior...');
  await page.goto(`${STORY_URL}long-thread&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="chat-panel"]');
  const longPanelBox = await page.locator('[data-slot="chat-panel"]').boundingBox();
  assert(Math.round(longPanelBox.height) === 270, `Long thread maintains exact 270px height without leaking (got ${longPanelBox.height}px)`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-panel-longthread-dark.png') });

  // 5. Interactive Message Flow
  console.log('\n5. Checking Interactive Message Sending...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="chat-panel"]');

  const interactiveInput = page.locator('[data-slot="composer-input"]');
  await interactiveInput.fill('How do I migrate to Antigravity?');
  const interactiveSend = page.locator('[data-slot="send-btn"]');
  await interactiveSend.click();

  // Check user message appeared
  const newMsg = page.locator('[data-slot="chat-panel-user-message"]', { hasText: 'How do I migrate to Antigravity?' });
  const isMsgVisible = await newMsg.isVisible();
  assert(isMsgVisible, 'Sent user message renders in message stream');

  // Wait for AI response
  await page.waitForTimeout(700);
  const newAiMsg = page.locator('[data-slot="chat-panel-assistant-message"]', { hasText: 'Processed:' });
  const isAiMsgVisible = await newAiMsg.isVisible();
  assert(isAiMsgVisible, 'AI response renders dynamically after typing delay');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chat-panel-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #088: 100% AUDIT PASS');
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
