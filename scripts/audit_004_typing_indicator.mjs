import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 004 TYPING INDICATOR ---');
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
    // 1. Dark Mode: Bubble Story
    console.log('\n[1/4] Auditing Bubble Variant (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-04-typing-indicator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-typing-indicator');

    const stageBubbleDark = await pageDark.locator('.ds-story-stage').first();
    await stageBubbleDark.screenshot({ path: `${ARTIFACT_DIR}/typing-indicator-bubble-dark.png` });

    const bubbleData = await pageDark.locator('.ds-typing-indicator').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const statusDiv = el.querySelector('[role="status"]');
      const statusS = statusDiv ? window.getComputedStyle(statusDiv) : {};
      const dots = el.querySelectorAll('.ds-typing-indicator__dot');
      const dotDelays = Array.from(dots).map(d => window.getComputedStyle(d).animationDelay);
      const dot0S = dots[0] ? window.getComputedStyle(dots[0]) : {};
      const dot0Rect = dots[0] ? dots[0].getBoundingClientRect() : {};

      return {
        width: rect.width,
        height: rect.height,
        padding: s.padding,
        borderRadius: s.borderRadius,
        bg: s.backgroundColor,
        border: s.border,
        variant: el.getAttribute('data-variant'),
        slot: el.getAttribute('data-slot'),
        ariaRole: statusDiv ? statusDiv.getAttribute('role') : null,
        ariaLabel: statusDiv ? statusDiv.getAttribute('aria-label') : null,
        statusGap: statusS.gap,
        statusDisplay: statusS.display,
        dotCount: dots.length,
        dotComputedWidth: dot0S.width,
        dotComputedHeight: dot0S.height,
        dotWidth: dot0Rect.width,
        dotHeight: dot0Rect.height,
        dotBorderRadius: dot0S.borderRadius,
        dotAnim: dot0S.animationName,
        dotAnimDuration: dot0S.animationDuration,
        dotDelays,
      };
    });

    results.measurements.bubbleDark = bubbleData;
    assert('Bubble Data Slot', bubbleData.slot === 'typing-indicator', `data-slot: ${bubbleData.slot}`);
    assert('Bubble Data Variant', bubbleData.variant === 'bubble', `data-variant: ${bubbleData.variant}`);
    assert('Bubble Border Radius (Pill)', bubbleData.borderRadius === '9999px', `Border radius: ${bubbleData.borderRadius}`);
    assert('Bubble Padding (14px 16px)', bubbleData.padding === '14px 16px', `Padding: ${bubbleData.padding}`);
    assert('ARIA Status Role', bubbleData.ariaRole === 'status', `role: ${bubbleData.ariaRole}`);
    assert('ARIA Status Label', bubbleData.ariaLabel === 'Assistant is typing', `aria-label: "${bubbleData.ariaLabel}"`);
    assert('Status Flex Gap', bubbleData.statusGap === '4px', `Gap: ${bubbleData.statusGap}`);
    assert('Dot Count', bubbleData.dotCount === 3, `Expected 3 dots, got ${bubbleData.dotCount}`);
    assert('Dot Dimensions (6x6px)', bubbleData.dotComputedWidth === '6px' && bubbleData.dotComputedHeight === '6px', `Computed: ${bubbleData.dotComputedWidth}x${bubbleData.dotComputedHeight}, Rect: ${bubbleData.dotWidth}x${bubbleData.dotHeight}px`);
    assert('Dot Border Radius', bubbleData.dotBorderRadius === '9999px', `Dot radius: ${bubbleData.dotBorderRadius}`);
    assert('Dot Bounce Animation', bubbleData.dotAnim.includes('ds-bounce'), `Anim: ${bubbleData.dotAnim}`);
    assert('Dot Animation Duration', bubbleData.dotAnimDuration === '1.1s', `Duration: ${bubbleData.dotAnimDuration}`);
    assert('Staggered Dot Delays', bubbleData.dotDelays[0] === '-0.32s' && bubbleData.dotDelays[1] === '-0.16s' && bubbleData.dotDelays[2] === '0s', `Delays: ${bubbleData.dotDelays.join(', ')}`);

    // 2. Light Mode: Bubble Story
    console.log('\n[2/4] Auditing Bubble Variant (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-04-typing-indicator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-typing-indicator');
    const stageBubbleLight = await pageLight.locator('.ds-story-stage').first();
    await stageBubbleLight.screenshot({ path: `${ARTIFACT_DIR}/typing-indicator-bubble-light.png` });

    // 3. Bare Variant Story
    console.log('\n[3/4] Auditing Bare Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-04-typing-indicator--bare&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-typing-indicator--bare');
    const stageBareDark = await pageDark.locator('.ds-story-stage').first();
    await stageBareDark.screenshot({ path: `${ARTIFACT_DIR}/typing-indicator-bare-dark.png` });

    const bareData = await pageDark.locator('.ds-typing-indicator--bare').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const dots = el.querySelectorAll('.ds-typing-indicator__dot');
      return {
        variant: el.getAttribute('data-variant'),
        slot: el.getAttribute('data-slot'),
        ariaRole: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        gap: s.gap,
        padding: s.padding,
        bg: s.backgroundColor,
        border: s.border,
        dotCount: dots.length,
      };
    });
    results.measurements.bare = bareData;
    assert('Bare Variant Attribute', bareData.variant === 'bare', `data-variant: ${bareData.variant}`);
    assert('Bare Role on Container', bareData.ariaRole === 'status', `role: ${bareData.ariaRole}`);
    assert('Bare Aria Label', bareData.ariaLabel === 'Assistant is typing', `aria-label: "${bareData.ariaLabel}"`);
    assert('Bare Zero Padding', bareData.padding === '0px', `Padding: ${bareData.padding}`);
    assert('Bare Dot Count', bareData.dotCount === 3, `Expected 3 dots, got ${bareData.dotCount}`);

    // Bare light screenshot
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-04-typing-indicator--bare&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-typing-indicator--bare');
    const stageBareLight = await pageLight.locator('.ds-story-stage').first();
    await stageBareLight.screenshot({ path: `${ARTIFACT_DIR}/typing-indicator-bare-light.png` });

    // 4. Reduced Motion Safety
    console.log('\n[4/4] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmAnim = await pageDark.locator('.ds-typing-indicator__dot').first().evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });
    assert('Reduced Motion Disables Dot Animation', rmAnim === 'none', `Animation: ${rmAnim}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/004_typing_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
