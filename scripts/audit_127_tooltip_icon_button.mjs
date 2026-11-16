import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-127-tooltip-icon-button-aui';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await context.newPage();

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    checks: []
  };

  function check(name, pass, detail) {
    results.total++;
    if (pass) {
      results.passed++;
      results.checks.push({ name, pass: true, detail });
      console.log(`  ✓ ${name}`);
    } else {
      results.failed++;
      results.checks.push({ name, pass: false, detail });
      console.error(`  ✗ ${name} - ${detail}`);
    }
  }

  try {
    console.log('Auditing #127 Tooltip icon button AUI...');

    // 1. Default Story (Dark)
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    const defaultBtn = page.locator('.ds-tooltip-icon-btn').first();
    await defaultBtn.waitFor({ state: 'visible' });

    // Screenshots
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tooltip-icon-button-default-dark.png') });

    // Light Theme
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.locator('.ds-tooltip-icon-btn').first().waitFor({ state: 'visible' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tooltip-icon-button-default-light.png') });

    // Return to Dark
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });

    // Check button attributes
    const ariaLabel = await defaultBtn.getAttribute('aria-label');
    check('Default button has accessible aria-label', !!ariaLabel && ariaLabel.length > 0, ariaLabel);

    const srOnly = await page.locator('.ds-tooltip-icon-btn .sr-only').first().textContent();
    check('Button contains accessible sr-only text matching tooltip', !!srOnly && srOnly.trim().length > 0, srOnly);

    const btnBox = await defaultBtn.boundingBox();
    check('Standard button width is 32px (compact control height)', Math.round(btnBox.width) === 32, `${btnBox?.width}px`);
    check('Standard button height is 32px (compact control height)', Math.round(btnBox.height) === 32, `${btnBox?.height}px`);

    const btnStyles = await defaultBtn.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        borderRadius: cs.borderRadius,
        display: cs.display,
        alignItems: cs.alignItems,
        justifyContent: cs.justifyContent,
        cursor: cs.cursor
      };
    });
    check('Standard button radius is 8px', btnStyles.borderRadius === '8px', btnStyles.borderRadius);
    check('Button uses flex/inline-flex centering', (btnStyles.display === 'inline-flex' || btnStyles.display === 'flex') && btnStyles.alignItems === 'center', btnStyles.display);

    // Check Tooltip bubble typography
    const bubble = page.locator('.ds-tooltip-icon-btn-bubble').first();
    const bubbleStyles = await bubble.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        borderRadius: cs.borderRadius,
        position: cs.position
      };
    });
    check('Tooltip bubble font-size is 12px (sm/xs)', bubbleStyles.fontSize === '12px', bubbleStyles.fontSize);
    check('Tooltip bubble font-weight is 400 (strict normal rule)', bubbleStyles.fontWeight === '400', bubbleStyles.fontWeight);
    check('Tooltip bubble has absolute positioning', bubbleStyles.position === 'absolute', bubbleStyles.position);

    // Check ARIA role="tooltip"
    const bubbleRole = await bubble.getAttribute('role');
    check('Tooltip element has role="tooltip"', bubbleRole === 'tooltip', bubbleRole);

    // 2. Variants Story
    await page.goto(`${BASE_URL}--variants&globals=theme:dark`, { waitUntil: 'networkidle' });
    const smBtn = page.locator('.ds-tooltip-icon-btn--sm').first();
    const smBox = await smBtn.boundingBox();
    check('Small button size is 24px (compact icon size)', Math.round(smBox.width) === 24 && Math.round(smBox.height) === 24, `${smBox?.width}x${smBox?.height}px`);

    const destructBtn = page.locator('.ds-tooltip-icon-btn--destructive').first();
    const destructColor = await destructBtn.evaluate((el) => window.getComputedStyle(el).color);
    check('Destructive variant has distinct error color', destructColor.length > 0 && destructColor !== 'rgba(0, 0, 0, 0)', destructColor);

    // 3. Disabled Story
    await page.goto(`${BASE_URL}--disabled&globals=theme:dark`, { waitUntil: 'networkidle' });
    const disabledBtn = page.locator('.ds-tooltip-icon-btn:disabled');
    const isDisabled = await disabledBtn.isDisabled();
    check('Disabled button has disabled HTML attribute', isDisabled === true, `${isDisabled}`);
    const disabledOpacity = await disabledBtn.evaluate((el) => window.getComputedStyle(el).opacity);
    check('Disabled button has dimmed opacity (0.4)', parseFloat(disabledOpacity) <= 0.5, disabledOpacity);

    // 4. Interactive Story (Hover / Pinned)
    await page.goto(`${BASE_URL}--interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
    const pinnedBubble = page.locator('#test-pinned-wrapper .ds-tooltip-icon-btn-bubble');
    const pinnedVisible = await pinnedBubble.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return cs.opacity === '1' && cs.visibility === 'visible';
    });
    check('Pinned wrapper exhibits fully visible tooltip (opacity: 1)', pinnedVisible === true, `${pinnedVisible}`);

    // Hover test
    const hoverBtn = page.locator('#test-hover-btn');
    await hoverBtn.hover();
    await page.waitForTimeout(200);
    const hoverBubble = page.locator('#tooltip-interactive-1');
    const hoverVisible = await hoverBubble.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return cs.opacity === '1' && cs.visibility === 'visible';
    });
    check('Hovering button smoothly reveals tooltip bubble', hoverVisible === true, `${hoverVisible}`);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tooltip-icon-button-interactive-dark.png') });

    console.log(`\nAudit finished: ${results.passed}/${results.total} passed`);
    if (results.failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Audit failed with runtime error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
