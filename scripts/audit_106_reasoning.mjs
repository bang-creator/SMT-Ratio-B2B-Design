import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #106: Reasoning AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning-root"]', { timeout: 5000 });

  const root = await page.$('[data-slot="reasoning-root"]');
  const rootBox = await root.boundingBox();
  const rootStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      padding: s.padding,
    };
  }, root);

  assert(rootBox.width <= 576 && rootBox.width >= 500, `Root width matches 576px max-width: ${rootBox.width}px`);
  assert(rootStyles.borderRadius === '10px', `Root border-radius is 10px (got ${rootStyles.borderRadius})`);

  // Trigger
  const trigger = await page.$('[data-slot="reasoning-trigger"]');
  const triggerStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, trigger);
  assert(triggerStyles.fontSize === '14px', `Trigger font size is 14px (got ${triggerStyles.fontSize})`);
  assert(triggerStyles.fontWeight === '400', `Trigger font weight is 400 (got ${triggerStyles.fontWeight})`);

  const label = await page.$('[data-slot="reasoning-label"]');
  assert((await label.innerText()).trim() === 'Reasoning (14s)', 'Default label is Reasoning (14s)');

  const isExpanded = await trigger.getAttribute('aria-expanded');
  assert(isExpanded === 'true', 'Default state is expanded (aria-expanded=true)');

  // Content
  const text = await page.$('[data-slot="reasoning-text"]');
  const textStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight };
  }, text);
  assert(textStyles.fontSize === '13.5px', `Text font size is 13.5px (got ${textStyles.fontSize})`);
  assert(textStyles.fontWeight === '400', `Text font weight is 400 (got ${textStyles.fontWeight})`);

  const paragraphs = await page.$$('[data-slot="reasoning-text"] p');
  assert(paragraphs.length === 4, `Has 4 reasoning step paragraphs (got ${paragraphs.length})`);

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/reasoning-default-dark.png`,
    clip: { x: rootBox.x - 20, y: rootBox.y - 20, width: rootBox.width + 40, height: rootBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="reasoning-root"]', { timeout: 5000 });
  const lightRoot = await page.$('[data-slot="reasoning-root"]');
  const lightBox = await lightRoot.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/reasoning-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Streaming Story
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--streaming&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning-root"]', { timeout: 5000 });
  const streamTrigger = await page.$('.ds-reasoning-trigger.is-active');
  assert(streamTrigger !== null, 'Trigger has is-active shimmer class');
  const streamLabel = await page.$('[data-slot="reasoning-label"]');
  assert((await streamLabel.innerText()).trim() === 'Reasoning', 'Streaming label is Reasoning without duration');
  const bottomFade = await page.$('.ds-reasoning-fade--bottom');
  assert(bottomFade !== null, 'Bottom fade gradient is present during streaming');

  // 4. Audit Collapsed Story
  console.log('\n--- Auditing Collapsed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--collapsed&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning-root"]', { timeout: 5000 });
  const colContent = await page.$('.ds-reasoning-content.is-closed');
  assert(colContent !== null, 'Content is hidden with is-closed class');
  const colTrigger = await page.$('[data-slot="reasoning-trigger"]');
  assert(await colTrigger.getAttribute('aria-expanded') === 'false', 'Trigger has aria-expanded=false');

  // 5. Audit LongContent Story
  console.log('\n--- Auditing LongContent Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--long-content&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning-text"]', { timeout: 5000 });
  const longParagraphs = await page.$$('[data-slot="reasoning-text"] p');
  assert(longParagraphs.length === 7, `Has 7 paragraphs in long content (got ${longParagraphs.length})`);
  const longLabel = await page.$('[data-slot="reasoning-label"]');
  assert((await longLabel.innerText()).trim() === 'Reasoning (41s)', 'Duration is (41s)');

  // 6. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-106-reasoning-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="reasoning-root"]', { timeout: 5000 });

  // Click to collapse
  const interTrigger = await page.$('[data-slot="reasoning-trigger"]');
  await interTrigger.click();
  const interContent = await page.$('[data-slot="reasoning-content"]');
  const hasClosed = await page.evaluate((el) => el.classList.contains('is-closed'), interContent);
  assert(hasClosed === true, 'Clicking trigger collapses content');
  assert(await interTrigger.getAttribute('aria-expanded') === 'false', 'aria-expanded becomes false');

  // Click to expand
  await interTrigger.click();
  const hasClosed2 = await page.evaluate((el) => el.classList.contains('is-closed'), interContent);
  assert(hasClosed2 === false, 'Clicking trigger again expands content');
  assert(await interTrigger.getAttribute('aria-expanded') === 'true', 'aria-expanded becomes true');

  const interBox = await (await page.$('[data-slot="reasoning-root"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/reasoning-interactive-dark.png`,
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
