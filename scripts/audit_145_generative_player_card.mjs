import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-145-player-card-aui';

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
    console.log('Auditing #145 Player Card AUI (Generative Player Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-player-card-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Player name typography
    const name = page.locator('.ds-gen-player-card__name');
    const nameStyles = await name.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Player name font-size is 14px (base)', nameStyles.fontSize === '14px', nameStyles.fontSize);
    check('Player name font-weight is 500 (heading medium weight)', nameStyles.fontWeight === '500', nameStyles.fontWeight);

    // Position / Number typography (Strict 400 rule)
    const meta = page.locator('.ds-gen-player-card__meta');
    const metaStyles = await meta.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Position & number font-size is 12px (xs)', metaStyles.fontSize === '12px', metaStyles.fontSize);
    check('Position & number font-weight is 400 (strict normal rule)', metaStyles.fontWeight === '400', metaStyles.fontWeight);

    // Avatar geometry
    const avatar = page.locator('.ds-gen-player-card__avatar');
    const avatarBox = await avatar.boundingBox();
    check('Avatar size is 36x36px', Math.round(avatarBox.width) === 36 && Math.round(avatarBox.height) === 36, `${avatarBox?.width}x${avatarBox?.height}px`);

    const avatarRadius = await avatar.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Avatar uses circular pill radius', parseInt(avatarRadius) >= 18, avatarRadius);

    // Stats columns
    const cols = page.locator('.ds-gen-player-card__stat-col');
    const colCount = await cols.count();
    check('Card renders 4 stat columns (PPG, AST, REB, EFF)', colCount === 4, `${colCount}`);

    const statVal = page.locator('.ds-gen-player-card__stat-val').first();
    const valStyles = await statVal.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Stat value font-size is 14px', valStyles.fontSize === '14px', valStyles.fontSize);
    check('Stat value font-weight is 500 (medium weight)', valStyles.fontWeight === '500', valStyles.fontWeight);

    const statLbl = page.locator('.ds-gen-player-card__stat-lbl').first();
    const lblStyles = await statLbl.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Stat label font-size is 12px (xs)', lblStyles.fontSize === '12px', lblStyles.fontSize);
    check('Stat label font-weight is 400 (strict normal rule)', lblStyles.fontWeight === '400', lblStyles.fontWeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-player-card-default-light.png') });

    // ── Center Player Story ──
    await page.goto(`${BASE_URL}--center-player&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const centerName = await page.locator('.ds-gen-player-card__name').textContent();
    check('Center Player story renders Nikola Davis', centerName === 'Nikola Davis', centerName);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-player-card-center-dark.png') });

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
