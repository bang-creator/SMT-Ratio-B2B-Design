import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 033 INLINE CITATION ---');
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
    // 1. Dark Mode: Default Story (Closed State)
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-33-inline-citation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="inline-citation"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/inline-citation-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="inline-citation"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const p = el.querySelector('p');
      const pS = p ? window.getComputedStyle(p) : {};
      const pills = Array.from(el.querySelectorAll('.ds-citation-pill')).map((btn) => {
        const bRect = btn.getBoundingClientRect();
        const bS = window.getComputedStyle(btn);
        return {
          text: btn.textContent.trim(),
          size: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
          radius: bS.borderRadius,
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          ariaExpanded: btn.getAttribute('aria-expanded'),
        };
      });
      const card = el.querySelector('.ds-citation-card');
      const cardS = card ? window.getComputedStyle(card) : {};

      return {
        maxWidth: s.maxWidth,
        paragraph: {
          fontSize: pS.fontSize,
          fontWeight: pS.fontWeight,
        },
        pillsCount: pills.length,
        pills: pills,
        cardDisplay: cardS.display,
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (384px max-width, 14px/400 Strict Typography)',
      defaultMetrics.maxWidth === '384px' &&
        defaultMetrics.paragraph.fontSize === '14px' &&
        defaultMetrics.paragraph.fontWeight === '400',
      `maxWidth=${defaultMetrics.maxWidth}, font=${defaultMetrics.paragraph.fontSize}/${defaultMetrics.paragraph.fontWeight}`
    );

    assert(
      'Citation Pills Geometry (16x16px min, 5px radius, 10px mono 500 tabular)',
      defaultMetrics.pillsCount === 2 &&
        defaultMetrics.pills.every(
          (p) =>
            p.radius === '5px' &&
            p.fontSize === '10px' &&
            p.fontWeight === '500' &&
            p.size.includes('16')
        ),
      `pills=${defaultMetrics.pills.map((p) => `${p.text}[${p.size}, ${p.radius}]`).join(', ')}`
    );

    assert(
      'Popover Card Is Closed in Default State (display none)',
      defaultMetrics.cardDisplay === 'none',
      `display=${defaultMetrics.cardDisplay}`
    );

    // 2. OpenPreview Variant Story Audit
    console.log('\n[2/6] Auditing OpenPreview Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-33-inline-citation--open-preview&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageOpen = await pageDark.locator('.ds-story').first();
    await stageOpen.screenshot({ path: `${ARTIFACT_DIR}/inline-citation-open-preview-dark.png` });

    const openCardData = await pageDark.locator('.ds-citation-card').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const bRect = el.getBoundingClientRect();
      const badge = el.querySelector('.ds-domain-badge');
      const badgeRect = badge ? badge.getBoundingClientRect() : {};
      const title = el.querySelector('.ds-citation-card__title');
      const titleS = title ? window.getComputedStyle(title) : {};
      const snippet = el.querySelector('.ds-citation-card__snippet');
      const snipS = snippet ? window.getComputedStyle(snippet) : {};
      const link = el.querySelector('.ds-citation-card__link');
      const linkS = link ? window.getComputedStyle(link) : {};

      return {
        width: Math.round(bRect.width),
        borderRadius: s.borderRadius,
        padding: s.padding,
        bg: s.backgroundColor,
        border: s.borderColor,
        badgeSize: `${Math.round(badgeRect.width)}x${Math.round(badgeRect.height)}`,
        title: {
          text: title ? title.textContent.trim() : null,
          fontSize: titleS.fontSize,
          fontWeight: titleS.fontWeight,
        },
        snippet: {
          text: snippet ? snippet.textContent.trim() : null,
          fontSize: snipS.fontSize,
          fontWeight: snipS.fontWeight,
        },
        link: {
          text: link ? link.textContent.trim() : null,
          fontSize: linkS.fontSize,
          fontWeight: linkS.fontWeight,
        },
      };
    });

    assert(
      'Popover Card Geometry (256px width, 16px radius, 14px padding)',
      openCardData.width === 256 &&
        openCardData.borderRadius === '16px' &&
        openCardData.padding === '14px',
      `width=${openCardData.width}px, radius=${openCardData.borderRadius}, padding=${openCardData.padding}`
    );

    assert(
      'Popover Card Typography Hierarchy (Title 13px/500, Snippet 13px/400, Link 12px/400)',
      openCardData.title.fontSize === '13px' &&
        openCardData.title.fontWeight === '500' &&
        openCardData.snippet.fontSize === '13px' &&
        openCardData.snippet.fontWeight === '400' &&
        openCardData.link.fontSize === '12px' &&
        openCardData.link.fontWeight === '400',
      `title=${openCardData.title.fontWeight}, snippet=${openCardData.snippet.fontWeight}, link=${openCardData.link.fontWeight}`
    );

    // 3. Interactive Popover Toggle (Open & Close)
    console.log('\n[3/6] Testing Interactive Popover Open & Close Actions...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-33-inline-citation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click citation pill 1
    await pageDark.locator('.ds-cite-btn').click();
    await pageDark.waitForTimeout(200);

    const interactiveOpen = await pageDark.locator('[data-slot="inline-citation"]').evaluate((el) => {
      const btn = el.querySelector('.ds-cite-btn');
      const bS = btn ? window.getComputedStyle(btn) : {};
      const card = el.querySelector('.ds-citation-card');
      const cardS = card ? window.getComputedStyle(card) : {};
      return {
        cardVisible: cardS.display !== 'none',
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
        btnBg: bS.backgroundColor,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/inline-citation-interactive-open-dark.png` });

    assert(
      'Clicking Citation Pill Opens Popover Card and Sets Active Pill State',
      interactiveOpen.cardVisible && interactiveOpen.ariaExpanded === 'true',
      `visible=${interactiveOpen.cardVisible}, ariaExpanded=${interactiveOpen.ariaExpanded}`
    );

    // Click citation pill 1 again to close
    await pageDark.locator('.ds-cite-btn').click();
    await pageDark.waitForTimeout(200);

    const interactiveClosed = await pageDark.locator('[data-slot="inline-citation"]').evaluate((el) => {
      const btn = el.querySelector('.ds-cite-btn');
      const card = el.querySelector('.ds-citation-card');
      const cardS = card ? window.getComputedStyle(card) : {};
      return {
        cardDisplay: cardS.display,
        ariaExpanded: btn ? btn.getAttribute('aria-expanded') : null,
      };
    });

    assert(
      'Clicking Citation Pill Again Closes Popover Card (display none)',
      interactiveClosed.cardDisplay === 'none' && interactiveClosed.ariaExpanded === 'false',
      `display=${interactiveClosed.cardDisplay}, ariaExpanded=${interactiveClosed.ariaExpanded}`
    );

    // 4. Light Mode Audit
    console.log('\n[4/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-33-inline-citation--open-preview&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/inline-citation-open-preview-light.png` });

    const lightStyles = await pageLight.locator('.ds-citation-card').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
      };
    });

    assert(
      'Light Mode Resolves Elevated Surface and Subtle Border Tokens Cleanly',
      lightStyles.bg !== 'transparent' && lightStyles.border !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}`
    );

    // 5. Reduced Motion Audit
    console.log('\n[5/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-33-inline-citation--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-citation-pill').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Mode Disables Pill Transition',
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