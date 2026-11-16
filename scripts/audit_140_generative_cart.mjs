import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-140-shopping-cart-aui';

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
    console.log('Auditing #140 Shopping Cart AUI (Generative Cart Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-cart-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Title typography
    const title = page.locator('.ds-gen-cart-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Cart items
    const items = page.locator('.ds-gen-cart-card__item');
    const itemCount = await items.count();
    check('Cart renders 3 items by default', itemCount === 3, `${itemCount}`);

    const itemName = page.locator('.ds-gen-cart-card__item-name').first();
    const itemNameStyles = await itemName.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Item name font-size is 12px (xs)', itemNameStyles.fontSize === '12px', itemNameStyles.fontSize);
    check('Item name font-weight is 400 (strict normal rule)', itemNameStyles.fontWeight === '400', itemNameStyles.fontWeight);

    const itemPrice = page.locator('.ds-gen-cart-card__item-price').first();
    const itemPriceStyles = await itemPrice.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Item price font-size is 12px (xs)', itemPriceStyles.fontSize === '12px', itemPriceStyles.fontSize);
    check('Item price font-weight is 400 (strict normal rule)', itemPriceStyles.fontWeight === '400', itemPriceStyles.fontWeight);

    // Totals typography
    const totalLabel = page.locator('.ds-gen-cart-card__total-label').first();
    const totalLabelStyles = await totalLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Total label font-size is 12px', totalLabelStyles.fontSize === '12px', totalLabelStyles.fontSize);
    check('Total label font-weight is 400 (strict normal rule)', totalLabelStyles.fontWeight === '400', totalLabelStyles.fontWeight);

    const totalFinal = page.locator('.ds-gen-cart-card__total-final');
    const totalFinalStyles = await totalFinal.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Final total font-size is 14px (sm)', totalFinalStyles.fontSize === '14px', totalFinalStyles.fontSize);
    check('Final total font-weight is 500 (medium weight)', totalFinalStyles.fontWeight === '500', totalFinalStyles.fontWeight);

    // Action buttons
    const saveBtn = page.locator('.ds-gen-cart-card__actions .ds-button--secondary');
    const saveHeight = await saveBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Save for later button has compact 32px height', Math.round(parseFloat(saveHeight)) === 32, saveHeight);

    const buyBtn = page.locator('.ds-gen-cart-card__actions .ds-button--primary');
    const buyHeight = await buyBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Purchase button has compact 32px height', Math.round(parseFloat(buyHeight)) === 32, buyHeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-cart-default-light.png') });

    // ── Single Item Story ──
    await page.goto(`${BASE_URL}--single-item&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const singleTotal = await page.locator('.ds-gen-cart-card__total-final').textContent();
    check('Single Item story renders $162.41', singleTotal === '$162.41', singleTotal);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-cart-single-dark.png') });

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
