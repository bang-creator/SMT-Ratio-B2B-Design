import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 024 REVIEWABLE DIFF ---');
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
    // 1. Dark Mode: Default Story (1 pending, 1 kept)
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-24-reviewable-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="reviewable-diff"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/reviewable-diff-default-dark.png` });

    const defaultData = await pageDark.locator('[data-slot="reviewable-diff"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const filename = el.querySelector('.ds-code-diff__filename');
      const fnS = filename ? window.getComputedStyle(filename) : {};
      const headerStats = el.querySelector('.ds-reviewable-header-stats');
      const hsS = headerStats ? window.getComputedStyle(headerStats) : {};
      const footerStats = el.querySelector('.ds-reviewable-footer-stats');
      const fsS = footerStats ? window.getComputedStyle(footerStats) : {};
      const applyBtn = el.querySelector('.ds-reviewable-diff__apply-btn');
      const apS = applyBtn ? window.getComputedStyle(applyBtn) : {};
      const apRect = applyBtn ? applyBtn.getBoundingClientRect() : {};

      const hunks = Array.from(el.querySelectorAll('.ds-reviewable-diff__hunk')).map((h) => {
        const range = h.querySelector('.ds-reviewable-diff__hunk-bar span:first-child');
        const keepBtn = h.querySelector('.ds-hunk-keep-btn');
        const kRect = keepBtn ? keepBtn.getBoundingClientRect() : {};
        const kS = keepBtn ? window.getComputedStyle(keepBtn) : {};
        const discardBtn = h.querySelector('.ds-hunk-discard-btn');
        const dRect = discardBtn ? discardBtn.getBoundingClientRect() : {};
        const tag = h.querySelector('.ds-hunk-tag');
        const tS = tag ? window.getComputedStyle(tag) : {};

        return {
          range: range ? range.textContent.trim() : null,
          hasKeepBtn: !!keepBtn,
          keepBtnHeight: kRect.height,
          keepBtnColor: kS.color,
          hasDiscardBtn: !!discardBtn,
          discardBtnHeight: dRect.height,
          tagText: tag ? tag.textContent.trim() : null,
          tagColor: tS.color,
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        filename: {
          text: filename ? filename.textContent.trim() : null,
          fontSize: fnS.fontSize,
          fontWeight: fnS.fontWeight,
        },
        headerStats: {
          text: headerStats ? headerStats.textContent.trim() : null,
          fontSize: hsS.fontSize,
          fontWeight: hsS.fontWeight,
        },
        footerStats: {
          text: footerStats ? footerStats.textContent.trim() : null,
          fontSize: fsS.fontSize,
          fontWeight: fsS.fontWeight,
        },
        applyButton: {
          text: applyBtn ? applyBtn.textContent.trim() : null,
          disabled: applyBtn ? applyBtn.disabled : false,
          height: apRect.height,
          borderRadius: apS.borderRadius,
          fontWeight: apS.fontWeight,
        },
        hunks: hunks,
      };
    });

    results.measurements.defaultDark = defaultData;

    assert(
      'Container Geometry (448px max-width, 16px radius)',
      defaultData.maxWidth === '448px' && defaultData.borderRadius === '16px',
      `maxWidth=${defaultData.maxWidth}, radius=${defaultData.borderRadius}`
    );

    assert(
      'Filename & Stats Strict 400 Typography (12px / 11px)',
      defaultData.filename.fontSize === '12px' &&
        defaultData.filename.fontWeight === '400' &&
        defaultData.headerStats.fontSize === '11px' &&
        defaultData.headerStats.fontWeight === '400',
      `fn=${defaultData.filename.fontSize}/${defaultData.filename.fontWeight}, stats=${defaultData.headerStats.fontSize}/${defaultData.headerStats.fontWeight}`
    );

    assert(
      'Hunk 1 Pending Has 24px Pill Action Buttons (Keep in Emerald, Discard in Muted)',
      defaultData.hunks[0].hasKeepBtn &&
        defaultData.hunks[0].hasDiscardBtn &&
        Math.abs(defaultData.hunks[0].keepBtnHeight - 24) <= 1 &&
        Math.abs(defaultData.hunks[0].discardBtnHeight - 24) <= 1 &&
        defaultData.hunks[0].keepBtnColor.includes('16, 163, 127'),
      `keepHeight=${defaultData.hunks[0].keepBtnHeight}px, discardHeight=${defaultData.hunks[0].discardBtnHeight}px, keepColor=${defaultData.hunks[0].keepBtnColor}`
    );

    assert(
      'Hunk 2 Kept Has Emerald Kept Tag',
      defaultData.hunks[1].tagText === 'kept' && defaultData.hunks[1].tagColor.includes('16, 163, 127'),
      `tagText="${defaultData.hunks[1].tagText}", color=${defaultData.hunks[1].tagColor}`
    );

    assert(
      'Apply Button Disabled When Pending Hunks Remain (Height: 28px)',
      defaultData.applyButton.disabled === true &&
        defaultData.applyButton.text === 'Apply 1' &&
        Math.abs(defaultData.applyButton.height - 28) <= 1 &&
        defaultData.applyButton.borderRadius === '9999px',
      `disabled=${defaultData.applyButton.disabled}, text="${defaultData.applyButton.text}", height=${defaultData.applyButton.height}px`
    );

    // 2. Interactive State Machine: Keep Hunk 1
    console.log('\n[2/6] Testing Interactive Decision: Keep Hunk 1...');
    await pageDark.locator('.ds-hunk-keep-btn').first().click();
    await pageDark.waitForTimeout(200);

    const keptInteractiveData = await pageDark.locator('[data-slot="reviewable-diff"]').evaluate((el) => {
      const headerStats = el.querySelector('.ds-reviewable-header-stats');
      const footerStats = el.querySelector('.ds-reviewable-footer-stats');
      const applyBtn = el.querySelector('.ds-reviewable-diff__apply-btn');
      const hunk1Tag = el.querySelector('.ds-reviewable-diff__hunk[data-hunk-id="hunk-1"] .ds-hunk-tag');
      return {
        headerText: headerStats ? headerStats.textContent.trim() : null,
        footerText: footerStats ? footerStats.textContent.trim() : null,
        applyText: applyBtn ? applyBtn.textContent.trim() : null,
        applyDisabled: applyBtn ? applyBtn.disabled : null,
        hunk1Tag: hunk1Tag ? hunk1Tag.textContent.trim() : null,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/reviewable-diff-interactive-kept-dark.png` });

    assert(
      'Keeping Hunk 1 Updates Counts to "2 of 2 kept", "All reviewed", and Enables Apply Button',
      keptInteractiveData.headerText === '2 of 2 kept' &&
        keptInteractiveData.footerText === 'All reviewed' &&
        keptInteractiveData.applyText === 'Apply 2' &&
        keptInteractiveData.applyDisabled === false &&
        keptInteractiveData.hunk1Tag === 'kept',
      `header="${keptInteractiveData.headerText}", footer="${keptInteractiveData.footerText}", apply="${keptInteractiveData.applyText}", disabled=${keptInteractiveData.applyDisabled}`
    );

    // 3. Testing Discard Action via Reload
    console.log('\n[3/6] Testing Interactive Decision: Discard Hunk 1...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-24-reviewable-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.locator('.ds-hunk-discard-btn').first().click();
    await pageDark.waitForTimeout(350);

    const discardedData = await pageDark.locator('[data-slot="reviewable-diff"]').evaluate((el) => {
      const hunk1 = el.querySelector('.ds-reviewable-diff__hunk[data-hunk-id="hunk-1"]');
      const h1S = hunk1 ? window.getComputedStyle(hunk1) : {};
      const tag = hunk1 ? hunk1.querySelector('.ds-hunk-tag') : null;
      const headerStats = el.querySelector('.ds-reviewable-header-stats');
      const footerStats = el.querySelector('.ds-reviewable-footer-stats');
      const applyBtn = el.querySelector('.ds-reviewable-diff__apply-btn');

      return {
        opacity: h1S.opacity,
        tagText: tag ? tag.textContent.trim() : null,
        headerText: headerStats ? headerStats.textContent.trim() : null,
        footerText: footerStats ? footerStats.textContent.trim() : null,
        applyText: applyBtn ? applyBtn.textContent.trim() : null,
        applyDisabled: applyBtn ? applyBtn.disabled : null,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/reviewable-diff-interactive-discarded-dark.png` });

    assert(
      'Discarding Hunk 1 Fades Out Hunk (opacity: 0.4), Shows "1 of 2 kept", "All reviewed", and "Apply 1"',
      Math.abs(parseFloat(discardedData.opacity) - 0.4) <= 0.05 &&
        discardedData.tagText === 'discarded' &&
        discardedData.headerText === '1 of 2 kept' &&
        discardedData.footerText === 'All reviewed' &&
        discardedData.applyText === 'Apply 1' &&
        discardedData.applyDisabled === false,
      `opacity=${discardedData.opacity}, tag="${discardedData.tagText}", header="${discardedData.headerText}", apply="${discardedData.applyText}"`
    );

    // 4. Auditing All Reviewed Story
    console.log('\n[4/6] Auditing All Reviewed Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-24-reviewable-diff--all-reviewed&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageAllReviewed = await pageDark.locator('.ds-story').first();
    await stageAllReviewed.screenshot({ path: `${ARTIFACT_DIR}/reviewable-diff-all-reviewed-dark.png` });

    const allRevData = await pageDark.locator('[data-slot="reviewable-diff"]').evaluate((el) => {
      const applyBtn = el.querySelector('.ds-reviewable-diff__apply-btn');
      const footerStats = el.querySelector('.ds-reviewable-footer-stats');
      return {
        footerText: footerStats ? footerStats.textContent.trim() : null,
        applyDisabled: applyBtn ? applyBtn.disabled : null,
        applyText: applyBtn ? applyBtn.textContent.trim() : null,
      };
    });

    assert(
      'All Reviewed Story Has Enabled Apply Button Initially',
      allRevData.footerText === 'All reviewed' &&
        allRevData.applyDisabled === false &&
        allRevData.applyText === 'Apply 1',
      `footer="${allRevData.footerText}", disabled=${allRevData.applyDisabled}, text="${allRevData.applyText}"`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-24-reviewable-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/reviewable-diff-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="reviewable-diff"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const keepBtn = el.querySelector('.ds-hunk-keep-btn');
      const kS = keepBtn ? window.getComputedStyle(keepBtn) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        keepBg: kS.backgroundColor,
        keepColor: kS.color,
      };
    });

    assert(
      'Light Mode Tokens for Surface and Keep Button',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.keepColor.includes('16, 163, 127'),
      `bg=${lightStyles.bg}, border=${lightStyles.border}, keepColor=${lightStyles.keepColor}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-24-reviewable-diff--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-reviewable-diff__hunk').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Disables Hunk Transition',
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
