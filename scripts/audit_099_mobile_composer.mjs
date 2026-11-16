import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #099: Mobile Composer...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });

  const composer = await page.$('[data-slot="mobile-composer"]');
  const composerBox = await composer.boundingBox();
  const composerStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderTopLeftRadius: s.borderTopLeftRadius,
      borderTopRightRadius: s.borderTopRightRadius,
      borderBottomLeftRadius: s.borderBottomLeftRadius,
      borderBottomRightRadius: s.borderBottomRightRadius,
      maxWidth: s.maxWidth,
      padding: s.padding,
      gap: s.gap,
      display: s.display,
      flexDirection: s.flexDirection,
    };
  }, composer);

  assert(composerBox.width <= 304 && composerBox.width >= 280, `Composer width matches 304px max-width: ${composerBox.width}px`);
  assert(composerStyles.borderTopLeftRadius === '20px', `Border top-left radius is 20px (got ${composerStyles.borderTopLeftRadius})`);
  assert(composerStyles.borderTopRightRadius === '20px', `Border top-right radius is 20px (got ${composerStyles.borderTopRightRadius})`);
  assert(composerStyles.borderBottomLeftRadius === '0px', `Border bottom-left radius is 0px (got ${composerStyles.borderBottomLeftRadius})`);

  // Action pills
  const actions = await page.$$('.ds-mobile-composer__action-pill');
  assert(actions.length === 4, `Has 4 action pills (got ${actions.length})`);
  const actionStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, borderRadius: s.borderRadius };
  }, actions[0]);
  assert(actionStyles.fontSize === '12px', `Action pill font size is 12px (got ${actionStyles.fontSize})`);
  assert(actionStyles.fontWeight === '400', `Action pill font weight is 400 (got ${actionStyles.fontWeight})`);

  // Attach button
  const attachBtn = await page.$('[data-slot="attach-btn"]');
  const attachBox = await attachBtn.boundingBox();
  assert(Math.round(attachBox.width) === 36 && Math.round(attachBox.height) === 36, `Attach button is 36x36px (got ${attachBox.width}x${attachBox.height})`);

  // Input field & input
  const input = await page.$('[data-slot="input"]');
  const inputStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, input);
  assert(inputStyles.fontSize === '16px', `Mobile input font size is 16px to prevent iOS auto-zoom (got ${inputStyles.fontSize})`);
  assert(inputStyles.fontWeight === '400', `Input font weight is 400 (got ${inputStyles.fontWeight})`);

  // Mic icon & Send button in empty state
  const micIcon = await page.$('[data-slot="mic-icon"]');
  assert(micIcon !== null, 'Mic icon is visible when input is empty');

  const sendBtn = await page.$('[data-slot="send-btn"]');
  const isSendDisabled = await sendBtn.getAttribute('disabled');
  assert(isSendDisabled !== null, 'Send button is disabled when input is empty');
  const sendBox = await sendBtn.boundingBox();
  assert(Math.round(sendBox.width) === 36 && Math.round(sendBox.height) === 36, `Send button is 36x36px (got ${sendBox.width}x${sendBox.height})`);

  // Home indicator bar
  const homeBar = await page.$('[data-slot="home-bar"]');
  assert(homeBar !== null, 'Home indicator bar is visible when keyboard is closed');
  const homeBox = await homeBar.boundingBox();
  assert(Math.round(homeBox.width) === 112 && Math.round(homeBox.height) === 4, `Home bar is 112x4px (got ${homeBox.width}x${homeBox.height})`);

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/mobile-composer-default-dark.png`,
    clip: { x: composerBox.x - 20, y: composerBox.y - 20, width: composerBox.width + 40, height: composerBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });
  const lightComposer = await page.$('[data-slot="mobile-composer"]');
  const lightBox = await lightComposer.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/mobile-composer-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit KeyboardOpen Story
  console.log('\n--- Auditing KeyboardOpen Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--keyboard-open&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });
  const kbActions = await page.$('[data-slot="actions"]');
  assert(kbActions === null, 'Actions are hidden when keyboard is open');
  const kbHomeBar = await page.$('[data-slot="home-bar"]');
  assert(kbHomeBar === null, 'Home bar is hidden when keyboard is open');
  const kbHint = await page.$('[data-slot="keyboard-hint"]');
  assert(kbHint !== null, 'Keyboard hint is visible');
  const hintText = await kbHint.innerText();
  assert(hintText.trim() === 'return to send', `Keyboard hint text is 'return to send' (got ${hintText})`);

  // 4. Audit Ready Story
  console.log('\n--- Auditing Ready Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--ready&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });
  const readyMic = await page.$('[data-slot="mic-icon"]');
  assert(readyMic === null, 'Mic icon is hidden when input has text');
  const readySendBtn = await page.$('[data-slot="send-btn"]');
  const readySendDisabled = await readySendBtn.getAttribute('disabled');
  assert(readySendDisabled === null, 'Send button is enabled when input has text');

  // 5. Audit Running Story
  console.log('\n--- Auditing Running Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--running&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });
  const runSendBtn = await page.$('[data-slot="send-btn"]');
  const runLabel = await runSendBtn.getAttribute('aria-label');
  assert(runLabel === 'Stop', `Button label is Stop when running (got ${runLabel})`);
  const stopRect = await page.$('rect');
  assert(stopRect !== null, 'Square stop icon is rendered');

  // 6. Audit Disabled Story
  console.log('\n--- Auditing Disabled Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--disabled&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });
  const disAttach = await page.$('[data-slot="attach-btn"]');
  assert(await disAttach.getAttribute('disabled') !== null, 'Attach button is disabled');
  const disSend = await page.$('[data-slot="send-btn"]');
  assert(disSend === null, 'Send button is omitted when disabled');

  // 7. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-99-mobile-composer--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mobile-composer"]', { timeout: 5000 });

  // Click an action pill
  const summarizePill = await page.$('.ds-mobile-composer__action-pill[data-action="Summarize"]');
  await summarizePill.click();

  const interInput = await page.$('[data-slot="input"]');
  const interVal = await interInput.inputValue();
  assert(interVal === 'Summarize', `Input value populated with 'Summarize' (got ${interVal})`);

  const interSendBtn = await page.$('[data-slot="send-btn"]');
  assert(await interSendBtn.getAttribute('disabled') === null, 'Send button enabled after action pill click');

  const interMic = await page.$('[data-slot="mic-icon"]');
  assert(interMic === null, 'Mic icon removed after action pill click');

  // Click send button
  await interSendBtn.click();
  const resetVal = await interInput.inputValue();
  assert(resetVal === '', 'Input resets after sending');
  assert(await interSendBtn.getAttribute('disabled') !== null, 'Send button disabled after reset');

  const interBox = await (await page.$('[data-slot="mobile-composer"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/mobile-composer-interactive-dark.png`,
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
