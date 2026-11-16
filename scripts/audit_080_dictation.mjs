import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #080 COMPOSER DICTATION / VOICE ---');
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

  // 1. Default Idle State
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-voice-button"]');

  const voiceBtn = page.locator('[data-slot="composer-voice-button"]');
  const voiceBtnBox = await voiceBtn.boundingBox();
  const voiceBtnStyles = await voiceBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius };
  });

  assert(Math.round(voiceBtnBox.width) === 32 && Math.round(voiceBtnBox.height) === 32, `Voice button is 32x32px (got ${Math.round(voiceBtnBox.width)}x${Math.round(voiceBtnBox.height)}px)`);
  assert(parseInt(voiceBtnStyles.borderRadius, 10) >= 16, `Voice button is full pill radius (got ${voiceBtnStyles.borderRadius})`);

  const inputCount = await page.locator('[data-slot="composer-input"]').count();
  assert(inputCount === 1, `Default idle state renders input field`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-default-dark.png') });

  // 2. Recording State
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--recording&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-voice"]');

  const voiceSlot = page.locator('[data-slot="composer-voice"]');
  const voiceSlotStyles = await voiceSlot.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { minHeight: s.minHeight, display: s.display, gap: s.gap };
  });

  assert(voiceSlotStyles.minHeight === '44px', `Recording slot min-height is 44px (got ${voiceSlotStyles.minHeight})`);
  assert(voiceSlotStyles.display === 'flex', `Recording slot display is flex (got ${voiceSlotStyles.display})`);
  assert(voiceSlotStyles.gap === '12px', `Recording slot gap is 12px (got ${voiceSlotStyles.gap})`);

  // Pulsing dot
  const dot = page.locator('.ds-composer-voice-dot');
  const dotBox = await dot.boundingBox();
  const dotStyles = await dot.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { borderRadius: s.borderRadius, backgroundColor: s.backgroundColor };
  });

  assert(Math.round(dotBox.width) === 6 && Math.round(dotBox.height) === 6, `Pulsing dot is 6x6px (got ${Math.round(dotBox.width)}x${Math.round(dotBox.height)}px)`);
  assert(dotStyles.borderRadius === '9999px', `Pulsing dot radius is full pill (got ${dotStyles.borderRadius})`);
  assert(dotStyles.backgroundColor.includes('2, 133, 255'), `Pulsing dot uses blue chart series primary token (got ${dotStyles.backgroundColor})`);

  // Waveform bars
  const barsCount = await page.locator('.ds-composer-voice-bar').count();
  assert(barsCount === 8, `Recording displays 8 waveform audio bars (got ${barsCount})`);

  // Timer
  const timer = page.locator('.ds-composer-voice-timer');
  const timerText = await timer.textContent();
  const timerStyles = await timer.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(timerText === '0:14', `Timer text is '0:14' (got "${timerText}")`);
  assert(timerStyles.fontSize === '13px' && timerStyles.fontWeight === '400', `Timer typography is 13px/400 (got ${timerStyles.fontSize}/${timerStyles.fontWeight})`);

  // Active voice button stop icon
  const activeBtn = page.locator('[data-slot="composer-voice-button"][data-active="true"]');
  const stopRectCount = await activeBtn.locator('svg rect').count();
  assert(stopRectCount === 1, `Active voice button displays square stop icon`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-recording-dark.png') });

  // 3. Transcribing State
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--transcribing&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-voice"]');

  const transcribingLabel = await page.locator('.ds-composer-voice-transcribing').textContent();
  assert(transcribingLabel === 'Transcribing', `Transcribing state displays 'Transcribing' label (got "${transcribingLabel}")`);

  const collapsedBarHeight = await page.locator('.ds-composer-voice-bar').first().evaluate((el) => {
    return window.getComputedStyle(el).height;
  });
  assert(collapsedBarHeight === '3px', `Transcribing bars collapse to 3px height (got ${collapsedBarHeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-transcribing-dark.png') });

  // 4. Success State
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--success&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-input"]');

  const transcribedVal = await page.locator('[data-slot="composer-input"]').inputValue();
  assert(transcribedVal === 'Add a regression test for draft restore', `Success state populates transcript into input`);

  const sendBtnState = await page.locator('[data-slot="composer-send"]').getAttribute('data-state');
  assert(sendBtnState === 'active', `Send button is active when transcript is populated`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-success-dark.png') });

  // 5. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="composer-voice-button"]');

  // Click voice button -> start recording
  await page.click('[data-slot="composer-voice-button"]');
  assert(await page.locator('.ds-composer-voice-dot').count() === 1, `Clicking voice button begins recording`);

  // Click voice button -> transcribing
  await page.click('[data-slot="composer-voice-button"]');
  assert(await page.locator('.ds-composer-voice-transcribing').count() === 1, `Second click transitions to transcribing`);

  // Click voice button -> transcribed into input
  await page.click('[data-slot="composer-voice-button"]');
  const inputVal = await page.locator('[data-slot="composer-input"]').inputValue();
  assert(inputVal === 'Add a regression test for draft restore', `Third click completes transcription`);

  // Click Reset
  await page.click('[data-btn-reset]');
  const resetVal = await page.locator('[data-slot="composer-input"]').inputValue();
  assert(resetVal === '', `Reset restores initial empty input`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-interactive-dark.png') });

  // 6. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-80-dictation--recording&globals=theme:light`);
  await page.waitForSelector('[data-slot="composer-voice"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'composer-voice-recording-light.png') });

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
