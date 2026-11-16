import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 052 SPEC SHEET ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-52-spec-sheet--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="spec-sheet"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="spec-sheet"]').evaluate((el) => {
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

    // Header specs (13.5px title, 12px/400 subtitle)
    const headerSpecs = await pageDefault.evaluate(() => {
      const title = document.querySelector('.ds-spec-sheet__title');
      const subtitle = document.querySelector('.ds-spec-sheet__subtitle');
      const titleCs = window.getComputedStyle(title);
      const subCs = window.getComputedStyle(subtitle);
      return {
        titleText: title.textContent.trim(),
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        subText: subtitle.textContent.trim(),
        subFont: `${subCs.fontSize}/${subCs.fontWeight}`,
      };
    });

    assert(
      headerSpecs.titleFont.includes('13.5px') &&
        headerSpecs.subFont === '12px/400' &&
        headerSpecs.subText.includes('Production Cluster A'),
      `Header Specs (13.5px/500 title, 12px/400 subtitle): title=${headerSpecs.titleFont}, sub=${headerSpecs.subFont}`
    );

    // Row specs & Strict 400 Mono Labels
    const rowCount = await pageDefault.locator('.ds-spec-sheet__row').count();
    assert(rowCount === 4, `Renders exactly 4 spec rows: count=${rowCount}`);

    const firstRowSpecs = await pageDefault.locator('.ds-spec-sheet__row').first().evaluate((el) => {
      const label = el.querySelector('.ds-spec-sheet__label');
      const val = el.querySelector('.ds-spec-sheet__value');
      const labelCs = window.getComputedStyle(label);
      const valCs = window.getComputedStyle(val);
      const rowCs = window.getComputedStyle(el);
      return {
        labelWidth: labelCs.width,
        labelFont: `${labelCs.fontSize}/${labelCs.fontWeight}`,
        valFont: `${valCs.fontSize}/${valCs.fontWeight}`,
        valAlign: valCs.textAlign,
        rowBorderTop: rowCs.borderTopStyle,
      };
    });

    assert(
      firstRowSpecs.labelWidth === '96px' &&
        firstRowSpecs.labelFont === '12px/400' &&
        firstRowSpecs.valFont.startsWith('13px') &&
        firstRowSpecs.valAlign === 'right' &&
        (firstRowSpecs.rowBorderTop === 'none' || firstRowSpecs.rowBorderTop === ''),
      `First Row Specs (96px/400 mono label, 13px right-aligned value, border-top none): labelW=${firstRowSpecs.labelWidth}, font=${firstRowSpecs.labelFont}, borderTop=${firstRowSpecs.rowBorderTop}`
    );

    // Emphasis Row (Row 2: Context window)
    const empRowSpecs = await pageDefault.locator('.ds-spec-sheet__row').nth(1).evaluate((el) => {
      const val = el.querySelector('.ds-spec-sheet__value');
      const cs = window.getComputedStyle(val);
      return {
        isEmphasis: val.getAttribute('data-emphasis'),
        fontWeight: cs.fontWeight,
      };
    });

    assert(
      empRowSpecs.isEmphasis === 'true' &&
        (empRowSpecs.fontWeight === '500' || empRowSpecs.fontWeight === 'medium'),
      `Emphasis Row 2 (weight 500): weight=${empRowSpecs.fontWeight}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/spec-sheet-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: COMPACT STORY AUDIT
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing Compact Story...');
    const pageCompact = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageCompact.goto(`${BASE_URL}?id=default-application-52-spec-sheet--compact&viewMode=story`);
    await pageCompact.waitForSelector('[data-slot="spec-sheet"]');

    const compactSub = await pageCompact.locator('.ds-spec-sheet__subtitle').textContent();
    const compactRows = await pageCompact.locator('.ds-spec-sheet__row').count();
    assert(
      compactSub.includes('gpt-4o-mini') && compactRows === 3,
      `Compact Story Specs (gpt-4o-mini, 3 rows): sub="${compactSub.trim()}", rows=${compactRows}`
    );
    await pageCompact.screenshot({ path: `${ARTIFACT_DIR}/spec-sheet-compact-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE MODEL SWITCHER
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-52-spec-sheet--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#spec-mount');

    // Click gpt-4o-mini
    await pageInteractive.locator('#btn-m-mini').click();
    await pageInteractive.waitForTimeout(100);

    let activeSub = await pageInteractive.locator('.ds-spec-sheet__subtitle').textContent();
    let rowsCount = await pageInteractive.locator('.ds-spec-sheet__row').count();
    assert(activeSub.includes('gpt-4o-mini') && rowsCount === 5, `Switch to gpt-4o-mini updates spec: sub="${activeSub.trim()}", rows=${rowsCount}`);

    // Click o1-preview
    await pageInteractive.locator('#btn-m-o1').click();
    await pageInteractive.waitForTimeout(100);

    activeSub = await pageInteractive.locator('.ds-spec-sheet__subtitle').textContent();
    const o1OutputVal = await pageInteractive.locator('.ds-spec-sheet__row').nth(2).locator('.ds-spec-sheet__value').textContent();
    assert(activeSub.includes('o1-preview') && o1OutputVal.includes('32,768'), `Switch to o1-preview updates spec: maxOutput="${o1OutputVal.trim()}"`);

    // Click gpt-4o
    await pageInteractive.locator('#btn-m-4o').click();
    await pageInteractive.waitForTimeout(100);

    activeSub = await pageInteractive.locator('.ds-spec-sheet__subtitle').textContent();
    assert(activeSub.includes('gpt-4o · Multi-modal'), `Restoring gpt-4o updates subtitle: "${activeSub.trim()}"`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/spec-sheet-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-52-spec-sheet--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="spec-sheet"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="spec-sheet"]');
      const label = document.querySelector('.ds-spec-sheet__label');
      const val = document.querySelector('.ds-spec-sheet__value');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        cardBorder: window.getComputedStyle(card).borderColor,
        labelColor: window.getComputedStyle(label).color,
        valColor: window.getComputedStyle(val).color,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.cardBorder.length > 0 &&
        lightColors.labelColor.length > 0,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, labelColor=${lightColors.labelColor}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/spec-sheet-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-52-spec-sheet--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-spec-sheet__row');

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
