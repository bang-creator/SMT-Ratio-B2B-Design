import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 87 Read aloud',
  parameters: { layout: 'padded' },
};

const PLAY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const PAUSE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const VOLUME_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

const WORDS =
  'The converter dropped parts with no text, so the guard now keeps them and the suite passes again.'.split(' ');

const LONG_WORDS =
  'The deploy failed because the message converter dropped parts that had no text. Tool results with an empty output were removed before the renderer saw them, so the thread showed a blank bubble and the snapshot tests failed. I added a guard that keeps empty parts, covered the tool result case in a new test, and the full suite passes again on main. The fix is in the latest canary, and the stable release goes out tomorrow morning.'.split(' ');

function renderReadAloud({
  words = WORDS,
  spokenIndex = 9,
  playing = true,
  rate = 1,
  elapsed = '0:02',
  duration = '0:05',
  progress = 50,
} = {}) {
  return `
    <div data-slot="read-aloud" class="ds-read-aloud" data-progress="${progress}">
      <p class="ds-read-aloud__text">
        ${words.map((word, i) => {
          let cls = 'ds-read-aloud__word';
          if (i === spokenIndex) {
            cls += ' ds-read-aloud__word--current';
          } else if (i < spokenIndex) {
            cls += ' ds-read-aloud__word--past';
          }
          return `<span class="${cls}">${word} </span>`;
        }).join('')}
      </p>

      <div class="ds-read-aloud__controls">
        <button
          type="button"
          aria-label="${playing ? 'Pause' : 'Play'}"
          class="ds-read-aloud__play-btn"
          data-slot="play-toggle"
        >
          ${playing ? PAUSE_ICON : PLAY_ICON}
        </button>

        <span
          role="progressbar"
          aria-label="Read aloud progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${progress}"
          aria-valuetext="${elapsed} of ${duration}"
          class="ds-read-aloud__track"
        >
          <span class="ds-read-aloud__bar"></span>
        </span>

        <span class="ds-read-aloud__time" data-slot="time-display">${elapsed} / ${duration}</span>

        <button
          type="button"
          aria-label="Playback speed, currently ${rate} times"
          class="ds-read-aloud__rate-btn"
          data-slot="rate-toggle"
        >
          ${rate}×
        </button>

        <span class="ds-read-aloud__vol-icon" aria-hidden="true">${VOLUME_ICON}</span>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isPlaying = false;
    let spokenIdx = 0;
    let rate = 1;
    let timerId = null;

    const stopTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    function getProgress() {
      return Math.round((spokenIdx / WORDS.length) * 100);
    }

    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function render() {
      const progress = getProgress();
      const durationSecs = Math.round(5 / rate);
      const elapsedSecs = Math.round((spokenIdx / WORDS.length) * durationSecs);
      const badgeText = isPlaying ? `Playing · ${rate}x` : spokenIdx > 0 ? 'Paused' : 'Ready to Read';

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">87 Read aloud</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderReadAloud({
              words: WORDS,
              spokenIndex: spokenIdx,
              playing: isPlaying,
              rate: rate,
              elapsed: formatTime(elapsedSecs),
              duration: formatTime(durationSecs),
              progress: Math.min(100, Math.max(0, Math.round(progress / 10) * 10)),
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="play-toggle"]')?.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          if (spokenIdx >= WORDS.length) spokenIdx = 0;
          stopTimer();
          timerId = setInterval(() => {
            spokenIdx += 1;
            if (spokenIdx >= WORDS.length) {
              isPlaying = false;
              stopTimer();
            }
            render();
          }, Math.round(300 / rate));
        } else {
          stopTimer();
        }
        render();
      });

      root.querySelector('[data-slot="rate-toggle"]')?.addEventListener('click', () => {
        if (rate === 1) rate = 1.5;
        else if (rate === 1.5) rate = 2;
        else rate = 1;
        if (isPlaying) {
          stopTimer();
          timerId = setInterval(() => {
            spokenIdx += 1;
            if (spokenIdx >= WORDS.length) {
              isPlaying = false;
              stopTimer();
            }
            render();
          }, Math.round(300 / rate));
        }
        render();
      });
    }

    render();
    return root;
  },
};

export const Playing = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">87 Read aloud (Playing)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Midway Through</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderReadAloud({
        words: WORDS,
        spokenIndex: 9,
        playing: true,
        rate: 1,
        elapsed: '0:02',
        duration: '0:05',
        progress: 50,
      })}
    </div>
  </div>
`);

export const Fast = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">87 Read aloud (Double Speed)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">2.0× Playback</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderReadAloud({
        words: WORDS,
        spokenIndex: 6,
        playing: true,
        rate: 2,
        elapsed: '0:01',
        duration: '0:02',
        progress: 40,
      })}
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">87 Read aloud (Long Answer)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Full Paragraph</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderReadAloud({
        words: LONG_WORDS,
        spokenIndex: 31,
        playing: true,
        rate: 1.25,
        elapsed: '0:07',
        duration: '0:16',
        progress: 50,
      })}
    </div>
  </div>
`);
