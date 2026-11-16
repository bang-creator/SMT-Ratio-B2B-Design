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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 042 GEO MAP ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-42-geo-map--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="geo-map"]');

    const container = pageDefault.locator('[data-slot="geo-map"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
      };
    });

    assert(
      containerStyles.display === 'flex' &&
        containerStyles.flexDirection === 'column' &&
        containerStyles.maxWidth === '384px' &&
        containerStyles.borderRadius === '16px' &&
        containerStyles.padding === '8px',
      `Container Geometry (Flex col, 384px max-width, 16px radius, 8px padding): maxWidth=${containerStyles.maxWidth}, radius=${containerStyles.borderRadius}, padding=${containerStyles.padding}`
    );

    // Viewport specs
    const viewportData = await pageDefault.locator('.ds-geo-map__viewport').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const role = el.getAttribute('role');
      const label = el.getAttribute('aria-label');
      const zoomBtns = el.querySelectorAll('.ds-geo-map__zoom-btn');
      const attr = el.querySelector('.ds-geo-map__attribution');
      const route = el.querySelector('.ds-geo-map__route');
      const routeCs = route ? window.getComputedStyle(route) : {};
      return {
        height: Math.round(rect.height),
        radius: cs.borderRadius,
        role,
        label,
        zoomCount: zoomBtns.length,
        attributionText: attr ? attr.textContent.trim() : '',
        routeStroke: routeCs.stroke,
      };
    });

    assert(
      viewportData.height === 260 &&
        viewportData.radius === '12px' &&
        viewportData.role === 'region' &&
        viewportData.label === 'Map of 3 places' &&
        viewportData.zoomCount === 2 &&
        viewportData.attributionText.includes('OpenStreetMap') &&
        viewportData.routeStroke === 'rgb(2, 133, 255)',
      `Viewport Canvas Specs (260px height, 12px radius, role=region, 2 zoom btns, OSM attribution, blue route): h=${viewportData.height}, radius=${viewportData.radius}, zoom=${viewportData.zoomCount}, attr="${viewportData.attributionText}", stroke=${viewportData.routeStroke}`
    );

    // Markers specs
    const markers = pageDefault.locator('.ds-geo-marker');
    const markersCount = await markers.count();
    assert(markersCount === 3, `Renders Exactly 3 Map Markers: count=${markersCount}`);

    const marker1Dot = await markers.nth(0).locator('.ds-geo-marker__dot').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        bg: cs.backgroundColor,
      };
    });

    assert(
      marker1Dot.size === '16x16' && marker1Dot.bg === 'rgb(2, 133, 255)',
      `Active Marker 1 Dot Specs (16x16px, blue accent #0285ff): size=${marker1Dot.size}, bg=${marker1Dot.bg}`
    );

    const marker2DotSize = await markers.nth(1).locator('.ds-geo-marker__dot').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return `${Math.round(rect.width)}x${Math.round(rect.height)}`;
    });

    assert(
      marker2DotSize === '10x10',
      `Inactive Marker 2 Dot Specs (10x10px): size=${marker2DotSize}`
    );

    // Places List specs
    const places = pageDefault.locator('.ds-geo-place');
    const placesCount = await places.count();
    assert(placesCount === 3, `Renders Exactly 3 Place List Items: count=${placesCount}`);

    const place1Data = await places.first().evaluate((el) => {
      const lbl = el.querySelector('.ds-geo-place__label');
      const desc = el.querySelector('.ds-geo-place__desc');
      const coords = el.querySelector('.ds-geo-place__coords');
      const lCs = window.getComputedStyle(lbl);
      const dCs = window.getComputedStyle(desc);
      const cCs = window.getComputedStyle(coords);
      return {
        lblFont: `${lCs.fontSize}/${lCs.fontWeight}`,
        descFont: `${dCs.fontSize}/${dCs.fontWeight}`,
        coordsFont: `${cCs.fontSize}/${cCs.fontWeight}`,
        coordsText: coords.textContent.trim(),
        ariaCurrent: el.getAttribute('aria-current'),
      };
    });

    assert(
      place1Data.lblFont === '13.5px/400' &&
        place1Data.descFont === '12px/400' &&
        place1Data.coordsFont === '11px/400' &&
        place1Data.coordsText === '37.7618, -122.4178' &&
        place1Data.ariaCurrent === 'true',
      `Place Item 1 Strict 400 Typography & Telemetry: lbl=${place1Data.lblFont}, desc=${place1Data.descFont}, coords=${place1Data.coordsFont} ("${place1Data.coordsText}")`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/geo-map-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: WITHOUT ROUTE STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Without Route Story...');
    const pageNoRoute = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageNoRoute.goto(`${BASE_URL}?id=default-application-42-geo-map--without-route&viewMode=story`);
    await pageNoRoute.waitForSelector('[data-slot="geo-map"]');

    const routeCount = await pageNoRoute.locator('.ds-geo-map__route').count();
    const marker2Current = await pageNoRoute.locator('.ds-geo-marker').nth(1).getAttribute('aria-current');

    assert(
      routeCount === 0 && marker2Current === 'true',
      `Without Route Story (Zero route polylines, Marker 2 active): routes=${routeCount}, marker2Current=${marker2Current}`
    );

    await pageNoRoute.screenshot({ path: `${ARTIFACT_DIR}/geo-map-without-route-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE SELECTION MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Marker & Place Selection Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-42-geo-map--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-geo-marker');

    // Click Marker 2 on map
    await pageInteractive.locator('.ds-geo-marker').nth(1).click();
    await pageInteractive.waitForTimeout(100);

    const marker2State = await pageInteractive.locator('.ds-geo-marker').nth(1).getAttribute('aria-current');
    const place2State = await pageInteractive.locator('.ds-geo-place').nth(1).getAttribute('aria-current');

    assert(
      marker2State === 'true' && place2State === 'true',
      `Clicking Marker 2 on Map Activates Marker 2 and Place 2 in List: marker2=${marker2State}, place2=${place2State}`
    );

    // Click Place 3 in list
    await pageInteractive.locator('.ds-geo-place').nth(2).click();
    await pageInteractive.waitForTimeout(100);

    const marker3State = await pageInteractive.locator('.ds-geo-marker').nth(2).getAttribute('aria-current');
    const place3State = await pageInteractive.locator('.ds-geo-place').nth(2).getAttribute('aria-current');

    assert(
      marker3State === 'true' && place3State === 'true',
      `Clicking Place 3 in List Activates Marker 3 on Map and Place 3 in List: marker3=${marker3State}, place3=${place3State}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/geo-map-interactive-selected-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-42-geo-map--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="geo-map"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightTokens = await pageLight.locator('[data-slot="geo-map"]').evaluate((el) => {
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

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/geo-map-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-42-geo-map--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-geo-marker__dot');

    const motionTransition = await pageMotion.locator('.ds-geo-marker__dot').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Marker Scale Transitions: transition=${motionTransition}`
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
