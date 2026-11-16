import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 010 ERROR STATE ---');
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
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-10-error-state--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-error-target [data-slot="error-state"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/error-state-default-dark.png` });

    const alertData = await pageDark.locator('.ds-error-target [data-slot="error-state"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const icon = el.querySelector('svg.lucide-circle-alert');
      const iconRect = icon ? icon.getBoundingClientRect() : {};
      const title = el.querySelector('p.font-medium');
      const titleS = title ? window.getComputedStyle(title) : {};
      const detail = el.querySelector('p.text-\\[13px\\]');
      const detailS = detail ? window.getComputedStyle(detail) : {};
      const containerRect = el.getBoundingClientRect();
      const retryBtn = el.querySelector('button');
      const retryS = retryBtn ? window.getComputedStyle(retryBtn) : {};
      const retryRect = retryBtn ? retryBtn.getBoundingClientRect() : {};
      const retrySvg = retryBtn ? retryBtn.querySelector('svg') : null;
      const retrySvgRect = retrySvg ? retrySvg.getBoundingClientRect() : {};
      const isRightAligned = retryBtn ? Math.abs((containerRect.right - parseFloat(s.paddingRight)) - retryRect.right) <= 2 : false;

      return {
        slot: el.getAttribute('data-slot'),
        role: el.getAttribute('role'),
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        gap: s.gap,
        iconWidth: iconRect.width,
        iconHeight: iconRect.height,
        titleFontSize: titleS.fontSize,
        titleFontWeight: titleS.fontWeight,
        detailFontSize: detailS.fontSize,
        detailFontWeight: detailS.fontWeight,
        isRightAligned,
        retryRadius: retryS.borderRadius,
        retryPadding: retryS.padding,
        retryFontSize: retryS.fontSize,
        retryFontWeight: retryS.fontWeight,
        retrySvgWidth: retrySvgRect.width,
        retrySvgHeight: retrySvgRect.height,
      };
    });

    results.measurements.defaultDark = alertData;
    assert('Data Slot Attribute', alertData.slot === 'error-state', `data-slot: ${alertData.slot}`);
    assert('Alert ARIA Role', alertData.role === 'alert', `role: ${alertData.role}`);
    assert('Container Max Width', alertData.maxWidth === '384px', `max-width: ${alertData.maxWidth}`);
    assert('Container Border Radius (16px)', alertData.borderRadius === '16px', `radius: ${alertData.borderRadius}`);
    assert('Container Padding (12px 16px)', alertData.padding === '12px 16px', `padding: ${alertData.padding}`);
    assert('Circle Alert Icon Dimensions (16x16px)', Math.round(alertData.iconWidth) === 16 && Math.round(alertData.iconHeight) === 16, `Icon: ${alertData.iconWidth}x${alertData.iconHeight}px`);
    assert('Title Typography', alertData.titleFontSize === '14px' && alertData.titleFontWeight === '500', `Title: ${alertData.titleFontSize} / ${alertData.titleFontWeight}`);
    assert('Detail Strict 400 Typography', alertData.detailFontSize === '13px' && alertData.detailFontWeight === '400', `Detail: ${alertData.detailFontSize} / ${alertData.detailFontWeight}`);
    assert('Retry Button Right Aligned (ms-auto)', alertData.isRightAligned, `Right-aligned to container padding: ${alertData.isRightAligned}`);
    assert('Retry Button Pill Radius', alertData.retryRadius === '9999px', `radius: ${alertData.retryRadius}`);
    assert('Retry Button Padding', alertData.retryPadding === '4px 12px', `padding: ${alertData.retryPadding}`);
    assert('Retry Icon Dimensions (12x12px)', Math.round(alertData.retrySvgWidth) === 12 && Math.round(alertData.retrySvgHeight) === 12, `SVG: ${alertData.retrySvgWidth}x${alertData.retrySvgHeight}px`);

    // Interactive retry simulation
    console.log('\n[2/5] Testing Interactive Retry Simulation...');
    await pageDark.click('.ds-error-target button');
    await pageDark.waitForSelector('.ds-error-target [role="status"]');
    const retryingRole = await pageDark.locator('.ds-error-target [data-slot="error-state"]').getAttribute('role');
    const retryingText = await pageDark.locator('.ds-error-target [data-slot="error-state"] span.shimmer').textContent();
    assert('Click Retry -> Transitions to Status ("Retrying")', retryingRole === 'status' && retryingText === 'Retrying', `Role: ${retryingRole}, Text: ${retryingText}`);

    // Wait for recovery back to alert
    await pageDark.waitForTimeout(2200);
    const recoveredRole = await pageDark.locator('.ds-error-target [data-slot="error-state"]').getAttribute('role');
    assert('Simulated Run Recovers to Alert', recoveredRole === 'alert', `Recovered role: ${recoveredRole}`);

    // Light Mode Default Story
    console.log('\n[3/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-10-error-state--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-error-target [data-slot="error-state"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/error-state-default-light.png` });

    // 4. Retrying & Long Detail Stories
    console.log('\n[4/5] Auditing Retrying & Long Detail Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-10-error-state--retrying&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[role="status"]');
    const stageRetrying = await pageDark.locator('.ds-story-stage').first();
    await stageRetrying.screenshot({ path: `${ARTIFACT_DIR}/error-state-retrying-dark.png` });

    const retryingData = await pageDark.locator('[role="status"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const icon = el.querySelector('svg');
      const iconS = icon ? window.getComputedStyle(icon) : {};
      const label = el.querySelector('span.shimmer');
      const labelS = label ? window.getComputedStyle(label) : {};

      return {
        bg: s.backgroundColor,
        padding: s.padding,
        iconWidth: parseFloat(iconS.width),
        iconHeight: parseFloat(iconS.height),
        iconAnim: iconS.animationName,
        labelFontSize: labelS.fontSize,
        labelFontWeight: labelS.fontWeight,
      };
    });
    assert('Retrying State Unpadded Transparent', retryingData.padding === '0px' && (retryingData.bg === 'rgba(0, 0, 0, 0)' || retryingData.bg === 'transparent'), `padding: ${retryingData.padding}, bg: ${retryingData.bg}`);
    assert('Retrying Icon Dimensions (14x14px)', Math.round(retryingData.iconWidth) === 14 && Math.round(retryingData.iconHeight) === 14, `Icon: ${retryingData.iconWidth}x${retryingData.iconHeight}px`);
    assert('Retrying Icon Spins', retryingData.iconAnim.includes('ds-spin'), `Anim: ${retryingData.iconAnim}`);
    assert('Retrying Label Strict 400 Rule', retryingData.labelFontSize === '14px' && retryingData.labelFontWeight === '400', `Label: ${retryingData.labelFontSize} / ${retryingData.labelFontWeight}`);

    // Long detail story
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-10-error-state--long-detail&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[role="alert"]');
    const stageLongDetail = await pageDark.locator('.ds-story-stage').first();
    await stageLongDetail.screenshot({ path: `${ARTIFACT_DIR}/error-state-long-detail-dark.png` });
    const isLongDetailRightAligned = await pageDark.locator('[role="alert"]').evaluate((el) => {
      const btn = el.querySelector('button');
      if (!btn) return false;
      const cRect = el.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      const pRight = parseFloat(window.getComputedStyle(el).paddingRight);
      return Math.abs((cRect.right - pRight) - bRect.right) <= 2;
    });
    assert('Long Detail Keeps Retry Button Right-Aligned', isLongDetailRightAligned, `Right-aligned to container padding: ${isLongDetailRightAligned}`);

    // 5. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmSpin = await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-10-error-state--retrying&viewMode=story`);
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const spinAnim = await pageDark.locator('[role="status"] svg').evaluate((el) => window.getComputedStyle(el).animationName);
    assert('Reduced Motion Disables Spin Animation', spinAnim === 'none', `Animation: ${spinAnim}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/010_error_state_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
