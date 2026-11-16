import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #150 Software Purchase AUI (Generative Software Purchase)...');
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
  await page.goto(`${STORYBOOK_URL}?id=default-application-150-software-purchase-aui--default&viewMode=story`);
  await page.waitForSelector('.ds-gen-purchase-card');

  const card = page.locator('.ds-gen-purchase-card');
  const cardBox = await card.boundingBox();
  assert(cardBox && cardBox.width <= 420 && cardBox.width >= 350, 'Card max-width is constrained (around 400px)', `${cardBox?.width}px`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '12px', 'Card container has 12px border radius', cardRadius);

  const title = page.locator('.ds-gen-purchase-card__title');
  const titleStyle = await title.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(titleStyle.fontSize === '14px', 'Title font-size is 14px (sm)', titleStyle.fontSize);
  assert(titleStyle.fontWeight === '500', 'Title font-weight is 500 (heading medium weight)', titleStyle.fontWeight);

  const label = page.locator('.ds-gen-purchase-card__label').first();
  const labelStyle = await label.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(labelStyle.fontSize === '12px', 'Label font-size is 12px (xs)', labelStyle.fontSize);
  assert(labelStyle.fontWeight === '400', 'Label font-weight is 400 (strict normal rule)', labelStyle.fontWeight);

  const input = page.locator('#purchase-purpose-input');
  const inputBox = await input.boundingBox();
  const inputRadius = await input.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(inputBox && Math.round(inputBox.height) === 32, 'Input height is 32px compact', `${inputBox?.height}px`);
  assert(inputRadius === '8px', 'Input has 8px border radius', inputRadius);

  const select = page.locator('#purchase-volume-select');
  const selectBox = await select.boundingBox();
  assert(selectBox && Math.round(selectBox.height) === 32, 'Select height is 32px compact', `${selectBox?.height}px`);

  const totalLbl = page.locator('.ds-gen-purchase-card__total-lbl');
  const totalLblStyle = await totalLbl.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(totalLblStyle.fontSize === '12px', 'Total label font-size is 12px (xs)', totalLblStyle.fontSize);
  assert(totalLblStyle.fontWeight === '400', 'Total label font-weight is 400 (strict normal rule)', totalLblStyle.fontWeight);

  const totalVal = page.locator('.ds-gen-purchase-card__total-val');
  const totalValStyle = await totalVal.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(totalValStyle.fontSize === '14px', 'Total value font-size is 14px (sm)', totalValStyle.fontSize);
  assert(totalValStyle.fontWeight === '500', 'Total value font-weight is 500 (medium weight)', totalValStyle.fontWeight);

  const buttons = page.locator('.ds-gen-purchase-card__actions .ds-button');
  const btnBox = await buttons.last().boundingBox();
  assert(btnBox && btnBox.height <= 32 && btnBox.height >= 24, 'Action button height is compact (24-32px)', `${btnBox?.height}px`);

  // Screenshots
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-software-purchase-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-software-purchase-default-light.png') });

  // 2. Audit EnterprisePlan story
  await page.goto(`${STORYBOOK_URL}?id=default-application-150-software-purchase-aui--enterprise-plan&viewMode=story`);
  await page.waitForSelector('.ds-gen-purchase-card');

  const entTitle = await page.locator('.ds-gen-purchase-card__title').innerText();
  const entTotal = await page.locator('.ds-gen-purchase-card__total-val').innerText();
  assert(entTitle === 'Purchase Enterprise tier', 'EnterprisePlan story renders title', entTitle);
  assert(entTotal === '$2,400 per year', 'EnterprisePlan story renders $2,400 per year', entTotal);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-software-purchase-enterprise-dark.png') });

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
