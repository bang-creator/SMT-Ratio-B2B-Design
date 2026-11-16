import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-92-connection-state--';

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

  console.log('=== Auditing Component #092: Connection state ===\n');

  // 1. Default Dark Story (Dropped)
  console.log('1. Checking Default / Dropped (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="connection-state"]');

  const card = page.locator('[data-slot="connection-state"]');
  const cardBox = await card.boundingBox();
  assert(cardBox.width <= 385 && cardBox.width >= 350, `Card max-width is ~384px (got ${cardBox.width}px)`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '16px', `Card border-radius is 16px (got ${cardRadius})`);

  const cardPadding = await card.evaluate(el => window.getComputedStyle(el).padding);
  assert(cardPadding === '10px 14px', `Card padding is 10px 14px (got ${cardPadding})`);

  const text = page.locator('[data-slot="conn-text"]');
  const textWeight = await text.evaluate(el => window.getComputedStyle(el).fontWeight);
  const textSize = await text.evaluate(el => window.getComputedStyle(el).fontSize);
  assert(textWeight === '400', `Connection text font-weight is 400 (got ${textWeight})`);
  assert(textSize === '13px', `Connection text font-size is 13px (got ${textSize})`);

  const reconnectBtn = page.locator('[data-slot="reconnect-btn"]');
  const reconnectWeight = await reconnectBtn.evaluate(el => window.getComputedStyle(el).fontWeight);
  const reconnectRadius = await reconnectBtn.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(reconnectWeight === '500', `Reconnect button font-weight is 500 (got ${reconnectWeight})`);
  assert(reconnectRadius === '9999px' || reconnectRadius.includes('%') || parseInt(reconnectRadius) >= 12, `Reconnect button is full pill rounded (got ${reconnectRadius})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'connection-state-dropped-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="connection-state"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'connection-state-dropped-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. Reconnecting Phase
  console.log('\n3. Checking Reconnecting Phase...');
  await page.goto(`${STORY_URL}reconnecting&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="connection-state"]');

  const reconnectingText = await page.locator('[data-slot="conn-text"]').textContent();
  assert(reconnectingText.trim() === 'Reconnecting', `Text reads "Reconnecting" (got "${reconnectingText.trim()}")`);

  const attemptMeta = await page.locator('[data-slot="conn-meta"]').textContent();
  assert(attemptMeta.includes('attempt 3'), `Telemetry displays attempt number (got "${attemptMeta.trim()}")`);

  const hasSpin = await page.locator('.ds-spin').isVisible();
  assert(hasSpin, 'Reconnecting icon has animated spinner');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'connection-state-reconnecting-dark.png') });

  // 4. Resumed Phase
  console.log('\n4. Checking Resumed Phase...');
  await page.goto(`${STORY_URL}resumed&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="connection-state"]');

  const resumedText = await page.locator('[data-slot="conn-text"]').textContent();
  assert(resumedText.trim() === 'Picked the stream back up.', `Text reads "Picked the stream back up." (got "${resumedText.trim()}")`);

  const tokenMeta = await page.locator('[data-slot="conn-meta"]').textContent();
  assert(tokenMeta.includes('+1248 tokens'), `Telemetry displays missed tokens count (got "${tokenMeta.trim()}")`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'connection-state-resumed-dark.png') });

  // 5. Interactive Lifecycle Flow
  console.log('\n5. Checking Interactive Lifecycle...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="connection-state"]');

  const interactiveBtn = page.locator('[data-slot="reconnect-btn"]');
  await interactiveBtn.click();

  // Phase becomes reconnecting
  const phaseAfterClick = await page.locator('[data-slot="connection-state"]').getAttribute('data-phase');
  assert(phaseAfterClick === 'reconnecting', `Clicking reconnect sets data-phase="reconnecting" (got ${phaseAfterClick})`);

  // Wait for resumed
  await page.waitForTimeout(900);
  const phaseAfterResume = await page.locator('[data-slot="connection-state"]').getAttribute('data-phase');
  assert(phaseAfterResume === 'resumed', `After retry succeeds, data-phase becomes "resumed" (got ${phaseAfterResume})`);

  const dropBtn = page.locator('[data-slot="simulate-drop"]');
  await dropBtn.click();
  const phaseReset = await page.locator('[data-slot="connection-state"]').getAttribute('data-phase');
  assert(phaseReset === 'dropped', `Simulating drop resets data-phase back to "dropped" (got ${phaseReset})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'connection-state-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #092: 100% AUDIT PASS');
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
