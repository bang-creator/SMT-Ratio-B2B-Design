import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 023 CODE DIFF ---');
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
    // 1. Dark Mode: Default Story (use-draft.ts)
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-23-code-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="code-diff"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/code-diff-default-dark.png` });

    const defaultData = await pageDark.locator('[data-slot="code-diff"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const filename = el.querySelector('.ds-code-diff__filename');
      const fnS = filename ? window.getComputedStyle(filename) : {};
      const addStat = el.querySelector('.ds-diff-stat-add');
      const addS = addStat ? window.getComputedStyle(addStat) : {};
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const remS = remStat ? window.getComputedStyle(remStat) : {};

      const lines = Array.from(el.querySelectorAll('.ds-code-diff__line')).map((l) => {
        const lS = window.getComputedStyle(l);
        const gutter = l.querySelector('.ds-code-diff__gutter');
        const gText = gutter ? gutter.textContent.trim() : '';
        const isAdded = l.classList.contains('ds-code-diff__line--added');
        const isRemoved = l.classList.contains('ds-code-diff__line--removed');
        const isContext = l.classList.contains('ds-code-diff__line--context');

        return {
          gutter: gText,
          text: l.textContent.trim(),
          isAdded,
          isRemoved,
          isContext,
          color: lS.color,
          bg: lS.backgroundColor,
          fontSize: lS.fontSize,
          fontWeight: lS.fontWeight,
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        filename: {
          text: filename ? filename.textContent.trim() : null,
          fontSize: fnS.fontSize,
          fontWeight: fnS.fontWeight,
        },
        stats: {
          addText: addStat ? addStat.textContent.trim() : null,
          addColor: addS.color,
          addWeight: addS.fontWeight,
          remText: remStat ? remStat.textContent.trim() : null,
          remColor: remS.color,
          remWeight: remS.fontWeight,
        },
        lineCount: lines.length,
        lines: lines,
      };
    });

    results.measurements.defaultDark = defaultData;

    assert(
      'Container Geometry (448px max-width, 16px radius)',
      defaultData.maxWidth === '448px' && defaultData.borderRadius === '16px',
      `maxWidth=${defaultData.maxWidth}, radius=${defaultData.borderRadius}`
    );

    assert(
      'Filename Strict 400 Typography (12px)',
      defaultData.filename.fontSize === '12px' &&
        defaultData.filename.fontWeight === '400' &&
        defaultData.filename.text === 'use-draft.ts',
      `size=${defaultData.filename.fontSize}, weight=${defaultData.filename.fontWeight}, text="${defaultData.filename.text}"`
    );

    assert(
      'Header Diff Stats Strict 400 and Tokenized Colors (+5 emerald, −2 red)',
      defaultData.stats.addText === '+5' &&
        defaultData.stats.remText === '−2' &&
        defaultData.stats.addWeight === '400' &&
        defaultData.stats.remWeight === '400' &&
        defaultData.stats.addColor.includes('16, 163, 127') &&
        (defaultData.stats.remColor.includes('250, 66, 62') || defaultData.stats.remColor.includes('239, 68, 68')),
      `stats=${JSON.stringify(defaultData.stats)}`
    );

    assert(
      'Total 8 Diff Lines Rendered with Strict 400 Typography (12px)',
      defaultData.lineCount === 8 &&
        defaultData.lines.every((l) => l.fontSize === '12px' && l.fontWeight === '400'),
      `count=${defaultData.lineCount}, weights=${defaultData.lines.map((l) => l.fontWeight).join(', ')}`
    );

    const addedLines = defaultData.lines.filter((l) => l.isAdded);
    assert(
      'Added Lines Have Plus Gutter and Emerald Color Wash',
      addedLines.length === 4 &&
        addedLines.every((l) => l.gutter === '+' && l.color.includes('16, 163, 127')),
      `addedCount=${addedLines.length}, gutters=${addedLines.map((l) => l.gutter).join(', ')}`
    );

    const removedLines = defaultData.lines.filter((l) => l.isRemoved);
    assert(
      'Removed Lines Have Minus Gutter and Red Danger Color Wash',
      removedLines.length === 2 &&
        removedLines.every(
          (l) => l.gutter === '−' && (l.color.includes('250, 66, 62') || l.color.includes('239, 68, 68'))
        ),
      `removedCount=${removedLines.length}, gutters=${removedLines.map((l) => l.gutter).join(', ')}`
    );

    const contextLines = defaultData.lines.filter((l) => l.isContext);
    assert(
      'Context Lines Have Empty Gutter and Muted Secondary Color',
      contextLines.length === 2 && contextLines.every((l) => l.gutter === ''),
      `contextCount=${contextLines.length}, gutters=${contextLines.map((l) => `"${l.gutter}"`).join(', ')}`
    );

    // 2. Auditing New File Story (All additions)
    console.log('\n[2/6] Auditing New File Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-23-code-diff--new-file&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageNewFile = await pageDark.locator('.ds-story').first();
    await stageNewFile.screenshot({ path: `${ARTIFACT_DIR}/code-diff-new-file-dark.png` });

    const newFileData = await pageDark.locator('[data-slot="code-diff"]').evaluate((el) => {
      const filename = el.querySelector('.ds-code-diff__filename');
      const addStat = el.querySelector('.ds-diff-stat-add');
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const addedLines = el.querySelectorAll('.ds-code-diff__line--added');
      return {
        filename: filename ? filename.textContent.trim() : null,
        addText: addStat ? addStat.textContent.trim() : null,
        remText: remStat ? remStat.textContent.trim() : null,
        addedCount: addedLines.length,
      };
    });

    assert(
      'New File Story Displays +4 −0 and All Added Lines',
      newFileData.filename === 'composer-store.ts' &&
        newFileData.addText === '+4' &&
        newFileData.remText === '−0' &&
        newFileData.addedCount === 6,
      `file="${newFileData.filename}", add="${newFileData.addText}", rem="${newFileData.remText}", addedLines=${newFileData.addedCount}`
    );

    // 3. Auditing Deleted File Story (All deletions)
    console.log('\n[3/6] Auditing Deleted File Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-23-code-diff--deleted-file&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageDeleted = await pageDark.locator('.ds-story').first();
    await stageDeleted.screenshot({ path: `${ARTIFACT_DIR}/code-diff-deleted-file-dark.png` });

    const deletedData = await pageDark.locator('[data-slot="code-diff"]').evaluate((el) => {
      const filename = el.querySelector('.ds-code-diff__filename');
      const addStat = el.querySelector('.ds-diff-stat-add');
      const remStat = el.querySelector('.ds-diff-stat-remove');
      const remLines = el.querySelectorAll('.ds-code-diff__line--removed');
      return {
        filename: filename ? filename.textContent.trim() : null,
        addText: addStat ? addStat.textContent.trim() : null,
        remText: remStat ? remStat.textContent.trim() : null,
        removedCount: remLines.length,
      };
    });

    assert(
      'Deleted File Story Displays +0 −3 and All Removed Lines',
      deletedData.filename === 'legacy-adapter.ts' &&
        deletedData.addText === '+0' &&
        deletedData.remText === '−3' &&
        deletedData.removedCount === 4,
      `file="${deletedData.filename}", add="${deletedData.addText}", rem="${deletedData.remText}", removedLines=${deletedData.removedCount}`
    );

    // 4. Light Mode Audit
    console.log('\n[4/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-23-code-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/code-diff-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="code-diff"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const addLine = el.querySelector('.ds-code-diff__line--added');
      const addS = addLine ? window.getComputedStyle(addLine) : {};
      const remLine = el.querySelector('.ds-code-diff__line--removed');
      const remS = remLine ? window.getComputedStyle(remLine) : {};

      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        addBg: addS.backgroundColor,
        addColor: addS.color,
        remBg: remS.backgroundColor,
        remColor: remS.color,
      };
    });

    assert(
      'Light Mode Tokens for Surface and Tint Washes',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.addColor.includes('16, 163, 127') &&
        (lightStyles.remColor.includes('186, 38, 35') || lightStyles.remColor.includes('250, 66, 62') || lightStyles.remColor.includes('239, 68, 68')),
      `bg=${lightStyles.bg}, border=${lightStyles.border}, addColor=${lightStyles.addColor}, remColor=${lightStyles.remColor}`
    );

    // 5. Gutter Width Geometry
    console.log('\n[5/6] Auditing Gutter Geometry...');
    const gutterWidth = await pageDark.locator('.ds-code-diff__gutter').first().evaluate((el) => {
      return el.getBoundingClientRect().width;
    });
    assert(
      'Gutter Width Exactly 16px',
      Math.abs(gutterWidth - 16) <= 1,
      `gutterWidth=${gutterWidth}px`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-23-code-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-code-diff__line').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Disables Line Animations',
      motionStyles.animation.includes('none') || motionStyles.animation === 'none 0s ease 0s 1 normal none running',
      `animation=${motionStyles.animation}, transition=${motionStyles.transition}`
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
