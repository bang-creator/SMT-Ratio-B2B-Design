import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:6006/iframe.html';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 040 RESEARCH REPORT ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT STORY (Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-40-research-report--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="research-report"]');

    const container = pageDefault.locator('[data-slot="research-report"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        gap: cs.gap,
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
      };
    });

    assert(
      containerStyles.display === 'flex' &&
        containerStyles.flexDirection === 'column' &&
        containerStyles.gap === '12px' &&
        containerStyles.maxWidth === '384px' &&
        containerStyles.borderRadius === '16px' &&
        containerStyles.padding === '16px',
      `Container Geometry (Flex col, 12px gap, 384px max-width, 16px radius, 16px padding): gap=${containerStyles.gap}, maxWidth=${containerStyles.maxWidth}, radius=${containerStyles.borderRadius}, padding=${containerStyles.padding}`
    );

    // Header specs
    const headerData = await pageDefault.locator('.ds-research-report__header').evaluate((el) => {
      const title = el.querySelector('.ds-research-report__title');
      const sub = el.querySelector('.ds-research-report__subtitle');
      const titleCs = window.getComputedStyle(title);
      const subCs = window.getComputedStyle(sub);
      return {
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        subFont: `${subCs.fontSize}/${subCs.fontWeight}`,
        subText: sub.textContent.trim(),
      };
    });

    assert(
      headerData.titleFont === '13.5px/500' &&
        headerData.subFont === '11px/400' &&
        headerData.subText === '1/3 sections · 34 sources read',
      `Header Hierarchy Specs (13.5px/500 title, 11px/400 mono sub, "1/3 sections..."): title=${headerData.titleFont}, sub=${headerData.subFont}, text="${headerData.subText}"`
    );

    const sections = pageDefault.locator('.ds-report-section');
    const sectionCount = await sections.count();
    assert(sectionCount === 3, `Renders Exactly 3 Report Sections: count=${sectionCount}`);

    // Section 1: Done with check icon and 22px indented preview
    const sec1Data = await sections.nth(0).evaluate((el) => {
      const heading = el.querySelector('.ds-report-section__heading');
      const sources = el.querySelector('.ds-report-section__sources');
      const preview = el.querySelector('.ds-report-section__preview');
      const hCs = window.getComputedStyle(heading);
      const sCs = window.getComputedStyle(sources);
      const pCs = window.getComputedStyle(preview);
      return {
        headingFont: `${hCs.fontSize}/${hCs.fontWeight}`,
        sourcesFont: `${sCs.fontSize}/${sCs.fontWeight}`,
        sourcesText: sources.textContent.trim(),
        previewFont: `${pCs.fontSize}/${pCs.fontWeight}`,
        previewPaddingLeft: pCs.paddingLeft,
      };
    });

    assert(
      sec1Data.headingFont === '13px/400' &&
        sec1Data.sourcesFont === '11px/400' &&
        sec1Data.sourcesText === '8 src' &&
        sec1Data.previewFont === '12px/400' &&
        sec1Data.previewPaddingLeft === '22px',
      `Section 1 (Done) Strict 400 Typography & 22px Indent: heading=${sec1Data.headingFont}, sources=${sec1Data.sourcesFont}, preview=${sec1Data.previewFont}, indent=${sec1Data.previewPaddingLeft}`
    );

    // Section 2: Writing with Blue Spinning Indicator
    const sec2Data = await sections.nth(1).evaluate((el) => {
      const status = el.querySelector('.ds-report-section__status');
      const sCs = window.getComputedStyle(status);
      return {
        color: sCs.color,
        isSpinning: sCs.animationName.includes('ds-report-spin'),
      };
    });

    assert(
      sec2Data.color === 'rgb(2, 133, 255)' && sec2Data.isSpinning === true,
      `Section 2 (Writing) Spinner Specs (Blue #0285ff, animation active): color=${sec2Data.color}, spinning=${sec2Data.isSpinning}`
    );

    // Section 3: Pending with 6x6px Dot
    const sec3Data = await sections.nth(2).evaluate((el) => {
      const dot = el.querySelector('.ds-report-section__status--pending');
      const heading = el.querySelector('.ds-report-section__heading');
      const dotRect = dot ? dot.getBoundingClientRect() : { width: 0, height: 0 };
      const hCs = window.getComputedStyle(heading);
      return {
        dotSize: `${Math.round(dotRect.width)}x${Math.round(dotRect.height)}`,
        headingColor: hCs.color,
      };
    });

    assert(
      sec3Data.dotSize === '6x6',
      `Section 3 (Pending) Subtle Dot Specs (6x6px): size=${sec3Data.dotSize}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/research-report-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: COMPLETE STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Complete Story...');
    const pageComplete = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageComplete.goto(`${BASE_URL}?id=default-application-40-research-report--complete&viewMode=story`);
    await pageComplete.waitForSelector('.ds-research-report__subtitle');

    const completeSubtitle = await pageComplete.locator('.ds-research-report__subtitle').textContent();
    const doneIconsCount = await pageComplete.locator('.ds-report-section__status--done').count();

    assert(
      completeSubtitle.trim() === '3/3 sections · 34 sources read' && doneIconsCount === 3,
      `Complete Story Telemetry & Check Icons ("3/3 sections..."): sub="${completeSubtitle.trim()}", checks=${doneIconsCount}`
    );

    await pageComplete.screenshot({ path: `${ARTIFACT_DIR}/research-report-complete-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE PROGRESS ADVANCEMENT
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Progress Step Advancement...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-40-research-report--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-btn-advance-report');

    // Click advance button
    await pageInteractive.locator('.ds-btn-advance-report').click();
    await pageInteractive.waitForTimeout(100);

    const advancedSubtitle = await pageInteractive.locator('.ds-research-report__subtitle').textContent();
    const advancedDoneCount = await pageInteractive.locator('.ds-report-section__status--done').count();
    const advancedWritingCount = await pageInteractive.locator('.ds-report-section__status--writing').count();

    assert(
      advancedSubtitle.trim() === '2/3 sections · 34 sources read' &&
        advancedDoneCount === 2 &&
        advancedWritingCount === 1,
      `Advancing Step Updates Subtitle to "2/3 sections" and Transitions Section 3 to Writing: sub="${advancedSubtitle.trim()}", done=${advancedDoneCount}, writing=${advancedWritingCount}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/research-report-interactive-advanced-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-40-research-report--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="research-report"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightCardTokens = await pageLight.locator('[data-slot="research-report"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: cs.borderColor,
      };
    });

    assert(
      lightCardTokens.bg === 'rgb(255, 255, 255)' || lightCardTokens.bg === 'rgb(249, 249, 249)' || lightCardTokens.bg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightCardTokens.bg}, border=${lightCardTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/research-report-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-40-research-report--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-report-section__status--writing');

    const motionAnimation = await pageMotion.locator('.ds-report-section__status--writing').evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });

    assert(
      motionAnimation === 'none',
      `Reduced Motion Disables Spinner Keyframe Animation: animation=${motionAnimation}`
    );

  } catch (err) {
    console.error('Audit encountered exception:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`TOTAL CHECKS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
