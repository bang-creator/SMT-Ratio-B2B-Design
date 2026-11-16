import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 008 MESSAGE BRANCHES ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-08-message-branches--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-branches');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/message-branches-default-dark.png` });

    const branchData = await pageDark.locator('.ds-message-branches').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const p = el.querySelector('.ds-message-branches__text');
      const pS = p ? window.getComputedStyle(p) : {};
      const prevBtn = el.querySelector('.ds-branch-btn-prev');
      const prevS = prevBtn ? window.getComputedStyle(prevBtn) : {};
      const nextBtn = el.querySelector('.ds-branch-btn-next');
      const nextS = nextBtn ? window.getComputedStyle(nextBtn) : {};
      const counter = el.querySelector('span.font-mono');
      const counterS = counter ? window.getComputedStyle(counter) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        pMinHeight: pS.minHeight,
        pFontSize: pS.fontSize,
        pFontWeight: pS.fontWeight,
        pLineHeight: pS.lineHeight,
        pText: p ? p.textContent : null,
        prevDisabled: prevBtn ? prevBtn.hasAttribute('disabled') : null,
        prevWidth: prevS.width,
        prevHeight: prevS.height,
        nextDisabled: nextBtn ? nextBtn.hasAttribute('disabled') : null,
        nextWidth: nextS.width,
        nextHeight: nextS.height,
        counterText: counter ? counter.textContent : null,
        counterFontFamily: counterS.fontFamily,
        counterFontSize: counterS.fontSize,
        counterFontWeight: counterS.fontWeight,
        counterTabularNums: counterS.fontVariantNumeric,
      };
    });

    results.measurements.defaultDark = branchData;
    assert('Data Slot Attribute', branchData.slot === 'message-branches', `data-slot: ${branchData.slot}`);
    assert('Container Max Width', branchData.maxWidth === '384px', `max-width: ${branchData.maxWidth}`);
    assert('Container Gap (8px)', branchData.gap === '8px', `gap: ${branchData.gap}`);
    assert('Message Min Height (68px / 4.25rem)', branchData.pMinHeight === '68px', `min-height: ${branchData.pMinHeight}`);
    assert('Message Strict 400 Typography', branchData.pFontSize === '14px' && branchData.pFontWeight === '400', `Text: ${branchData.pFontSize} / ${branchData.pFontWeight}`);
    assert('Message Line Height (1.625)', Math.abs(parseFloat(branchData.pLineHeight) - 22.75) < 1, `Line height: ${branchData.pLineHeight}`);
    assert('Initial Counter (1 / 3)', branchData.counterText === '1 / 3', `Counter: ${branchData.counterText}`);
    assert('Counter Mono 400 Tabular', branchData.counterFontSize === '11px' && branchData.counterFontWeight === '400' && branchData.counterTabularNums.includes('tabular-nums'), `Counter: ${branchData.counterFontSize} / ${branchData.counterFontWeight} / ${branchData.counterTabularNums}`);
    assert('Initial Prev Button Disabled', branchData.prevDisabled === true, `prevDisabled: ${branchData.prevDisabled}`);
    assert('Initial Next Button Enabled', branchData.nextDisabled === false, `nextDisabled: ${branchData.nextDisabled}`);
    assert('Button Dimensions (24x24px / size-6)', branchData.prevWidth === '24px' && branchData.prevHeight === '24px', `Size: ${branchData.prevWidth}x${branchData.prevHeight}`);

    // Interactive step forward and back
    console.log('\n[2/4] Testing Interactive Branch Navigation...');
    await pageDark.click('.ds-branch-btn-next');
    const midCounter = await pageDark.locator('.ds-branch-target span.font-mono').textContent();
    const midPrevDisabled = await pageDark.locator('.ds-branch-btn-prev').isDisabled();
    const midNextDisabled = await pageDark.locator('.ds-branch-btn-next').isDisabled();
    assert('Click Next -> Branch 2 (2 / 3)', midCounter === '2 / 3' && !midPrevDisabled && !midNextDisabled, `Counter: ${midCounter}, prev: ${midPrevDisabled}, next: ${midNextDisabled}`);

    await pageDark.click('.ds-branch-btn-next');
    const lastCounter = await pageDark.locator('.ds-branch-target span.font-mono').textContent();
    const lastNextDisabled = await pageDark.locator('.ds-branch-btn-next').isDisabled();
    assert('Click Next -> Branch 3 (3 / 3, next disabled)', lastCounter === '3 / 3' && lastNextDisabled, `Counter: ${lastCounter}, next disabled: ${lastNextDisabled}`);

    await pageDark.click('.ds-branch-btn-prev');
    const backCounter = await pageDark.locator('.ds-branch-target span.font-mono').textContent();
    assert('Click Prev -> Back to Branch 2', backCounter === '2 / 3', `Counter: ${backCounter}`);

    // Light Mode Default Story
    console.log('\n[3/4] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-08-message-branches--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-message-branches');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/message-branches-default-light.png` });

    // 4. State Variants (Last Branch & Single Version)
    console.log('\n[4/4] Auditing State Variants (Last Branch & Single Version)...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-08-message-branches--last-branch&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-branches');
    const stageLast = await pageDark.locator('.ds-story-stage').first();
    await stageLast.screenshot({ path: `${ARTIFACT_DIR}/message-branches-last-branch-dark.png` });
    const lastStateCounter = await pageDark.locator('span.font-mono').textContent();
    const lastStateNextDisabled = await pageDark.locator('.ds-branch-btn-next').isDisabled();
    assert('Last Branch Preset (3 / 3, next disabled)', lastStateCounter === '3 / 3' && lastStateNextDisabled, `Counter: ${lastStateCounter}`);

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-08-message-branches--single-version&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-branches');
    const stageSingle = await pageDark.locator('.ds-story-stage').first();
    await stageSingle.screenshot({ path: `${ARTIFACT_DIR}/message-branches-single-version-dark.png` });
    const singleControlsCount = await pageDark.locator('.ds-message-branches .ds-icon-btn').count();
    assert('Single Version Hides Controls', singleControlsCount === 0, `Controls count: ${singleControlsCount}`);

    // Reduced motion safety
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmAnim = await pageDark.locator('.ds-message-branches__text').evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });
    assert('Reduced Motion Disables Text Ingress Animation', rmAnim === 'none', `Animation: ${rmAnim}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/008_message_branches_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
