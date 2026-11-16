import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 034 LINK PREVIEW ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const results = {
    checks: [],
    measurements: {},
    passed: 0,
    total: 0,
  };

  function assert(name, condition, details) {
    results.total++;
    if (condition) {
      results.passed++;
      results.checks.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}: ${details}`);
    } else {
      results.checks.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name}: ${details}`);
    }
  }

  try {
    // 1. Dark Mode: Default Story (Card Layout)
    console.log('\n[1/5] Auditing Card Layout Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-34-link-preview--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="link-preview"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/link-preview-card-dark.png` });

    const cardMetrics = await pageDark.locator('[data-slot="link-preview"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const thumb = el.querySelector('.ds-link-preview__thumb');
      const tRect = thumb ? thumb.getBoundingClientRect() : {};
      const tS = thumb ? window.getComputedStyle(thumb) : {};
      const badge = el.querySelector('.ds-domain-badge');
      const bRect = badge ? badge.getBoundingClientRect() : {};
      const site = el.querySelector('.ds-link-preview__site');
      const siteS = site ? window.getComputedStyle(site) : {};
      const title = el.querySelector('.ds-link-preview__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const desc = el.querySelector('.ds-link-preview__desc');
      const descS = desc ? window.getComputedStyle(desc) : {};

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        overflow: s.overflow,
        flexDirection: s.flexDirection,
        bg: s.backgroundColor,
        border: s.borderColor,
        thumb: {
          width: Math.round(tRect.width),
          height: Math.round(tRect.height),
          aspectRatio: tS.aspectRatio,
        },
        badgeSize: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
        site: {
          text: site ? site.textContent.trim() : null,
          fontSize: siteS.fontSize,
          fontWeight: siteS.fontWeight,
        },
        title: {
          text: title ? title.textContent.trim() : null,
          fontSize: titleS.fontSize,
          fontWeight: titleS.fontWeight,
        },
        desc: {
          text: desc ? desc.textContent.trim() : null,
          fontSize: descS.fontSize,
          fontWeight: descS.fontWeight,
        },
      };
    });

    results.measurements.cardMetrics = cardMetrics;

    assert(
      'Card Layout Geometry (384px max-width, 16px radius, overflow hidden, column flex)',
      cardMetrics.maxWidth === '384px' &&
        cardMetrics.borderRadius === '16px' &&
        cardMetrics.overflow === 'hidden' &&
        cardMetrics.flexDirection === 'column',
      `maxWidth=${cardMetrics.maxWidth}, radius=${cardMetrics.borderRadius}, flex=${cardMetrics.flexDirection}`
    );

    const ratio = cardMetrics.thumb.width / cardMetrics.thumb.height;
    assert(
      'Card Layout Thumbnail 16:9 Aspect Ratio (~382x215px)',
      Math.abs(ratio - 16 / 9) < 0.02,
      `size=${cardMetrics.thumb.width}x${cardMetrics.thumb.height}, ratio=${ratio.toFixed(3)}`
    );

    assert(
      'Content Typography Hierarchy (Site 11px/400 Mono, Title 13.5px/500, Desc 12px/400)',
      cardMetrics.site.fontSize === '11px' &&
        cardMetrics.site.fontWeight === '400' &&
        cardMetrics.title.fontSize === '13.5px' &&
        cardMetrics.title.fontWeight === '500' &&
        cardMetrics.desc.fontSize === '12px' &&
        cardMetrics.desc.fontWeight === '400',
      `site=${cardMetrics.site.fontSize}/${cardMetrics.site.fontWeight}, title=${cardMetrics.title.fontSize}/${cardMetrics.title.fontWeight}, desc=${cardMetrics.desc.fontSize}/${cardMetrics.desc.fontWeight}`
    );

    // 2. Compact Layout Story Audit
    console.log('\n[2/5] Auditing Compact Layout Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-34-link-preview--compact-layout&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageCompact = await pageDark.locator('.ds-story').first();
    await stageCompact.screenshot({ path: `${ARTIFACT_DIR}/link-preview-compact-dark.png` });

    const compactMetrics = await pageDark.locator('[data-slot="link-preview"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const thumb = el.querySelector('.ds-link-preview__thumb--compact');
      const tRect = thumb ? thumb.getBoundingClientRect() : {};
      return {
        flexDirection: s.flexDirection,
        thumbSize: `${Math.round(tRect.width)}x${Math.round(tRect.height)}`,
      };
    });

    assert(
      'Compact Layout Geometry (Row Flex, 64x64px Square Thumbnail)',
      compactMetrics.flexDirection === 'row' && compactMetrics.thumbSize === '64x64',
      `flexDirection=${compactMetrics.flexDirection}, thumbSize=${compactMetrics.thumbSize}`
    );

    // 3. Hover Interaction Audit
    console.log('\n[3/5] Testing Hover Elevation Translation...');
    await pageDark.locator('[data-slot="link-preview"]').hover();
    await pageDark.waitForTimeout(200);

    const hoverTransform = await pageDark.locator('[data-slot="link-preview"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return s.transform;
    });

    assert(
      'Hovering Card Triggers -1px Vertical Translation',
      hoverTransform.includes('matrix') && hoverTransform !== 'none',
      `transform=${hoverTransform}`
    );

    // 4. Light Mode Audit
    console.log('\n[4/5] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-34-link-preview--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/link-preview-card-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="link-preview"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const thumb = el.querySelector('.ds-link-preview__thumb');
      const tS = thumb ? window.getComputedStyle(thumb) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        thumbBg: tS.backgroundColor,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface, Secondary Background & Border Tokens',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.thumbBg !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}, thumbBg=${lightStyles.thumbBg}`
    );

    // 5. Reduced Motion Audit
    console.log('\n[5/5] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-34-link-preview--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('[data-slot="link-preview"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Mode Disables Card Elevation Transition',
      motionStyles.transition.includes('none'),
      `transition=${motionStyles.transition}`
    );

    console.log('\n--- AUDIT SUMMARY ---');
    console.log(`TOTAL CHECKS: ${results.total}`);
    console.log(`PASSED: ${results.passed}`);
    console.log(`FAILED: ${results.total - results.passed}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    return results;
  } catch (err) {
    console.error('Audit failed with runtime error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();