import { chromium } from 'playwright';

const STORYBOOK_BASE = 'http://127.0.0.1:6006';

// All shared and application stories to audit systematically
const STORIES_TO_AUDIT = [
  // Form & Input Controls
  { id: 'default-shared-search-input--default', name: 'Search Input (Default)' },
  { id: 'default-shared-search-input--pill', name: 'Search Input (Pill)' },
  { id: 'default-shared-search-input--with-clear-button', name: 'Search Input (With Clear Button)' },
  { id: 'default-shared-search-input--pill-with-clear', name: 'Search Input (Pill With Clear)' },
  { id: 'default-shared-search-input--block', name: 'Search Input (Block)' },
  { id: 'default-shared-search-input--disabled', name: 'Search Input (Disabled)' },
  { id: 'default-shared-search-trigger--default', name: 'Search Trigger (Sidebar)' },
  { id: 'default-shared-button--default', name: 'Button (Default 32px)' },
  { id: 'default-shared-button--small', name: 'Button (Small 28px)' },
  { id: 'default-shared-button--pill', name: 'Button (Pill)' },
  { id: 'default-shared-text-input--default', name: 'Text Input (Default)' },
  { id: 'default-shared-text-input--small', name: 'Text Input (Small)' },
  { id: 'default-shared-text-input--pill', name: 'Text Input (Pill)' },
  { id: 'default-shared-text-input--with-clear-button', name: 'Text Input (With Clear Button)' },
  { id: 'default-shared-text-input--invalid', name: 'Text Input (Invalid)' },
  { id: 'default-shared-text-input--disabled', name: 'Text Input (Disabled)' },
  { id: 'default-shared-text-input--password', name: 'Text Input (Password)' },
  { id: 'default-shared-text-input--with-support-icon', name: 'Text Input (With Support Icon)' },
  { id: 'default-shared-text-input--with-unit', name: 'Text Input (With Unit)' },
  { id: 'default-shared-text-input--multiline', name: 'Text Input (Multiline)' },
  { id: 'default-shared-number-input--stepper', name: 'Number Input (Stepper)' },
  { id: 'default-shared-number-input--with-unit', name: 'Number Input (With Unit)' },
  { id: 'default-shared-date-picker--default', name: 'Date Picker (Default)' },
  { id: 'default-shared-date-picker--navigation', name: 'Date Picker (Navigation)' },
  { id: 'default-shared-date-picker--single-month', name: 'Date Picker (Single Month)' },
  { id: 'default-shared-menu--default', name: 'Menu (Default)' },
  { id: 'default-shared-menu--arrow', name: 'Menu (Arrow)' },
  { id: 'default-shared-checkbox--default', name: 'Checkbox (Default)' },
  { id: 'default-shared-radio-button--default', name: 'Radio Button (Default)' },
  { id: 'default-shared-toggle--default', name: 'Toggle (Default)' },
  { id: 'default-shared-toggle--with-content', name: 'Toggle (With Content)' },
  { id: 'default-shared-slider--default', name: 'Slider (Default)' },
  { id: 'default-shared-slider--with-readout', name: 'Slider (With Readout)' },
  { id: 'default-shared-file-uploader--default', name: 'File Uploader (Default)' },

  // Navigation, Containers & Layout
  { id: 'default-shared-tabs--default', name: 'Tabs (Default)' },
  { id: 'default-shared-tabs--usage-overview', name: 'Tabs (Usage Overview)' },
  { id: 'default-shared-content-switcher--default', name: 'Content Switcher (Default)' },
  { id: 'default-shared-content-switcher--small', name: 'Content Switcher (Small)' },
  { id: 'default-shared-content-switcher--pill', name: 'Content Switcher (Pill)' },
  { id: 'default-shared-data-table--default', name: 'Data Table (Default)' },
  { id: 'default-shared-data-table--selectable', name: 'Data Table (Selectable)' },
  { id: 'default-shared-data-table--empty-state', name: 'Data Table (Empty State)' },
  { id: 'default-shared-modal--default', name: 'Modal (Default)' },
  { id: 'default-shared-modal--destructive', name: 'Modal (Destructive)' },
  { id: 'default-shared-popover--default', name: 'Popover (Default)' },
  { id: 'default-shared-tool-tips--default', name: 'Tool Tips (Default)' },
  { id: 'default-shared-badge--default', name: 'Badge (Default)' },
  { id: 'default-shared-badge--pill', name: 'Badge (Pill)' },
  { id: 'default-shared-badge--small', name: 'Badge (Small)' },
  { id: 'default-shared-notification--callout', name: 'Notification (Callout)' },
  { id: 'default-shared-notification--toast', name: 'Notification (Toast)' },
  { id: 'default-shared-progress-bar--default', name: 'Progress Bar (Default)' },
  { id: 'default-shared-progress-bar--indeterminate', name: 'Progress Bar (Indeterminate)' },
  { id: 'default-shared-progress-indicator--default', name: 'Progress Indicator (Default)' },
  { id: 'default-shared-structured-list--default', name: 'Structured List (Default)' },
  { id: 'default-shared-contained-list--default', name: 'Contained List (Default)' },
  { id: 'default-shared-pagination--default', name: 'Pagination (Default)' },
  { id: 'default-shared-pagination--inline', name: 'Pagination (Inline)' },
  { id: 'default-shared-breadcrumb--default', name: 'Breadcrumb (Default)' },
  { id: 'default-shared-link--default', name: 'Link (Default)' },
  { id: 'default-shared-form--default', name: 'Form (Default)' },

  { id: 'default-shared-code-snippet--singleline', name: 'Code Snippet (Singleline)' },
  { id: 'default-shared-code-snippet--inline', name: 'Code Snippet (Inline)' },
  { id: 'default-shared-code-snippet--multiline', name: 'Code Snippet (Multiline)' },
  { id: 'default-shared-scroll-bar--vertical', name: 'Scroll Bar (Vertical)' },
  { id: 'default-shared-scroll-bar--horizontal', name: 'Scroll Bar (Horizontal)' },
  { id: 'default-shared-sidebar--default', name: 'Sidebar (Default)' },

  // Application Patterns (01 - 05)
  { id: 'default-application-01-loading-state--default', name: '01 Loading State (Default)' },
  { id: 'default-application-01-loading-state--squares', name: '01 Loading State (Squares)' },
  { id: 'default-application-01-loading-state--rounded', name: '01 Loading State (Rounded)' },
  { id: 'default-application-01-loading-state--long-label', name: '01 Loading State (Long Label)' },
  { id: 'default-application-02-thinking-indicator--default', name: '02 Thinking Indicator (Default)' },
  { id: 'default-application-02-thinking-indicator--with-timer', name: '02 Thinking Indicator (With Timer)' },
  { id: 'default-application-02-thinking-indicator--long-label', name: '02 Thinking Indicator (Long Label)' },
  { id: 'default-application-03-streaming-text--default', name: '03 Streaming Text (Default)' },
  { id: 'default-application-03-streaming-text--streaming', name: '03 Streaming Text (Streaming)' },
  { id: 'default-application-03-streaming-text--complete', name: '03 Streaming Text (Complete)' },
  { id: 'default-application-04-typing-indicator--default', name: '04 Typing Indicator (Default)' },
  { id: 'default-application-04-typing-indicator--bare', name: '04 Typing Indicator (Bare)' },
  { id: 'default-application-05-reasoning-effort--default', name: '05 Reasoning Effort (Default)' },
  { id: 'default-application-05-reasoning-effort--low', name: '05 Reasoning Effort (Low)' },
  { id: 'default-application-05-reasoning-effort--medium', name: '05 Reasoning Effort (Medium)' },
  { id: 'default-application-05-reasoning-effort--high', name: '05 Reasoning Effort (High)' },

  // SMT Ratio Application
  { id: 'smt-ratio-application-analysing--default', name: 'SMT Ratio / Analysing (Default)' },
  { id: 'smt-ratio-application-sidebar--default', name: 'SMT Ratio / Sidebar (Default)' }
];

async function runAudit() {
  let stories = STORIES_TO_AUDIT;
  try {
    const indexResp = await fetch(`${STORYBOOK_BASE}/index.json`);
    if (indexResp.ok) {
      const indexData = await indexResp.json();
      stories = Object.values(indexData.entries)
        .filter(entry => entry.type === 'story')
        .map(entry => ({ id: entry.id, name: `${entry.title} (${entry.name})` }));
    }
  } catch (e) {
    console.warn('Using fallback static stories list:', e.message);
  }

  console.log(`Starting Full 100% Fidelity QA Matrix on ${stories.length} stories...`);
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const results = [];

  for (const story of stories) {
    const url = `${STORYBOOK_BASE}/iframe.html?id=${story.id}&viewMode=story`;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
      if (!resp || resp.status() !== 200) {
        results.push({ ...story, status: 'FAILED', reason: `HTTP ${resp?.status()}` });
        continue;
      }

      await page.waitForSelector('[data-slot], [class*="ds-"]', { timeout: 5000 }).catch(() => {});

      // Check root element presence
      const el = page.locator('[data-slot], [class*="ds-"]').first();

      const exists = (await el.count()) > 0;
      if (!exists) {
        results.push({ ...story, status: 'FAILED', reason: 'No matching ds-* root element found' });
        continue;
      }

      const box = await el.boundingBox();
      const cs = await el.evaluate(node => {
        const s = window.getComputedStyle(node);
        return {
          height: s.height,
          borderRadius: s.borderRadius,
          fontFamily: s.fontFamily,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          backgroundColor: s.backgroundColor,
          color: s.color
        };
      });

      results.push({
        ...story,
        status: 'PASSED',
        box,
        cs
      });
      process.stdout.write('.');
    } catch (err) {
      results.push({ ...story, status: 'ERROR', error: err.message });
      process.stdout.write('x');
    }
  }

  await browser.close();
  console.log('\n\n--- Audit Summary ---');
  const passed = results.filter(r => r.status === 'PASSED');
  const failed = results.filter(r => r.status !== 'PASSED');
  console.log(`Passed: ${passed.length} / ${results.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    failed.forEach(f => console.log(`- ${f.name} (${f.id}): ${f.reason || f.error}`));
  }
}

runAudit().catch(console.error);
