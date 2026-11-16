import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 009 MESSAGE ACTIONS ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const results = {
    checks: [],
    measurements: {},
    passed: 0,
    total: 0,
  };

  function assert(name, condition, details) {
    results.total++;
    if (condition) {
      results.passed++;
      results.checks.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}: ${details}`);
    } else {
      results.checks.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name}: ${details}`);
    }
  }

  try {
    // 1. Dark Mode: Default Story
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-09-message-actions--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-actions');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/message-actions-default-dark.png` });

    const actionsData = await pageDark.locator('.ds-message-actions').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const buttons = el.querySelectorAll('button');
      const b0 = buttons[0];
      const b0S = b0 ? window.getComputedStyle(b0) : {};
      const svg0 = b0 ? b0.querySelector('svg') : null;
      const svg0Rect = svg0 ? svg0.getBoundingClientRect() : {};

      return {
        slot: el.getAttribute('data-slot'),
        gap: s.gap,
        btnCount: buttons.length,
        btnWidth: b0S.width,
        btnHeight: b0S.height,
        btnRadius: b0S.borderRadius,
        svgWidth: svg0Rect.width,
        svgHeight: svg0Rect.height,
        copyLabel: b0 ? b0.getAttribute('aria-label') : null,
        upLabel: buttons[1] ? buttons[1].getAttribute('aria-label') : null,
        upPressed: buttons[1] ? buttons[1].getAttribute('aria-pressed') : null,
        downLabel: buttons[2] ? buttons[2].getAttribute('aria-label') : null,
        downPressed: buttons[2] ? buttons[2].getAttribute('aria-pressed') : null,
        regenLabel: buttons[3] ? buttons[3].getAttribute('aria-label') : null,
        moreLabel: buttons[4] ? buttons[4].getAttribute('aria-label') : null,
      };
    });

    results.measurements.defaultDark = actionsData;
    assert('Data Slot Attribute', actionsData.slot === 'message-actions', `data-slot: ${actionsData.slot}`);
    assert('Container Gap (4px)', actionsData.gap === '4px', `gap: ${actionsData.gap}`);
    assert('Action Button Count (5 buttons)', actionsData.btnCount === 5, `Buttons: ${actionsData.btnCount}`);
    assert('Button Dimensions (28x28px / size-7)', actionsData.btnWidth === '28px' && actionsData.btnHeight === '28px', `Size: ${actionsData.btnWidth}x${actionsData.btnHeight}`);
    assert('Button Border Radius (Pill)', actionsData.btnRadius === '9999px', `Radius: ${actionsData.btnRadius}`);
    assert('SVG Icon Dimensions (14x14px)', Math.round(actionsData.svgWidth) === 14 && Math.round(actionsData.svgHeight) === 14, `SVG: ${actionsData.svgWidth}x${actionsData.svgHeight}px`);
    assert('Copy Button ARIA', actionsData.copyLabel === 'Copy response', `label: "${actionsData.copyLabel}"`);
    assert('Thumbs Up ARIA', actionsData.upLabel === 'Mark response helpful' && actionsData.upPressed === 'false', `label: "${actionsData.upLabel}", pressed: ${actionsData.upPressed}`);
    assert('Thumbs Down ARIA', actionsData.downLabel === 'Mark response unhelpful' && actionsData.downPressed === 'false', `label: "${actionsData.downLabel}", pressed: ${actionsData.downPressed}`);
    assert('Regenerate Button ARIA', actionsData.regenLabel === 'Regenerate response', `label: "${actionsData.regenLabel}"`);
    assert('More Button ARIA', actionsData.moreLabel === 'More response actions', `label: "${actionsData.moreLabel}"`);

    // Interactive button clicks
    console.log('\n[2/5] Testing Interactive Actions (Copy, Helpful, Unhelpful)...');
    await pageDark.click('.ds-action-btn-copy');
    const copiedLabel = await pageDark.locator('.ds-action-btn-copy').getAttribute('aria-label');
    const copiedColor = await pageDark.locator('.ds-action-btn-copy').evaluate((el) => window.getComputedStyle(el).color);
    assert('Click Copy -> Copied Response (Green Token)', copiedLabel === 'Copied response' && copiedColor === 'rgb(16, 163, 127)', `Label: "${copiedLabel}", color: ${copiedColor}`);

    await pageDark.click('.ds-action-btn-up');
    const upPressedNow = await pageDark.locator('.ds-action-btn-up').getAttribute('aria-pressed');
    assert('Click Helpful -> aria-pressed="true"', upPressedNow === 'true', `pressed: ${upPressedNow}`);

    await pageDark.click('.ds-action-btn-down');
    const downPressedNow = await pageDark.locator('.ds-action-btn-down').getAttribute('aria-pressed');
    const upToggledOff = await pageDark.locator('.ds-action-btn-up').getAttribute('aria-pressed');
    assert('Click Unhelpful -> Toggles Helpful off', downPressedNow === 'true' && upToggledOff === 'false', `down: ${downPressedNow}, up: ${upToggledOff}`);

    // Light Mode Default Story
    console.log('\n[3/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-09-message-actions--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-message-actions');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/message-actions-default-light.png` });

    // 4. State Variants (Copied, Helpful, Unhelpful, Regenerating)
    console.log('\n[4/5] Auditing State Variants...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-09-message-actions--copied&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-actions');
    const stageCopied = await pageDark.locator('.ds-story-stage').first();
    await stageCopied.screenshot({ path: `${ARTIFACT_DIR}/message-actions-copied-dark.png` });
    const copiedStateLabel = await pageDark.locator('.ds-action-btn-copy').getAttribute('aria-label');
    assert('Copied Story Preset', copiedStateLabel === 'Copied response', `label: "${copiedStateLabel}"`);

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-09-message-actions--regenerating&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-actions');
    const stageRegen = await pageDark.locator('.ds-story-stage').first();
    await stageRegen.screenshot({ path: `${ARTIFACT_DIR}/message-actions-regenerating-dark.png` });
    const regenAnim = await pageDark.locator('.ds-action-btn-refresh span').evaluate((el) => window.getComputedStyle(el).animationName);
    assert('Regenerating Icon Spins', regenAnim.includes('ds-spin'), `Animation: ${regenAnim}`);

    // 5. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmSpin = await pageDark.locator('.ds-action-btn-refresh span').evaluate((el) => window.getComputedStyle(el).animationName);
    assert('Reduced Motion Disables Spin Animation', rmSpin === 'none', `Animation: ${rmSpin}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/009_message_actions_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
