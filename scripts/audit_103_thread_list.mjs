import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #103: Thread List AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread-list"]', { timeout: 5000 });

  const list = await page.$('[data-slot="thread-list"]');
  const listBox = await list.boundingBox();
  const listStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      height: s.height,
    };
  }, list);

  assert(Math.round(listBox.width) === 280, `Thread list width is 280px (got ${listBox.width}px)`);
  assert(Math.round(listBox.height) === 380, `Thread list height is 380px (got ${listBox.height}px)`);
  assert(listStyles.borderRadius === '16px', `Thread list border-radius is 16px (got ${listStyles.borderRadius})`);

  // Header & New chat button
  const headerTitle = await page.$('.ds-thread-list-aui__header-title');
  assert((await headerTitle.innerText()).trim() === 'Chats', 'Header title is Chats');
  const newBtn = await page.$('[data-action="new-chat"]');
  const newBox = await newBtn.boundingBox();
  assert(Math.round(newBox.width) === 28 && Math.round(newBox.height) === 28, `New chat button is 28x28px (got ${newBox.width}x${newBox.height})`);

  // Group headings
  const groups = await page.$$('.ds-thread-list-aui__group-title');
  assert(groups.length === 3, `Has 3 group headings (got ${groups.length})`);
  const groupStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontFamily: s.fontFamily };
  }, groups[0]);
  assert(groupStyles.fontSize === '11px', `Group heading font size is 11px (got ${groupStyles.fontSize})`);
  assert(groupStyles.fontFamily.toLowerCase().includes('mono'), `Group heading is monospace (got ${groupStyles.fontFamily})`);

  // Thread rows
  const rows = await page.$$('.ds-thread-list-aui__row');
  assert(rows.length === 6, `Has 6 thread items (got ${rows.length})`);

  // Active item
  const activeRow = await page.$('.ds-thread-list-aui__row.is-active');
  assert(activeRow !== null, 'First thread is active');
  const activeTitle = await activeRow.$('.ds-thread-list-aui__title');
  const activeTitleStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, activeTitle);
  assert(activeTitleStyles.fontSize === '13.5px', `Title font size is 13.5px (got ${activeTitleStyles.fontSize})`);
  assert(activeTitleStyles.fontWeight === '500', `Active title font weight is 500 (got ${activeTitleStyles.fontWeight})`);

  // Inactive item
  const inactiveTitle = await rows[1].$('.ds-thread-list-aui__title');
  const inactiveTitleStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontWeight: s.fontWeight };
  }, inactiveTitle);
  assert(inactiveTitleStyles.fontWeight === '400', `Inactive title font weight is 400 (got ${inactiveTitleStyles.fontWeight})`);

  // Unread indicator
  const unreadDot = await page.$('.ds-thread-list-aui__unread-dot');
  assert(unreadDot !== null, 'Unread indicator dot is rendered on unread item');
  const unreadBox = await unreadDot.boundingBox();
  assert(Math.round(unreadBox.width) === 6 && Math.round(unreadBox.height) === 6, `Unread dot is 6x6px (got ${unreadBox.width}x${unreadBox.height})`);

  // Action buttons
  const renameBtn = await page.$('[data-action="rename"]');
  assert(renameBtn !== null, 'Rename action button is rendered');
  const deleteBtn = await page.$('[data-action="delete"]');
  assert(deleteBtn !== null, 'Delete action button is rendered');

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-default-dark.png`,
    clip: { x: listBox.x - 20, y: listBox.y - 20, width: listBox.width + 40, height: listBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="thread-list"]', { timeout: 5000 });
  const lightList = await page.$('[data-slot="thread-list"]');
  const lightBox = await lightList.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Loading Story
  console.log('\n--- Auditing Loading Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--loading&globals=theme:dark`);
  await page.waitForSelector('[data-slot="skeleton"]', { timeout: 5000 });
  const skeletons = await page.$$('[data-slot="skeleton"]');
  assert(skeletons.length === 4, `Has 4 skeleton rows (got ${skeletons.length})`);

  // 4. Audit Empty Story
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--empty&globals=theme:dark`);
  await page.waitForSelector('[data-slot="empty-msg"]', { timeout: 5000 });
  const emptyMsg = await page.$('[data-slot="empty-msg"]');
  assert((await emptyMsg.innerText()).trim() === 'No saved threads', 'Empty message matches ground truth');

  // 5. Audit Untitled Story
  console.log('\n--- Auditing Untitled Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--untitled&globals=theme:dark`);
  await page.waitForSelector('.ds-thread-list-aui__title', { timeout: 5000 });
  const firstUntitled = await page.$('.ds-thread-list-aui__title');
  assert((await firstUntitled.innerText()).trim() === 'New Chat', `Untitled fallback is 'New Chat' (got ${await firstUntitled.innerText()})`);

  // 6. Audit LongContent Story
  console.log('\n--- Auditing LongContent Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--long-content&globals=theme:dark`);
  await page.waitForSelector('.ds-thread-list-aui__title', { timeout: 5000 });
  const longTitles = await page.$$('.ds-thread-list-aui__title');
  const longStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { textOverflow: s.textOverflow, whiteSpace: s.whiteSpace };
  }, longTitles[0]);
  assert(longStyles.textOverflow === 'ellipsis', `Long title has text-overflow: ellipsis (got ${longStyles.textOverflow})`);

  // 7. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-103-thread-list-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread-list"]', { timeout: 5000 });

  // Click second thread
  const interRows = await page.$$('.ds-thread-list-aui__row');
  const secondBtn = await interRows[1].$('[data-action="select-thread"]');
  await secondBtn.click();

  const isSecondActive = await page.evaluate((el) => el.classList.contains('is-active'), interRows[1]);
  const isFirstActive = await page.evaluate((el) => el.classList.contains('is-active'), interRows[0]);
  assert(isSecondActive === true, 'Clicking second thread activates it');
  assert(isFirstActive === false, 'First thread is deactivated');

  // Click new chat button
  const interNewBtn = await page.$('[data-action="new-chat"]');
  await interNewBtn.click();
  const updatedRows = await page.$$('.ds-thread-list-aui__row');
  assert(updatedRows.length === interRows.length + 1, 'New chat button prepends new row');
  const newRowTitle = await updatedRows[0].$('.ds-thread-list-aui__title');
  assert((await newRowTitle.innerText()).trim() === 'New Chat', 'Prepended row title is New Chat');

  // Delete a thread
  await updatedRows[1].hover();
  const delBtn = await updatedRows[1].$('[data-action="delete"]');
  await delBtn.click({ force: true });
  const rowsAfterDel = await page.$$('.ds-thread-list-aui__row');
  assert(rowsAfterDel.length === updatedRows.length - 1, 'Clicking delete button removes thread row');

  const interBox = await (await page.$('[data-slot="thread-list"]')).boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-interactive-dark.png`,
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
