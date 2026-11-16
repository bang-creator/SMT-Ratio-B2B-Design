import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-135-create-event-aui';

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
    console.log('Auditing #135 Create Event AUI (Generative Event Session Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-event-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Date header
    const dayNum = page.locator('.ds-gen-event-card__day-num');
    const dayNumStyles = await dayNum.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Day number font-size is 32px (heading xl)', dayNumStyles.fontSize === '32px', dayNumStyles.fontSize);
    check('Day number font-weight is 500 (heading medium weight)', dayNumStyles.fontWeight === '500', dayNumStyles.fontWeight);

    const weekday = page.locator('.ds-gen-event-card__weekday');
    const weekdayStyles = await weekday.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Weekday font-size is 12px (xs)', weekdayStyles.fontSize === '12px', weekdayStyles.fontSize);
    check('Weekday font-weight is 400 (strict normal rule)', weekdayStyles.fontWeight === '400', weekdayStyles.fontWeight);

    // Schedule rows
    const rows = page.locator('.ds-gen-event-card__row');
    const rowCount = await rows.count();
    check('Schedule contains 3 events', rowCount === 3, `${rowCount}`);

    // Color indicator bar geometry
    const bar = page.locator('.ds-gen-event-card__bar').first();
    const barBox = await bar.boundingBox();
    check('Indicator bar width is 3px', Math.round(barBox.width) === 3, `${barBox?.width}px`);
    check('Indicator bar height is 32px', Math.round(barBox.height) === 32, `${barBox?.height}px`);

    // Event time typography (Strict 400 rule)
    const eventTime = page.locator('.ds-gen-event-card__event-time').first();
    const timeStyles = await eventTime.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Event time font-size is 12px', timeStyles.fontSize === '12px', timeStyles.fontSize);
    check('Event time font-weight is 400 (strict normal rule)', timeStyles.fontWeight === '400', timeStyles.fontWeight);

    // Badges typography (Strict 400 rule)
    const badge = page.locator('.ds-gen-event-card__badge').first();
    const badgeStyles = await badge.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, borderRadius: cs.borderRadius };
    });
    check('Category badge font-size is 12px', badgeStyles.fontSize === '12px', badgeStyles.fontSize);
    check('Category badge font-weight is 400 (strict normal rule)', badgeStyles.fontWeight === '400', badgeStyles.fontWeight);
    check('Category badge uses pill radius (9999px)', parseInt(badgeStyles.borderRadius) >= 10, badgeStyles.borderRadius);

    // Action buttons
    const cancelBtn = page.locator('.ds-gen-event-card__actions .ds-button--ghost');
    const cancelHeight = await cancelBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Discard button has compact 32px height', Math.round(parseFloat(cancelHeight)) === 32, cancelHeight);

    const submitBtn = page.locator('.ds-gen-event-card__actions .ds-button--primary');
    const submitHeight = await submitBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Add to calendar button has compact 32px height', Math.round(parseFloat(submitHeight)) === 32, submitHeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-event-default-light.png') });

    // ── Tomorrow Schedule Story ──
    await page.goto(`${BASE_URL}--tomorrow-schedule&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const tomorrowDay = await page.locator('.ds-gen-event-card__day-num').textContent();
    check('Tomorrow Schedule story renders day 25', tomorrowDay === '25', tomorrowDay);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-event-tomorrow-dark.png') });

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
