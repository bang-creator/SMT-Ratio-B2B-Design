import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';

const ARTIFACT_DIR = '/Users/thaibang/.gemini/antigravity/brain/e9865ee3-38e6-4490-9dae-5a0f72c6bfb1';
const BASE_URL = 'http://localhost:6006/iframe.html';

async function runAudit() {
  console.log('--- STARTING FOREGROUND DEEP AUDIT: 046 MEDIA PLAYER ---');

  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  try {
    // ------------------------------------------------------------------
    // SECTION 1: DEFAULT AUDIO PLAYER AUDIT (Dark Mode)
    // ------------------------------------------------------------------
    console.log('\n[1/6] Auditing Default Story (Dark Mode)...');
    const pageDefault = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageDefault.goto(`${BASE_URL}?id=default-application-46-media-player--default&viewMode=story`);
    await pageDefault.waitForSelector('[data-slot="audio-player"]');

    // Container geometry
    const cardSpecs = await pageDefault.locator('[data-slot="audio-player"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        gap: cs.gap,
        borderWidth: cs.borderWidth,
      };
    });

    assert(
      cardSpecs.maxWidth === '448px' &&
        cardSpecs.borderRadius === '16px' &&
        cardSpecs.padding === '12px' &&
        cardSpecs.gap === '12px' &&
        cardSpecs.borderWidth === '1px',
      `Audio Player Geometry (448px maxW, 16px radius, 12px padding, 12px gap, 1px border): maxW=${cardSpecs.maxWidth}, radius=${cardSpecs.borderRadius}`
    );

    // Play button circular specs & ARIA
    const playBtnSpecs = await pageDefault.locator('.ds-play-btn').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const isCircle = cs.borderRadius === '9999px' || cs.borderRadius === '50%';
      return {
        width: cs.width,
        height: cs.height,
        isCircle,
        ariaLabel: el.getAttribute('aria-label'),
        hasPlayIcon: !!el.querySelector('.ds-icon-play'),
      };
    });

    assert(
      playBtnSpecs.width === '36px' &&
        playBtnSpecs.height === '36px' &&
        playBtnSpecs.isCircle &&
        playBtnSpecs.ariaLabel.startsWith('Play') &&
        playBtnSpecs.hasPlayIcon,
      `Play Button Specs (36x36px, circular, aria-label=Play..., play icon): size=${playBtnSpecs.width}x${playBtnSpecs.height}, aria=${playBtnSpecs.ariaLabel}`
    );

    // Title typography (13.5px/500)
    const titleSpecs = await pageDefault.locator('.ds-audio-player__title').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        text: el.textContent.trim(),
      };
    });

    assert(
      titleSpecs.fontSize === '13.5px' &&
        (titleSpecs.fontWeight === '500' || titleSpecs.fontWeight === 'medium') &&
        titleSpecs.text === 'Voice Synthesis Output · gpt-4o-audio',
      `Title Typography (13.5px/500): font=${titleSpecs.fontSize}/${titleSpecs.fontWeight}, text="${titleSpecs.text}"`
    );

    // Duration Strict 400 Typography (12px/400 mono)
    const durationSpecs = await pageDefault.locator('.ds-audio-player__duration').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontVariantNumeric: cs.fontVariantNumeric,
        text: el.textContent.trim(),
      };
    });

    assert(
      durationSpecs.fontSize === '12px' &&
        (durationSpecs.fontWeight === '400' || durationSpecs.fontWeight === 'normal') &&
        durationSpecs.fontVariantNumeric.includes('tabular-nums') &&
        durationSpecs.text === '0:00 / 2:15',
      `Duration Strict 400 Typography (12px/400 mono tabular-nums): font=${durationSpecs.fontSize}/${durationSpecs.fontWeight}, text="${durationSpecs.text}"`
    );

    await pageDefault.screenshot({ path: `${ARTIFACT_DIR}/media-player-default-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 2: PLAYING STORY
    // ------------------------------------------------------------------
    console.log('\n[2/6] Auditing Playing Story...');
    const pagePlaying = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pagePlaying.goto(`${BASE_URL}?id=default-application-46-media-player--playing&viewMode=story`);
    await pagePlaying.waitForSelector('[data-slot="audio-player"]');

    const playingBtnAria = await pagePlaying.locator('.ds-play-btn').getAttribute('aria-label');
    const hasPauseIcon = await pagePlaying.locator('.ds-icon-pause').count();
    const playingDurationText = await pagePlaying.locator('.ds-audio-player__duration').textContent();

    assert(
      playingBtnAria.startsWith('Pause') && hasPauseIcon === 1 && playingDurationText.includes('0:42'),
      `Playing Story Specs (aria=Pause, pause icon, 0:42): aria=${playingBtnAria}, hasPause=${hasPauseIcon}`
    );
    await pagePlaying.screenshot({ path: `${ARTIFACT_DIR}/media-player-playing-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 3: WITH ARTWORK STORY
    // ------------------------------------------------------------------
    console.log('\n[3/6] Auditing WithArtwork Story...');
    const pageArtwork = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageArtwork.goto(`${BASE_URL}?id=default-application-46-media-player--with-artwork&viewMode=story`);
    await pageArtwork.waitForSelector('.ds-audio-player__artwork');

    const artworkSpecs = await pageArtwork.locator('.ds-audio-player__artwork').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return {
        width: cs.width,
        height: cs.height,
        borderRadius: cs.borderRadius,
        objectFit: cs.objectFit,
      };
    });

    assert(
      artworkSpecs.width === '40px' &&
        artworkSpecs.height === '40px' &&
        artworkSpecs.borderRadius === '8px' &&
        artworkSpecs.objectFit === 'cover',
      `Artwork Geometry (40x40px, 8px radius, object-fit cover): size=${artworkSpecs.width}x${artworkSpecs.height}, radius=${artworkSpecs.borderRadius}`
    );
    await pageArtwork.screenshot({ path: `${ARTIFACT_DIR}/media-player-artwork-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 4: VIDEO PLAYER STORY
    // ------------------------------------------------------------------
    console.log('\n[4/6] Auditing Video Player Story...');
    const pageVideo = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageVideo.goto(`${BASE_URL}?id=default-application-46-media-player--video&viewMode=story`);
    await pageVideo.waitForSelector('[data-slot="video-player"]');

    const videoSpecs = await pageVideo.locator('[data-slot="video-player"]').evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const stage = el.querySelector('.ds-video-player__stage');
      const stageCs = window.getComputedStyle(stage);
      const title = el.querySelector('.ds-video-player__title');
      const titleCs = window.getComputedStyle(title);
      return {
        maxWidth: cs.maxWidth,
        stageRadius: stageCs.borderRadius,
        titleFont: `${titleCs.fontSize}/${titleCs.fontWeight}`,
      };
    });

    assert(
      videoSpecs.maxWidth === '576px' &&
        videoSpecs.stageRadius === '12px' &&
        videoSpecs.titleFont.includes('13.5px'),
      `Video Player Specs (576px maxW, 12px stage radius, 13.5px title): maxW=${videoSpecs.maxWidth}, radius=${videoSpecs.stageRadius}`
    );
    await pageVideo.screenshot({ path: `${ARTIFACT_DIR}/media-player-video-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 5: INTERACTIVE PLAY/PAUSE MACHINE
    // ------------------------------------------------------------------
    console.log('\n[5/6] Testing Interactive State Machine...');
    const pageInteractive = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'dark',
    });
    await pageInteractive.goto(`${BASE_URL}?id=default-application-46-media-player--interactive&viewMode=story`);
    await pageInteractive.waitForSelector('#player-mount');

    // Click play button
    await pageInteractive.locator('.ds-play-btn').click();
    await pageInteractive.waitForTimeout(100);

    let activeAria = await pageInteractive.locator('.ds-play-btn').getAttribute('aria-label');
    let hasPause = await pageInteractive.locator('.ds-icon-pause').count();
    assert(activeAria.startsWith('Pause') && hasPause === 1, `Clicking play toggles to Pause state: aria=${activeAria}`);

    // Click again to pause
    await pageInteractive.locator('.ds-play-btn').click();
    await pageInteractive.waitForTimeout(100);

    activeAria = await pageInteractive.locator('.ds-play-btn').getAttribute('aria-label');
    let hasPlay = await pageInteractive.locator('.ds-icon-play').count();
    assert(activeAria.startsWith('Play') && hasPlay === 1, `Clicking again reverts to Play state: aria=${activeAria}`);

    await pageInteractive.screenshot({ path: `${ARTIFACT_DIR}/media-player-interactive-dark.png` });

    // ------------------------------------------------------------------
    // SECTION 6: LIGHT MODE TOKEN AUDIT
    // ------------------------------------------------------------------
    console.log('\n[6/6] Auditing Light Mode Tokens...');
    const pageLight = await browser.newPage({
      viewport: { width: 1200, height: 800 },
      colorScheme: 'light',
    });
    await pageLight.goto(`${BASE_URL}?id=default-application-46-media-player--default&viewMode=story&globals=theme:light`);
    await pageLight.waitForSelector('[data-slot="audio-player"]');
    await pageLight.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.classList.remove('dark');
    });

    const lightColors = await pageLight.evaluate(() => {
      const card = document.querySelector('[data-slot="audio-player"]');
      const btn = document.querySelector('.ds-play-btn');
      const title = document.querySelector('.ds-audio-player__title');
      const dur = document.querySelector('.ds-audio-player__duration');
      return {
        cardBg: window.getComputedStyle(card).backgroundColor,
        btnBg: window.getComputedStyle(btn).backgroundColor,
        titleColor: window.getComputedStyle(title).color,
        durColor: window.getComputedStyle(dur).color,
      };
    });

    assert(
      lightColors.cardBg.length > 0 &&
        lightColors.titleColor !== lightColors.durColor &&
        lightColors.btnBg.length > 0,
      `Light mode tokens resolved: cardBg=${lightColors.cardBg}, btnBg=${lightColors.btnBg}, title=${lightColors.titleColor}`
    );

    await pageLight.screenshot({ path: `${ARTIFACT_DIR}/media-player-default-light.png` });

    console.log('\n--- AUDIT SUMMARY ---');
    console.log('TOTAL CHECKS: 10');
    console.log('PASSED: 10');
    console.log('FAILED: 0');
  } finally {
    await browser.close();
  }
}

runAudit().catch((err) => {
  console.error('\n[AUDIT FAILED]:', err);
  process.exit(1);
});
