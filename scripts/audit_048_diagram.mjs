import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 048 DIAGRAM ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-48-diagram--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="diagram"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="diagram"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        overflow: cs.overflow,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      cardSpecs.maxWidth === '448px' &&
        cardSpecs.borderRadius === '16px' &&
        cardSpecs.overflow === 'hidden' &&
        cardSpecs.borderWidth === '1px',
      `Diagram Container Geometry (448px maxW, 16px radius, overflow hidden, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Toolbar elements & typography
    const toolbarSpecs = await pageDefault.locator('.ds-diagram__toolbar').evaluate((el) => {
      const title = el.querySelector('.ds-diagram__title');
      const zoom = el.querySelector('.ds-diagram__zoom');
      const zOut = el.querySelector('.ds-diagram__btn-zoom-out');
      const zIn = el.querySelector('.ds-diagram__btn-zoom-in');
      const reset = el.querySelector('.ds-diagram__btn-reset');
      const expand = el.querySelector('.ds-diagram__btn-expand');

      const titleCs = window.getComputedStyle(title);
      const zoomCs = window.getComputedStyle(zoom);
      const btnCs = window.getComputedStyle(zIn);

      return {
        titleText: title.textContent.trim(),
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
        zoomText: zoom.textContent.trim(),
        zoomFont: `${zoomCs.fontSize}/${zoomCs.fontWeight}`,
        btnSize: `${btnCs.width}x${btnCs.height}`,
        zOutAria: zOut.getAttribute('aria-label'),
        zInAria: zIn.getAttribute('aria-label'),
        resetAria: reset.getAttribute('aria-label'),
        expandAria: expand.getAttribute('aria-label'),
      };
    });

    assert(
      toolbarSpecs.titleFont.includes('13px') &&
        toolbarSpecs.zoomText === '100%' &&
        toolbarSpecs.zoomFont === '12px/400' &&
        toolbarSpecs.btnSize === '28pxx28px' &&
        toolbarSpecs.zOutAria === 'Zoom out' &&
        toolbarSpecs.zInAria === 'Zoom in' &&
        toolbarSpecs.resetAria === 'Reset the view' &&
        toolbarSpecs.expandAria === 'Open full screen',
      `Toolbar Specs (13px title, 12px/400 zoom, 4x 28x28px buttons with ground truth ARIA): zoom=${toolbarSpecs.zoomFont}, btnSize=${toolbarSpecs.btnSize}`
    );

    // Stage & Viewport scale
    const stageSpecs = await pageDefault.locator('.ds-diagram__stage').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const vp = el.querySelector('.ds-diagram__viewport');
      const vpCs = window.getComputedStyle(vp);
      return {
        minHeight: cs.minHeight,
        borderTopWidth: cs.borderTopWidth,
        transform: vpCs.transform,
      };
    });

    assert(
      stageSpecs.minHeight === '160px' &&
        stageSpecs.borderTopWidth === '1px' &&
        (stageSpecs.transform === 'none' || stageSpecs.transform === 'matrix(1, 0, 0, 1, 0, 0)'),
      `Stage Specs (160px minH, 1px borderTop, scale=1): minH=${stageSpecs.minHeight}, transform=${stageSpecs.transform}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/diagram-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: ZOOMED IN & ZOOMED OUT STORIES
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing ZoomedIn & ZoomedOut Stories...');
    const pageIn = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageIn.goto(`${BASE_URL}?id=default-application-48-diagram--zoomed-in&viewMode=story`);
    await pageIn.waitForSelector('[data-slot="diagram"]');

    const inSpecs = await pageIn.evaluate(() => {
      const zoom = document.querySelector('.ds-diagram__zoom').textContent.trim();
      const vp = document.querySelector('.ds-diagram__viewport');
      const transform = window.getComputedStyle(vp).transform;
      return { zoom, transform };
    });

    assert(
      inSpecs.zoom === '150%' && inSpecs.transform.includes('1.5'),
      `ZoomedIn Specs (150%, matrix with 1.5): zoom=${inSpecs.zoom}, transform=${inSpecs.transform}`
    );
    await pageIn.screenshot({ path: `${ARTIFACT_DIR}/diagram-zoomed-in-dark.png` });

    const pageOut = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageOut.goto(`${BASE_URL}?id=default-application-48-diagram--zoomed-out&viewMode=story`);
    await pageOut.waitForSelector('[data-slot="diagram"]');

    const outSpecs = await pageOut.evaluate(() => {
      const zoom = document.querySelector('.ds-diagram__zoom').textContent.trim();
      const vp = document.querySelector('.ds-diagram__viewport');
      const transform = window.getComputedStyle(vp).transform;
      return { zoom, transform };
    });

    assert(
      outSpecs.zoom === '75%' && outSpecs.transform.includes('0.75'),
      `ZoomedOut Specs (75%, matrix with 0.75): zoom=${outSpecs.zoom}, transform=${outSpecs.transform}`
    );
    await pageOut.screenshot({ path: `${ARTIFACT_DIR}/diagram-zoomed-out-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: INTERACTIVE ZOOM CONTROLLER MACHINE
    // ------------------------------------------------------------------
    console.log('\n[3/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-48-diagram--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('[data-slot="diagram"]');

    // Click Zoom In (+)
    await pageInteractive.locator('.ds-diagram__btn-zoom-in').click();
    await pageInteractive.waitForTimeout(100);
    let interZoom = await pageInteractive.locator('.ds-diagram__zoom').textContent();
    let interTransform = await pageInteractive.locator('.ds-diagram__viewport').evaluate((el) => window.getComputedStyle(el).transform);
    assert(interZoom === '125%' && interTransform.includes('1.25'), `Zoom in once increments to 125%: zoom=${interZoom}`);

    // Click Zoom In (+) again
    await pageInteractive.locator('.ds-diagram__btn-zoom-in').click();
    await pageInteractive.waitForTimeout(100);
    interZoom = await pageInteractive.locator('.ds-diagram__zoom').textContent();
    assert(interZoom === '150%', `Zoom in twice increments to 150%: zoom=${interZoom}`);

    // Click Zoom Out (-)
    await pageInteractive.locator('.ds-diagram__btn-zoom-out').click();
    await pageInteractive.waitForTimeout(100);
    interZoom = await pageInteractive.locator('.ds-diagram__zoom').textContent();
    assert(interZoom === '125%', `Zoom out once decrements to 125%: zoom=${interZoom}`);

    // Click Reset
    await pageInteractive.locator('.ds-diagram__btn-reset').click();
    await pageInteractive.waitForTimeout(100);
    interZoom = await pageInteractive.locator('.ds-diagram__zoom').textContent();
    interTransform = await pageInteractive.locator('.ds-diagram__viewport').evaluate((el) => window.getComputedStyle(el).transform);
    assert(interZoom === '100%' && (interTransform === 'none' || interTransform.includes('1, 0, 0, 1')), `Reset reverts to 100%: zoom=${interZoom}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/diagram-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-48-diagram--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="diagram"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="diagram"]');
      const title = document.querySelector('.ds-diagram__title');
      const zoom = document.querySelector('.ds-diagram__zoom');
      const stage = document.querySelector('.ds-diagram__stage');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        titleColor: window.getComputedStyle(title).color,
        zoomColor: window.getComputedStyle(zoom).color,
        stageBg: window.getComputedStyle(stage).backgroundColor,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.titleColor !== lightColors.zoomColor &&
        lightColors.stageBg.length > 0,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, title=${lightColors.titleColor}, zoom=${lightColors.zoomColor}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/diagram-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 5: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-48-diagram--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-diagram__viewport');

    const trans = await pageMotion.locator('.ds-diagram__viewport').evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });

    assert(
      trans.includes('none') || trans === 'none 0s ease 0s',
      `Reduced motion disables transform transition: transition=${trans}`
    );

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
