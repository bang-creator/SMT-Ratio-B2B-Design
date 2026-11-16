import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-142-channel-message-aui';

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
    console.log('Auditing #142 Channel Message AUI (Generative Channel Message Card)...');

    // ── Default Story (Dark) ──
    await page.goto(`${BASE_URL}--default&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-channel-message-default-dark.png') });

    const card = page.locator('.ds-generative-card').first();
    const cardBox = await card.boundingBox();
    check('Card max-width is constrained (around 400px)', Math.round(cardBox.width) <= 400, `${cardBox?.width}px`);

    const cardRadius = await card.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Card container has 12px border radius', cardRadius === '12px', cardRadius);

    // Channel name typography (Strict 400 rule)
    const channel = page.locator('.ds-gen-msg-card__channel');
    const channelStyles = await channel.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Channel name font-size is 12px (xs)', channelStyles.fontSize === '12px', channelStyles.fontSize);
    check('Channel name font-weight is 400 (strict normal rule)', channelStyles.fontWeight === '400', channelStyles.fontWeight);

    // Timestamp typography (Strict 400 rule)
    const time = page.locator('.ds-gen-msg-card__time');
    const timeStyles = await time.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Timestamp font-size is 12px (xs)', timeStyles.fontSize === '12px', timeStyles.fontSize);
    check('Timestamp font-weight is 400 (strict normal rule)', timeStyles.fontWeight === '400', timeStyles.fontWeight);

    // Author avatar geometry
    const avatar = page.locator('.ds-gen-msg-card__avatar');
    const avatarBox = await avatar.boundingBox();
    check('Avatar size is 24x24px', Math.round(avatarBox.width) === 24 && Math.round(avatarBox.height) === 24, `${avatarBox?.width}x${avatarBox?.height}px`);

    const avatarRadius = await avatar.evaluate((el) => window.getComputedStyle(el).borderRadius);
    check('Avatar uses circular pill radius', parseInt(avatarRadius) >= 12, avatarRadius);

    // Author name typography
    const authorName = page.locator('.ds-gen-msg-card__author-name');
    const authorStyles = await authorName.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('Author name font-size is 12px', authorStyles.fontSize === '12px', authorStyles.fontSize);
    check('Author name font-weight is 500', authorStyles.fontWeight === '500', authorStyles.fontWeight);

    // List items typography (Strict 400 rule)
    const listItems = page.locator('.ds-gen-msg-card__list-item');
    const count = await listItems.count();
    check('Message renders 3 list items', count === 3, `${count}`);

    const itemStyles = await listItems.first().evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight };
    });
    check('List item font-size is 12px (xs)', itemStyles.fontSize === '12px', itemStyles.fontSize);
    check('List item font-weight is 400 (strict normal rule)', itemStyles.fontWeight === '400', itemStyles.fontWeight);

    // Reaction pill
    const reaction = page.locator('.ds-gen-msg-card__reaction');
    const reactionStyles = await reaction.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { fontSize: cs.fontSize, fontWeight: cs.fontWeight, borderRadius: cs.borderRadius };
    });
    check('Reaction badge font-size is 12px', reactionStyles.fontSize === '12px', reactionStyles.fontSize);
    check('Reaction badge font-weight is 400 (strict normal rule)', reactionStyles.fontWeight === '400', reactionStyles.fontWeight);
    check('Reaction badge uses pill radius (9999px)', parseInt(reactionStyles.borderRadius) >= 10, reactionStyles.borderRadius);

    // Reply button
    const replyBtn = page.locator('.ds-gen-msg-card__footer .ds-button--ghost');
    const replyHeight = await replyBtn.evaluate((el) => window.getComputedStyle(el).height);
    check('Reply button has compact 32px height', Math.round(parseFloat(replyHeight)) === 32, replyHeight);

    // ── Light Theme ──
    await page.goto(`${BASE_URL}--default&globals=theme:light`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-channel-message-default-light.png') });

    // ── Engineering Announcement Story ──
    await page.goto(`${BASE_URL}--engineering-announcement&globals=theme:dark`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.ds-generative-card');
    const engChannel = await page.locator('.ds-gen-msg-card__channel').textContent();
    check('Engineering Announcement renders #engineering channel', engChannel === '#engineering', engChannel);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-channel-message-engineering-dark.png') });

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
