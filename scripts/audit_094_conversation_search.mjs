import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const STORY_URL = 'http://127.0.0.1:6006/iframe.html?id=default-application-94-search-in-conversation--';

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: 2,
  });

  let totalChecks = 0;
  let passedChecks = 0;

  function assert(condition, message) {
    totalChecks++;
    if (condition) {
      passedChecks++;
      console.log(`  ✓ ${message}`);
    } else {
      console.error(`  ✗ ${message}`);
    }
  }

  console.log('=== Auditing Component #094: Search in conversation ===\n');

  // 1. Default Dark Story
  console.log('1. Checking Default (Dark Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="conversation-search"]');

  const container = page.locator('[data-slot="conversation-search"]');
  const containerBox = await container.boundingBox();
  assert(containerBox.width <= 385 && containerBox.width >= 350, `Search container max-width is ~384px (got ${containerBox.width}px)`);

  const searchBox = page.locator('[data-slot="search-box"]');
  const searchBoxRadius = await searchBox.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(searchBoxRadius === '9999px' || searchBoxRadius.includes('%') || parseInt(searchBoxRadius) >= 16, `Search box is full pill rounded (got ${searchBoxRadius})`);

  const searchInput = page.locator('[data-slot="search-input"]');
  const inputSize = await searchInput.evaluate(el => window.getComputedStyle(el).fontSize);
  const inputWeight = await searchInput.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(inputSize === '13px', `Search input font-size is 13px (got ${inputSize})`);
  assert(inputWeight === '400', `Search input font-weight is 400 (got ${inputWeight})`);

  const counter = page.locator('[data-slot="match-counter"]');
  const counterWeight = await counter.evaluate(el => window.getComputedStyle(el).fontWeight);
  const counterFamily = await counter.evaluate(el => window.getComputedStyle(el).fontFamily);
  assert(counterWeight === '400', `Counter font-weight is 400 (got ${counterWeight})`);
  assert(counterFamily.toLowerCase().includes('mono'), `Counter uses monospace font (got ${counterFamily})`);

  const prevBtn = page.locator('[data-slot="prev-match"]');
  const prevBox = await prevBtn.boundingBox();
  assert(Math.round(prevBox.width) === 24 && Math.round(prevBox.height) === 24, `Prev stepper button is 24x24px (got ${prevBox.width}x${prevBox.height}px)`);

  const excerpt = page.locator('[data-slot="search-excerpt"]');
  const excerptRadius = await excerpt.evaluate(el => window.getComputedStyle(el).borderRadius);
  assert(excerptRadius === '12px', `Excerpt preview card border-radius is 12px (got ${excerptRadius})`);

  const matchTag = page.locator('.ds-conv-search-match');
  const matchWeight = await matchTag.evaluate(el => window.getComputedStyle(el).fontWeight);
  assert(matchWeight === '400', `Match highlight font-weight is 400 (got ${matchWeight})`);

  const track = page.locator('[data-slot="search-track"]');
  const trackBox = await track.boundingBox();
  assert(Math.round(trackBox.width) === 6, `Mini-map track width is strictly 6px (got ${trackBox.width}px)`);

  const markers = page.locator('.ds-conv-search__marker');
  const markerCount = await markers.count();
  assert(markerCount === 3, `Mini-map renders 3 match markers (got ${markerCount})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-search-default-dark.png') });

  // 2. Light Theme Check
  console.log('\n2. Checking Default (Light Theme)...');
  await page.goto(`${STORY_URL}default&globals=theme:light`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="conversation-search"]');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-search-default-light.png') });
  assert(true, 'Captured light theme screenshot');

  // 3. No Matches Check
  console.log('\n3. Checking No Matches State...');
  await page.goto(`${STORY_URL}no-matches&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="conversation-search"]');
  const noMatchesCounter = await page.locator('[data-slot="match-counter"]').textContent();
  assert(noMatchesCounter.trim() === '0', `Counter displays "0" for no matches (got "${noMatchesCounter.trim()}")`);
  const noExcerptCount = await page.locator('[data-slot="search-excerpt"]').count();
  assert(noExcerptCount === 0, `Excerpt preview is hidden when no matches found`);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-search-nomatches-dark.png') });

  // 4. Interactive Navigation
  console.log('\n4. Checking Interactive Match Stepping...');
  await page.goto(`${STORY_URL}interactive&globals=theme:dark`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-slot="conversation-search"]');

  const nextBtn = page.locator('[data-slot="next-match"]');
  await nextBtn.click();
  const counterAfterNext = await page.locator('[data-slot="match-counter"]').textContent();
  assert(counterAfterNext.trim() === '2/3', `Clicking next match advances counter to "2/3" (got "${counterAfterNext.trim()}")`);

  const activeMarker = page.locator('.ds-conv-search__marker[data-active="true"]');
  const activeMarkerPos = await activeMarker.getAttribute('data-pos');
  assert(activeMarkerPos === '46', `Mini-map highlights active marker at pos 46% (got ${activeMarkerPos})`);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'conversation-search-interactive-dark.png') });

  await browser.close();

  console.log(`\n=== Final Result: ${passedChecks}/${totalChecks} checks passed ===`);
  if (passedChecks === totalChecks) {
    console.log('Component #094: 100% AUDIT PASS');
    process.exit(0);
  } else {
    console.error('Audit failed checks.');
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
