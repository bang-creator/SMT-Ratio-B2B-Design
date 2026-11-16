import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 032 WEB SEARCH ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="web-search"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/web-search-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="web-search"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const pill = el.querySelector('.ds-web-search__pill');
      const pillS = pill ? window.getComputedStyle(pill) : {};
      const icon = el.querySelector('.ds-web-search__icon');
      const iRect = icon ? icon.getBoundingClientRect() : {};
      const status = el.querySelector('.ds-web-search__status');
      const statS = status ? window.getComputedStyle(status) : {};
      const rows = Array.from(el.querySelectorAll('.ds-web-search__result')).map((r) => {
        const badge = r.querySelector('.ds-domain-badge');
        const bRect = badge ? badge.getBoundingClientRect() : {};
        const bS = badge ? window.getComputedStyle(badge) : {};
        const title = r.querySelector('.ds-web-search__title');
        const titleS = title ? window.getComputedStyle(title) : {};
        const domain = r.querySelector('.ds-web-search__domain');
        const domS = domain ? window.getComputedStyle(domain) : {};

        return {
          badgeSize: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
          badgeRadius: bS.borderRadius,
          titleText: title ? title.textContent.trim() : null,
          titleSize: titleS.fontSize,
          titleWeight: titleS.fontWeight,
          domainText: domain ? domain.textContent.trim() : null,
          domainSize: domS.fontSize,
          domainWeight: domS.fontWeight,
        };
      });

      return {
        maxWidth: s.maxWidth,
        gap: s.gap,
        pill: {
          radius: pillS.borderRadius,
          fontSize: pillS.fontSize,
          fontWeight: pillS.fontWeight,
          iconSize: `${Math.round(iRect.width)}x${Math.round(iRect.height)}`,
        },
        status: {
          text: status ? status.textContent.trim() : null,
          fontSize: statS.fontSize,
          fontWeight: statS.fontWeight,
        },
        rowsCount: rows.length,
        rows: rows,
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (384px max-width, 10px gap)',
      defaultMetrics.maxWidth === '384px' && defaultMetrics.gap === '10px',
      `maxWidth=${defaultMetrics.maxWidth}, gap=${defaultMetrics.gap}`
    );

    assert(
      'Query Pill Geometry (Full Radius, 12px/400 Typography, 12x12px Search Icon)',
      defaultMetrics.pill.radius === '9999px' &&
        defaultMetrics.pill.fontSize === '12px' &&
        defaultMetrics.pill.fontWeight === '400' &&
        defaultMetrics.pill.iconSize === '12x12',
      `radius=${defaultMetrics.pill.radius}, font=${defaultMetrics.pill.fontSize}/${defaultMetrics.pill.fontWeight}, icon=${defaultMetrics.pill.iconSize}`
    );

    assert(
      'Status Line Strict 400 Typography (12px, "Read 3 sources")',
      defaultMetrics.status.text === 'Read 3 sources' &&
        defaultMetrics.status.fontSize === '12px' &&
        defaultMetrics.status.fontWeight === '400',
      `status="${defaultMetrics.status.text}" (${defaultMetrics.status.fontSize}/${defaultMetrics.status.fontWeight})`
    );

    assert(
      'Source Rows Strict 400 Typography across Title (13.5px) and Domain (11px Mono)',
      defaultMetrics.rowsCount === 3 &&
        defaultMetrics.rows.every(
          (r) =>
            r.titleSize === '13.5px' &&
            r.titleWeight === '400' &&
            r.domainSize === '11px' &&
            r.domainWeight === '400'
        ),
      `rows=${defaultMetrics.rows.map((r) => `${r.domainText}(${r.titleWeight})`).join(', ')}`
    );

    assert(
      'Domain Badges Compact Geometry (16x16px rounded-sm)',
      defaultMetrics.rows.every((r) => r.badgeSize === '16x16'),
      `badges=${defaultMetrics.rows.map((r) => r.badgeSize).join(', ')}`
    );

    // 2. Searching Variant Story Audit
    console.log('\n[2/6] Auditing Searching Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--searching&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageSearching = await pageDark.locator('.ds-story').first();
    await stageSearching.screenshot({ path: `${ARTIFACT_DIR}/web-search-searching-dark.png` });

    const searchingData = await pageDark.locator('[data-slot="web-search"]').evaluate((el) => {
      const shimmer = el.querySelector('.ds-web-search__shimmer');
      const rows = el.querySelectorAll('.ds-web-search__result');
      return {
        hasShimmer: !!shimmer,
        shimmerText: shimmer ? shimmer.textContent.trim() : null,
        rowsCount: rows.length,
      };
    });

    assert(
      'Searching Story Displays Shimmer Label "Searching" and Empty Results Container',
      searchingData.hasShimmer &&
        searchingData.shimmerText === 'Searching' &&
        searchingData.rowsCount === 0,
      `shimmer=${searchingData.hasShimmer}, label="${searchingData.shimmerText}", rowsCount=${searchingData.rowsCount}`
    );

    // 3. Empty Variant Story Audit
    console.log('\n[3/6] Auditing Empty Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--empty&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageEmpty = await pageDark.locator('.ds-story').first();
    await stageEmpty.screenshot({ path: `${ARTIFACT_DIR}/web-search-empty-dark.png` });

    const emptyData = await pageDark.locator('[data-slot="web-search"]').evaluate((el) => {
      const status = el.querySelector('.ds-web-search__status');
      const rows = el.querySelectorAll('.ds-web-search__result');
      return {
        statusText: status ? status.textContent.trim() : null,
        rowsCount: rows.length,
      };
    });

    assert(
      'Empty Story Displays "Read 0 sources" and 0 Results',
      emptyData.statusText === 'Read 0 sources' && emptyData.rowsCount === 0,
      `status="${emptyData.statusText}", rowsCount=${emptyData.rowsCount}`
    );

    // 4. Interactive Search Trigger Cycle
    console.log('\n[4/6] Testing Interactive Search Trigger Cycle on Pill Click...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click query pill
    await pageDark.locator('.ds-web-search-trigger').click();
    await pageDark.waitForTimeout(100);

    const interactiveSearching = await pageDark.locator('[data-slot="web-search"]').evaluate((el) => {
      const shimmer = el.querySelector('.ds-web-search__shimmer');
      const rows = el.querySelectorAll('.ds-web-search__result');
      return {
        hasShimmer: !!shimmer,
        rowsCount: rows.length,
      };
    });

    assert(
      'Clicking Query Pill Initiates Searching State with Shimmer Label',
      interactiveSearching.hasShimmer && interactiveSearching.rowsCount === 0,
      `hasShimmer=${interactiveSearching.hasShimmer}, rowsCount=${interactiveSearching.rowsCount}`
    );

    // Wait for cycle completion (500ms timeout in story)
    await pageDark.waitForTimeout(600);

    const interactiveCompleted = await pageDark.locator('[data-slot="web-search"]').evaluate((el) => {
      const status = el.querySelector('.ds-web-search__status');
      const rows = el.querySelectorAll('.ds-web-search__result');
      return {
        statusText: status ? status.textContent.trim() : null,
        rowsCount: rows.length,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/web-search-interactive-completed-dark.png` });

    assert(
      'After Search Finishes, State Resolves to "Read 3 sources" and 3 Result Rows',
      interactiveCompleted.statusText === 'Read 3 sources' && interactiveCompleted.rowsCount === 3,
      `status="${interactiveCompleted.statusText}", rowsCount=${interactiveCompleted.rowsCount}`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/web-search-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="web-search"]').evaluate((el) => {
      const pill = el.querySelector('.ds-web-search__pill');
      const pillS = pill ? window.getComputedStyle(pill) : {};
      const badge = el.querySelector('.ds-domain-badge');
      const bS = badge ? window.getComputedStyle(badge) : {};
      return {
        pillBg: pillS.backgroundColor,
        pillBorder: pillS.borderColor,
        badgeBg: bS.backgroundColor,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface Pill and Subtle Border Tokens',
      lightStyles.pillBg !== 'transparent' &&
        lightStyles.pillBorder !== 'transparent' &&
        lightStyles.badgeBg !== 'transparent',
      `pillBg=${lightStyles.pillBg}, pillBorder=${lightStyles.pillBorder}, badgeBg=${lightStyles.badgeBg}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-32-web-search--searching&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-web-search__shimmer').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
      };
    });

    assert(
      'Reduced Motion Mode Disables Shimmer Animation',
      motionStyles.animation.includes('none'),
      `animation=${motionStyles.animation}`
    );

    console.log('\n--- AUDIT SUMMARY ---');
    console.log(`TOTAL CHECKS: ${results.total}`);
    console.log(`PASSED: ${results.passed}`);
    console.log(`FAILED: ${results.total - results.passed}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    return results;
  } catch (err) {
    console.error('Audit failed with runtime error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();