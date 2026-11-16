import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #110: MCP config dialog AUI...');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
  });

  const page = await context.newPage();
  let passCount = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- Story 1: Default (Dark & Light) ---
  console.log('\n--- Auditing Default Story (Dark) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--default&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  const card = await page.$('[data-slot="mcp-config"]');
  const cardStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      padding: cs.padding,
    };
  }, card);

  assert(cardStyles.maxWidth === '440px', `Dialog max-width is 440px (got ${cardStyles.maxWidth})`);
  assert(cardStyles.borderRadius === '20px', `Dialog border radius is 20px (got ${cardStyles.borderRadius})`);

  // Title typography
  const titleStyles = await page.$eval('.ds-mcp-config-title', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(titleStyles.fontSize === '15px', `Title font-size is 15px (got ${titleStyles.fontSize})`);
  assert(titleStyles.fontWeight === '500', `Title font-weight is 500 (got ${titleStyles.fontWeight})`);

  // Add server button
  const addBtn = await page.$('[data-action="add-server"]');
  assert(addBtn !== null, 'Add server button present');

  // Server rows
  const serverRows = await page.$$('.ds-mcp-server-item');
  assert(serverRows.length === 4, `Rendered 4 server rows (got ${serverRows.length})`);

  // Inspect row typography (strict 400 rule)
  const nameStyles = await page.$eval('.ds-mcp-server-name', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  });
  assert(nameStyles.fontSize === '14px', `Server name font-size is 14px (got ${nameStyles.fontSize})`);
  assert(nameStyles.fontWeight === '400', `Server name font-weight is 400 (got ${nameStyles.fontWeight})`);

  // Check default expanded server (github)
  const githubExp = await page.$eval('[data-server-id="github"] [data-action="toggle-server"]', (el) => el.getAttribute('aria-expanded'));
  assert(githubExp === 'true', 'GitHub server expanded by default');

  const toolChips = await page.$$('[data-server-id="github"] .ds-mcp-server-panel__tool-chip');
  assert(toolChips.length === 4, `GitHub has 4 tool chips rendered (got ${toolChips.length})`);

  // Summary footer
  const summaryText = await page.$eval('[data-slot="config-summary"]', (el) => el.textContent.trim());
  assert(summaryText === '2 of 4 connected', `Summary shows connected count (got "${summaryText}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mcp-config-default-dark.png') });

  // Light mode
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--default&viewMode=story&globals=theme:light`);
  await page.waitForSelector('[data-slot="mcp-config"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mcp-config-default-light.png') });

  // --- Story 2: NeedsAuth ---
  console.log('\n--- Auditing NeedsAuth Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--needs-auth&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  const authBtn = await page.$('[data-action="authorize-server"]');
  assert(authBtn !== null, 'Authorize button present for needs-auth server');

  const authDot = await page.$eval('[data-server-id="slack"] .ds-status-dot', (el) => el.className);
  assert(authDot.includes('ds-status-dot--needs-auth'), `Slack has needs-auth status dot (got ${authDot})`);

  // --- Story 3: Connecting ---
  console.log('\n--- Auditing Connecting Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--connecting&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  const connDot = await page.$eval('[data-server-id="docker"] .ds-status-dot', (el) => el.className);
  assert(connDot.includes('ds-status-dot--connecting'), `Docker has connecting status dot (got ${connDot})`);

  // --- Story 4: Failed ---
  console.log('\n--- Auditing Failed Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--failed&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  const failedDot = await page.$eval('[data-server-id="postgres"] .ds-status-dot', (el) => el.className);
  assert(failedDot.includes('ds-status-dot--failed'), `Postgres has failed status dot (got ${failedDot})`);

  // --- Story 5: Empty ---
  console.log('\n--- Auditing Empty Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--empty&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  const emptyState = await page.$('[data-slot="empty-state"]');
  assert(emptyState !== null, 'Empty state notice displayed when no servers registered');

  // --- Story 6: Interactive ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-110-mcp-config-dialog-aui--interactive&viewMode=story&globals=theme:dark`);
  await page.waitForSelector('[data-slot="mcp-config"]');

  // Click row to toggle collapse on slack
  const slackToggle = await page.$('[data-server-id="slack"] [data-action="toggle-server"]');
  let isSlackExp = await slackToggle.getAttribute('aria-expanded');
  assert(isSlackExp === 'true', 'Slack starts expanded');

  await slackToggle.click();
  await page.waitForTimeout(150);

  isSlackExp = await slackToggle.getAttribute('aria-expanded');
  assert(isSlackExp === 'false', 'Click collapsed Slack row (aria-expanded=false)');

  // Re-open Slack
  await slackToggle.click();
  await page.waitForTimeout(150);

  // Click Authorize button
  const slackAuthBtn = await page.$('[data-server-id="slack"] [data-action="authorize-server"]');
  await slackAuthBtn.click();
  await page.waitForTimeout(150);

  const newAuthText = await slackAuthBtn.textContent();
  assert(newAuthText.includes('Authorized'), `Authorize button text updated to Authorized (got "${newAuthText}")`);

  const updatedDot = await page.$eval('[data-server-id="slack"] .ds-status-dot', (el) => el.className);
  assert(updatedDot.includes('ds-status-dot--connected'), 'Status dot updated to connected after authorization');

  const updatedSummary = await page.$eval('[data-slot="config-summary"]', (el) => el.textContent.trim());
  assert(updatedSummary === '3 of 4 connected', `Footer summary updated to 3 of 4 connected (got "${updatedSummary}")`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mcp-config-interactive-dark.png') });

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  await browser.close();

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
