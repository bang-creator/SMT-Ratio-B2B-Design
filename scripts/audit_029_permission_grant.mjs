import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 029 PERMISSION GRANT ---');
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
    // 1. Dark Mode: Default Story (Pending State)
    console.log('\n[1/7] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="permission-grant"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/permission-grant-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="permission-grant"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const iconBox = el.querySelector('.ds-permission-grant__icon-box');
      const ibRect = iconBox ? iconBox.getBoundingClientRect() : {};
      const cap = el.querySelector('.ds-permission-grant__capability');
      const capS = cap ? window.getComputedStyle(cap) : {};
      const req = el.querySelector('.ds-permission-grant__requester');
      const reqS = req ? window.getComputedStyle(req) : {};
      const label = el.querySelector('.ds-permission-grant__reach-label');
      const labelS = label ? window.getComputedStyle(label) : {};
      const items = Array.from(el.querySelectorAll('.ds-permission-grant__reach-item')).map((it) => {
        const bullet = it.querySelector('.ds-permission-grant__bullet');
        const bRect = bullet ? bullet.getBoundingClientRect() : {};
        const itS = window.getComputedStyle(it);
        return {
          text: it.textContent.trim(),
          fontSize: itS.fontSize,
          fontWeight: itS.fontWeight,
          bulletSize: `${Math.round(bRect.width)}x${Math.round(bRect.height)}`,
        };
      });
      const btns = Array.from(el.querySelectorAll('.ds-permission-grant__btn')).map((btn) => {
        const bRect = btn.getBoundingClientRect();
        const bS = window.getComputedStyle(btn);
        return {
          text: btn.textContent.trim(),
          height: Math.round(bRect.height),
          radius: bS.borderRadius,
          fontSize: bS.fontSize,
          fontWeight: bS.fontWeight,
          isAlways: btn.classList.contains('ds-permission-grant__btn--always'),
        };
      });

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        bg: s.backgroundColor,
        border: s.borderColor,
        iconBoxSize: `${Math.round(ibRect.width)}x${Math.round(ibRect.height)}`,
        capability: {
          text: cap ? cap.textContent.trim() : null,
          fontSize: capS.fontSize,
          fontWeight: capS.fontWeight,
        },
        requester: {
          text: req ? req.textContent.trim() : null,
          fontSize: reqS.fontSize,
          fontWeight: reqS.fontWeight,
        },
        reachLabel: {
          text: label ? label.textContent.trim() : null,
          fontSize: labelS.fontSize,
          fontWeight: labelS.fontWeight,
        },
        items: items,
        buttons: btns,
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (384px max-width, 20px radius, 16px padding)',
      defaultMetrics.maxWidth === '384px' &&
        defaultMetrics.borderRadius === '20px' &&
        defaultMetrics.padding === '16px',
      `maxWidth=${defaultMetrics.maxWidth}, radius=${defaultMetrics.borderRadius}, padding=${defaultMetrics.padding}`
    );

    assert(
      'Header Icon Container Geometry (28x28px) and Capability/Requester Hierarchy',
      defaultMetrics.iconBoxSize === '28x28' &&
        defaultMetrics.capability.fontWeight === '500' &&
        defaultMetrics.requester.fontWeight === '400',
      `iconBox=${defaultMetrics.iconBoxSize}, cap=${defaultMetrics.capability.text}(${defaultMetrics.capability.fontWeight}), req=${defaultMetrics.requester.text}(${defaultMetrics.requester.fontWeight})`
    );

    assert(
      'Reach List Geometry (4x4px bullets, strict 400 typography)',
      defaultMetrics.items.length === 2 &&
        defaultMetrics.items.every((it) => it.bulletSize === '4x4' && it.fontWeight === '400'),
      `items=${defaultMetrics.items.map((it) => `${it.text}[${it.bulletSize}]`).join(', ')}`
    );

    assert(
      'Action Buttons Standard Compact Geometry (32px height, full radius)',
      defaultMetrics.buttons.length === 3 &&
        defaultMetrics.buttons.every((b) => b.height === 32 && b.radius === '9999px'),
      `buttons=${defaultMetrics.buttons.map((b) => `${b.text}:${b.height}px`).join(', ')}`
    );

    // 2. Interactive Always Click Action
    console.log('\n[2/7] Testing Interactive "Always" Action...');
    await pageDark.locator('.ds-perm-always').click();
    await pageDark.waitForTimeout(200);

    const alwaysReceipt = await pageDark.locator('.ds-permission-grant__receipt').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        radius: s.borderRadius,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/permission-grant-interactive-always-dark.png` });

    assert(
      'Clicking "Always" Transitions Footer to Receipt Pill ("granted · always")',
      alwaysReceipt.text === 'granted · always' &&
        alwaysReceipt.fontSize === '11px' &&
        alwaysReceipt.fontWeight === '400',
      `text="${alwaysReceipt.text}", font=${alwaysReceipt.fontSize}/${alwaysReceipt.fontWeight}`
    );

    // 3. Interactive Deny Click Action
    console.log('\n[3/7] Testing Interactive "Deny" Action...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await pageDark.locator('.ds-perm-deny').click();
    await pageDark.waitForTimeout(200);

    const denyReceipt = await pageDark.locator('.ds-permission-grant__receipt').textContent();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/permission-grant-interactive-denied-dark.png` });

    assert(
      'Clicking "Deny" Transitions Footer to Receipt Pill ("denied")',
      denyReceipt.trim() === 'denied',
      `text="${denyReceipt.trim()}"`
    );

    // 4. Interactive Session Click Action
    console.log('\n[4/7] Testing Interactive "This session" Action...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    await pageDark.locator('.ds-perm-session').click();
    await pageDark.waitForTimeout(200);

    const sessionReceipt = await pageDark.locator('.ds-permission-grant__receipt').textContent();
    assert(
      'Clicking "This session" Transitions Footer to Receipt Pill ("granted · session")',
      sessionReceipt.trim() === 'granted · session',
      `text="${sessionReceipt.trim()}"`
    );

    // 5. Static Granted & Denied Variant Stories
    console.log('\n[5/7] Auditing Static Variant Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--granted&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const staticGrantedText = await pageDark.locator('.ds-permission-grant__receipt').textContent();
    assert(
      'Granted Variant Story Renders "granted · always"',
      staticGrantedText.trim() === 'granted · always',
      `text="${staticGrantedText.trim()}"`
    );

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--denied&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const staticDeniedText = await pageDark.locator('.ds-permission-grant__receipt').textContent();
    assert(
      'Denied Variant Story Renders "denied"',
      staticDeniedText.trim() === 'denied',
      `text="${staticDeniedText.trim()}"`
    );

    // 6. Light Mode Audit
    console.log('\n[6/7] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/permission-grant-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="permission-grant"]').evaluate((el) => {
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

    // 7. Reduced Motion Audit
    console.log('\n[7/7] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-29-permission-grant--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-permission-grant__btn').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Mode Disables Button Transitions',
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