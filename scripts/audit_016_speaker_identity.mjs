import { chromium } from 'playwright';
import fs from 'node:fs';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://127.0.0.1:6006';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 016 SPEAKER IDENTITY ---');
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
      viewport: { width: 1000, height: 750 },
      colorScheme: 'dark',
      deviceScaleFactor: 2,
    });
    const pageDark = await contextDark.newPage();

    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-16-speaker-identity--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="speaker-identity"]');

    const stageDefaultDark = await pageDark.locator('.ds-story-stage').first();
    await stageDefaultDark.screenshot({ path: `${ARTIFACT_DIR}/speaker-identity-default-dark.png` });

    const turnsData = await pageDark.locator('[data-slot="speaker-identity"]').evaluate((el) => {
      const s = window.getComputedStyle(el);
      const turns = Array.from(el.querySelectorAll('.ds-speaker-turn'));

      const userTurn = turns[0];
      const userAv = userTurn ? userTurn.querySelector('.ds-speaker-avatar') : null;
      const userAvS = userAv ? window.getComputedStyle(userAv) : {};
      const userAvRect = userAv ? userAv.getBoundingClientRect() : {};
      const userName = userTurn ? userTurn.querySelector('.ds-speaker-name') : null;
      const userNameS = userName ? window.getComputedStyle(userName) : {};
      const userText = userTurn ? userTurn.querySelector('.ds-speaker-text') : null;
      const userTextS = userText ? window.getComputedStyle(userText) : {};

      const agentTurn = turns[1];
      const agentAv = agentTurn ? agentTurn.querySelector('.ds-speaker-avatar') : null;
      const agentAvS = agentAv ? window.getComputedStyle(agentAv) : {};
      const agentDetail = agentTurn ? agentTurn.querySelector('.ds-speaker-detail') : null;
      const agentDetS = agentDetail ? window.getComputedStyle(agentDetail) : {};

      const subagentTurn = turns[2];
      const subagentAv = subagentTurn ? subagentTurn.querySelector('.ds-speaker-avatar') : null;
      const subagentAvS = subagentAv ? window.getComputedStyle(subagentAv) : {};

      const toolTurn = turns[3];
      const toolAv = toolTurn ? toolTurn.querySelector('.ds-speaker-avatar') : null;
      const toolAvS = toolAv ? window.getComputedStyle(toolAv) : {};

      return {
        slot: el.getAttribute('data-slot'),
        maxWidth: s.maxWidth,
        gap: s.gap,
        turnsCount: turns.length,
        userAvWidth: Math.round(userAvRect.width),
        userAvHeight: Math.round(userAvRect.height),
        userAvRadius: userAvS.borderRadius,
        userNameFontSize: userNameS.fontSize,
        userNameFontWeight: userNameS.fontWeight,
        userTextFontSize: userTextS.fontSize,
        userTextFontWeight: userTextS.fontWeight,
        agentAvRadius: agentAvS.borderRadius,
        agentAvColor: agentAvS.color,
        agentDetailFontSize: agentDetS.fontSize,
        agentDetailFontWeight: agentDetS.fontWeight,
        agentDetailFontFamily: agentDetS.fontFamily,
        agentDetailText: agentDetail ? agentDetail.textContent.trim() : null,
        subagentAvRadius: subagentAvS.borderRadius,
        toolAvRadius: toolAvS.borderRadius,
      };
    });

    results.measurements.defaultDark = turnsData;
    assert('Data Slot Attribute', turnsData.slot === 'speaker-identity', `data-slot: ${turnsData.slot}`);
    assert('Container Max Width (384px)', turnsData.maxWidth === '384px', `max-width: ${turnsData.maxWidth}`);
    assert('Container Gap (14px)', turnsData.gap === '14px', `gap: ${turnsData.gap}`);
    assert('Total Turns Rendered (4)', turnsData.turnsCount === 4, `Count: ${turnsData.turnsCount}`);
    assert('User Avatar Dimensions (24x24px)', turnsData.userAvWidth === 24 && turnsData.userAvHeight === 24, `Avatar: ${turnsData.userAvWidth}x${turnsData.userAvHeight}px`);
    assert('User Avatar Rounded-LG Radius (8px)', turnsData.userAvRadius === '8px', `radius: ${turnsData.userAvRadius}`);
    assert('Speaker Name Typography (13px / 500)', turnsData.userNameFontSize === '13px' && turnsData.userNameFontWeight === '500', `Name: ${turnsData.userNameFontSize} / ${turnsData.userNameFontWeight}`);
    assert('Speaker Message Text Strict 400 (13.5px)', turnsData.userTextFontSize === '13.5px' && turnsData.userTextFontWeight === '400', `Text: ${turnsData.userTextFontSize} / ${turnsData.userTextFontWeight}`);
    assert('Agent Avatar Tone Accent Color', turnsData.agentAvColor !== '' && turnsData.agentAvColor !== 'transparent', `Agent color: ${turnsData.agentAvColor}`);
    assert('Agent Detail Strict 400 Mono (11px)', turnsData.agentDetailFontSize === '11px' && turnsData.agentDetailFontWeight === '400' && turnsData.agentDetailFontFamily.includes('mono'), `Detail: ${turnsData.agentDetailFontSize} / ${turnsData.agentDetailFontWeight}`);
    assert('Agent Detail Text Content', turnsData.agentDetailText === 'claude-3-7-sonnet', `Detail text: ${turnsData.agentDetailText}`);
    assert('Subagent Avatar Rounded-Full Pill Radius', turnsData.subagentAvRadius === '9999px' || turnsData.subagentAvRadius === '50%', `Subagent radius: ${turnsData.subagentAvRadius}`);
    assert('Tool Avatar Rounded-LG Radius (8px)', turnsData.toolAvRadius === '8px', `Tool radius: ${turnsData.toolAvRadius}`);

    // 2. Light Mode: Default Story
    console.log('\n[2/5] Auditing Default Story (Light Mode)...');
    const contextLight = await browser.newContext({
      viewport: { width: 1000, height: 750 },
      colorScheme: 'light',
      deviceScaleFactor: 2,
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto(`${BASE_URL}/iframe.html?id=default-application-16-speaker-identity--default&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageLight.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    });
    await pageLight.waitForSelector('[data-slot="speaker-identity"]');
    const stageDefaultLight = await pageLight.locator('.ds-story-stage').first();
    await stageDefaultLight.screenshot({ path: `${ARTIFACT_DIR}/speaker-identity-default-light.png` });

    // 3. Two Speakers Story
    console.log('\n[3/5] Auditing Two Speakers Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-16-speaker-identity--two-speakers&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="speaker-identity"]');
    const stageTwoSpeakers = await pageDark.locator('.ds-story-stage').first();
    await stageTwoSpeakers.screenshot({ path: `${ARTIFACT_DIR}/speaker-identity-two-speakers-dark.png` });

    const twoSpeakersData = await pageDark.locator('[data-slot="speaker-identity"]').evaluate((el) => {
      const turns = el.querySelectorAll('.ds-speaker-turn');
      const details = el.querySelectorAll('.ds-speaker-detail');
      return {
        turnsCount: turns.length,
        detailsCount: details.length,
      };
    });
    assert('Two Speakers Renders Exactly 2 Turns', twoSpeakersData.turnsCount === 2, `Count: ${twoSpeakersData.turnsCount}`);
    assert('Two Speakers Omits Detail Tags', twoSpeakersData.detailsCount === 0, `Details: ${twoSpeakersData.detailsCount}`);

    // 4. Long Turns Story
    console.log('\n[4/5] Auditing Long Turns Story...');
    await pageDark.goto(`${BASE_URL}/iframe.html?id=default-application-16-speaker-identity--long-turns&viewMode=story`, {
      waitUntil: 'networkidle',
    });
    await pageDark.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await pageDark.waitForSelector('[data-slot="speaker-identity"]');
    const stageLongTurns = await pageDark.locator('.ds-story-stage').first();
    await stageLongTurns.screenshot({ path: `${ARTIFACT_DIR}/speaker-identity-long-turns-dark.png` });

    const longTurnsData = await pageDark.locator('[data-slot="speaker-identity"]').evaluate((el) => {
      const cRect = el.getBoundingClientRect();
      const texts = Array.from(el.querySelectorAll('.ds-speaker-text'));
      const textRects = texts.map((t) => t.getBoundingClientRect());
      return {
        containerWidth: Math.round(cRect.width),
        maxTextWidth: Math.max(...textRects.map((r) => Math.round(r.width))),
      };
    });
    assert('Long Turns Stays Within 384px Container Boundary', longTurnsData.containerWidth <= 384, `Width: ${longTurnsData.containerWidth}px`);
    assert('Unbroken URL Wraps Cleanly Inside Content Area', longTurnsData.maxTextWidth <= longTurnsData.containerWidth, `Text width: ${longTurnsData.maxTextWidth}px vs container: ${longTurnsData.containerWidth}px`);

    await contextDark.close();
    await contextLight.close();
    await browser.close();

    console.log(`\n=== AUDIT FINISHED: ${results.passed}/${results.total} PASSED ===`);
    fs.writeFileSync(`${ARTIFACT_DIR}/scratch/016_speaker_identity_results.json`, JSON.stringify(results, null, 2));
  } catch (err) {
    console.error('Audit failed with error:', err);
    await browser.close();
    process.exit(1);
  }
}

runAudit();
