import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-139-draft-email-aui';

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
    console.log('Auditing #139 Draft Email AUI (Generative Draft Email Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-draft-email-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Title typography
    const title = page.locator('.ds-gen-email-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Field labels typography (Strict 400 rule)
    const labels = page.locator('.ds-gen-email-card__label');
    const firstLabelStyles = await labels.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Field label font-size is 12px (xs)', firstLabelStyles.fontSize === '12px', firstLabelStyles.fontSize);
    check('Field label font-weight is 400 (strict normal rule)', firstLabelStyles.fontWeight === '400', firstLabelStyles.fontWeight);

    // Static sender text (Strict 400 rule)
    const staticFrom = page.locator('.ds-gen-email-card__static');
    const fromStyles = await staticFrom.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Sender text font-size is 12px', fromStyles.fontSize === '12px', fromStyles.fontSize);
    check('Sender text font-weight is 400 (strict normal rule)', fromStyles.fontWeight === '400', fromStyles.fontWeight);

    // Input geometry
    const input = page.locator('#email-subject');
    const inputHeight = await input.evaluate((el) => window.getComputedStyle(el).height);
    check('Input field height is 32px (compact control height)', Math.round(parseFloat(inputHeight)) === 32, inputHeight);

    const inputRadius = await input.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Input field border radius is 8px', inputRadius === '8px', inputRadius);

    // Textarea geometry
    const textarea = page.locator('#email-body');
    const textareaRadius = await textarea.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Textarea border radius is 8px', textareaRadius === '8px', textareaRadius);

    // Action buttons
    const cancelBtn = page.locator('.ds-gen-email-card__actions .ds-button--ghost');
    const cancelHeight = await cancelBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Discard button has compact 32px height', Math.round(parseFloat(cancelHeight)) === 32, cancelHeight);

    const submitBtn = page.locator('.ds-gen-email-card__actions .ds-button--primary');
    const submitHeight = await submitBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Send email button has compact 32px height', Math.round(parseFloat(submitHeight)) === 32, submitHeight);

    // Interactive input test
    await input.fill('Product sync follow-up');
    const newVal = await input.inputValue();
    check('Subject input accepts typed text correctly', newVal === 'Product sync follow-up', newVal);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-draft-email-default-light.png') });

    // ── Partnership Draft Story ──
    await page.goto(`${BASE_URL}--partnership-draft&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const toVal = await page.locator('#email-to').inputValue();
    check('Partnership Draft story renders recipient', toVal === 'alex@venture.capital', toVal);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-draft-email-partnership-dark.png') });

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
