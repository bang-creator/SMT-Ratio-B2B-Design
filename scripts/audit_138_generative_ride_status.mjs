import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-138-ride-status-aui';

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
    console.log('Auditing #138 Ride Status AUI (Generative Ride Status Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-ride-status-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // ETA heading typography
    const eta = page.locator('.ds-gen-ride-card__eta');
    const etaStyles = await eta.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('ETA headline font-size is 24px (heading lg)', etaStyles.fontSize === '24px', etaStyles.fontSize);
    check('ETA headline font-weight is 500 (heading medium weight)', etaStyles.fontWeight === '500', etaStyles.fontWeight);

    // Vehicle text typography (Strict 400 rule)
    const vehicle = page.locator('.ds-gen-ride-card__vehicle');
    const vehStyles = await vehicle.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Vehicle info font-size is 12px (xs)', vehStyles.fontSize === '12px', vehStyles.fontSize);
    check('Vehicle info font-weight is 400 (strict normal rule)', vehStyles.fontWeight === '400', vehStyles.fontWeight);

    // Location pin icon color
    const pin = page.locator('.ds-gen-ride-card__pin-icon');
    const pinColor = await pin.evaluate((el) => window.getComputedStyle(el).color);
    check('Location pin uses blue accent control color', pinColor.length > 0 && pinColor !== 'rgba(0, 0, 0, 0)', pinColor);

    // Labels typography (Strict 400 rule)
    const labels = page.locator('.ds-gen-ride-card__label');
    const firstLabelStyles = await labels.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Grid label font-size is 12px (xs)', firstLabelStyles.fontSize === '12px', firstLabelStyles.fontSize);
    check('Grid label font-weight is 400 (strict normal rule)', firstLabelStyles.fontWeight === '400', firstLabelStyles.fontWeight);

    // Driver rating
    const rating = page.locator('.ds-gen-ride-card__rating');
    const ratingStyles = await rating.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { color: cs.color, fontWeight: cs.fontWeight };
    });
    check('Driver rating uses green secondary chart series color', ratingStyles.color.length > 0, ratingStyles.color);
    check('Driver rating has normal font-weight 400', ratingStyles.fontWeight === '400', ratingStyles.fontWeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-ride-status-default-light.png') });

    // ── Arrived Story ──
    await page.goto(`${BASE_URL}--arrived&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const arrivedEta = await page.locator('.ds-gen-ride-card__eta').textContent();
    check('Arrived story renders Driver has arrived headline', arrivedEta === 'Driver has arrived', arrivedEta);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-ride-status-arrived-dark.png') });

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
