import { chromium } from 'playwright';
import fs from 'node:fs';

async function run() {
  console.log('Launching Chrome to inspect https://www.assistant-ui.com/elements/thinking-indicator ...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto('https://www.assistant-ui.com/elements/thinking-indicator', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take full page screenshot and component screenshot
  await page.screenshot({ path: '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/assistant-ui-thinking-page.png' });

  // Find all elements with data-slot="thinking-indicator"
  const indicators = await page.locator('[data-slot="thinking-indicator"]').all();
  console.log(`Found ${indicators.length} thinking-indicator elements on page.`);

  if (indicators.length > 0) {
    const first = indicators[0];
    await first.screenshot({ path: '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/assistant-ui-thinking-live-component.png' });

    // Inspect the exact DOM and computed styles
    const data = await first.evaluate((el) => {
      const getStyles = (node) => {
        const s = window.getComputedStyle(node);
        return {
          tag: node.tagName,
          className: node.className,
          display: s.display,
          alignItems: s.alignItems,
          gap: s.gap,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          color: s.color,
          backgroundColor: s.backgroundColor,
          animation: s.animation,
          transition: s.transition,
          transform: s.transform,
          width: s.width,
          height: s.height,
          padding: s.padding,
          margin: s.margin,
          overflow: s.overflow,
          textOverflow: s.textOverflow,
          whiteSpace: s.whiteSpace,
          background: s.background,
          WebkitBackgroundClip: s.webkitBackgroundClip,
          WebkitTextFillColor: s.webkitTextFillColor,
          opacity: s.opacity,
        };
      };

      const children = Array.from(el.children).map((c) => ({
        html: c.outerHTML,
        styles: getStyles(c),
        pseudoBefore: window.getComputedStyle(c, '::before').content,
        pseudoBeforeBg: window.getComputedStyle(c, '::before').background,
        pseudoBeforeAnim: window.getComputedStyle(c, '::before').animation,
      }));

      return {
        outerHTML: el.outerHTML,
        rootStyles: getStyles(el),
        children,
      };
    });

    fs.writeFileSync(
      '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/thinking-indicator-live-data.json',
      JSON.stringify(data, null, 2)
    );
    console.log('Saved thinking-indicator-live-data.json');
  }

  // Also navigate to streaming-text
  console.log('Navigating to https://www.assistant-ui.com/elements/streaming-text ...');
  await page.goto('https://www.assistant-ui.com/elements/streaming-text', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const streamElements = await page.locator('[data-slot="streaming-text"]').all();
  console.log(`Found ${streamElements.length} streaming-text elements on page.`);

  if (streamElements.length > 0) {
    const firstStream = streamElements[0];
    await firstStream.screenshot({ path: '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/assistant-ui-streaming-live-component.png' });

    const streamData = await firstStream.evaluate((el) => {
      const getStyles = (node) => {
        const s = window.getComputedStyle(node);
        return {
          tag: node.tagName,
          className: node.className,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          color: s.color,
          animation: s.animation,
          transition: s.transition,
        };
      };

      const tokens = Array.from(el.querySelectorAll('span')).map((c) => ({
        html: c.outerHTML,
        text: c.textContent,
        styles: getStyles(c),
      }));

      return {
        outerHTML: el.outerHTML,
        rootStyles: getStyles(el),
        tokens,
      };
    });

    fs.writeFileSync(
      '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/streaming-text-live-data.json',
      JSON.stringify(streamData, null, 2)
    );
    console.log('Saved streaming-text-live-data.json');
  }

  await browser.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
