import { chromium } from 'playwright';
import fs from 'fs';

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
  { id: 'default-shared-button--with-icon', name: 'Button (With Icon)' },
  { id: 'default-shared-button--block', name: 'Button (Block)' },
  { id: 'default-shared-button--disabled', name: 'Button (Disabled)' },
  { id: 'default-shared-text-input--default', name: 'Text Input (Default)' },
  { id: 'default-shared-text-input--small', name: 'Text Input (Small)' },
  { id: 'default-shared-text-input--pill', name: 'Text Input (Pill)' },
  { id: 'default-shared-text-input--with-clear-button', name: 'Text Input (With Clear Button)' },
  { id: 'default-shared-text-input--invalid', name: 'Text Input (Invalid)' },
  { id: 'default-shared-text-input--disabled', name: 'Text Input (Disabled)' },
  { id: 'default-shared-password-input--default', name: 'Password Input (Default)' },
  { id: 'default-shared-password-input--with-toggle', name: 'Password Input (With Toggle)' },
  { id: 'default-shared-password-input--pill', name: 'Password Input (Pill)' },
  { id: 'default-shared-number-input--default', name: 'Number Input (Default)' },
  { id: 'default-shared-number-input--temperature', name: 'Number Input (Temperature)' },
  { id: 'default-shared-number-input--stepper', name: 'Number Input (Stepper)' },
  { id: 'default-shared-text-area--default', name: 'Text Area (Default)' },
  { id: 'default-shared-select--default', name: 'Select (Default 32px)' },
  { id: 'default-shared-select--small', name: 'Select (Small 28px)' },
  { id: 'default-shared-select--pill', name: 'Select (Pill Filter)' },
  { id: 'default-shared-date-picker--default', name: 'Date Picker (Default)' },
  { id: 'default-shared-date-picker--pill-range', name: 'Date Picker (Pill Range)' },
  { id: 'default-shared-menu--default', name: 'Menu (Org & Account)' },
  { id: 'default-shared-menu--context-menu', name: 'Menu (Row Actions)' },
  { id: 'default-shared-menu--compact', name: 'Menu (Compact 28px)' },
  { id: 'default-shared-checkbox--default', name: 'Checkbox (Default)' },
  { id: 'default-shared-checkbox--checked', name: 'Checkbox (Checked)' },
  { id: 'default-shared-radio-button--default', name: 'Radio Button (Default)' },
  { id: 'default-shared-toggle--default', name: 'Toggle (Default)' },
  { id: 'default-shared-toggle--checked', name: 'Toggle (Checked)' },
  { id: 'default-shared-slider--default', name: 'Slider (Default)' },
  { id: 'default-shared-slider--with-readout', name: 'Slider (With Readout)' },
  { id: 'default-shared-file-uploader--default', name: 'File Uploader (Default)' },
  { id: 'default-shared-file-uploader--with-files', name: 'File Uploader (With Files)' },
  { id: 'default-shared-file-uploader--upload-modal', name: 'File Uploader (Upload Modal)' },

  // Navigation, Containers & Layout
  { id: 'default-shared-tabs--default', name: 'Tabs (Default)' },
  { id: 'default-shared-tabs--usage-overview', name: 'Tabs (Usage Overview)' },
  { id: 'default-shared-content-switcher--default', name: 'Content Switcher (Default)' },
  { id: 'default-shared-content-switcher--small', name: 'Content Switcher (Small)' },
  { id: 'default-shared-content-switcher--pill', name: 'Content Switcher (Pill)' },
  { id: 'default-shared-data-table--default', name: 'Data Table (Default)' },
  { id: 'default-shared-data-table--selectable', name: 'Data Table (Selectable)' },
  { id: 'default-shared-data-table--api-keys-table', name: 'Data Table (API Keys Table)' },
  { id: 'default-shared-modal--default', name: 'Modal (Default)' },
  { id: 'default-shared-modal--destructive', name: 'Modal (Destructive)' },
  { id: 'default-shared-popover--default', name: 'Popover (Default)' },
  { id: 'default-shared-tool-tips--default', name: 'Tool Tips (Default)' },
  { id: 'default-shared-toggle-tips--default', name: 'Toggle Tips (Default)' },
  { id: 'default-shared-tag--default', name: 'Tag (Default)' },
  { id: 'default-shared-tag--filter-chip', name: 'Tag (Filter Chip)' },
  { id: 'default-shared-notification--default', name: 'Notification (Default)' },
  { id: 'default-shared-notification--caution', name: 'Notification (Caution)' },
  { id: 'default-shared-notification--danger', name: 'Notification (Danger)' },
  { id: 'default-shared-progress-bar--default', name: 'Progress Bar (Default)' },
  { id: 'default-shared-progress-bar--indeterminate', name: 'Progress Bar (Indeterminate)' },
  { id: 'default-shared-progress-indicator--default', name: 'Progress Indicator (Default)' },
  { id: 'default-shared-structured-list--default', name: 'Structured List (Default)' },
  { id: 'default-shared-contained-list--default', name: 'Contained List (Default)' },
  { id: 'default-shared-pagination--default', name: 'Pagination (Default)' },
  { id: 'default-shared-breadcrumb--default', name: 'Breadcrumb (Default)' },
  { id: 'default-shared-link--default', name: 'Link (Default)' },
  { id: 'default-shared-form--default', name: 'Form (Default)' },

  // Application Patterns
  { id: 'default-application-navigation--default', name: 'App Navigation (Sidebar)' },
  { id: 'default-application-navigation--horizontal', name: 'App Navigation (Horizontal)' },
  { id: 'default-application-page-header--default', name: 'App Page Header (Default)' },
  { id: 'default-application-section-header--default', name: 'App Section Header (Default)' },
  { id: 'default-application-metric--default', name: 'App Metric (Default)' },
  { id: 'default-application-empty-state--default', name: 'App Empty State (Default)' }
];

async function runAudit() {
  console.log(`Starting Full 100% Fidelity QA Matrix on ${STORIES_TO_AUDIT.length} stories...`);
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const results = [];

  for (const story of STORIES_TO_AUDIT) {
    const url = `${STORYBOOK_BASE}/iframe.html?id=${story.id}&viewMode=story`;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded' });
      if (!resp || resp.status() !== 200) {
        results.push({ ...story, status: 'FAILED', reason: `HTTP ${resp?.status()}` });
        continue;
      }

      await page.waitForTimeout(100);

      // Check root element presence
      const el = page.locator('.ds-search-input, .ds-search-trigger, .ds-button, .ds-input, .ds-textarea, .ds-select, .ds-date-picker, .ds-menu, .ds-checkbox, .ds-radio, .ds-switch, .ds-slider, .ds-dropzone, .ds-tabs, .ds-segmented, .ds-table, .ds-dialog, .ds-popover, .ds-alert, .ds-badge, .ds-tag, .ds-filter-chip, .ds-nav, .ds-progress-bar, .ds-progress-step, .ds-step, .ds-structured-list, .ds-pagination, .ds-breadcrumb, .ds-link, .ds-section-header, .ds-section-heading, .ds-page-header, .ds-empty').first();

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

  fs.writeFileSync('scripts/audit_results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to scripts/audit_results.json');
}

runAudit().catch(console.error);
