import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-128-model-logos-aui';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 700 } });
  const page = await context.newPage();

  let passed = 0, total = 0;

  function check(name, pass, detail) {
    total++;
    if (pass) { passed++; console.log(`  ✓ ${name}`); }
    else { console.error(`  ✗ ${name} — ${detail}`); }
  }

  try {
    console.log('Auditing #128 Model Logos AUI...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-logo-24');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logos-default-dark.png') });

    const logos24 = page.locator('.ds-logo-24');
    const count24 = await logos24.count();
    check('Default story shows 3 logos at 24px size', count24 === 3, `${count24}`);

    for (let i = 0; i < count24; i++) {
      const box = await logos24.nth(i).boundingBox();
      check(`Logo[${i}] is 24x24px`, Math.round(box.width) === 24 && Math.round(box.height) === 24, `${box?.width}x${box?.height}`);
    }

    // OpenAI logo uses fill="currentColor" (inherits text color)
    const openAIFill = await page.locator('.ds-logo-24').first().getAttribute('fill');
    check('OpenAI logo uses fill="currentColor" (inherits theme color)', openAIFill === 'currentColor', openAIFill);

    // Light Theme
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-logo-24');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logos-default-light.png') });

    // ── Small Story ──
    await page.goto(`${BASE_URL}--small&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-logo-16');
    const logos16 = page.locator('.ds-logo-16');
    const count16 = await logos16.count();
    check('Small story shows 3 logos at 16px size', count16 === 3, `${count16}`);

    for (let i = 0; i < count16; i++) {
      const box = await logos16.nth(i).boundingBox();
      check(`Small logo[${i}] is 16x16px`, Math.round(box.width) === 16 && Math.round(box.height) === 16, `${box?.width}x${box?.height}`);
    }

    // ── WithLabels Story ──
    await page.goto(`${BASE_URL}--with-labels&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-logo-label');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logos-with-labels-dark.png') });

    const labels = page.locator('.ds-logo-label');
    const labelCount = await labels.count();
    check('WithLabels story shows 3 model name labels', labelCount === 3, `${labelCount}`);

    const firstLabelStyles = await labels.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Label font-size is 14px (var(--font-size-sm))', firstLabelStyles.fontSize === '14px', firstLabelStyles.fontSize);
    check('Label font-weight is 400 (strict normal rule)', firstLabelStyles.fontWeight === '400', firstLabelStyles.fontWeight);

    // ── Tinted Story ──
    await page.goto(`${BASE_URL}--tinted&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-logo-36');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logos-tinted-dark.png') });

    const logos36 = page.locator('.ds-logo-36');
    const count36 = await logos36.count();
    check('Tinted story shows 3 logos at 36px size', count36 === 3, `${count36}`);

    for (let i = 0; i < count36; i++) {
      const box = await logos36.nth(i).boundingBox();
      check(`Tinted logo[${i}] is 36x36px`, Math.round(box.width) === 36 && Math.round(box.height) === 36, `${box?.width}x${box?.height}`);
    }

    // Check all logos have accessible aria-label or aria-hidden
    const svgAccessibility = await page.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg'));
      return svgs.map(svg => ({
        ariaLabel: svg.getAttribute('aria-label'),
        ariaHidden: svg.getAttribute('aria-hidden')
      }));
    });
    const hasProperA11y = svgAccessibility.every(s => s.ariaLabel || s.ariaHidden === 'true');
    check('All SVG logos have aria-label or aria-hidden="true"', hasProperA11y, JSON.stringify(svgAccessibility.slice(0, 3)));

    console.log(`\nAudit finished: ${passed}/${total} passed`);
    if (passed < total) process.exit(1);
  } catch (err) {
    console.error('Audit runtime error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
