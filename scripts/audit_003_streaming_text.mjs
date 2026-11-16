import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 003 STREAMING TEXT ---');
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
    // 1. Dark Mode: Streaming Story
    console.log('\n[1/5] Auditing Streaming Story (Dark Mode)...');
    const contextDark = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-03-streaming-text--streaming&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-streaming-text');

    const stageStreamingDark = await pageDark.locator('.ds-story-stage').first();
    await stageStreamingDark.screenshot({ path: `${ARTIFACT_DIR}/streaming-text-streaming-dark.png` });

    const streamData = await pageDark.locator('.ds-streaming-text').first().evaluate((el) => {
      const s = window.getComputedStyle(el);
      const tokens = el.querySelectorAll('.ds-streaming-token');
      const freshWords = el.querySelectorAll('.ds-streaming-word--fresh');
      const monoCode = el.querySelector('.ds-streaming-code');
      const monoS = monoCode ? window.getComputedStyle(monoCode) : {};
      const caret = el.querySelector('.ds-streaming-caret');
      const caretS = caret ? window.getComputedStyle(caret) : {};
      const caretRect = caret ? caret.getBoundingClientRect() : {};

      return {
        maxWidth: s.maxWidth,
        minHeight: s.minHeight,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        color: s.color,
        textWrap: s.textWrap,
        tokenCount: tokens.length,
        freshWordCount: freshWords.length,
        monoFound: !!monoCode,
        monoText: monoCode ? monoCode.textContent : null,
        monoFontFamily: monoS.fontFamily,
        monoFontWeight: monoS.fontWeight,
        monoBg: monoS.backgroundColor,
        caretFound: !!caret,
        caretWidth: caretRect.width,
        caretHeight: caretRect.height,
        caretBg: caretS.backgroundColor,
        caretAnim: caretS.animationName,
      };
    });

    results.measurements.streamingDark = streamData;
    assert('Container Max Width', streamData.maxWidth === '384px', `Expected 384px, got ${streamData.maxWidth}`);
    assert('Container Min Height', streamData.minHeight === '136px', `Expected 136px (8.5rem), got ${streamData.minHeight}`);
    assert('Typography Font Size', streamData.fontSize === '14px', `Expected 14px, got ${streamData.fontSize}`);
    assert('Typography Strict 400 Rule', streamData.fontWeight === '400', `Expected 400, got ${streamData.fontWeight}`);
    assert('Typography Leading Relaxed', Math.abs(parseFloat(streamData.lineHeight) - 22.75) < 1, `Line height: ${streamData.lineHeight}`);
    assert('Streaming Word Count (Halfway)', streamData.tokenCount === 17, `Expected 17 words, got ${streamData.tokenCount}`);
    assert('Fresh Blue Words (Last 2)', streamData.freshWordCount === 2, `Expected exactly 2 fresh words, got ${streamData.freshWordCount}`);
    assert('Pulsing Caret Present', streamData.caretFound, `Caret element rendered`);
    assert('Caret Dimensions (2x16px)', Math.round(streamData.caretWidth) === 2 && Math.round(streamData.caretHeight) === 16, `Caret: ${streamData.caretWidth}x${streamData.caretHeight}px`);
    assert('Caret Animation', streamData.caretAnim.includes('ds-pulse-dot'), `Got ${streamData.caretAnim}`);

    // 2. Light Mode: Streaming Story
    console.log('\n[2/5] Auditing Streaming Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 700 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-03-streaming-text--streaming&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-streaming-text');
    const stageStreamingLight = await pageLight.locator('.ds-story-stage').first();
    await stageStreamingLight.screenshot({ path: `${ARTIFACT_DIR}/streaming-text-streaming-light.png` });

    // 3. Complete Story (Settled, No Caret)
    console.log('\n[3/5] Auditing Complete Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-03-streaming-text--complete&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-streaming-text');
    const stageCompleteDark = await pageDark.locator('.ds-story-stage').first();
    await stageCompleteDark.screenshot({ path: `${ARTIFACT_DIR}/streaming-text-complete-dark.png` });

    const completeData = await pageDark.locator('.ds-streaming-text').first().evaluate((el) => {
      const tokens = el.querySelectorAll('.ds-streaming-token');
      const freshWords = el.querySelectorAll('.ds-streaming-word--fresh');
      const monoCode = el.querySelector('.ds-streaming-code');
      const monoS = monoCode ? window.getComputedStyle(monoCode) : {};
      const caret = el.querySelector('.ds-streaming-caret');
      return {
        tokenCount: tokens.length,
        freshWordCount: freshWords.length,
        monoFound: !!monoCode,
        monoText: monoCode ? monoCode.textContent : null,
        monoFontFamily: monoS.fontFamily,
        monoFontWeight: monoS.fontWeight,
        monoBorderRadius: monoS.borderRadius,
        caretFound: !!caret,
      };
    });
    results.measurements.complete = completeData;
    assert('Complete Word Count (All 36 words)', completeData.tokenCount === 36, `Expected 36 words, got ${completeData.tokenCount}`);
    assert('Zero Fresh Words (All settled)', completeData.freshWordCount === 0, `Expected 0 fresh words, got ${completeData.freshWordCount}`);
    assert('Caret Hidden on Complete', !completeData.caretFound, `Caret is not present`);
    assert('Inline Code Monospace Segment', completeData.monoFound && completeData.monoText === 'useAuiState', `Code segment: "${completeData.monoText}"`);
    assert('Inline Code Font Weight (400 Rule)', completeData.monoFontWeight === '400', `Expected 400, got ${completeData.monoFontWeight}`);
    assert('Inline Code Radius (6px/8px)', completeData.monoBorderRadius === '6px' || completeData.monoBorderRadius === '8px', `Got ${completeData.monoBorderRadius}`);

    // 4. Default Interactive Streaming Story
    console.log('\n[4/5] Auditing Interactive Live Streaming Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-03-streaming-text--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-stream-btn-toggle');

    // Wait for streaming to progress
    await pageDark.waitForTimeout(600);
    const wordsMid = await pageDark.locator('.ds-streaming-text .ds-streaming-token').count();
    assert('Live Stream Incrementing Words', wordsMid >= 2, `Tokens streamed: ${wordsMid}`);

    // Click Pause
    await pageDark.click('.ds-stream-btn-toggle');
    const wordsAtPause = await pageDark.locator('.ds-streaming-text .ds-streaming-token').count();
    await pageDark.waitForTimeout(300);
    const wordsAfterPauseWait = await pageDark.locator('.ds-streaming-text .ds-streaming-token').count();
    assert('Stream Paused Successfully', wordsAtPause === wordsAfterPauseWait, `Word count frozen at ${wordsAtPause}`);

    // Screenshot live streaming
    const stageLiveDark = await pageDark.locator('.ds-story-stage').first();
    await stageLiveDark.screenshot({ path: `${ARTIFACT_DIR}/streaming-text-live-running-dark.png` });

    // Click Resume
    await pageDark.click('.ds-stream-btn-toggle');
    await pageDark.waitForTimeout(400);
    const wordsAfterResume = await pageDark.locator('.ds-streaming-text .ds-streaming-token').count();
    assert('Stream Resumed Successfully', wordsAfterResume > wordsAtPause, `Tokens increased to ${wordsAfterResume}`);

    // Click Replay
    await pageDark.click('.ds-stream-btn-replay');
    await pageDark.waitForTimeout(150);
    const wordsAfterReplay = await pageDark.locator('.ds-streaming-text .ds-streaming-token').count();
    assert('Stream Replayed from Start', wordsAfterReplay <= 4, `Reset token count: ${wordsAfterReplay}`);

    // 5. Reduced Motion Safety
    console.log('\n[5/5] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const rmData = await pageDark.locator('.ds-streaming-text').evaluate((el) => {
      const caret = el.querySelector('.ds-streaming-caret');
      const word = el.querySelector('.ds-streaming-word');
      const token = el.querySelector('.ds-streaming-token');
      return {
        caretAnim: caret ? window.getComputedStyle(caret).animationName : 'none',
        wordTransition: word ? window.getComputedStyle(word).transitionDuration : 'none',
        tokenAnim: token ? window.getComputedStyle(token).animationName : 'none',
      };
    });
    assert('Reduced Motion Disables Caret Animation', rmData.caretAnim === 'none', `Caret anim: ${rmData.caretAnim}`);
    assert('Reduced Motion Disables Word Transitions', rmData.wordTransition === '0s' || rmData.wordTransition === 'none', `Word transition: ${rmData.wordTransition}`);
    assert('Reduced Motion Disables Token Fade-in', rmData.tokenAnim === 'none', `Token anim: ${rmData.tokenAnim}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/003_streaming_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
