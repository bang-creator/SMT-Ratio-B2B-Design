import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-132-order-tracking-aui';

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
    console.log('Auditing #132 Order Tracking AUI (Generative Order Status Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-order-status-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Header title typography
    const title = page.locator('.ds-gen-order-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Header badge
    const headerBadge = page.locator('.ds-gen-order-card__header .ds-gen-order-card__badge');
    const headerBadgeStyles = await headerBadge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        borderRadius: cs.borderRadius,
        color: cs.color
      };
    });
    check('Header badge font-size is 12px (xs)', headerBadgeStyles.fontSize === '12px', headerBadgeStyles.fontSize);
    check('Header badge font-weight is 400 (strict normal rule)', headerBadgeStyles.fontWeight === '400', headerBadgeStyles.fontWeight);
    check('Header badge uses pill radius (9999px)', parseInt(headerBadgeStyles.borderRadius) >= 10, headerBadgeStyles.borderRadius);

    // Banner
    const banner = page.locator('.ds-gen-order-card__banner');
    const bannerRadius = await banner.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Banner has 8px border radius', bannerRadius === '8px', bannerRadius);

    const bannerDesc = page.locator('.ds-gen-order-card__banner-desc');
    const bannerDescStyles = await bannerDesc.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Banner description font-size is 12px', bannerDescStyles.fontSize === '12px', bannerDescStyles.fontSize);
    check('Banner description font-weight is 400 (strict normal rule)', bannerDescStyles.fontWeight === '400', bannerDescStyles.fontWeight);

    // Timeline steps
    const steps = page.locator('.ds-gen-order-card__step');
    const stepCount = await steps.count();
    check('Timeline contains 3 tracking steps', stepCount === 3, `${stepCount}`);

    const firstStepName = page.locator('.ds-gen-order-card__step-name').first();
    const firstStepStyles = await firstStepName.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Step name font-size is 12px', firstStepStyles.fontSize === '12px', firstStepStyles.fontSize);
    check('Step name font-weight is 400 (strict normal rule)', firstStepStyles.fontWeight === '400', firstStepStyles.fontWeight);

    const firstStepTime = page.locator('.ds-gen-order-card__step-time').first();
    const firstStepTimeStyles = await firstStepTime.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Step timestamp font-size is 12px', firstStepTimeStyles.fontSize === '12px', firstStepTimeStyles.fontSize);
    check('Step timestamp font-weight is 400 (strict normal rule)', firstStepTimeStyles.fontWeight === '400', firstStepTimeStyles.fontWeight);

    // Step badges
    const doneBadge = page.locator('.ds-gen-order-card__badge--success').nth(1);
    const activeBadge = page.locator('.ds-gen-order-card__badge--active').first();
    const pendingBadge = page.locator('.ds-gen-order-card__badge--pending').first();
    check('Timeline has Done, In transit, and Pending badges', (await doneBadge.count()) > 0 && (await activeBadge.count()) > 0 && (await pendingBadge.count()) > 0, 'verified');

    // Footer button
    const trackBtn = page.locator('.ds-gen-order-card__footer .ds-button');
    const trackBtnBox = await trackBtn.boundingBox();
    check('Track package button has compact 32px height', Math.round(trackBtnBox.height) === 32, `${trackBtnBox?.height}px`);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-order-status-default-light.png') });

    // ── Delivered Story ──
    await page.goto(`${BASE_URL}--delivered&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const deliveredTitle = await page.locator('.ds-gen-order-card__title').textContent();
    check('Delivered story renders Order No. 48190', deliveredTitle === 'Order No. 48190', deliveredTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-order-status-delivered-dark.png') });

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
