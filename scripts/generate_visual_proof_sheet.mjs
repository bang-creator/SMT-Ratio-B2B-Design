import { chromium } from 'playwright';
import fs from 'fs';
import { PNG } from 'pngjs';

async function generateProof() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const targets = [
    { id: 'default-shared-search-input--pill', sel: '.ds-search-input', out: 'proof_search_pill.png' },
    { id: 'default-shared-search-input--default', sel: '.ds-search-input', out: 'proof_search_default.png' },
    { id: 'default-shared-button--default', sel: '.ds-row', out: 'proof_button_row.png' },
    { id: 'default-shared-data-table--api-keys-table', sel: '.ds-table-wrap', out: 'proof_api_keys_table.png' },
    { id: 'default-shared-content-switcher--default', sel: '.ds-segmented', out: 'proof_content_switcher.png' }
  ];

  for (const t of targets) {
    await page.goto(`http://127.0.0.1:6006/iframe.html?id=${t.id}&viewMode=story`);
    await page.waitForSelector(t.sel);
    const el = page.locator(t.sel).first();
    const savePath = `/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1/${t.out}`;
    await el.screenshot({ path: savePath });
    console.log(`Captured ${t.out}`);
  }

  await browser.close();
  console.log('All visual proof captures saved.');
}

generateProof().catch(console.error);
