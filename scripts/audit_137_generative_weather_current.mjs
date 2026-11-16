import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-137-current-weather-aui';

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
    console.log('Auditing #137 Current Weather AUI (Generative Current Weather Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-weather-current-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Location typography (Strict 400 rule)
    const location = page.locator('.ds-gen-weather-card__location');
    const locStyles = await location.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Location label font-size is 12px (xs)', locStyles.fontSize === '12px', locStyles.fontSize);
    check('Location label font-weight is 400 (strict normal rule)', locStyles.fontWeight === '400', locStyles.fontWeight);

    // Weather icon
    const icon = page.locator('.ds-gen-weather-card__icon svg');
    const iconAria = await icon.getAttribute('aria-label');
    check('Weather icon has descriptive aria-label', !!iconAria && iconAria.length > 0, iconAria);

    // Temperature typography
    const temp = page.locator('.ds-gen-weather-card__temp');
    const tempStyles = await temp.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Temperature font-size is 36px (heading 2xl)', tempStyles.fontSize === '36px', tempStyles.fontSize);
    check('Temperature font-weight is 500 (heading medium weight)', tempStyles.fontWeight === '500', tempStyles.fontWeight);

    // Condition typography (Strict 400 rule)
    const condition = page.locator('.ds-gen-weather-card__condition');
    const condStyles = await condition.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Condition font-size is 12px (xs)', condStyles.fontSize === '12px', condStyles.fontSize);
    check('Condition font-weight is 400 (strict normal rule)', condStyles.fontWeight === '400', condStyles.fontWeight);

    // Detail items
    const detailItems = page.locator('.ds-gen-weather-card__detail-item');
    const detailCount = await detailItems.count();
    check('Card renders weather metrics details (humidity, wind)', detailCount === 2, `${detailCount}`);

    const detailLabel = page.locator('.ds-gen-weather-card__detail-label').first();
    const detailLabelStyles = await detailLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Detail label font-size is 10px (2xs)', detailLabelStyles.fontSize === '10px', detailLabelStyles.fontSize);
    check('Detail label font-weight is 400 (strict normal rule)', detailLabelStyles.fontWeight === '400', detailLabelStyles.fontWeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-weather-current-default-light.png') });

    // ── Rainy Seattle Story ──
    await page.goto(`${BASE_URL}--rainy-seattle&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const seattleTemp = await page.locator('.ds-gen-weather-card__temp').textContent();
    check('Rainy Seattle story renders 58°F', seattleTemp === '58°F', seattleTemp);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-weather-current-seattle-dark.png') });

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
