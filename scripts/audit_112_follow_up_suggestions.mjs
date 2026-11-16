import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #112: Follow-up suggestions AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const chips = await page.$$('[data-slot="followup-chip"]');
  assert(chips.length === 3, `Rendered 3 follow-up suggestion chips (got ${chips.length})`);

  // Chip geometry
  const chipStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      height: cs.height,
      borderRadius: cs.borderRadius,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  }, chips[0]);

  assert(chipStyles.height === '30px', `Chip height is compact 30px (got ${chipStyles.height})`);
  assert(chipStyles.borderRadius === '9999px', `Chip border radius is pill 9999px (got ${chipStyles.borderRadius})`);
  assert(chipStyles.fontSize === '12px', `Chip font-size is 12px (got ${chipStyles.fontSize})`);

  const icon = await page.$('.ds-followup-chip__icon');
  assert(icon !== null, 'Arrow-up-right icon present');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'follow-up-suggestions-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'follow-up-suggestions-default-light.png') });

  // --- Story 2: Single ---
  console.log('\n--- Auditing Single Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--single&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const singleChips = await page.$$('[data-slot="followup-chip"]');
  assert(singleChips.length === 1, `Single story has 1 chip (got ${singleChips.length})`);

  // --- Story 3: WithLabels ---
  console.log('\n--- Auditing WithLabels Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--with-labels&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const titleStyles = await page.$eval('.ds-followup-chip__title', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(titleStyles.fontSize === '12px', `Structured title font-size is 12px (got ${titleStyles.fontSize})`);
  assert(titleStyles.fontWeight === '500', `Structured title font-weight is 500 (got ${titleStyles.fontWeight})`);

  const labelStyles = await page.$eval('.ds-followup-chip__label', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(labelStyles.fontSize === '12px', `Structured label font-size is 12px (got ${labelStyles.fontSize})`);
  assert(labelStyles.fontWeight === '400', `Structured label font-weight is 400 (got ${labelStyles.fontWeight})`);

  // --- Story 4: Overflow ---
  console.log('\n--- Auditing Overflow Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--overflow&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const overflowChips = await page.$$('[data-slot="followup-chip"]');
  assert(overflowChips.length === 6, `Overflow story has 6 chips (got ${overflowChips.length})`);

  const fadeRight = await page.$('.ds-followup-fade-right');
  assert(fadeRight !== null, 'Right edge fade mask present for overflow chips');

  // --- Story 5: InThread ---
  console.log('\n--- Auditing InThread Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--in-thread&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const userBubble = await page.$('.ds-msg-timing-fixture__bubble--user');
  assert(userBubble !== null, 'User message bubble rendered');

  const threadChips = await page.$$('[data-slot="followup-chip"]');
  assert(threadChips.length === 3, `In-thread follow-up suggestions rendered (got ${threadChips.length})`);

  // --- Story 6: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-112-follow-up-suggestions-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="follow-up-suggestions"]');

  const firstChip = await page.$('[data-slot="followup-chip"]');
  const chipPrompt = await firstChip.getAttribute('data-prompt');

  // Click suggestion chip
  await firstChip.click();
  await page.waitForTimeout(150);

  const bubbleText = await page.$eval('[data-slot="user-bubble"]', (el) => el.textContent.trim());
  assert(bubbleText === chipPrompt, `Dispatched prompt into message bubble (got "${bubbleText}")`);

  const updatedChips = await page.$$('[data-slot="followup-chip"]');
  assert(updatedChips.length === 2, `Suggestions updated after dispatch (got ${updatedChips.length})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'follow-up-suggestions-interactive-dark.png') });

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
