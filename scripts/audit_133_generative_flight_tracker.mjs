import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-133-flight-tracker-aui';

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
    console.log('Auditing #133 Flight Tracker AUI (Generative Flight Tracker Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-flight-tracker-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Airline text typography (Strict 400 rule)
    const airline = page.locator('.ds-gen-flight-card__airline');
    const airlineStyles = await airline.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Airline label font-size is 12px (xs)', airlineStyles.fontSize === '12px', airlineStyles.fontSize);
    check('Airline label font-weight is 400 (strict normal rule)', airlineStyles.fontWeight === '400', airlineStyles.fontWeight);

    // Status badge
    const badge = page.locator('.ds-gen-flight-card__badge');
    const badgeStyles = await badge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, borderRadius: cs.borderRadius };
    });
    check('Badge font-size is 12px', badgeStyles.fontSize === '12px', badgeStyles.fontSize);
    check('Badge font-weight is 400 (strict normal rule)', badgeStyles.fontWeight === '400', badgeStyles.fontWeight);
    check('Badge uses pill radius (9999px)', parseInt(badgeStyles.borderRadius) >= 10, badgeStyles.borderRadius);

    // City codes typography
    const cityCodes = page.locator('.ds-gen-flight-card__city-code');
    const cityCount = await cityCodes.count();
    check('Route has 2 city codes (origin & destination)', cityCount === 2, `${cityCount}`);

    const firstCityStyles = await cityCodes.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('City code font-size is 32px (var(--font-size-heading-xl))', firstCityStyles.fontSize === '32px', firstCityStyles.fontSize);
    check('City code font-weight is 500 (heading medium weight)', firstCityStyles.fontWeight === '500', firstCityStyles.fontWeight);

    // Track geometry
    const track = page.locator('.ds-gen-flight-card__track');
    const trackHeight = await track.evaluate((el) => window.getComputedStyle(el).height);
    check('Track height is 6px', Math.round(parseFloat(trackHeight)) === 6, trackHeight);

    // Progress bar geometry & color
    const progress = page.locator('.ds-gen-flight-card__progress');
    const progressColor = await progress.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    check('Progress bar uses blue accent control color', progressColor.length > 0 && progressColor !== 'rgba(0, 0, 0, 0)', progressColor);

    const trackBox = await track.boundingBox();
    const progressBox = await progress.boundingBox();
    const ratio = progressBox.width / trackBox.width;
    check('Default progress bar width is ~62%', Math.abs(ratio - 0.62) < 0.05, `${Math.round(ratio * 100)}%`);

    // Elapsed / Remaining times typography (Strict 400 rule)
    const times = page.locator('.ds-gen-flight-card__times span');
    const firstTimeStyles = await times.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Elapsed time font-size is 12px', firstTimeStyles.fontSize === '12px', firstTimeStyles.fontSize);
    check('Elapsed time font-weight is 400 (strict normal rule)', firstTimeStyles.fontWeight === '400', firstTimeStyles.fontWeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-flight-tracker-default-light.png') });

    // ── Approaching Destination Story ──
    await page.goto(`${BASE_URL}--approaching-destination&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const hndText = await page.locator('.ds-gen-flight-card__city-code').first().textContent();
    check('Approaching Destination story renders HND origin', hndText === 'HND', hndText);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-flight-tracker-approaching-dark.png') });

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
