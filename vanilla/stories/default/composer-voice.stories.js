import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 80 Dictation',
  parameters: { layout: 'padded' },
};

const ICONS = {
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  mic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
  square: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
};

const RECORDING_BAR_HEIGHTS = ['8', '16', '20', '12', '18', '10', '14', '8'];

function renderVoiceComposer({ voice = 'idle', seconds = 0, value = '' } = {}) {
  const active = voice !== 'idle';
  const isRecording = voice === 'recording';
  const isTranscribing = voice === 'transcribing';

  return `
    <div data-slot="composer" class="ds-composer">
      <div data-slot="composer-bar" class="ds-composer-bar">
        ${
          active
            ? `
          <div
            data-slot="composer-voice"
            data-recording="${isRecording}"
            data-state="${voice}"
            class="ds-composer-voice"
          >
            ${isRecording ? `<span class="ds-composer-voice-dot" aria-hidden="true"></span>` : ''}

            <div class="ds-composer-voice-bars" aria-hidden="true">
              ${(isRecording ? RECORDING_BAR_HEIGHTS : ['3', '3', '3', '3', '3', '3', '3', '3'])
                .map((h) => `<span class="ds-composer-voice-bar" data-h="${h}"></span>`)
                .join('')}
            </div>

            ${
              isRecording
                ? `<span class="ds-composer-voice-timer">0:${seconds < 10 ? '0' + seconds : seconds}</span>`
                : `<span class="ds-composer-voice-transcribing">Transcribing...</span>`
            }
          </div>
        `
            : `
          <input
            type="text"
            data-slot="composer-input"
            class="ds-composer-input"
            placeholder="Ask anything or click the microphone to dictate"
            value="${value}"
            aria-label="Composer query input"
          />
        `
        }

        <div data-slot="composer-toolbar" class="ds-composer-toolbar">
          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-attach"
              class="ds-composer-attach-btn ds-icon-button ds-icon-button--ghost ds-button--pill"
              aria-label="Add attachment"
            >
              ${ICONS.plus}
            </button>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-voice-button"
              data-active="${active}"
              class="ds-composer-voice-btn ${active ? 'ds-composer-voice-btn--active' : ''}"
              aria-label="${active ? 'Stop recording' : 'Start voice input'}"
            >
              ${active ? ICONS.square : ICONS.mic}
            </button>

            <button
              type="button"
              data-slot="composer-send"
              data-state="${value.trim().length > 0 ? 'active' : 'idle'}"
              class="ds-composer-send-btn ${value.trim().length > 0 ? 'ds-composer-send-btn--active' : ''}"
              aria-label="Send message"
              ${value.trim().length === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowUp}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentVoice = 'idle';
    let currentSeconds = 0;
    let currentVal = '';
    let timerId = null;

    const stopTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };

    const render = () => {
      const badgeText = currentVoice === 'recording'
        ? `Recording · 0:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`
        : currentVoice === 'transcribing'
        ? 'Transcribing Audio'
        : currentVal
        ? 'Transcribed & Ready'
        : 'Microphone Idle';

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">80 Dictation</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderVoiceComposer({ voice: currentVoice, seconds: currentSeconds, value: currentVal })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="composer-input"]');
      input?.addEventListener('input', (e) => {
        currentVal = e.target.value;
      });

      const voiceBtn = root.querySelector('[data-slot="composer-voice-button"]');
      voiceBtn?.addEventListener('click', () => {
        if (currentVoice === 'idle') {
          currentVoice = 'recording';
          currentSeconds = 1;
          currentVal = '';
          stopTimer();
          timerId = setInterval(() => {
            currentSeconds += 1;
            const timerEl = root.querySelector('.ds-composer-voice-timer');
            if (timerEl) {
              timerEl.textContent = `0:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
            }
          }, 1000);
          render();
        } else if (currentVoice === 'recording') {
          stopTimer();
          currentVoice = 'transcribing';
          render();
          setTimeout(() => {
            if (currentVoice === 'transcribing') {
              currentVoice = 'idle';
              currentVal = 'Add a regression test for draft restore';
              render();
            }
          }, 1200);
        } else if (currentVoice === 'transcribing') {
          currentVoice = 'idle';
          currentVal = 'Add a regression test for draft restore';
          render();
        }
      });

      root.querySelector('[data-slot="composer-send"]')?.addEventListener('click', () => {
        if (currentVal.trim().length > 0) {
          currentVal = '';
          currentVoice = 'idle';
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const Recording = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">80 Dictation (Recording)</span>
      <span class="ds-badge ds-badge--danger ds-badge--sm">Live Mic</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceComposer({ voice: 'recording', seconds: 14 })}
    </div>
  </div>
`);

export const Transcribing = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">80 Dictation (Transcribing)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Processing</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceComposer({ voice: 'transcribing', seconds: 14 })}
    </div>
  </div>
`);

export const Transcribed = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">80 Dictation (Transcribed)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Draft Ready</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceComposer({ voice: 'idle', value: 'Add a regression test for draft restore' })}
    </div>
  </div>
`);
