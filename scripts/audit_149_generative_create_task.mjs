import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006/iframe.html';

async function audit() {
  console.log('Auditing #149 Create Task AUI (Generative Create Task)...');
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
  await page.goto(`${STORYBOOK_URL}?id=default-application-149-create-task-aui--default&viewMode=story`);
  await page.waitForSelector('.ds-gen-task-card');

  const card = page.locator('.ds-gen-task-card');
  const cardBox = await card.boundingBox();
  assert(cardBox && cardBox.width <= 420 && cardBox.width >= 350, 'Card max-width is constrained (around 400px)', `${cardBox?.width}px`);

  const cardRadius = await card.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(cardRadius === '12px', 'Card container has 12px border radius', cardRadius);

  const title = page.locator('.ds-gen-task-card__title');
  const titleStyle = await title.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(titleStyle.fontSize === '14px', 'Title font-size is 14px (sm)', titleStyle.fontSize);
  assert(titleStyle.fontWeight === '500', 'Title font-weight is 500 (heading medium weight)', titleStyle.fontWeight);

  const label = page.locator('.ds-gen-task-card__label').first();
  const labelStyle = await label.evaluate(el => ({
    fontSize: window.getComputedStyle(el).fontSize,
    fontWeight: window.getComputedStyle(el).fontWeight
  }));
  assert(labelStyle.fontSize === '12px', 'Label font-size is 12px (xs)', labelStyle.fontSize);
  assert(labelStyle.fontWeight === '400', 'Label font-weight is 400 (strict normal rule)', labelStyle.fontWeight);

  const titleInput = page.locator('#task-title-input');
  const titleInputBox = await titleInput.boundingBox();
  const titleInputRadius = await titleInput.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(titleInputBox && Math.round(titleInputBox.height) === 32, 'Title input height is 32px compact', `${titleInputBox?.height}px`);
  assert(titleInputRadius === '8px', 'Title input has 8px border radius', titleInputRadius);

  const textarea = page.locator('#task-desc-input');
  const textareaRadius = await textarea.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(textareaRadius === '8px', 'Textarea has 8px border radius', textareaRadius);

  const chips = page.locator('.ds-gen-task-card__chip');
  const chipCount = await chips.count();
  assert(chipCount === 3, 'Priority selector renders 3 chips (Low, Med, High)', `${chipCount}`);

  const submitBtn = page.locator('.ds-gen-task-card__btn');
  const submitBtnBox = await submitBtn.boundingBox();
  assert(submitBtnBox && Math.round(submitBtnBox.height) === 32 && submitBtnBox.width >= 300, 'Submit button is 32px height and full card width', `${submitBtnBox?.width}x${submitBtnBox?.height}`);

  // Test interactivity: click High chip
  await chips.last().click();
  const isHighActive = await chips.last().evaluate(el => el.classList.contains('ds-gen-task-card__chip--active'));
  assert(isHighActive, 'Clicking priority chip activates state', `${isHighActive}`);

  // Screenshots
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-task-default-dark.png') });

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-task-default-light.png') });

  // 2. Audit HighPriority story
  await page.goto(`${STORYBOOK_URL}?id=default-application-149-create-task-aui--high-priority&viewMode=story`);
  await page.waitForSelector('.ds-gen-task-card');

  const highTitleVal = await page.locator('#task-title-input').inputValue();
  assert(highTitleVal.includes('Production outage'), 'HighPriority story pre-fills urgent task title', highTitleVal);

  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'generative-create-task-urgent-dark.png') });

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
