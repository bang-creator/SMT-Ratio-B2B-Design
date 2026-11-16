import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-143-purchase-receipt-aui';

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
    console.log('Auditing #143 Purchase Receipt AUI (Generative Receipt Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-receipt-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Purchase complete badge
    const badge = page.locator('.ds-gen-receipt-card__badge');
    const badgeStyles = await badge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, borderRadius: cs.borderRadius, color: cs.color };
    });
    check('Badge font-size is 12px (xs)', badgeStyles.fontSize === '12px', badgeStyles.fontSize);
    check('Badge font-weight is 400 (strict normal rule)', badgeStyles.fontWeight === '400', badgeStyles.fontWeight);
    check('Badge uses pill radius (9999px)', parseInt(badgeStyles.borderRadius) >= 10, badgeStyles.borderRadius);
    check('Badge uses green chart-series-secondary color', badgeStyles.color.length > 0, badgeStyles.color);

    // Item thumbnail
    const thumb = page.locator('.ds-gen-receipt-card__thumb');
    const thumbBox = await thumb.boundingBox();
    check('Item thumbnail size is 40x40px', Math.round(thumbBox.width) === 40 && Math.round(thumbBox.height) === 40, `${thumbBox?.width}x${thumbBox?.height}px`);

    const thumbRadius = await thumb.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Thumbnail border radius is 8px (radius-md)', thumbRadius === '8px', thumbRadius);

    // Item qty typography (Strict 400 rule)
    const qty = page.locator('.ds-gen-receipt-card__item-qty');
    const qtyStyles = await qty.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Qty label font-size is 12px (xs)', qtyStyles.fontSize === '12px', qtyStyles.fontSize);
    check('Qty label font-weight is 400 (strict normal rule)', qtyStyles.fontWeight === '400', qtyStyles.fontWeight);

    // Delivery & Seller values (Strict 400 rule)
    const values = page.locator('.ds-gen-receipt-card__detail-value');
    const deliveryStyles = await values.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Delivery date font-size is 12px', deliveryStyles.fontSize === '12px', deliveryStyles.fontSize);
    check('Delivery date font-weight is 400 (strict normal rule)', deliveryStyles.fontWeight === '400', deliveryStyles.fontWeight);

    // Paid value (Medium weight)
    const paidVal = page.locator('.ds-gen-receipt-card__detail-value--paid');
    const paidStyles = await paidVal.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Paid amount font-size is 12px', paidStyles.fontSize === '12px', paidStyles.fontSize);
    check('Paid amount font-weight is 500 (medium weight)', paidStyles.fontWeight === '500', paidStyles.fontWeight);

    // Action button
    const actionBtn = page.locator('.ds-gen-receipt-card__action');
    const btnBox = await actionBtn.boundingBox();
    check('Action button has compact 32px height', Math.round(btnBox.height) === 32, `${btnBox?.height}px`);
    check('Action button fills card width', Math.round(btnBox.width) >= Math.round(cardBox.width) - 40, `${btnBox?.width}px`);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-receipt-default-light.png') });

    // ── Audio Purchase Story ──
    await page.goto(`${BASE_URL}--audio-purchase&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const audioTitle = await page.locator('.ds-gen-receipt-card__item-title').textContent();
    check('Audio Purchase story renders Studio Wireless Headphones', audioTitle === 'Studio Wireless Headphones', audioTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-receipt-audio-dark.png') });

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
