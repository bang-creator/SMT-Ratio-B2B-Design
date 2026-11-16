import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #151 Support Tickets AUI (Generative Chart Bars)...');
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
  await page.goto(`${STORYBOOK_URL}?id=default-application-151-support-tickets-aui--default&viewMode=story`);
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

  const subtitle = page.locator('.ds-gen-chart-card__subtitle');
  const subtitleStyle = await subtitle.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(subtitleStyle.fontSize === '12px', 'Subtitle font-size is 12px (xs)', subtitleStyle.fontSize);
  assert(subtitleStyle.fontWeight === '400', 'Subtitle font-weight is 400 (strict normal rule)', subtitleStyle.fontWeight);

  const legendItems = page.locator('.ds-gen-chart-card__legend-item');
  const legendCount = await legendItems.count();
  assert(legendCount === 3, 'Legend renders 3 channel items (Email, Chat, Phone)', `${legendCount}`);

  const legendLabelStyle = await legendItems.first().locator('span').evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(legendLabelStyle.fontSize === '12px', 'Legend label font-size is 12px (xs)', legendLabelStyle.fontSize);
  assert(legendLabelStyle.fontWeight === '400', 'Legend label font-weight is 400 (strict normal rule)', legendLabelStyle.fontWeight);

  const svg = page.locator('svg.ds-gen-chart-card__svg');
  const ariaLabel = await svg.getAttribute('aria-label');
  assert(ariaLabel && ariaLabel.includes('stacked bar chart'), 'SVG has descriptive aria-label', ariaLabel);

  const rects = page.locator('svg.ds-gen-chart-card__svg rect');
  const rectCount = await rects.count();
  assert(rectCount === 12, 'SVG renders 12 stacked segment bars (4 columns x 3 tiers)', `${rectCount}`);

  const colLabels = page.locator('svg.ds-gen-chart-card__svg text');
  const colCount = await colLabels.count();
  assert(colCount === 4, 'SVG renders 4 column timestamp labels (W1-W4)', `${colCount}`);

  // Screenshots
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-bars-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-bars-default-light.png') });

  // 2. Audit QuarterlyTickets story
  await page.goto(`${STORYBOOK_URL}?id=default-application-151-support-tickets-aui--quarterly-tickets&viewMode=story`);
  await page.waitForSelector('.ds-generative-card');

  const qSub = await page.locator('.ds-gen-chart-card__subtitle').innerText();
  const qFirstCol = await page.locator('svg.ds-gen-chart-card__svg text').first().textContent();
  assert(qSub === 'Quarterly', 'QuarterlyTickets story renders "Quarterly" subtitle', qSub);
  assert(qFirstCol === 'Q1', 'QuarterlyTickets story renders Q1-Q4 column labels', qFirstCol);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-bars-quarterly-dark.png') });

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
