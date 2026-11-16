import { chromium } from 'playwright';

const storyId = process.argv[2] || 'default-application-53-comparison-card--default';
const selector = process.argv[3] || '.ds-comparison-card';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:6006/iframe.html?id=${storyId}`, { waitUntil: 'networkidle' });
  
  const el = await page.$(selector);
  if (!el) {
    console.error(`Element not found for selector: ${selector}`);
    await browser.close();
    process.exit(1);
  }
  
  console.log(`Element found: ${selector}`);
  
  // If story 53: test clicking options
  if (storyId.includes('53-comparison-card')) {
    const options = await page.$$('.ds-comparison-card__option');
    console.log(`Found ${options.length} options`);
    if (options.length >= 2) {
      await options[1].click();
      await page.waitForTimeout(150);
      const pick = await page.$('.ds-comparison-card__option--pick');
      const pickId = await pick?.getAttribute('data-option-id');
      console.log(`Switched pick to: ${pickId}`);
      
      // Click again to clear
      await pick.click();
      await page.waitForTimeout(150);
      const cleared = await page.$('.ds-comparison-card__option--pick');
      console.log(`Cleared pick: ${cleared === null}`);
    }
  }

  await browser.close();
  console.log(`Story ${storyId} verified successfully!`);
})();
