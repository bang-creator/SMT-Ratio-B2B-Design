import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 017 REGENERATE MENU ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-17-regenerate-menu--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-regen-target [data-slot="regenerate-menu"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/regenerate-menu-default-dark.png` });

    const menuData = await pageDark.locator('.ds-regen-target [data-slot="regenerate-menu"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const trigger = el.querySelector('.ds-regen-trigger');
      const trigS = trigger ? window.getComputedStyle(trigger) : {};
      const trigRect = trigger ? trigger.getBoundingClientRect() : {};
      const trigSvg = trigger ? trigger.querySelector('svg') : null;
      const trigSvgRect = trigSvg ? trigSvg.getBoundingClientRect() : {};

      const panel = el.querySelector('.ds-floating-panel');
      const panS = panel ? window.getComputedStyle(panel) : {};

      const items = Array.from(el.querySelectorAll('.ds-regen-item'));
      const firstItem = items[0];
      const itemS = firstItem ? window.getComputedStyle(firstItem) : {};
      const firstLabel = firstItem ? firstItem.querySelector('span:first-child') : null;
      const labelS = firstLabel ? window.getComputedStyle(firstLabel) : {};

      const currentItem = items.find((it) => it.getAttribute('data-id') === 'sonnet');
      const currentTag = currentItem ? currentItem.querySelector('span:last-child')?.textContent?.trim() : null;

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        triggerWidth: Math.round(trigRect.width),
        triggerHeight: Math.round(trigRect.height),
        triggerRadius: trigS.borderRadius,
        triggerAriaExpanded: trigger ? trigger.getAttribute('aria-expanded') : null,
        triggerAriaLabel: trigger ? trigger.getAttribute('aria-label') : null,
        triggerSvgWidth: Math.round(trigSvgRect.width),
        triggerSvgHeight: Math.round(trigSvgRect.height),
        panelRadius: panS.borderRadius,
        panelPadding: panS.padding,
        panelGap: panS.gap,
        itemsCount: items.length,
        itemRadius: itemS.borderRadius,
        itemPadding: itemS.padding,
        labelFontSize: labelS.fontSize,
        labelFontWeight: labelS.fontWeight,
        currentTag,
      };
    });

    results.measurements.defaultDark = menuData;
    assert('Data Slot Attribute', menuData.slot === 'regenerate-menu', `data-slot: ${menuData.slot}`);
    assert('Container Max Width (384px)', menuData.maxWidth === '384px', `max-width: ${menuData.maxWidth}`);
    assert('Trigger Button Dimensions (28x28px)', menuData.triggerWidth === 28 && menuData.triggerHeight === 28, `Trigger: ${menuData.triggerWidth}x${menuData.triggerHeight}px`);
    assert('Trigger Full Pill Radius', menuData.triggerRadius === '9999px' || menuData.triggerRadius === '50%', `radius: ${menuData.triggerRadius}`);
    assert('Trigger ARIA Attributes', menuData.triggerAriaExpanded === 'true' && menuData.triggerAriaLabel === 'Regenerate with a different model', `expanded: ${menuData.triggerAriaExpanded}, label: ${menuData.triggerAriaLabel}`);
    assert('Trigger SVG Dimensions (14x14px)', menuData.triggerSvgWidth === 14 && menuData.triggerSvgHeight === 14, `SVG: ${menuData.triggerSvgWidth}x${menuData.triggerSvgHeight}px`);
    assert('Floating Panel Radius (16px)', menuData.panelRadius === '16px', `radius: ${menuData.panelRadius}`);
    assert('Floating Panel Padding (6px)', menuData.panelPadding === '6px', `padding: ${menuData.panelPadding}`);
    assert('Options Count (3)', menuData.itemsCount === 3, `Count: ${menuData.itemsCount}`);
    assert('Option Item Radius (12px)', menuData.itemRadius === '12px', `radius: ${menuData.itemRadius}`);
    assert('Option Item Padding (6px 10px)', menuData.itemPadding === '6px 10px', `padding: ${menuData.itemPadding}`);
    assert('Option Label Strict 400 Typography (13px)', menuData.labelFontSize === '13px' && menuData.labelFontWeight === '400', `Label: ${menuData.labelFontSize} / ${menuData.labelFontWeight}`);
    assert('Current Model Tag Displays "current"', menuData.currentTag === 'current', `Current tag: ${menuData.currentTag}`);

    // 2. Interactive Selection & Toggle Testing
    console.log('\n[2/6] Testing Interactive Model Selection & Open/Close Toggle...');
    // Pick Opus
    await pageDark.click('.ds-regen-target [data-id="opus"]');
    await pageDark.waitForTimeout(100);

    const pickedData = await pageDark.locator('.ds-regen-target [data-slot="regenerate-menu"]').evaluate((el) => {
      const opusTag = el.querySelector('[data-id="opus"] span:last-child')?.textContent?.trim();
      const sonnetTag = el.querySelector('[data-id="sonnet"] span:last-child')?.textContent?.trim();
      return { opusTag, sonnetTag };
    });
    assert('Clicking Model Updates Current Tag', pickedData.opusTag === 'current' && pickedData.sonnetTag === 'balanced', `Opus tag: ${pickedData.opusTag}, Sonnet tag: ${pickedData.sonnetTag}`);

    // Click Trigger to close
    await pageDark.click('.ds-regen-target .ds-regen-trigger');
    await pageDark.waitForTimeout(100);

    const closedData = await pageDark.locator('.ds-regen-target [data-slot="regenerate-menu"]').evaluate((el) => {
      const panel = el.querySelector('.ds-floating-panel');
      const trigger = el.querySelector('.ds-regen-trigger');
      return {
        hasPanel: !!panel,
        expanded: trigger?.getAttribute('aria-expanded'),
      };
    });
    assert('Click Trigger Closes Floating Panel', !closedData.hasPanel && closedData.expanded === 'false', `Panel present: ${closedData.hasPanel}, expanded: ${closedData.expanded}`);

    // Click Trigger again to re-open
    await pageDark.click('.ds-regen-target .ds-regen-trigger');
    await pageDark.waitForSelector('.ds-regen-target .ds-floating-panel');
    const reopened = await pageDark.locator('.ds-regen-target .ds-floating-panel').count();
    assert('Click Trigger Re-opens Floating Panel', reopened === 1, `Panel count: ${reopened}`);

    // 3. Light Mode: Default Story
    console.log('\n[3/6] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-17-regenerate-menu--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-regen-target [data-slot="regenerate-menu"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/regenerate-menu-default-light.png` });

    // 4. Closed Story
    console.log('\n[4/6] Auditing Closed Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-17-regenerate-menu--closed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="regenerate-menu"]');
    const stageClosed = await pageDark.locator('.ds-story-stage').first();
    await stageClosed.screenshot({ path: `${ARTIFACT_DIR}/regenerate-menu-closed-dark.png` });

    const staticClosedData = await pageDark.locator('[data-slot="regenerate-menu"]').evaluate((el) => ({
      hasPanel: !!el.querySelector('.ds-floating-panel'),
      expanded: el.querySelector('.ds-regen-trigger')?.getAttribute('aria-expanded'),
    }));
    assert('Closed Story Has No Panel and aria-expanded="false"', !staticClosedData.hasPanel && staticClosedData.expanded === 'false', `hasPanel: ${staticClosedData.hasPanel}, expanded: ${staticClosedData.expanded}`);

    // 5. Read Only & Long Labels Stories
    console.log('\n[5/6] Auditing Read Only and Long Labels Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-17-regenerate-menu--read-only&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="regenerate-menu"]');
    const stageReadOnly = await pageDark.locator('.ds-story-stage').first();
    await stageReadOnly.screenshot({ path: `${ARTIFACT_DIR}/regenerate-menu-read-only-dark.png` });

    const readOnlyData = await pageDark.locator('[data-slot="regenerate-menu"]').evaluate((el) => {
      const items = el.querySelectorAll('.ds-floating-panel > div');
      const btns = el.querySelectorAll('.ds-floating-panel > button');
      return {
        divItemsCount: items.length,
        btnItemsCount: btns.length,
      };
    });
    assert('Read Only Story Renders Non-Button Items', readOnlyData.divItemsCount === 3 && readOnlyData.btnItemsCount === 0, `Div items: ${readOnlyData.divItemsCount}, Button items: ${readOnlyData.btnItemsCount}`);

    // Long Labels
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-17-regenerate-menu--long-labels&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="regenerate-menu"]');
    const stageLongLabels = await pageDark.locator('.ds-story-stage').first();
    await stageLongLabels.screenshot({ path: `${ARTIFACT_DIR}/regenerate-menu-long-labels-dark.png` });

    const longLabelsData = await pageDark.locator('[data-slot="regenerate-menu"]').evaluate((el) => {
      const panel = el.querySelector('.ds-floating-panel');
      const pRect = panel.getBoundingClientRect();
      const labels = Array.from(el.querySelectorAll('.ds-regen-item span:first-child'));
      const allTruncate = labels.every((l) => window.getComputedStyle(l).textOverflow === 'ellipsis');
      return {
        panelWidth: Math.round(pRect.width),
        optionsCount: labels.length,
        allTruncate,
      };
    });
    assert('Long Labels Story Renders 5 Options with Clean Ellipsis', longLabelsData.optionsCount === 5 && longLabelsData.allTruncate, `Count: ${longLabelsData.optionsCount}, allTruncate: ${longLabelsData.allTruncate}`);
    assert('Long Labels Panel Stays Within 384px Boundary', longLabelsData.panelWidth <= 384, `Panel width: ${longLabelsData.panelWidth}px`);

    // 6. Reduced Motion Safety
    console.log('\n[6/6] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const panelAnimation = await pageDark.locator('.ds-floating-panel').evaluate((el) => window.getComputedStyle(el).animationName);
    assert('Reduced Motion Disables Panel Animation', panelAnimation === 'none', `Animation: ${panelAnimation}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/017_regenerate_menu_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
