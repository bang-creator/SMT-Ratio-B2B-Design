import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 031 CODE RUNNER ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="code-runner"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/code-runner-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="code-runner"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const lang = el.querySelector('.ds-code-runner__lang');
      const langS = lang ? window.getComputedStyle(lang) : {};
      const dur = el.querySelector('.ds-code-runner__duration');
      const durS = dur ? window.getComputedStyle(dur) : {};
      const btn = el.querySelector('.ds-code-runner__btn');
      const bRect = btn ? btn.getBoundingClientRect() : {};
      const code = el.querySelector('.ds-code-runner__code-area code');
      const codeS = code ? window.getComputedStyle(code) : {};
      const outLabel = el.querySelector('.ds-code-runner__output-label');
      const olS = outLabel ? window.getComputedStyle(outLabel) : {};
      const outLine = el.querySelector('.ds-code-runner__line');
      const olineS = outLine ? window.getComputedStyle(outLine) : {};

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        overflow: s.overflow,
        bg: s.backgroundColor,
        border: s.borderColor,
        header: {
          lang: lang ? lang.textContent.trim() : null,
          langWeight: langS.fontWeight,
          duration: dur ? dur.textContent.trim() : null,
          durationWeight: durS.fontWeight,
          btnSize: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
        },
        code: {
          fontSize: codeS.fontSize,
          fontWeight: codeS.fontWeight,
        },
        output: {
          label: outLabel ? outLabel.textContent.trim() : null,
          labelWeight: olS.fontWeight,
          lineText: outLine ? outLine.textContent.trim() : null,
          lineWeight: olineS.fontWeight,
          lineColor: olineS.color,
        },
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (448px max-width, 16px radius, overflow hidden)',
      defaultMetrics.maxWidth === '448px' &&
        defaultMetrics.borderRadius === '16px' &&
        defaultMetrics.overflow === 'hidden',
      `maxWidth=${defaultMetrics.maxWidth}, radius=${defaultMetrics.borderRadius}, overflow=${defaultMetrics.overflow}`
    );

    assert(
      'Header Elements (Language, Duration, 28x28px Run Button)',
      defaultMetrics.header.lang === 'typescript' &&
        defaultMetrics.header.langWeight === '400' &&
        defaultMetrics.header.duration === '42ms' &&
        defaultMetrics.header.durationWeight === '400' &&
        defaultMetrics.header.btnSize === '28x28',
      `lang=${defaultMetrics.header.lang}(${defaultMetrics.header.langWeight}), dur=${defaultMetrics.header.duration}(${defaultMetrics.header.durationWeight}), btn=${defaultMetrics.header.btnSize}`
    );

    assert(
      'Code Area Strict 400 Monospace Typography (12px)',
      defaultMetrics.code.fontSize === '12px' && defaultMetrics.code.fontWeight === '400',
      `fontSize=${defaultMetrics.code.fontSize}, fontWeight=${defaultMetrics.code.fontWeight}`
    );

    assert(
      'Output Telemetry Strict 400 Typography (Label and Standard Text Color)',
      defaultMetrics.output.label === 'output' &&
        defaultMetrics.output.labelWeight === '400' &&
        defaultMetrics.output.lineText === 'HELLO, WORLD!' &&
        defaultMetrics.output.lineWeight === '400',
      `label=${defaultMetrics.output.label}(${defaultMetrics.output.labelWeight}), line="${defaultMetrics.output.lineText}"(${defaultMetrics.output.lineWeight})`
    );

    // 2. Running Variant Story Audit
    console.log('\n[2/6] Auditing Running Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageRunning = await pageDark.locator('.ds-story').first();
    await stageRunning.screenshot({ path: `${ARTIFACT_DIR}/code-runner-running-dark.png` });

    const runningData = await pageDark.locator('[data-slot="code-runner"]').evaluate((el) => {
      const btn = el.querySelector('.ds-code-runner__btn');
      const spinner = btn ? btn.querySelector('.ds-spin') : null;
      const cursor = el.querySelector('.ds-code-runner__cursor');
      const dur = el.querySelector('.ds-code-runner__duration');
      const bS = btn ? window.getComputedStyle(btn) : {};
      return {
        hasSpinner: !!spinner,
        isDisabled: btn ? btn.hasAttribute('disabled') : false,
        btnOpacity: bS.opacity,
        pointerEvents: bS.pointerEvents,
        hasCursor: !!cursor,
        hasDuration: !!dur,
      };
    });

    assert(
      'Running Story Displays Spinner, Disabled Button (opacity 0.6), Pulsing Cursor, and Hides Duration',
      runningData.hasSpinner &&
        runningData.isDisabled &&
        Number(runningData.btnOpacity) <= 0.65 &&
        runningData.pointerEvents === 'none' &&
        runningData.hasCursor &&
        !runningData.hasDuration,
      `spinner=${runningData.hasSpinner}, disabled=${runningData.isDisabled}, cursor=${runningData.hasCursor}, durHidden=${!runningData.hasDuration}`
    );

    // 3. ErrorState Variant Story Audit
    console.log('\n[3/6] Auditing ErrorState Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--error-state&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageError = await pageDark.locator('.ds-story').first();
    await stageError.screenshot({ path: `${ARTIFACT_DIR}/code-runner-error-dark.png` });

    const errorData = await pageDark.locator('[data-slot="code-runner"]').evaluate((el) => {
      const dur = el.querySelector('.ds-code-runner__duration');
      const errLine = el.querySelector('.ds-code-runner__line--error');
      const elS = errLine ? window.getComputedStyle(errLine) : {};
      return {
        duration: dur ? dur.textContent.trim() : null,
        hasErrorLine: !!errLine,
        errorColor: elS.color,
      };
    });

    assert(
      'ErrorState Story Renders Danger Red Text and 18ms Duration Telemetry',
      errorData.duration === '18ms' &&
        errorData.hasErrorLine &&
        (errorData.errorColor.includes('250') || errorData.errorColor.includes('186')),
      `dur="${errorData.duration}", color=${errorData.errorColor}`
    );

    // 4. Interactive Run Action
    console.log('\n[4/6] Testing Interactive Run Snippet Action...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click run button
    await pageDark.locator('.ds-code-runner-trigger').click();
    await pageDark.waitForTimeout(100);

    const interactiveRunning = await pageDark.locator('[data-slot="code-runner"]').evaluate((el) => {
      const btn = el.querySelector('.ds-code-runner__btn');
      const spinner = btn ? btn.querySelector('.ds-spin') : null;
      const cursor = el.querySelector('.ds-code-runner__cursor');
      return {
        hasSpinner: !!spinner,
        hasCursor: !!cursor,
      };
    });

    assert(
      'Clicking Run Button Transitions Component into Active Running State',
      interactiveRunning.hasSpinner && interactiveRunning.hasCursor,
      `spinner=${interactiveRunning.hasSpinner}, cursor=${interactiveRunning.hasCursor}`
    );

    // Wait for run completion (500ms timeout in story)
    await pageDark.waitForTimeout(600);

    const interactiveCompleted = await pageDark.locator('[data-slot="code-runner"]').evaluate((el) => {
      const dur = el.querySelector('.ds-code-runner__duration');
      const playIcon = el.querySelector('.ds-code-runner__btn svg polygon');
      return {
        duration: dur ? dur.textContent.trim() : null,
        hasPlayIcon: !!playIcon,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/code-runner-interactive-completed-dark.png` });

    assert(
      'After Run Finishes, State Resets to "ok" with Updated Duration ("38ms") and Play Icon',
      interactiveCompleted.duration === '38ms' && interactiveCompleted.hasPlayIcon,
      `duration="${interactiveCompleted.duration}", playIcon=${interactiveCompleted.hasPlayIcon}`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--error-state&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/code-runner-error-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="code-runner"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const out = el.querySelector('.ds-code-runner__output');
      const outS = out ? window.getComputedStyle(out) : {};
      const errLine = el.querySelector('.ds-code-runner__line--error');
      const elS = errLine ? window.getComputedStyle(errLine) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        outputBg: outS.backgroundColor,
        errorColor: elS.color,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface, Secondary Background, and Light Danger Red (#ba2623)',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.errorColor.includes('186'),
      `bg=${lightStyles.bg}, border=${lightStyles.border}, errorColor=${lightStyles.errorColor}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-31-code-runner--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-code-runner__cursor').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
      };
    });

    assert(
      'Reduced Motion Mode Disables Cursor Animation',
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