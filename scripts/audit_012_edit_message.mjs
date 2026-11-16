import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 012 EDIT MESSAGE ---');
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

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-edit-target [data-slot="edit-message"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/edit-message-default-dark.png` });

    const cardData = await pageDark.locator('.ds-edit-target [data-slot="edit-message"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const textarea = el.querySelector('textarea');
      const textS = textarea ? window.getComputedStyle(textarea) : {};
      const warning = el.querySelector('.ds-edit-message__warning');
      const warnS = warning ? window.getComputedStyle(warning) : {};
      const warnSvg = warning ? warning.querySelector('svg') : null;
      const warnSvgRect = warnSvg ? warnSvg.getBoundingClientRect() : {};
      const warnSpan = warning ? warning.querySelector('span') : null;
      const warnSpanS = warnSpan ? window.getComputedStyle(warnSpan) : {};

      const cancelBtn = el.querySelector('.ds-edit-message__btn-cancel');
      const cancelS = cancelBtn ? window.getComputedStyle(cancelBtn) : {};
      const sendBtn = el.querySelector('.ds-edit-message__btn-send');
      const sendS = sendBtn ? window.getComputedStyle(sendBtn) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        cardRadius: s.borderRadius,
        cardPadding: s.padding,
        cardGap: s.gap,
        textareaRadius: textS.borderRadius,
        textareaPadding: textS.padding,
        textareaFontSize: textS.fontSize,
        textareaFontWeight: textS.fontWeight,
        textareaResize: textS.resize,
        warnSvgWidth: Math.round(warnSvgRect.width),
        warnSvgHeight: Math.round(warnSvgRect.height),
        warnText: warnSpan ? warnSpan.textContent.trim() : null,
        warnFontSize: warnSpanS.fontSize,
        warnFontWeight: warnSpanS.fontWeight,
        warnFontFamily: warnSpanS.fontFamily,
        cancelHeight: parseFloat(cancelS.height),
        cancelRadius: cancelS.borderRadius,
        cancelFontSize: cancelS.fontSize,
        cancelFontWeight: cancelS.fontWeight,
        sendHeight: parseFloat(sendS.height),
        sendRadius: sendS.borderRadius,
        sendFontSize: sendS.fontSize,
        sendFontWeight: sendS.fontWeight,
      };
    });

    results.measurements.defaultDark = cardData;
    assert('Data Slot Attribute', cardData.slot === 'edit-message', `data-slot: ${cardData.slot}`);
    assert('Container Max Width (384px)', cardData.maxWidth === '384px', `max-width: ${cardData.maxWidth}`);
    assert('Card Radius (20px)', cardData.cardRadius === '20px', `radius: ${cardData.cardRadius}`);
    assert('Card Padding (14px)', cardData.cardPadding === '14px', `padding: ${cardData.cardPadding}`);
    assert('Textarea Radius (12px)', cardData.textareaRadius === '12px', `radius: ${cardData.textareaRadius}`);
    assert('Textarea Padding (10px 12px)', cardData.textareaPadding === '10px 12px', `padding: ${cardData.textareaPadding}`);
    assert('Textarea Strict 400 Typography', cardData.textareaFontSize === '13.5px' && cardData.textareaFontWeight === '400', `Textarea: ${cardData.textareaFontSize} / ${cardData.textareaFontWeight}`);
    assert('Textarea Resize Disabled', cardData.textareaResize === 'none', `resize: ${cardData.textareaResize}`);
    assert('Warning Triangle SVG Dimensions (14x14px)', cardData.warnSvgWidth === 14 && cardData.warnSvgHeight === 14, `SVG: ${cardData.warnSvgWidth}x${cardData.warnSvgHeight}px`);
    assert('Warning Text Content', cardData.warnText === 'sending starts a new branch; 3 replies stay on the old one', `Text: ${cardData.warnText}`);
    assert('Warning Text Strict 400 Mono', cardData.warnFontSize === '11px' && cardData.warnFontWeight === '400' && cardData.warnFontFamily.includes('mono'), `Warning: ${cardData.warnFontSize} / ${cardData.warnFontWeight} / ${cardData.warnFontFamily}`);
    assert('Cancel Button 32px Compact Pill', Math.round(cardData.cancelHeight) === 32 && (cardData.cancelRadius === '9999px' || cardData.cancelRadius === '50%'), `Cancel: height ${cardData.cancelHeight}px, radius: ${cardData.cancelRadius}`);
    assert('Cancel Button Typography 12px / 500', cardData.cancelFontSize === '12px' && cardData.cancelFontWeight === '500', `Cancel typography: ${cardData.cancelFontSize} / ${cardData.cancelFontWeight}`);
    assert('Send Button 32px Compact Pill', Math.round(cardData.sendHeight) === 32 && (cardData.sendRadius === '9999px' || cardData.sendRadius === '50%'), `Send: height ${cardData.sendHeight}px, radius: ${cardData.sendRadius}`);
    assert('Send Button Typography 12px / 500', cardData.sendFontSize === '12px' && cardData.sendFontWeight === '500', `Send typography: ${cardData.sendFontSize} / ${cardData.sendFontWeight}`);

    // 2. Interactive Toggle Testing
    console.log('\n[2/6] Testing Interactive Editor <-> Sent Message State Machine...');
    // Click Cancel -> Transitions to Sent Bubble
    await pageDark.click('.ds-edit-target .ds-edit-message__btn-cancel');
    await pageDark.waitForSelector('.ds-edit-target .ds-edit-message__sent-bubble');

    const bubbleData = await pageDark.locator('.ds-edit-target [data-slot="edit-message"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const bubble = el.querySelector('.ds-edit-message__sent-bubble');
      const bS = bubble ? window.getComputedStyle(bubble) : {};
      return {
        justifyContent: s.justifyContent,
        bubbleRadius: bS.borderRadius,
        bubblePadding: bS.padding,
        bubbleFontSize: bS.fontSize,
        bubbleFontWeight: bS.fontWeight,
        bubbleText: bubble ? bubble.textContent.trim() : null,
      };
    });
    assert('Cancel Transitions to Sent Bubble (Right-Aligned)', bubbleData.justifyContent === 'flex-end', `justify-content: ${bubbleData.justifyContent}`);
    assert('Sent Bubble Radius (16px)', bubbleData.bubbleRadius === '16px', `radius: ${bubbleData.bubbleRadius}`);
    assert('Sent Bubble Padding (10px 14px)', bubbleData.bubblePadding === '10px 14px', `padding: ${bubbleData.bubblePadding}`);
    assert('Sent Bubble Strict 400 Typography', bubbleData.bubbleFontSize === '13.5px' && bubbleData.bubbleFontWeight === '400', `Bubble: ${bubbleData.bubbleFontSize} / ${bubbleData.bubbleFontWeight}`);

    // Click Bubble -> Reopens Editor
    await pageDark.click('.ds-edit-target .ds-edit-message__sent-bubble');
    await pageDark.waitForSelector('.ds-edit-target textarea');

    // Type new text and click Send
    await pageDark.fill('.ds-edit-target textarea', 'Updated text via live test typing.');
    await pageDark.click('.ds-edit-target .ds-edit-message__btn-send');
    await pageDark.waitForSelector('.ds-edit-target .ds-edit-message__sent-bubble');

    const updatedBubbleText = await pageDark.locator('.ds-edit-target .ds-edit-message__sent-bubble').textContent();
    assert('Send Transitions to Sent Bubble with Updated Value', updatedBubbleText.trim() === 'Updated text via live test typing.', `Text: ${updatedBubbleText.trim()}`);

    // 3. Light Mode: Default Story
    console.log('\n[3/6] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('.ds-edit-target [data-slot="edit-message"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/edit-message-default-light.png` });

    // 4. Sent Story (Dark Mode)
    console.log('\n[4/6] Auditing Sent Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--sent&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-edit-message__sent-bubble');
    const stageSent = await pageDark.locator('.ds-story-stage').first();
    await stageSent.screenshot({ path: `${ARTIFACT_DIR}/edit-message-sent-dark.png` });

    // 5. No Replies & One Reply & Long Message Stories
    console.log('\n[5/6] Auditing No Replies, One Reply, and Long Message Stories...');
    // No Replies
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--no-replies&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="edit-message"]');
    const stageNoReplies = await pageDark.locator('.ds-story-stage').first();
    await stageNoReplies.screenshot({ path: `${ARTIFACT_DIR}/edit-message-no-replies-dark.png` });
    const hasNoRepliesWarning = await pageDark.locator('.ds-edit-message__warning').count();
    assert('No Replies Omits Branch Warning Banner', hasNoRepliesWarning === 0, `Warning count: ${hasNoRepliesWarning}`);

    // One Reply (Singular grammar check)
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--one-reply&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-edit-message__warning');
    const stageOneReply = await pageDark.locator('.ds-story-stage').first();
    await stageOneReply.screenshot({ path: `${ARTIFACT_DIR}/edit-message-one-reply-dark.png` });
    const oneReplyText = await pageDark.locator('.ds-edit-message__warning span').textContent();
    assert('One Reply Uses Singular "1 reply stays"', oneReplyText.includes('1 reply stays on the old one'), `Text: ${oneReplyText}`);

    // Long Message
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-12-edit-message--long-message&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('.ds-edit-message__warning');
    const stageLongMessage = await pageDark.locator('.ds-story-stage').first();
    await stageLongMessage.screenshot({ path: `${ARTIFACT_DIR}/edit-message-long-message-dark.png` });
    const longMessageData = await pageDark.locator('[data-slot="edit-message"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const span = el.querySelector('.ds-edit-message__warning span');
      return {
        maxWidth: s.maxWidth,
        warnText: span ? span.textContent.trim() : '',
      };
    });
    assert('Long Message Preserves 384px Max Width', longMessageData.maxWidth === '384px', `max-width: ${longMessageData.maxWidth}`);
    assert('Long Message Displays 12 Discarded Replies', longMessageData.warnText.includes('12 replies stay on the old one'), `Text: ${longMessageData.warnText}`);

    // 6. Reduced Motion Safety
    console.log('\n[6/6] Auditing Reduced Motion Safety...');
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-reduced-motion', 'true');
    });
    const sendBtnTransition = await pageDark.locator('.ds-edit-message__btn-send').evaluate((el) => window.getComputedStyle(el).transition);
    assert('Reduced Motion Disables Button Transitions', sendBtnTransition === 'none', `Transition: ${sendBtnTransition}`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/012_edit_message_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
