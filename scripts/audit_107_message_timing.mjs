import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #107: Message timing AUI...');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
  });

  const page = await context.newPage();
  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- Story 1: Default (Dark & Light) ---
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="message-timing"]');

  const root = await page.$('[data-slot="message-timing"]');
  const rootBox = await root.boundingBox();
  const rootStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      display: cs.display,
      rowGap: cs.rowGap,
      columnGap: cs.columnGap,
    };
  }, root);

  assert(rootStyles.maxWidth === '384px', `Max width is 384px (got ${rootStyles.maxWidth})`);
  assert(rootStyles.display === 'flex', `Display is flex (got ${rootStyles.display})`);
  assert(rootStyles.columnGap === '12px', `Column gap is 12px (got ${rootStyles.columnGap})`);
  assert(rootStyles.rowGap === '4px', `Row gap is 4px (got ${rootStyles.rowGap})`);

  const statItem = await page.$('.ds-msg-timing__stat');
  const labelStyles = await page.evaluate((el) => {
    const lbl = el.querySelector('.ds-msg-timing__label');
    const cs = window.getComputedStyle(lbl);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  }, statItem);

  assert(labelStyles.fontSize === '11px', `Label font-size is 11px (got ${labelStyles.fontSize})`);
  assert(labelStyles.fontWeight === '400', `Label font-weight is 400 (got ${labelStyles.fontWeight})`);

  const valStyles = await page.evaluate((el) => {
    const val = el.querySelector('.ds-msg-timing__val');
    const cs = window.getComputedStyle(val);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      tabularNums: cs.fontVariantNumeric,
    };
  }, statItem);

  assert(valStyles.fontSize === '11px', `Value font-size is 11px (got ${valStyles.fontSize})`);
  assert(valStyles.fontWeight === '400', `Value font-weight is 400 (got ${valStyles.fontWeight})`);
  assert(valStyles.tabularNums.includes('tabular-nums'), `Tabular nums enabled (got ${valStyles.tabularNums})`);

  const statCount = await page.$$eval('.ds-msg-timing__stat', (els) => els.length);
  assert(statCount === 4, `Has 4 timing stats (got ${statCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'message-timing-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="message-timing"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'message-timing-default-light.png') });

  // --- Story 2: Streaming ---
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--streaming&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="message-timing"]');

  const hasDot = await page.$('.ds-msg-timing__dot');
  assert(hasDot !== null, 'Pulsing live streaming dot is present');

  const streamingVal = await page.$('.ds-msg-timing__val--streaming');
  assert(streamingVal !== null, 'Streaming value has active streaming class');

  const streamingStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontWeight: cs.fontWeight,
    };
  }, streamingVal);
  assert(streamingStyles.fontWeight === '400', `Streaming value font-weight is 400 (got ${streamingStyles.fontWeight})`);

  // --- Story 3: SubSecond ---
  console.log('\n--- Auditing SubSecond Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--sub-second&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="message-timing"]');

  const subStats = await page.$$eval('.ds-msg-timing__val', (els) => els.map((e) => e.textContent.trim()));
  assert(subStats.includes('412ms'), `Contains sub-second total 412ms (got ${subStats.join(', ')})`);
  assert(subStats.includes('9.7'), `Contains tok/s 9.7`);

  // --- Story 4: LongRun ---
  console.log('\n--- Auditing LongRun Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--long-run&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="message-timing"]');

  const longStats = await page.$$eval('.ds-msg-timing__val', (els) => els.map((e) => e.textContent.trim()));
  assert(longStats.includes('48.6s'), `Contains long run total 48.6s`);
  assert(longStats.includes('2,904'), `Contains token count 2,904`);

  // --- Story 5: InMessage ---
  console.log('\n--- Auditing InMessage Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--in-message&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="timing-fixture"]');

  const fixtureBox = await page.$eval('[data-slot="timing-fixture"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
    };
  });
  assert(fixtureBox.maxWidth === '480px', `Fixture max-width is 480px (got ${fixtureBox.maxWidth})`);
  assert(fixtureBox.borderRadius === '20px', `Fixture border radius is 20px (got ${fixtureBox.borderRadius})`);

  const userBubble = await page.$('.ds-msg-timing-fixture__bubble--user');
  assert(userBubble !== null, 'User message bubble rendered');

  // --- Story 6: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-107-message-timing-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="interactive-timing-fixture"]');

  const simBtn = await page.$('[data-action="simulate-run"]');
  assert(simBtn !== null, 'Simulate Run button exists');

  // Click Simulate Run
  await simBtn.click();
  await page.waitForTimeout(300);

  const isSimDisabled = await page.$eval('[data-action="simulate-run"]', (btn) => btn.disabled);
  assert(isSimDisabled === true, 'Simulate button disabled during live streaming');

  const activeDot = await page.$('.ds-msg-timing__dot');
  assert(activeDot !== null, 'Active live dot present while streaming');

  // Wait for stream to finish (approx 1.3s)
  await page.waitForTimeout(1400);

  const finishedDisabled = await page.$eval('[data-action="simulate-run"]', (btn) => btn.disabled);
  assert(finishedDisabled === false, 'Simulate button re-enabled after stream completes');

  const completedVals = await page.$$eval('.ds-msg-timing__val', (els) => els.map((e) => e.textContent.trim()));
  assert(completedVals.includes('1.24s'), `Final stats rendered with total 1.24s`);

  // Click reset
  const resetBtn = await page.$('[data-action="reset-run"]');
  await resetBtn.click();
  await page.waitForTimeout(100);

  const resetVals = await page.$$eval('.ds-msg-timing__val', (els) => els.map((e) => e.textContent.trim()));
  assert(resetVals.includes('ready'), `Reset restored ready state`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'message-timing-interactive-dark.png') });

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
