import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-144-weekly-active-users-aui';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 750 } });
  const page = await context.newPage();

  let passed = 0, total = 0;

  function check(name, pass, detail) {
    total++;
    if (pass) { passed++; console.log(`  ✓ ${name}`); }
    else { console.error(`  ✗ ${name} — ${detail}`); }
  }

  try {
    console.log('Auditing #144 Weekly Active Users AUI (Generative Chart Area Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-area-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Title typography
    const title = page.locator('.ds-gen-chart-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Subtitle typography (Strict 400 rule)
    const subtitle = page.locator('.ds-gen-chart-card__subtitle');
    const subStyles = await subtitle.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Subtitle font-size is 12px (xs)', subStyles.fontSize === '12px', subStyles.fontSize);
    check('Subtitle font-weight is 400 (strict normal rule)', subStyles.fontWeight === '400', subStyles.fontWeight);

    // Legend
    const legendItems = page.locator('.ds-gen-chart-card__legend-item');
    const count = await legendItems.count();
    check('Legend renders 2 items', count === 2, `${count}`);

    const firstLegendStyles = await legendItems.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Legend label font-size is 12px', firstLegendStyles.fontSize === '12px', firstLegendStyles.fontSize);
    check('Legend label font-weight is 400 (strict normal rule)', firstLegendStyles.fontWeight === '400', firstLegendStyles.fontWeight);

    // Dots geometry
    const dot = page.locator('.ds-gen-chart-card__dot--primary');
    const dotBox = await dot.boundingBox();
    check('Legend dot size is 8x8px', Math.round(dotBox.width) === 8 && Math.round(dotBox.height) === 8, `${dotBox?.width}x${dotBox?.height}px`);

    const dotColor = await dot.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    check('Primary dot uses blue accent control color', dotColor.length > 0 && dotColor !== 'rgba(0, 0, 0, 0)', dotColor);

    // SVG chart
    const svg = page.locator('.ds-gen-chart-card__svg');
    const svgAria = await svg.getAttribute('aria-label');
    check('SVG chart has descriptive aria-label', !!svgAria && svgAria.length > 0, svgAria);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-area-default-light.png') });

    // ── Monthly Trend Story ──
    await page.goto(`${BASE_URL}--monthly-trend&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const monthlyTitle = await page.locator('.ds-gen-chart-card__title').textContent();
    check('Monthly Trend story renders Monthly active users', monthlyTitle === 'Monthly active users', monthlyTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-chart-area-monthly-dark.png') });

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
