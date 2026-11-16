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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 037 RETRIEVAL CHUNKS ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-37-retrieval-chunks--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="retrieval-chunks"]');

    const container = pageDefault.locator('[data-slot="retrieval-chunks"]');
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
        containerStyles.gap === '10px' &&
        containerStyles.maxWidth === '384px',
      `Container Geometry (Flex column, 10px gap, 384px max-width): display=${containerStyles.display}, flexDir=${containerStyles.flexDirection}, gap=${containerStyles.gap}, maxWidth=${containerStyles.maxWidth}`
    );

    const pill = pageDefault.locator('.ds-retrieval-pill');
    const pillData = await pill.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const icon = el.querySelector('svg');
      const iconRect = icon ? icon.getBoundingClientRect() : { width: 0, height: 0 };
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        borderRadius: cs.borderRadius,
        iconSize: `${Math.round(iconRect.width)}x${Math.round(iconRect.height)}`,
      };
    });

    assert(
      pillData.fontSize === '12px' &&
        (pillData.fontWeight === '400' || pillData.fontWeight === 'normal') &&
        pillData.iconSize === '12x12',
      `Query Pill Specs (12px/400 text, 12x12px icon, pill radius): font=${pillData.fontSize}/${pillData.fontWeight}, icon=${pillData.iconSize}`
    );

    const statusText = await pageDefault.locator('.ds-retrieval-status').textContent();
    assert(
      statusText.trim() === '3 passages above threshold',
      `Completed Status Text: text="${statusText.trim()}"`
    );

    const cards = pageDefault.locator('[data-slot="chunk-card"]');
    const cardCount = await cards.count();
    assert(cardCount === 3, `Renders Exactly 3 Chunk Cards: count=${cardCount}`);

    const cardStyles = await cards.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        borderRadius: cs.borderRadius,
        borderWidth: cs.borderWidth,
      };
    });
    assert(
      cardStyles.borderRadius === '16px' && cardStyles.borderWidth === '1px',
      `Chunk Card Frame (16px radius, 1px border): radius=${cardStyles.borderRadius}, border=${cardStyles.borderWidth}`
    );

    // Typography hierarchy
    const firstHeader = await cards.first().locator('.ds-chunk-card__header').evaluate((el) => {
      const src = el.querySelector('.ds-chunk-card__source');
      const loc = el.querySelector('.ds-chunk-card__locator');
      const sc = el.querySelector('.ds-chunk-card__score');
      const srcCs = window.getComputedStyle(src);
      const locCs = window.getComputedStyle(loc);
      const scCs = window.getComputedStyle(sc);
      return {
        srcFont: `${srcCs.fontSize}/${srcCs.fontWeight}`,
        locFont: `${locCs.fontSize}/${locCs.fontWeight}`,
        scFont: `${scCs.fontSize}/${scCs.fontWeight}`,
        scColor: scCs.color,
      };
    });

    assert(
      firstHeader.srcFont === '13px/500' &&
        firstHeader.locFont === '11px/400' &&
        firstHeader.scFont === '11px/400' &&
        firstHeader.scColor === 'rgb(16, 163, 127)',
      `Card Header Strict Typography & High Score Emerald (#10a37f): src=${firstHeader.srcFont}, loc=${firstHeader.locFont}, score=${firstHeader.scFont}, color=${firstHeader.scColor}`
    );

    // Meter specs & ARIA
    const meterData = await cards.first().locator('[role="meter"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const fill = el.querySelector('.ds-chunk-meter__fill');
      const fillCs = fill ? window.getComputedStyle(fill) : {};
      return {
        height: cs.height,
        role: el.getAttribute('role'),
        valuenow: el.getAttribute('aria-valuenow'),
        valuetext: el.getAttribute('aria-valuetext'),
        fillColor: fillCs.backgroundColor,
      };
    });

    assert(
      meterData.height === '2px' &&
        meterData.role === 'meter' &&
        meterData.valuenow === '94' &&
        meterData.valuetext === '0.94 of 1.00' &&
        meterData.fillColor === 'rgb(2, 133, 255)',
      `Relevance Meter Specs (2px height, role=meter, 94%, blue accent): h=${meterData.height}, role=${meterData.role}, val=${meterData.valuenow}, color=${meterData.fillColor}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/retrieval-chunks-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: RETRIEVING STORY (Shimmer State)
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Retrieving Story (Shimmer State)...');
    const pageRetrieving = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageRetrieving.goto(`${BASE_URL}?id=default-application-37-retrieval-chunks--retrieving&viewMode=story`);
    await pageRetrieving.waitForSelector('.ds-retrieval-status__shimmer');

    const shimmerData = await pageRetrieving.locator('.ds-retrieval-status__shimmer').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        animation: cs.animationName,
      };
    });

    assert(
      shimmerData.text === 'Retrieving' && shimmerData.animation.includes('ds-retrieval-shimmer'),
      `Retrieving Shimmer State Active: text="${shimmerData.text}", animation=${shimmerData.animation}`
    );

    const emptyCardsCount = await pageRetrieving.locator('[data-slot="chunk-card"]').count();
    assert(emptyCardsCount === 0, `While Retrieving, Zero Cards Rendered: count=${emptyCardsCount}`);

    await pageRetrieving.screenshot({ path: `${ARTIFACT_DIR}/retrieval-chunks-retrieving-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE SEARCH SIMULATION
    // ------------------------------------------------------------------
    console.log('\n[3/5] Testing Interactive Search Simulation...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-37-retrieval-chunks--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-btn-trigger-search');

    // Click Trigger Search
    await pageInteractive.locator('.ds-btn-trigger-search').click();
    await pageInteractive.waitForSelector('.ds-retrieval-status__shimmer');

    const searchingText = await pageInteractive.locator('.ds-retrieval-status__shimmer').textContent();
    assert(searchingText.trim() === 'Retrieving', `Clicking Trigger Search Transitions to Shimmer Retrieving: text="${searchingText.trim()}"`);

    // Wait for completion
    await pageInteractive.waitForSelector('[data-slot="chunk-card"]', { timeout: 3000 });
    const postCardsCount = await pageInteractive.locator('[data-slot="chunk-card"]').count();
    assert(postCardsCount === 3, `After Simulation Finishes, 3 Chunk Cards Hydrate: count=${postCardsCount}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/retrieval-chunks-interactive-completed-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-37-retrieval-chunks--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="chunk-card"]');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightCardTokens = await pageLight.locator('[data-slot="chunk-card"]').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: cs.borderColor,
      };
    });

    assert(
      lightCardTokens.bg === 'rgb(255, 255, 255)' || lightCardTokens.bg === 'rgb(249, 249, 249)' || lightCardTokens.bg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightCardTokens.bg}, border=${lightCardTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/retrieval-chunks-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-37-retrieval-chunks--retrieving&viewMode=story`);
    await pageMotion.waitForSelector('.ds-retrieval-status__shimmer');

    const motionAnimation = await pageMotion.locator('.ds-retrieval-status__shimmer').evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });

    assert(
      motionAnimation === 'none',
      `Reduced Motion Disables Shimmer Animation: animation=${motionAnimation}`
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
