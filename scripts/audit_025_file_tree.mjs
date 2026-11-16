import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 025 FILE TREE ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-25-file-tree--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="file-tree"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/file-tree-default-dark.png` });

    const defaultData = await pageDark.locator('[data-slot="file-tree"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const headerTitle = el.querySelector('.ds-file-tree__header span:first-child');
      const htS = headerTitle ? window.getComputedStyle(headerTitle) : {};
      const addStat = el.querySelector('.ds-diff-stat-add');
      const addS = addStat ? window.getComputedStyle(addStat) : {};
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const remS = remStat ? window.getComputedStyle(remStat) : {};

      const nodes = Array.from(el.querySelectorAll('.ds-file-tree__node')).map((n) => {
        const nS = window.getComputedStyle(n);
        const nameSpan = n.querySelector('.ds-truncate');
        const fileAdd = n.querySelector('.ds-diff-stat-add');
        const fileRem = n.querySelector('.ds-diff-stat-remove');
        return {
          name: nameSpan ? nameSpan.textContent.trim() : null,
          paddingStart: nS.paddingInlineStart,
          fontSize: nS.fontSize,
          fontWeight: nS.fontWeight,
          additions: fileAdd ? fileAdd.textContent.trim() : null,
          deletions: fileRem ? fileRem.textContent.trim() : null,
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        header: {
          title: headerTitle ? headerTitle.textContent.trim() : null,
          fontSize: htS.fontSize,
          fontWeight: htS.fontWeight,
          addText: addStat ? addStat.textContent.trim() : null,
          addColor: addS.color,
          remText: remStat ? remStat.textContent.trim() : null,
          remColor: remS.color,
        },
        nodeCount: nodes.length,
        nodes: nodes,
      };
    });

    results.measurements.defaultDark = defaultData;

    assert(
      'Container Geometry (384px max-width, 16px radius, 14px padding)',
      defaultData.maxWidth === '384px' &&
        defaultData.borderRadius === '16px' &&
        defaultData.padding === '14px',
      `maxWidth=${defaultData.maxWidth}, radius=${defaultData.borderRadius}, padding=${defaultData.padding}`
    );

    assert(
      'Header Counts & Tokenized Stats (3 files, +84 emerald, −15 red)',
      defaultData.header.title === '3 files changed' &&
        defaultData.header.addText === '+84' &&
        defaultData.header.remText === '−15' &&
        defaultData.header.addColor.includes('16, 163, 127') &&
        (defaultData.header.remColor.includes('250, 66, 62') || defaultData.header.remColor.includes('239, 68, 68')),
      `title="${defaultData.header.title}", add=${defaultData.header.addText}, rem=${defaultData.header.remText}`
    );

    assert(
      'Renders 6 Tree Nodes with Strict 400 Typography (13px)',
      defaultData.nodeCount === 6 &&
        defaultData.nodes.every((n) => n.fontSize === '13px' && n.fontWeight === '400'),
      `count=${defaultData.nodeCount}, weights=${defaultData.nodes.map((n) => n.fontWeight).join(', ')}`
    );

    assert(
      'Depth Indentation Scaling (depth 0 = 4px, depth 1 = 18px, depth 2 = 32px)',
      defaultData.nodes[0].paddingStart === '4px' &&
        defaultData.nodes[1].paddingStart === '18px' &&
        defaultData.nodes[2].paddingStart === '32px',
      `d0=${defaultData.nodes[0].paddingStart}, d1=${defaultData.nodes[1].paddingStart}, d2=${defaultData.nodes[2].paddingStart}`
    );

    // 2. Interactive Hover: Hover Node
    console.log('\n[2/6] Auditing Interactive Node Hover...');
    const nodeToHover = pageDark.locator('.ds-file-tree__node').nth(2);
    await nodeToHover.hover();
    await pageDark.waitForTimeout(150);

    const hoverBg = await nodeToHover.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/file-tree-hover-dark.png` });

    assert(
      'Node Hover Applies Subtle Interactive Surface Wash',
      hoverBg !== 'rgba(0, 0, 0, 0)' && hoverBg !== 'transparent',
      `hoverBg=${hoverBg}`
    );

    // 3. Auditing Simple Story (1 file, 1 folder)
    console.log('\n[3/6] Auditing Simple Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-25-file-tree--simple&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageSimple = await pageDark.locator('.ds-story').first();
    await stageSimple.screenshot({ path: `${ARTIFACT_DIR}/file-tree-simple-dark.png` });

    const simpleData = await pageDark.locator('[data-slot="file-tree"]').evaluate((el) => {
      const headerTitle = el.querySelector('.ds-file-tree__header span:first-child');
      const addStat = el.querySelector('.ds-diff-stat-add');
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const nodes = el.querySelectorAll('.ds-file-tree__node');
      return {
        title: headerTitle ? headerTitle.textContent.trim() : null,
        addText: addStat ? addStat.textContent.trim() : null,
        remText: remStat ? remStat.textContent.trim() : null,
        nodeCount: nodes.length,
      };
    });

    assert(
      'Simple Story Renders "1 files changed", +12 −0, and 2 Nodes',
      simpleData.title === '1 files changed' &&
        simpleData.addText === '+12' &&
        simpleData.remText === '−0' &&
        simpleData.nodeCount === 2,
      `title="${simpleData.title}", add=${simpleData.addText}, rem=${simpleData.remText}, count=${simpleData.nodeCount}`
    );

    // 4. Light Mode Audit
    console.log('\n[4/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-25-file-tree--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/file-tree-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="file-tree"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const remS = remStat ? window.getComputedStyle(remStat) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        remColor: remS.color,
      };
    });

    assert(
      'Light Mode Surface and Danger Tokens',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        (lightStyles.remColor.includes('186, 38, 35') || lightStyles.remColor.includes('250, 66, 62') || lightStyles.remColor.includes('239, 68, 68')),
      `bg=${lightStyles.bg}, border=${lightStyles.border}, remColor=${lightStyles.remColor}`
    );

    // 5. Reduced Motion Audit
    console.log('\n[5/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-25-file-tree--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-file-tree__node').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Disables Node Transition',
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
