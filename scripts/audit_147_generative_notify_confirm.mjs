import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #147 Confirm Dialog AUI (Generative Notify Confirm)...');
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
  await page.goto(`${STORYBOOK_URL}?id=default-application-147-confirm-dialog-aui--default&viewMode=story`);
  await page.waitForSelector('.ds-gen-confirm-card');

  const card = page.locator('.ds-gen-confirm-card');
  const role = await card.getAttribute('role');
  assert(role === 'alertdialog', 'Dialog container has role="alertdialog"', role);

  const cardBox = await card.boundingBox();
  assert(cardBox && cardBox.width <= 400 && cardBox.width >= 320, 'Dialog max-width is constrained (around 380px)', `${cardBox?.width}px`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '12px', 'Dialog container has 12px border radius', cardRadius);

  const title = page.locator('.ds-gen-confirm-card__title');
  const titleStyle = await title.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(titleStyle.fontSize === '14px', 'Title font-size is 14px (sm)', titleStyle.fontSize);
  assert(titleStyle.fontWeight === '500', 'Title font-weight is 500 (heading medium weight)', titleStyle.fontWeight);

  const desc = page.locator('.ds-gen-confirm-card__desc');
  const descStyle = await desc.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(descStyle.fontSize === '12px', 'Description font-size is 12px (xs)', descStyle.fontSize);
  assert(descStyle.fontWeight === '400', 'Description font-weight is 400 (strict normal rule)', descStyle.fontWeight);

  const icon = page.locator('.ds-gen-confirm-card__icon');
  const iconBox = await icon.boundingBox();
  assert(iconBox && Math.round(iconBox.width) === 28 && Math.round(iconBox.height) === 28, 'Icon container size is 28x28px', `${iconBox?.width}x${iconBox?.height}`);

  const buttons = page.locator('.ds-gen-confirm-card__actions .ds-button');
  const btnCount = await buttons.count();
  assert(btnCount === 2, 'Dialog renders 2 action buttons (Cancel + Confirm)', `${btnCount}`);

  const cancelBtnBox = await buttons.first().boundingBox();
  assert(cancelBtnBox && cancelBtnBox.height <= 32 && cancelBtnBox.height >= 24, 'Button height is compact (24-32px)', `${cancelBtnBox?.height}px`);

  // Screenshots
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-notify-confirm-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-notify-confirm-default-light.png') });

  // 2. Audit DestructionConfirm story
  await page.goto(`${STORYBOOK_URL}?id=default-application-147-confirm-dialog-aui--destruction-confirm&viewMode=story`);
  await page.waitForSelector('.ds-gen-confirm-card');
  const destTitle = await page.locator('.ds-gen-confirm-card__title').innerText();
  assert(destTitle === 'Delete this deployment?', 'Destruction story renders "Delete this deployment?"', destTitle);

  // 3. Audit PublishConfirm story
  await page.goto(`${STORYBOOK_URL}?id=default-application-147-confirm-dialog-aui--publish-confirm&viewMode=story`);
  await page.waitForSelector('.ds-gen-confirm-card');
  const pubTitle = await page.locator('.ds-gen-confirm-card__title').innerText();
  assert(pubTitle === 'Publish agent configuration?', 'Publish story renders "Publish agent configuration?"', pubTitle);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-notify-confirm-publish-dark.png') });

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
