import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 141 Playlist AUI',
  parameters: { layout: 'padded' },
};

const PLAY_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const PAUSE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const MUSIC_ICON = `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-label="Playlist cover graphic"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;

function renderPlaylistCard({
  title = 'Focus Flow',
  curator = 'Curated by AI Assistant · 42 min',
  tracks = [
    { num: '1', name: 'Morning Light', artist: 'Aria Sol', duration: '3:24', playing: false },
    { num: '2', name: 'Deep Resonance', artist: 'Kaelen', duration: '4:12', playing: false },
    { num: '3', name: 'Slow Horizon', artist: 'Vega', duration: '5:08', playing: false },
  ],
  status = 'idle', // 'idle' | 'playing' | 'empty'
} = {}) {
  if (status === 'empty' || tracks.length === 0) {
    return `
      <div class="ds-generative-card" data-slot="generative-card">
        <div class="ds-gen-playlist-card__cover">
          ${MUSIC_ICON}
        </div>
        <div class="ds-gen-playlist-card__divider"></div>
        <h3 class="ds-gen-playlist-card__title">${title}</h3>
        <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
          <span class="ds-text-xs ds-text-secondary">This playlist has no tracks yet.</span>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2">
            Add tracks
          </button>
        </div>
      </div>
    `;
  }

  const tracksHtml = tracks
    .map(
      (tr) => `
    <div class="ds-gen-playlist-card__track-row ${tr.playing ? 'ds-bg-surface-secondary' : ''}" data-track-id="${tr.num}">
      <div class="ds-gen-playlist-card__track-left">
        <span class="ds-gen-playlist-card__track-num">${tr.playing ? `<span class="ds-beacon ds-beacon--online"></span>` : tr.num}</span>
        <div class="ds-gen-playlist-card__track-info">
          <span class="ds-gen-playlist-card__track-name">${tr.name}</span>
          <span class="ds-gen-playlist-card__track-artist">${tr.artist} · ${tr.duration}</span>
        </div>
      </div>
      <button type="button" class="ds-gen-playlist-card__play-btn" data-action="toggle-play" data-track-id="${tr.num}" aria-label="${tr.playing ? 'Pause' : 'Play'} ${tr.name}">
        ${tr.playing ? PAUSE_ICON : PLAY_ICON}
      </button>
    </div>
  `
    )
    .join('');

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-playlist-card__cover">
        ${MUSIC_ICON}
      </div>

      <div class="ds-gen-playlist-card__divider"></div>

      <div class="ds-flex ds-items-center ds-justify-between">
        <div>
          <h3 class="ds-gen-playlist-card__title">${title}</h3>
          <span class="ds-text-xs ds-text-secondary">${curator}</span>
        </div>
        <button type="button" class="ds-button ds-button--primary ds-button--xs" data-action="play-all">
          ${PLAY_ICON} Play all
        </button>
      </div>

      <div class="ds-gen-playlist-card__tracks ds-mt-2" data-slot="tracks">
        ${tracksHtml}
      </div>
    </div>
  `;
}

function attachPlaylistHandler(root) {
  root.querySelectorAll('[data-action="toggle-play"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isPaused = btn.innerHTML.includes('polygon');
      root.querySelectorAll('[data-action="toggle-play"]').forEach((b) => {
        b.innerHTML = PLAY_ICON;
        b.setAttribute('aria-label', 'Play');
      });
      root.querySelectorAll('.ds-gen-playlist-card__track-row').forEach((row) => {
        row.classList.remove('ds-bg-surface-secondary');
      });

      if (isPaused) {
        btn.innerHTML = PAUSE_ICON;
        btn.setAttribute('aria-label', 'Pause');
        const row = btn.closest('.ds-gen-playlist-card__track-row');
        if (row) row.classList.add('ds-bg-surface-secondary');
      }
    });
  });

  const playAllBtn = root.querySelector('[data-action="play-all"]');
  if (playAllBtn) {
    playAllBtn.addEventListener('click', () => {
      const firstPlayBtn = root.querySelector('[data-action="toggle-play"]');
      if (firstPlayBtn) firstPlayBtn.click();
    });
  }
}

export const Default = story(
  () => stage(renderPlaylistCard()),
  { postRender: attachPlaylistHandler }
);

export const Playing = story(() =>
  stage(
    renderPlaylistCard({
      tracks: [
        { num: '1', name: 'Morning Light', artist: 'Aria Sol', duration: '3:24', playing: false },
        { num: '2', name: 'Deep Resonance', artist: 'Kaelen', duration: '4:12', playing: true },
        { num: '3', name: 'Slow Horizon', artist: 'Vega', duration: '5:08', playing: false },
      ],
      status: 'playing',
    })
  )
);

export const Empty = story(() =>
  stage(
    renderPlaylistCard({
      tracks: [],
      status: 'empty',
    })
  )
);

export const LongTracklist = story(() =>
  stage(
    renderPlaylistCard({
      title: 'Deep Work Session (Extended)',
      curator: 'Curated by AI Assistant · 1 hr 15 min',
      tracks: [
        { num: '1', name: 'Morning Light', artist: 'Aria Sol', duration: '3:24' },
        { num: '2', name: 'Deep Resonance', artist: 'Kaelen', duration: '4:12' },
        { num: '3', name: 'Slow Horizon', artist: 'Vega', duration: '5:08' },
        { num: '4', name: 'Atmosphere Drift', artist: 'Lumina', duration: '6:15' },
        { num: '5', name: 'Modular Waves', artist: 'Soma Sound', duration: '4:45' },
        { num: '6', name: 'Distant Pulse', artist: 'Cortex', duration: '5:32' },
      ],
    })
  )
);
