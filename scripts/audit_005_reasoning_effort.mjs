import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 005 REASONING EFFORT ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-05-reasoning-effort--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-reasoning-effort');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/reasoning-effort-default-dark.png` });

    const effortData = await pageDark.locator('.ds-reasoning-effort').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const title = el.querySelector('.ds-reasoning-effort__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const stats = el.querySelector('.ds-reasoning-effort__stats');
      const statsS = stats ? window.getComputedStyle(stats) : {};
      const pill = el.querySelector('.ds-reasoning-effort__pill');
      const pillS = pill ? window.getComputedStyle(pill) : {};
      const buttons = el.querySelectorAll('.ds-reasoning-effort__btn');
      const activeBtn = el.querySelector('.ds-reasoning-effort__btn[aria-pressed="true"]');
      const activeBtnS = activeBtn ? window.getComputedStyle(activeBtn) : {};
      const track = el.querySelector('.ds-reasoning-effort__track');
      const trackS = track ? window.getComputedStyle(track) : {};
      const fill = el.querySelector('.ds-reasoning-effort__fill');
      const fillS = fill ? window.getComputedStyle(fill) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        titleText: title ? title.textContent : null,
        titleFontSize: titleS.fontSize,
        titleFontWeight: titleS.fontWeight,
        statsText: stats ? stats.textContent : null,
        statsFontFamily: statsS.fontFamily,
        statsFontSize: statsS.fontSize,
        statsFontWeight: statsS.fontWeight,
        statsTabularNums: statsS.fontVariantNumeric,
        pillRadius: pillS.borderRadius,
        pillPadding: pillS.padding,
        pillGap: pillS.gap,
        btnCount: buttons.length,
        activeKey: activeBtn ? activeBtn.getAttribute('data-key') : null,
        activeBg: activeBtnS.backgroundColor,
        trackRole: track ? track.getAttribute('role') : null,
        trackHeight: trackS.height,
        trackRadius: trackS.borderRadius,
        fillBg: fillS.backgroundColor,
        fillTransition: fillS.transitionProperty,
      };
    });

    results.measurements.defaultDark = effortData;
    assert('Data Slot Attribute', effortData.slot === 'reasoning-effort', `data-slot: ${effortData.slot}`);
    assert('Container Max Width', effortData.maxWidth === '384px', `max-width: ${effortData.maxWidth}`);
    assert('Title Typography', effortData.titleText === 'Thinking' && effortData.titleFontSize === '13.5px' && effortData.titleFontWeight === '500', `Title: "${effortData.titleText}" ${effortData.titleFontSize} ${effortData.titleFontWeight}`);
    assert('Stats Mono 400 Tabular', effortData.statsFontSize === '11px' && effortData.statsFontWeight === '400' && effortData.statsTabularNums.includes('tabular-nums'), `Stats: ${effortData.statsFontSize} weight ${effortData.statsFontWeight} tabular-nums: ${effortData.statsTabularNums}`);
    assert('Initial Budget Text', effortData.statsText === '3,412 / 8,000', `Stats text: ${effortData.statsText}`);
    assert('Pill Container Geometry', effortData.pillRadius === '9999px' && effortData.pillPadding === '2px' && effortData.pillGap === '2px', `Pill radius: ${effortData.pillRadius}, pad: ${effortData.pillPadding}, gap: ${effortData.pillGap}`);
    assert('Level Count (4 items)', effortData.btnCount === 4, `Button count: ${effortData.btnCount}`);
    assert('Default Selected Level (Medium)', effortData.activeKey === 'medium', `Selected: ${effortData.activeKey}`);
    assert('Progress Bar Track Role', effortData.trackRole === 'progressbar', `role: ${effortData.trackRole}`);
    assert('Progress Bar Height (3px)', effortData.trackHeight === '3px', `Track height: ${effortData.trackHeight}`);
    assert('Fill Blue Accent Color', effortData.fillBg === 'rgb(2, 133, 255)', `Fill bg: ${effortData.fillBg}`);
    assert('Fill Width Transition', effortData.fillTransition.includes('width'), `Transition: ${effortData.fillTransition}`);

    // Interactive level click test
    console.log('\n[2/5] Testing Interactive Level Switching...');
    await pageDark.click('.ds-reasoning-effort__btn[data-key="low"]');
    const lowStats = await pageDark.locator('.ds-reasoning-effort__stats').textContent();
    const lowActive = await pageDark.locator('.ds-reasoning-effort__btn[aria-pressed="true"]').getAttribute('data-key');
    assert('Click "Low" Switches State', lowActive === 'low' && lowStats === '1,200 / 2,000', `Active: ${lowActive}, Stats: ${lowStats}`);

    await pageDark.click('.ds-reasoning-effort__btn[data-key="high"]');
    const highStats = await pageDark.locator('.ds-reasoning-effort__stats').textContent();
    const highActive = await pageDark.locator('.ds-reasoning-effort__btn[aria-pressed="true"]').getAttribute('data-key');
    assert('Click "High" Switches State', highActive === 'high' && highStats === '14,500 / 24,000', `Active: ${highActive}, Stats: ${highStats}`);

    await pageDark.click('.ds-reasoning-effort__btn[data-key="max"]');
    const maxStats = await pageDark.locator('.ds-reasoning-effort__stats').textContent();
    const maxActive = await pageDark.locator('.ds-reasoning-effort__btn[aria-pressed="true"]').getAttribute('data-key');
    assert('Click "Max" Switches State', maxActive === 'max' && maxStats === '28,000 / 64,000', `Active: ${maxActive}, Stats: ${maxStats}`);

    // 2. Light Mode: Default Story
    console.log('\n[3/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-05-reasoning-effort--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-reasoning-effort');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/reasoning-effort-default-light.png` });

    // 3. Not Started & Budget Spent Stories
    console.log('\n[4/5] Auditing State Variants (Not Started, Budget Spent, Read Only)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-05-reasoning-effort--not-started&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-reasoning-effort');
    const stageNotStarted = await pageDark.locator('.ds-story-stage').first();
    await stageNotStarted.screenshot({ path: `${ARTIFACT_DIR}/reasoning-effort-not-started-dark.png` });
    const notStartedStats = await pageDark.locator('.ds-reasoning-effort__stats').textContent();
    const notStartedVal = await pageDark.locator('.ds-reasoning-effort__track').getAttribute('aria-valuenow');
    assert('Not Started State (0%)', notStartedStats === '0 / 8,000' && notStartedVal === '0', `Stats: ${notStartedStats}, valuenow: ${notStartedVal}`);

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-05-reasoning-effort--budget-spent&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-reasoning-effort');
    const stageBudgetSpent = await pageDark.locator('.ds-story-stage').first();
    await stageBudgetSpent.screenshot({ path: `${ARTIFACT_DIR}/reasoning-effort-budget-spent-dark.png` });
    const spentStats = await pageDark.locator('.ds-reasoning-effort__stats').textContent();
    const spentVal = await pageDark.locator('.ds-reasoning-effort__track').getAttribute('aria-valuenow');
    assert('Budget Spent State (100%)', spentStats === '2,000 / 2,000' && spentVal === '100', `Stats: ${spentStats}, valuenow: ${spentVal}`);

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-05-reasoning-effort--read-only&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-reasoning-effort');
    const stageReadOnly = await pageDark.locator('.ds-story-stage').first();
    await stageReadOnly.screenshot({ path: `${ARTIFACT_DIR}/reasoning-effort-read-only-dark.png` });
    const readOnlyButtons = await pageDark.locator('.ds-reasoning-effort button').count();
    const readOnlySpans = await pageDark.locator('.ds-reasoning-effort span.ds-reasoning-effort__btn').count();
    assert('Read Only Uses Non-Interactive Spans', readOnlyButtons === 0 && readOnlySpans === 4, `Buttons: ${readOnlyButtons}, Spans: ${readOnlySpans}`);

    // 4. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmTransition = await pageDark.locator('.ds-reasoning-effort__fill').first().evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });
    assert('Reduced Motion Disables Fill Transition', rmTransition === '0s', `Transition duration: ${rmTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/005_reasoning_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
