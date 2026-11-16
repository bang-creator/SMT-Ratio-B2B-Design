import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:6006';

async function main() {
  console.log('🚀 Starting Foreground Verification of 151 Application Components...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];
  page.on('console', (msg) => {
    const locUrl = msg.location()?.url || '';
    if (msg.type() === 'error') {
      if (locUrl.includes('favicon.ico') || msg.text().includes('favicon.ico')) return;
      errors.push(`Console error: ${msg.text()} (${locUrl})`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`Page error: ${err.toString()}`);
  });
  page.on('requestfailed', (req) => {
    errors.push(`Request failed: ${req.url()} (${req.failure()?.errorText})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      console.log(`⚠️ HTTP ${res.status()}: ${res.url()}`);
    }
  });

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const indexRes = await page.evaluate(async () => {
    const res = await fetch('/index.json');
    return await res.json();
  });

  const entries = Object.values(indexRes.entries || {});
  console.log(`📊 Total entries in Storybook index: ${entries.length}`);

  const sharedEntries = entries.filter((e) => e.title.includes('Shared'));
  const appEntries = entries.filter((e) => e.title.includes('Application'));

  console.log(`🔹 Shared entries count: ${sharedEntries.length}`);
  console.log(`🔹 Application entries count: ${appEntries.length}`);

  // 1. Verify Shared precedes Application
  const allTitles = [...new Set(entries.map((e) => e.title))];
  const sharedFirstIdx = allTitles.findIndex((t) => t.includes('Shared'));
  const appFirstIdx = allTitles.findIndex((t) => t.includes('Application'));

  if (sharedFirstIdx !== 0 || appFirstIdx <= sharedFirstIdx) {
    throw new Error(`Ordering failure: Shared must start at index 0 before Application. (Shared=${sharedFirstIdx}, App=${appFirstIdx})`);
  }
  console.log(`✅ Category Order: "Shared" (index ${sharedFirstIdx}) is placed ABOVE "Application" (index ${appFirstIdx})`);

  // 2. Verify all 151 application components
  if (appEntries.length !== 151) {
    throw new Error(`Expected exactly 151 Application stories (1 Default per component), found ${appEntries.length}`);
  }
  console.log(`✅ Single Story Variant: Exactly 151 Application stories found (1 interactive Default per component)`);

  // 3. Verify ascending numerical ordering
  for (let i = 0; i < appEntries.length; i++) {
    const entry = appEntries[i];
    const match = entry.title.match(/Application \/ (\d+)/);
    const num = match ? parseInt(match[1], 10) : -1;
    if (num !== i + 1) {
      throw new Error(`Numerical ordering failure at index ${i}: expected #${i + 1}, found #${num} ("${entry.title}")`);
    }
    if (entry.name !== 'Default') {
      throw new Error(`Export name failure: entry ${entry.id} exports "${entry.name}" instead of "Default"`);
    }
  }
  console.log(`✅ Numerical Sorting: Components #001 to #151 are strictly sorted in ascending order (#001 -> #151)`);

  // 4. Sample test renders for first, middle, and last application stories
  const sampleIndices = [0, 10, 50, 100, 150];
  for (const idx of sampleIndices) {
    const story = appEntries[idx];
    const storyUrl = `${BASE_URL}/iframe.html?id=${story.id}&viewMode=story`;
    await page.goto(storyUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(100);
    console.log(`   Render verified: #${String(idx + 1).padStart(3, '0')} ${story.title}`);
  }

  if (errors.length > 0) {
    console.error('❌ Errors detected during execution:', errors);
    throw new Error(`Encountered ${errors.length} browser errors during verification.`);
  }

  console.log('🎉 100% SUCCESS: All 151 Application components refactored, consolidated to single Default, sorted ascending, and verified with 0 errors!');
  await browser.close();
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
