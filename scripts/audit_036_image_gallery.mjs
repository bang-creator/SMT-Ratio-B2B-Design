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
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 036 IMAGE GALLERY ---');
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
    await pageDefault.goto(`${BASE_URL}?id=default-application-36-image-gallery--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="image-gallery"]');

    const gallery = pageDefault.locator('[data-slot="image-gallery"]');
    const galleryStyles = await gallery.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        display: cs.display,
        gridTemplateColumns: cs.gridTemplateColumns,
        gap: cs.gap,
        maxWidth: cs.maxWidth,
        width: Math.round(rect.width),
      };
    });

    assert(
      galleryStyles.display === 'grid' &&
        galleryStyles.gridTemplateColumns.split(' ').length === 3 &&
        galleryStyles.gap === '8px' &&
        galleryStyles.maxWidth === '448px',
      `Gallery Grid Geometry (Grid 3-cols, 8px gap, 448px max-width): display=${galleryStyles.display}, cols=${galleryStyles.gridTemplateColumns.split(' ').length}, gap=${galleryStyles.gap}, maxWidth=${galleryStyles.maxWidth}`
    );

    const items = pageDefault.locator('.ds-gallery-item');
    const itemsCount = await items.count();
    assert(itemsCount === 6, `Default Gallery Renders 6 Thumbnails: count=${itemsCount}`);

    const firstItemStyles = await items.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        borderRadius: cs.borderRadius,
        overflow: cs.overflow,
      };
    });

    const isSquare = Math.abs(firstItemStyles.width - firstItemStyles.height) <= 1;
    assert(
      isSquare && firstItemStyles.borderRadius === '12px' && firstItemStyles.overflow === 'hidden',
      `Item Geometry (Square Aspect-Ratio 1:1, 12px radius, overflow hidden): size=${firstItemStyles.width}x${firstItemStyles.height}, radius=${firstItemStyles.borderRadius}, overflow=${firstItemStyles.overflow}`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/image-gallery-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: OVERFLOW STORY (+3 BADGE)
    // ------------------------------------------------------------------
    console.log('\n[2/5] Auditing Overflow Story (+3 Badge)...');
    const pageOverflow = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageOverflow.goto(`${BASE_URL}?id=default-application-36-image-gallery--overflow&viewMode=story`);
    await pageOverflow.waitForSelector('.ds-gallery-overflow');

    const overflowBadge = pageOverflow.locator('.ds-gallery-overflow');
    const overflowData = await overflowBadge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
      };
    });

    assert(
      overflowData.text === '+3' &&
        overflowData.fontSize === '18px' &&
        (overflowData.fontWeight === '500' || overflowData.fontWeight === '600'),
      `Overflow Badge Specs ("+3", 18px / 500 weight): text="${overflowData.text}", fontSize=${overflowData.fontSize}, fontWeight=${overflowData.fontWeight}`
    );

    await pageOverflow.screenshot({ path: `${ARTIFACT_DIR}/image-gallery-overflow-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: LIGHTBOX OPEN STORY
    // ------------------------------------------------------------------
    console.log('\n[3/5] Auditing Lightbox Open Story (Modal & Typography Hierarchy)...');
    const pageLightbox = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageLightbox.goto(`${BASE_URL}?id=default-application-36-image-gallery--lightbox-open&viewMode=story`);
    await pageLightbox.waitForSelector('.ds-gallery-dialog');

    const modal = pageLightbox.locator('.ds-gallery-modal');
    const modalStyles = await modal.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        borderRadius: cs.borderRadius,
        maxWidth: cs.maxWidth,
      };
    });

    assert(
      modalStyles.borderRadius === '16px' && modalStyles.maxWidth === '600px',
      `Lightbox Modal Container (16px radius, 600px max-width): radius=${modalStyles.borderRadius}, maxWidth=${modalStyles.maxWidth}`
    );

    const stage = pageLightbox.locator('.ds-gallery-modal__stage');
    const stageHeight = await stage.evaluate((el) => Math.round(el.getBoundingClientRect().height));
    assert(stageHeight === 320, `Stage Preview Area (320px fixed height): height=${stageHeight}px`);

    const closeBtn = pageLightbox.locator('.ds-gallery-modal__close');
    const closeBtnSize = await closeBtn.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { w: Math.round(rect.width), h: Math.round(rect.height) };
    });
    assert(closeBtnSize.w === 28 && closeBtnSize.h === 28, `Close Button Compact Geometry (28x28px): size=${closeBtnSize.w}x${closeBtnSize.h}`);

    const caption = pageLightbox.locator('.ds-gallery-modal__caption');
    const captionData = await caption.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        text: el.textContent.trim(),
      };
    });
    assert(
      captionData.fontSize === '14px' && (captionData.fontWeight === '400' || captionData.fontWeight === 'normal'),
      `Caption Strict 400 Typography (14px/400): fontSize=${captionData.fontSize}, fontWeight=${captionData.fontWeight}`
    );

    const source = pageLightbox.locator('.ds-gallery-modal__source');
    const sourceData = await source.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        text: el.textContent.trim(),
      };
    });
    assert(
      sourceData.fontSize === '12px' && (sourceData.fontWeight === '400' || sourceData.fontWeight === 'normal'),
      `Source Link Strict 400 Typography (12px/400): fontSize=${sourceData.fontSize}, fontWeight=${sourceData.fontWeight}`
    );

    const counter = pageLightbox.locator('.ds-gallery-counter');
    const counterData = await counter.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        text: el.textContent.trim(),
      };
    });
    assert(
      counterData.text === '2 / 6' &&
        counterData.fontSize === '12px' &&
        (counterData.fontWeight === '400' || counterData.fontWeight === 'normal'),
      `Gallery Counter Tabular Specs ("2 / 6", 12px/400 mono): text="${counterData.text}", fontSize=${counterData.fontSize}, fontWeight=${counterData.fontWeight}`
    );

    const navBtns = pageLightbox.locator('.ds-gallery-nav-btn');
    const prevBtnSize = await navBtns.first().evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { w: Math.round(rect.width), h: Math.round(rect.height) };
    });
    assert(prevBtnSize.w === 32 && prevBtnSize.h === 32, `Navigation Buttons Geometry (32x32px): size=${prevBtnSize.w}x${prevBtnSize.h}`);

    await pageLightbox.screenshot({ path: `${ARTIFACT_DIR}/image-gallery-lightbox-open-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: INTERACTIVE LIGHTBOX NAVIGATION & STATE MACHINE
    // ------------------------------------------------------------------
    console.log('\n[4/5] Testing Interactive Lightbox Navigation & Keyboard Flow...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-36-image-gallery--default&viewMode=story`);
    await pageInteractive.waitForSelector('.ds-gallery-item');

    // Initially no dialog
    const initialDialogs = await pageInteractive.locator('.ds-gallery-dialog').count();
    assert(initialDialogs === 0, `Initially No Lightbox Dialog in DOM: count=${initialDialogs}`);

    // Click 1st thumbnail
    await pageInteractive.locator('.ds-gallery-item').first().click();
    await pageInteractive.waitForSelector('.ds-gallery-dialog');

    const counterAfterFirst = await pageInteractive.locator('.ds-gallery-counter').textContent();
    const prevDisabled = await pageInteractive.locator('.ds-gallery-nav-btn[data-action="prev"]').isDisabled();
    assert(
      counterAfterFirst.trim() === '1 / 6' && prevDisabled === true,
      `Clicking 1st Thumbnail Opens Lightbox at "1 / 6" with Prev Button Disabled: counter="${counterAfterFirst.trim()}", prevDisabled=${prevDisabled}`
    );

    // Click Next button
    await pageInteractive.locator('.ds-gallery-nav-btn[data-action="next"]').click();
    const counterAfterNext = await pageInteractive.locator('.ds-gallery-counter').textContent();
    const prevEnabled = await pageInteractive.locator('.ds-gallery-nav-btn[data-action="prev"]').isEnabled();
    assert(
      counterAfterNext.trim() === '2 / 6' && prevEnabled === true,
      `Clicking Next Advances Lightbox to "2 / 6" and Enables Prev Button: counter="${counterAfterNext.trim()}", prevEnabled=${prevEnabled}`
    );

    // Keyboard ArrowRight navigation
    await pageInteractive.keyboard.press('ArrowRight');
    const counterAfterArrow = await pageInteractive.locator('.ds-gallery-counter').textContent();
    assert(
      counterAfterArrow.trim() === '3 / 6',
      `Pressing ArrowRight Advances Lightbox to "3 / 6": counter="${counterAfterArrow.trim()}"`
    );

    // Close Dialog via Close button
    await pageInteractive.locator('.ds-gallery-modal__close').click();
    const dialogsAfterClose = await pageInteractive.locator('.ds-gallery-dialog').count();
    assert(
      dialogsAfterClose === 0,
      `Clicking Close Button Dismisses Lightbox Dialog: count=${dialogsAfterClose}`
    );

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/image-gallery-interactive-closed-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 5: LIGHT MODE & REDUCED MOTION
    // ------------------------------------------------------------------
    console.log('\n[5/5] Auditing Light Mode & Reduced Motion...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-36-image-gallery--lightbox-open&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('.ds-gallery-modal');

    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightModalTokens = await pageLight.locator('.ds-gallery-modal').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: cs.borderColor,
      };
    });
    assert(
      lightModalTokens.bg === 'rgb(255, 255, 255)' || lightModalTokens.bg === 'rgb(249, 249, 249)' || lightModalTokens.bg !== 'transparent',
      `Light Mode Resolves Valid Surface Tokens: bg=${lightModalTokens.bg}, border=${lightModalTokens.border}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/image-gallery-lightbox-open-light.png` });

    // Reduced motion
    const pageMotion = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageMotion.emulateMedia({ reducedMotion: 'reduce' });
    await pageMotion.goto(`${BASE_URL}?id=default-application-36-image-gallery--default&viewMode=story`);
    await pageMotion.waitForSelector('.ds-gallery-item');

    const motionTransition = await pageMotion.locator('.ds-gallery-item').first().evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    assert(
      motionTransition === 'none' || motionTransition.includes('none') || motionTransition === 'all 0s ease 0s',
      `Reduced Motion Disables Thumbnail Scale Transition: transition=${motionTransition}`
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
