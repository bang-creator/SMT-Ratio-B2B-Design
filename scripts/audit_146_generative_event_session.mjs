import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #146 Conference Session AUI (Generative Event Session)...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const context = await browser.newContext({ viewport: { width: 1000, height: 750 } });
  const page = await context.newPage();

  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message, detail = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✓ ${message}`);
      passCount++;
    } else {
      console.error(`  ✗ ${message} — ${detail}`);
    }
  }

  // 1. Audit Default story
  await page.goto(`${STORYBOOK_URL}?id=default-application-146-conference-session-aui--default&viewMode=story`);
  await page.waitForSelector('.ds-gen-session-card');

  const card = page.locator('.ds-gen-session-card');
  const cardBox = await card.boundingBox();
  assert(cardBox && cardBox.width <= 420 && cardBox.width >= 350, 'Card max-width is constrained (around 400px)', `${cardBox?.width}px`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '12px', 'Card container has 12px border radius', cardRadius);

  const track = page.locator('.ds-gen-session-card__track');
  const trackStyle = await track.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(trackStyle.fontSize === '12px', 'Track kicker font-size is 12px (xs)', trackStyle.fontSize);
  assert(trackStyle.fontWeight === '400', 'Track kicker font-weight is 400 (strict normal rule)', trackStyle.fontWeight);

  const title = page.locator('.ds-gen-session-card__title');
  const titleStyle = await title.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(titleStyle.fontSize === '14px', 'Title font-size is 14px (sm)', titleStyle.fontSize);
  assert(titleStyle.fontWeight === '500', 'Title font-weight is 500 (heading medium weight)', titleStyle.fontWeight);

  const desc = page.locator('.ds-gen-session-card__desc');
  const descStyle = await desc.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(descStyle.fontSize === '12px', 'Description font-size is 12px (xs)', descStyle.fontSize);
  assert(descStyle.fontWeight === '400', 'Description font-weight is 400 (strict normal rule)', descStyle.fontWeight);

  const meta = page.locator('.ds-gen-session-card__meta');
  const metaStyle = await meta.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(metaStyle.fontSize === '12px', 'Meta info font-size is 12px (xs)', metaStyle.fontSize);
  assert(metaStyle.fontWeight === '400', 'Meta info font-weight is 400 (strict normal rule)', metaStyle.fontWeight);

  const avatar = page.locator('.ds-gen-session-card__avatar');
  const avatarBox = await avatar.boundingBox();
  assert(avatarBox && Math.round(avatarBox.width) === 28 && Math.round(avatarBox.height) === 28, 'Avatar size is 28x28px', `${avatarBox?.width}x${avatarBox?.height}`);

  const speakerName = page.locator('.ds-gen-session-card__speaker-name');
  const speakerNameStyle = await speakerName.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(speakerNameStyle.fontSize === '12px', 'Speaker name font-size is 12px (xs)', speakerNameStyle.fontSize);
  assert(speakerNameStyle.fontWeight === '500', 'Speaker name font-weight is 500 (medium weight)', speakerNameStyle.fontWeight);

  const speakerRole = page.locator('.ds-gen-session-card__speaker-role');
  const speakerRoleStyle = await speakerRole.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(speakerRoleStyle.fontSize === '12px', 'Speaker role font-size is 12px (xs)', speakerRoleStyle.fontSize);
  assert(speakerRoleStyle.fontWeight === '400', 'Speaker role font-weight is 400 (strict normal rule)', speakerRoleStyle.fontWeight);

  const button = page.locator('.ds-gen-session-card .ds-button');
  const buttonBox = await button.boundingBox();
  assert(buttonBox && buttonBox.height <= 32 && buttonBox.height >= 24, 'View CTA button height is compact (24-32px)', `${buttonBox?.height}px`);

  // Screenshots in dark and light
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-event-session-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-event-session-default-light.png') });

  // 2. Audit Keynote variant story
  await page.goto(`${STORYBOOK_URL}?id=default-application-146-conference-session-aui--keynote&viewMode=story`);
  await page.waitForSelector('.ds-gen-session-card');

  const keynoteSpeaker = await page.locator('.ds-gen-session-card__speaker-name').innerText();
  assert(keynoteSpeaker === 'Dr. Marcus Vance', 'Keynote story renders Dr. Marcus Vance', keynoteSpeaker);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-event-session-keynote-dark.png') });

  console.log(`\nAudit finished: ${passCount}/${totalTests} passed`);
  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

audit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
