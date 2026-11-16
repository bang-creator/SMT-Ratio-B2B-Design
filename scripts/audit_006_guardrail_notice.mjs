import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 006 GUARDRAIL NOTICE ---');
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
    console.log('\n[1/4] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-06-guardrail-notice--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-guardrail-notice');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/guardrail-notice-default-dark.png` });

    const noticeData = await pageDark.locator('.ds-guardrail-notice').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const icon = el.querySelector('.ds-guardrail-notice__icon');
      const iconS = icon ? window.getComputedStyle(icon) : {};
      const iconSvg = icon ? icon.querySelector('svg') : null;
      const svgRect = iconSvg ? iconSvg.getBoundingClientRect() : {};
      const title = el.querySelector('.ds-guardrail-notice__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const policy = el.querySelector('.ds-guardrail-notice__policy');
      const policyS = policy ? window.getComputedStyle(policy) : {};
      const exp = el.querySelector('.ds-guardrail-notice__explanation');
      const expS = exp ? window.getComputedStyle(exp) : {};
      const altsSec = el.querySelector('.ds-guardrail-notice__alternatives');
      const secTitle = altsSec ? altsSec.querySelector('.ds-guardrail-notice__section-title') : null;
      const secTitleS = secTitle ? window.getComputedStyle(secTitle) : {};
      const buttons = altsSec ? altsSec.querySelectorAll('.ds-guardrail-notice__alt-btn') : [];
      const btn0S = buttons[0] ? window.getComputedStyle(buttons[0]) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        padding: s.padding,
        gap: s.gap,
        borderRadius: s.borderRadius,
        bg: s.backgroundColor,
        border: s.border,
        iconWidth: iconS.width,
        iconHeight: iconS.height,
        iconRadius: iconS.borderRadius,
        iconColor: iconS.color,
        svgWidth: svgRect.width,
        svgHeight: svgRect.height,
        titleText: title ? title.textContent : null,
        titleFontSize: titleS.fontSize,
        titleFontWeight: titleS.fontWeight,
        policyText: policy ? policy.textContent : null,
        policyFontFamily: policyS.fontFamily,
        policyFontSize: policyS.fontSize,
        policyFontWeight: policyS.fontWeight,
        expFontSize: expS.fontSize,
        expFontWeight: expS.fontWeight,
        expLineHeight: expS.lineHeight,
        hasAlternatives: !!altsSec,
        secTitleFontFamily: secTitleS.fontFamily,
        secTitleFontSize: secTitleS.fontSize,
        secTitleFontWeight: secTitleS.fontWeight,
        altCount: buttons.length,
        altFontSize: btn0S.fontSize,
        altFontWeight: btn0S.fontWeight,
        altBorderRadius: btn0S.borderRadius,
        altPadding: btn0S.padding,
      };
    });

    results.measurements.defaultDark = noticeData;
    assert('Data Slot Attribute', noticeData.slot === 'guardrail-notice', `data-slot: ${noticeData.slot}`);
    assert('Container Max Width', noticeData.maxWidth === '384px', `max-width: ${noticeData.maxWidth}`);
    assert('Container Border Radius (20px)', noticeData.borderRadius === '20px', `radius: ${noticeData.borderRadius}`);
    assert('Container Padding (16px)', noticeData.padding === '16px', `padding: ${noticeData.padding}`);
    assert('Container Gap (12px)', noticeData.gap === '12px', `gap: ${noticeData.gap}`);
    assert('Shield Icon Badge (28x28px, 8px radius)', noticeData.iconWidth === '28px' && noticeData.iconHeight === '28px' && noticeData.iconRadius === '8px', `Badge: ${noticeData.iconWidth}x${noticeData.iconHeight}, radius: ${noticeData.iconRadius}`);
    assert('Shield SVG Dimensions (14x14px)', Math.round(noticeData.svgWidth) === 14 && Math.round(noticeData.svgHeight) === 14, `SVG: ${noticeData.svgWidth}x${noticeData.svgHeight}px`);
    assert('Title Typography', noticeData.titleFontSize === '13.5px' && noticeData.titleFontWeight === '500', `Title: ${noticeData.titleFontSize} / ${noticeData.titleFontWeight}`);
    assert('Policy Mono 400 Typography', noticeData.policyFontSize === '11px' && noticeData.policyFontWeight === '400', `Policy: ${noticeData.policyFontSize} / ${noticeData.policyFontWeight}`);
    assert('Explanation 400 Typography', noticeData.expFontSize === '12px' && noticeData.expFontWeight === '400', `Exp: ${noticeData.expFontSize} / ${noticeData.expFontWeight}`);
    assert('Explanation Line Height (1.625)', Math.abs(parseFloat(noticeData.expLineHeight) - 19.5) < 1, `Line height: ${noticeData.expLineHeight}`);
    assert('Section Title "try instead" Mono 400', noticeData.secTitleFontSize === '11px' && noticeData.secTitleFontWeight === '400', `Section title: ${noticeData.secTitleFontSize} / ${noticeData.secTitleFontWeight}`);
    assert('Alternatives Count (3 items)', noticeData.altCount === 3, `Count: ${noticeData.altCount}`);
    assert('Alternative Button Strict 400 Rule', noticeData.altFontSize === '13px' && noticeData.altFontWeight === '400', `Button font: ${noticeData.altFontSize} / ${noticeData.altFontWeight}`);
    assert('Alternative Button Geometry (8px radius, 4px 6px pad)', noticeData.altBorderRadius === '8px' && noticeData.altPadding === '4px 6px', `Radius: ${noticeData.altBorderRadius}, pad: ${noticeData.altPadding}`);

    // 2. Light Mode: Default Story
    console.log('\n[2/4] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-06-guardrail-notice--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-guardrail-notice');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/guardrail-notice-default-light.png` });

    // 3. No Alternative & Long Notice Stories
    console.log('\n[3/4] Auditing State Variants (No Alternative & Long Notice)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-06-guardrail-notice--no-alternative&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-guardrail-notice');
    const stageNoAlt = await pageDark.locator('.ds-story-stage').first();
    await stageNoAlt.screenshot({ path: `${ARTIFACT_DIR}/guardrail-notice-no-alternative-dark.png` });
    const noAltCount = await pageDark.locator('.ds-guardrail-notice__alternatives').count();
    const noAltPolicy = await pageDark.locator('.ds-guardrail-notice__policy').textContent();
    assert('No Alternative Omits Section', noAltCount === 0 && noAltPolicy === 'privacy', `Alts count: ${noAltCount}, Policy: ${noAltPolicy}`);

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-06-guardrail-notice--long-notice&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-guardrail-notice');
    const stageLongNotice = await pageDark.locator('.ds-story-stage').first();
    await stageLongNotice.screenshot({ path: `${ARTIFACT_DIR}/guardrail-notice-long-notice-dark.png` });
    const longNoticeData = await pageDark.locator('.ds-guardrail-notice').first().evaluate((el) => {
      const title = el.querySelector('.ds-guardrail-notice__title');
      const buttons = el.querySelectorAll('.ds-guardrail-notice__alt-btn');
      return {
        isTruncated: title.scrollWidth > title.clientWidth,
        btnCount: buttons.length,
        policy: el.querySelector('.ds-guardrail-notice__policy').textContent,
      };
    });
    assert('Long Title Truncates with Ellipsis', longNoticeData.isTruncated, `scrollWidth > clientWidth verified`);
    assert('Long Notice Has 4 Stacked Alternatives', longNoticeData.btnCount === 4 && longNoticeData.policy === 'security', `Buttons: ${longNoticeData.btnCount}, policy: ${longNoticeData.policy}`);

    // 4. Reduced Motion Safety
    console.log('\n[4/4] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmTransition = await pageDark.locator('.ds-guardrail-notice__alt-btn').first().evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });
    assert('Reduced Motion Disables Alt Button Transition', rmTransition === '0s', `Transition duration: ${rmTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/006_guardrail_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
