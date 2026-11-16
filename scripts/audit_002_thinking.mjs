import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 002 THINKING INDICATOR ---');
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
    // 1. Dark Mode Default Story
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-02-thinking-indicator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-thinking-indicator');

    // Screenshot default dark
    const stageElDark = await pageDark.locator('.ds-story-stage').first();
    await stageElDark.screenshot({ path: `${ARTIFACT_DIR}/thinking-indicator-default-dark.png` });

    // Inspect first indicator in Default story
    const indDark = await pageDark.locator('.ds-thinking-indicator').first();
    const indStyles = await indDark.evaluate((el) => {
      const s = window.getComputedStyle(el);
      const dot = el.querySelector('.ds-thinking-indicator__dot');
      const dotS = dot ? window.getComputedStyle(dot) : {};
      const label = el.querySelector('.ds-thinking-indicator__label');
      const labelS = label ? window.getComputedStyle(label) : {};
      const dotRect = dot ? dot.getBoundingClientRect() : {};
      return {
        display: s.display,
        gap: s.gap,
        color: s.color,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        dotWidth: dotRect.width,
        dotHeight: dotRect.height,
        dotBorderRadius: dotS.borderRadius,
        dotBg: dotS.backgroundColor,
        dotAnim: dotS.animationName,
        labelFontWeight: labelS.fontWeight,
        labelFontSize: labelS.fontSize,
        labelOverflow: labelS.overflow,
        labelEllipsis: labelS.textOverflow,
        labelWhiteSpace: labelS.whiteSpace,
      };
    });

    results.measurements.defaultDark = indStyles;
    assert('Container Gap', indStyles.gap === '10px', `Expected 10px, got ${indStyles.gap}`);
    assert('Dot Dimensions', Math.round(indStyles.dotWidth) === 6 && Math.round(indStyles.dotHeight) === 6, `Expected 6x6px, got ${indStyles.dotWidth}x${indStyles.dotHeight}px`);
    assert('Dot Border Radius', indStyles.dotBorderRadius === '9999px' || indStyles.dotBorderRadius === '50%', `Got ${indStyles.dotBorderRadius}`);
    assert('Dot Animation', indStyles.dotAnim.includes('ds-pulse-dot'), `Got ${indStyles.dotAnim}`);
    assert('Label Font Size', indStyles.labelFontSize === '14px', `Expected 14px, got ${indStyles.labelFontSize}`);
    assert('Label Font Weight (400 Rule)', indStyles.labelFontWeight === '400', `Expected 400, got ${indStyles.labelFontWeight}`);

    // 2. Light Mode Default Story
    console.log('\n[2/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-02-thinking-indicator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-thinking-indicator');
    const stageElLight = await pageLight.locator('.ds-story-stage').first();
    await stageElLight.screenshot({ path: `${ARTIFACT_DIR}/thinking-indicator-default-light.png` });

    // 3. With Timer Story
    console.log('\n[3/5] Auditing With Timer Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-02-thinking-indicator--with-timer&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-thinking-indicator__elapsed');
    const stageTimer = await pageDark.locator('.ds-story-stage').first();
    await stageTimer.screenshot({ path: `${ARTIFACT_DIR}/thinking-indicator-with-timer-dark.png` });

    const elapsedStyles = await pageDark.locator('.ds-thinking-indicator__elapsed').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        fontVariantNumeric: s.fontVariantNumeric,
        letterSpacing: s.letterSpacing,
        color: s.color,
        text: el.textContent,
      };
    });
    results.measurements.elapsed = elapsedStyles;
    assert('Elapsed Timer Font Size', elapsedStyles.fontSize === '11px', `Expected 11px, got ${elapsedStyles.fontSize}`);
    assert('Elapsed Timer Font Weight', elapsedStyles.fontWeight === '400', `Expected 400, got ${elapsedStyles.fontWeight}`);
    assert('Elapsed Timer Tabular Nums', elapsedStyles.fontVariantNumeric.includes('tabular-nums'), `Got ${elapsedStyles.fontVariantNumeric}`);
    assert('Elapsed Timer Value', elapsedStyles.text === '0:14', `Expected 0:14, got ${elapsedStyles.text}`);

    // 4. Long Label & Truncation Story
    console.log('\n[4/5] Auditing Long Label Narrow Container Truncation...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-02-thinking-indicator--long-label&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-thinking-indicator');
    const stageLong = await pageDark.locator('.ds-story-stage').first();
    await stageLong.screenshot({ path: `${ARTIFACT_DIR}/thinking-indicator-long-label-dark.png` });

    const longMetrics = await pageDark.locator('.ds-thinking-indicator-container--narrow').evaluate((container) => {
      const ind = container.querySelector('.ds-thinking-indicator');
      const label = container.querySelector('.ds-thinking-indicator__label');
      const elapsed = container.querySelector('.ds-thinking-indicator__elapsed');
      const cRect = container.getBoundingClientRect();
      const iRect = ind.getBoundingClientRect();
      const lRect = label.getBoundingClientRect();
      const eRect = elapsed.getBoundingClientRect();
      return {
        containerWidth: cRect.width,
        indicatorWidth: iRect.width,
        labelWidth: lRect.width,
        elapsedWidth: eRect.width,
        isTruncated: label.scrollWidth > label.clientWidth,
        fitsInContainer: iRect.width <= cRect.width + 1,
      };
    });
    results.measurements.longMetrics = longMetrics;
    assert('Narrow Container Max Width', Math.round(longMetrics.containerWidth) === 256, `Expected 256px, got ${longMetrics.containerWidth}px`);
    assert('Long Label Fits Container', longMetrics.fitsInContainer, `Indicator (${longMetrics.indicatorWidth}px) exceeds container (${longMetrics.containerWidth}px)`);
    assert('Long Label Truncates with Ellipsis', longMetrics.isTruncated, `Expected scrollWidth > clientWidth for ellipsis truncation`);

    // 5. Live Interactive State
    console.log('\n[5/5] Auditing Live Interactive State (Start, Tick, Next, Pause, Reset)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-02-thinking-indicator--live&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-thinking-btn-toggle');

    // Click Start
    await pageDark.click('.ds-thinking-btn-toggle');
    await pageDark.waitForTimeout(2100); // let it tick 2 seconds
    const elapsedAfterTick = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__elapsed').textContent();
    assert('Live Timer Running', elapsedAfterTick === '0:02' || elapsedAfterTick === '0:03', `Expected 0:02/0:03, got ${elapsedAfterTick}`);

    // Click Next Task
    const initialLabel = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__label').textContent();
    await pageDark.click('.ds-thinking-btn-next');
    const nextLabel = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__label').textContent();
    assert('Next Task Switches Label', initialLabel !== nextLabel, `Label changed from "${initialLabel}" to "${nextLabel}"`);

    // Screenshot live running
    const stageLive = await pageDark.locator('.ds-story-stage').first();
    await stageLive.screenshot({ path: `${ARTIFACT_DIR}/thinking-indicator-live-running-dark.png` });

    // Click Pause
    await pageDark.click('.ds-thinking-btn-toggle');
    const pausedTime = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__elapsed').textContent();
    await pageDark.waitForTimeout(1200);
    const pausedTimeAfterWait = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__elapsed').textContent();
    assert('Live Timer Paused', pausedTime === pausedTimeAfterWait, `Paused time (${pausedTime}) did not change`);

    // Click Reset
    await pageDark.click('.ds-thinking-btn-reset');
    const resetTime = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__elapsed').textContent();
    const resetLabel = await pageDark.locator('.ds-thinking-target .ds-thinking-indicator__label').textContent();
    assert('Live Timer Reset to 0:00', resetTime === '0:00', `Expected 0:00, got ${resetTime}`);
    assert('Live Label Reset to Thinking', resetLabel === 'Thinking', `Expected Thinking, got ${resetLabel}`);

    // 6. Reduced Motion Check
    console.log('\n[6/6] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const reducedMotionData = await pageDark.locator('.ds-thinking-indicator__dot').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animationDuration: s.animationDuration,
        animationName: s.animationName,
      };
    });
    assert('Reduced Motion Disables Animation', reducedMotionData.animationDuration === '0.00001s' || reducedMotionData.animationDuration === '0.01ms' || reducedMotionData.animationName === 'none', `Reduced motion animationDuration: ${reducedMotionData.animationDuration}, animationName: ${reducedMotionData.animationName}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/002_thinking_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
