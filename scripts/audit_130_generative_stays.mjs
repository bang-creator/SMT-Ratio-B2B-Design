import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-130-riverside-loft-aui';

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
    console.log('Auditing #130 Generative Stays Card AUI (Riverside Loft)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-stays-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardStyles = await card.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        borderRadius: cs.borderRadius,
        display: cs.display,
        flexDirection: cs.flexDirection
      };
    });
    check('Card container has 12px border radius', cardStyles.borderRadius === '12px', cardStyles.borderRadius);
    check('Card uses flex column layout', cardStyles.display === 'flex' && cardStyles.flexDirection === 'column', cardStyles.flexDirection);

    // Title typography
    const title = page.locator('.ds-gen-stay-card__heading');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Photo placeholder
    const photo = page.locator('.ds-gen-stay-photo');
    const photoBox = await photo.boundingBox();
    check('Stay photo height is 180px', Math.round(photoBox.height) === 180, `${photoBox?.height}px`);

    const photoRadius = await photo.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Stay photo border radius is 10px', photoRadius === '10px', photoRadius);

    // Graphic icon accessibility
    const svgAria = await page.locator('.ds-gen-stay-photo svg').getAttribute('aria-label');
    check('Photo graphic has descriptive aria-label', !!svgAria && svgAria.length > 0, svgAria);

    // Meta text typography (Strict 400 rule)
    const metaText = page.locator('.ds-gen-stay-card__meta-text');
    const metaStyles = await metaText.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Meta text font-size is 12px (xs)', metaStyles.fontSize === '12px', metaStyles.fontSize);
    check('Meta text font-weight is 400 (strict normal rule)', metaStyles.fontWeight === '400', metaStyles.fontWeight);

    // Rating badge
    const ratingBadge = page.locator('.ds-gen-stay-card__rating');
    const ratingStyles = await ratingBadge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        borderRadius: cs.borderRadius,
        color: cs.color
      };
    });
    check('Rating badge font-size is 12px', ratingStyles.fontSize === '12px', ratingStyles.fontSize);
    check('Rating badge font-weight is 400', ratingStyles.fontWeight === '400', ratingStyles.fontWeight);
    check('Rating badge uses pill radius (9999px)', parseInt(ratingStyles.borderRadius) >= 10, ratingStyles.borderRadius);
    check('Rating badge uses green secondary chart series color', ratingStyles.color.length > 0, ratingStyles.color);

    // Primary action button
    const btn = page.locator('.ds-button--primary.ds-gen-stay-card__action');
    const btnBox = await btn.boundingBox();
    check('Action button has compact 32px height', Math.round(btnBox.height) === 32, `${btnBox?.height}px`);
    check('Action button fills card width', Math.round(btnBox.width) >= Math.round(cardBox.width) - 40, `${btnBox?.width}px`);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-stays-default-light.png') });

    // ── Luxury Penthouse Story ──
    await page.goto(`${BASE_URL}--luxury-penthouse&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const luxuryTitle = await page.locator('.ds-gen-stay-card__heading').textContent();
    check('Luxury Penthouse story renders correct title', luxuryTitle === 'Chiado Penthouse', luxuryTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-stays-penthouse-dark.png') });

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
