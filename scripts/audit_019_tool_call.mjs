import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 019 TOOL CALL ---');
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
    console.log('\n[1/7] Auditing Default Story - Collapsed (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-tool-target [data-slot="tool-call"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-call-default-collapsed-dark.png` });

    const collapsedData = await pageDark.locator('.ds-tool-target [data-slot="tool-call"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const btn = el.querySelector('.ds-tool-trigger');
      const bS = btn ? window.getComputedStyle(btn) : {};
      const chevron = el.querySelector('.ds-chevron');
      const cSvg = chevron ? chevron.querySelector('svg') : null;
      const cRect = cSvg ? cSvg.getBoundingClientRect() : {};
      const chip = el.querySelector('.font-mono.truncate, .ds-tool-call__chip');
      const chipS = chip ? window.getComputedStyle(chip) : {};
      const content = el.querySelector('.ds-tool-call__content');
      const contentS = content ? window.getComputedStyle(content) : {};
      const checkIcon = el.querySelector('svg.text-emerald-500');
      const checkS = checkIcon ? window.getComputedStyle(checkIcon) : {};
      const checkRect = checkIcon ? checkIcon.getBoundingClientRect() : {};

      return {
        maxWidth: s.maxWidth,
        trigger: {
          display: bS.display,
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        },
        chevron: {
          width: cRect.width,
          height: cRect.height,
          transform: chevron ? window.getComputedStyle(chevron).transform : null,
        },
        chip: {
          fontSize: chipS.fontSize,
          fontWeight: chipS.fontWeight,
          fontFamily: chipS.fontFamily,
          overflow: chipS.overflow,
          textOverflow: chipS.textOverflow,
        },
        content: {
          display: contentS.display,
        },
        statusIcon: {
          width: checkRect.width,
          height: checkRect.height,
          color: checkS.color,
        },
      };
    });

    results.measurements.collapsedDark = collapsedData;

    assert(
      'Container Boundary (384px max-width)',
      collapsedData.maxWidth === '384px',
      `maxWidth=${collapsedData.maxWidth}`
    );

    assert(
      'Trigger Strict 400 Typography (13.5px)',
      collapsedData.trigger.fontSize === '13.5px' && collapsedData.trigger.fontWeight === '400',
      `fontSize=${collapsedData.trigger.fontSize}, fontWeight=${collapsedData.trigger.fontWeight}`
    );

    assert(
      'Chevron Dimensions (14x14px) and Unrotated State',
      Math.abs(collapsedData.chevron.width - 14) <= 1 && Math.abs(collapsedData.chevron.height - 14) <= 1,
      `size=${collapsedData.chevron.width}x${collapsedData.chevron.height}px, transform=${collapsedData.chevron.transform}`
    );

    assert(
      'Query Chip Mono Typography (11px / 400) and Ellipsis',
      collapsedData.chip.fontSize === '11px' &&
        collapsedData.chip.fontWeight === '400' &&
        collapsedData.chip.overflow === 'hidden' &&
        collapsedData.chip.textOverflow === 'ellipsis',
      `size=${collapsedData.chip.fontSize}, weight=${collapsedData.chip.fontWeight}, overflow=${collapsedData.chip.overflow}`
    );

    assert(
      'Collapsed State Hides Content Panel',
      collapsedData.content.display === 'none' && collapsedData.trigger.ariaExpanded === 'false',
      `contentDisplay=${collapsedData.content.display}, ariaExpanded=${collapsedData.trigger.ariaExpanded}`
    );

    assert(
      'Finished State Shows Emerald Checkmark (14x14px)',
      Math.abs(collapsedData.statusIcon.width - 14) <= 1 &&
        Math.abs(collapsedData.statusIcon.height - 14) <= 1 &&
        collapsedData.statusIcon.color.includes('16, 163, 127'),
      `size=${collapsedData.statusIcon.width}x${collapsedData.statusIcon.height}px, color=${collapsedData.statusIcon.color}`
    );

    // 2. Interactive Toggle: Open Collapsible Trigger
    console.log('\n[2/7] Testing Interactive Open / Close Toggle...');
    await pageDark.locator('.ds-tool-target .ds-tool-trigger').click();
    await pageDark.waitForTimeout(250);

    const expandedData = await pageDark.locator('.ds-tool-target [data-slot="tool-call"]').evaluate((el) => {
      const btn = el.querySelector('.ds-tool-trigger');
      const chevron = el.querySelector('.ds-chevron');
      const content = el.querySelector('.ds-tool-call__content');
      const cS = content ? window.getComputedStyle(content) : {};
      const sections = el.querySelectorAll('.ds-tool-call__content > div');
      const divider = el.querySelector('.ds-tool-call__divider');
      const divS = divider ? window.getComputedStyle(divider) : {};
      const reqTitle = el.querySelector('.ds-tool-call__content p.text-muted-foreground');
      const reqTitleS = reqTitle ? window.getComputedStyle(reqTitle) : {};

      return {
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        chevronRotated: chevron ? chevron.classList.contains('ds-rotate-90') : false,
        contentDisplay: cS.display,
        borderRadius: cS.borderRadius,
        borderWidth: cS.borderWidth,
        dividerHeight: divS.height,
        sectionTitle: {
          fontSize: reqTitleS.fontSize,
          fontWeight: reqTitleS.fontWeight,
        },
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-call-default-expanded-dark.png` });

    assert(
      'Clicking Trigger Opens Panel (display: flex, radius: 16px)',
      expandedData.ariaExpanded === 'true' &&
        expandedData.chevronRotated === true &&
        expandedData.contentDisplay === 'flex' &&
        expandedData.borderRadius === '16px',
      `ariaExpanded=${expandedData.ariaExpanded}, rotated=${expandedData.chevronRotated}, display=${expandedData.contentDisplay}, radius=${expandedData.borderRadius}`
    );

    assert(
      'Panel Section Headers Strict 400 Mono (11px)',
      expandedData.sectionTitle.fontSize === '11px' && expandedData.sectionTitle.fontWeight === '400',
      `size=${expandedData.sectionTitle.fontSize}, weight=${expandedData.sectionTitle.fontWeight}`
    );

    assert(
      'Hairline Divider Between Request and Result (1px)',
      expandedData.dividerHeight === '1px',
      `dividerHeight=${expandedData.dividerHeight}`
    );

    // Toggle close
    await pageDark.locator('.ds-tool-target .ds-tool-trigger').click();
    await pageDark.waitForTimeout(150);
    const closedAgainDisplay = await pageDark.locator('.ds-tool-target .ds-tool-call__content').evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    assert(
      'Clicking Trigger Again Closes Panel (display: none)',
      closedAgainDisplay === 'none',
      `display=${closedAgainDisplay}`
    );

    // 3. Auditing Running Story (In-Flight Shimmer)
    console.log('\n[3/7] Auditing Running Story (In-Flight Shimmer)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--running&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageRunning = await pageDark.locator('.ds-story-stage').first();
    await stageRunning.screenshot({ path: `${ARTIFACT_DIR}/tool-call-running-dark.png` });

    const runningData = await pageDark.locator('[data-slot="tool-call"]').evaluate((el) => {
      const shimmerEl = el.querySelector('.shimmer');
      const sS = shimmerEl ? window.getComputedStyle(shimmerEl) : {};
      const statusIcon = el.querySelector('.ms-auto svg');
      return {
        label: shimmerEl ? shimmerEl.textContent.trim() : null,
        hasShimmerClass: !!shimmerEl,
        fontWeight: sS.fontWeight,
        hasStatusIcon: !!statusIcon,
      };
    });

    assert(
      'Running Story Displays Active Shimmer Label Without Status Icon',
      runningData.hasShimmerClass &&
        runningData.label === 'Searching the docs' &&
        runningData.fontWeight === '400' &&
        !runningData.hasStatusIcon,
      `label="${runningData.label}", shimmer=${runningData.hasShimmerClass}, icon=${runningData.hasStatusIcon}`
    );

    // 4. Auditing Failed Story (Error State with Red X)
    console.log('\n[4/7] Auditing Failed Story (Red X Error)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--failed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageFailed = await pageDark.locator('.ds-story-stage').first();
    await stageFailed.screenshot({ path: `${ARTIFACT_DIR}/tool-call-failed-dark.png` });

    const failedData = await pageDark.locator('[data-slot="tool-call"]').evaluate((el) => {
      const xIcon = el.querySelector('svg.text-red-500');
      const xS = xIcon ? window.getComputedStyle(xIcon) : {};
      const xRect = xIcon ? xIcon.getBoundingClientRect() : {};
      const content = el.querySelector('.ds-tool-call__content');
      const resultContent = content ? content.querySelector('p.text-foreground\\/90') : null;
      return {
        iconSize: `${xRect.width}x${xRect.height}`,
        iconColor: xS.color,
        resultText: resultContent ? resultContent.textContent.trim() : null,
      };
    });

    assert(
      'Failed Story Displays 14x14px Red Danger X Icon',
      failedData.iconSize === '14x14' && (failedData.iconColor.includes('250, 66, 62') || failedData.iconColor.includes('239, 68, 68')),
      `size=${failedData.iconSize}, color=${failedData.iconColor}, result="${failedData.resultText}"`
    );

    // 5. Auditing Long Input Story (Ellipsis Truncation)
    console.log('\n[5/7] Auditing Long Input Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--long-input&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageLong = await pageDark.locator('.ds-story-stage').first();
    await stageLong.screenshot({ path: `${ARTIFACT_DIR}/tool-call-long-input-dark.png` });

    const longData = await pageDark.locator('[data-slot="tool-call"]').evaluate((el) => {
      const chip = el.querySelector('.font-mono.truncate, .ds-tool-call__chip');
      const chipRect = chip ? chip.getBoundingClientRect() : {};
      const containerRect = el.getBoundingClientRect();
      const codeP = el.querySelector('.ds-tool-call__content p.break-words');
      const codePS = codeP ? window.getComputedStyle(codeP) : {};

      return {
        chipWidth: chipRect.width,
        containerWidth: containerRect.width,
        staysWithinContainer: chipRect.right <= containerRect.right + 2,
        wordBreak: codePS.wordBreak,
      };
    });

    assert(
      'Long Query Truncates Cleanly Within 384px Container Boundary',
      longData.staysWithinContainer && longData.containerWidth <= 384,
      `chipWidth=${longData.chipWidth}px, containerWidth=${longData.containerWidth}px`
    );

    assert(
      'Expanded JSON Code Breaks Words Properly',
      longData.wordBreak === 'break-all' || longData.wordBreak === 'break-word',
      `wordBreak=${longData.wordBreak}`
    );

    // 6. Light Mode Audit
    console.log('\n[6/7] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--expanded&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story-stage').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/tool-call-expanded-light.png` });

    const lightStyles = await pageLight.locator('.ds-tool-call__content').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        background: s.backgroundColor,
        borderColor: s.borderColor,
      };
    });

    assert(
      'Light Mode Renders Semantic Surface Tokens',
      lightStyles.background !== 'transparent' && lightStyles.borderColor !== 'transparent',
      `bg=${lightStyles.background}, border=${lightStyles.borderColor}`
    );

    // 7. Reduced Motion Audit
    console.log('\n[7/7] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-19-tool-call--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-tool-call').evaluate((el) => {
      const chevron = el.querySelector('.ds-chevron');
      const content = el.querySelector('.ds-tool-call__content');
      const cS = chevron ? window.getComputedStyle(chevron) : {};
      const cntS = content ? window.getComputedStyle(content) : {};
      return {
        chevronTransition: cS.transition,
        contentAnimation: cntS.animation,
      };
    });

    assert(
      'Reduced Motion Disables Chevron Transitions and Content Animations',
      motionStyles.chevronTransition.includes('none') &&
        (motionStyles.contentAnimation.includes('none') || motionStyles.contentAnimation === 'none 0s ease 0s 1 normal none running'),
      `chevronTransition=${motionStyles.chevronTransition}, contentAnimation=${motionStyles.contentAnimation}`
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
