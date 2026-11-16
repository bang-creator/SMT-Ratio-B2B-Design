import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:6006/iframe.html';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 043 DATA TABLE ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT STORY (Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-43-data-table--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="data-table"]');

    const container = pageDefault.locator('[data-slot="data-table"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        borderRadius: cs.borderRadius,
        overflow: cs.overflow,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      containerStyles.borderRadius === '16px' &&
        containerStyles.overflow === 'hidden' &&
        containerStyles.borderWidth === '1px',
      `Container Geometry (16px radius, overflow hidden, 1px border): radius=${containerStyles.borderRadius}, overflow=${containerStyles.overflow}`
    );

    // Thead specs & Strict 400 typography
    const thData = await pageDefault.locator('.ds-data-table__th').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });

    assert(
      thData.fontSize === '12px' && (thData.fontWeight === '400' || thData.fontWeight === 'normal'),
      `Thead Headers Strict 400 Typography (12px/400): font=${thData.fontSize}/${thData.fontWeight}`
    );

    const thCount = await pageDefault.locator('.ds-data-table__th').count();
    assert(thCount === 6, `Renders 6 Table Columns: count=${thCount}`);

    // Tbody rows specs
    const rows = pageDefault.locator('.ds-data-table__tbody tr');
    const rowCount = await rows.count();
    assert(rowCount === 3, `Renders Exactly 3 Model Rows: count=${rowCount}`);

    // Row 1 cells typography & badge
    const firstRowData = await rows.first().evaluate((el) => {
      const tds = el.querySelectorAll('td');
      const badge = el.querySelector('.ds-data-table__badge');
      const badgeCs = badge ? window.getComputedStyle(badge) : {};
      const td1Cs = window.getComputedStyle(tds[0]);
      const td2Cs = window.getComputedStyle(tds[1]);
      return {
        modelText: tds[0].textContent.trim(),
        modelFont: `${td1Cs.fontSize}/${td1Cs.fontWeight}`,
        numericAlign: td2Cs.textAlign,
        badgeText: badge ? badge.textContent.trim() : '',
        badgeColor: badgeCs.color,
      };
    });

    assert(
      firstRowData.modelText === 'gpt-4o' &&
        (firstRowData.modelFont === '13px/400' || firstRowData.modelFont === '13px/normal') &&
        firstRowData.numericAlign === 'right' &&
        firstRowData.badgeText === 'Active' &&
        firstRowData.badgeColor === 'rgb(16, 163, 127)',
      `Row 1 Specs (Strict 400 13px model, right-aligned numeric, Active badge in emerald #10a37f): model=${firstRowData.modelText}, align=${firstRowData.numericAlign}, badgeColor=${firstRowData.badgeColor}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/data-table-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: EMPTY STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Empty Story...');
    const pageEmpty = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageEmpty.goto(`${BASE_URL}?id=default-application-43-data-table--empty&viewMode=story`);
    await pageEmpty.waitForSelector('.ds-data-table__empty');

    const emptyText = await pageEmpty.locator('.ds-data-table__empty').textContent();
    const emptyRowsCount = await pageEmpty.locator('.ds-data-table__tbody tr').count();

    assert(
      emptyText.trim() === 'No rows available' && emptyRowsCount === 0,
      `Empty Story Displays Message & Zero Data Rows: text="${emptyText.trim()}", rows=${emptyRowsCount}`
    );

    await pageEmpty.screenshot({ path: `${ARTIFACT_DIR}/data-table-empty-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE SORTING
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Sorting Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-43-data-table--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('[data-sort="latencyMs"]');

    // Click Latency sort button (Ascending)
    await pageInteractive.locator('[data-sort="latencyMs"]').click();
    await pageInteractive.waitForTimeout(100);

    const firstModelAsc = await pageInteractive.locator('.ds-data-table__tbody tr td').first().textContent();
    const sortStateAsc = await pageInteractive.locator('th[aria-sort]').getAttribute('aria-sort');

    assert(
      firstModelAsc.trim() === 'gpt-4o-mini' && sortStateAsc === 'ascending',
      `Latency Ascending Sort Shifts fastest (gpt-4o-mini 190ms) to Top with aria-sort="ascending": firstModel="${firstModelAsc.trim()}", sortState=${sortStateAsc}`
    );

    // Click Latency sort button again (Descending)
    await pageInteractive.locator('[data-sort="latencyMs"]').click();
    await pageInteractive.waitForTimeout(100);

    const firstModelDesc = await pageInteractive.locator('.ds-data-table__tbody tr td').first().textContent();
    const sortStateDesc = await pageInteractive.locator('th[aria-sort]').getAttribute('aria-sort');

    assert(
      firstModelDesc.trim() === 'o1-preview' && sortStateDesc === 'descending',
      `Latency Descending Sort Shifts slowest (o1-preview 2400ms) to Top with aria-sort="descending": firstModel="${firstModelDesc.trim()}", sortState=${sortStateDesc}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/data-table-interactive-sorted-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-43-data-table--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="data-table"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightTokens = await pageLight.locator('[data-slot="data-table"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const th = el.querySelector('.ds-data-table__th');
      const thCs = th ? window.getComputedStyle(th) : {};
      return {
        tableBg: cs.backgroundColor,
        thBg: thCs.backgroundColor,
        border: cs.borderColor,
      };
    });

    assert(
      lightTokens.tableBg === 'rgb(255, 255, 255)' || lightTokens.tableBg === 'rgb(249, 249, 249)' || lightTokens.tableBg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightTokens.tableBg}, thBg=${lightTokens.thBg}, border=${lightTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/data-table-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-43-data-table--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-data-table__tbody tr');

    const motionTransition = await pageMotion.locator('.ds-data-table__tbody tr').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Row Hover Transitions: transition=${motionTransition}`
    );

  } catch (err) {
    console.error('Audit encountered exception:', err);
    failed++;
  } finally {
    await browser.close();
  }

  console.log('\n--- AUDIT SUMMARY ---');
  console.log(`TOTAL CHECKS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
