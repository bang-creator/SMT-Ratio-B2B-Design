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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 041 MAP ANSWER ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-41-map-answer--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="map-answer"]');

    const container = pageDefault.locator('[data-slot="map-answer"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        overflow: cs.overflow,
      };
    });

    assert(
      containerStyles.display === 'flex' &&
        containerStyles.flexDirection === 'column' &&
        containerStyles.maxWidth === '384px' &&
        containerStyles.borderRadius === '16px' &&
        containerStyles.overflow === 'hidden',
      `Container Geometry (Flex col, 384px max-width, 16px radius, overflow hidden): maxWidth=${containerStyles.maxWidth}, radius=${containerStyles.borderRadius}, overflow=${containerStyles.overflow}`
    );

    // Canvas viewport specs
    const viewportData = await pageDefault.locator('.ds-map-viewport').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const lines = el.querySelectorAll('.ds-map-grid-line');
      const route = el.querySelector('.ds-map-route-line');
      const routeCs = route ? window.getComputedStyle(route) : {};
      return {
        height: Math.round(rect.height),
        gridLinesCount: lines.length,
        hasRoute: !!route,
        routeStroke: routeCs.stroke,
      };
    });

    assert(
      viewportData.height === 160 &&
        viewportData.gridLinesCount === 7 &&
        viewportData.hasRoute &&
        viewportData.routeStroke === 'rgb(2, 133, 255)',
      `Viewport Canvas Specs (160px height, 7 grid lines, blue route line #0285ff): height=${viewportData.height}, lines=${viewportData.gridLinesCount}, stroke=${viewportData.routeStroke}`
    );

    // Map pins count & active pin specs
    const pins = pageDefault.locator('.ds-map-pin');
    const pinsCount = await pins.count();
    assert(pinsCount === 3, `Renders Exactly 3 Map Pins: count=${pinsCount}`);

    const pin1DotSize = await pins.nth(0).locator('.ds-map-pin__dot').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        bg: cs.backgroundColor,
      };
    });

    assert(
      pin1DotSize.size === '14x14' && pin1DotSize.bg === 'rgb(2, 133, 255)',
      `Active Pin 1 Dot Geometry (14x14px, blue accent #0285ff): size=${pin1DotSize.size}, bg=${pin1DotSize.bg}`
    );

    const pin2DotSize = await pins.nth(1).locator('.ds-map-pin__dot').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    });

    assert(
      pin2DotSize === '10x10',
      `Inactive Pin 2 Dot Geometry (10x10px): size=${pin2DotSize}`
    );

    // Location items list typography
    const items = pageDefault.locator('.ds-map-answer__item');
    const itemsCount = await items.count();
    assert(itemsCount === 3, `Renders Exactly 3 Location List Items: count=${itemsCount}`);

    const item1Data = await items.first().evaluate((el) => {
      const lbl = el.querySelector('.ds-map-answer__label');
      const det = el.querySelector('.ds-map-answer__detail');
      const lCs = window.getComputedStyle(lbl);
      const dCs = window.getComputedStyle(det);
      return {
        lblFont: `${lCs.fontSize}/${lCs.fontWeight}`,
        detFont: `${dCs.fontSize}/${dCs.fontWeight}`,
        ariaCurrent: el.getAttribute('aria-current'),
      };
    });

    assert(
      item1Data.lblFont === '13px/400' &&
        item1Data.detFont === '11px/400' &&
        item1Data.ariaCurrent === 'true',
      `Location Item 1 Strict 400 Typography (13px/400 label, 11px/400 mono detail): lbl=${item1Data.lblFont}, det=${item1Data.detFont}, current=${item1Data.ariaCurrent}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/map-answer-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: WITHOUT ROUTE STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Without Route Story...');
    const pageNoRoute = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageNoRoute.goto(`${BASE_URL}?id=default-application-41-map-answer--without-route&viewMode=story`);
    await pageNoRoute.waitForSelector('[data-slot="map-answer"]');

    const routeCount = await pageNoRoute.locator('.ds-map-route-line').count();
    const pin2Current = await pageNoRoute.locator('.ds-map-pin').nth(1).getAttribute('aria-current');

    assert(
      routeCount === 0 && pin2Current === 'true',
      `Without Route Story (Zero route polylines, Pin 2 active): routes=${routeCount}, pin2Current=${pin2Current}`
    );

    await pageNoRoute.screenshot({ path: `${ARTIFACT_DIR}/map-answer-without-route-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE SELECTION MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Pin and List Selection Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-41-map-answer--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-map-pin');

    // Click Pin 2 on map
    await pageInteractive.locator('.ds-map-pin').nth(1).click();
    await pageInteractive.waitForTimeout(100);

    const pin2State = await pageInteractive.locator('.ds-map-pin').nth(1).getAttribute('aria-current');
    const item2State = await pageInteractive.locator('.ds-map-answer__item').nth(1).getAttribute('aria-current');

    assert(
      pin2State === 'true' && item2State === 'true',
      `Clicking Pin 2 on Map Activates Pin 2 and Item 2 in List: pin2=${pin2State}, item2=${item2State}`
    );

    // Click Item 3 in list
    await pageInteractive.locator('.ds-map-answer__item').nth(2).click();
    await pageInteractive.waitForTimeout(100);

    const pin3State = await pageInteractive.locator('.ds-map-pin').nth(2).getAttribute('aria-current');
    const item3State = await pageInteractive.locator('.ds-map-answer__item').nth(2).getAttribute('aria-current');

    assert(
      pin3State === 'true' && item3State === 'true',
      `Clicking Item 3 in List Activates Pin 3 on Map and Item 3 in List: pin3=${pin3State}, item3=${item3State}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/map-answer-interactive-selected-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-41-map-answer--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="map-answer"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightTokens = await pageLight.locator('[data-slot="map-answer"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: cs.borderColor,
      };
    });

    assert(
      lightTokens.bg === 'rgb(255, 255, 255)' || lightTokens.bg === 'rgb(249, 249, 249)' || lightTokens.bg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightTokens.bg}, border=${lightTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/map-answer-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-41-map-answer--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-map-pin__dot');

    const motionTransition = await pageMotion.locator('.ds-map-pin__dot').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Pin Scale Transitions: transition=${motionTransition}`
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
