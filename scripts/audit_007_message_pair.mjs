import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 007 MESSAGE PAIR ---');
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
    console.log('\n[1/5] Auditing Default Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-07-message-pair--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-pair');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/message-pair-default-dark.png` });

    const pairData = await pageDark.locator('.ds-message-pair').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const userBubble = el.querySelector('.ds-message-pair__user-bubble');
      const userS = userBubble ? window.getComputedStyle(userBubble) : {};
      const assistantRow = el.querySelector('.ds-message-pair__assistant-row');
      const replyP = assistantRow ? assistantRow.querySelector('p') : null;
      const replyS = replyP ? window.getComputedStyle(replyP) : {};
      const tokens = assistantRow ? assistantRow.querySelectorAll('.ds-streaming-token') : [];
      const freshWords = assistantRow ? assistantRow.querySelectorAll('.ds-streaming-word--fresh') : [];
      const caret = assistantRow ? assistantRow.querySelector('.ds-streaming-caret') : null;
      const caretS = caret ? window.getComputedStyle(caret) : {};
      const caretRect = caret ? caret.getBoundingClientRect() : {};
      const toolbarButtons = assistantRow ? assistantRow.querySelectorAll('.ds-icon-btn') : [];

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        userAlign: userS.alignSelf,
        userMaxW: userS.maxWidth,
        userRadius: userS.borderRadius,
        userPadding: userS.padding,
        userFontSize: userS.fontSize,
        userFontWeight: userS.fontWeight,
        replyMinH: replyS.minHeight,
        replyFontSize: replyS.fontSize,
        replyFontWeight: replyS.fontWeight,
        replyLineHeight: replyS.lineHeight,
        tokenCount: tokens.length,
        freshCount: freshWords.length,
        caretFound: !!caret,
        caretWidth: caretRect.width,
        caretHeight: caretRect.height,
        caretBg: caretS.backgroundColor,
        toolbarBtnCount: toolbarButtons.length,
      };
    });

    results.measurements.defaultDark = pairData;
    assert('Data Slot Attribute', pairData.slot === 'message-pair', `data-slot: ${pairData.slot}`);
    assert('Container Max Width', pairData.maxWidth === '384px', `max-width: ${pairData.maxWidth}`);
    assert('Container Gap (20px)', pairData.gap === '20px', `gap: ${pairData.gap}`);
    assert('User Bubble Alignment (self-end)', pairData.userAlign === 'flex-end', `align-self: ${pairData.userAlign}`);
    assert('User Bubble Max Width (85%)', pairData.userMaxW === '85%', `max-width: ${pairData.userMaxW}`);
    assert('User Bubble Radius (16px)', pairData.userRadius === '16px', `radius: ${pairData.userRadius}`);
    assert('User Bubble Padding (8px 14px)', pairData.userPadding === '8px 14px', `padding: ${pairData.userPadding}`);
    assert('User Bubble Strict 400 Rule', pairData.userFontSize === '14px' && pairData.userFontWeight === '400', `User: ${pairData.userFontSize} / ${pairData.userFontWeight}`);
    assert('Reply Min Height (68px / 4.25rem)', pairData.replyMinH === '68px', `min-height: ${pairData.replyMinH}`);
    assert('Reply Strict 400 Rule', pairData.replyFontSize === '14px' && pairData.replyFontWeight === '400', `Reply: ${pairData.replyFontSize} / ${pairData.replyFontWeight}`);
    assert('Reply Line Height (1.625)', Math.abs(parseFloat(pairData.replyLineHeight) - 22.75) < 1, `Line height: ${pairData.replyLineHeight}`);
    assert('Streaming Tokens Count', pairData.tokenCount === 11, `Tokens: ${pairData.tokenCount}`);
    assert('Fresh Blue Words (Last 2)', pairData.freshCount === 2, `Fresh words: ${pairData.freshCount}`);
    assert('Pulsing Trailing Caret Present', pairData.caretFound, `Caret rendered`);
    assert('Caret Dimensions (2x16px)', Math.round(pairData.caretWidth) === 2 && Math.round(pairData.caretHeight) === 16, `Caret: ${pairData.caretWidth}x${pairData.caretHeight}px`);
    assert('Caret Blue Token', pairData.caretBg === 'rgb(2, 133, 255)', `Caret bg: ${pairData.caretBg}`);
    assert('Streaming Hides Actions Toolbar', pairData.toolbarBtnCount === 0, `Toolbar buttons during stream: ${pairData.toolbarBtnCount}`);

    // 2. Light Mode: Default Story
    console.log('\n[2/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-07-message-pair--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-message-pair');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/message-pair-default-light.png` });

    // 3. Waiting Story (0 words, no collapse)
    console.log('\n[3/5] Auditing Waiting Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-07-message-pair--waiting&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-pair');
    const stageWaiting = await pageDark.locator('.ds-story-stage').first();
    await stageWaiting.screenshot({ path: `${ARTIFACT_DIR}/message-pair-waiting-dark.png` });

    const waitingData = await pageDark.locator('.ds-message-pair').first().evaluate((el) => {
      const tokens = el.querySelectorAll('.ds-streaming-token');
      const caret = el.querySelector('.ds-streaming-caret');
      const replyP = el.querySelector('.ds-message-pair__assistant-row p');
      const rect = replyP ? replyP.getBoundingClientRect() : {};
      return {
        tokenCount: tokens.length,
        caretFound: !!caret,
        replyHeight: rect.height,
      };
    });
    assert('Waiting State Has 0 Tokens', waitingData.tokenCount === 0, `Tokens: ${waitingData.tokenCount}`);
    assert('Waiting State Omits Caret (words=0)', !waitingData.caretFound, `Caret found: ${waitingData.caretFound}`);
    assert('Waiting State Retains 68px Min Height', Math.round(waitingData.replyHeight) >= 68, `Height: ${waitingData.replyHeight}px`);

    // 4. Complete Story & Actions Toolbar Hover
    console.log('\n[4/5] Auditing Complete Story & Actions Toolbar...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-07-message-pair--complete&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-pair');

    const completeData = await pageDark.locator('.ds-message-pair').first().evaluate((el) => {
      const tokens = el.querySelectorAll('.ds-streaming-token');
      const freshWords = el.querySelectorAll('.ds-streaming-word--fresh');
      const caret = el.querySelector('.ds-streaming-caret');
      const copyBtn = el.querySelector('button[aria-label="Copy response"]');
      const regenBtn = el.querySelector('button[aria-label="Regenerate response"]');
      const toolbar = el.querySelector('.ds-message-pair__toolbar');
      const toolbarS = toolbar ? window.getComputedStyle(toolbar) : {};

      return {
        tokenCount: tokens.length,
        freshCount: freshWords.length,
        caretFound: !!caret,
        copyFound: !!copyBtn,
        regenFound: !!regenBtn,
        toolbarRestingOpacity: toolbarS.opacity,
      };
    });
    assert('Complete Words Settled (All 25 words)', completeData.tokenCount === 25, `Tokens: ${completeData.tokenCount}`);
    assert('Complete Fresh Count (0 blue words)', completeData.freshCount === 0, `Fresh words: ${completeData.freshCount}`);
    assert('Complete Caret Hidden', !completeData.caretFound, `Caret present: ${completeData.caretFound}`);
    assert('Copy & Regenerate Buttons Present', completeData.copyFound && completeData.regenFound, `Copy: ${completeData.copyFound}, Regen: ${completeData.regenFound}`);
    assert('Toolbar Resting Opacity is 0', completeData.toolbarRestingOpacity === '0', `Opacity: ${completeData.toolbarRestingOpacity}`);

    // Hover assistant row to reveal toolbar (transition 150ms)
    await pageDark.hover('.ds-message-pair__assistant-row');
    await pageDark.waitForTimeout(200);
    const hoverOpacity = await pageDark.locator('.ds-message-pair__toolbar').evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    assert('Toolbar Hover Opacity is 1', hoverOpacity === '1', `Hover opacity: ${hoverOpacity}`);

    const stageComplete = await pageDark.locator('.ds-story-stage').first();
    await stageComplete.screenshot({ path: `${ARTIFACT_DIR}/message-pair-complete-hover-dark.png` });

    // 5. Long Question Story
    console.log('\n[5/5] Auditing Long Question Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-07-message-pair--long-question&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-message-pair');
    const stageLongQ = await pageDark.locator('.ds-story-stage').first();
    await stageLongQ.screenshot({ path: `${ARTIFACT_DIR}/message-pair-long-question-dark.png` });

    const longQMetrics = await pageDark.locator('.ds-message-pair').first().evaluate((el) => {
      const bubble = el.querySelector('.ds-message-pair__user-bubble');
      const bRect = bubble.getBoundingClientRect();
      const pRect = el.getBoundingClientRect();
      return {
        bubbleWidth: bRect.width,
        containerWidth: pRect.width,
        ratio: bRect.width / pRect.width,
      };
    });
    assert('Long Question Wraps Inside 85% Width', longQMetrics.ratio <= 0.86, `Ratio: ${(longQMetrics.ratio * 100).toFixed(1)}%`);

    // Reduced motion safety
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmTransition = await pageDark.locator('.ds-message-pair__toolbar').evaluate((el) => {
      return window.getComputedStyle(el).transitionDuration;
    });
    assert('Reduced Motion Disables Toolbar Transition', rmTransition === '0s', `Transition duration: ${rmTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/007_message_pair_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
