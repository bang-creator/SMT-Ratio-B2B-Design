import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:6006/iframe.html';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

const STORIES = [
  { id: 'default-application-thinking-indicator--default', name: 'thinking-indicator-default' },
  { id: 'default-application-thinking-indicator--with-timer', name: 'thinking-indicator-with-timer' },
  { id: 'default-application-thinking-indicator--long-label', name: 'thinking-indicator-long-label' },
  { id: 'default-application-streaming-text--default', name: 'streaming-text-default' },
  { id: 'default-application-streaming-text--streaming', name: 'streaming-text-streaming' },
  { id: 'default-application-streaming-text--complete', name: 'streaming-text-complete' },
];

async function capture() {
  console.log('Launching browser to capture Storybook stories...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 900, height: 600 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  for (const item of STORIES) {
    for (const theme of ['dark', 'light']) {
      const url = `${BASE_URL}?id=${item.id}&globals=theme:${theme}`;
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      // Find story root or element
      const selector = '[data-slot="thinking-indicator"], [data-slot="streaming-text"], .ds-story-stage';
      const el = page.locator(selector).first();
      const outPath = `${ARTIFACT_DIR}/${item.name}-${theme}.png`;

      if (await el.count() > 0) {
        await el.screenshot({ path: outPath });
      } else {
        await page.screenshot({ path: outPath });
      }
      console.log(`Captured ${item.name} (${theme}) -> ${outPath}`);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
