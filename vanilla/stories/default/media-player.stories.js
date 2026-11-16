import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 46 Media Player',
  parameters: { layout: 'padded' },
};

const PLAY_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" class="ds-icon-play">
    <polygon points="6 4 20 12 6 20 6 4"></polygon>
  </svg>
`;

const PAUSE_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" class="ds-icon-pause">
    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
  </svg>
`;

function renderAudioPlayer({
  title = 'Voice Synthesis Output · gpt-4o-audio',
  currentTime = '0:00',
  duration = '2:15',
  currentSec = 0,
  totalSec = 135,
  playing = false,
  artwork = '',
  hasError = false,
} = {}) {
  const playbackLabel = title ? ` ${title}` : ' audio';
  const actionLabel = playing ? 'Pause' : 'Play';

  return `
    <div data-slot="audio-player" class="ds-audio-player">
      ${
        artwork
          ? `<img src="${artwork}" alt="" class="ds-audio-player__artwork" />`
          : ''
      }
      <button
        type="button"
        aria-label="${actionLabel}${playbackLabel}"
        class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-button--icon ds-play-btn ds-audio-player__play-btn"
        ${hasError ? 'disabled' : ''}
      >
        ${playing ? PAUSE_ICON : PLAY_ICON}
      </button>
      <div class="ds-audio-player__info">
        <span class="ds-audio-player__title">${title}</span>
        <input
          type="range"
          min="0"
          max="${totalSec}"
          step="0.1"
          value="${currentSec}"
          class="ds-media-slider ds-audio-player__slider"
          aria-label="Seek"
          aria-valuetext="${currentTime} of ${duration}"
          ${hasError ? 'disabled' : ''}
        />
      </div>
      <span class="ds-audio-player__duration">${currentTime} / ${duration}</span>
    </div>
  `;
}

function renderVideoPlayer({
  title = 'Autonomous Agent Demonstration · Screen Capture',
  duration = '1:45',
} = {}) {
  return `
    <div data-slot="video-player" class="ds-video-player">
      <div class="ds-video-player__stage">
        <div class="ds-center ds-h-full ds-w-full ds-text-muted ds-font-mono ds-text-xs">
          [ 16:9 Video Canvas Surface ]
        </div>
      </div>
      <div class="ds-video-player__meta">
        <span class="ds-video-player__title">${title}</span>
        <span class="ds-video-player__duration">${duration}</span>
      </div>
    </div>
  `;
}

function bindAudioEvents(root) {
  let isPlaying = false;
  let currentSec = 0;
  const totalSec = 135;

  function update() {
    const target = root.querySelector('.ds-media-target');
    if (target) {
      const min = Math.floor(currentSec / 60);
      const sec = Math.floor(currentSec % 60);
      const currentTime = `${min}:${sec < 10 ? '0' : ''}${sec}`;
      target.innerHTML = renderAudioPlayer({
        playing: isPlaying,
        currentSec,
        totalSec,
        currentTime,
      });
      attach();
    }
  }

  function attach() {
    const btn = root.querySelector('.ds-audio-player__play-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          currentSec = 14;
        }
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>46 Media Player (Interactive Audio Synthesizer)</code></header>
        <div class="ds-media-target">
          ${renderAudioPlayer({ playing: false, currentTime: '0:00' })}
        </div>
      </section>
    `;
    bindAudioEvents(root);
    return root;
  },
};

export const Video = story(
  'Default / Application / 46 Media Player / Video',
  stage('Video Player Surface', renderVideoPlayer())
);
