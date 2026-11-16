import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #108: Conversation map AUI...');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
  });

  const page = await context.newPage();
  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- Story 1: Default (Dark & Light) ---
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-108-conversation-map-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="conversation-map"]');

  const nav = await page.$('[data-slot="conversation-map"]');
  const navBox = await nav.boundingBox();
  assert(Math.round(navBox.width) === 24, `Nav rail width is 24px (got ${Math.round(navBox.width)}px)`);

  const ticks = await page.$$('[data-slot="conversation-map-tick"]');
  assert(ticks.length === 5, `Has 5 conversation turn ticks (got ${ticks.length})`);

  // Check active tick
  const activeTick = await page.$('[data-slot="conversation-map-tick"][data-active]');
  assert(activeTick !== null, 'Active tick has data-active attribute');

  const ariaCurrent = await activeTick.getAttribute('aria-current');
  assert(ariaCurrent === 'true', `Active tick has aria-current="true" (got ${ariaCurrent})`);

  // Check in-view ticks
  const inViewCount = await page.$$eval('[data-slot="conversation-map-tick"][data-in-view]', (els) => els.length);
  assert(inViewCount === 3, `Has 3 in-view ticks (got ${inViewCount})`);

  // Check bar geometry
  const barStyles = await page.$eval('[data-slot="conversation-map-tick"][data-active] .ds-conv-map__bar', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      borderRadius: cs.borderRadius,
      height: cs.height,
    };
  });
  assert(barStyles.borderRadius === '9999px', `Bar border radius is pill 9999px (got ${barStyles.borderRadius})`);
  assert(barStyles.height === '3px', `Active bar height is 3px (got ${barStyles.height})`);

  // Test Hover Preview Card
  console.log('\n--- Testing Hover Preview Popup ---');
  const popup = await page.$('[data-slot="conversation-map-popup"]');
  let isPopupVisible = await page.$eval('[data-slot="conversation-map-popup"]', (el) => el.classList.contains('is-visible'));
  assert(!isPopupVisible, 'Popup is hidden initially');

  // Hover first tick
  await ticks[0].hover();
  await page.waitForTimeout(200);

  isPopupVisible = await page.$eval('[data-slot="conversation-map-popup"]', (el) => el.classList.contains('is-visible'));
  assert(isPopupVisible, 'Popup is visible on tick hover');

  const popupTitle = await page.$eval('[data-slot="popup-title"]', (el) => el.textContent.trim());
  assert(popupTitle === 'Why did the nightly export job fail?', `Popup title matches hovered turn (got "${popupTitle}")`);

  const popupStyles = await page.$eval('[data-slot="conversation-map-popup"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      borderRadius: cs.borderRadius,
    };
  });
  assert(popupStyles.width === '240px', `Popup width is 240px (got ${popupStyles.width})`);
  assert(popupStyles.borderRadius === '16px', `Popup border radius is 16px (got ${popupStyles.borderRadius})`);

  const titleStyles = await page.$eval('[data-slot="popup-title"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(titleStyles.fontSize === '13px', `Popup title font-size is 13px (got ${titleStyles.fontSize})`);
  assert(titleStyles.fontWeight === '500', `Popup title font-weight is 500 (got ${titleStyles.fontWeight})`);

  const previewStyles = await page.$eval('[data-slot="popup-preview"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(previewStyles.fontSize === '13px', `Popup preview font-size is 13px (got ${previewStyles.fontSize})`);
  assert(previewStyles.fontWeight === '400', `Popup preview font-weight is 400 (got ${previewStyles.fontWeight})`);

  // Mouse leave
  await page.mouse.move(0, 0);
  await page.waitForTimeout(200);
  isPopupVisible = await page.$eval('[data-slot="conversation-map-popup"]', (el) => el.classList.contains('is-visible'));
  assert(!isPopupVisible, 'Popup hides on mouse leave');

  // Test Keyboard Navigation
  console.log('\n--- Testing Keyboard Navigation ---');
  await activeTick.focus();
  await page.waitForTimeout(100);

  // Press ArrowDown
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(100);

  const focusedIndex = await page.evaluate(() => {
    const activeEl = document.activeElement;
    return activeEl ? activeEl.getAttribute('data-index') : null;
  });
  assert(focusedIndex === '3', `ArrowDown moved focus to next turn (got index ${focusedIndex})`);

  // Press End
  await page.keyboard.press('End');
  await page.waitForTimeout(100);
  const endIndex = await page.evaluate(() => document.activeElement.getAttribute('data-index'));
  assert(endIndex === '4', `End key moved focus to last turn (got index ${endIndex})`);

  // Press Home
  await page.keyboard.press('Home');
  await page.waitForTimeout(100);
  const homeIndex = await page.evaluate(() => document.activeElement.getAttribute('data-index'));
  assert(homeIndex === '0', `Home key moved focus to first turn (got index ${homeIndex})`);

  // Click to activate turn 0
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const newActiveId = await page.$eval('[data-slot="conversation-map-tick"][data-active]', (el) => el.getAttribute('data-id'));
  assert(newActiveId === 'turn-1', `Click/Enter updated active turn to turn-1 (got ${newActiveId})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-map-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-108-conversation-map-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="conversation-map"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-map-default-light.png') });

  // --- Story 2: LongThread ---
  console.log('\n--- Auditing LongThread Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-108-conversation-map-aui--long-thread&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="conversation-map"]');

  const longTicks = await page.$$('[data-slot="conversation-map-tick"]');
  assert(longTicks.length === 16, `Has 16 ticks in long thread (got ${longTicks.length})`);

  // --- Story 3: InThreadView ---
  console.log('\n--- Auditing InThreadView Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-108-conversation-map-aui--in-thread-view&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="conv-map-shell"]');

  const shellBox = await page.$eval('[data-slot="conv-map-shell"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
    };
  });
  assert(shellBox.maxWidth === '640px', `Shell max-width is 640px (got ${shellBox.maxWidth})`);
  assert(shellBox.borderRadius === '20px', `Shell border radius is 20px (got ${shellBox.borderRadius})`);

  const messagesCount = await page.$$eval('.ds-msg-pair', (els) => els.length);
  assert(messagesCount === 5, `Rendered 5 message pairs in viewport (got ${messagesCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-map-interactive-dark.png') });

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
