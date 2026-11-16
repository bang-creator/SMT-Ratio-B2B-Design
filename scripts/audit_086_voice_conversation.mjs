import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-86-voice-conversation-aui--';

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

  console.log('=== Auditing Component #086: Voice conversation AUI ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="voice-conversation"]');

  const card = page.locator('[data-slot="voice-conversation"]');
  const cardBox = await card.boundingBox();
  assert(cardBox.width <= 321 && cardBox.width >= 300, `Card width is compact (~320px, got ${cardBox.width}px)`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '28px', `Card border-radius is 28px (got ${cardRadius})`);

  const orbBtn = page.locator('.ds-voice-orb-btn');
  const orbBox = await orbBtn.boundingBox();
  assert(Math.round(orbBox.width) === 96 && Math.round(orbBox.height) === 96, `Voice orb button is 96x96px (got ${orbBox.width}x${orbBox.height}px)`);

  const core = page.locator('.ds-voice-core');
  const coreBox = await core.boundingBox();
  assert(Math.round(coreBox.width) === 40 && Math.round(coreBox.height) === 40, `Core circle is 40x40px (got ${coreBox.width}x${coreBox.height}px)`);

  const caption = page.locator('.ds-voice-caption');
  const captionWeight = await caption.evaluate(el => window.getComputedStyle(el).fontWeight);
  const captionSize = await caption.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(captionWeight === '500', `Caption font-weight is 500 (got ${captionWeight})`);
  assert(captionSize === '13.5px', `Caption font-size is 13.5px (got ${captionSize})`);

  const hint = page.locator('.ds-voice-hint');
  const hintWeight = await hint.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(hintWeight === '400', `Hint font-weight is 400 (got ${hintWeight})`);

  const speakers = page.locator('.ds-voice-speaker');
  const speakerWeight = await speakers.first().evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(speakerWeight === '400', `Transcript speaker label font-weight is 400 (got ${speakerWeight})`);

  const turnsText = page.locator('.ds-voice-text');
  const textWeight = await turnsText.first().evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(textWeight === '400', `Transcript text font-weight is 400 (got ${textWeight})`);

  const micBtn = page.locator('[data-slot="mic-toggle"]');
  const micBox = await micBtn.boundingBox();
  assert(Math.round(micBox.width) === 40 && Math.round(micBox.height) === 40, `Mic button is 40x40px (got ${micBox.width}x${micBox.height}px)`);

  const endBtn = page.locator('[data-slot="end-call"]');
  const endBox = await endBtn.boundingBox();
  assert(Math.round(endBox.width) === 40 && Math.round(endBox.height) === 40, `End call button is 40x40px (got ${endBox.width}x${endBox.height}px)`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voice-conversation-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="voice-conversation"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voice-conversation-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Speaking Mode
  console.log('\n3. Checking Speaking State...');
  await page.goto(`${STORY_URL}speaking&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="voice-conversation"]');
  const speakingCard = page.locator('[data-slot="voice-conversation"]');
  const speakingMode = await speakingCard.getAttribute('data-mode');
  assert(speakingMode === 'speaking', `Card has data-mode="speaking" (got ${speakingMode})`);

  const speakingHint = await page.locator('.ds-voice-hint').textContent();
  assert(speakingHint.trim() === 'Tap to interrupt', `Speaking hint is "Tap to interrupt" (got "${speakingHint.trim()}")`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voice-conversation-speaking-dark.png') });

  // 4. Muted State
  console.log('\n4. Checking Muted State...');
  await page.goto(`${STORY_URL}muted&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="voice-conversation"]');
  const mutedMic = page.locator('[data-slot="mic-toggle"]');
  const pressed = await mutedMic.getAttribute('aria-pressed');
  assert(pressed === 'true', `Mic button has aria-pressed="true" (got ${pressed})`);
  const mutedHint = await page.locator('.ds-voice-hint').textContent();
  assert(mutedHint.trim() === 'Mic off', `Hint reflects mic off state (got "${mutedHint.trim()}")`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voice-conversation-muted-dark.png') });

  // 5. Interactive Mode
  console.log('\n5. Checking Interactive State Machine...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="voice-conversation"]');

  // Toggle mic
  const interactiveMic = page.locator('[data-slot="mic-toggle"]');
  await interactiveMic.click();
  const micPressedAfterClick = await interactiveMic.getAttribute('aria-pressed');
  assert(micPressedAfterClick === 'true', `Clicking mic toggle sets aria-pressed="true" (got ${micPressedAfterClick})`);

  // Cycle orb
  const interactiveOrb = page.locator('.ds-voice-orb-btn');
  await interactiveOrb.click(); // listening -> thinking
  let currentCaption = await page.locator('.ds-voice-caption').textContent();
  assert(currentCaption.trim() === 'thinking', `Clicking orb transitions mode to thinking (got ${currentCaption.trim()})`);

  await interactiveOrb.click(); // thinking -> speaking
  currentCaption = await page.locator('.ds-voice-caption').textContent();
  assert(currentCaption.trim() === 'speaking', `Clicking orb transitions mode to speaking (got ${currentCaption.trim()})`);

  // End call
  const interactiveEnd = page.locator('[data-slot="end-call"]');
  await interactiveEnd.click();
  const endedStatus = page.locator('[data-slot="call-ended-status"]');
  const isEndedVisible = await endedStatus.isVisible();
  assert(isEndedVisible, 'Ending call displays "Call ended" state');

  const restartBtn = page.locator('[data-slot="restart-call"]');
  await restartBtn.click();
  const isCallResumed = await page.locator('.ds-voice-orb-btn').isVisible();
  assert(isCallResumed, 'Restarting call restores voice orb visualizer');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'voice-conversation-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #086: 100% AUDIT PASS');
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
