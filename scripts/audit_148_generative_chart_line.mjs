import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #148 Response Time AUI (Generative Chart Line)...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 750 } });
  const page = await context.newPage();

  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message, detail = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passCount++;
    } else {
      console.error(`  ✗ ${message} — ${detail}`);
    }
  }

  // 1. Audit Default story
  await page.goto(`${STORYBOOK_URL}?id=default-application-148-response-time-aui--default&viewMode=story`);
  await page.waitForSelector('.ds-generative-card');

  const card = page.locator('.ds-generative-card');
  const cardBox = await card.boundingBox();
  assert(cardBox && cardBox.width <= 420 && cardBox.width >= 350, 'Card max-width is constrained (around 400px)', `${cardBox?.width}px`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '12px', 'Card container has 12px border radius', cardRadius);

  const title = page.locator('.ds-gen-chart-card__title');
  const titleStyle = await title.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(titleStyle.fontSize === '14px', 'Title font-size is 14px (sm)', titleStyle.fontSize);
  assert(titleStyle.fontWeight === '500', 'Title font-weight is 500 (heading medium weight)', titleStyle.fontWeight);

  const badge = page.locator('.ds-badge');
  const badgeStyle = await badge.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(badgeStyle.fontSize === '12px', 'Badge font-size is 12px (xs)', badgeStyle.fontSize);
  assert(badgeStyle.fontWeight === '400', 'Badge font-weight is 400 (strict normal rule)', badgeStyle.fontWeight);

  const svg = page.locator('svg.ds-gen-chart-card__svg');
  const ariaLabel = await svg.getAttribute('aria-label');
  assert(ariaLabel && ariaLabel.includes('line chart'), 'SVG has descriptive aria-label', ariaLabel);

  const gridLines = page.locator('svg.ds-gen-chart-card__svg line');
  const gridCount = await gridLines.count();
  assert(gridCount >= 3, 'SVG renders grid lines', `${gridCount}`);

  const points = page.locator('svg.ds-gen-chart-card__svg circle');
  const pointCount = await points.count();
  assert(pointCount === 6, 'SVG renders 6 data points', `${pointCount}`);

  const labels = page.locator('svg.ds-gen-chart-card__svg text');
  const labelCount = await labels.count();
  assert(labelCount === 6, 'SVG renders 6 time labels', `${labelCount}`);

  // Screenshots
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-line-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-line-default-light.png') });

  // 2. Audit P99Latency story
  await page.goto(`${STORYBOOK_URL}?id=default-application-148-response-time-aui--p-99-latency&viewMode=story`);
  await page.waitForSelector('.ds-generative-card');

  const p99Title = await page.locator('.ds-gen-chart-card__title').innerText();
  const p99Badge = await page.locator('.ds-badge').innerText();
  assert(p99Title === 'Response time (p99)', 'P99Latency story renders title', p99Title);
  assert(p99Badge === '420 ms', 'P99Latency story renders 420 ms badge', p99Badge);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-line-p99-dark.png') });

  console.log(`\nAudit finished: ${passCount}/${totalTests} passed`);
  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

audit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
