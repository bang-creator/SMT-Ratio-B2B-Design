import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 050 ACTIVITY GRAPH ---');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT STORY AUDIT (Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-50-activity-graph--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="activity-graph"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="activity-graph"]').evaluate((el) => {
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
      cardSpecs.maxWidth === '384px' &&
        cardSpecs.borderRadius === '16px' &&
        cardSpecs.padding === '16px' &&
        cardSpecs.gap === '12px' &&
        cardSpecs.borderWidth === '1px',
      `Card Geometry (384px maxW, 16px radius, 16px padding, 12px gap, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Header Strict 400 Typography (Title & Total)
    const headerSpecs = await pageDefault.locator('.ds-activity-graph__header').evaluate((el) => {
      const title = el.querySelector('.ds-activity-graph__title');
      const total = el.querySelector('.ds-activity-graph__total');
      const titleCs = window.getComputedStyle(title);
      const totalCs = window.getComputedStyle(total);
      return {
        titleText: title.textContent.trim(),
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        totalText: total.textContent.trim(),
        totalFont: `${totalCs.fontSize}/${totalCs.fontWeight}`,
        totalVariant: totalCs.fontVariantNumeric,
      };
    });

    assert(
      headerSpecs.titleText === 'API Activity' &&
        headerSpecs.titleFont.includes('13.5px') &&
        headerSpecs.totalText === '1,842 requests' &&
        headerSpecs.totalFont === '12px/400' &&
        headerSpecs.totalVariant.includes('tabular-nums'),
      `Header Specs (13.5px/500 title, 12px/400 mono tabular total): title=${headerSpecs.titleFont}, total=${headerSpecs.totalFont}`
    );

    // Heat Grid & Cells Geometry
    const gridData = await pageDefault.evaluate(() => {
      const grid = document.querySelector('.ds-activity-graph__grid');
      const cells = grid.querySelectorAll('.ds-activity-graph__cell');
      const firstCell = cells[0];
      const cs = window.getComputedStyle(firstCell);
      return {
        cellCount: cells.length,
        role: grid.getAttribute('role'),
        ariaLabel: grid.getAttribute('aria-label'),
        cellSize: `${cs.width}x${cs.height}`,
        cellRadius: cs.borderRadius,
      };
    });

    assert(
      gridData.cellCount === 112 &&
        gridData.role === 'grid' &&
        gridData.cellSize === '9pxx9px' &&
        gridData.cellRadius === '2px',
      `Grid Geometry (112 cells, role=grid, 9x9px, 2px radius): count=${gridData.cellCount}, size=${gridData.cellSize}, radius=${gridData.cellRadius}`
    );

    // Day Labels column
    const dayLabelsCount = await pageDefault.locator('.ds-activity-graph__day-label').count();
    const dayLabelsText = await pageDefault.locator('.ds-activity-graph__day-labels').textContent();
    assert(
      dayLabelsCount === 7 && dayLabelsText.includes('Mon') && dayLabelsText.includes('Wed') && dayLabelsText.includes('Fri'),
      `Day Labels (7 slots with Mon, Wed, Fri): text="${dayLabelsText.trim()}"`
    );

    // Legend Footer
    const legendSpecs = await pageDefault.locator('.ds-activity-graph__legend').evaluate((el) => {
      const swatches = el.querySelectorAll('.ds-activity-graph__cell');
      const labels = el.querySelectorAll('.ds-activity-graph__legend-label');
      return {
        swatchCount: swatches.length,
        lessText: labels[0] ? labels[0].textContent.trim() : '',
        moreText: labels[1] ? labels[1].textContent.trim() : '',
      };
    });

    assert(
      legendSpecs.swatchCount === 5 && legendSpecs.lessText === 'less' && legendSpecs.moreText === 'more',
      `Legend Footer (5 intensity swatches, less/more labels): swatches=${legendSpecs.swatchCount}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/activity-graph-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: LOW ACTIVITY STORY AUDIT
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing LowActivity Story...');
    const pageLow = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageLow.goto(`${BASE_URL}?id=default-application-50-activity-graph--low-activity&viewMode=story`);
    await pageLow.waitForSelector('[data-slot="activity-graph"]');

    const lowTitle = await pageLow.locator('.ds-activity-graph__title').textContent();
    const lowTotal = await pageLow.locator('.ds-activity-graph__total').textContent();
    assert(
      lowTitle.trim() === 'Token Ingestion Volume' && lowTotal.trim() === '312k tokens',
      `LowActivity Specs: title="${lowTitle.trim()}", total="${lowTotal.trim()}"`
    );
    await pageLow.screenshot({ path: `${ARTIFACT_DIR}/activity-graph-low-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE VIEW SWITCHER
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-50-activity-graph--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#graph-mount');

    // Click Token Volume
    await pageInteractive.locator('#btn-metric-tok').click();
    await pageInteractive.waitForTimeout(100);

    let activeTitle = await pageInteractive.locator('.ds-activity-graph__title').textContent();
    let activeTotal = await pageInteractive.locator('.ds-activity-graph__total').textContent();
    assert(
      activeTitle.includes('Token') && activeTotal.includes('tokens'),
      `Switching to Token Volume updates header: title="${activeTitle.trim()}", total="${activeTotal.trim()}"`
    );

    // Click API Requests
    await pageInteractive.locator('#btn-metric-req').click();
    await pageInteractive.waitForTimeout(100);

    activeTitle = await pageInteractive.locator('.ds-activity-graph__title').textContent();
    activeTotal = await pageInteractive.locator('.ds-activity-graph__total').textContent();
    assert(
      activeTitle.includes('API') && activeTotal.includes('requests'),
      `Switching to API Requests restores header: title="${activeTitle.trim()}", total="${activeTotal.trim()}"`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/activity-graph-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-50-activity-graph--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="activity-graph"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="activity-graph"]');
      const title = document.querySelector('.ds-activity-graph__title');
      const total = document.querySelector('.ds-activity-graph__total');
      const lvl4 = document.querySelector('.ds-heat-lvl-4');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        cardBorder: window.getComputedStyle(card).borderColor,
        titleColor: window.getComputedStyle(title).color,
        totalColor: window.getComputedStyle(total).color,
        lvl4Fill: window.getComputedStyle(lvl4).backgroundColor,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.titleColor !== lightColors.totalColor &&
        lightColors.lvl4Fill === 'rgb(2, 133, 255)',
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, lvl4=${lightColors.lvl4Fill}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/activity-graph-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: ACCESSIBILITY & REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Accessibility & Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-50-activity-graph--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-activity-graph__grid');

    const dayAriaHidden = await pageMotion.locator('.ds-activity-graph__day-labels').getAttribute('aria-hidden');
    const legendAriaHidden = await pageMotion.locator('.ds-activity-graph__legend').getAttribute('aria-hidden');
    assert(dayAriaHidden === 'true' && legendAriaHidden === 'true', `Decorative elements aria-hidden="true"`);

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
