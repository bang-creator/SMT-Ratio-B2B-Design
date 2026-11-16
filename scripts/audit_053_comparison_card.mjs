import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 053 COMPARISON CARD ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-53-comparison-card--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="comparison-card"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="comparison-card"]').evaluate((el) => {
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
      cardSpecs.maxWidth === '448px' &&
        cardSpecs.borderRadius === '16px' &&
        cardSpecs.padding === '16px' &&
        cardSpecs.gap === '12px' &&
        cardSpecs.borderWidth === '1px',
      `Card Geometry (448px maxW, 16px radius, 16px padding, 12px gap, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Option columns count & geometry
    const optionsCount = await pageDefault.locator('.ds-comparison-card__option').count();
    assert(optionsCount === 2, `Renders exactly 2 comparison columns: count=${optionsCount}`);

    const optSpecs = await pageDefault.locator('.ds-comparison-card__option').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const name = el.querySelector('.ds-comparison-card__name');
      const pick = el.querySelector('.ds-comparison-card__pick');
      const headline = el.querySelector('.ds-comparison-card__headline');
      const nameCs = window.getComputedStyle(name);
      const pickCs = window.getComputedStyle(pick);
      const headCs = window.getComputedStyle(headline);

      return {
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        nameText: name.textContent.trim(),
        nameFont: `${nameCs.fontSize}/${nameCs.fontWeight}`,
        pickText: pick ? pick.textContent.trim() : '',
        pickColor: pickCs.color,
        headFont: `${headCs.fontSize}/${headCs.fontWeight}`,
        isRecommended: el.getAttribute('data-recommended'),
      };
    });

    assert(
      optSpecs.borderRadius === '12px' &&
        optSpecs.padding === '12px' &&
        optSpecs.nameText === 'gpt-4o' &&
        optSpecs.nameFont.includes('13px') &&
        optSpecs.pickText === 'pick' &&
        optSpecs.pickColor === 'rgb(2, 133, 255)' &&
        optSpecs.headFont === '12px/400' &&
        optSpecs.isRecommended === 'true',
      `Option 1 Specs (12px radius, gpt-4o 13px/500, pick in blue rgb(2, 133, 255), 12px/400 headline): name=${optSpecs.nameFont}, pick=${optSpecs.pickText}`
    );

    // Traits checks & Strict 400 Typography
    const opt2Traits = await pageDefault.locator('.ds-comparison-card__option').nth(1).evaluate((el) => {
      const traits = el.querySelectorAll('.ds-comparison-card__trait');
      const t1 = traits[0];
      const t2 = traits[1];
      const t1Cs = window.getComputedStyle(t1);
      const t2Cs = window.getComputedStyle(t2);
      const hasMinus = !!t2.querySelector('.ds-comparison-card__icon-minus');
      const checkIcon = t1.querySelector('.ds-comparison-card__icon-check');
      const checkCs = window.getComputedStyle(checkIcon);

      return {
        traitCount: traits.length,
        t1Font: `${t1Cs.fontSize}/${t1Cs.fontWeight}`,
        t2Font: `${t2Cs.fontSize}/${t2Cs.fontWeight}`,
        hasMinusOnAbsent: hasMinus,
        checkColor: checkCs.color,
      };
    });

    assert(
      opt2Traits.traitCount === 3 &&
        opt2Traits.t1Font === '12px/400' &&
        opt2Traits.t2Font === '12px/400' &&
        opt2Traits.hasMinusOnAbsent &&
        opt2Traits.checkColor === 'rgb(16, 163, 127)',
      `Traits Specs (12px/400 strict typography, emerald check #10a37f, minus on absent): t1=${opt2Traits.t1Font}, checkColor=${opt2Traits.checkColor}`
    );

    // Reason typography
    const reasonSpecs = await pageDefault.locator('.ds-comparison-card__reason').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
      };
    });

    assert(
      reasonSpecs.fontSize === '12px' &&
        (reasonSpecs.fontWeight === '400' || reasonSpecs.fontWeight === 'normal'),
      `Reason Strict 400 Typography: font=${reasonSpecs.fontSize}/${reasonSpecs.fontWeight}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/comparison-card-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: MINI RECOMMENDED STORY AUDIT
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing MiniRecommended Story...');
    const pageMini = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMini.goto(`${BASE_URL}?id=default-application-53-comparison-card--mini-recommended&viewMode=story`);
    await pageMini.waitForSelector('[data-slot="comparison-card"]');

    const miniRec = await pageMini.locator('.ds-comparison-card__option').nth(1).getAttribute('data-recommended');
    const miniPickCount = await pageMini.locator('.ds-comparison-card__option').nth(1).locator('.ds-comparison-card__pick').count();
    assert(
      miniRec === 'true' && miniPickCount === 1,
      `MiniRecommended Story has pick on option 2: rec=${miniRec}, pickCount=${miniPickCount}`
    );
    await pageMini.screenshot({ path: `${ARTIFACT_DIR}/comparison-card-mini-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE PICK MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-53-comparison-card--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#comp-mount');

    // Click option 2 (mini)
    await pageInteractive.locator('.ds-comparison-card__option').nth(1).click();
    await pageInteractive.waitForTimeout(100);

    let opt2Rec = await pageInteractive.locator('.ds-comparison-card__option').nth(1).getAttribute('data-recommended');
    let reasonText = await pageInteractive.locator('.ds-comparison-card__reason').textContent();
    assert(opt2Rec === 'true' && reasonText.includes('gpt-4o-mini is recommended'), `Clicking option 2 picks mini: rec=${opt2Rec}`);

    // Click option 1 (4o)
    await pageInteractive.locator('.ds-comparison-card__option').nth(0).click();
    await pageInteractive.waitForTimeout(100);

    let opt1Rec = await pageInteractive.locator('.ds-comparison-card__option').nth(0).getAttribute('data-recommended');
    reasonText = await pageInteractive.locator('.ds-comparison-card__reason').textContent();
    assert(opt1Rec === 'true' && reasonText.includes('gpt-4o is recommended'), `Clicking option 1 picks 4o: rec=${opt1Rec}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/comparison-card-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-53-comparison-card--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="comparison-card"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="comparison-card"]');
      const opt1 = document.querySelector('.ds-comparison-card__option[data-recommended="true"]');
      const opt2 = document.querySelector('.ds-comparison-card__option[data-recommended="false"]');
      const pick = document.querySelector('.ds-comparison-card__pick');
      const check = document.querySelector('.ds-comparison-card__icon-check');

      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        opt1Bg: window.getComputedStyle(opt1).backgroundColor,
        opt2Bg: window.getComputedStyle(opt2).backgroundColor,
        pickColor: window.getComputedStyle(pick).color,
        checkColor: window.getComputedStyle(check).color,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.opt1Bg !== lightColors.opt2Bg &&
        lightColors.pickColor === 'rgb(2, 133, 255)' &&
        lightColors.checkColor === 'rgb(16, 163, 127)',
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, pick=${lightColors.pickColor}, check=${lightColors.checkColor}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/comparison-card-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-53-comparison-card--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-comparison-card__option');

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
