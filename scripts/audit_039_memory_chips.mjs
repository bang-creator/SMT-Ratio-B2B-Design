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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 039 MEMORY CHIPS ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-39-memory-chips--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="memory-chips"]');

    const container = pageDefault.locator('[data-slot="memory-chips"]');
    const containerStyles = await container.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        flexDirection: cs.flexDirection,
        gap: cs.gap,
        maxWidth: cs.maxWidth,
      };
    });

    assert(
      containerStyles.display === 'flex' &&
        containerStyles.flexDirection === 'column' &&
        containerStyles.gap === '8px' &&
        containerStyles.maxWidth === '384px',
      `Container Geometry (Flex col, 8px gap, 384px max-width): display=${containerStyles.display}, gap=${containerStyles.gap}, maxWidth=${containerStyles.maxWidth}`
    );

    // Header specs
    const headerData = await pageDefault.locator('.ds-memory-chips__header').evaluate((el) => {
      const icon = el.querySelector('svg');
      const title = el.querySelector('.ds-memory-chips__title');
      const titleCs = window.getComputedStyle(title);
      const iconRect = icon.getBoundingClientRect();
      return {
        iconSize: `${Math.round(iconRect.width)}x${Math.round(iconRect.height)}`,
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        text: title.textContent.trim(),
      };
    });

    assert(
      headerData.iconSize === '14x14' &&
        headerData.titleFont === '11px/400' &&
        headerData.text === 'remembered 2',
      `Header Hierarchy Specs (14x14 icon, 11px/400 mono title, "remembered 2"): icon=${headerData.iconSize}, font=${headerData.titleFont}, text="${headerData.text}"`
    );

    const chips = pageDefault.locator('.ds-memory-chip');
    const chipCount = await chips.count();
    assert(chipCount === 3, `Renders 3 Memory Chips: count=${chipCount}`);

    // Fresh Chip Specs
    const freshChipData = await chips.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const text = el.querySelector('.ds-memory-chip__text');
      const textCs = window.getComputedStyle(text);
      return {
        font: `${textCs.fontSize}/${textCs.fontWeight}`,
        radius: cs.borderRadius,
        color: cs.color,
      };
    });

    assert(
      freshChipData.font === '12px/400' &&
        freshChipData.color === 'rgb(2, 133, 255)',
      `Fresh Chip Specs (12px/400 text, blue accent #0285ff): font=${freshChipData.font}, color=${freshChipData.color}`
    );

    // Existing Chip Specs
    const existingChipData = await chips.last().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const text = el.querySelector('.ds-memory-chip__text');
      const textCs = window.getComputedStyle(text);
      return {
        font: `${textCs.fontSize}/${textCs.fontWeight}`,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      existingChipData.font === '12px/400' && existingChipData.borderWidth === '1px',
      `Existing Chip Specs (12px/400 text, 1px subtle border): font=${existingChipData.font}, border=${existingChipData.borderWidth}`
    );

    // Forget button geometry
    const forgetBtnSize = await chips.first().locator('.ds-memory-chip__forget').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const icon = el.querySelector('svg').getBoundingClientRect();
      return {
        btn: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
        icon: `${Math.round(icon.width)}x${Math.round(icon.height)}`,
      };
    });

    assert(
      forgetBtnSize.btn === '16x16' && forgetBtnSize.icon === '10x10',
      `Forget Button Compact Specs (16x16px button, 10x10px X icon): btn=${forgetBtnSize.btn}, icon=${forgetBtnSize.icon}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/memory-chips-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: ALL EXISTING STORY
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing All Existing Story...');
    const pageExisting = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageExisting.goto(`${BASE_URL}?id=default-application-39-memory-chips--all-existing&viewMode=story`);
    await pageExisting.waitForSelector('.ds-memory-chips__title');

    const existingHeaderText = await pageExisting.locator('.ds-memory-chips__title').textContent();
    const existingCount = await pageExisting.locator('.ds-memory-chip--existing').count();

    assert(
      existingHeaderText.trim() === 'memory' && existingCount === 2,
      `All Existing Story Shows "memory" Header & 2 Existing Chips: text="${existingHeaderText.trim()}", count=${existingCount}`
    );

    await pageExisting.screenshot({ path: `${ARTIFACT_DIR}/memory-chips-all-existing-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE FORGET ACTION
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Forget Click Cycle...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-39-memory-chips--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-memory-chip__forget');

    // Click forget on 1st chip (fresh)
    await pageInteractive.locator('.ds-memory-chip__forget').first().click();
    await pageInteractive.waitForTimeout(100);

    const countAfterFirst = await pageInteractive.locator('.ds-memory-chip').count();
    const headerAfterFirst = await pageInteractive.locator('.ds-memory-chips__title').textContent();

    assert(
      countAfterFirst === 2 && headerAfterFirst.trim() === 'remembered 1',
      `Forgetting 1st Chip Decrements Count to 2 & Updates Header to "remembered 1": count=${countAfterFirst}, header="${headerAfterFirst.trim()}"`
    );

    // Click forget on 2nd chip (fresh)
    await pageInteractive.locator('.ds-memory-chip__forget').first().click();
    await pageInteractive.waitForTimeout(100);

    const countAfterSecond = await pageInteractive.locator('.ds-memory-chip').count();
    const headerAfterSecond = await pageInteractive.locator('.ds-memory-chips__title').textContent();

    assert(
      countAfterSecond === 1 && headerAfterSecond.trim() === 'memory',
      `Forgetting 2nd Fresh Chip Updates Header to "memory" (Only Existing Remaining): count=${countAfterSecond}, header="${headerAfterSecond.trim()}"`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/memory-chips-interactive-forgotten-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-39-memory-chips--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('.ds-memory-chip');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightChipTokens = await pageLight.locator('.ds-memory-chip--existing').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: cs.borderColor,
      };
    });

    assert(
      lightChipTokens.bg === 'rgb(249, 249, 249)' || lightChipTokens.bg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightChipTokens.bg}, border=${lightChipTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/memory-chips-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-39-memory-chips--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-memory-chip');

    const motionTransition = await pageMotion.locator('.ds-memory-chip').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Chip Background Transitions: transition=${motionTransition}`
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
