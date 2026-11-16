import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #100: Thread AUI...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 2,
  });

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. Audit Default story in dark mode
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread"]', { timeout: 5000 });

  const thread = await page.$('[data-slot="thread"]');
  const threadBox = await thread.boundingBox();
  const threadStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      height: s.height,
      display: s.display,
      flexDirection: s.flexDirection,
    };
  }, thread);

  assert(threadBox.width <= 640 && threadBox.width >= 580, `Thread width matches 640px max-width: ${threadBox.width}px`);
  assert(Math.round(threadBox.height) === 520, `Thread height matches 520px: ${threadBox.height}px`);
  assert(threadStyles.borderRadius === '20px', `Thread border-radius is 20px (got ${threadStyles.borderRadius})`);
  assert(threadStyles.display === 'flex' && threadStyles.flexDirection === 'column', 'Thread layout is flex column');

  // Messages
  const userMsg = await page.$('.ds-thread-aui__msg--user');
  const userStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, borderRadius: s.borderRadius };
  }, userMsg);
  assert(userStyles.fontSize === '13.5px', `User bubble font size is 13.5px (got ${userStyles.fontSize})`);
  assert(userStyles.fontWeight === '400', `User bubble font weight is 400 (got ${userStyles.fontWeight})`);

  const aiMsg = await page.$('.ds-thread-aui__msg--assistant');
  const aiStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, aiMsg);
  assert(aiStyles.fontSize === '13.5px', `Assistant message font size is 13.5px (got ${aiStyles.fontSize})`);
  assert(aiStyles.fontWeight === '400', `Assistant message font weight is 400 (got ${aiStyles.fontWeight})`);

  // Composer
  const attachBtn = await page.$('[data-slot="attach-btn"]');
  const attachBox = await attachBtn.boundingBox();
  assert(Math.round(attachBox.width) === 32 && Math.round(attachBox.height) === 32, `Attach button is 32x32px (got ${attachBox.width}x${attachBox.height})`);

  const sendBtn = await page.$('[data-slot="composer-send"]');
  const sendBox = await sendBtn.boundingBox();
  assert(Math.round(sendBox.width) === 32 && Math.round(sendBox.height) === 32, `Send button is 32x32px (got ${sendBox.width}x${sendBox.height})`);
  assert(await sendBtn.getAttribute('disabled') !== null, 'Send button initially disabled');

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-aui-default-dark.png`,
    clip: { x: threadBox.x - 20, y: threadBox.y - 20, width: threadBox.width + 40, height: threadBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="thread"]', { timeout: 5000 });
  const lightThread = await page.$('[data-slot="thread"]');
  const lightBox = await lightThread.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-aui-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Empty Story
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--empty&globals=theme:dark`);
  await page.waitForSelector('[data-slot="empty-state"]', { timeout: 5000 });
  const emptyState = await page.$('[data-slot="empty-state"]');
  assert(emptyState !== null, 'Empty state view is rendered');
  const starterChips = await page.$$('.ds-thread-aui__starter-chip');
  assert(starterChips.length === 3, `Has 3 suggestion starter chips (got ${starterChips.length})`);
  const chipStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, starterChips[0]);
  assert(chipStyles.fontSize === '12px', `Starter chip font size is 12px (got ${chipStyles.fontSize})`);
  assert(chipStyles.fontWeight === '400', `Starter chip font weight is 400 (got ${chipStyles.fontWeight})`);

  // 4. Audit Streaming Story
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--streaming&globals=theme:dark`);
  await page.waitForSelector('.ds-thread-aui__cursor', { timeout: 5000 });
  const cursor = await page.$('.ds-thread-aui__cursor');
  assert(cursor !== null, 'Streaming blinking cursor is rendered');

  // 5. Audit ErrorState Story
  console.log('\n--- Auditing ErrorState Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--error-state&globals=theme:dark`);
  await page.waitForSelector('[data-slot="error-card"]', { timeout: 5000 });
  const errorCard = await page.$('[data-slot="error-card"]');
  assert(errorCard !== null, 'Provider error card is rendered');
  const errorText = await errorCard.innerText();
  assert(errorText.includes('429 Too Many Requests'), `Error message contains 429 error (got ${errorText})`);
  const retryBtn = await page.$('.ds-thread-aui__retry-btn');
  assert(retryBtn !== null, 'Retry button is rendered');

  // 6. Audit ToolCalls Story
  console.log('\n--- Auditing ToolCalls Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--tool-calls&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning"]', { timeout: 5000 });
  const reasoning = await page.$('[data-slot="reasoning"]');
  assert(reasoning !== null, 'Reasoning thinking block is rendered');
  const toolCall = await page.$('[data-slot="tool-call"]');
  assert(toolCall !== null, 'Tool call card is rendered');
  const toolName = await page.$('.ds-thread-aui__tool-name');
  assert((await toolName.innerText()).trim() === 'search_docs', 'Tool name is search_docs');

  // 7. Audit RequiresAction Story
  console.log('\n--- Auditing RequiresAction Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--requires-action&globals=theme:dark`);
  await page.waitForSelector('[data-slot="action-card"]', { timeout: 5000 });
  const approveBtn = await page.$('.ds-thread-aui__approve-btn');
  assert(approveBtn !== null, 'Approve button is rendered');
  const approveStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, fontWeight: s.fontWeight };
  }, approveBtn);
  assert(approveStyles.height === '28px', `Approve button height is 28px (got ${approveStyles.height})`);
  assert(approveStyles.fontWeight === '500', `Approve button font weight is 500 (got ${approveStyles.fontWeight})`);

  // 8. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-100-thread-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread"]', { timeout: 5000 });

  // Click starter chip
  const starter = await page.$('.ds-thread-aui__starter-chip[data-chip="Explain re-renders"]');
  await starter.click();

  const userMessages = await page.$$('.ds-thread-aui__msg--user');
  assert(userMessages.length === 1, 'Clicking starter chip appends 1 user message');
  const firstUserText = await userMessages[0].innerText();
  assert(firstUserText.trim() === 'Explain re-renders', `User message content matches chip (got ${firstUserText})`);

  const emptyAfterClick = await page.$('[data-slot="empty-state"]');
  assert(emptyAfterClick === null, 'Empty state removed after message send');

  // Type in input
  const composerInput = await page.$('[data-slot="composer-input"]');
  await composerInput.fill('Verify token contracts');
  const interSendBtn = await page.$('[data-slot="composer-send"]');
  assert(await interSendBtn.getAttribute('disabled') === null, 'Send button enabled after typing');

  await interSendBtn.click();
  const userMessages2 = await page.$$('.ds-thread-aui__msg--user');
  assert(userMessages2.length === 2, 'Clicking send button appends second user message');

  const interBox = await (await page.$('[data-slot="thread"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-aui-interactive-dark.png`,
    clip: { x: interBox.x - 20, y: interBox.y - 20, width: interBox.width + 40, height: interBox.height + 40 },
  });

  console.log(`\n========================================`);
  console.log(`Audit Complete: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log(`========================================\n`);

  await browser.close();

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
