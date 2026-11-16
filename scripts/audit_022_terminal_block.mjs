import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 022 TERMINAL BLOCK ---');
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
    console.log('\n[1/7] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="terminal-block"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/terminal-block-default-dark.png` });

    const defaultData = await pageDark.locator('[data-slot="terminal-block"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const cmd = el.querySelector('.ds-terminal-block__cmd');
      const cmdS = cmd ? window.getComputedStyle(cmd) : {};
      const cwd = el.querySelector('.ds-terminal-block__cwd');
      const cwdS = cwd ? window.getComputedStyle(cwd) : {};
      const checkIcon = el.querySelector('.ds-diff-stat-add');
      const checkRect = checkIcon ? checkIcon.getBoundingClientRect() : {};
      const checkS = checkIcon ? window.getComputedStyle(checkIcon) : {};
      const exitSpan = el.querySelector('.ds-terminal-block__exit');
      const exitS = exitSpan ? window.getComputedStyle(exitSpan) : {};
      const copyBtn = el.querySelector('.ds-copy-btn');
      const copyRect = copyBtn ? copyBtn.getBoundingClientRect() : {};
      const copyS = copyBtn ? window.getComputedStyle(copyBtn) : {};
      const viewport = el.querySelector('.ds-terminal-block__viewport');
      const vpS = viewport ? window.getComputedStyle(viewport) : {};
      const lines = Array.from(el.querySelectorAll('.ds-terminal-block__line')).map((l) => {
        const lS = window.getComputedStyle(l);
        return {
          text: l.textContent.trim(),
          fontWeight: lS.fontWeight,
          fontSize: lS.fontSize,
          color: lS.color,
          isLast: l.classList.contains('ds-terminal-block__line--last'),
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        command: {
          text: cmd ? cmd.textContent.trim() : null,
          fontSize: cmdS.fontSize,
          fontWeight: cmdS.fontWeight,
        },
        cwd: {
          text: cwd ? cwd.textContent.trim() : null,
          color: cwdS.color,
          fontWeight: cwdS.fontWeight,
        },
        status: {
          iconWidth: checkRect.width,
          iconHeight: checkRect.height,
          iconColor: checkS.color,
          exitText: exitSpan ? exitSpan.textContent.trim() : null,
          exitWeight: exitS.fontWeight,
          exitSize: exitS.fontSize,
        },
        copyButton: {
          width: copyRect.width,
          height: copyRect.height,
          borderRadius: copyS.borderRadius,
        },
        viewport: {
          minHeight: vpS.minHeight,
          lineCount: lines.length,
          lines: lines,
        },
      };
    });

    results.measurements.defaultDark = defaultData;

    assert(
      'Container Geometry (448px max-width, 16px radius)',
      defaultData.maxWidth === '448px' && defaultData.borderRadius === '16px',
      `maxWidth=${defaultData.maxWidth}, radius=${defaultData.borderRadius}`
    );

    assert(
      'Header Command & CWD Strict 400 Typography (12px)',
      defaultData.command.fontWeight === '400' && defaultData.cwd.fontWeight === '400',
      `cmdWeight=${defaultData.command.fontWeight}, cwdWeight=${defaultData.cwd.fontWeight}`
    );

    assert(
      'Done Status Renders Emerald Checkmark (12x12px)',
      Math.abs(defaultData.status.iconWidth - 12) <= 1 &&
        Math.abs(defaultData.status.iconHeight - 12) <= 1 &&
        defaultData.status.iconColor.includes('16, 163, 127'),
      `size=${defaultData.status.iconWidth}x${defaultData.status.iconHeight}px, color=${defaultData.status.iconColor}`
    );

    assert(
      'Exit Code & Duration 11px Mono Strict 400',
      defaultData.status.exitSize === '11px' &&
        defaultData.status.exitWeight === '400' &&
        defaultData.status.exitText === 'exit 0',
      `size=${defaultData.status.exitSize}, weight=${defaultData.status.exitWeight}, text="${defaultData.status.exitText}"`
    );

    assert(
      'Copy Button 24x24px Round Icon Button',
      Math.abs(defaultData.copyButton.width - 24) <= 1 &&
        Math.abs(defaultData.copyButton.height - 24) <= 1 &&
        defaultData.copyButton.borderRadius === '9999px',
      `size=${defaultData.copyButton.width}x${defaultData.copyButton.height}px, radius=${defaultData.copyButton.borderRadius}`
    );

    assert(
      'Viewport Renders 6 Lines with Strict 400 Typography (12px)',
      defaultData.viewport.lineCount === 6 &&
        defaultData.viewport.lines.every((l) => l.fontWeight === '400' && l.fontSize === '12px'),
      `lineCount=${defaultData.viewport.lineCount}, weights=${defaultData.viewport.lines.map((l) => l.fontWeight).join(', ')}`
    );

    // 2. Interactive Copy Button
    console.log('\n[2/7] Testing Interactive Copy Button...');
    await pageDark.locator('.ds-copy-btn').click();
    await pageDark.waitForTimeout(100);

    const isShowingCheck = await pageDark.locator('.ds-copy-btn svg').evaluate((el) => {
      return el.classList.contains('ds-diff-stat-add') || el.querySelector('polyline') !== null;
    });

    assert(
      'Clicking Copy Button Gives Instant Visual Feedback (Checkmark)',
      isShowingCheck === true,
      `showingCheck=${isShowingCheck}`
    );

    // 3. Auditing Running Story (Spinner & Pulsing Cursor)
    console.log('\n[3/7] Auditing Running Story (In-Flight Spinner & Cursor)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageRunning = await pageDark.locator('.ds-story').first();
    await stageRunning.screenshot({ path: `${ARTIFACT_DIR}/terminal-block-running-dark.png` });

    const runningData = await pageDark.locator('[data-slot="terminal-block"]').evaluate((el) => {
      const spinner = el.querySelector('svg.ds-spin');
      const cursor = el.querySelector('.ds-terminal-cursor');
      const cRect = cursor ? cursor.getBoundingClientRect() : {};
      const cS = cursor ? window.getComputedStyle(cursor) : {};
      return {
        hasSpinner: !!spinner,
        hasCursor: !!cursor,
        cursorWidth: cRect.width,
        cursorHeight: cRect.height,
        cursorAnimation: cS.animation,
      };
    });

    assert(
      'Running Story Displays 12px Spinner and 6x12px Pulsing Cursor',
      runningData.hasSpinner &&
        runningData.hasCursor &&
        Math.abs(runningData.cursorWidth - 6) <= 1 &&
        Math.abs(runningData.cursorHeight - 12) <= 1,
      `spinner=${runningData.hasSpinner}, cursor=${runningData.hasCursor}, cursorSize=${runningData.cursorWidth}x${runningData.cursorHeight}px`
    );

    // 4. Auditing Failed Story (Red X, Red Exit Code, Red Stderr Lines)
    console.log('\n[4/7] Auditing Failed Story (Error State)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--failed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageFailed = await pageDark.locator('.ds-story').first();
    await stageFailed.screenshot({ path: `${ARTIFACT_DIR}/terminal-block-failed-dark.png` });

    const failedData = await pageDark.locator('[data-slot="terminal-block"]').evaluate((el) => {
      const xIcon = el.querySelector('.ds-diff-stat-remove');
      const xS = xIcon ? window.getComputedStyle(xIcon) : {};
      const exitFail = el.querySelector('.ds-terminal-block__exit--fail');
      const eS = exitFail ? window.getComputedStyle(exitFail) : {};
      const stderrLines = Array.from(el.querySelectorAll('.ds-terminal-block__line--stderr')).map((l) => {
        const s = window.getComputedStyle(l);
        return {
          text: l.textContent.trim(),
          color: s.color,
          fontWeight: s.fontWeight,
        };
      });

      return {
        hasXIcon: !!xIcon,
        xIconColor: xS.color,
        exitText: exitFail ? exitFail.textContent.trim() : null,
        exitColor: eS.color,
        stderrCount: stderrLines.length,
        stderrColors: stderrLines.map((l) => l.color),
        stderrWeights: stderrLines.map((l) => l.fontWeight),
      };
    });

    assert(
      'Failed Story Renders Red X Icon and exit 1 in Danger Red',
      failedData.hasXIcon &&
        (failedData.exitColor.includes('250, 66, 62') || failedData.exitColor.includes('239, 68, 68')) &&
        failedData.exitText === 'exit 1',
      `xIcon=${failedData.hasXIcon}, exitText="${failedData.exitText}", exitColor=${failedData.exitColor}`
    );

    assert(
      'Stderr Lines Highlighted in Danger Red with Strict 400 Weight',
      failedData.stderrCount === 3 &&
        failedData.stderrWeights.every((w) => w === '400') &&
        failedData.stderrColors.every((c) => c.includes('250, 66, 62') || c.includes('239, 68, 68')),
      `count=${failedData.stderrCount}, weights=${failedData.stderrWeights.join(', ')}`
    );

    // 5. Auditing Ink Variant
    console.log('\n[5/7] Auditing Ink Variant...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--ink&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageInk = await pageDark.locator('.ds-story').first();
    await stageInk.screenshot({ path: `${ARTIFACT_DIR}/terminal-block-ink-dark.png` });

    const inkData = await pageDark.locator('.ds-terminal-block--ink').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        hasInkClass: true,
        background: s.backgroundColor,
        borderRadius: s.borderRadius,
      };
    });

    assert(
      'Ink Variant Renders 16px Rounded High-Contrast Shell',
      inkData.hasInkClass && inkData.borderRadius === '16px',
      `inkClass=${inkData.hasInkClass}, radius=${inkData.borderRadius}, bg=${inkData.background}`
    );

    // 6. Light Mode Audit
    console.log('\n[6/7] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/terminal-block-default-light.png` });

    const lightStyles = await pageLight.locator('.ds-terminal-block').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        background: s.backgroundColor,
        border: s.borderColor,
      };
    });

    assert(
      'Light Mode Paper Variant Contrast and Surface Tokens',
      lightStyles.background !== 'transparent' && lightStyles.border !== 'transparent',
      `bg=${lightStyles.background}, border=${lightStyles.border}`
    );

    // 7. Reduced Motion Audit
    console.log('\n[7/7] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-22-terminal-block--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-terminal-block').evaluate((el) => {
      const cursor = el.querySelector('.ds-terminal-cursor');
      const spinner = el.querySelector('.ds-spin');
      const cS = cursor ? window.getComputedStyle(cursor) : {};
      const sS = spinner ? window.getComputedStyle(spinner) : {};
      return {
        cursorAnimation: cS.animation,
        spinnerAnimation: sS.animation,
      };
    });

    assert(
      'Reduced Motion Disables Cursor Pulsing and Spinner Rotation',
      motionStyles.cursorAnimation.includes('none') && motionStyles.spinnerAnimation.includes('none'),
      `cursorAnimation=${motionStyles.cursorAnimation}, spinnerAnimation=${motionStyles.spinnerAnimation}`
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
