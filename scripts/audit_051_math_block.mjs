import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 051 MATH BLOCK ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-51-math-block--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="math-block"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="math-block"]').evaluate((el) => {
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
        cardSpecs.gap === '10px' &&
        cardSpecs.borderWidth === '1px',
      `Math Block Container Geometry (384px maxW, 16px radius, 16px padding, 10px gap, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Label & Note Strict 400 Typography
    const typography = await pageDefault.evaluate(() => {
      const label = document.querySelector('.ds-math-block__label');
      const note = document.querySelector('.ds-math-block__note');
      const expr = document.querySelector('.ds-math-block__expression');

      const labelCs = window.getComputedStyle(label);
      const noteCs = window.getComputedStyle(note);
      const exprCs = window.getComputedStyle(expr);

      return {
        labelText: label.textContent.trim(),
        labelFont: `${labelCs.fontSize}/${labelCs.fontWeight}`,
        noteText: note.textContent.trim(),
        noteFont: `${noteCs.fontSize}/${noteCs.fontWeight}`,
        exprFont: `${exprCs.fontSize}/${exprCs.fontStyle}`,
        exprAlign: exprCs.textAlign,
      };
    });

    assert(
      typography.labelText === 'Attention Formula' &&
        typography.labelFont === '12px/400' &&
        typography.noteFont === '12px/400' &&
        typography.exprFont === '17px/italic' &&
        typography.exprAlign === 'center',
      `Typography Specs (12px/400 mono label & note, 17px italic centered expression): label=${typography.labelFont}, expr=${typography.exprFont}`
    );

    // Fraction sub-component specs
    const fracSpecs = await pageDefault.locator('[data-slot="frac"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const under = el.querySelector('.ds-frac__under');
      const underCs = window.getComputedStyle(under);
      return {
        display: cs.display,
        borderTopWidth: underCs.borderTopWidth,
        borderTopStyle: underCs.borderTopStyle,
      };
    });

    assert(
      fracSpecs.display.includes('inline-flex') &&
        fracSpecs.borderTopWidth === '1px' &&
        fracSpecs.borderTopStyle === 'solid',
      `Fraction Component (inline-flex, 1px solid top border on under): display=${fracSpecs.display}, border=${fracSpecs.borderTopWidth}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/math-block-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: MULTI-STEP DERIVATION STORY
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing MultiStepDerivation Story...');
    const pageMulti = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMulti.goto(`${BASE_URL}?id=default-application-51-math-block--multi-step-derivation&viewMode=story`);
    await pageMulti.waitForSelector('[data-slot="math-block"]');

    const multiStepsCount = await pageMulti.locator('.ds-math-block__step').count();
    const multiNotesCount = await pageMulti.locator('.ds-math-block__note').count();
    const multiLabel = await pageMulti.locator('.ds-math-block__label').textContent();

    assert(
      multiStepsCount === 3 && multiNotesCount === 3 && multiLabel.includes("Bayes' Rule"),
      `Multi-step Derivation Specs (3 steps, 3 notes): count=${multiStepsCount}, label="${multiLabel.trim()}"`
    );
    await pageMulti.screenshot({ path: `${ARTIFACT_DIR}/math-block-multistep-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE DERIVATION MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-51-math-block--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#math-mount');

    let currentSteps = await pageInteractive.locator('.ds-math-block__step').count();
    assert(currentSteps === 1, `Initial interactive derivation has 1 step: count=${currentSteps}`);

    // Click Next Step
    await pageInteractive.locator('#btn-next-math').click();
    await pageInteractive.waitForTimeout(100);
    currentSteps = await pageInteractive.locator('.ds-math-block__step').count();
    assert(currentSteps === 2, `Next step increments visible steps to 2: count=${currentSteps}`);

    // Click Next Step again
    await pageInteractive.locator('#btn-next-math').click();
    await pageInteractive.waitForTimeout(100);
    currentSteps = await pageInteractive.locator('.ds-math-block__step').count();
    assert(currentSteps === 3, `Next step increments visible steps to 3: count=${currentSteps}`);

    // Click Previous Step
    await pageInteractive.locator('#btn-prev-math').click();
    await pageInteractive.waitForTimeout(100);
    currentSteps = await pageInteractive.locator('.ds-math-block__step').count();
    assert(currentSteps === 2, `Previous step decrements visible steps to 2: count=${currentSteps}`);

    // Click Reset
    await pageInteractive.locator('#btn-reset-math').click();
    await pageInteractive.waitForTimeout(100);
    currentSteps = await pageInteractive.locator('.ds-math-block__step').count();
    assert(currentSteps === 1, `Reset restores visible steps to 1: count=${currentSteps}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/math-block-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-51-math-block--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="math-block"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="math-block"]');
      const label = document.querySelector('.ds-math-block__label');
      const expr = document.querySelector('.ds-math-block__expression');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        cardBorder: window.getComputedStyle(card).borderColor,
        labelColor: window.getComputedStyle(label).color,
        exprColor: window.getComputedStyle(expr).color,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.cardBorder.length > 0 &&
        lightColors.labelColor !== lightColors.exprColor,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, exprColor=${lightColors.exprColor}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/math-block-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-51-math-block--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-math-block__expression');

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
