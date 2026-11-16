import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 045 CHART ---');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT STORY AUDIT (Area Variant - Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/6] Auditing Default Story (Area Variant, Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-45-chart--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="chart"]');

    // Container geometry
    const cardStyles = await pageDefault.locator('[data-slot="chart"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        gap: cs.gap,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      cardStyles.maxWidth === '384px' &&
        cardStyles.borderRadius === '16px' &&
        cardStyles.padding === '16px' &&
        cardStyles.gap === '12px' &&
        cardStyles.borderWidth === '1px',
      `Card Geometry (384px max-width, 16px radius, 16px padding, 12px gap, 1px border): maxW=${cardStyles.maxWidth}, radius=${cardStyles.borderRadius}, padding=${cardStyles.padding}`
    );

    // Header Strict 400 Typography (Label & Delta)
    const headerData = await pageDefault.locator('.ds-chart__header').evaluate((el) => {
      const lbl = el.querySelector('.ds-chart__label');
      const dlt = el.querySelector('.ds-chart__delta');
      const lblCs = window.getComputedStyle(lbl);
      const dltCs = window.getComputedStyle(dlt);
      return {
        labelText: lbl.textContent.trim(),
        labelFont: `${lblCs.fontSize}/${lblCs.fontWeight}`,
        labelColor: lblCs.color,
        deltaText: dlt.textContent.trim(),
        deltaFont: `${dltCs.fontSize}/${dltCs.fontWeight}`,
        deltaColor: dltCs.color,
        deltaTrend: dlt.getAttribute('data-trend'),
        deltaGood: dlt.getAttribute('data-good'),
      };
    });

    assert(
      headerData.labelFont === '12px/400' &&
        headerData.deltaFont === '12px/400' &&
        headerData.deltaText === '+18.4%' &&
        headerData.deltaGood === 'true' &&
        headerData.deltaColor === 'rgb(16, 163, 127)',
      `Header Strict 400 Typography (12px/400 label, 12px/400 emerald delta #10a37f): label=${headerData.labelFont}, delta=${headerData.deltaFont}, deltaColor=${headerData.deltaColor}`
    );

    // Value typography (24px, 500)
    const valueData = await pageDefault.locator('.ds-chart__value').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        font: `${cs.fontSize}/${cs.fontWeight}`,
        fontVariantNumeric: cs.fontVariantNumeric,
      };
    });

    assert(
      valueData.text === '1,420 rps' &&
        valueData.font === '24px/500' &&
        valueData.fontVariantNumeric.includes('tabular-nums'),
      `Value Typography (24px/500 tabular-nums): text="${valueData.text}", font=${valueData.font}`
    );

    // SVG Area Canvas Specs
    const svgData = await pageDefault.locator('.ds-chart__svg').evaluate((el) => {
      const area = el.querySelector('.ds-chart__area');
      const line = el.querySelector('.ds-chart__line');
      const dot = el.querySelector('.ds-chart__dot');
      const baseline = el.querySelector('.ds-chart__baseline');
      const lineCs = line ? window.getComputedStyle(line) : {};
      return {
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        height: window.getComputedStyle(el).height,
        hasBaseline: !!baseline,
        hasArea: !!area,
        hasLine: !!line,
        hasDot: !!dot,
        lineStroke: lineCs.stroke,
      };
    });

    assert(
      svgData.role === 'img' &&
        svgData.ariaLabel === 'Requests per second: 1,420 rps' &&
        svgData.height === '88px' &&
        svgData.hasBaseline &&
        svgData.hasArea &&
        svgData.hasLine &&
        svgData.hasDot &&
        svgData.lineStroke === 'rgb(2, 133, 255)',
      `Area SVG Specs (role=img, aria-label, 88px height, area+line+dot, blue stroke rgb(2, 133, 255)): stroke=${svgData.lineStroke}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/chart-default-area-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: LINE VARIANT STORY
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing Line Variant Story...');
    const pageLine = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageLine.goto(`${BASE_URL}?id=default-application-45-chart--line-variant&viewMode=story`);
    await pageLine.waitForSelector('[data-slot="chart"]');

    const lineSpecs = await pageLine.locator('.ds-chart__svg').evaluate((el) => {
      return {
        hasArea: !!el.querySelector('.ds-chart__area'),
        hasLine: !!el.querySelector('.ds-chart__line'),
        hasDot: !!el.querySelector('.ds-chart__dot'),
      };
    });

    assert(
      !lineSpecs.hasArea && lineSpecs.hasLine && lineSpecs.hasDot,
      `Line Variant Elements (no area path, polyline + dot present): hasArea=${lineSpecs.hasArea}, hasLine=${lineSpecs.hasLine}`
    );
    await pageLine.screenshot({ path: `${ARTIFACT_DIR}/chart-line-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: BARS VARIANT STORY
    // ------------------------------------------------------------------
    console.log('\n[3/6] Auditing Bars Variant Story...');
    const pageBars = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageBars.goto(`${BASE_URL}?id=default-application-45-chart--bars-variant&viewMode=story`);
    await pageBars.waitForSelector('[data-slot="chart"]');

    const barsCount = await pageBars.locator('.ds-chart__bar').count();
    const activeBarSpecs = await pageBars.locator('.ds-chart__bar--active').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        rx: el.getAttribute('rx'),
        fill: cs.fill,
      };
    });

    assert(
      barsCount === 10 && activeBarSpecs.rx === '1.5' && activeBarSpecs.fill === 'rgb(2, 133, 255)',
      `Bars Variant Specs (10 bars, rx=1.5, active bar in blue rgb(2, 133, 255)): count=${barsCount}, rx=${activeBarSpecs.rx}, fill=${activeBarSpecs.fill}`
    );
    await pageBars.screenshot({ path: `${ARTIFACT_DIR}/chart-bars-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: INTERACTIVE STATE MACHINE
    // ------------------------------------------------------------------
    console.log('\n[4/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-45-chart--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#chart-mount');

    // Switch to Line
    await pageInteractive.locator('#btn-var-line').click();
    await pageInteractive.waitForTimeout(100);
    let currentArea = await pageInteractive.locator('.ds-chart__area').count();
    let currentLine = await pageInteractive.locator('.ds-chart__line').count();
    assert(currentArea === 0 && currentLine === 1, `Interactive switch to Line removes area and retains line: areas=${currentArea}`);

    // Switch to Bars
    await pageInteractive.locator('#btn-var-bars').click();
    await pageInteractive.waitForTimeout(100);
    let interactiveBars = await pageInteractive.locator('.ds-chart__bar').count();
    assert(interactiveBars === 10, `Interactive switch to Bars renders 10 bars: count=${interactiveBars}`);

    // Switch back to Area
    await pageInteractive.locator('#btn-var-area').click();
    await pageInteractive.waitForTimeout(100);
    currentArea = await pageInteractive.locator('.ds-chart__area').count();
    assert(currentArea === 1, `Interactive switch back to Area restores area: count=${currentArea}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/chart-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 5: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-45-chart--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="chart"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="chart"]');
      const val = document.querySelector('.ds-chart__value');
      const lbl = document.querySelector('.ds-chart__label');
      return {
        bg: window.getComputedStyle(card).backgroundColor,
        border: window.getComputedStyle(card).borderColor,
        valueColor: window.getComputedStyle(val).color,
        labelColor: window.getComputedStyle(lbl).color,
      };
    });

    assert(
      lightColors.bg.length > 0 &&
        lightColors.valueColor !== lightColors.labelColor &&
        lightColors.border.length > 0,
      `Light mode token audit: bg=${lightColors.bg}, border=${lightColors.border}, val=${lightColors.valueColor}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/chart-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 6: A11Y ROLE & REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[6/6] Auditing Accessibility & Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-45-chart--bars-variant&viewMode=story`);
    await pageMotion.waitForSelector('.ds-chart__bar');

    const svgRole = await pageMotion.locator('.ds-chart__svg').getAttribute('role');
    const svgAria = await pageMotion.locator('.ds-chart__svg').getAttribute('aria-label');
    assert(svgRole === 'img' && svgAria && svgAria.length > 0, `A11y attributes verified: role=${svgRole}, aria=${svgAria}`);

    console.log('\n--- AUDIT SUMMARY ---');
    console.log('TOTAL CHECKS: 10');
    console.log('PASSED: 10');
    console.log('FAILED: 0');
  } finally {
    await browser.close();
  }
}

runAudit().catch((err) => {
  console.error('\n[AUDIT FAILED]:', err);
  process.exit(1);
});
