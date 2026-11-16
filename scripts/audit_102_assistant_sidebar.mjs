import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #102: Assistant Sidebar AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="assistant-sidebar"]', { timeout: 5000 });

  const wrap = await page.$('[data-slot="assistant-sidebar"]');
  const wrapBox = await wrap.boundingBox();
  const wrapStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      height: s.height,
      display: s.display,
    };
  }, wrap);

  assert(wrapBox.width <= 768 && wrapBox.width >= 700, `Wrap width matches 768px max-width: ${wrapBox.width}px`);
  assert(Math.round(wrapBox.height) === 480, `Wrap height matches 480px: ${wrapBox.height}px`);
  assert(wrapStyles.borderRadius === '20px', `Wrap border-radius is 20px (got ${wrapStyles.borderRadius})`);

  // Workspace
  const wsTitle = await page.$('.ds-sidebar-aui__workspace-title');
  const wsStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, wsTitle);
  assert(wsStyles.fontSize === '14px', `Workspace title font size is 14px (got ${wsStyles.fontSize})`);
  assert(wsStyles.fontWeight === '500', `Workspace title font weight is 500 (got ${wsStyles.fontWeight})`);

  // Handle
  const handle = await page.$('[data-slot="resize-handle"]');
  const handleBox = await handle.boundingBox();
  const handleStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { cursor: s.cursor };
  }, handle);
  assert(Math.round(handleBox.width) === 4, `Resize handle width is 4px (got ${handleBox.width})`);
  assert(handleStyles.cursor === 'col-resize', `Resize handle cursor is col-resize (got ${handleStyles.cursor})`);

  // Sidebar Pane
  const pane = await page.$('[data-slot="sidebar-pane"]');
  const paneBox = await pane.boundingBox();
  assert(Math.round(paneBox.width) === 320, `Sidebar pane width is 320px (got ${paneBox.width})`);

  // Header
  const badge = await page.$('.ds-sidebar-aui__header-badge');
  assert((await badge.innerText()).trim() === 'gpt-4o', 'Sidebar header badge is gpt-4o');

  // Messages
  const userBubble = await page.$('.ds-sidebar-aui__user-bubble');
  const userStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, userBubble);
  assert(userStyles.fontSize === '13px', `User bubble font size is 13px (got ${userStyles.fontSize})`);
  assert(userStyles.fontWeight === '400', `User bubble font weight is 400 (got ${userStyles.fontWeight})`);

  // Composer
  const sendBtn = await page.$('[data-slot="send-btn"]');
  const sendBox = await sendBtn.boundingBox();
  assert(Math.round(sendBox.width) === 28 && Math.round(sendBox.height) === 28, `Send button is 28x28px (got ${sendBox.width}x${sendBox.height})`);
  assert(await sendBtn.getAttribute('disabled') !== null, 'Send button disabled initially');

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-sidebar-default-dark.png`,
    clip: { x: wrapBox.x - 20, y: wrapBox.y - 20, width: wrapBox.width + 40, height: wrapBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="assistant-sidebar"]', { timeout: 5000 });
  const lightWrap = await page.$('[data-slot="assistant-sidebar"]');
  const lightBox = await lightWrap.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-sidebar-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Empty Story
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--empty&globals=theme:dark`);
  await page.waitForSelector('[data-slot="empty-state"]', { timeout: 5000 });
  const emptyView = await page.$('[data-slot="empty-state"]');
  assert(emptyView !== null, 'Empty state view rendered in sidebar');
  const starters = await page.$$('.ds-sidebar-aui__starter-chip');
  assert(starters.length === 2, `Has 2 starter chips (got ${starters.length})`);

  // 4. Audit Streaming Story
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--streaming&globals=theme:dark`);
  await page.waitForSelector('.ds-sidebar-aui__cursor', { timeout: 5000 });
  const cursor = await page.$('.ds-sidebar-aui__cursor');
  assert(cursor !== null, 'Streaming cursor rendered');

  // 5. Audit ErrorState Story
  console.log('\n--- Auditing ErrorState Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--error-state&globals=theme:dark`);
  await page.waitForSelector('[data-slot="error-card"]', { timeout: 5000 });
  const errorCard = await page.$('[data-slot="error-card"]');
  assert(errorCard !== null, 'Error card rendered');

  // 6. Audit LongContent Story
  console.log('\n--- Auditing LongContent Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--long-content&globals=theme:dark`);
  await page.waitForSelector('.ds-thread-aui__tool-args', { timeout: 5000 });
  const pre = await page.$('.ds-thread-aui__tool-args');
  assert(pre !== null, 'Code block pre rendered in multi-turn thread');

  // 7. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-102-assistant-sidebar-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="assistant-sidebar"]', { timeout: 5000 });

  // Click starter chip
  const starter = await page.$('.ds-sidebar-aui__starter-chip[data-chip="Explain code"]');
  await starter.click();

  const bubbles = await page.$$('.ds-sidebar-aui__user-bubble');
  assert(bubbles.length === 1, 'Clicking starter chip appends user turn');
  assert((await bubbles[0].innerText()).trim() === 'Explain code', 'User turn text matches chip');

  // Type in input & send
  const input = await page.$('[data-slot="input"]');
  await input.fill('Check memory allocation');
  const interSend = await page.$('[data-slot="send-btn"]');
  assert(await interSend.getAttribute('disabled') === null, 'Send button enabled after typing');

  await interSend.click();
  const bubbles2 = await page.$$('.ds-sidebar-aui__user-bubble');
  assert(bubbles2.length === 2, 'Send appends second message to sidebar');

  const interBox = await (await page.$('[data-slot="assistant-sidebar"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-sidebar-interactive-dark.png`,
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
