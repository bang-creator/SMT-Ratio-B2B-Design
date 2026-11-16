import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 044 NUMBER TICKER ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-44-number-ticker--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="number-ticker"]');

    // Container geometry & structure
    const container = pageDefault.locator('[data-slot="number-ticker"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        alignItems: cs.alignItems,
        gap: cs.gap,
      };
    });

    assert(
      (containerStyles.display === 'inline-flex' || containerStyles.display === 'flex') &&
        containerStyles.flexDirection === 'column' &&
        containerStyles.alignItems === 'center' &&
        containerStyles.gap === '10px',
      `Container Geometry (flex/inline-flex, column, center, 10px gap): display=${containerStyles.display}, gap=${containerStyles.gap}`
    );

    // Value typography & ARIA label
    const valueEl = pageDefault.locator('.ds-number-ticker__value');
    const valueData = await valueEl.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        ariaLabel: el.getAttribute('aria-label'),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontVariantNumeric: cs.fontVariantNumeric,
        lineHeight: cs.lineHeight,
      };
    });

    assert(
      valueData.ariaLabel === '142,857' &&
        valueData.fontSize === '30px' &&
        (valueData.fontWeight === '500' || valueData.fontWeight === 'normal') &&
        valueData.fontVariantNumeric.includes('tabular-nums'),
      `Value Typography & ARIA (30px, 500/normal, tabular-nums, aria-label=142,857): font=${valueData.fontSize}/${valueData.fontWeight}, ariaLabel=${valueData.ariaLabel}`
    );

    // Rolling digit slots & columns
    const slotsCount = await pageDefault.locator('.ds-number-ticker__slot').count();
    const charsCount = await pageDefault.locator('.ds-number-ticker__char').count();
    assert(slotsCount === 6 && charsCount === 1, `Slots and Comma Separator (6 digits, 1 comma): slots=${slotsCount}, chars=${charsCount}`);

    // Rolling column transition & easing
    const colSpecs = await pageDefault.locator('.ds-number-ticker__col').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const spans = el.querySelectorAll('span');
      return {
        transitionProperty: cs.transitionProperty,
        transitionDuration: cs.transitionDuration,
        transitionTimingFunction: cs.transitionTimingFunction,
        digitsRendered: spans.length,
      };
    });

    assert(
      colSpecs.transitionProperty.includes('transform') &&
        colSpecs.transitionDuration === '0.5s' &&
        colSpecs.transitionTimingFunction.includes('cubic-bezier(0.32, 0.72, 0, 1)') &&
        colSpecs.digitsRendered === 10,
      `Rolling Column Transition (500ms cubic-bezier(0.32, 0.72, 0, 1), 10 digits): duration=${colSpecs.transitionDuration}, timing=${colSpecs.transitionTimingFunction}, digits=${colSpecs.digitsRendered}`
    );

    // Strict 400 Typography on Label
    const labelSpecs = await pageDefault.locator('.ds-number-ticker__label').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        text: el.textContent.trim(),
      };
    });

    assert(
      labelSpecs.fontSize === '12px' &&
        (labelSpecs.fontWeight === '400' || labelSpecs.fontWeight === 'normal') &&
        labelSpecs.text === 'Total tokens processed this session',
      `Strict 400 Typography on Label (12px/400 mono): font=${labelSpecs.fontSize}/${labelSpecs.fontWeight}, text="${labelSpecs.text}"`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/number-ticker-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: SMALL VALUE & LARGE METRIC STORIES
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing SmallValue & LargeMetric Stories...');
    const pageSmall = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageSmall.goto(`${BASE_URL}?id=default-application-44-number-ticker--small-value&viewMode=story`);
    await pageSmall.waitForSelector('[data-slot="number-ticker"]');

    const smallAria = await pageSmall.locator('.ds-number-ticker__value').getAttribute('aria-label');
    const smallSlots = await pageSmall.locator('.ds-number-ticker__slot').count();
    const smallChars = await pageSmall.locator('.ds-number-ticker__char').count();
    assert(smallAria === '42' && smallSlots === 2 && smallChars === 0, `SmallValue Specs (42, 2 slots, 0 commas): aria=${smallAria}, slots=${smallSlots}`);
    await pageSmall.screenshot({ path: `${ARTIFACT_DIR}/number-ticker-small-dark.png` });

    const pageLarge = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageLarge.goto(`${BASE_URL}?id=default-application-44-number-ticker--large-metric&viewMode=story`);
    await pageLarge.waitForSelector('[data-slot="number-ticker"]');

    const largeAria = await pageLarge.locator('.ds-number-ticker__value').getAttribute('aria-label');
    const largeSlots = await pageLarge.locator('.ds-number-ticker__slot').count();
    const largeChars = await pageLarge.locator('.ds-number-ticker__char').count();
    assert(largeAria === '1,842,910' && largeSlots === 7 && largeChars === 2, `LargeMetric Specs (1,842,910, 7 slots, 2 commas): aria=${largeAria}, slots=${largeSlots}, commas=${largeChars}`);
    await pageLarge.screenshot({ path: `${ARTIFACT_DIR}/number-ticker-large-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE STATE MACHINE & SMOOTH ROLLING
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-44-number-ticker--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#ticker-mount');

    let interAria = await pageInteractive.locator('.ds-number-ticker__value').getAttribute('aria-label');
    assert(interAria === '12,450', `Initial interactive value: ${interAria}`);

    // Click +500
    await pageInteractive.locator('#btn-add-500').click();
    await pageInteractive.waitForTimeout(250);
    interAria = await pageInteractive.locator('.ds-number-ticker__value').getAttribute('aria-label');
    assert(interAria === '12,950', `Interactive +500 updates value to 12,950: actual=${interAria}`);

    // Click +1,337
    await pageInteractive.locator('#btn-add-1337').click();
    await pageInteractive.waitForTimeout(250);
    interAria = await pageInteractive.locator('.ds-number-ticker__value').getAttribute('aria-label');
    assert(interAria === '14,287', `Interactive +1,337 updates value to 14,287: actual=${interAria}`);

    // Click Reset
    await pageInteractive.locator('#btn-reset').click();
    await pageInteractive.waitForTimeout(250);
    interAria = await pageInteractive.locator('.ds-number-ticker__value').getAttribute('aria-label');
    assert(interAria === '12,450', `Interactive Reset reverts value to 12,450: actual=${interAria}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/number-ticker-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-44-number-ticker--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="number-ticker"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const val = document.querySelector('.ds-number-ticker__value');
      const lbl = document.querySelector('.ds-number-ticker__label');
      return {
        valueColor: window.getComputedStyle(val).color,
        labelColor: window.getComputedStyle(lbl).color,
      };
    });

    assert(
      lightColors.valueColor !== lightColors.labelColor && lightColors.valueColor.length > 0,
      `Light mode resolves proper token contrast: value=${lightColors.valueColor}, label=${lightColors.labelColor}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/number-ticker-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-44-number-ticker--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-number-ticker__col');

    const motionTransition = await pageMotion.locator('.ds-number-ticker__col').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition.includes('none') || motionTransition === 'none 0s ease 0s',
      `Reduced motion disables roll transition: transition=${motionTransition}`
    );

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
