import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-131-table-reservation-aui';

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
    console.log('Auditing #131 Table Reservation AUI (Generative Booking Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-booking-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Title typography
    const title = page.locator('.ds-gen-booking-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Subtitle typography (Strict 400 rule)
    const subtitle = page.locator('.ds-gen-booking-card__subtitle');
    const subStyles = await subtitle.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Subtitle font-size is 12px (xs)', subStyles.fontSize === '12px', subStyles.fontSize);
    check('Subtitle font-weight is 400 (strict normal rule)', subStyles.fontWeight === '400', subStyles.fontWeight);

    // Field labels (Strict 400 rule)
    const label = page.locator('.ds-gen-booking-card__label').first();
    const labelStyles = await label.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Field label font-size is 12px', labelStyles.fontSize === '12px', labelStyles.fontSize);
    check('Field label font-weight is 400 (strict normal rule)', labelStyles.fontWeight === '400', labelStyles.fontWeight);

    // Input geometry
    const textInput = page.locator('#booking-name');
    const inputHeight = await textInput.evaluate((el) => window.getComputedStyle(el).height);
    check('Input field height is 32px (compact control height)', Math.round(parseFloat(inputHeight)) === 32, inputHeight);

    const inputRadius = await textInput.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Input field border radius is 8px', inputRadius === '8px', inputRadius);

    // Select input geometry
    const select = page.locator('#booking-party');
    const selectHeight = await select.evaluate((el) => window.getComputedStyle(el).height);
    check('Select field height is 32px (compact control height)', Math.round(parseFloat(selectHeight)) === 32, selectHeight);

    // Radio option labels (Strict 400 rule)
    const radioLabel = page.locator('.ds-gen-booking-card__radio-label').first();
    const radioStyles = await radioLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Radio label font-size is 12px', radioStyles.fontSize === '12px', radioStyles.fontSize);
    check('Radio label font-weight is 400 (strict normal rule)', radioStyles.fontWeight === '400', radioStyles.fontWeight);

    // Action buttons
    const cancelBtn = page.locator('.ds-gen-booking-card__actions .ds-button--ghost');
    const cancelHeight = await cancelBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Cancel button has compact 32px height', Math.round(parseFloat(cancelHeight)) === 32, cancelHeight);

    const submitBtn = page.locator('.ds-gen-booking-card__actions .ds-button--primary');
    const submitHeight = await submitBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Submit button has compact 32px height', Math.round(parseFloat(submitHeight)) === 32, submitHeight);

    // Interactive input test
    await textInput.fill('Sofia Coppola');
    const newVal = await textInput.inputValue();
    check('Input accepts typed text correctly', newVal === 'Sofia Coppola', newVal);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-booking-default-light.png') });

    // ── Large Party Story ──
    await page.goto(`${BASE_URL}--large-party&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const partyVal = await page.locator('#booking-party').inputValue();
    check('Large Party story selects 4 guests option', partyVal === '4', partyVal);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-booking-large-party-dark.png') });

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
