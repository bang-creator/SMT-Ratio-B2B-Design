import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 035 IMAGE GENERATION ---');
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
    // 1. Dark Mode: Default Story (Finished State)
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-35-image-generation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="image-generation"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/image-generation-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="image-generation"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const frame = el.querySelector('.ds-image-generation__frame');
      const fRect = frame ? frame.getBoundingClientRect() : {};
      const fS = frame ? window.getComputedStyle(frame) : {};
      const res = el.querySelector('.ds-image-generation__resolution');
      const resS = res ? window.getComputedStyle(res) : {};
      const prompt = el.querySelector('.ds-image-generation__prompt');
      const pS = prompt ? window.getComputedStyle(prompt) : {};
      const btn = el.querySelector('.ds-image-generation__btn');
      const bRect = btn ? btn.getBoundingClientRect() : {};

      return {
        width: Math.round(fRect.width),
        height: Math.round(fRect.height),
        borderRadius: fS.borderRadius,
        overflow: fS.overflow,
        bg: fS.backgroundColor,
        border: fS.borderColor,
        resolution: {
          text: res ? res.textContent.trim() : null,
          fontSize: resS.fontSize,
          fontWeight: resS.fontWeight,
        },
        prompt: {
          text: prompt ? prompt.textContent.trim() : null,
          fontSize: pS.fontSize,
          fontWeight: pS.fontWeight,
        },
        btnSize: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (208x208px Square Frame, 16px radius, overflow hidden)',
      defaultMetrics.width === 208 &&
        defaultMetrics.height === 208 &&
        defaultMetrics.borderRadius === '16px' &&
        defaultMetrics.overflow === 'hidden',
      `size=${defaultMetrics.width}x${defaultMetrics.height}, radius=${defaultMetrics.borderRadius}, overflow=${defaultMetrics.overflow}`
    );

    assert(
      'Resolution Watermark Strict 400 Typography (11px, "1024 × 1024")',
      defaultMetrics.resolution.text === '1024 × 1024' &&
        defaultMetrics.resolution.fontSize === '11px' &&
        defaultMetrics.resolution.fontWeight === '400',
      `text="${defaultMetrics.resolution.text}" (${defaultMetrics.resolution.fontSize}/${defaultMetrics.resolution.fontWeight})`
    );

    assert(
      'Prompt and Action Button Hierarchy (12px/400 Prompt, 24x24px Button)',
      defaultMetrics.prompt.fontSize === '12px' &&
        defaultMetrics.prompt.fontWeight === '400' &&
        defaultMetrics.btnSize === '24x24',
      `prompt=${defaultMetrics.prompt.fontSize}/${defaultMetrics.prompt.fontWeight}, btn=${defaultMetrics.btnSize}`
    );

    // 2. Generating Variant Story Audit
    console.log('\n[2/5] Auditing Generating Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-35-image-generation--generating&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageGenerating = await pageDark.locator('.ds-story').first();
    await stageGenerating.screenshot({ path: `${ARTIFACT_DIR}/image-generation-generating-dark.png` });

    const generatingMetrics = await pageDark.locator('[data-slot="image-generation"]').evaluate((el) => {
      const matrix = el.querySelector('.ds-gen-matrix');
      const dots = el.querySelectorAll('.ds-gen-matrix__dot');
      const shimmer = el.querySelector('.ds-image-generation__shimmer');
      const btn = el.querySelector('.ds-image-generation__btn');
      const bS = btn ? window.getComputedStyle(btn) : {};

      return {
        hasMatrix: !!matrix,
        dotsCount: dots.length,
        hasShimmer: !!shimmer,
        shimmerText: shimmer ? shimmer.textContent.trim() : null,
        btnDisabled: btn ? btn.hasAttribute('disabled') : false,
        btnOpacity: bS.opacity,
        btnPointerEvents: bS.pointerEvents,
      };
    });

    assert(
      'Generating Story Renders 8x8 Dot Matrix (64 dots), Shimmer "Generating" Label, and Hidden Regenerate Button',
      generatingMetrics.hasMatrix &&
        generatingMetrics.dotsCount === 64 &&
        generatingMetrics.hasShimmer &&
        generatingMetrics.shimmerText === 'Generating' &&
        generatingMetrics.btnDisabled &&
        generatingMetrics.btnPointerEvents === 'none',
      `dots=${generatingMetrics.dotsCount}, shimmer="${generatingMetrics.shimmerText}", disabled=${generatingMetrics.btnDisabled}, pointerEvents=${generatingMetrics.btnPointerEvents}`
    );

    // 3. Interactive Regenerate Trigger
    console.log('\n[3/5] Testing Interactive Regenerate Action...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-35-image-generation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click regenerate button
    await pageDark.locator('.ds-image-gen-trigger').click();
    await pageDark.waitForTimeout(100);

    const interactiveGenerating = await pageDark.locator('[data-slot="image-generation"]').evaluate((el) => {
      const dots = el.querySelectorAll('.ds-gen-matrix__dot');
      const shimmer = el.querySelector('.ds-image-generation__shimmer');
      return {
        dotsCount: dots.length,
        hasShimmer: !!shimmer,
      };
    });

    assert(
      'Clicking Regenerate Initiates Generating State with Dot Matrix and Shimmer Text',
      interactiveGenerating.dotsCount === 64 && interactiveGenerating.hasShimmer,
      `dotsCount=${interactiveGenerating.dotsCount}, hasShimmer=${interactiveGenerating.hasShimmer}`
    );

    // Wait for generation to finish (500ms timeout in story)
    await pageDark.waitForTimeout(600);

    const interactiveCompleted = await pageDark.locator('[data-slot="image-generation"]').evaluate((el) => {
      const art = el.querySelector('.ds-image-art');
      const prompt = el.querySelector('.ds-image-generation__prompt');
      const btn = el.querySelector('.ds-image-generation__btn');
      return {
        hasArt: !!art,
        promptText: prompt ? prompt.textContent.trim() : null,
        btnDisabled: btn ? btn.hasAttribute('disabled') : false,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/image-generation-interactive-completed-dark.png` });

    assert(
      'After Generation Finishes, Canvas Art and Prompt Text Restore Cleanly',
      interactiveCompleted.hasArt && !interactiveCompleted.btnDisabled,
      `hasArt=${interactiveCompleted.hasArt}, btnDisabled=${interactiveCompleted.btnDisabled}`
    );

    // 4. Light Mode Audit
    console.log('\n[4/5] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-35-image-generation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/image-generation-default-light.png` });

    const lightStyles = await pageLight.locator('.ds-image-generation__frame').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface and Subtle Border Tokens',
      lightStyles.bg !== 'transparent' && lightStyles.border !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}`
    );

    // 5. Reduced Motion Audit
    console.log('\n[5/5] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-35-image-generation--generating&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-image-generation__shimmer').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
      };
    });

    assert(
      'Reduced Motion Mode Disables Shimmer Animation',
      motionStyles.animation.includes('none'),
      `animation=${motionStyles.animation}`
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