import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function run() {
  console.log('Launching Chrome with colorScheme: dark...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // 1. Inspect Thinking Indicator in Dark Mode
  console.log('Navigating to thinking-indicator in dark mode...');
  await page.goto('https://www.assistant-ui.com/elements/thinking-indicator', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Ensure dark class is present on html
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);

  // Capture full page and component in dark mode
  await page.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-thinking-dark-page.png` });

  const thinkingEls = await page.locator('[data-slot="thinking-indicator"]').all();
  console.log(`Found ${thinkingEls.length} thinking indicators`);

  if (thinkingEls.length > 0) {
    const el = thinkingEls[0];
    await el.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-thinking-dark-live.png` });

    const thinkingData = await el.evaluate((node) => {
      const getStyles = (elem) => {
        const s = window.getComputedStyle(elem);
        const before = window.getComputedStyle(elem, '::before');
        const after = window.getComputedStyle(elem, '::after');
        return {
          tag: elem.tagName,
          className: elem.className,
          display: s.display,
          alignItems: s.alignItems,
          gap: s.gap,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          color: s.color,
          backgroundColor: s.backgroundColor,
          animation: s.animation,
          transition: s.transition,
          transform: s.transform,
          before: {
            content: before.content,
            background: before.background,
            animation: before.animation,
            transform: before.transform,
          },
          after: {
            content: after.content,
            background: after.background,
            animation: after.animation,
          }
        };
      };

      return {
        root: getStyles(node),
        children: Array.from(node.children).map(c => getStyles(c)),
        innerHTML: node.innerHTML,
        outerHTML: node.outerHTML,
      };
    });

    fs.writeFileSync(`${ARTIFACT_DIR}/assistant-ui-thinking-dark-data.json`, JSON.stringify(thinkingData, null, 2));
  }

  // 2. Inspect Streaming Text in Dark Mode
  console.log('Navigating to streaming-text in dark mode...');
  await page.goto('https://www.assistant-ui.com/elements/streaming-text', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-streaming-dark-page.png` });

  // Locate the demo area or interactive streaming text
  const streamingTexts = await page.locator('[data-slot="streaming-text"], p.text-pretty, .text-pretty').all();
  console.log(`Found ${streamingTexts.length} streaming text elements`);

  // Let's find any button to trigger replay or play
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on page`);

  // Capture the interactive demo card
  const demoCard = page.locator('div.border.rounded-lg, [data-slot="streaming-text"]').first();
  if (await demoCard.count() > 0) {
    await demoCard.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-streaming-dark-card.png` });
  }

  // Let's click the replay button if present to capture mid-stream in dark mode
  for (const btn of buttons) {
    const text = await btn.innerText();
    console.log('Button text:', text);
    if (text.toLowerCase().includes('replay') || text.toLowerCase().includes('play') || text.toLowerCase().includes('start')) {
      console.log('Clicking replay/play button:', text);
      await btn.click();
      await page.waitForTimeout(400); // mid-stream
      await page.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-streaming-dark-midstream.png` });
      break;
    }
  }

  // Extract all details of streaming-text element
  const streamingEl = page.locator('[data-slot="streaming-text"]').first();
  if (await streamingEl.count() > 0) {
    await streamingEl.screenshot({ path: `${ARTIFACT_DIR}/assistant-ui-streaming-dark-live.png` });

    const streamingData = await streamingEl.evaluate((node) => {
      const getStyles = (elem) => {
        const s = window.getComputedStyle(elem);
        return {
          tag: elem.tagName,
          className: elem.className,
          display: s.display,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          color: s.color,
          backgroundColor: s.backgroundColor,
          animation: s.animation,
          transition: s.transition,
        };
      };

      return {
        root: getStyles(node),
        tokens: Array.from(node.querySelectorAll('span')).map(s => ({
          text: s.innerText,
          className: s.className,
          styles: getStyles(s),
        })),
        outerHTML: node.outerHTML,
      };
    });

    fs.writeFileSync(`${ARTIFACT_DIR}/assistant-ui-streaming-dark-data.json`, JSON.stringify(streamingData, null, 2));
  }

  await browser.close();
  console.log('Dark mode inspection completed.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
