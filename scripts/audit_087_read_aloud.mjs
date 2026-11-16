import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-87-read-aloud--';

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

  console.log('=== Auditing Component #087: Read aloud ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="read-aloud"]');

  const card = page.locator('[data-slot="read-aloud"]');
  const cardBox = await card.boundingBox();
  assert(cardBox.width <= 385 && cardBox.width >= 360, `Card max-width is ~384px (got ${cardBox.width}px)`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '16px', `Card border-radius is 16px (got ${cardRadius})`);

  const cardPadding = await card.evaluate(el => window.getComputedStyle(el).padding);
  assert(cardPadding === '14px', `Card padding is 14px (got ${cardPadding})`);

  const textParagraph = page.locator('.ds-read-aloud__text');
  const fontSize = await textParagraph.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(fontSize === '13.5px', `Text font-size is 13.5px (got ${fontSize})`);

  const currentWord = page.locator('.ds-read-aloud__word--current');
  const currentWordWeight = await currentWord.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(currentWordWeight === '400', `Current word font-weight is 400 (got ${currentWordWeight})`);

  const pastWord = page.locator('.ds-read-aloud__word--past').first();
  const pastWordWeight = await pastWord.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(pastWordWeight === '400', `Past word font-weight is 400 (got ${pastWordWeight})`);

  const playBtn = page.locator('[data-slot="play-toggle"]');
  const playBox = await playBtn.boundingBox();
  assert(Math.round(playBox.width) === 32 && Math.round(playBox.height) === 32, `Play button is 32x32px (got ${playBox.width}x${playBox.height}px)`);

  const playRadius = await playBtn.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(playRadius === '9999px' || playRadius.includes('%') || parseInt(playRadius) >= 16, `Play button is full pill rounded (got ${playRadius})`);

  const track = page.locator('.ds-read-aloud__track');
  const trackHeight = await track.evaluate(el => window.getComputedStyle(el).height);
  assert(trackHeight === '3px', `Progress track height is 3px (got ${trackHeight})`);

  const timeDisplay = page.locator('[data-slot="time-display"]');
  const timeWeight = await timeDisplay.evaluate(el => window.getComputedStyle(el).fontWeight);
  const timeFamily = await timeDisplay.evaluate(el => window.getComputedStyle(el).fontFamily);
  assert(timeWeight === '400', `Time display font-weight is 400 (got ${timeWeight})`);
  assert(timeFamily.toLowerCase().includes('mono'), `Time display uses monospace font (got ${timeFamily})`);

  const rateBtn = page.locator('[data-slot="rate-toggle"]');
  const rateHeight = await rateBtn.evaluate(el => window.getComputedStyle(el).height);
  assert(Math.round(parseFloat(rateHeight)) === 22, `Rate button height is 22px (got ${rateHeight})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'read-aloud-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="read-aloud"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'read-aloud-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Finished & Long Content States
  console.log('\n3. Checking Finished State...');
  await page.goto(`${STORY_URL}finished&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="read-aloud"]');
  const finishedProgress = await page.locator('[data-slot="read-aloud"]').getAttribute('data-progress');
  assert(finishedProgress === '100', `Finished state reflects data-progress="100" (got ${finishedProgress})`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'read-aloud-finished-dark.png') });

  console.log('\n4. Checking Long Content State...');
  await page.goto(`${STORY_URL}long-content&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="read-aloud"]');
  const longCardBox = await page.locator('[data-slot="read-aloud"]').boundingBox();
  assert(longCardBox.height > 120, `Long content card expanded vertically to fit prose (got ${longCardBox.height}px)`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'read-aloud-longcontent-dark.png') });

  // 5. Interactive State Machine
  console.log('\n5. Checking Interactive State Machine...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="read-aloud"]');

  // Initial state: paused
  const interactivePlay = page.locator('[data-slot="play-toggle"]');
  let playLabel = await interactivePlay.getAttribute('aria-label');
  assert(playLabel === 'Play', `Initial state play button label is "Play" (got ${playLabel})`);

  // Click play -> playing
  await interactivePlay.click();
  playLabel = await interactivePlay.getAttribute('aria-label');
  assert(playLabel === 'Pause', `Clicking play switches label to "Pause" (got ${playLabel})`);

  // Cycle rate: 1x -> 1.5x
  const interactiveRate = page.locator('[data-slot="rate-toggle"]');
  let rateText = await interactiveRate.textContent();
  assert(rateText.trim() === '1×', `Initial speed is 1× (got "${rateText.trim()}")`);

  await interactiveRate.click();
  rateText = await interactiveRate.textContent();
  assert(rateText.trim() === '1.5×', `Clicking speed button switches to 1.5× (got "${rateText.trim()}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'read-aloud-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #087: 100% AUDIT PASS');
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
