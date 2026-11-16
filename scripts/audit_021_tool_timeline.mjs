import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 021 TOOL TIMELINE ---');
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
    // 1. Dark Mode: Default Story (Open with Steps & Stats)
    console.log('\n[1/6] Auditing Default Story - Open (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-21-tool-timeline--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="tool-timeline"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-timeline-default-open-dark.png` });

    const openData = await pageDark.locator('[data-slot="tool-timeline"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const btn = el.querySelector('.ds-tool-timeline__trigger');
      const bS = btn ? window.getComputedStyle(btn) : {};
      const chevron = el.querySelector('.ds-tool-timeline__chevron');
      const cSvg = chevron ? window.getComputedStyle(chevron) : {};
      const cRect = chevron ? chevron.getBoundingClientRect() : {};
      const content = el.querySelector('.ds-tool-timeline__content');
      const cntS = content ? window.getComputedStyle(content) : {};

      const steps = Array.from(el.querySelectorAll('.ds-tool-timeline__step')).map((st) => {
        const icon = st.querySelector('svg');
        const iRect = icon ? icon.getBoundingClientRect() : {};
        const verb = st.querySelector('span:not(.ds-reasoning-chip)');
        const chip = st.querySelector('.ds-reasoning-chip');
        const vS = verb ? window.getComputedStyle(verb) : {};
        const chS = chip ? window.getComputedStyle(chip) : {};

        return {
          iconWidth: iRect.width,
          iconHeight: iRect.height,
          verbText: verb ? verb.textContent.trim() : null,
          verbWeight: vS.fontWeight,
          verbSize: vS.fontSize,
          chipText: chip ? chip.textContent.trim() : null,
          chipWeight: chS.fontWeight,
          chipSize: chS.fontSize,
          chipFont: chS.fontFamily,
        };
      });

      const stats = Array.from(el.querySelectorAll('.ds-file-stat')).map((st) => {
        const fileSpan = st.querySelector('span:first-child');
        const addSpan = st.querySelector('.ds-diff-stat-add');
        const remSpan = st.querySelector('.ds-diff-stat-remove');
        const addS = addSpan ? window.getComputedStyle(addSpan) : {};
        const remS = remSpan ? window.getComputedStyle(remSpan) : {};
        return {
          file: fileSpan ? fileSpan.textContent.trim() : null,
          addText: addSpan ? addSpan.textContent.trim() : null,
          addColor: addS.color,
          addWeight: addS.fontWeight,
          remText: remSpan ? remSpan.textContent.trim() : null,
          remColor: remS.color,
          remWeight: remS.fontWeight,
        };
      });

      return {
        maxWidth: s.maxWidth,
        trigger: {
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
          dataOpen: el.getAttribute('data-open'),
        },
        chevron: {
          width: cRect.width,
          height: cRect.height,
        },
        content: {
          display: cntS.display,
        },
        steps: steps,
        stats: stats,
      };
    });

    results.measurements.openDark = openData;

    assert(
      'Container Width (384px)',
      openData.maxWidth === '384px',
      `maxWidth=${openData.maxWidth}`
    );

    assert(
      'Trigger Strict 400 Typography (13.5px)',
      openData.trigger.fontSize === '13.5px' && openData.trigger.fontWeight === '400',
      `size=${openData.trigger.fontSize}, weight=${openData.trigger.fontWeight}`
    );

    assert(
      'Chevron Dimensions (14x14px)',
      Math.abs(openData.chevron.width - 14) <= 1 && Math.abs(openData.chevron.height - 14) <= 1,
      `size=${openData.chevron.width}x${openData.chevron.height}px`
    );

    assert(
      'Open State Displays Content and Sets ARIA Expanded',
      openData.content.display === 'flex' &&
        openData.trigger.ariaExpanded === 'true' &&
        openData.trigger.dataOpen === 'true',
      `contentDisplay=${openData.content.display}, ariaExpanded=${openData.trigger.ariaExpanded}`
    );

    assert(
      'Renders 4 Timeline Steps with 14x14px Icons and Strict 400 Weight',
      openData.steps.length === 4 &&
        openData.steps.every(
          (st) =>
            st.verbWeight === '400' &&
            st.chipWeight === '400' &&
            Math.abs(st.iconWidth - 14) <= 1 &&
            Math.abs(st.iconHeight - 14) <= 1
        ),
      `count=${openData.steps.length}, verbs=${openData.steps.map((st) => st.verbText).join(', ')}`
    );

    assert(
      'Reasoning Chips Mono Typography (11px / 400)',
      openData.steps.every((st) => st.chipSize === '11px' && st.chipWeight === '400'),
      `chips=${openData.steps.map((st) => `${st.chipText} (${st.chipSize})`).join(', ')}`
    );

    assert(
      'Diff Stats File Changes Tokenized Colors (Emerald Add, Red Remove, Strict 400)',
      openData.stats.length === 2 &&
        openData.stats[0].addColor.includes('16, 163, 127') &&
        (openData.stats[0].remColor.includes('250, 66, 62') || openData.stats[0].remColor.includes('239, 68, 68')) &&
        openData.stats[0].addWeight === '400' &&
        openData.stats[0].remWeight === '400',
      `stats=${JSON.stringify(openData.stats)}`
    );

    // 2. Interactive Toggle
    console.log('\n[2/6] Testing Interactive Toggle (Fold / Unfold)...');
    await pageDark.locator('.ds-tool-timeline-btn').click();
    await pageDark.waitForTimeout(200);

    const foldedData = await pageDark.locator('[data-slot="tool-timeline"]').evaluate((el) => {
      const btn = el.querySelector('.ds-tool-timeline-btn');
      const content = el.querySelector('.ds-tool-timeline__content');
      return {
        dataOpen: el.getAttribute('data-open'),
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        display: content ? window.getComputedStyle(content).display : null,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/tool-timeline-default-folded-dark.png` });

    assert(
      'Clicking Trigger Folds Panel (data-open="false", aria-expanded="false", display: none)',
      foldedData.dataOpen === 'false' &&
        foldedData.ariaExpanded === 'false' &&
        foldedData.display === 'none',
      `dataOpen=${foldedData.dataOpen}, ariaExpanded=${foldedData.ariaExpanded}, display=${foldedData.display}`
    );

    // Click to unfold again
    await pageDark.locator('.ds-tool-timeline-btn').click();
    await pageDark.waitForTimeout(200);
    const reOpenedDisplay = await pageDark.locator('.ds-tool-timeline__content').evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    assert(
      'Clicking Trigger Again Reopens Content (display: flex)',
      reOpenedDisplay === 'flex',
      `display=${reOpenedDisplay}`
    );

    // 3. Auditing Streaming Story
    console.log('\n[3/6] Auditing Streaming Story (In-Flight Shimmer)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-21-tool-timeline--streaming&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageStreaming = await pageDark.locator('.ds-story').first();
    await stageStreaming.screenshot({ path: `${ARTIFACT_DIR}/tool-timeline-streaming-dark.png` });

    const streamingData = await pageDark.locator('[data-slot="tool-timeline"]').evaluate((el) => {
      const triggerLabel = el.querySelector('.ds-thinking-indicator__label');
      const steps = el.querySelectorAll('.ds-tool-timeline__step');
      const lastStepShimmer = steps.length > 0 ? steps[steps.length - 1].querySelector('.ds-thinking-indicator__label') : null;
      return {
        hasTriggerShimmer: !!triggerLabel,
        triggerText: triggerLabel ? triggerLabel.textContent.trim() : null,
        hasLastStepShimmer: !!lastStepShimmer,
        lastStepText: lastStepShimmer ? lastStepShimmer.textContent.trim() : null,
      };
    });

    assert(
      'Streaming Story Renders Active Shimmer on Header and In-Flight Step',
      streamingData.hasTriggerShimmer &&
        streamingData.triggerText === 'Working for 3s' &&
        streamingData.hasLastStepShimmer &&
        streamingData.lastStepText === 'Reading',
      `trigger="${streamingData.triggerText}", lastStep="${streamingData.lastStepText}"`
    );

    // 4. Auditing Collapsed Story
    console.log('\n[4/6] Auditing Collapsed Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-21-tool-timeline--collapsed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageCollapsed = await pageDark.locator('.ds-story').first();
    await stageCollapsed.screenshot({ path: `${ARTIFACT_DIR}/tool-timeline-collapsed-dark.png` });

    const collapsedStoryDisplay = await pageDark.locator('.ds-tool-timeline__content').evaluate((el) => {
      return window.getComputedStyle(el).display;
    });
    assert(
      'Collapsed Story Renders with Hidden Content Initially',
      collapsedStoryDisplay === 'none',
      `display=${collapsedStoryDisplay}`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-21-tool-timeline--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/tool-timeline-default-open-light.png` });

    const lightStyles = await pageLight.locator('.ds-reasoning-chip').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        background: s.backgroundColor,
        color: s.color,
      };
    });

    assert(
      'Light Mode Reasoning Chips Render Subtle Surface Tokens',
      lightStyles.background !== 'transparent' && lightStyles.color !== 'transparent',
      `bg=${lightStyles.background}, color=${lightStyles.color}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-21-tool-timeline--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-tool-timeline').evaluate((el) => {
      const chevron = el.querySelector('.ds-tool-timeline__chevron');
      const content = el.querySelector('.ds-tool-timeline__content');
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
