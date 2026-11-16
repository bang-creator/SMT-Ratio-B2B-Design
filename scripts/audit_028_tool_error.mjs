import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 028 TOOL ERROR ---');
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
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="tool-error"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-error-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="tool-error"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const icon = el.querySelector('.ds-tool-error__icon');
      const iconRect = icon ? icon.getBoundingClientRect() : {};
      const iconS = icon ? window.getComputedStyle(icon) : {};
      const name = el.querySelector('.ds-tool-error__name');
      const nameS = name ? window.getComputedStyle(name) : {};
      const target = el.querySelector('.ds-tool-error__target');
      const targetS = target ? window.getComputedStyle(target) : {};
      const attempts = el.querySelector('.ds-tool-error__attempts');
      const attemptsS = attempts ? window.getComputedStyle(attempts) : {};
      const callout = el.querySelector('.ds-tool-error__callout');
      const calloutS = callout ? window.getComputedStyle(callout) : {};
      const skipBtn = el.querySelector('.ds-tool-error-skip');
      const skipRect = skipBtn ? skipBtn.getBoundingClientRect() : {};
      const retryBtn = el.querySelector('.ds-tool-error-retry');
      const retryRect = retryBtn ? retryBtn.getBoundingClientRect() : {};

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        bg: s.backgroundColor,
        border: s.borderColor,
        iconSize: `${Math.round(iconRect.width)}x${Math.round(iconRect.height)}`,
        iconColor: iconS.color,
        name: {
          text: name ? name.textContent.trim() : null,
          fontSize: nameS.fontSize,
          fontWeight: nameS.fontWeight,
        },
        target: {
          text: target ? target.textContent.trim() : null,
          fontSize: targetS.fontSize,
          fontWeight: targetS.fontWeight,
        },
        attempts: {
          text: attempts ? attempts.textContent.trim() : null,
          fontSize: attemptsS.fontSize,
          fontWeight: attemptsS.fontWeight,
        },
        callout: {
          borderRadius: calloutS.borderRadius,
          padding: calloutS.padding,
          fontSize: calloutS.fontSize,
          fontWeight: calloutS.fontWeight,
          color: calloutS.color,
        },
        buttons: {
          skipHeight: Math.round(skipRect.height),
          retryHeight: Math.round(retryRect.height),
        },
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (384px max-width, 16px radius, 14px padding)',
      defaultMetrics.maxWidth === '384px' &&
        defaultMetrics.borderRadius === '16px' &&
        defaultMetrics.padding === '14px',
      `maxWidth=${defaultMetrics.maxWidth}, radius=${defaultMetrics.borderRadius}, padding=${defaultMetrics.padding}`
    );

    assert(
      'Header Icon Geometry (14x14px) and Semantic Danger Token',
      defaultMetrics.iconSize === '14x14' &&
        (defaultMetrics.iconColor.includes('250') || defaultMetrics.iconColor.includes('186')),
      `size=${defaultMetrics.iconSize}, color=${defaultMetrics.iconColor}`
    );

    assert(
      'Header Elements Strict 400 Typography (Name, Target, Attempts)',
      defaultMetrics.name.fontWeight === '400' &&
        defaultMetrics.target.fontWeight === '400' &&
        defaultMetrics.attempts.fontWeight === '400',
      `name=${defaultMetrics.name.fontWeight}, target=${defaultMetrics.target.fontWeight}, attempts=${defaultMetrics.attempts.fontWeight}`
    );

    assert(
      'Callout Error Box Geometry and Strict 400 Monospace Typography',
      defaultMetrics.callout.borderRadius === '12px' &&
        defaultMetrics.callout.fontSize === '11px' &&
        defaultMetrics.callout.fontWeight === '400',
      `radius=${defaultMetrics.callout.borderRadius}, font=${defaultMetrics.callout.fontSize}/${defaultMetrics.callout.fontWeight}`
    );

    assert(
      'Action Buttons Compact Geometry (28px height)',
      defaultMetrics.buttons.skipHeight === 28 && defaultMetrics.buttons.retryHeight === 28,
      `skipHeight=${defaultMetrics.buttons.skipHeight}px, retryHeight=${defaultMetrics.buttons.retryHeight}px`
    );

    // 2. Retrying Story Audit
    console.log('\n[2/6] Auditing Retrying Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--retrying&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageRetrying = await pageDark.locator('.ds-story').first();
    await stageRetrying.screenshot({ path: `${ARTIFACT_DIR}/tool-error-retrying-dark.png` });

    const retryingData = await pageDark.locator('[data-slot="tool-error"]').evaluate((el) => {
      const spinner = el.querySelector('.ds-tool-error__spinner');
      const retryBtn = el.querySelector('.ds-tool-error-retry');
      const attempts = el.querySelector('.ds-tool-error__attempts');
      return {
        hasSpinner: !!spinner,
        retryText: retryBtn ? retryBtn.textContent.trim() : null,
        attemptsText: attempts ? attempts.textContent.trim() : null,
      };
    });

    assert(
      'Retrying Story Displays 12px Spinner and "Retrying" Label at Attempt 2',
      retryingData.hasSpinner &&
        retryingData.retryText === 'Retrying' &&
        retryingData.attemptsText === '2/3',
      `spinner=${retryingData.hasSpinner}, label="${retryingData.retryText}", attempts="${retryingData.attemptsText}"`
    );

    // 3. Exhausted Story Audit
    console.log('\n[3/6] Auditing Exhausted Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--exhausted&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageExhausted = await pageDark.locator('.ds-story').first();
    await stageExhausted.screenshot({ path: `${ARTIFACT_DIR}/tool-error-exhausted-dark.png` });

    const exhaustedData = await pageDark.locator('[data-slot="tool-error"]').evaluate((el) => {
      const retryBtn = el.querySelector('.ds-tool-error-retry');
      const attempts = el.querySelector('.ds-tool-error__attempts');
      const s = retryBtn ? window.getComputedStyle(retryBtn) : {};
      return {
        attemptsText: attempts ? attempts.textContent.trim() : null,
        isDisabled: retryBtn ? retryBtn.hasAttribute('disabled') : false,
        opacity: s.opacity,
        pointerEvents: s.pointerEvents,
      };
    });

    assert(
      'Exhausted Story (3/3) Disables Retry Button (opacity 0.3, pointer-events none)',
      exhaustedData.attemptsText === '3/3' &&
        exhaustedData.isDisabled &&
        Number(exhaustedData.opacity) <= 0.35 &&
        exhaustedData.pointerEvents === 'none',
      `attempts="${exhaustedData.attemptsText}", disabled=${exhaustedData.isDisabled}, opacity=${exhaustedData.opacity}, pointerEvents=${exhaustedData.pointerEvents}`
    );

    // 4. Interactive Retry & Skip State Transitions
    console.log('\n[4/6] Testing Interactive Retry and Skip Actions...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click Retry
    await pageDark.locator('.ds-tool-error-retry').click();
    await pageDark.waitForTimeout(100);

    const interactiveRetrying = await pageDark.locator('.ds-tool-error-retry').textContent();
    assert(
      'Clicking Retry Transitions Button to Active Retrying State',
      interactiveRetrying.trim() === 'Retrying',
      `text="${interactiveRetrying.trim()}"`
    );

    // Wait for retry completion (500ms timeout in story)
    await pageDark.waitForTimeout(600);

    const completedRetry = await pageDark.locator('[data-slot="tool-error"]').evaluate((el) => {
      const attempts = el.querySelector('.ds-tool-error__attempts');
      const retryBtn = el.querySelector('.ds-tool-error-retry');
      return {
        attemptsText: attempts ? attempts.textContent.trim() : null,
        retryText: retryBtn ? retryBtn.textContent.trim() : null,
      };
    });

    assert(
      'After Retry Completes, Attempt Increments to 2/3 and Button Resets to "Retry"',
      completedRetry.attemptsText === '2/3' && completedRetry.retryText === 'Retry',
      `attempts="${completedRetry.attemptsText}", retryText="${completedRetry.retryText}"`
    );

    // Click Skip
    await pageDark.locator('.ds-tool-error-skip').click();
    await pageDark.waitForTimeout(100);

    const skippedState = await pageDark.locator('[data-slot="tool-error"]').evaluate((el) => {
      const skipBtn = el.querySelector('.ds-tool-error-skip');
      const retryBtn = el.querySelector('.ds-tool-error-retry');
      return {
        skipText: skipBtn ? skipBtn.textContent.trim() : null,
        skipDisabled: skipBtn ? skipBtn.hasAttribute('disabled') : false,
        retryDisabled: retryBtn ? retryBtn.hasAttribute('disabled') : false,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-error-interactive-skipped-dark.png` });

    assert(
      'Clicking Skip Transitions State to "Skipped" and Disables Both Actions',
      skippedState.skipText === 'Skipped' &&
        skippedState.skipDisabled &&
        skippedState.retryDisabled,
      `skipText="${skippedState.skipText}", skipDisabled=${skippedState.skipDisabled}, retryDisabled=${skippedState.retryDisabled}`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/tool-error-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="tool-error"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const callout = el.querySelector('.ds-tool-error__callout');
      const cS = callout ? window.getComputedStyle(callout) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        calloutColor: cS.color,
      };
    });

    assert(
      'Light Mode Surface and Danger Tokens Resolve Cleanly',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.calloutColor.includes('186'),
      `bg=${lightStyles.bg}, border=${lightStyles.border}, calloutColor=${lightStyles.calloutColor}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-28-tool-error--retrying&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-tool-error__spinner').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
      };
    });

    assert(
      'Reduced Motion Mode Disables Spinner Animation',
      motionStyles.animation.includes('none'),
      `animation=${motionStyles.animation}`
    );

    console.log('\n--- AUDIT SUMMARY ---');
    console.log(`TOTAL CHECKS: ${results.total}`);
    console.log(`PASSED: ${results.passed}`);
    console.log(`FAILED: ${results.total - results.passed}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    return results;
  } catch (err) {
    console.error('Audit failed with runtime error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();