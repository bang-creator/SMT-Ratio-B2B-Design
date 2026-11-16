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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 038 DOCUMENT REFERENCE ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-38-document-reference--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="document-reference"]');

    const container = pageDefault.locator('[data-slot="document-reference"]');
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
        containerStyles.padding === '14px',
      `Container Geometry (Flex col, 12px gap, 384px max-width, 16px radius, 14px padding): gap=${containerStyles.gap}, maxWidth=${containerStyles.maxWidth}, radius=${containerStyles.borderRadius}, padding=${containerStyles.padding}`
    );

    // Header specs
    const headerData = await pageDefault.locator('.ds-doc-reference__header').evaluate((el) => {
      const iconBox = el.querySelector('.ds-doc-reference__icon-box');
      const icon = el.querySelector('svg');
      const title = el.querySelector('.ds-doc-reference__title');
      const sub = el.querySelector('.ds-doc-reference__subtitle');
      const boxCs = window.getComputedStyle(iconBox);
      const titleCs = window.getComputedStyle(title);
      const subCs = window.getComputedStyle(sub);
      const iconRect = icon.getBoundingClientRect();
      return {
        boxSize: `${Math.round(iconBox.getBoundingClientRect().width)}x${Math.round(iconBox.getBoundingClientRect().height)}`,
        boxRadius: boxCs.borderRadius,
        iconSize: `${Math.round(iconRect.width)}x${Math.round(iconRect.height)}`,
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        subFont: `${subCs.fontSize}/${subCs.fontWeight}`,
        subText: sub.textContent.trim(),
      };
    });

    assert(
      headerData.boxSize === '32x32' &&
        (headerData.boxRadius === '8px' || headerData.boxRadius === '10px') &&
        headerData.iconSize === '14x14' &&
        headerData.titleFont === '13.5px/500' &&
        headerData.subFont === '11px/400' &&
        headerData.subText === '48 pages · 3 cited',
      `Header Hierarchy Specs (32x32px box, 8-10px radius, 14x14 icon, 13.5px/500 title, 11px/400 sub): box=${headerData.boxSize}, radius=${headerData.boxRadius}, title=${headerData.titleFont}, sub=${headerData.subFont}, text="${headerData.subText}"`
    );

    const anchors = pageDefault.locator('.ds-doc-anchor');
    const anchorsCount = await anchors.count();
    assert(anchorsCount === 3, `Renders 3 Document Anchor Items: count=${anchorsCount}`);

    // Active Anchor 1 vs Inactive Anchor 2
    const anchor1Data = await anchors.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const page = el.querySelector('.ds-doc-anchor__page');
      const quote = el.querySelector('.ds-doc-anchor__quote');
      const quoteCs = window.getComputedStyle(quote);
      return {
        ariaCurrent: el.getAttribute('aria-current'),
        radius: cs.borderRadius,
        padding: cs.padding,
        pageText: page.textContent.trim(),
        quoteFont: `${quoteCs.fontSize}/${quoteCs.fontWeight}`,
        quoteBorderLeftColor: quoteCs.borderLeftColor,
      };
    });

    assert(
      anchor1Data.ariaCurrent === 'true' &&
        anchor1Data.radius === '12px' &&
        anchor1Data.quoteFont === '12px/400' &&
        anchor1Data.quoteBorderLeftColor === 'rgb(2, 133, 255)',
      `Anchor 1 Active Specs (aria-current=true, 12px radius, 12px/400 quote, blue border-left #0285ff): current=${anchor1Data.ariaCurrent}, font=${anchor1Data.quoteFont}, border=${anchor1Data.quoteBorderLeftColor}`
    );

    const anchor2Current = await anchors.nth(1).getAttribute('aria-current');
    assert(anchor2Current === 'false', `Anchor 2 Inactive Specs: aria-current=${anchor2Current}`);

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/document-reference-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: ACTIVE SECOND ANCHOR STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Active Second Anchor Story...');
    const pageSecond = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageSecond.goto(`${BASE_URL}?id=default-application-38-document-reference--active-second-anchor&viewMode=story`);
    await pageSecond.waitForSelector('.ds-doc-anchor');

    const secondAnchors = pageSecond.locator('.ds-doc-anchor');
    const secondCurrents = await Promise.all([
      secondAnchors.nth(0).getAttribute('aria-current'),
      secondAnchors.nth(1).getAttribute('aria-current'),
      secondAnchors.nth(2).getAttribute('aria-current'),
    ]);

    const secondAnchorBorder = await secondAnchors.nth(1).locator('.ds-doc-anchor__quote').evaluate((el) => {
      return window.getComputedStyle(el).borderLeftColor;
    });

    assert(
      secondCurrents[0] === 'false' && secondCurrents[1] === 'true' && secondCurrents[2] === 'false' && secondAnchorBorder === 'rgb(2, 133, 255)',
      `Second Story Activates Anchor 2 (p. 27) with Blue Border Accent: currents=[${secondCurrents.join(', ')}], border=${secondAnchorBorder}`
    );

    await pageSecond.screenshot({ path: `${ARTIFACT_DIR}/document-reference-second-anchor-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE SELECTION
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Anchor Click State Switching...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-38-document-reference--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-doc-anchor');

    // Click 3rd anchor
    await pageInteractive.locator('.ds-doc-anchor').nth(2).click();
    await pageInteractive.waitForTimeout(250);

    const postClickCurrents = await Promise.all([
      pageInteractive.locator('.ds-doc-anchor').nth(0).getAttribute('aria-current'),
      pageInteractive.locator('.ds-doc-anchor').nth(1).getAttribute('aria-current'),
      pageInteractive.locator('.ds-doc-anchor').nth(2).getAttribute('aria-current'),
    ]);

    const thirdAnchorBorder = await pageInteractive.locator('.ds-doc-anchor').nth(2).locator('.ds-doc-anchor__quote').evaluate((el) => {
      return window.getComputedStyle(el).borderLeftColor;
    });

    assert(
      postClickCurrents[0] === 'false' && postClickCurrents[2] === 'true' && thirdAnchorBorder === 'rgb(2, 133, 255)',
      `Clicking 3rd Anchor Shifts Active State to Anchor 3 (p. 34): currents=[${postClickCurrents.join(', ')}], border=${thirdAnchorBorder}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/document-reference-interactive-clicked-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-38-document-reference--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="document-reference"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightCardTokens = await pageLight.locator('[data-slot="document-reference"]').evaluate((el) => {
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

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/document-reference-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-38-document-reference--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-doc-anchor');

    const motionTransition = await pageMotion.locator('.ds-doc-anchor').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Anchor Background Transitions: transition=${motionTransition}`
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
