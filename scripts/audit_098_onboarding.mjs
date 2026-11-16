import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #098: Onboarding Card...');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1000, height: 800 },
    deviceScaleFactor: 2,
  });

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // 1. Audit Default story in dark mode
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });

  const card = await page.$('[data-slot="onboarding"]');
  const cardBox = await card.boundingBox();
  const cardStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      padding: s.padding,
      gap: s.gap,
      display: s.display,
      flexDirection: s.flexDirection,
    };
  }, card);

  assert(cardBox.width <= 384 && cardBox.width >= 340, `Card width matches 384px max-width: ${cardBox.width}px`);
  assert(cardStyles.borderRadius === '20px', `Card border-radius is 20px (got ${cardStyles.borderRadius})`);
  assert(cardStyles.padding === '20px', `Card padding is 20px (got ${cardStyles.padding})`);
  assert(cardStyles.display === 'flex' && cardStyles.flexDirection === 'column', 'Card layout is flex column');

  // Counter
  const counter = await page.$('[data-slot="step-counter"]');
  const counterText = await counter.innerText();
  assert(counterText.trim() === '1 of 3', `Counter text is '1 of 3' (got ${counterText})`);

  const counterStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
    };
  }, counter);
  assert(counterStyles.fontSize === '11px', `Counter font size is 11px (got ${counterStyles.fontSize})`);
  assert(counterStyles.fontFamily.toLowerCase().includes('mono'), `Counter uses monospace font (got ${counterStyles.fontFamily})`);

  // Title
  const title = await page.$('[data-slot="step-title"]');
  const titleStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  }, title);
  assert(titleStyles.fontSize === '15px', `Title font size is 15px (got ${titleStyles.fontSize})`);
  assert(titleStyles.fontWeight === '500', `Title font weight is 500 (got ${titleStyles.fontWeight})`);

  // Body
  const body = await page.$('[data-slot="step-body"]');
  const bodyStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
    };
  }, body);
  assert(bodyStyles.fontSize === '13px', `Body font size is 13px (got ${bodyStyles.fontSize})`);
  assert(bodyStyles.fontWeight === '400', `Body font weight is 400 (got ${bodyStyles.fontWeight})`);

  // Example box
  const example = await page.$('[data-slot="step-example"]');
  const exampleStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      borderRadius: s.borderRadius,
    };
  }, example);
  assert(exampleStyles.fontSize === '13px', `Example font size is 13px (got ${exampleStyles.fontSize})`);
  assert(exampleStyles.fontWeight === '400', `Example font weight is 400 (got ${exampleStyles.fontWeight})`);
  assert(exampleStyles.borderRadius === '12px', `Example border radius is 12px (got ${exampleStyles.borderRadius})`);

  // Dots
  const dots = await page.$$('.ds-onboarding__dot');
  assert(dots.length === 3, `Has 3 progress dots (got ${dots.length})`);
  const activeDotBox = await dots[0].boundingBox();
  const inactiveDotBox = await dots[1].boundingBox();
  assert(Math.round(activeDotBox.width) === 16, `Active dot width is 16px (got ${Math.round(activeDotBox.width)})`);
  assert(Math.round(inactiveDotBox.width) === 4, `Inactive dot width is 4px (got ${Math.round(inactiveDotBox.width)})`);
  assert(Math.round(activeDotBox.height) === 4, `Active dot height is 4px (got ${Math.round(activeDotBox.height)})`);

  // Buttons
  const skipBtn = await page.$('.ds-onboarding__skip-btn');
  const nextBtn = await page.$('.ds-onboarding__next-btn');
  const nextBtnText = await nextBtn.innerText();
  assert(nextBtnText.trim() === 'Next', `Default next button text is 'Next' (got ${nextBtnText})`);

  const skipBtnStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, borderRadius: s.borderRadius, fontSize: s.fontSize };
  }, skipBtn);
  assert(skipBtnStyles.height === '32px', `Skip button height is 32px (got ${skipBtnStyles.height})`);
  assert(skipBtnStyles.fontSize === '12px', `Skip button font size is 12px (got ${skipBtnStyles.fontSize})`);

  const nextBtnStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { height: s.height, borderRadius: s.borderRadius, fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, nextBtn);
  assert(nextBtnStyles.height === '32px', `Next button height is 32px (got ${nextBtnStyles.height})`);
  assert(nextBtnStyles.fontSize === '12px', `Next button font size is 12px (got ${nextBtnStyles.fontSize})`);
  assert(nextBtnStyles.fontWeight === '500', `Next button font weight is 500 (got ${nextBtnStyles.fontWeight})`);

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/onboarding-default-dark.png`,
    clip: { x: cardBox.x - 20, y: cardBox.y - 20, width: cardBox.width + 40, height: cardBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });
  const lightCard = await page.$('[data-slot="onboarding"]');
  const lightBox = await lightCard.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/onboarding-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit MiddleStep
  console.log('\n--- Auditing MiddleStep Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--middle-step&globals=theme:dark`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });
  const midCounter = await page.$('[data-slot="step-counter"]');
  assert((await midCounter.innerText()).trim() === '2 of 3', 'Middle step counter is 2 of 3');
  const midActiveDot = await page.$('.ds-onboarding__dot.is-active');
  const midActiveIndex = await midActiveDot.getAttribute('data-dot-index');
  assert(midActiveIndex === '1', `Middle step active dot index is 1 (got ${midActiveIndex})`);

  // 4. Audit LastStep
  console.log('\n--- Auditing LastStep Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--last-step&globals=theme:dark`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });
  const lastNextBtn = await page.$('.ds-onboarding__next-btn');
  const lastBtnText = await lastNextBtn.innerText();
  assert(lastBtnText.trim() === 'Start', `Last step button text is 'Start' (got ${lastBtnText})`);

  // 5. Audit SingleStep
  console.log('\n--- Auditing SingleStep Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--single-step&globals=theme:dark`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });
  const singleBtn = await page.$('.ds-onboarding__next-btn');
  assert((await singleBtn.innerText()).trim() === 'Start', 'Single step button text is Start');
  const singleCounter = await page.$('[data-slot="step-counter"]');
  assert((await singleCounter.innerText()).trim() === '1 of 1', 'Single step counter is 1 of 1');

  // 6. Audit Interactive
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-98-onboarding--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="onboarding"]', { timeout: 5000 });

  const interNextBtn = await page.$('.ds-onboarding__next-btn');
  await interNextBtn.click();
  const step2Counter = await page.$('[data-slot="step-counter"]');
  assert((await step2Counter.innerText()).trim() === '2 of 3', 'Clicking Next advances to step 2');

  await interNextBtn.click();
  const step3Counter = await page.$('[data-slot="step-counter"]');
  assert((await step3Counter.innerText()).trim() === '3 of 3', 'Clicking Next advances to step 3');
  assert((await interNextBtn.innerText()).trim() === 'Start', 'On step 3 Next button reads Start');

  const interCard = await page.$('[data-slot="onboarding"]');
  const interBox = await interCard.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/onboarding-interactive-dark.png`,
    clip: { x: interBox.x - 20, y: interBox.y - 20, width: interBox.width + 40, height: interBox.height + 40 },
  });

  console.log(`\n========================================`);
  console.log(`Audit Complete: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log(`========================================\n`);

  await browser.close();

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error(err);
  process.exit(1);
});
