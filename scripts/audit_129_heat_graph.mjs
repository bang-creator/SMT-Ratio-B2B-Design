import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-129-heat-graph-aui';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const page = await context.newPage();

  let passed = 0, total = 0;

  function check(name, pass, detail) {
    total++;
    if (pass) { passed++; console.log(`  ✓ ${name}`); }
    else { console.error(`  ✗ ${name} — ${detail}`); }
  }

  try {
    console.log('Auditing #129 Heat Graph AUI...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-heat-graph-wrap');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'heat-graph-default-dark.png') });

    // Heat grid exists
    const grid = page.locator('.ds-heat-grid');
    check('Heat grid container renders', await grid.count() > 0, 'not found');

    // Check cells 364 total (52 cols x 7 rows)
    const cells = page.locator('.ds-heat-cell');
    const cellCount = await cells.count();
    check('Grid contains >= 364 heat cells (52 weeks * 7 days)', cellCount >= 364, `${cellCount}`);

    // Cell geometry: 9x9px
    const firstCell = cells.first();
    const firstCellBox = await firstCell.boundingBox();
    check('Heat cell is 9x9px', Math.round(firstCellBox.width) === 9 && Math.round(firstCellBox.height) === 9, `${firstCellBox?.width}x${firstCellBox?.height}`);

    // Check cell border-radius 2px
    const cellBR = await firstCell.evaluate(el => window.getComputedStyle(el).borderRadius);
    check('Cell border-radius is 2px (rounded-sm)', cellBR === '2px', cellBR);

    // Header typography: 12px / 400
    const header = page.locator('.ds-heat-graph-wrap__header');
    const headerStyles = await header.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Header font-size is 12px (xs)', headerStyles.fontSize === '12px', headerStyles.fontSize);
    check('Header font-weight is 400 (strict normal rule)', headerStyles.fontWeight === '400', headerStyles.fontWeight);

    // Legend typography: 12px / 400
    const legend = page.locator('.ds-heat-graph-wrap__legend');
    const legendStyles = await legend.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Legend font-size is 12px', legendStyles.fontSize === '12px', legendStyles.fontSize);
    check('Legend font-weight is 400', legendStyles.fontWeight === '400', legendStyles.fontWeight);

    // Check level 0 cell is distinct background (surface-secondary)
    const level0Cell = page.locator('.ds-heat-cell--0').first();
    const l0bg = await level0Cell.evaluate(el => window.getComputedStyle(el).backgroundColor);
    check('Level 0 cell has background (non-transparent)', l0bg !== 'rgba(0, 0, 0, 0)' && l0bg !== 'transparent', l0bg);

    // Check level 4 cell is most opaque
    const level4Cell = page.locator('.ds-heat-cell--4').first();
    const l4bg = await level4Cell.evaluate(el => window.getComputedStyle(el).backgroundColor);
    check('Level 4 cell has distinctly colored background (highest intensity)', l4bg !== l0bg, `l4=${l4bg}, l0=${l0bg}`);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-heat-graph-wrap');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'heat-graph-default-light.png') });

    // ── Empty Story ──
    await page.goto(`${BASE_URL}--empty&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-heat-cell', { state: 'attached' });
    // Count level-4 cells INSIDE the grid only (legend has them too as color swatches)
    const level4InGridEmpty = await page.evaluate(() => {
      const grid = document.querySelector('.ds-heat-grid');
      if (!grid) return 0;
      return grid.querySelectorAll('.ds-heat-cell--4').length;
    });
    check('Empty story grid has zero level-4 cells', level4InGridEmpty === 0, `${level4InGridEmpty}`);

    // ── Sparse Story ──
    await page.goto(`${BASE_URL}--sparse&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-heat-cell', { state: 'attached' });
    const activeCellsSparse = page.locator('.ds-heat-cell:not(.ds-heat-cell--0)');
    const sparseCount = await activeCellsSparse.count();
    check('Sparse story has some active cells but fewer than 50', sparseCount > 0 && sparseCount < 50, `${sparseCount}`);

    // ── Recent Burst Story ──
    await page.goto(`${BASE_URL}--recent-burst&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-heat-cell', { state: 'attached' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'heat-graph-recent-burst-dark.png') });
    const activeCellsRecent = page.locator('.ds-heat-cell:not(.ds-heat-cell--0)');
    const recentCount = await activeCellsRecent.count();
    check('Recent burst story has active cells', recentCount > 0, `${recentCount}`);

    // Container max-width check
    const wrap = page.locator('.ds-heat-graph-wrap');
    const wrapStyles = await wrap.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { maxWidth: cs.maxWidth, borderRadius: cs.borderRadius };
    });
    check('Wrap has max-width constraint (640px)', parseInt(wrapStyles.maxWidth) >= 300, wrapStyles.maxWidth);
    check('Wrap has border-radius (rounded card)', parseFloat(wrapStyles.borderRadius) >= 8, wrapStyles.borderRadius);

    console.log(`\nAudit finished: ${passed}/${total} passed`);
    if (passed < total) process.exit(1);
  } catch (err) {
    console.error('Audit runtime error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
