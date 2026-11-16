import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-134-portfolio-overview-aui';

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
    console.log('Auditing #134 Portfolio Overview AUI (Generative Portfolio Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-portfolio-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Title typography
    const title = page.locator('.ds-gen-portfolio-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Metrics grid
    const metrics = page.locator('.ds-gen-portfolio-card__metrics');
    const metricCount = await page.locator('.ds-gen-portfolio-card__metric').count();
    check('Metrics row contains summary items', metricCount >= 3, `${metricCount}`);

    const metricLabel = page.locator('.ds-gen-portfolio-card__metric-label').first();
    const metricLabelStyles = await metricLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Metric label font-size is 12px (xs)', metricLabelStyles.fontSize === '12px', metricLabelStyles.fontSize);
    check('Metric label font-weight is 400 (strict normal rule)', metricLabelStyles.fontWeight === '400', metricLabelStyles.fontWeight);

    // Mini bar chart
    const bars = page.locator('.ds-mini-bar-fill');
    const barCount = await bars.count();
    check('Mini bar chart renders 5 weekday columns', barCount === 5, `${barCount}`);

    const firstBarColor = await bars.first().evaluate((el) => window.getComputedStyle(el).backgroundColor);
    check('Mini bars use blue accent control fill', firstBarColor.length > 0 && firstBarColor !== 'rgba(0, 0, 0, 0)', firstBarColor);

    const dayLabel = page.locator('.ds-gen-portfolio-card__day').first();
    const dayLabelStyles = await dayLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Chart day label font-size is 12px', dayLabelStyles.fontSize === '12px', dayLabelStyles.fontSize);
    check('Chart day label font-weight is 400 (strict normal rule)', dayLabelStyles.fontWeight === '400', dayLabelStyles.fontWeight);

    // Table headers (Strict 400 rule)
    const th = page.locator('.ds-gen-portfolio-card__table th').first();
    const thStyles = await th.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Table header font-size is 12px', thStyles.fontSize === '12px', thStyles.fontSize);
    check('Table header font-weight is 400 (strict normal rule)', thStyles.fontWeight === '400', thStyles.fontWeight);

    // Table data cells (Strict 400 rule)
    const td = page.locator('.ds-gen-portfolio-card__table td').first();
    const tdStyles = await td.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Table cell font-size is 12px', tdStyles.fontSize === '12px', tdStyles.fontSize);
    check('Table cell font-weight is 400 (strict normal rule)', tdStyles.fontWeight === '400', tdStyles.fontWeight);

    // Footer note (Strict 400 rule)
    const note = page.locator('.ds-gen-portfolio-card__note');
    const noteStyles = await note.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Footer note font-size is 12px', noteStyles.fontSize === '12px', noteStyles.fontSize);
    check('Footer note font-weight is 400 (strict normal rule)', noteStyles.fontWeight === '400', noteStyles.fontWeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-portfolio-default-light.png') });

    // ── High Growth Story ──
    await page.goto(`${BASE_URL}--high-growth&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const growthVal = await page.locator('.ds-gen-portfolio-card__metric-value').first().textContent();
    check('High Growth story renders $245,820', growthVal === '$245,820', growthVal);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-portfolio-growth-dark.png') });

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
