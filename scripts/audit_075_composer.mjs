import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #075 COMPOSER ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 800 });

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // 1. Default Dark State
  await page.goto(`${BASE_URL}?id=default-application-75-composer--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer"]');

  const composer = page.locator('[data-slot="composer"]');
  const composerBox = await composer.boundingBox();
  assert(composerBox.width <= 513 && composerBox.width >= 500, `Composer width is ~512px (got ${composerBox.width}px)`);

  const bar = page.locator('[data-slot="composer-bar"]');
  const barStyles = await bar.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      padding: s.padding,
    };
  });
  assert(barStyles.borderRadius === '24px', `Composer bar radius is 24px (got ${barStyles.borderRadius})`);
  assert(barStyles.padding === '10px', `Composer bar padding is 10px (got ${barStyles.padding})`);

  // Input
  const input = page.locator('[data-slot="composer-input"]');
  const inputStyles = await input.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      minHeight: s.minHeight,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  });
  assert(inputStyles.minHeight === '44px', `Input min-height is 44px (got ${inputStyles.minHeight})`);
  assert(inputStyles.fontSize === '15px' && inputStyles.fontWeight === '400', `Input typography is 15px/400 (got ${inputStyles.fontSize}/${inputStyles.fontWeight})`);

  // Toolbar Buttons
  const attachBtn = page.locator('[data-slot="composer-attach"]');
  const attachBox = await attachBtn.boundingBox();
  assert(attachBox.width === 32 && attachBox.height === 32, `Attach button is 32x32px (got ${attachBox.width}x${attachBox.height})`);

  const modelTrigger = page.locator('[data-slot="composer-model-trigger"]');
  const modelBox = await modelTrigger.boundingBox();
  const modelStyles = await modelTrigger.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  });
  assert(modelBox.height === 32, `Model trigger height is 32px (got ${modelBox.height}px)`);
  assert(parseInt(modelStyles.borderRadius) >= 16, `Model trigger is full pill radius (got ${modelStyles.borderRadius})`);
  assert(modelStyles.fontSize === '12.5px' && modelStyles.fontWeight === '400', `Model trigger is 12.5px/400 (got ${modelStyles.fontSize}/${modelStyles.fontWeight})`);

  const voiceBtn = page.locator('[data-slot="composer-voice-button"]');
  const voiceBox = await voiceBtn.boundingBox();
  assert(voiceBox.width === 32 && voiceBox.height === 32, `Voice button is 32x32px (got ${voiceBox.width}x${voiceBox.height})`);

  const sendBtn = page.locator('[data-slot="composer-send"]');
  const sendBox = await sendBtn.boundingBox();
  assert(sendBox.width === 32 && sendBox.height === 32, `Send button is 32x32px (got ${sendBox.width}x${sendBox.height})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-default-dark.png') });

  // 2. Active Input State
  await page.goto(`${BASE_URL}?id=default-application-75-composer--active-input&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer"]');

  const activeSendState = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(activeSendState === 'active', `Send button is active when text is entered`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-active-dark.png') });

  // 3. Streaming State
  await page.goto(`${BASE_URL}?id=default-application-75-composer--streaming&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer"]');

  const streamingSendState = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(streamingSendState === 'streaming', `Send button enters streaming state`);

  const hasSquareIcon = await page.locator('[data-slot="composer-send"] svg rect').count();
  assert(hasSquareIcon === 1, `Send button displays stop square icon during streaming`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-streaming-dark.png') });

  // 4. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-75-composer--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-composer');

  // Type in input
  await page.fill('[data-slot="composer-input"]', 'Synthesize code review');
  await page.dispatchEvent('[data-slot="composer-input"]', 'input');

  const isNowActive = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(isNowActive === 'active', `Typing dynamically sets send button to active`);

  // Click Send -> Stream
  await page.click('[data-slot="composer-send"]');
  const isNowStreaming = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(isNowStreaming === 'streaming', `Clicking send triggers streaming state`);

  // Click Stop -> Exit stream
  await page.click('[data-slot="composer-send"]');
  const isNoLongerStreaming = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(isNoLongerStreaming === 'active', `Clicking stop exits streaming back to active`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-interactive-dark.png') });

  // 5. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-75-composer--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-default-light.png') });

  console.log(`\nRESULT: ${passed}/${total} assertions passed.`);
  await browser.close();

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
