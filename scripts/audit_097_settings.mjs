import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #097: Settings Panel...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });

  const panel = await page.$('[data-slot="settings-panel"]');
  const panelBox = await panel.boundingBox();
  const panelStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      padding: s.padding,
      gap: s.gap,
      display: s.display,
      flexDirection: s.flexDirection,
    };
  }, panel);

  assert(panelBox.width <= 384 && panelBox.width >= 350, `Panel width matches compact card: ${panelBox.width}px`);
  assert(panelStyles.borderRadius === '20px', `Panel border-radius is 20px (got ${panelStyles.borderRadius})`);
  assert(panelStyles.display === 'flex' && panelStyles.flexDirection === 'column', 'Panel layout is flex column');

  // Model selection
  const modelBtns = await page.$$('.ds-settings-model-btn');
  assert(modelBtns.length === 3, `Has 3 model options (got ${modelBtns.length})`);

  const activeModelBtn = await page.$('.ds-settings-model-btn.is-active');
  const activeModelText = await activeModelBtn.innerText();
  assert(activeModelText.trim() === 'Sonnet', `Active model is Sonnet (got ${activeModelText})`);

  const activeBtnStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      borderRadius: s.borderRadius,
    };
  }, activeModelBtn);
  assert(activeBtnStyles.fontSize === '12px', `Model button font size is 12px (got ${activeBtnStyles.fontSize})`);
  assert(activeBtnStyles.fontWeight === '500', `Model button font weight is 500 (got ${activeBtnStyles.fontWeight})`);

  // Labels
  const labels = await page.$$('.ds-settings-label');
  assert(labels.length >= 3, `Has at least 3 section labels (got ${labels.length})`);
  const firstLabelStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontFamily: s.fontFamily,
    };
  }, labels[0]);
  assert(firstLabelStyles.fontSize === '11px', `Label font-size is 11px (got ${firstLabelStyles.fontSize})`);
  assert(firstLabelStyles.fontFamily.toLowerCase().includes('mono'), `Label uses monospace font (got ${firstLabelStyles.fontFamily})`);

  // Textarea
  const textarea = await page.$('.ds-settings-textarea');
  const textareaStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      borderRadius: s.borderRadius,
      resize: s.resize,
    };
  }, textarea);
  assert(textareaStyles.fontSize === '12px', `Textarea font size is 12px (got ${textareaStyles.fontSize})`);
  assert(textareaStyles.fontWeight === '400', `Textarea font weight is 400 (got ${textareaStyles.fontWeight})`);
  assert(textareaStyles.borderRadius === '12px', `Textarea border-radius is 12px (got ${textareaStyles.borderRadius})`);
  assert(textareaStyles.resize === 'none', `Textarea resize is none (got ${textareaStyles.resize})`);

  // Temperature
  const tempVal = await page.$('[data-slot="temp-val"]');
  const tempText = await tempVal.innerText();
  assert(tempText.trim() === '0.7', `Default temperature is 0.7 (got ${tempText})`);

  // Toggles
  const switches = await page.$$('.ds-settings-switch');
  assert(switches.length === 2, `Has 2 switch toggles (got ${switches.length})`);
  const firstSwitchChecked = await switches[0].getAttribute('aria-checked');
  const secondSwitchChecked = await switches[1].getAttribute('aria-checked');
  assert(firstSwitchChecked === 'true', `First switch is checked (aria-checked=${firstSwitchChecked})`);
  assert(secondSwitchChecked === 'false', `Second switch is unchecked (aria-checked=${secondSwitchChecked})`);

  const switchStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      width: s.width,
      height: s.height,
      borderRadius: s.borderRadius,
    };
  }, switches[0]);
  assert(switchStyles.width === '36px', `Switch width is 36px (got ${switchStyles.width})`);
  assert(switchStyles.height === '20px', `Switch height is 20px (got ${switchStyles.height})`);

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/settings-panel-default-dark.png`,
    clip: { x: panelBox.x - 20, y: panelBox.y - 20, width: panelBox.width + 40, height: panelBox.height + 40 },
  });

  // 2. Audit Default story in light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });
  const lightPanel = await page.$('[data-slot="settings-panel"]');
  const lightPanelBox = await lightPanel.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/settings-panel-default-light.png`,
    clip: { x: lightPanelBox.x - 20, y: lightPanelBox.y - 20, width: lightPanelBox.width + 40, height: lightPanelBox.height + 40 },
  });

  // 3. Audit ReadOnly story
  console.log('\n--- Auditing ReadOnly Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--read-only&globals=theme:dark`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });
  const roModel = await page.$('.ds-settings-model-btn[aria-disabled="true"]');
  assert(roModel !== null, 'Model pills are aria-disabled in ReadOnly');
  const roTextarea = await page.$('.ds-settings-textarea[readonly]');
  assert(roTextarea !== null, 'Textarea has readonly attribute in ReadOnly');

  // 4. Audit Clamped story
  console.log('\n--- Auditing Clamped Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--clamped&globals=theme:dark`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });
  const clampedTempVal = await page.$('[data-slot="temp-val"]');
  const clampedText = await clampedTempVal.innerText();
  assert(clampedText.trim() === '2.0', `Temperature 3.4 is properly clamped to 2.0 (got ${clampedText})`);

  // 5. Audit LongPrompt story
  console.log('\n--- Auditing LongPrompt Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--long-prompt&globals=theme:dark`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });
  const longToggles = await page.$$('.ds-settings-toggle-row');
  assert(longToggles.length === 3, `Has 3 toggles in LongPrompt (got ${longToggles.length})`);
  const longLabel = await page.$('.ds-settings-toggle-label');
  const longLabelStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      textOverflow: s.textOverflow,
      whiteSpace: s.whiteSpace,
    };
  }, longLabel);
  assert(longLabelStyles.textOverflow === 'ellipsis', `Long toggle labels use text-overflow: ellipsis (got ${longLabelStyles.textOverflow})`);

  // 6. Audit Interactive story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-97-settings--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="settings-panel"]', { timeout: 5000 });

  // Click Opus model button
  const opusBtn = await page.$('.ds-settings-model-btn[data-model="Opus"]');
  await opusBtn.click();
  const opusPressed = await opusBtn.getAttribute('aria-pressed');
  assert(opusPressed === 'true', 'Clicking Opus button sets aria-pressed="true"');

  // Toggle switch
  const memorySwitch = await page.$('.ds-settings-switch[data-switch-key="memory"]');
  const initialMemoryChecked = await memorySwitch.getAttribute('aria-checked');
  assert(initialMemoryChecked === 'false', 'Memory switch initially unchecked');
  await memorySwitch.click();
  const toggledMemoryChecked = await memorySwitch.getAttribute('aria-checked');
  assert(toggledMemoryChecked === 'true', 'Clicking switch toggles aria-checked to true');

  // Screenshot Interactive Dark
  const interactivePanel = await page.$('[data-slot="settings-panel"]');
  const interactiveBox = await interactivePanel.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/settings-panel-interactive-dark.png`,
    clip: { x: interactiveBox.x - 20, y: interactiveBox.y - 20, width: interactiveBox.width + 40, height: interactiveBox.height + 40 },
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
