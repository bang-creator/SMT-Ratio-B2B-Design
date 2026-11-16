import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #101: Assistant Modal AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="assistant-modal"]', { timeout: 5000 });

  const wrap = await page.$('[data-slot="assistant-modal"]');
  const wrapBox = await wrap.boundingBox();
  const wrapStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      height: s.height,
      position: s.position,
    };
  }, wrap);

  assert(wrapBox.width <= 520 && wrapBox.width >= 460, `Wrap width matches 520px max-width: ${wrapBox.width}px`);
  assert(Math.round(wrapBox.height) === 500, `Wrap height matches 500px: ${wrapBox.height}px`);
  assert(wrapStyles.position === 'relative', 'Wrap position is relative');

  // Launcher button
  const launcher = await page.$('[data-slot="launcher-btn"]');
  const launcherBox = await launcher.boundingBox();
  assert(Math.round(launcherBox.width) === 44 && Math.round(launcherBox.height) === 44, `Launcher button is 44x44px (got ${launcherBox.width}x${launcherBox.height})`);

  // Modal dialog
  const modal = await page.$('[data-slot="modal-dialog"]');
  const modalBox = await modal.boundingBox();
  const modalStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      width: s.width,
      height: s.height,
      position: s.position,
    };
  }, modal);

  assert(Math.round(modalBox.width) === 360, `Modal dialog width is 360px (got ${modalBox.width}px)`);
  assert(Math.round(modalBox.height) === 410, `Modal dialog height is 410px (got ${modalBox.height}px)`);
  assert(modalStyles.borderRadius === '16px', `Modal border-radius is 16px (got ${modalStyles.borderRadius})`);

  // Header & Close button
  const closeBtn = await page.$('[data-slot="close-btn"]');
  const closeBox = await closeBtn.boundingBox();
  assert(Math.round(closeBox.width) === 24 && Math.round(closeBox.height) === 24, `Close button is 24x24px (got ${closeBox.width}x${closeBox.height})`);

  // Messages
  const userBubble = await page.$('.ds-modal-aui__user-bubble');
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
  assert(await sendBtn.getAttribute('disabled') !== null, 'Send button is disabled initially');

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-modal-default-dark.png`,
    clip: { x: wrapBox.x - 20, y: wrapBox.y - 20, width: wrapBox.width + 40, height: wrapBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="assistant-modal"]', { timeout: 5000 });
  const lightWrap = await page.$('[data-slot="assistant-modal"]');
  const lightBox = await lightWrap.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-modal-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Closed Story
  console.log('\n--- Auditing Closed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--closed&globals=theme:dark`);
  await page.waitForSelector('[data-slot="assistant-modal"]', { timeout: 5000 });
  const closedModal = await page.$('.ds-modal-aui--closed');
  assert(closedModal !== null, 'Modal dialog is closed/hidden in Closed story');
  const closedLauncher = await page.$('[data-slot="launcher-btn"]');
  assert(closedLauncher !== null, 'Launcher button is visible in Closed story');

  // 4. Audit Empty Story
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--empty&globals=theme:dark`);
  await page.waitForSelector('[data-slot="empty-state"]', { timeout: 5000 });
  const emptyView = await page.$('[data-slot="empty-state"]');
  assert(emptyView !== null, 'Empty state view is rendered');
  const starters = await page.$$('.ds-modal-aui__starter-chip');
  assert(starters.length === 2, `Has 2 starter chips (got ${starters.length})`);

  // 5. Audit Streaming Story
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--streaming&globals=theme:dark`);
  await page.waitForSelector('.ds-modal-aui__cursor', { timeout: 5000 });
  const cursor = await page.$('.ds-modal-aui__cursor');
  assert(cursor !== null, 'Streaming cursor is rendered');

  // 6. Audit ErrorState Story
  console.log('\n--- Auditing ErrorState Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--error-state&globals=theme:dark`);
  await page.waitForSelector('[data-slot="error-card"]', { timeout: 5000 });
  const errorCard = await page.$('[data-slot="error-card"]');
  assert(errorCard !== null, 'Error card is rendered');

  // 7. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-101-assistant-modal-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="assistant-modal"]', { timeout: 5000 });

  // Close modal via close button
  const interCloseBtn = await page.$('[data-slot="close-btn"]');
  await interCloseBtn.click();
  const interModal = await page.$('[data-slot="modal-dialog"]');
  const hasClosedClass = await page.evaluate((el) => el.classList.contains('ds-modal-aui--closed'), interModal);
  assert(hasClosedClass === true, 'Clicking close button adds ds-modal-aui--closed');

  // Re-open modal via launcher button
  const interLauncher = await page.$('[data-slot="launcher-btn"]');
  await interLauncher.click();
  const hasClosedClass2 = await page.evaluate((el) => el.classList.contains('ds-modal-aui--closed'), interModal);
  assert(hasClosedClass2 === false, 'Clicking launcher button re-opens modal');

  // Type in input & send
  const interInput = await page.$('[data-slot="input"]');
  await interInput.fill('List available model parameters');
  const interSendBtn = await page.$('[data-slot="send-btn"]');
  assert(await interSendBtn.getAttribute('disabled') === null, 'Send button enabled after typing');

  await interSendBtn.click();
  const bubbles = await page.$$('.ds-modal-aui__user-bubble');
  assert(bubbles.length === 2, 'Message successfully appended to modal body');

  const interBox = await (await page.$('[data-slot="assistant-modal"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/assistant-modal-interactive-dark.png`,
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
