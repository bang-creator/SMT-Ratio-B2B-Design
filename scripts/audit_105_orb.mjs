import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #105: Orb AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="orb"]', { timeout: 5000 });

  const orb = await page.$('[data-slot="orb-core"]');
  const orbBox = await orb.boundingBox();
  const orbStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      width: s.width,
      height: s.height,
    };
  }, orb);

  assert(Math.round(orbBox.width) === 128 && Math.round(orbBox.height) === 128, `Orb size is exactly 128x128px (got ${orbBox.width}x${orbBox.height})`);
  assert(orbStyles.borderRadius === '9999px' || orbStyles.borderRadius.includes('50%'), `Orb border-radius is circular (got ${orbStyles.borderRadius})`);

  // Ripples
  const ripples = await page.$$('.ds-voice-orb__ripple');
  assert(ripples.length === 2, `Has 2 acoustic ripple rings (got ${ripples.length})`);

  // Label
  const label = await page.$('[data-slot="orb-label"]');
  const labelStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, label);
  assert(labelStyles.fontSize === '14px', `Label font size is 14px (got ${labelStyles.fontSize})`);
  assert(labelStyles.fontWeight === '500', `Label font weight is 500 (got ${labelStyles.fontWeight})`);
  assert((await label.innerText()).trim() === 'Listening', 'Default label is Listening');

  // Controls
  const iconBtns = await page.$$('.ds-voice-orb__icon-btn');
  assert(iconBtns.length === 2, `Has 2 control buttons (got ${iconBtns.length})`);
  const muteBox = await iconBtns[0].boundingBox();
  assert(Math.round(muteBox.width) === 36 && Math.round(muteBox.height) === 36, `Mute button is 36x36px (got ${muteBox.width}x${muteBox.height})`);

  // Screenshot Default Dark
  const wrap = await page.$('[data-slot="orb"]');
  const wrapBox = await wrap.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/orb-default-dark.png`,
    clip: { x: wrapBox.x - 20, y: wrapBox.y - 20, width: wrapBox.width + 40, height: wrapBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="orb"]', { timeout: 5000 });
  const lightWrap = await page.$('[data-slot="orb"]');
  const lightBox = await lightWrap.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/orb-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Idle Story
  console.log('\n--- Auditing Idle Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--idle&globals=theme:dark`);
  await page.waitForSelector('[data-action="connect"]', { timeout: 5000 });
  const connectBtn = await page.$('[data-action="connect"]');
  assert(connectBtn !== null, 'Connect button is rendered in Idle story');
  const connectBox = await connectBtn.boundingBox();
  assert(Math.round(connectBox.height) === 36, `Connect button height is 36px (got ${connectBox.height})`);
  const idleOrb = await page.$('.ds-voice-orb--idle');
  assert(idleOrb !== null, 'Orb has ds-voice-orb--idle class');

  // 4. Audit Connecting Story
  console.log('\n--- Auditing Connecting Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--connecting&globals=theme:dark`);
  await page.waitForSelector('.ds-voice-orb--connecting', { timeout: 5000 });
  const connOrb = await page.$('.ds-voice-orb--connecting');
  assert(connOrb !== null, 'Orb has ds-voice-orb--connecting class');

  // 5. Audit Listening Story
  console.log('\n--- Auditing Listening Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--listening&globals=theme:dark`);
  await page.waitForSelector('.ds-voice-orb--listening', { timeout: 5000 });
  const listenOrb = await page.$('.ds-voice-orb--listening');
  assert(listenOrb !== null, 'Orb has ds-voice-orb--listening class');

  // 6. Audit Muted Story
  console.log('\n--- Auditing Muted Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--muted&globals=theme:dark`);
  await page.waitForSelector('.ds-voice-orb--muted', { timeout: 5000 });
  const mutedOrb = await page.$('.ds-voice-orb--muted');
  assert(mutedOrb !== null, 'Orb has ds-voice-orb--muted class');

  // 7. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-105-orb-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="orb"]', { timeout: 5000 });

  // Click mute
  const muteBtn = await page.$('[data-action="toggle-mute"]');
  await muteBtn.click();
  const interWrap = await page.$('[data-slot="orb"]');
  assert((await interWrap.getAttribute('data-state')) === 'muted', 'Clicking mute button sets state to muted');

  // Click unmute (re-query after DOM update)
  const unmuteBtn = await page.$('[data-action="toggle-mute"]');
  await unmuteBtn.click();
  assert((await interWrap.getAttribute('data-state')) === 'listening', 'Clicking mute button again sets state back to listening');

  // End session
  const endBtn = await page.$('[data-action="end-session"]');
  await endBtn.click();
  assert((await interWrap.getAttribute('data-state')) === 'idle', 'Clicking end session sets state to idle');
  const interConnect = await page.$('[data-action="connect"]');
  assert(interConnect !== null, 'Connect button appears when idle');

  // Re-connect
  await interConnect.click();
  assert((await interWrap.getAttribute('data-state')) === 'connecting', 'Clicking connect sets state to connecting');

  await page.waitForTimeout(900);
  assert((await interWrap.getAttribute('data-state')) === 'listening', 'Connecting completes and enters listening');

  const interBox = await interWrap.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/orb-interactive-dark.png`,
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
