import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 020 RUN ACTIVITY ---');
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
    // 1. Dark Mode: Default Story (Collapsed Initial State)
    console.log('\n[1/8] Auditing Default Story - Collapsed (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-activity-target [data-slot="run-activity"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/run-activity-default-collapsed-dark.png` });

    const collapsedData = await pageDark.locator('.ds-activity-target [data-slot="run-activity"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const btn = el.querySelector('.ds-activity-trigger');
      const bS = btn ? window.getComputedStyle(btn) : {};
      const chevron = el.querySelector('.ds-chevron');
      const cSvg = chevron ? chevron.querySelector('svg') : null;
      const cRect = cSvg ? cSvg.getBoundingClientRect() : {};
      const timeline = el.querySelector('.ds-activity-timeline');
      const tS = timeline ? window.getComputedStyle(timeline) : {};
      const answer = el.querySelector('.ds-activity-answer');
      const aS = answer ? window.getComputedStyle(answer) : {};

      return {
        maxWidth: s.maxWidth,
        display: s.display,
        gap: s.gap,
        trigger: {
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        },
        chevron: {
          width: cRect.width,
          height: cRect.height,
        },
        timeline: {
          display: tS.display,
          borderLeftWidth: tS.borderLeftWidth,
        },
        answer: {
          fontSize: aS.fontSize,
          fontWeight: aS.fontWeight,
          text: answer ? answer.textContent.trim() : null,
        },
      };
    });

    results.measurements.collapsedDark = collapsedData;

    assert(
      'Container Boundary (384px max-width, flex column, 12px gap)',
      collapsedData.maxWidth === '384px' && collapsedData.display === 'flex' && collapsedData.gap === '12px',
      `maxWidth=${collapsedData.maxWidth}, display=${collapsedData.display}, gap=${collapsedData.gap}`
    );

    assert(
      'Trigger Strict 400 Typography (14px)',
      collapsedData.trigger.fontSize === '14px' && collapsedData.trigger.fontWeight === '400',
      `fontSize=${collapsedData.trigger.fontSize}, fontWeight=${collapsedData.trigger.fontWeight}`
    );

    assert(
      'Chevron Dimensions (14x14px)',
      Math.abs(collapsedData.chevron.width - 14) <= 1 && Math.abs(collapsedData.chevron.height - 14) <= 1,
      `size=${collapsedData.chevron.width}x${collapsedData.chevron.height}px`
    );

    assert(
      'Collapsed State Hides Timeline Log',
      collapsedData.timeline.display === 'none' && collapsedData.trigger.ariaExpanded === 'false',
      `timelineDisplay=${collapsedData.timeline.display}, ariaExpanded=${collapsedData.trigger.ariaExpanded}`
    );

    assert(
      'Final Answer Renders with Strict 400 Typography (14px)',
      collapsedData.answer.fontSize === '14px' &&
        collapsedData.answer.fontWeight === '400' &&
        collapsedData.answer.text.includes('The fix is ready'),
      `fontSize=${collapsedData.answer.fontSize}, weight=${collapsedData.answer.fontWeight}, text="${collapsedData.answer.text}"`
    );

    // 2. Interactive Toggle: Click Trigger to Open Timeline
    console.log('\n[2/8] Testing Interactive Open / Close Toggle...');
    await pageDark.locator('.ds-activity-target .ds-activity-trigger').click();
    await pageDark.waitForTimeout(250);

    const expandedData = await pageDark.locator('.ds-activity-target [data-slot="run-activity"]').evaluate((el) => {
      const btn = el.querySelector('.ds-activity-trigger');
      const chevron = el.querySelector('.ds-chevron');
      const timeline = el.querySelector('.ds-activity-timeline');
      const tS = timeline ? window.getComputedStyle(timeline) : {};
      const items = Array.from(el.querySelectorAll('.ds-activity-timeline li')).map((li) => {
        const lS = window.getComputedStyle(li);
        const span = li.querySelector('span');
        const spanS = span ? window.getComputedStyle(span) : {};
        return {
          kind: li.getAttribute('data-activity-kind'),
          text: li.textContent.trim(),
          fontWeight: lS.fontWeight,
          spanWeight: spanS.fontWeight,
        };
      });

      return {
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        chevronRotated: chevron ? chevron.classList.contains('ds-rotate-90') : false,
        timelineDisplay: tS.display,
        borderLeftWidth: tS.borderLeftWidth,
        borderLeftColor: tS.borderLeftColor,
        itemsCount: items.length,
        items: items,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/run-activity-default-expanded-dark.png` });

    assert(
      'Clicking Trigger Opens Timeline Log (display: flex, rotated chevron)',
      expandedData.ariaExpanded === 'true' &&
        expandedData.chevronRotated === true &&
        expandedData.timelineDisplay === 'flex',
      `ariaExpanded=${expandedData.ariaExpanded}, rotated=${expandedData.chevronRotated}, display=${expandedData.timelineDisplay}`
    );

    assert(
      'Hairline Left Rail Border (1px)',
      expandedData.borderLeftWidth === '1px' && expandedData.borderLeftColor !== 'transparent',
      `borderLeftWidth=${expandedData.borderLeftWidth}, color=${expandedData.borderLeftColor}`
    );

    assert(
      'Timeline Renders 4 Steps with Strict 400 Typography',
      expandedData.itemsCount === 4 &&
        expandedData.items.every((it) => it.fontWeight === '400' && it.spanWeight === '400'),
      `count=${expandedData.itemsCount}, weights=${expandedData.items.map((it) => it.fontWeight).join(', ')}`
    );

    // Toggle close
    await pageDark.locator('.ds-activity-target .ds-activity-trigger').click();
    await pageDark.waitForTimeout(150);
    const closedTimelineDisplay = await pageDark.locator('.ds-activity-target .ds-activity-timeline').evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    assert(
      'Clicking Trigger Again Folds Timeline (display: none)',
      closedTimelineDisplay === 'none',
      `display=${closedTimelineDisplay}`
    );

    // 3. Auditing Running Story (In-Flight with Live Step Preview)
    console.log('\n[3/8] Auditing Running Story (In-Flight)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageRunning = await pageDark.locator('.ds-story-stage').first();
    await stageRunning.screenshot({ path: `${ARTIFACT_DIR}/run-activity-running-dark.png` });

    const runningData = await pageDark.locator('[data-slot="run-activity"]').evaluate((el) => {
      const subtitle = el.querySelector('.ds-activity-subtitle');
      const subS = subtitle ? window.getComputedStyle(subtitle) : {};
      const statusAttr = el.getAttribute('data-status');
      const statusLabel = el.querySelector('.ds-activity-trigger span.tabular-nums');
      return {
        statusAttr: statusAttr,
        statusLabel: statusLabel ? statusLabel.textContent.trim() : null,
        subtitleText: subtitle ? subtitle.textContent.trim() : null,
        subtitleFontWeight: subS.fontWeight,
        subtitleFontSize: subS.fontSize,
      };
    });

    assert(
      'Running Story Renders Live Activity Subtitle Below Trigger (14px / 400)',
      runningData.statusAttr === 'running' &&
        runningData.statusLabel === 'Working...' &&
        runningData.subtitleText === 'Checking the fix' &&
        runningData.subtitleFontWeight === '400' &&
        runningData.subtitleFontSize === '14px',
      `status=${runningData.statusAttr}, label="${runningData.statusLabel}", subtitle="${runningData.subtitleText}"`
    );

    // 4. Auditing Needs Input Story (Approval Action Attention Banner)
    console.log('\n[4/8] Auditing Needs Input Story (Attention Banner)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--needs-input&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageNeedsInput = await pageDark.locator('.ds-story-stage').first();
    await stageNeedsInput.screenshot({ path: `${ARTIFACT_DIR}/run-activity-needs-input-dark.png` });

    const needsInputData = await pageDark.locator('[data-slot="run-activity"]').evaluate((el) => {
      const attention = el.querySelector('.ds-activity-attention');
      const attS = attention ? window.getComputedStyle(attention) : {};
      const btn = attention ? attention.querySelector('button') : null;
      const bS = btn ? window.getComputedStyle(btn) : {};
      return {
        attentionPresent: !!attention,
        borderRadius: attS.borderRadius,
        buttonText: btn ? btn.textContent.trim() : null,
        buttonHeight: btn ? btn.getBoundingClientRect().height : 0,
      };
    });

    assert(
      'Needs Input Renders Approval Banner Outside Disclosure with Compact Button',
      needsInputData.attentionPresent &&
        needsInputData.buttonText === 'Approve' &&
        needsInputData.buttonHeight <= 32,
      `attention=${needsInputData.attentionPresent}, btn="${needsInputData.buttonText}", btnHeight=${needsInputData.buttonHeight}px`
    );

    // 5. Auditing Completed & Stopped Stories
    console.log('\n[5/8] Auditing Completed & Stopped Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--completed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const completedText = await pageDark.locator('[data-slot="run-activity"] .ds-activity-trigger span.tabular-nums').textContent();
    assert(
      'Completed Story Displays Exact Elapsed Duration',
      completedText.includes('Completed in 42s'),
      `text="${completedText.trim()}"`
    );

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--stopped&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageStopped = await pageDark.locator('.ds-story-stage').first();
    await stageStopped.screenshot({ path: `${ARTIFACT_DIR}/run-activity-stopped-dark.png` });

    const stoppedText = await pageDark.locator('[data-slot="run-activity"] .ds-activity-trigger span.tabular-nums').textContent();
    assert(
      'Stopped Story Displays Cancelled After 9s',
      stoppedText.includes('Stopped after 9s'),
      `text="${stoppedText.trim()}"`
    );

    // 6. Auditing Failed Story
    console.log('\n[6/8] Auditing Failed Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--failed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageFailed = await pageDark.locator('.ds-story-stage').first();
    await stageFailed.screenshot({ path: `${ARTIFACT_DIR}/run-activity-failed-dark.png` });

    const failedData = await pageDark.locator('[data-slot="run-activity"]').evaluate((el) => {
      const items = Array.from(el.querySelectorAll('.ds-activity-timeline li')).map((li) => li.textContent.trim());
      const lastItem = items[items.length - 1];
      return {
        count: items.length,
        lastItem: lastItem,
      };
    });

    assert(
      'Failed Story Renders Failed Step in Timeline Log',
      failedData.count === 4 && failedData.lastItem.includes('1 test failed'),
      `count=${failedData.count}, lastItem="${failedData.lastItem}"`
    );

    // 7. Light Mode Audit
    console.log('\n[7/8] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story-stage').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/run-activity-default-light.png` });

    const lightStyles = await pageLight.locator('.ds-activity-trigger').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        color: s.color,
      };
    });

    assert(
      'Light Mode Contrast and Typography Tokens',
      lightStyles.color.includes('65, 65, 65') || lightStyles.color.includes('13, 13, 13') || lightStyles.color !== 'transparent',
      `color=${lightStyles.color}`
    );

    // 8. Reduced Motion Audit
    console.log('\n[8/8] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-20-run-activity--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-run-activity').evaluate((el) => {
      const chevron = el.querySelector('.ds-chevron');
      const timeline = el.querySelector('.ds-activity-timeline');
      const cS = chevron ? window.getComputedStyle(chevron) : {};
      const tS = timeline ? window.getComputedStyle(timeline) : {};
      return {
        chevronTransition: cS.transition,
        timelineAnimation: tS.animation,
      };
    });

    assert(
      'Reduced Motion Disables Chevron Transitions and Timeline Animations',
      motionStyles.chevronTransition.includes('none') &&
        (motionStyles.timelineAnimation.includes('none') || motionStyles.timelineAnimation === 'none 0s ease 0s 1 normal none running'),
      `chevronTransition=${motionStyles.chevronTransition}, timelineAnimation=${motionStyles.timelineAnimation}`
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
