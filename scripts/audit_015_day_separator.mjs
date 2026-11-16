import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 015 DAY SEPARATOR ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-15-day-separator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="day-separator"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/day-separator-default-dark.png` });

    const sepData = await pageDark.locator('[data-slot="day-separator"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const dividers = Array.from(el.querySelectorAll('.ds-day-separator__divider'));
      const firstDiv = dividers[0];
      const divS = firstDiv ? window.getComputedStyle(firstDiv) : {};
      const firstLine = firstDiv ? firstDiv.querySelector('.ds-day-separator__line') : null;
      const lineS = firstLine ? window.getComputedStyle(firstLine) : {};
      const firstLabel = firstDiv ? firstDiv.querySelector('.ds-day-separator__label') : null;
      const labelS = firstLabel ? window.getComputedStyle(firstLabel) : {};

      const userTurn = el.querySelector('.ds-day-separator__turn--user');
      const userTurnS = userTurn ? window.getComputedStyle(userTurn) : {};
      const userBubble = userTurn ? userTurn.querySelector('.ds-day-separator__bubble') : null;
      const userBubbleS = userBubble ? window.getComputedStyle(userBubble) : {};

      const asstTurn = el.querySelector('.ds-day-separator__turn:not(.ds-day-separator__turn--user)');
      const asstBubble = asstTurn ? asstTurn.querySelector('.ds-day-separator__bubble') : null;
      const asstBubbleS = asstBubble ? window.getComputedStyle(asstBubble) : {};

      const timeSpan = userTurn ? userTurn.querySelector('.ds-day-separator__time') : null;
      const timeS = timeSpan ? window.getComputedStyle(timeSpan) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        dividersCount: dividers.length,
        dividerGap: divS.gap,
        lineHeight: lineS.height,
        labelFontSize: labelS.fontSize,
        labelFontWeight: labelS.fontWeight,
        labelFontFamily: labelS.fontFamily,
        userTurnDirection: userTurnS.flexDirection,
        userBubbleRadius: userBubbleS.borderRadius,
        userBubblePadding: userBubbleS.padding,
        userBubbleFontSize: userBubbleS.fontSize,
        userBubbleFontWeight: userBubbleS.fontWeight,
        asstBubbleFontSize: asstBubbleS.fontSize,
        asstBubbleFontWeight: asstBubbleS.fontWeight,
        timeColor: timeS.color,
        timeFontSize: timeS.fontSize,
        timeFontWeight: timeS.fontWeight,
      };
    });

    results.measurements.defaultDark = sepData;
    assert('Data Slot Attribute', sepData.slot === 'day-separator', `data-slot: ${sepData.slot}`);
    assert('Container Max Width (384px)', sepData.maxWidth === '384px', `max-width: ${sepData.maxWidth}`);
    assert('Unique Day Dividers Grouping (4)', sepData.dividersCount === 4, `Dividers: ${sepData.dividersCount}`);
    assert('Divider Gap (10px)', sepData.dividerGap === '10px', `gap: ${sepData.dividerGap}`);
    assert('Divider Line Height (1px)', sepData.lineHeight === '1px', `height: ${sepData.lineHeight}`);
    assert('Divider Label Strict 400 Mono (11px)', sepData.labelFontSize === '11px' && sepData.labelFontWeight === '400' && sepData.labelFontFamily.includes('mono'), `Label: ${sepData.labelFontSize} / ${sepData.labelFontWeight}`);
    assert('User Turn Flex Direction (row-reverse)', sepData.userTurnDirection === 'row-reverse', `flex-direction: ${sepData.userTurnDirection}`);
    assert('User Bubble Radius (16px)', sepData.userBubbleRadius === '16px', `radius: ${sepData.userBubbleRadius}`);
    assert('User Bubble Padding (8px 14px)', sepData.userBubblePadding === '8px 14px', `padding: ${sepData.userBubblePadding}`);
    assert('User Bubble Strict 400 Typography (13.5px)', sepData.userBubbleFontSize === '13.5px' && sepData.userBubbleFontWeight === '400', `User text: ${sepData.userBubbleFontSize} / ${sepData.userBubbleFontWeight}`);
    assert('Assistant Text Strict 400 Typography (13.5px)', sepData.asstBubbleFontSize === '13.5px' && sepData.asstBubbleFontWeight === '400', `Asst text: ${sepData.asstBubbleFontSize} / ${sepData.asstBubbleFontWeight}`);
    assert('Resting Timestamp Invisible (transparent)', sepData.timeColor === 'rgba(0, 0, 0, 0)' || sepData.timeColor === 'transparent', `color: ${sepData.timeColor}`);
    assert('Timestamp Strict 400 Mono (11px)', sepData.timeFontSize === '11px' && sepData.timeFontWeight === '400', `Time: ${sepData.timeFontSize} / ${sepData.timeFontWeight}`);

    // Interactive Hover on Turn reveals timestamp
    console.log('\n[2/5] Testing Hover Reveal of Timestamps...');
    await pageDark.locator('.ds-day-separator__turn--user').first().hover();
    await pageDark.waitForTimeout(200);

    const hoveredTimeColor = await pageDark.locator('.ds-day-separator__turn--user .ds-day-separator__time').first().evaluate((el) => window.getComputedStyle(el).color);
    assert('Hover on Message Turn Reveals Timestamp', hoveredTimeColor !== 'rgba(0, 0, 0, 0)' && hoveredTimeColor !== 'transparent', `Hover color: ${hoveredTimeColor}`);

    // 2. Light Mode: Default Story
    console.log('\n[3/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-15-day-separator--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('[data-slot="day-separator"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/day-separator-default-light.png` });

    // 4. One Day Story
    console.log('\n[4/5] Auditing One Day Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-15-day-separator--one-day&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="day-separator"]');
    const stageOneDay = await pageDark.locator('.ds-story-stage').first();
    await stageOneDay.screenshot({ path: `${ARTIFACT_DIR}/day-separator-one-day-dark.png` });

    const oneDayData = await pageDark.locator('[data-slot="day-separator"]').evaluate((el) => {
      const divs = el.querySelectorAll('.ds-day-separator__divider');
      const turns = el.querySelectorAll('.ds-day-separator__turn');
      const label = el.querySelector('.ds-day-separator__label')?.textContent?.trim();
      return {
        dividersCount: divs.length,
        turnsCount: turns.length,
        label,
      };
    });
    assert('One Day Has Exactly 1 Header Separator ("Today")', oneDayData.dividersCount === 1 && oneDayData.label === 'Today', `Dividers: ${oneDayData.dividersCount}, Label: ${oneDayData.label}`);
    assert('One Day Has 2 Message Turns', oneDayData.turnsCount === 2, `Turns: ${oneDayData.turnsCount}`);

    // Many Days Story (Long URL wrapping check)
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-15-day-separator--many-days&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="day-separator"]');
    const stageManyDays = await pageDark.locator('.ds-story-stage').first();
    await stageManyDays.screenshot({ path: `${ARTIFACT_DIR}/day-separator-many-days-dark.png` });

    const containerWidth = await pageDark.locator('[data-slot="day-separator"]').evaluate((el) => el.getBoundingClientRect().width);
    const bubbleWidths = await pageDark.locator('.ds-day-separator__bubble').evaluateAll((list) => list.map((b) => b.getBoundingClientRect().width));
    const maxBubble = Math.max(...bubbleWidths);
    assert('Long URL Bubbles Stay Within 80% Container Boundary', maxBubble <= containerWidth * 0.81, `Max bubble: ${maxBubble}px vs container: ${containerWidth}px (80%: ${containerWidth * 0.8}px)`);

    // 5. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const timeTransition = await pageDark.locator('.ds-day-separator__time').first().evaluate((el) => window.getComputedStyle(el).transition);
    assert('Reduced Motion Disables Timestamp Transition', timeTransition === 'none', `Transition: ${timeTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/015_day_separator_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
