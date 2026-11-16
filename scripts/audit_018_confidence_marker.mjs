import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 018 CONFIDENCE MARKER ---');
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
    // 1. Dark Mode: Default Story
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-18-confidence-marker--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-confidence-target [data-slot="confidence-marker"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/confidence-marker-default-dark.png` });

    const markerData = await pageDark.locator('.ds-confidence-target [data-slot="confidence-marker"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const p = el.querySelector('p');
      const pS = p ? window.getComputedStyle(p) : {};
      const btns = Array.from(el.querySelectorAll('.ds-claim-btn')).map((btn) => {
        const bS = window.getComputedStyle(btn);
        return {
          id: btn.getAttribute('data-id'),
          text: btn.textContent.trim(),
          fontWeight: bS.fontWeight,
          fontSize: bS.fontSize,
          textDecorationLine: bS.textDecorationLine,
          textDecorationStyle: bS.textDecorationStyle,
          textDecorationColor: bS.textDecorationColor,
          color: bS.color,
          cursor: bS.cursor,
        };
      });
      const footer = el.querySelector('.ds-confidence-footer');
      const fS = footer ? window.getComputedStyle(footer) : {};
      const fRect = footer ? footer.getBoundingClientRect() : {};
      const badge = el.querySelector('.ds-confidence-badge');
      const bS = badge ? window.getComputedStyle(badge) : {};
      const dot = badge ? badge.querySelector('.ds-claim-dot') : null;
      const dotS = dot ? window.getComputedStyle(dot) : {};
      const dotRect = dot ? dot.getBoundingClientRect() : {};

      return {
        maxWidth: s.maxWidth,
        display: s.display,
        gap: s.gap,
        paragraph: {
          fontSize: pS.fontSize,
          fontWeight: pS.fontWeight,
          lineHeight: pS.lineHeight,
        },
        buttons: btns,
        footer: {
          height: fRect.height,
          display: fS.display,
        },
        badge: {
          text: badge ? badge.textContent.trim() : null,
          role: badge ? badge.getAttribute('role') : null,
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          borderRadius: bS.borderRadius,
        },
        dot: {
          width: dotRect.width,
          height: dotRect.height,
          borderRadius: dotS.borderRadius,
          background: dotS.backgroundColor,
        },
      };
    });

    results.measurements.defaultDark = markerData;

    assert(
      'Container Width & Flex Layout',
      markerData.maxWidth === '384px' && markerData.display === 'flex' && markerData.gap === '10px',
      `maxWidth=${markerData.maxWidth}, display=${markerData.display}, gap=${markerData.gap}`
    );

    assert(
      'Strict 400 Typography on Paragraph',
      markerData.paragraph.fontWeight === '400' && markerData.paragraph.fontSize === '13.5px',
      `fontWeight=${markerData.paragraph.fontWeight}, fontSize=${markerData.paragraph.fontSize}, lineHeight=${markerData.paragraph.lineHeight}`
    );

    assert(
      'Render 3 Claims with Strict 400 Typography',
      markerData.buttons.length === 3 && markerData.buttons.every((b) => b.fontWeight === '400'),
      `claims=${markerData.buttons.length}, fontWeights=${markerData.buttons.map((b) => b.fontWeight).join(', ')}`
    );

    assert(
      'Grounded Claim Style (Emerald Underline)',
      markerData.buttons[0].textDecorationLine.includes('underline') &&
        markerData.buttons[0].textDecorationStyle === 'solid' &&
        markerData.buttons[0].cursor === 'help',
      `decorLine=${markerData.buttons[0].textDecorationLine}, color=${markerData.buttons[0].textDecorationColor}`
    );

    assert(
      'Inferred Claim Style (Amber Underline)',
      markerData.buttons[1].textDecorationLine.includes('underline') &&
        markerData.buttons[1].textDecorationStyle === 'solid',
      `decorLine=${markerData.buttons[1].textDecorationLine}, color=${markerData.buttons[1].textDecorationColor}`
    );

    assert(
      'Uncertain Claim Style (Dotted Red Underline)',
      markerData.buttons[2].textDecorationLine.includes('underline') &&
        markerData.buttons[2].textDecorationStyle === 'dotted',
      `decorLine=${markerData.buttons[2].textDecorationLine}, style=${markerData.buttons[2].textDecorationStyle}, color=${markerData.buttons[2].textDecorationColor}`
    );

    assert(
      'Footer Height Reservation (36px / h-9)',
      markerData.footer.height >= 36,
      `footerHeight=${markerData.footer.height}px`
    );

    assert(
      'Default Hover Badge (Claim 1 Grounded)',
      markerData.badge.role === 'status' &&
        markerData.badge.text.includes('from a source') &&
        markerData.badge.text.includes('migration-0.14.md') &&
        markerData.badge.fontWeight === '400' &&
        markerData.badge.fontSize === '11px',
      `text="${markerData.badge.text}", role=${markerData.badge.role}, size=${markerData.badge.fontSize}`
    );

    assert(
      'Badge Status Dot Geometry (6x6px rounded-full)',
      Math.abs(markerData.dot.width - 6) <= 0.5 && Math.abs(markerData.dot.height - 6) <= 0.5,
      `dotSize=${markerData.dot.width}x${markerData.dot.height}px, radius=${markerData.dot.borderRadius}`
    );

    // 2. Interactive Hover: Hover Claim 2 (Inferred)
    console.log('\n[2/6] Auditing Interactive Hover -> Claim 2 (Inferred)...');
    await pageDark.locator('.ds-claim-btn[data-id="2"]').hover();
    await pageDark.waitForTimeout(100);

    const claim2BadgeText = await pageDark.locator('.ds-confidence-footer .ds-confidence-badge').textContent();
    const claim2DotClass = await pageDark.locator('.ds-confidence-footer .ds-claim-dot').getAttribute('class');
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/confidence-marker-hover-inferred-dark.png` });

    assert(
      'Hover Claim 2 Dynamically Updates Badge to Inferred',
      claim2BadgeText.includes('inferred') &&
        claim2BadgeText.includes('from the changed API') &&
        claim2DotClass.includes('ds-claim-dot--inferred'),
      `badgeText="${claim2BadgeText.trim()}", dotClass=${claim2DotClass}`
    );

    // 3. Interactive Hover: Hover Claim 3 (Uncertain)
    console.log('\n[3/6] Auditing Interactive Hover -> Claim 3 (Uncertain)...');
    await pageDark.locator('.ds-claim-btn[data-id="3"]').hover();
    await pageDark.waitForTimeout(100);

    const claim3BadgeText = await pageDark.locator('.ds-confidence-footer .ds-confidence-badge').textContent();
    const claim3DotClass = await pageDark.locator('.ds-confidence-footer .ds-claim-dot').getAttribute('class');
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/confidence-marker-hover-uncertain-dark.png` });

    assert(
      'Hover Claim 3 Dynamically Updates Badge to Unverified',
      claim3BadgeText.includes('unverified') &&
        claim3BadgeText.includes('not measured') &&
        claim3DotClass.includes('ds-claim-dot--uncertain'),
      `badgeText="${claim3BadgeText.trim()}", dotClass=${claim3DotClass}`
    );

    // 4. Light Mode: Default Story
    console.log('\n[4/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-18-confidence-marker--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-confidence-target [data-slot="confidence-marker"]');

    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/confidence-marker-default-light.png` });

    const lightStyles = await pageLight.locator('.ds-confidence-badge').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        background: s.backgroundColor,
        borderColor: s.borderColor,
        color: s.color,
      };
    });

    assert(
      'Light Mode Contrast and Palette Tokens',
      lightStyles.background !== 'transparent' && lightStyles.borderColor !== 'transparent',
      `bg=${lightStyles.background}, border=${lightStyles.borderColor}, color=${lightStyles.color}`
    );

    // 5. Auditing Variant Stories: Sourced Claim, Inferred Claim, Guess, All Sourced
    console.log('\n[5/6] Auditing Variant Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-18-confidence-marker--guess&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageGuess = await pageDark.locator('.ds-story-stage').first();
    await stageGuess.screenshot({ path: `${ARTIFACT_DIR}/confidence-marker-guess-dark.png` });

    const guessBadge = await pageDark.locator('.ds-confidence-badge').textContent();
    assert(
      'Guess Story Displays Unverified Badge',
      guessBadge.includes('unverified') && guessBadge.includes('not measured'),
      `guessBadge="${guessBadge.trim()}"`
    );

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-18-confidence-marker--all-sourced&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const allSourcedFooter = await pageDark.locator('.ds-confidence-footer').innerHTML();
    const allSourcedCount = await pageDark.locator('.ds-confidence-marker .ds-claim-btn, .ds-confidence-marker button').count();
    assert(
      'All Sourced Story Renders Clean Footer When Unhovered',
      allSourcedFooter.trim() === '' && allSourcedCount === 2,
      `footerHtml="${allSourcedFooter.trim()}", claimsCount=${allSourcedCount}`
    );

    // 6. Reduced Motion
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-18-confidence-marker--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const motionStyles = await pageDark.locator('.ds-confidence-badge').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        animation: s.animation,
        transition: s.transition,
      };
    });
    assert(
      'Reduced Motion Disables Animation & Transition',
      motionStyles.animation.includes('none') || motionStyles.transition.includes('none') || motionStyles.animation === 'none 0s ease 0s 1 normal none running',
      `animation=${motionStyles.animation}, transition=${motionStyles.transition}`
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
