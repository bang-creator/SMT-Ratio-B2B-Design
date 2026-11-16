import { chromium } from 'playwright';

const STORYBOOK_URL = 'http://127.0.0.1:6006';
const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';

async function runAudit() {
  console.log('🚀 Starting Audit #104: Thread List Sidebar AUI...');
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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--default&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread-list-sidebar"]', { timeout: 5000 });

  const shell = await page.$('[data-slot="thread-list-sidebar"]');
  const shellBox = await shell.boundingBox();
  const shellStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      borderRadius: s.borderRadius,
      maxWidth: s.maxWidth,
      height: s.height,
    };
  }, shell);

  assert(shellBox.width <= 800 && shellBox.width >= 720, `Shell width matches 800px max-width: ${shellBox.width}px`);
  assert(Math.round(shellBox.height) === 480, `Shell height matches 480px: ${shellBox.height}px`);
  assert(shellStyles.borderRadius === '20px', `Shell border-radius is 20px (got ${shellStyles.borderRadius})`);

  // Sidebar pane
  const sidebar = await page.$('[data-slot="sidebar-pane"]');
  const sidebarBox = await sidebar.boundingBox();
  assert(Math.round(sidebarBox.width) === 260, `Sidebar width is 260px (got ${sidebarBox.width}px)`);

  // New chat button
  const newChatBtn = await page.$('[data-action="new-chat"]');
  const newChatBox = await newChatBtn.boundingBox();
  assert(Math.round(newChatBox.height) === 32, `New chat button height is 32px (got ${newChatBox.height}px)`);

  // Profile footer
  const userName = await page.$('.ds-thread-list-sidebar__user-name');
  assert((await userName.innerText()).trim() === 'OpenAI Platform', 'Footer user profile name matches');

  // Topbar
  const toggleBtn = await page.$('[data-action="toggle-sidebar"]');
  const toggleBox = await toggleBtn.boundingBox();
  assert(Math.round(toggleBox.width) === 28 && Math.round(toggleBox.height) === 28, `Sidebar toggle button is 28x28px (got ${toggleBox.width}x${toggleBox.height})`);

  const topbarTitle = await page.$('[data-slot="thread-title"]');
  assert((await topbarTitle.innerText()).trim() === 'Persist composer drafts', 'Topbar title matches active thread');

  // Messages
  const userBubble = await page.$('.ds-sidebar-aui__user-bubble');
  const userStyles = await page.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { fontSize: s.fontSize, fontWeight: s.fontWeight };
  }, userBubble);
  assert(userStyles.fontSize === '13px', `User bubble font size is 13px (got ${userStyles.fontSize})`);
  assert(userStyles.fontWeight === '400', `User bubble font weight is 400 (got ${userStyles.fontWeight})`);

  // Composer
  const sendBtn = await page.$('[data-slot="send-btn"]');
  assert(await sendBtn.getAttribute('disabled') !== null, 'Send button is disabled initially');

  // Screenshot Default Dark
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-sidebar-default-dark.png`,
    clip: { x: shellBox.x - 20, y: shellBox.y - 20, width: shellBox.width + 40, height: shellBox.height + 40 },
  });

  // 2. Audit Default Light
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--default&globals=theme:light`);
  await page.waitForSelector('[data-slot="thread-list-sidebar"]', { timeout: 5000 });
  const lightShell = await page.$('[data-slot="thread-list-sidebar"]');
  const lightBox = await lightShell.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-sidebar-default-light.png`,
    clip: { x: lightBox.x - 20, y: lightBox.y - 20, width: lightBox.width + 40, height: lightBox.height + 40 },
  });

  // 3. Audit Collapsed Story
  console.log('\n--- Auditing Collapsed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--collapsed&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread-list-sidebar"]', { timeout: 5000 });
  const collapsedSidebar = await page.$('[data-slot="sidebar-pane"]');
  const colBox = await collapsedSidebar.boundingBox();
  assert(Math.round(colBox.width) === 0, `Collapsed sidebar width is 0px (got ${colBox.width}px)`);

  const mainInset = await page.$('[data-slot="sidebar-main"]');
  const mainBox = await mainInset.boundingBox();
  const collapsedShellBox = await (await page.$('[data-slot="thread-list-sidebar"]')).boundingBox();
  assert(Math.abs(mainBox.width - (collapsedShellBox.width - 2)) < 3, `Main conversation fills 100% width when collapsed (${mainBox.width}px vs ${collapsedShellBox.width}px)`);

  // 4. Audit Loading Story
  console.log('\n--- Auditing Loading Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--loading&globals=theme:dark`);
  await page.waitForSelector('[data-slot="skeleton"]', { timeout: 5000 });
  const skeletons = await page.$$('[data-slot="skeleton"]');
  assert(skeletons.length === 3, `Has 3 skeleton rows (got ${skeletons.length})`);

  // 5. Audit Empty Story
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--empty&globals=theme:dark`);
  await page.waitForSelector('[data-slot="empty-msg"]', { timeout: 5000 });
  const emptyMsg = await page.$('[data-slot="empty-msg"]');
  assert((await emptyMsg.innerText()).trim() === 'No saved threads', 'Empty message matches ground truth');

  // 6. Audit Interactive Story
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-104-thread-list-sidebar-aui--interactive&globals=theme:dark`);
  await page.waitForSelector('[data-slot="thread-list-sidebar"]', { timeout: 5000 });

  // Toggle collapse
  const interToggle = await page.$('[data-action="toggle-sidebar"]');
  await interToggle.click();
  const interPane = await page.$('[data-slot="sidebar-pane"]');
  await page.waitForTimeout(250); // wait for 200ms transition
  const interPaneBox = await interPane.boundingBox();
  assert(Math.round(interPaneBox.width) === 0, 'Clicking toggle button collapses sidebar to 0px');

  // Toggle expand
  await interToggle.click();
  await page.waitForTimeout(250);
  const interPaneBox2 = await interPane.boundingBox();
  assert(Math.round(interPaneBox2.width) === 260, 'Clicking toggle button expands sidebar back to 260px');

  // Select second thread
  const rows = await page.$$('.ds-thread-list-aui__row');
  const secondBtn = await rows[1].$('[data-action="select-thread"]');
  await secondBtn.click();
  const updatedTitle = await page.$('[data-slot="thread-title"]');
  assert((await updatedTitle.innerText()).trim() === 'Fix flaky checkout test', 'Selecting thread updates topbar title');

  // Create new chat
  const interNew = await page.$('[data-action="new-chat"]');
  await interNew.click();
  const updatedTitle2 = await page.$('[data-slot="thread-title"]');
  assert((await updatedTitle2.innerText()).trim() === 'New Chat', 'New chat updates topbar title to New Chat');

  const interShell = await page.$('[data-slot="thread-list-sidebar"]');
  const interShellBox = await interShell.boundingBox();
  await page.screenshot({
    path: `${ARTIFACT_DIR}/thread-list-sidebar-interactive-dark.png`,
    clip: { x: interShellBox.x - 20, y: interShellBox.y - 20, width: interShellBox.width + 40, height: interShellBox.height + 40 },
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
