import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 013 FEEDBACK DIALOG ---');
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
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-13-feedback-dialog--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-fb-target [data-slot="feedback-dialog"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/feedback-dialog-default-dark.png` });

    const dialogData = await pageDark.locator('.ds-fb-target [data-slot="feedback-dialog"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const iconBadge = el.querySelector('.ds-feedback-dialog__icon-badge');
      const badgeS = iconBadge ? window.getComputedStyle(iconBadge) : {};
      const badgeRect = iconBadge ? iconBadge.getBoundingClientRect() : {};
      const badgeSvg = iconBadge ? iconBadge.querySelector('svg') : null;
      const badgeSvgRect = badgeSvg ? badgeSvg.getBoundingClientRect() : {};

      const title = el.querySelector('.ds-feedback-dialog__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const optionalBadge = el.querySelector('.ds-feedback-dialog__header .font-mono');
      const optS = optionalBadge ? window.getComputedStyle(optionalBadge) : {};

      const chips = Array.from(el.querySelectorAll('.ds-feedback-dialog__chip'));
      const firstChip = chips[0];
      const chipS = firstChip ? window.getComputedStyle(firstChip) : {};

      const textarea = el.querySelector('textarea');
      const textS = textarea ? window.getComputedStyle(textarea) : {};

      const submitBtn = el.querySelector('.ds-feedback-dialog__submit');
      const submitS = submitBtn ? window.getComputedStyle(submitBtn) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        cardRadius: s.borderRadius,
        cardPadding: s.padding,
        cardGap: s.gap,
        badgeWidth: Math.round(badgeRect.width),
        badgeHeight: Math.round(badgeRect.height),
        badgeRadius: badgeS.borderRadius,
        badgeSvgWidth: Math.round(badgeSvgRect.width),
        badgeSvgHeight: Math.round(badgeSvgRect.height),
        titleFontSize: titleS.fontSize,
        titleFontWeight: titleS.fontWeight,
        titleText: title ? title.textContent.trim() : null,
        optFontSize: optS.fontSize,
        optFontWeight: optS.fontWeight,
        optFontFamily: optS.fontFamily,
        chipsCount: chips.length,
        chipRadius: chipS.borderRadius,
        chipPadding: chipS.padding,
        chipFontSize: chipS.fontSize,
        chipFontWeight: chipS.fontWeight,
        textareaRadius: textS.borderRadius,
        textareaPadding: textS.padding,
        textareaFontSize: textS.fontSize,
        textareaFontWeight: textS.fontWeight,
        textareaResize: textS.resize,
        submitHeight: parseFloat(submitS.height),
        submitRadius: submitS.borderRadius,
        submitFontSize: submitS.fontSize,
        submitFontWeight: submitS.fontWeight,
      };
    });

    results.measurements.defaultDark = dialogData;
    assert('Data Slot Attribute', dialogData.slot === 'feedback-dialog', `data-slot: ${dialogData.slot}`);
    assert('Container Max Width (384px)', dialogData.maxWidth === '384px', `max-width: ${dialogData.maxWidth}`);
    assert('Card Radius (20px)', dialogData.cardRadius === '20px', `radius: ${dialogData.cardRadius}`);
    assert('Card Padding (16px)', dialogData.cardPadding === '16px', `padding: ${dialogData.cardPadding}`);
    assert('Icon Badge Dimensions (28x28px, 8px radius)', dialogData.badgeWidth === 28 && dialogData.badgeHeight === 28 && dialogData.badgeRadius === '8px', `Badge: ${dialogData.badgeWidth}x${dialogData.badgeHeight}px, radius: ${dialogData.badgeRadius}`);
    assert('Icon Badge SVG Dimensions (14x14px)', dialogData.badgeSvgWidth === 14 && dialogData.badgeSvgHeight === 14, `SVG: ${dialogData.badgeSvgWidth}x${dialogData.badgeSvgHeight}px`);
    assert('Title Typography (13.5px / 500)', dialogData.titleFontSize === '13.5px' && dialogData.titleFontWeight === '500' && dialogData.titleText === 'What went wrong?', `Title: ${dialogData.titleFontSize} / ${dialogData.titleFontWeight}`);
    assert('Optional Badge Strict 400 Mono (11px)', dialogData.optFontSize === '11px' && dialogData.optFontWeight === '400' && dialogData.optFontFamily.includes('mono'), `Optional: ${dialogData.optFontSize} / ${dialogData.optFontWeight} / ${dialogData.optFontFamily}`);
    assert('Reason Chips Count (4)', dialogData.chipsCount === 4, `Count: ${dialogData.chipsCount}`);
    assert('Chip Full Pill Radius (9999px)', dialogData.chipRadius === '9999px' || dialogData.chipRadius === '50%', `radius: ${dialogData.chipRadius}`);
    assert('Chip Padding (4px 10px)', dialogData.chipPadding === '4px 10px', `padding: ${dialogData.chipPadding}`);
    assert('Chip Strict 400 Typography (12px)', dialogData.chipFontSize === '12px' && dialogData.chipFontWeight === '400', `Chip: ${dialogData.chipFontSize} / ${dialogData.chipFontWeight}`);
    assert('Textarea Radius (12px)', dialogData.textareaRadius === '12px', `radius: ${dialogData.textareaRadius}`);
    assert('Textarea Padding (8px 12px)', dialogData.textareaPadding === '8px 12px', `padding: ${dialogData.textareaPadding}`);
    assert('Textarea Strict 400 Typography (12px)', dialogData.textareaFontSize === '12px' && dialogData.textareaFontWeight === '400', `Textarea: ${dialogData.textareaFontSize} / ${dialogData.textareaFontWeight}`);
    assert('Textarea Resize Disabled', dialogData.textareaResize === 'none', `resize: ${dialogData.textareaResize}`);
    assert('Submit Button 32px Compact Pill', Math.round(dialogData.submitHeight) === 32 && (dialogData.submitRadius === '9999px' || dialogData.submitRadius === '50%'), `Submit: height ${dialogData.submitHeight}px, radius: ${dialogData.submitRadius}`);
    assert('Submit Button Typography (12px / 500)', dialogData.submitFontSize === '12px' && dialogData.submitFontWeight === '500', `Submit typography: ${dialogData.submitFontSize} / ${dialogData.submitFontWeight}`);

    // 2. Interactive Selection & Submit Simulation
    console.log('\n[2/6] Testing Interactive Chips Toggle & Submit Transition...');
    // Click Chip 1 ("Not factual")
    await pageDark.click('.ds-fb-target [data-reason="Not factual"]');
    const chip1Active = await pageDark.locator('.ds-fb-target [data-reason="Not factual"]').getAttribute('aria-pressed');
    assert('Click Reason Toggles aria-pressed to true', chip1Active === 'true', `aria-pressed: ${chip1Active}`);

    // Click Chip 3 ("Too long")
    await pageDark.click('.ds-fb-target [data-reason="Too long"]');
    const chip3Active = await pageDark.locator('.ds-fb-target [data-reason="Too long"]').getAttribute('aria-pressed');
    assert('Multi-Select Second Reason', chip3Active === 'true', `aria-pressed: ${chip3Active}`);

    // Fill note and submit
    await pageDark.fill('.ds-fb-target textarea', 'Model hallucinated package name.');
    await pageDark.click('.ds-fb-target .ds-feedback-dialog__submit');
    await pageDark.waitForSelector('.ds-fb-target div[role="status"]:not(.sr-only)');

    const sentData = await pageDark.locator('.ds-fb-target [data-slot="feedback-dialog"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const statusDiv = el.querySelector('div[role="status"]:not(.sr-only)');
      const checkSvg = statusDiv ? statusDiv.querySelector('svg') : null;
      const checkRect = checkSvg ? checkSvg.getBoundingClientRect() : {};
      return {
        flexDirection: s.flexDirection,
        alignItems: s.alignItems,
        text: statusDiv ? statusDiv.textContent.trim() : null,
        checkWidth: Math.round(checkRect.width),
        checkHeight: Math.round(checkRect.height),
      };
    });
    assert('Submit Transitions to Row Layout', sentData.flexDirection === 'row' && sentData.alignItems === 'center', `flex-direction: ${sentData.flexDirection}, align-items: ${sentData.alignItems}`);
    assert('Sent State Displays Thank You Message', sentData.text === 'Thanks. That helps us tune the model.', `Text: ${sentData.text}`);
    assert('Sent State Check Icon Dimensions (16x16px)', sentData.checkWidth === 16 && sentData.checkHeight === 16, `SVG: ${sentData.checkWidth}x${sentData.checkHeight}px`);

    // 3. Light Mode: Default Story
    console.log('\n[3/6] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-13-feedback-dialog--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-fb-target [data-slot="feedback-dialog"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/feedback-dialog-default-light.png` });

    // 4. Filled In Story (Dark Mode)
    console.log('\n[4/6] Auditing Filled In Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-13-feedback-dialog--filled-in&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="feedback-dialog"]');
    const stageFilledIn = await pageDark.locator('.ds-story-stage').first();
    await stageFilledIn.screenshot({ path: `${ARTIFACT_DIR}/feedback-dialog-filled-in-dark.png` });

    const filledInData = await pageDark.locator('[data-slot="feedback-dialog"]').evaluate((el) => {
      const activeChips = Array.from(el.querySelectorAll('.ds-feedback-dialog__chip[aria-pressed="true"]')).map((c) => c.textContent.trim());
      const noteVal = el.querySelector('textarea')?.value;
      return { activeChips, noteVal };
    });
    assert('Filled In Has 2 Active Chips', filledInData.activeChips.length === 2 && filledInData.activeChips[0] === 'Not factual' && filledInData.activeChips[1] === 'Too long', `Active: ${JSON.stringify(filledInData.activeChips)}`);
    assert('Filled In Has Pre-filled Note', filledInData.noteVal.includes('useThreadRuntime'), `Note: ${filledInData.noteVal}`);

    // 5. Sent & Read Only Stories
    console.log('\n[5/6] Auditing Sent & Read Only Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-13-feedback-dialog--sent&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="feedback-dialog"]');
    const stageSent = await pageDark.locator('.ds-story-stage').first();
    await stageSent.screenshot({ path: `${ARTIFACT_DIR}/feedback-dialog-sent-dark.png` });

    // Read Only Story
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-13-feedback-dialog--read-only&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="feedback-dialog"]');
    const stageReadOnly = await pageDark.locator('.ds-story-stage').first();
    await stageReadOnly.screenshot({ path: `${ARTIFACT_DIR}/feedback-dialog-read-only-dark.png` });

    const readOnlyData = await pageDark.locator('[data-slot="feedback-dialog"]').evaluate((el) => {
      const spans = el.querySelectorAll('span.ds-feedback-dialog__chip');
      const submit = el.querySelector('.ds-feedback-dialog__submit');
      return {
        chipsAreSpans: spans.length === 4,
        submitMissing: !submit,
      };
    });
    assert('Read Only Story Uses Disabled Span Chips & Omits Submit', readOnlyData.chipsAreSpans && readOnlyData.submitMissing, `spans: ${readOnlyData.chipsAreSpans}, no submit: ${readOnlyData.submitMissing}`);

    // 6. Reduced Motion Safety
    console.log('\n[6/6] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const chipTransition = await pageDark.locator('.ds-feedback-dialog__chip').first().evaluate((el) => window.getComputedStyle(el).transition);
    assert('Reduced Motion Disables Chip Transitions', chipTransition === 'none', `Transition: ${chipTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/013_feedback_dialog_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
