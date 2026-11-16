import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 86 Voice conversation AUI',
  parameters: { layout: 'padded' },
};

const MIC_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
const MIC_OFF = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path><path d="M5 10v2a7 7 0 0 0 12 5"></path><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"></path><path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
const PHONE_OFF = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.12-8.69A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="22" y1="2" x2="2" y2="22"></line></svg>`;

const DEFAULT_TURNS = [
  { id: 'u1', role: 'user', text: 'What broke in the last deploy?' },
  { id: 'a1', role: 'assistant', text: 'The converter dropped empty parts. I pushed a guard.' },
];

const LONG_TURNS = [
  ...DEFAULT_TURNS,
  {
    id: 'u2',
    role: 'user',
    text: 'Okay, and did that guard also cover the tool result parts, or only the text ones? I saw a blank bubble in staging this morning.',
  },
  {
    id: 'a2',
    role: 'assistant',
    text: 'Only text parts. Tool results with no output still reach the renderer. I can extend the guard to skip them and add a test for the staging case.',
  },
];

function renderVoiceConversation({
  mode = 'listening',
  hint = null,
  turns = DEFAULT_TURNS,
  muted = false,
  amplitude = 'normal',
  interactive = true,
  disabled = false,
} = {}) {
  const defaultHints = {
    connecting: 'Opening the mic',
    listening: 'Listening for you',
    thinking: 'Working on it',
    speaking: 'Playing the reply',
  };
  const activeHint = muted ? 'Mic off' : (hint || (mode === 'speaking' ? 'Tap to interrupt' : defaultHints[mode] || 'Listening for you'));

  return `
    <div data-slot="voice-conversation" class="ds-voice-card" data-mode="${mode}" data-amplitude="${amplitude}">
      <button
        type="button"
        class="ds-voice-orb-btn"
        aria-label="${mode === 'speaking' ? 'Interrupt the assistant' : 'Voice visualizer'}"
        ${mode === 'speaking' || interactive ? 'data-interactive="true"' : 'disabled'}
      >
        <span aria-hidden="true" class="ds-voice-ring ds-voice-ring--lg"></span>
        <span aria-hidden="true" class="ds-voice-ring ds-voice-ring--md"></span>
        <span aria-hidden="true" class="ds-voice-core"></span>
      </button>

      <div class="ds-flex ds-flex-col ds-items-center ds-gap-1">
        <span class="ds-voice-caption">${mode}</span>
        <span class="ds-voice-hint">${activeHint}</span>
      </div>

      <div class="ds-voice-transcript">
        ${turns.map((t) => `
          <div class="ds-voice-turn">
            <span class="ds-voice-speaker ${t.role === 'user' ? 'ds-voice-speaker--user' : ''}">${t.role === 'user' ? 'you' : 'ai'}</span>
            <span class="ds-voice-text ${t.role === 'user' ? 'ds-voice-text--user' : ''}">${t.text}</span>
          </div>
        `).join('')}
      </div>

      <div class="ds-voice-actions">
        <button
          type="button"
          aria-label="${muted ? 'Turn microphone on' : 'Turn microphone off'}"
          aria-pressed="${muted}"
          class="ds-voice-btn"
          ${disabled ? 'disabled' : ''}
          data-slot="mic-toggle"
        >
          ${muted ? MIC_OFF : MIC_ICON}
        </button>
        <button
          type="button"
          aria-label="End call"
          class="ds-voice-end-btn"
          ${disabled ? 'disabled' : ''}
          data-slot="end-call"
        >
          ${PHONE_OFF}
        </button>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentMode = 'listening';
    let isMuted = false;
    let ended = false;

    const render = () => {
      let bodyHtml = '';
      let badgeText = isMuted ? 'Muted' : `${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`;

      if (ended) {
        badgeText = 'Call Ended';
        bodyHtml = `
          <div data-slot="voice-conversation" class="ds-voice-card ds-voice-card--ended ds-flex ds-items-center ds-justify-center">
            <span class="ds-voice-caption" data-slot="call-ended-status">Call ended</span>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-3" data-slot="restart-call">
              Restart call
            </button>
          </div>
        `;
      } else {
        bodyHtml = renderVoiceConversation({
          mode: currentMode,
          muted: isMuted,
          turns: DEFAULT_TURNS,
          interactive: true,
        });
      }

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">86 Voice conversation AUI</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${bodyHtml}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="restart-call"]')?.addEventListener('click', () => {
        ended = false;
        currentMode = 'listening';
        isMuted = false;
        render();
      });

      root.querySelector('[data-slot="mic-toggle"]')?.addEventListener('click', () => {
        isMuted = !isMuted;
        render();
      });

      root.querySelector('[data-slot="end-call"]')?.addEventListener('click', () => {
        ended = true;
        render();
      });

      root.querySelector('.ds-voice-orb-btn')?.addEventListener('click', () => {
        if (currentMode === 'speaking') {
          currentMode = 'listening';
        } else if (currentMode === 'listening') {
          currentMode = 'thinking';
        } else if (currentMode === 'thinking') {
          currentMode = 'speaking';
        } else {
          currentMode = 'listening';
        }
        render();
      });
    };

    render();
    return root;
  },
};

export const Connecting = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">86 Voice conversation AUI (Connecting)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Opening Mic</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceConversation({
        mode: 'connecting',
        transcript: [],
        turns: [],
        amplitude: 'low',
      })}
    </div>
  </div>
`);

export const Speaking = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">86 Voice conversation AUI (Speaking)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">AI Playing Reply</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceConversation({
        mode: 'speaking',
        turns: DEFAULT_TURNS,
        amplitude: 'high',
      })}
    </div>
  </div>
`);

export const LongTranscript = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">86 Voice conversation AUI (Long Transcript)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Multi-turn History</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderVoiceConversation({
        mode: 'listening',
        turns: LONG_TURNS,
        amplitude: 'normal',
      })}
    </div>
  </div>
`);
