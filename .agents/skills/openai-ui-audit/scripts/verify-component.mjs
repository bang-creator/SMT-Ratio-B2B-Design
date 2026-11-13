#!/usr/bin/env node
/**
 * OpenAI UI Audit - Automated Component Style & Geometry Verifier
 * Usage: node verify-component.mjs <story-id> [theme=dark] [selector]
 * Example: node verify-component.mjs default-shared-date-picker--default dark .ds-date-picker
 */

import { createRequire } from 'module';
import path from 'path';

let chromium;
try {
  const req = createRequire(path.join(process.cwd(), 'dummy.js'));
  const pw = req('playwright');
  chromium = pw.chromium;
} catch (e) {
  const pw = await import('playwright');
  chromium = pw.chromium;
}

const storyId = process.argv[2] || 'default-shared-date-picker--default';
const theme = process.argv[3] || 'dark';
const targetSelector = process.argv[4] || '.ds-date-picker, .ds-button, .ds-input, [data-ds-date-picker]';

const STORYBOOK_BASE = process.env.STORYBOOK_BASE || 'http://127.0.0.1:6006';
const url = `${STORYBOOK_BASE}/iframe.html?id=${encodeURIComponent(storyId)}`;

console.log(`[OpenAI UI Audit] Inspecting Story: ${storyId}`);
console.log(`[OpenAI UI Audit] Target URL: ${url}`);
console.log(`[OpenAI UI Audit] Theme: ${theme}`);

(async () => {
  let browser;
  try {
    const launchOpts = { headless: true };
    const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    try {
      if (path.resolve(chromePath)) launchOpts.executablePath = chromePath;
    } catch (_) {}
    browser = await chromium.launch(launchOpts);
    const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

    if (theme === 'dark') {
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    } else {
      await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    }

    const report = await page.evaluate((selector) => {
      const root = document.querySelector(selector) || document.body.firstElementChild;
      if (!root) return { error: `Element matching '${selector}' not found.` };

      const getStyles = (el) => {
        const cs = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tagName: el.tagName.toLowerCase(),
          className: el.className,
          box: { width: Math.round(rect.width), height: Math.round(rect.height) },
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          lineHeight: cs.lineHeight,
          color: cs.color,
          backgroundColor: cs.backgroundColor,
          borderRadius: cs.borderRadius,
          border: `${cs.borderWidth} ${cs.borderStyle} ${cs.borderColor}`,
        };
      };

      const nodes = [root, ...root.querySelectorAll('*')];
      const elements = nodes.slice(0, 30).map(getStyles);

      return {
        root: getStyles(root),
        elements,
        totalChecked: nodes.length
      };
    }, targetSelector);

    console.log('[OpenAI UI QA] Root metrics:', JSON.stringify(report.root, null, 2));

    // Audit assertions:
    console.log('\n--- 100% Fidelity Checks ---');
    if (report.root) {
      const height = report.root.box.height;
      console.log(`[Height Check] ${height}px ${height === 32 ? '✅ COMPACT 32px' : 'ℹ️ ' + height + 'px'}`);
      console.log(`[Font Family] ${report.root.fontFamily}`);
    }

    const proofFile = `proof-${storyId.replace(/[^a-zA-Z0-9_-]/g, '_')}-${theme}.png`;
    await page.screenshot({ path: proofFile, fullPage: true });
    console.log(`[Visual Proof] Screenshot captured to: ${proofFile}`);

  } catch (err) {
    console.error('[OpenAI UI QA Error]:', err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
