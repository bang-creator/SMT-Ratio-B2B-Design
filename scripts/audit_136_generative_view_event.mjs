import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-136-view-event-aui';

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
    console.log('Auditing #136 View Event AUI (Generative View Event Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-view-event-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Date typography (Strict 400 rule)
    const dateLabel = page.locator('.ds-gen-view-event-card__date');
    const dateStyles = await dateLabel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Date label font-size is 12px (xs)', dateStyles.fontSize === '12px', dateStyles.fontSize);
    check('Date label font-weight is 400 (strict normal rule)', dateStyles.fontWeight === '400', dateStyles.fontWeight);

    // Title typography
    const title = page.locator('.ds-gen-view-event-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Details typography (Strict 400 rule)
    const details = page.locator('.ds-gen-view-event-card__details');
    const detailsStyles = await details.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Details font-size is 12px (xs)', detailsStyles.fontSize === '12px', detailsStyles.fontSize);
    check('Details font-weight is 400 (strict normal rule)', detailsStyles.fontWeight === '400', detailsStyles.fontWeight);

    // Attendees avatars
    const avatars = page.locator('.ds-gen-view-event-card__avatar');
    const avatarCount = await avatars.count();
    check('Attendees row renders avatars', avatarCount === 3, `${avatarCount}`);

    const firstAvatar = avatars.first();
    const avatarBox = await firstAvatar.boundingBox();
    check('Avatar size is 24x24px', Math.round(avatarBox.width) === 24 && Math.round(avatarBox.height) === 24, `${avatarBox?.width}x${avatarBox?.height}px`);

    const avatarRadius = await firstAvatar.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Avatar uses circular pill radius', parseInt(avatarRadius) >= 12, avatarRadius);

    // Action button
    const actionBtn = page.locator('.ds-gen-view-event-card__actions .ds-button');
    const actionBtnBox = await actionBtn.boundingBox();
    check('Action button has compact 32px height', Math.round(actionBtnBox.height) === 32, `${actionBtnBox?.height}px`);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-view-event-default-light.png') });

    // ── Lunch Meeting Story ──
    await page.goto(`${BASE_URL}--lunch-meeting&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const lunchTitle = await page.locator('.ds-gen-view-event-card__title').textContent();
    check('Lunch Meeting story renders Lunch with Sam', lunchTitle === 'Lunch with Sam', lunchTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-view-event-lunch-dark.png') });

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
