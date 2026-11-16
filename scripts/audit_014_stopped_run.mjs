import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 014 STOPPED RUN ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const results = {
    checks: [],
    measurements: {},
    passed: 0,
    total: 0,
  };

  function assert(name, condition, details) {
    results.total++;
    if (condition) {
      results.passed++;
      results.checks.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}: ${details}`);
    } else {
      results.checks.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name}: ${details}`);
    }
  }

  try {
    // 1. Dark Mode: Default Story
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-14-stopped-run--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="stopped-run"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/stopped-run-default-dark.png` });

    const runData = await pageDark.locator('[data-slot="stopped-run"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const p = el.querySelector('p');
      const pS = p ? window.getComputedStyle(p) : {};
      const cursor = p ? p.querySelector('span[aria-hidden="true"]') : null;
      const curS = cursor ? window.getComputedStyle(cursor) : {};
      const curRect = cursor ? cursor.getBoundingClientRect() : {};

      const bar = el.querySelector('.flex.items-center.gap-2');
      const badge = el.querySelector('.ds-stopped-run__badge');
      const badgeS = badge ? window.getComputedStyle(badge) : {};
      const squareSvg = badge ? badge.querySelector('svg') : null;
      const squareSvgRect = squareSvg ? squareSvg.getBoundingClientRect() : {};

      const buttons = Array.from(el.querySelectorAll('button'));
      const continueBtn = buttons[0];
      const contS = continueBtn ? window.getComputedStyle(continueBtn) : {};
      const arrowSvg = continueBtn ? continueBtn.querySelector('svg') : null;
      const arrowSvgRect = arrowSvg ? arrowSvg.getBoundingClientRect() : {};

      const discardBtn = buttons[1];
      const discS = discardBtn ? window.getComputedStyle(discardBtn) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        textFontSize: pS.fontSize,
        textFontWeight: pS.fontWeight,
        cursorWidth: Math.round(curRect.width),
        cursorHeight: Math.round(curRect.height),
        cursorRadius: curS.borderRadius,
        cursorMarginLeft: curS.marginLeft,
        badgeRadius: badgeS.borderRadius,
        badgePadding: badgeS.padding,
        badgeFontSize: badgeS.fontSize,
        badgeFontWeight: badgeS.fontWeight,
        badgeFontFamily: badgeS.fontFamily,
        badgeText: badge ? badge.textContent.trim() : null,
        squareWidth: Math.round(squareSvgRect.width),
        squareHeight: Math.round(squareSvgRect.height),
        buttonsCount: buttons.length,
        continueHeight: parseFloat(contS.height),
        continueRadius: contS.borderRadius,
        continueFontSize: contS.fontSize,
        continueFontWeight: contS.fontWeight,
        continueMarginLeft: contS.marginLeft,
        arrowWidth: Math.round(arrowSvgRect.width),
        arrowHeight: Math.round(arrowSvgRect.height),
        discardHeight: parseFloat(discS.height),
        discardRadius: discS.borderRadius,
        discardFontSize: discS.fontSize,
        discardFontWeight: discS.fontWeight,
      };
    });

    results.measurements.defaultDark = runData;
    assert('Data Slot Attribute', runData.slot === 'stopped-run', `data-slot: ${runData.slot}`);
    assert('Container Max Width (384px)', runData.maxWidth === '384px', `max-width: ${runData.maxWidth}`);
    assert('Text Strict 400 Typography (13.5px)', runData.textFontSize === '13.5px' && runData.textFontWeight === '400', `Text: ${runData.textFontSize} / ${runData.textFontWeight}`);
    assert('Trailing Caret Dimensions (2px width)', runData.cursorWidth === 2 && runData.cursorRadius === '9999px', `Cursor: ${runData.cursorWidth}x${runData.cursorHeight}px, radius: ${runData.cursorRadius}`);
    assert('Badge Full Pill Radius (9999px)', runData.badgeRadius === '9999px' || runData.badgeRadius === '50%', `radius: ${runData.badgeRadius}`);
    assert('Badge Padding (4px 10px)', runData.badgePadding === '4px 10px', `padding: ${runData.badgePadding}`);
    assert('Badge Strict 400 Mono (11px)', runData.badgeFontSize === '11px' && runData.badgeFontWeight === '400' && runData.badgeFontFamily.includes('mono'), `Badge: ${runData.badgeFontSize} / ${runData.badgeFontWeight} / ${runData.badgeFontFamily}`);
    assert('Badge Text Content', runData.badgeText === 'stopped by you', `Text: ${runData.badgeText}`);
    assert('Square Icon Dimensions (10x10px)', runData.squareWidth === 10 && runData.squareHeight === 10, `Square SVG: ${runData.squareWidth}x${runData.squareHeight}px`);
    assert('Continue Button Compact Height (28px)', Math.round(runData.continueHeight) === 28 && (runData.continueRadius === '9999px' || runData.continueRadius === '50%'), `Continue: height ${runData.continueHeight}px, radius: ${runData.continueRadius}`);
    assert('Continue Button Typography (12px / 500)', runData.continueFontSize === '12px' && runData.continueFontWeight === '500', `Continue typography: ${runData.continueFontSize} / ${runData.continueFontWeight}`);
    assert('Continue Button Right-Aligned (ms-auto)', parseFloat(runData.continueMarginLeft) > 0, `margin-left: ${runData.continueMarginLeft}`);
    assert('Arrow Right SVG Dimensions (12x12px)', runData.arrowWidth === 12 && runData.arrowHeight === 12, `Arrow SVG: ${runData.arrowWidth}x${runData.arrowHeight}px`);
    assert('Discard Button Compact Height (28px)', Math.round(runData.discardHeight) === 28 && (runData.discardRadius === '9999px' || runData.discardRadius === '50%'), `Discard: height ${runData.discardHeight}px, radius: ${runData.discardRadius}`);
    assert('Discard Button Typography (12px / 500)', runData.discardFontSize === '12px' && runData.discardFontWeight === '500', `Discard typography: ${runData.discardFontSize} / ${runData.discardFontWeight}`);

    // 2. Light Mode: Default Story
    console.log('\n[2/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-14-stopped-run--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('[data-slot="stopped-run"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/stopped-run-default-light.png` });

    // 3. No Output Story
    console.log('\n[3/5] Auditing No Output Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-14-stopped-run--no-output&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="stopped-run"]');
    const stageNoOutput = await pageDark.locator('.ds-story-stage').first();
    await stageNoOutput.screenshot({ path: `${ARTIFACT_DIR}/stopped-run-no-output-dark.png` });

    const noOutputHasParagraph = await pageDark.locator('[data-slot="stopped-run"] p').count();
    const noOutputHasBadge = await pageDark.locator('[data-slot="stopped-run"] .ds-stopped-run__badge').count();
    assert('No Output Omits Paragraph While Keeping Reason Badge', noOutputHasParagraph === 0 && noOutputHasBadge === 1, `Paragraph: ${noOutputHasParagraph}, Badge: ${noOutputHasBadge}`);

    // 4. Token Limit & Long Partial Stories
    console.log('\n[4/5] Auditing Token Limit and Long Partial Stories...');
    // Token Limit
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-14-stopped-run--token-limit&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="stopped-run"]');
    const stageTokenLimit = await pageDark.locator('.ds-story-stage').first();
    await stageTokenLimit.screenshot({ path: `${ARTIFACT_DIR}/stopped-run-token-limit-dark.png` });

    const tokenLimitBadgeText = await pageDark.locator('.ds-stopped-run__badge').textContent();
    assert('Token Limit Displays "hit 4,096 tokens"', tokenLimitBadgeText.trim() === 'hit 4,096 tokens', `Text: ${tokenLimitBadgeText.trim()}`);

    // Long Partial
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-14-stopped-run--long-partial&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="stopped-run"]');
    const stageLongPartial = await pageDark.locator('.ds-story-stage').first();
    await stageLongPartial.screenshot({ path: `${ARTIFACT_DIR}/stopped-run-long-partial-dark.png` });

    const longPartialMaxWidth = await pageDark.locator('[data-slot="stopped-run"]').evaluate((el) => window.getComputedStyle(el).maxWidth);
    assert('Long Partial Preserves 384px Max Width', longPartialMaxWidth === '384px', `max-width: ${longPartialMaxWidth}`);

    // 5. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const contTransition = await pageDark.locator('[data-slot="stopped-run"] button').first().evaluate((el) => window.getComputedStyle(el).transition);
    assert('Reduced Motion Disables Button Transitions', contTransition === 'none', `Transition: ${contTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/014_stopped_run_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
