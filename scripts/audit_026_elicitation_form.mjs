import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 026 ELICITATION FORM ---');
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
    // 1. Dark Mode: Default Story (Request State)
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-26-elicitation-form--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="elicitation-form"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/elicitation-form-default-dark.png` });

    const defaultData = await pageDark.locator('[data-slot="elicitation-form"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const icon = el.querySelector('.ds-elicitation-form__icon');
      const iRect = icon ? icon.getBoundingClientRect() : {};
      const server = el.querySelector('.ds-elicitation-form__header span.ds-flex-1');
      const servS = server ? window.getComputedStyle(server) : {};
      const prompt = el.querySelector('.ds-elicitation-form__prompt');
      const pS = prompt ? window.getComputedStyle(prompt) : {};
      const input = el.querySelector('.ds-elicitation-form__input');
      const inS = input ? window.getComputedStyle(input) : {};
      const chips = Array.from(el.querySelectorAll('.ds-filter-chip')).map((c) => {
        const cS = window.getComputedStyle(c);
        return {
          text: c.textContent.trim(),
          fontSize: cS.fontSize,
          fontWeight: cS.fontWeight,
          isActive: c.classList.contains('ds-filter-chip--active'),
        };
      });
      const declineBtn = el.querySelector('.ds-elicitation-decline');
      const dRect = declineBtn ? declineBtn.getBoundingClientRect() : {};
      const sendBtn = el.querySelector('.ds-elicitation-send');
      const sRect = sendBtn ? sendBtn.getBoundingClientRect() : {};

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        padding: s.padding,
        iconSize: `${iRect.width}x${iRect.height}`,
        server: {
          text: server ? server.textContent.trim() : null,
          fontSize: servS.fontSize,
        },
        prompt: {
          fontSize: pS.fontSize,
          fontWeight: pS.fontWeight,
        },
        input: {
          fontSize: inS.fontSize,
          fontWeight: inS.fontWeight,
          value: input ? input.value : null,
        },
        chips: chips,
        buttons: {
          declineHeight: dRect.height,
          sendHeight: sRect.height,
        },
      };
    });

    results.measurements.defaultDark = defaultData;

    assert(
      'Container Geometry (384px max-width, 20px radius, 16px padding)',
      defaultData.maxWidth === '384px' &&
        defaultData.borderRadius === '20px' &&
        defaultData.padding === '16px',
      `maxWidth=${defaultData.maxWidth}, radius=${defaultData.borderRadius}, padding=${defaultData.padding}`
    );

    assert(
      'Header Plug Icon 28x28px and Server Name Typography',
      defaultData.iconSize === '28x28' && defaultData.server.text === 'github',
      `icon=${defaultData.iconSize}, server="${defaultData.server.text}"`
    );

    assert(
      'Prompt and Input Strict 400 Typography (12px)',
      defaultData.prompt.fontSize === '12px' &&
        defaultData.prompt.fontWeight === '400' &&
        defaultData.input.fontSize === '12px' &&
        defaultData.input.fontWeight === '400',
      `prompt=${defaultData.prompt.fontSize}/${defaultData.prompt.fontWeight}, input=${defaultData.input.fontSize}/${defaultData.input.fontWeight}`
    );

    assert(
      'Scope Filter Chips Strict 400 Typography (12px)',
      defaultData.chips.length === 3 &&
        defaultData.chips.every((c) => c.fontSize === '12px' && c.fontWeight === '400'),
      `chips=${defaultData.chips.map((c) => `${c.text}(${c.fontWeight})`).join(', ')}`
    );

    assert(
      'Compact Action Buttons (Height <= 32px)',
      defaultData.buttons.declineHeight <= 32 && defaultData.buttons.sendHeight <= 32,
      `declineHeight=${defaultData.buttons.declineHeight}px, sendHeight=${defaultData.buttons.sendHeight}px`
    );

    // 2. Interactive Send -> Accepted State
    console.log('\n[2/6] Testing Interactive Send Action...');
    await pageDark.locator('.ds-elicitation-send').click();
    await pageDark.waitForTimeout(200);

    const acceptedResult = await pageDark.locator('[data-slot="elicitation-form"]').evaluate((el) => {
      const checkIcon = el.querySelector('svg.ds-diff-stat-add');
      const text = el.querySelector('.ds-diff-stat-add span');
      return {
        hasCheckIcon: !!checkIcon,
        text: text ? text.textContent.trim() : null,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/elicitation-form-interactive-accepted-dark.png` });

    assert(
      'Clicking Send Transitions Form to Accepted State ("Sent to github" + Checkmark)',
      acceptedResult.hasCheckIcon && acceptedResult.text === 'Sent to github',
      `checkIcon=${acceptedResult.hasCheckIcon}, text="${acceptedResult.text}"`
    );

    // 3. Interactive Decline Action via Reload
    console.log('\n[3/6] Testing Interactive Decline Action...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-26-elicitation-form--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.locator('.ds-elicitation-decline').click();
    await pageDark.waitForTimeout(200);

    const declinedResult = await pageDark.locator('[data-slot="elicitation-form"]').evaluate((el) => {
      const xIcon = el.querySelector('svg.ds-diff-stat-remove');
      const text = el.querySelector('.ds-diff-stat-remove span');
      return {
        hasXIcon: !!xIcon,
        text: text ? text.textContent.trim() : null,
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/elicitation-form-interactive-declined-dark.png` });

    assert(
      'Clicking Decline Transitions Form to Declined State ("Declined" + X Icon)',
      declinedResult.hasXIcon && declinedResult.text === 'Declined',
      `xIcon=${declinedResult.hasXIcon}, text="${declinedResult.text}"`
    );

    // 4. Auditing Accepted & Declined Variant Stories
    console.log('\n[4/6] Auditing Variant Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-26-elicitation-form--accepted&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    const stageAccepted = await pageDark.locator('.ds-story').first();
    await stageAccepted.screenshot({ path: `${ARTIFACT_DIR}/elicitation-form-accepted-story-dark.png` });

    const staticAcceptedText = await pageDark.locator('.ds-diff-stat-add span').textContent();
    assert(
      'Accepted Story Renders "Sent to github"',
      staticAcceptedText.trim() === 'Sent to github',
      `text="${staticAcceptedText.trim()}"`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-26-elicitation-form--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/elicitation-form-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="elicitation-form"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
      };
    });

    assert(
      'Light Mode Surface and Border Tokens',
      lightStyles.bg !== 'transparent' && lightStyles.border !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-26-elicitation-form--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-elicitation-form__input').evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Disables Input Transition',
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
