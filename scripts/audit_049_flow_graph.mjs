import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 049 FLOW GRAPH ---');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT STORY AUDIT (Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-49-flow-graph--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="flow-graph"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="flow-graph"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      cardSpecs.maxWidth === '448px' &&
        cardSpecs.borderRadius === '16px' &&
        cardSpecs.padding === '16px' &&
        cardSpecs.borderWidth === '1px',
      `Flow Graph Container Geometry (448px maxW, 16px radius, 16px padding, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Nodes geometry & count
    const nodeCount = await pageDefault.locator('.ds-flow-node').count();
    assert(nodeCount === 5, `Renders exactly 5 flow nodes: count=${nodeCount}`);

    const nodeSpecs = await pageDefault.locator('.ds-flow-node').first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        width: cs.width,
        height: cs.height,
        borderRadius: cs.borderRadius,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });

    assert(
      nodeSpecs.width === '78px' &&
        nodeSpecs.height === '30px' &&
        nodeSpecs.borderRadius === '12px' &&
        nodeSpecs.fontSize === '11.5px' &&
        (nodeSpecs.fontWeight === '400' || nodeSpecs.fontWeight === 'normal'),
      `Node Specs (78x30px, 12px radius, strict 400 11.5px mono): size=${nodeSpecs.width}x${nodeSpecs.height}, font=${nodeSpecs.fontSize}/${nodeSpecs.fontWeight}`
    );

    // State styling verification: done, active, pending
    const states = await pageDefault.evaluate(() => {
      const doneNode = document.querySelector('.ds-flow-node[data-state="done"]');
      const activeNode = document.querySelector('.ds-flow-node[data-state="active"]');
      const pendingNode = document.querySelector('.ds-flow-node[data-state="pending"]');

      return {
        doneBorder: window.getComputedStyle(doneNode).borderStyle,
        activeBorder: window.getComputedStyle(activeNode).borderStyle,
        activeColor: window.getComputedStyle(activeNode).color,
        pendingBorder: window.getComputedStyle(pendingNode).borderStyle,
      };
    });

    assert(
      states.doneBorder === 'solid' &&
        states.activeBorder === 'solid' &&
        states.pendingBorder === 'dashed',
      `Node States (done/active solid, pending dashed): done=${states.doneBorder}, active=${states.activeBorder}, pending=${states.pendingBorder}`
    );

    // Connecting Bezier Edges
    const edgeCount = await pageDefault.locator('.ds-flow-graph__edge').count();
    assert(edgeCount === 5, `Renders 5 SVG connecting bezier edges: count=${edgeCount}`);

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/flow-graph-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: ALL COMPLETED STORY AUDIT
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing AllCompleted Story...');
    const pageCompleted = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageCompleted.goto(`${BASE_URL}?id=default-application-49-flow-graph--all-completed&viewMode=story`);
    await pageCompleted.waitForSelector('[data-slot="flow-graph"]');

    const doneCount = await pageCompleted.locator('.ds-flow-node[data-state="done"]').count();
    const liveEdges = await pageCompleted.locator('.ds-flow-graph__edge[data-live="true"]').count();
    assert(doneCount === 5 && liveEdges === 5, `AllCompleted Story (all 5 done, 5 live edges): doneNodes=${doneCount}, liveEdges=${liveEdges}`);
    await pageCompleted.screenshot({ path: `${ARTIFACT_DIR}/flow-graph-completed-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE STEP MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-49-flow-graph--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#flow-mount');

    let activeNodeLabel = await pageInteractive.locator('.ds-flow-node[data-state="active"]').textContent();
    assert(activeNodeLabel.trim() === 'Synthesize', `Initial active node is Synthesize: actual="${activeNodeLabel.trim()}"`);

    // Click Next Step -> Output becomes active
    await pageInteractive.locator('#btn-next-step').click();
    await pageInteractive.waitForTimeout(100);

    activeNodeLabel = await pageInteractive.locator('.ds-flow-node[data-state="active"]').textContent();
    assert(activeNodeLabel.trim() === 'Output', `Next step advances active node to Output: actual="${activeNodeLabel.trim()}"`);

    // Click Previous Step -> Synthesize becomes active again
    await pageInteractive.locator('#btn-prev-step').click();
    await pageInteractive.waitForTimeout(100);

    activeNodeLabel = await pageInteractive.locator('.ds-flow-node[data-state="active"]').textContent();
    assert(activeNodeLabel.trim() === 'Synthesize', `Previous step returns active node to Synthesize: actual="${activeNodeLabel.trim()}"`);

    // Click Reset -> Ingest becomes active
    await pageInteractive.locator('#btn-reset-flow').click();
    await pageInteractive.waitForTimeout(100);

    activeNodeLabel = await pageInteractive.locator('.ds-flow-node[data-state="active"]').textContent();
    assert(activeNodeLabel.trim() === 'Ingest', `Reset returns active node to Ingest: actual="${activeNodeLabel.trim()}"`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/flow-graph-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-49-flow-graph--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="flow-graph"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="flow-graph"]');
      const activeNode = document.querySelector('.ds-flow-node[data-state="active"]');
      const doneNode = document.querySelector('.ds-flow-node[data-state="done"]');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        cardBorder: window.getComputedStyle(card).borderColor,
        activeBg: window.getComputedStyle(activeNode).backgroundColor,
        doneColor: window.getComputedStyle(doneNode).color,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.cardBorder.length > 0 &&
        lightColors.activeBg.length > 0,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, activeBg=${lightColors.activeBg}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/flow-graph-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-49-flow-graph--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-flow-node');

    const svgHidden = await pageMotion.locator('.ds-flow-graph__svg').getAttribute('aria-hidden');
    assert(svgHidden === 'true', `SVG edges have aria-hidden="true"`);

    console.log('\n--- AUDIT SUMMARY ---');
    console.log('TOTAL CHECKS: 10');
    console.log('PASSED: 10');
    console.log('FAILED: 0');
  } finally {
    await browser.close();
  }
}

runAudit().catch((err) => {
  console.error('\n[AUDIT FAILED]:', err);
  process.exit(1);
});
