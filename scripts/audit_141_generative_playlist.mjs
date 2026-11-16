import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-141-playlist-aui';

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
    console.log('Auditing #141 Playlist AUI (Generative Playlist Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-playlist-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Cover geometry
    const cover = page.locator('.ds-gen-playlist-card__cover');
    const coverBox = await cover.boundingBox();
    check('Playlist cover height is 140px', Math.round(coverBox.height) === 140, `${coverBox?.height}px`);

    const coverRadius = await cover.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Playlist cover border radius is 10px', coverRadius === '10px', coverRadius);

    // Cover graphic accessibility
    const svgAria = await page.locator('.ds-gen-playlist-card__cover svg').getAttribute('aria-label');
    check('Cover graphic has descriptive aria-label', !!svgAria && svgAria.length > 0, svgAria);

    // Title typography
    const title = page.locator('.ds-gen-playlist-card__title');
    const titleStyles = await title.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Title has font-weight 500 (card primary heading)', titleStyles.fontWeight === '500', titleStyles.fontWeight);

    // Track rows
    const tracks = page.locator('.ds-gen-playlist-card__track-row');
    const trackCount = await tracks.count();
    check('Playlist renders 3 track rows', trackCount === 3, `${trackCount}`);

    // Track number typography (Strict 400 rule)
    const trackNum = page.locator('.ds-gen-playlist-card__track-num').first();
    const numStyles = await trackNum.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Track number font-size is 12px (xs)', numStyles.fontSize === '12px', numStyles.fontSize);
    check('Track number font-weight is 400 (strict normal rule)', numStyles.fontWeight === '400', numStyles.fontWeight);

    // Track artist typography (Strict 400 rule)
    const trackArtist = page.locator('.ds-gen-playlist-card__track-artist').first();
    const artistStyles = await trackArtist.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Track artist font-size is 12px (xs)', artistStyles.fontSize === '12px', artistStyles.fontSize);
    check('Track artist font-weight is 400 (strict normal rule)', artistStyles.fontWeight === '400', artistStyles.fontWeight);

    // Play button
    const playBtn = page.locator('.ds-gen-playlist-card__play-btn').first();
    const btnBox = await playBtn.boundingBox();
    check('Play button size is 24x24px', Math.round(btnBox.width) === 24 && Math.round(btnBox.height) === 24, `${btnBox?.width}x${btnBox?.height}px`);

    const btnAria = await playBtn.getAttribute('aria-label');
    check('Play button has accessible aria-label', !!btnAria && btnAria.startsWith('Play'), btnAria);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-playlist-default-light.png') });

    // ── Ambient LoFi Story ──
    await page.goto(`${BASE_URL}--ambient-lo-fi&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const lofiTitle = await page.locator('.ds-gen-playlist-card__title').textContent();
    check('Ambient Chill story renders correct title', lofiTitle === 'Ambient Chill', lofiTitle);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-playlist-ambient-dark.png') });

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
