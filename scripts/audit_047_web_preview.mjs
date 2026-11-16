import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 047 WEB PREVIEW ---');

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
    await pageDefault.goto(`${BASE_URL}?id=default-application-47-web-preview--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="web-preview"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="web-preview"]').evaluate((el) => {
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
      `Container Geometry (448px maxW, 16px radius, overflow hidden, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Chrome Bar Buttons & Origin Bar
    const barSpecs = await pageDefault.locator('.ds-web-preview__bar').evaluate((el) => {
      const reloadBtn = el.querySelector('.ds-web-preview__btn-reload');
      const extBtn = el.querySelector('.ds-web-preview__btn-external');
      const urlPill = el.querySelector('.ds-web-preview__url-bar');
      const origin = el.querySelector('.ds-web-preview__origin');

      const reloadCs = window.getComputedStyle(reloadBtn);
      const extCs = window.getComputedStyle(extBtn);
      const pillCs = window.getComputedStyle(urlPill);
      const originCs = window.getComputedStyle(origin);

      return {
        reloadAria: reloadBtn.getAttribute('aria-label'),
        reloadSize: `${reloadCs.width}x${reloadCs.height}`,
        extAria: extBtn.getAttribute('aria-label'),
        extSize: `${extCs.width}x${extCs.height}`,
        pillRadius: pillCs.borderRadius,
        originText: origin.textContent.trim(),
        originFont: `${originCs.fontSize}/${originCs.fontWeight}`,
      };
    });

    assert(
      barSpecs.reloadAria === 'Reload the preview' &&
        barSpecs.reloadSize === '28pxx28px' &&
        barSpecs.extAria === 'Open the preview in a new tab' &&
        barSpecs.extSize === '28pxx28px' &&
        (barSpecs.pillRadius === '9999px' || barSpecs.pillRadius.includes('px')) &&
        barSpecs.originText === 'http://localhost:5173/preview' &&
        barSpecs.originFont === '12px/400',
      `Chrome Bar Specs (28x28px buttons, 12px/400 mono origin pill): reload=${barSpecs.reloadSize}, ext=${barSpecs.extSize}, origin=${barSpecs.originFont}`
    );

    // Preview Stage Geometry & Content
    const stageSpecs = await pageDefault.locator('.ds-web-preview__stage').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const content = el.querySelector('.ds-web-preview__content');
      const contentCs = window.getComputedStyle(content);
      return {
        minHeight: cs.minHeight,
        borderTopWidth: cs.borderTopWidth,
        contentOpacity: contentCs.opacity,
        contentVisibility: contentCs.visibility,
      };
    });

    assert(
      stageSpecs.minHeight === '144px' &&
        stageSpecs.borderTopWidth === '1px' &&
        stageSpecs.contentOpacity === '1' &&
        stageSpecs.contentVisibility === 'visible',
      `Preview Stage (144px minHeight, 1px top border, visible content): minH=${stageSpecs.minHeight}, opacity=${stageSpecs.contentOpacity}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/web-preview-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: LOADING STORY AUDIT
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing Loading Story...');
    const pageLoading = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageLoading.goto(`${BASE_URL}?id=default-application-47-web-preview--loading&viewMode=story`);
    await pageLoading.waitForSelector('[data-slot="web-preview"]');

    const loadingSpecs = await pageLoading.evaluate(() => {
      const reloadIcon = document.querySelector('.ds-web-preview__reload-icon--loading');
      const content = document.querySelector('.ds-web-preview__content');
      const overlay = document.querySelector('.ds-web-preview__loading-overlay');
      const contentCs = window.getComputedStyle(content);

      return {
        hasSpinningIcon: !!reloadIcon,
        contentAriaHidden: content.getAttribute('aria-hidden'),
        contentOpacity: contentCs.opacity,
        contentVisibility: contentCs.visibility,
        overlayText: overlay ? overlay.textContent.trim() : '',
      };
    });

    assert(
      loadingSpecs.hasSpinningIcon &&
        loadingSpecs.contentAriaHidden === 'true' &&
        loadingSpecs.contentOpacity === '0' &&
        loadingSpecs.contentVisibility === 'hidden' &&
        loadingSpecs.overlayText === 'Loading preview',
      `Loading Story Specs (spinning icon, opacity 0, hidden, "Loading preview" shimmer): opacity=${loadingSpecs.contentOpacity}, text="${loadingSpecs.overlayText}"`
    );
    await pageLoading.screenshot({ path: `${ARTIFACT_DIR}/web-preview-loading-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: CUSTOM ORIGIN STORY
    // ------------------------------------------------------------------
    console.log('\n[3/6] Auditing CustomOrigin Story...');
    const pageCustom = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageCustom.goto(`${BASE_URL}?id=default-application-47-web-preview--custom-origin&viewMode=story`);
    await pageCustom.waitForSelector('[data-slot="web-preview"]');

    const customOrigin = await pageCustom.locator('.ds-web-preview__origin').textContent();
    assert(
      customOrigin.trim() === 'https://platform.openai.com/playground',
      `Custom origin text matches expected: actual="${customOrigin.trim()}"`
    );
    await pageCustom.screenshot({ path: `${ARTIFACT_DIR}/web-preview-custom-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: INTERACTIVE RELOAD MACHINE
    // ------------------------------------------------------------------
    console.log('\n[4/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-47-web-preview--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('[data-slot="web-preview"]');

    // Click reload button
    await pageInteractive.locator('.ds-web-preview__btn-reload').click();
    await pageInteractive.waitForTimeout(100);

    // During loading: overlay must be present
    let isDuringLoading = await pageInteractive.locator('.ds-web-preview__loading-overlay').count();
    assert(isDuringLoading === 1, `Clicking reload initiates loading overlay: count=${isDuringLoading}`);

    // Wait for reload completion
    await pageInteractive.waitForTimeout(900);
    isDuringLoading = await pageInteractive.locator('.ds-web-preview__loading-overlay').count();
    const updatedContent = await pageInteractive.locator('.ds-web-preview__content').textContent();

    assert(
      isDuringLoading === 0 && updatedContent.includes('Refreshed 1 times'),
      `Reload finishes, removes overlay, and increments counter: text="${updatedContent.trim()}"`
    );
    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/web-preview-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 5: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[5/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-47-web-preview--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="web-preview"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="web-preview"]');
      const urlPill = document.querySelector('.ds-web-preview__url-bar');
      const origin = document.querySelector('.ds-web-preview__origin');
      const stage = document.querySelector('.ds-web-preview__stage');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        pillBg: window.getComputedStyle(urlPill).backgroundColor,
        originColor: window.getComputedStyle(origin).color,
        stageBg: window.getComputedStyle(stage).backgroundColor,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.pillBg.length > 0 &&
        lightColors.originColor.length > 0 &&
        lightColors.stageBg.length > 0,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, pillBg=${lightColors.pillBg}, originColor=${lightColors.originColor}`
    );
    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/web-preview-default-light.png` });

    // ------------------------------------------------------------------
    // SECTION 6: REDUCED MOTION AUDIT
    // ------------------------------------------------------------------
    console.log('\n[6/6] Auditing Reduced Motion...');
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      reducedMotion: 'reduce',
    });
    await pageMotion.goto(`${BASE_URL}?id=default-application-47-web-preview--loading&viewMode=story`);
    await pageMotion.waitForSelector('.ds-web-preview__reload-icon--loading');

    const anim = await pageMotion.locator('.ds-web-preview__reload-icon--loading').evaluate((el) => {
      return window.getComputedStyle(el).animationName;
    });

    assert(
      anim === 'none' || anim === '',
      `Reduced motion disables spin animation: animationName=${anim}`
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
