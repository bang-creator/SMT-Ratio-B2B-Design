import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html';

async function run() {
  console.log('--- AUDITING #068 AGENT HANDOFF ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1000, height: 800 });

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  // 1. Default (Active) Dark State
  await page.goto(`${BASE_URL}?id=default-application-68-agent-handoff--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="agent-handoff"]');

  const container = page.locator('[data-slot="agent-handoff"]');
  const containerBox = await container.boundingBox();
  assert(containerBox.width <= 385, `Container max-width is <= 384px (got ${containerBox.width}px)`);

  // From Pill
  const fromPill = page.locator('.ds-agent-handoff__pill--from');
  const fromPillStyles = await fromPill.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      opacity: s.opacity,
    };
  });
  assert(parseInt(fromPillStyles.borderRadius) >= 16, `From pill is rounded-full (got ${fromPillStyles.borderRadius})`);
  assert(fromPillStyles.fontSize === '12px' && fromPillStyles.fontWeight === '400', `From pill typography is 12px/400 (got ${fromPillStyles.fontSize}/${fromPillStyles.fontWeight})`);
  assert(fromPillStyles.opacity === '1', `Active from pill opacity is 1 (got ${fromPillStyles.opacity})`);

  // To Pill (Active state)
  const toPill = page.locator('.ds-agent-handoff__pill--to');
  const toPillStyles = await toPill.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      color: s.color,
    };
  });
  assert(parseInt(toPillStyles.borderRadius) >= 16, `To pill is rounded-full (got ${toPillStyles.borderRadius})`);
  assert(toPillStyles.fontSize === '12px' && toPillStyles.fontWeight === '400', `To pill typography is 12px/400 (got ${toPillStyles.fontSize}/${toPillStyles.fontWeight})`);

  // Arrow
  const arrow = page.locator('.ds-agent-handoff__arrow');
  const arrowBox = await arrow.boundingBox();
  assert(arrowBox.width === 14 && arrowBox.height === 14, `Arrow is 14x14px (got ${arrowBox.width}x${arrowBox.height})`);

  // Reason
  const reason = page.locator('.ds-agent-handoff__reason');
  const reasonStyles = await reason.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  });
  assert(reasonStyles.fontSize === '12px' && reasonStyles.fontWeight === '400', `Reason typography is 12px/400 (got ${reasonStyles.fontSize}/${reasonStyles.fontWeight})`);

  // Carried section
  const carriedLabel = page.locator('.ds-agent-handoff__carried-label');
  const carriedLabelStyles = await carriedLabel.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, fontFamily: s.fontFamily };
  });
  assert(carriedLabelStyles.fontSize === '11px' && carriedLabelStyles.fontWeight === '400', `Carried label is 11px/400 mono (got ${carriedLabelStyles.fontSize}/${carriedLabelStyles.fontWeight})`);

  const carriedItem = page.locator('.ds-agent-handoff__carried-item').first();
  const carriedItemStyles = await carriedItem.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      borderLeftWidth: s.borderLeftWidth,
      paddingLeft: s.paddingLeft,
    };
  });
  assert(carriedItemStyles.fontSize === '12px' && carriedItemStyles.fontWeight === '400', `Carried item typography is 12px/400 (got ${carriedItemStyles.fontSize}/${carriedItemStyles.fontWeight})`);
  assert(carriedItemStyles.borderLeftWidth === '1px' && carriedItemStyles.paddingLeft === '10px', `Carried item has border-left 1px and padding-left 10px (got border=${carriedItemStyles.borderLeftWidth}, pl=${carriedItemStyles.paddingLeft})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-handoff-default-dark.png') });

  // 2. Settled Dark State
  await page.goto(`${BASE_URL}?id=default-application-68-agent-handoff--settled&globals=theme:dark`);
  await page.waitForSelector('[data-slot="agent-handoff"]');

  const settledFromOpacity = await page.locator('.ds-agent-handoff__pill--from').evaluate((el) => window.getComputedStyle(el).opacity);
  assert(parseFloat(settledFromOpacity) <= 0.5 && parseFloat(settledFromOpacity) >= 0.4, `Settled from pill opacity is ~0.45 (got ${settledFromOpacity})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-handoff-settled-dark.png') });

  // 3. Interactive State Test
  await page.goto(`${BASE_URL}?id=default-application-68-agent-handoff--interactive&globals=theme:dark`);
  await page.waitForSelector('.ds-agent-handoff-interactive-wrapper');

  // Click Settle
  await page.click('[data-btn-toggle]');
  const isSettledAfterClick = await page.locator('[data-settled="true"]').count();
  assert(isSettledAfterClick === 1, `Interactive click settles handoff`);

  // Click Restart
  await page.click('[data-btn-toggle]');
  const isSettledAfterRestart = await page.locator('[data-settled="true"]').count();
  assert(isSettledAfterRestart === 0, `Interactive click restarts handoff to active`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-handoff-interactive-dark.png') });

  // 4. Light Theme Screenshot
  await page.goto(`${BASE_URL}?id=default-application-68-agent-handoff--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="agent-handoff"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agent-handoff-default-light.png') });

  console.log(`\nRESULT: ${passed}/${total} assertions passed.`);
  await browser.close();

  if (passed !== total) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
