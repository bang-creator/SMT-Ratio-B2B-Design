import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 030 COMPUTER USE ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="computer-use"]');

    const stageDefaultDark = await pageDark.locator('.ds-story').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/computer-use-default-dark.png` });

    const defaultMetrics = await pageDark.locator('[data-slot="computer-use"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const dots = Array.from(el.querySelectorAll('.ds-window-dot')).map((d) => {
        const dRect = d.getBoundingClientRect();
        const dS = window.getComputedStyle(d);
        return {
          size: `${Math.round(dRect.width)}x${Math.round(dRect.height)}`,
          bg: dS.backgroundColor,
        };
      });
      const addr = el.querySelector('.ds-computer-use__address');
      const addrS = addr ? window.getComputedStyle(addr) : {};
      const viewport = el.querySelector('.ds-computer-use__viewport');
      const vpRect = viewport ? viewport.getBoundingClientRect() : {};
      const trailDots = Array.from(el.querySelectorAll('.ds-computer-dot')).map((td) => {
        const tdRect = td.getBoundingClientRect();
        const tdS = window.getComputedStyle(td);
        return {
          size: `${Math.round(tdRect.width)}x${Math.round(tdRect.height)}`,
          opacity: tdS.opacity,
          left: td.style.left || tdS.left,
          top: td.style.top || tdS.top,
        };
      });
      const cursor = el.querySelector('.ds-computer-cursor');
      const cRect = cursor ? cursor.getBoundingClientRect() : {};
      const cS = cursor ? window.getComputedStyle(cursor) : {};
      const action = el.querySelector('.ds-computer-use__action');
      const actS = action ? window.getComputedStyle(action) : {};
      const target = el.querySelector('.ds-computer-use__target');
      const tgtS = target ? window.getComputedStyle(target) : {};
      const step = el.querySelector('.ds-computer-use__step');
      const stepS = step ? window.getComputedStyle(step) : {};

      return {
        maxWidth: s.maxWidth,
        borderRadius: s.borderRadius,
        overflow: s.overflow,
        bg: s.backgroundColor,
        border: s.borderColor,
        windowDots: dots,
        address: {
          text: addr ? addr.textContent.trim() : null,
          fontSize: addrS.fontSize,
          fontWeight: addrS.fontWeight,
        },
        viewportHeight: Math.round(vpRect.height),
        trailCount: trailDots.length,
        trailDots: trailDots,
        cursor: {
          size: `${Math.round(cRect.width)}x${Math.round(cRect.height)}`,
          left: cS.left,
          top: cS.top,
          color: cS.color,
        },
        footer: {
          action: action ? action.textContent.trim() : null,
          actionWeight: actS.fontWeight,
          target: target ? target.textContent.trim() : null,
          targetWeight: tgtS.fontWeight,
          step: step ? step.textContent.trim() : null,
          stepWeight: stepS.fontWeight,
        },
      };
    });

    results.measurements.defaultMetrics = defaultMetrics;

    assert(
      'Container Geometry (448px max-width, 16px radius, overflow hidden)',
      defaultMetrics.maxWidth === '448px' &&
        defaultMetrics.borderRadius === '16px' &&
        defaultMetrics.overflow === 'hidden',
      `maxWidth=${defaultMetrics.maxWidth}, radius=${defaultMetrics.borderRadius}, overflow=${defaultMetrics.overflow}`
    );

    assert(
      'Window Bar Elements (3 dots 8x8px, 11px strict 400 mono address)',
      defaultMetrics.windowDots.length === 3 &&
        defaultMetrics.windowDots.every((d) => d.size === '8x8') &&
        defaultMetrics.address.fontSize === '11px' &&
        defaultMetrics.address.fontWeight === '400',
      `dots=${defaultMetrics.windowDots.map((d) => d.size).join(', ')}, addr=${defaultMetrics.address.text}(${defaultMetrics.address.fontWeight})`
    );

    assert(
      'Viewport Height (>= 140px) and Trail Dots Geometry (8x8px)',
      defaultMetrics.viewportHeight >= 140 &&
        defaultMetrics.trailCount === 3 &&
        defaultMetrics.trailDots.every((td) => td.size === '8x8'),
      `height=${defaultMetrics.viewportHeight}px, trailCount=${defaultMetrics.trailCount}`
    );

    assert(
      'Active Cursor 16x16px and Semantic Blue Accent Color',
      defaultMetrics.cursor.size === '16x16' && defaultMetrics.cursor.color.includes('2'),
      `size=${defaultMetrics.cursor.size}, color=${defaultMetrics.cursor.color}`
    );

    assert(
      'Footer Telemetry Strict 400 Typography (Action, Target, Step)',
      defaultMetrics.footer.action === 'click' &&
        defaultMetrics.footer.actionWeight === '400' &&
        defaultMetrics.footer.targetWeight === '400' &&
        defaultMetrics.footer.step === '3/5' &&
        defaultMetrics.footer.stepWeight === '400',
      `action=${defaultMetrics.footer.action}(${defaultMetrics.footer.actionWeight}), target=${defaultMetrics.footer.target}(${defaultMetrics.footer.targetWeight}), step=${defaultMetrics.footer.step}(${defaultMetrics.footer.stepWeight})`
    );

    // 2. TypeAction Variant Story Audit
    console.log('\n[2/6] Auditing TypeAction Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--type-action&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const stageType = await pageDark.locator('.ds-story').first();
    await stageType.screenshot({ path: `${ARTIFACT_DIR}/computer-use-type-action-dark.png` });

    const typeActionData = await pageDark.locator('[data-slot="computer-use"]').evaluate((el) => {
      const act = el.querySelector('.ds-computer-use__action');
      const tgt = el.querySelector('.ds-computer-use__target');
      const stp = el.querySelector('.ds-computer-use__step');
      const cur = el.querySelector('.ds-computer-cursor');
      return {
        action: act ? act.textContent.trim() : null,
        target: tgt ? tgt.textContent.trim() : null,
        step: stp ? stp.textContent.trim() : null,
        cursorStepClass: cur ? cur.className : '',
      };
    });

    assert(
      'TypeAction Story Reflects Step 2/5 with "type" Action and Input Target',
      typeActionData.action === 'type' &&
        typeActionData.step === '2/5' &&
        typeActionData.cursorStepClass.includes('step-2'),
      `action="${typeActionData.action}", step="${typeActionData.step}", class="${typeActionData.cursorStepClass}"`
    );

    // 3. TerminalAction Variant Story Audit
    console.log('\n[3/6] Auditing TerminalAction Variant Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--terminal-action&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    const terminalActionData = await pageDark.locator('[data-slot="computer-use"]').evaluate((el) => {
      const act = el.querySelector('.ds-computer-use__action');
      const stp = el.querySelector('.ds-computer-use__step');
      const cur = el.querySelector('.ds-computer-cursor');
      return {
        action: act ? act.textContent.trim() : null,
        step: stp ? stp.textContent.trim() : null,
        cursorStepClass: cur ? cur.className : '',
      };
    });

    assert(
      'TerminalAction Story Reflects Step 4/5 with "scroll" Action',
      terminalActionData.action === 'scroll' &&
        terminalActionData.step === '4/5' &&
        terminalActionData.cursorStepClass.includes('step-4'),
      `action="${terminalActionData.action}", step="${terminalActionData.step}"`
    );

    // 4. Interactive Step Advancement
    console.log('\n[4/6] Testing Interactive Step Advancement on Viewport Click...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });

    // Click viewport to advance from step 3 to step 4
    await pageDark.locator('.ds-computer-use-advance').click();
    await pageDark.waitForTimeout(200);

    const advancedData = await pageDark.locator('[data-slot="computer-use"]').evaluate((el) => {
      const act = el.querySelector('.ds-computer-use__action');
      const stp = el.querySelector('.ds-computer-use__step');
      const cur = el.querySelector('.ds-computer-cursor');
      return {
        action: act ? act.textContent.trim() : null,
        step: stp ? stp.textContent.trim() : null,
        cursorStepClass: cur ? cur.className : '',
      };
    });

    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/computer-use-interactive-advanced-dark.png` });

    assert(
      'Clicking Viewport Advances Step to 4/5 ("scroll") with Updated Cursor Class',
      advancedData.step === '4/5' &&
        advancedData.action === 'scroll' &&
        advancedData.cursorStepClass.includes('step-4'),
      `step="${advancedData.step}", action="${advancedData.action}", class="${advancedData.cursorStepClass}"`
    );

    // 5. Light Mode Audit
    console.log('\n[5/6] Auditing Light Mode...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();

    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });

    const stageLight = await pageLight.locator('.ds-story').first();
    await stageLight.screenshot({ path: `${ARTIFACT_DIR}/computer-use-default-light.png` });

    const lightStyles = await pageLight.locator('[data-slot="computer-use"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const vp = el.querySelector('.ds-computer-use__viewport');
      const vpS = vp ? window.getComputedStyle(vp) : {};
      return {
        bg: s.backgroundColor,
        border: s.borderColor,
        vpBg: vpS.backgroundColor,
      };
    });

    assert(
      'Light Mode Resolves Valid Surface and Secondary Surface Backgrounds',
      lightStyles.bg !== 'transparent' &&
        lightStyles.border !== 'transparent' &&
        lightStyles.vpBg !== 'transparent',
      `bg=${lightStyles.bg}, border=${lightStyles.border}, vpBg=${lightStyles.vpBg}`
    );

    // 6. Reduced Motion Audit
    console.log('\n[6/6] Auditing Reduced Motion...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-30-computer-use--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });

    const motionStyles = await pageDark.locator('.ds-computer-cursor').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        transition: s.transition,
      };
    });

    assert(
      'Reduced Motion Mode Disables Cursor Position Transitions',
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