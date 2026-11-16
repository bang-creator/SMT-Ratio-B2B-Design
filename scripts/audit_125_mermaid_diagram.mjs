import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORYBOOK_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('🚀 Starting Audit #125: Mermaid diagram AUI...');

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
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-125-mermaid-diagram-aui--default&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="mermaid-card"]');

  const cardStyles = await page.$eval('[data-slot="mermaid-card"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      maxWidth: cs.maxWidth,
      borderRadius: cs.borderRadius,
      borderTopWidth: cs.borderTopWidth,
    };
  });

  assert(cardStyles.maxWidth === '600px', `Card max-width is 600px (got ${cardStyles.maxWidth})`);
  assert(parseInt(cardStyles.borderRadius, 10) >= 12, `Card border-radius is >= 12px (got ${cardStyles.borderRadius})`);
  assert(cardStyles.borderTopWidth === '1px', `Card border is 1px (got ${cardStyles.borderTopWidth})`);

  // Label typography (Strict 400 Rule)
  const labelStyles = await page.$eval('[data-slot="mermaid-label"]', (el) => {
    const cs = window.getComputedStyle(el);
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily,
      text: el.textContent.trim(),
    };
  });
  assert(labelStyles.text === 'mermaid', `Header label displays "mermaid" (got ${labelStyles.text})`);
  assert(labelStyles.fontSize === '12px', `Header label font-size is 12px (got ${labelStyles.fontSize})`);
  assert(labelStyles.fontWeight === '400', `Header label font-weight is 400 (strict 400 rule) (got ${labelStyles.fontWeight})`);

  // Canvas inspection
  const hasCanvas = await page.$('[data-slot="mermaid-canvas"]');
  assert(Boolean(hasCanvas), 'Diagram canvas container is rendered');

  // Screenshot Dark
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'mermaid-diagram-default-dark.png'),
    fullPage: true,
  });

  // --- Story 1: Default (Light) ---
  console.log('\n--- Auditing Default Story (Light) ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-125-mermaid-diagram-aui--default&viewMode=story&globals=theme:light`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="mermaid-card"]');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'mermaid-diagram-default-light.png'),
    fullPage: true,
  });

  // --- Story 2: Streaming ---
  console.log('\n--- Auditing Streaming Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-125-mermaid-diagram-aui--streaming&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="mermaid-skeleton"]');
  const hasSkeleton = await page.$('[data-slot="mermaid-skeleton"]');
  assert(Boolean(hasSkeleton), 'Streaming skeleton placeholder is rendered');

  // Screenshot Streaming
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'mermaid-diagram-streaming-dark.png'),
    fullPage: true,
  });

  // --- Story 3: Partial ---
  console.log('\n--- Auditing Partial Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-125-mermaid-diagram-aui--partial&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-slot="partial-notice"]');
  const noticeText = await page.$eval('[data-slot="partial-notice"]', el => el.textContent.trim());
  assert(noticeText.includes('incomplete syntax') || noticeText.includes('parsing in progress'), 'Incomplete syntax notice is displayed');

  // --- Story 4: Interactive Lightbox ---
  console.log('\n--- Auditing Interactive Story ---');
  await page.goto(`${STORYBOOK_URL}/iframe.html?id=default-application-125-mermaid-diagram-aui--interactive&viewMode=story&globals=theme:dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-action="open-lightbox"]');

  // Initially hidden
  const isInitiallyHidden = await page.$eval('[data-slot="mermaid-lightbox"]', el => el.classList.contains('is-hidden'));
  assert(isInitiallyHidden === true, 'Lightbox is initially hidden');

  // Click expand
  await page.click('[data-action="open-lightbox"]');
  await page.waitForTimeout(100);

  const isVisibleAfterClick = await page.$eval('[data-slot="mermaid-lightbox"]', el => !el.classList.contains('is-hidden'));
  assert(isVisibleAfterClick === true, 'Lightbox is visible after clicking expand');

  // Click close
  await page.click('[data-action="close-lightbox"]');
  await page.waitForTimeout(100);

  const isHiddenAfterClose = await page.$eval('[data-slot="mermaid-lightbox"]', el => el.classList.contains('is-hidden'));
  assert(isHiddenAfterClose === true, 'Lightbox is hidden after clicking close button');

  // Screenshot Interactive
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'mermaid-diagram-interactive-dark.png'),
    fullPage: true,
  });

  await browser.close();

  console.log('\n========================================');
  console.log(`Audit Complete: ${passCount}/${totalTests} tests passed (${Math.round((passCount / totalTests) * 100)}%)`);
  console.log('========================================\n');

  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
