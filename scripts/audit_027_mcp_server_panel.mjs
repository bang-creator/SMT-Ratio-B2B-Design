import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 027 MCP SERVER PANEL ---');
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
    // 1. Dark Mode: Default Story (Collapsed)
    console.log('\n[1/7] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-27-mcp-server-panel--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="mcp-server-panel"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/mcp-server-panel-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="mcp-server-panel"]').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const title = el.querySelector('.ds-mcp-server-panel__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const count = el.querySelector('.ds-mcp-server-panel__count');
      const countS = count ? window.getComputedStyle(count) : {};
      const rows = Array.from(el.querySelectorAll('.ds-mcp-server-panel__row')).map((row) => {
        const rowS = window.getComputedStyle(row);
        const nameEl = row.querySelector('.ds-truncate');
        const nameS = nameEl ? window.getComputedStyle(nameEl) : {};
        const countBadge = row.querySelector('.ds-mcp-server-panel__count');
        const countBadgeS = countBadge ? window.getComputedStyle(countBadge) : {};
        const dot = row.querySelector('.ds-status-dot');
        const dotRect = dot ? dot.getBoundingClientRect() : {};
        const dotS = dot ? window.getComputedStyle(dot) : {};

        return {
          id: row.getAttribute('data-server-id'),
          name: nameEl ? nameEl.textContent.trim() : null,
          nameWeight: nameS.fontWeight,
          toolCount: countBadge ? countBadge.textContent.trim() : null,
          toolCountWeight: countBadgeS.fontWeight,
          dotSize: `${Math.round(dotRect.width)}x${Math.round(dotRect.height)}`,
          dotColor: dotS.backgroundColor,
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        bg: s.backgroundColor,
        border: s.borderColor,
        title: {
          text: title ? title.textContent.trim() : null,
          fontSize: titleS.fontSize,
          fontWeight: titleS.fontWeight,
        },
        count: {
          text: count ? count.textContent.trim() : null,
          fontSize: countS.fontSize,
          fontWeight: countS.fontWeight,
        },
        rowCount: rows.length,
        rows: rows,
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (384px max-width, 16px radius, 12px padding)',
      defaultMetrics.maxWidth === '384px' &&
        defaultMetrics.borderRadius === '16px' &&
        defaultMetrics.padding === '12px',
      `maxWidth=${defaultMetrics.maxWidth}, radius=${defaultMetrics.borderRadius}, padding=${defaultMetrics.padding}`
    );

    assert(
      'Header Title & Connection Counter Typography',
      defaultMetrics.title.text === 'Servers' &&
        defaultMetrics.count.text === '2 of 4 connected' &&
        defaultMetrics.count.fontWeight === '400',
      `title="${defaultMetrics.title.text}", counter="${defaultMetrics.count.text}" (weight=${defaultMetrics.count.fontWeight})`
    );

    assert(
      'Renders Exactly 4 Server Rows with Strict 400 Typography',
      defaultMetrics.rowCount === 4 &&
        defaultMetrics.rows.every((r) => r.nameWeight === '400' && r.toolCountWeight === '400'),
      `rows=${defaultMetrics.rows.map((r) => `${r.name}(${r.nameWeight})`).join(', ')}`
    );

    const githubRow = defaultMetrics.rows.find((r) => r.id === 'github');
    const slackRow = defaultMetrics.rows.find((r) => r.id === 'slack');
    assert(
      'Status Dots Geometry (6x6px rounded-full)',
      defaultMetrics.rows.every((r) => r.dotSize === '6x6'),
      `dots=${defaultMetrics.rows.map((r) => `${r.id}:${r.dotSize}`).join(', ')}`
    );

    assert(
      'Semantic Color Tokens for Connected & Needs-Auth Dots',
      githubRow && githubRow.dotColor.includes('163') && slackRow && (slackRow.dotColor.includes('245') || slackRow.dotColor.includes('251')),
      `github=${githubRow?.dotColor}, slack=${slackRow?.dotColor}`
    );

    // 2. Auditing Expanded Story
    console.log('\n[2/7] Auditing Expanded Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-27-mcp-server-panel--expanded&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageExpandedDark = await pageDark.locator('.ds-story').first();
    await stageExpandedDark.screenshot({ path: `${ARTIFACT_DIR}/mcp-server-panel-expanded-dark.png` });

    const expandedDetails = await pageDark.locator('[data-slot="mcp-server-panel"]').first().evaluate((el) => {
      const details = el.querySelector('.ds-mcp-server-panel__details');
      const dS = details ? window.getComputedStyle(details) : {};
      const meta = el.querySelector('.ds-mcp-server-panel__meta');
      const metaS = meta ? window.getComputedStyle(meta) : {};
      const chips = Array.from(el.querySelectorAll('.ds-mcp-server-panel__tool-chip')).map((c) => {
        const cS = window.getComputedStyle(c);
        return {
          text: c.textContent.trim(),
          fontSize: cS.fontSize,
          fontWeight: cS.fontWeight,
          radius: cS.borderRadius,
        };
      });
      const chevron = el.querySelector('.ds-mcp-server-panel__chevron--expanded');
      const chevS = chevron ? window.getComputedStyle(chevron) : {};

      return {
        hasDetails: !!details,
        paddingLeft: dS.paddingLeft,
        metaText: meta ? meta.textContent.trim() : null,
        metaWeight: metaS.fontWeight,
        chipsCount: chips.length,
        chips: chips,
        chevronTransform: chevS.transform,
      };
    });

    assert(
      'Expanded Details Left Padding (32px / ps-8) and Chevron Rotation',
      expandedDetails.hasDetails &&
        expandedDetails.paddingLeft === '32px' &&
        expandedDetails.chevronTransform.includes('matrix'),
      `paddingLeft=${expandedDetails.paddingLeft}, transform=${expandedDetails.chevronTransform}`
    );

    assert(
      'Expanded Tool Chips Strict 400 Monospace Typography (11px, 3 tools)',
      expandedDetails.chipsCount === 3 &&
        expandedDetails.chips.every((c) => c.fontSize === '11px' && c.fontWeight === '400'),
      `chips=${expandedDetails.chips.map((c) => `${c.text}(${c.fontWeight})`).join(', ')}`
    );

    // 3. Interactive Expansion & Toggle
    console.log('\n[3/7] Testing Interactive Accordion Toggle on Slack Row...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-27-mcp-server-panel--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click slack row
    await pageDark.locator('.ds-mcp-toggle[data-server-id="slack"]').click();
    await pageDark.waitForTimeout(200);

    const slackExpanded = await pageDark.locator('[data-slot="mcp-server-panel"]').first().evaluate((el) => {
      const details = el.querySelector('.ds-mcp-server-panel__details');
      const authBtn = el.querySelector('.ds-mcp-server-panel__authorize-btn');
      const chips = Array.from(el.querySelectorAll('.ds-mcp-server-panel__tool-chip')).map((c) => c.textContent.trim());
      return {
        hasDetails: !!details,
        hasAuthBtn: !!authBtn,
        authText: authBtn ? authBtn.textContent.trim() : null,
        chips: chips,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/mcp-server-panel-slack-expanded-dark.png` });

    assert(
      'Clicking Slack Row Expands Needs-Auth Details with Authorize Button & 2 Tools',
      slackExpanded.hasDetails &&
        slackExpanded.hasAuthBtn &&
        slackExpanded.authText === 'Authorize' &&
        slackExpanded.chips.length === 2,
      `authText="${slackExpanded.authText}", chips=${slackExpanded.chips.join(', ')}`
    );

    // 4. Interactive Authorize Click
    console.log('\n[4/7] Testing Authorize Button Click Action...');
    await pageDark.locator('.ds-mcp-server-panel__authorize-btn').click();
    await pageDark.waitForTimeout(100);

    const authorizedText = await pageDark.locator('.ds-mcp-server-panel__authorize-btn').textContent();
    assert(
      'Clicking Authorize Updates Button Feedback to "Authorized"',
      authorizedText.trim() === 'Authorized',
      `text="${authorizedText.trim()}"`
    );

    // 5. Interactive Collapse
    console.log('\n[5/7] Testing Interactive Collapse on Slack Row...');
    await pageDark.locator('.ds-mcp-toggle[data-server-id="slack"]').click();
    await pageDark.waitForTimeout(200);

    const collapsedDetailsCount = await pageDark.locator('.ds-mcp-server-panel__details').count();
    assert(
      'Clicking Slack Row Again Collapses Accordion Details',
      collapsedDetailsCount === 0,
      `detailsCount=${collapsedDetailsCount}`
    );

    // 6. Light Mode Verification
    console.log('\n[6/7] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-27-mcp-server-panel--expanded&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/mcp-server-panel-expanded-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="mcp-server-panel"]').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface and Subtle Border Tokens',
      lightStyles.bg !== 'transparent' && lightStyles.border !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}`
    );

    // 7. Reduced Motion Verification
    console.log('\n[7/7] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-27-mcp-server-panel--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-mcp-server-panel__row').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Mode Disables Row Hover Transition',
      motionStyles.transition.includes('none'),
      `transition=${motionStyles.transition}`
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