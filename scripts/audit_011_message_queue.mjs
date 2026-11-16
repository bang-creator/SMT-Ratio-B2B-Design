import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 011 MESSAGE QUEUE ---');
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const results = {
    checks: [],
    measurements: {},
    passed: 0,
    total: 0,
  };

  function assert(name, condition, details) {
    results.total++;
    if (condition) {
      results.passed++;
      results.checks.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}: ${details}`);
    } else {
      results.checks.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name}: ${details}`);
    }
  }

  try {
    // 1. Dark Mode: Default Story
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-11-message-queue--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-queue-target [data-slot="message-queue"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/message-queue-default-dark.png` });

    const queueData = await pageDark.locator('.ds-queue-target [data-slot="message-queue"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const runningCard = el.querySelector('.ds-message-queue__running-card');
      const cardS = runningCard ? window.getComputedStyle(runningCard) : {};
      const dot = el.querySelector('.ds-message-queue__beacon-dot');
      const dotS = dot ? window.getComputedStyle(dot) : {};
      const dotRect = dot ? dot.getBoundingClientRect() : {};
      const ping = el.querySelector('.ds-message-queue__beacon-ping');
      const pingS = ping ? window.getComputedStyle(ping) : {};
      const runningTitle = el.querySelector('.ds-message-queue__running-title');
      const titleS = runningTitle ? window.getComputedStyle(runningTitle) : {};
      const runningBadge = el.querySelector('.ds-message-queue__running-card .ds-message-queue__badge');
      const badgeS = runningBadge ? window.getComputedStyle(runningBadge) : {};

      const header = el.querySelector('.ds-message-queue__header');
      const headerS = header ? window.getComputedStyle(header) : {};
      const headerBadges = header ? Array.from(header.querySelectorAll('.ds-message-queue__badge')).map((b) => b.textContent.trim()) : [];

      const items = Array.from(el.querySelectorAll('.ds-message-queue__item'));
      const firstItem = items[0];
      const itemS = firstItem ? window.getComputedStyle(firstItem) : {};
      const firstIndex = firstItem ? firstItem.querySelector('.ds-message-queue__item-index') : null;
      const indexS = firstIndex ? window.getComputedStyle(firstIndex) : {};
      const firstText = firstItem ? firstItem.querySelector('.ds-message-queue__item-text') : null;
      const textS = firstText ? window.getComputedStyle(firstText) : {};
      const firstCancel = firstItem ? firstItem.querySelector('.ds-queue-btn-cancel') : null;
      const cancelS = firstCancel ? window.getComputedStyle(firstCancel) : {};
      const cancelRect = firstCancel ? firstCancel.getBoundingClientRect() : {};
      const cancelSvg = firstCancel ? firstCancel.querySelector('svg') : null;
      const cancelSvgRect = cancelSvg ? cancelSvg.getBoundingClientRect() : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        cardRadius: cardS.borderRadius,
        cardPadding: cardS.padding,
        dotWidth: Math.round(dotRect.width),
        dotHeight: Math.round(dotRect.height),
        dotRadius: dotS.borderRadius,
        pingAnim: pingS.animationName,
        titleFontSize: titleS.fontSize,
        titleFontWeight: titleS.fontWeight,
        titleOverflow: titleS.textOverflow,
        badgeFontSize: badgeS.fontSize,
        badgeFontWeight: badgeS.fontWeight,
        badgeFontFamily: badgeS.fontFamily,
        headerPaddingLeft: headerS.paddingLeft,
        headerPaddingRight: headerS.paddingRight,
        headerBadges,
        itemsCount: items.length,
        itemRadius: itemS.borderRadius,
        itemPadding: itemS.padding,
        indexFontSize: indexS.fontSize,
        indexFontWeight: indexS.fontWeight,
        indexFontFamily: indexS.fontFamily,
        itemTextFontSize: textS.fontSize,
        itemTextFontWeight: textS.fontWeight,
        cancelBtnWidth: Math.round(cancelRect.width),
        cancelBtnHeight: Math.round(cancelRect.height),
        cancelRadius: cancelS.borderRadius,
        cancelSvgWidth: Math.round(cancelSvgRect.width),
        cancelSvgHeight: Math.round(cancelSvgRect.height),
      };
    });

    results.measurements.defaultDark = queueData;
    assert('Data Slot Attribute', queueData.slot === 'message-queue', `data-slot: ${queueData.slot}`);
    assert('Container Max Width (384px)', queueData.maxWidth === '384px', `max-width: ${queueData.maxWidth}`);
    assert('Running Card Radius (16px)', queueData.cardRadius === '16px', `radius: ${queueData.cardRadius}`);
    assert('Running Card Padding (12px)', queueData.cardPadding === '12px', `padding: ${queueData.cardPadding}`);
    assert('Beacon Dot Dimensions (8x8px)', queueData.dotWidth === 8 && queueData.dotHeight === 8, `Dot: ${queueData.dotWidth}x${queueData.dotHeight}px`);
    assert('Beacon Ping Animation', queueData.pingAnim.includes('ds-ping'), `Anim: ${queueData.pingAnim}`);
    assert('Running Title Strict 400 Rule', queueData.titleFontSize === '13.5px' && queueData.titleFontWeight === '400', `Title: ${queueData.titleFontSize} / ${queueData.titleFontWeight}`);
    assert('Running Title Truncates Cleanly', queueData.titleOverflow === 'ellipsis', `text-overflow: ${queueData.titleOverflow}`);
    assert('Running Badge 11px Mono 400', queueData.badgeFontSize === '11px' && queueData.badgeFontWeight === '400' && queueData.badgeFontFamily.includes('mono'), `Badge: ${queueData.badgeFontSize} / ${queueData.badgeFontWeight} / ${queueData.badgeFontFamily}`);
    assert('Queue Header Badges', queueData.headerBadges[0] === '2 queued' && queueData.headerBadges[1] === 'sends when this finishes', `Badges: ${JSON.stringify(queueData.headerBadges)}`);
    assert('Initial Queued Count', queueData.itemsCount === 2, `Count: ${queueData.itemsCount}`);
    assert('Queued Item Radius (16px)', queueData.itemRadius === '16px', `radius: ${queueData.itemRadius}`);
    assert('Queued Item Padding (8px 8px 8px 12px)', queueData.itemPadding === '8px 8px 8px 12px', `padding: ${queueData.itemPadding}`);
    assert('Queued Index Strict 400 Mono', queueData.indexFontSize === '11px' && queueData.indexFontWeight === '400' && queueData.indexFontFamily.includes('mono'), `Index: ${queueData.indexFontSize} / ${queueData.indexFontWeight}`);
    assert('Queued Item Text Strict 400 Rule', queueData.itemTextFontSize === '13.5px' && queueData.itemTextFontWeight === '400', `Text: ${queueData.itemTextFontSize} / ${queueData.itemTextFontWeight}`);
    assert('Cancel Button 24x24px Pill', queueData.cancelBtnWidth === 24 && queueData.cancelBtnHeight === 24 && (queueData.cancelRadius === '9999px' || queueData.cancelRadius === '50%'), `Btn: ${queueData.cancelBtnWidth}x${queueData.cancelBtnHeight}px, radius: ${queueData.cancelRadius}`);
    assert('Cancel SVG Dimensions (14x14px)', queueData.cancelSvgWidth === 14 && queueData.cancelSvgHeight === 14, `SVG: ${queueData.cancelSvgWidth}x${queueData.cancelSvgHeight}px`);

    // 2. Interactive Cancel Testing
    console.log('\n[2/6] Testing Interactive Queue Item Cancellation...');
    // Click cancel on first item
    await pageDark.click('.ds-queue-target .ds-queue-btn-cancel');
    await pageDark.waitForTimeout(100);

    const step1Data = await pageDark.locator('.ds-queue-target [data-slot="message-queue"]').evaluate((el) => {
      const items = Array.from(el.querySelectorAll('.ds-message-queue__item'));
      const headerBadge = el.querySelector('.ds-message-queue__header .ds-message-queue__badge');
      const remainingText = items[0]?.querySelector('.ds-message-queue__item-text')?.textContent?.trim();
      const remainingIndex = items[0]?.querySelector('.ds-message-queue__item-index')?.textContent?.trim();
      return {
        count: items.length,
        headerBadge: headerBadge?.textContent?.trim(),
        remainingText,
        remainingIndex,
      };
    });
    assert('Cancel Item 1 Updates Header to "1 queued"', step1Data.count === 1 && step1Data.headerBadge === '1 queued', `Count: ${step1Data.count}, Badge: ${step1Data.headerBadge}`);
    assert('Remaining Item Re-indexed to 1', step1Data.remainingIndex === '1' && step1Data.remainingText === 'Then run the full suite', `Index: ${step1Data.remainingIndex}, Text: ${step1Data.remainingText}`);

    // Click cancel on second item
    await pageDark.click('.ds-queue-target .ds-queue-btn-cancel');
    await pageDark.waitForTimeout(100);

    const step2Data = await pageDark.locator('.ds-queue-target [data-slot="message-queue"]').evaluate((el) => {
      const items = el.querySelectorAll('.ds-message-queue__item');
      const header = el.querySelector('.ds-message-queue__header');
      const runningCard = el.querySelector('.ds-message-queue__running-card');
      return {
        count: items.length,
        hasHeader: !!header,
        hasRunningCard: !!runningCard,
      };
    });
    assert('Cancel Item 2 Empties Queue & Removes Header', step2Data.count === 0 && !step2Data.hasHeader && step2Data.hasRunningCard, `Count: ${step2Data.count}, Header present: ${step2Data.hasHeader}, Running intact: ${step2Data.hasRunningCard}`);

    // 3. Light Mode: Default Story
    console.log('\n[3/6] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-11-message-queue--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-queue-target [data-slot="message-queue"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/message-queue-default-light.png` });

    // 4. Nothing Queued Story
    console.log('\n[4/6] Auditing Nothing Queued Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-11-message-queue--nothing-queued&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="message-queue"]');
    const stageNothing = await pageDark.locator('.ds-story-stage').first();
    await stageNothing.screenshot({ path: `${ARTIFACT_DIR}/message-queue-nothing-queued-dark.png` });

    const nothingData = await pageDark.locator('[data-slot="message-queue"]').evaluate((el) => ({
      items: el.querySelectorAll('.ds-message-queue__item').length,
      header: !!el.querySelector('.ds-message-queue__header'),
      running: !!el.querySelector('.ds-message-queue__running-card'),
    }));
    assert('Nothing Queued Shows Running Card & No List', nothingData.items === 0 && !nothingData.header && nothingData.running, `Items: ${nothingData.items}, Header: ${nothingData.header}, Running: ${nothingData.running}`);

    // 5. No Cancel & Long Queue Stories
    console.log('\n[5/6] Auditing No Cancel & Long Queue Stories...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-11-message-queue--no-cancel&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="message-queue"]');
    const stageNoCancel = await pageDark.locator('.ds-story-stage').first();
    await stageNoCancel.screenshot({ path: `${ARTIFACT_DIR}/message-queue-no-cancel-dark.png` });

    const noCancelData = await pageDark.locator('[data-slot="message-queue"]').evaluate((el) => ({
      items: el.querySelectorAll('.ds-message-queue__item').length,
      cancelBtns: el.querySelectorAll('.ds-queue-btn-cancel').length,
      arrows: el.querySelectorAll('svg.lucide-arrow-up, svg.text-foreground\\/25').length,
    }));
    assert('No Cancel Omits Cancel Buttons While Keeping Arrows', noCancelData.items === 2 && noCancelData.cancelBtns === 0 && noCancelData.arrows === 2, `Items: ${noCancelData.items}, CancelBtns: ${noCancelData.cancelBtns}, Arrows: ${noCancelData.arrows}`);

    // Long Queue Story
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-11-message-queue--long-queue&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="message-queue"]');
    const stageLongQueue = await pageDark.locator('.ds-story-stage').first();
    await stageLongQueue.screenshot({ path: `${ARTIFACT_DIR}/message-queue-long-queue-dark.png` });

    const longQueueData = await pageDark.locator('[data-slot="message-queue"]').evaluate((el) => {
      const items = Array.from(el.querySelectorAll('.ds-message-queue__item'));
      const indices = items.map((it) => it.querySelector('.ds-message-queue__item-index')?.textContent?.trim());
      const texts = items.map((it) => it.querySelector('.ds-message-queue__item-text')?.textContent?.trim());
      return {
        count: items.length,
        indices,
        allTruncate: items.every((it) => window.getComputedStyle(it.querySelector('.ds-message-queue__item-text')).textOverflow === 'ellipsis'),
      };
    });
    assert('Long Queue Renders 5 Items with Strict Monotonic Indices', longQueueData.count === 5 && longQueueData.indices.join(',') === '1,2,3,4,5', `Count: ${longQueueData.count}, Indices: ${longQueueData.indices.join(',')}`);
    assert('Long Queue Items Truncate with Ellipsis', longQueueData.allTruncate, `allTruncate: ${longQueueData.allTruncate}`);

    // 6. Reduced Motion Safety
    console.log('\n[6/6] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmPingDisplay = await pageDark.locator('.ds-message-queue__beacon-ping').evaluate((el) => window.getComputedStyle(el).display);
    assert('Reduced Motion Hides Beacon Ping Animation', rmPingDisplay === 'none', `Ping display: ${rmPingDisplay}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/011_message_queue_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
