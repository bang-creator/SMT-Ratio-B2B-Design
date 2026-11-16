import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 105 Orb AUI',
  parameters: { layout: 'padded' },
};

const MIC_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
const MIC_OFF = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="2" y1="2" x2="22" y2="22"></line><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path><path d="M5 10v2a7 7 0 0 0 12 5"></path><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"></path><path d="M9 9v3a3 3 0 0 0 5.12 2.12"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
const PHONE_OFF = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`;

function renderOrb({
  state = 'listening',
  label = 'Listening',
  interactive = false,
} = {}) {
  const isIdle = state === 'idle';
  const isConnecting = state === 'connecting';
  const isListening = state === 'listening';
  const isMuted = state === 'muted';

  let orbClass = 'ds-voice-orb';
  if (isIdle) orbClass += ' ds-voice-orb--idle';
  if (isConnecting) orbClass += ' ds-voice-orb--connecting';
  if (isListening) orbClass += ' ds-voice-orb--listening';
  if (isMuted) orbClass += ' ds-voice-orb--muted';

  return `
    <div
      data-slot="orb"
      class="ds-voice-orb-wrap"
      data-state="${state}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-voice-orb-stage">
        <div
          class="${orbClass}"
          data-slot="orb-core"
          role="img"
          aria-label="Voice orb in ${state} state"
        >
          <span class="ds-voice-orb__ripple" aria-hidden="true"></span>
          <span class="ds-voice-orb__ripple" aria-hidden="true"></span>
        </div>
      </div>

      <span class="ds-voice-orb__label" data-slot="orb-label">${label}</span>

      <div class="ds-voice-orb__controls" data-slot="orb-controls">
        ${isIdle ? `
          <button type="button" class="ds-voice-orb__btn" data-action="connect">
            Connect
          </button>
        ` : `
          <button
            type="button"
            aria-label="${isMuted ? 'Unmute microphone' : 'Mute microphone'}"
            class="ds-voice-orb__icon-btn"
            data-action="toggle-mute"
          >
            ${isMuted ? MIC_OFF : MIC_ICON}
          </button>
          <button
            type="button"
            aria-label="End session"
            class="ds-voice-orb__icon-btn ds-voice-orb__btn--danger"
            data-action="end-session"
          >
            ${PHONE_OFF}
          </button>
        `}
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(wrap) {
  const orb = wrap.querySelector('[data-slot="orb-core"]');
  const label = wrap.querySelector('[data-slot="orb-label"]');
  const controls = wrap.querySelector('[data-slot="orb-controls"]');

  function setState(newState) {
    wrap.setAttribute('data-state', newState);
    orb.className = 'ds-voice-orb';
    if (newState === 'idle') {
      orb.classList.add('ds-voice-orb--idle');
      label.textContent = 'Idle';
      controls.innerHTML = `
        <button type="button" class="ds-voice-orb__btn" data-action="connect">
          Connect
        </button>
      `;
      bindControls();
    } else if (newState === 'connecting') {
      orb.classList.add('ds-voice-orb--connecting');
      label.textContent = 'Connecting';
      setTimeout(() => setState('listening'), 800);
    } else if (newState === 'listening') {
      orb.classList.add('ds-voice-orb--listening');
      label.textContent = 'Listening';
      controls.innerHTML = `
        <button type="button" aria-label="Mute microphone" class="ds-voice-orb__icon-btn" data-action="toggle-mute">
          ${MIC_ICON}
        </button>
        <button type="button" aria-label="End session" class="ds-voice-orb__icon-btn ds-voice-orb__btn--danger" data-action="end-session">
          ${PHONE_OFF}
        </button>
      `;
      bindControls();
    } else if (newState === 'muted') {
      orb.classList.add('ds-voice-orb--muted');
      label.textContent = 'Muted';
      controls.innerHTML = `
        <button type="button" aria-label="Unmute microphone" class="ds-voice-orb__icon-btn" data-action="toggle-mute">
          ${MIC_OFF}
        </button>
        <button type="button" aria-label="End session" class="ds-voice-orb__icon-btn ds-voice-orb__btn--danger" data-action="end-session">
          ${PHONE_OFF}
        </button>
      `;
      bindControls();
    }
  }

  function bindControls() {
    const connectBtn = wrap.querySelector('[data-action="connect"]');
    const muteBtn = wrap.querySelector('[data-action="toggle-mute"]');
    const endBtn = wrap.querySelector('[data-action="end-session"]');

    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        setState('connecting');
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const curr = wrap.getAttribute('data-state');
        setState(curr === 'muted' ? 'listening' : 'muted');
      });
    }

    if (endBtn) {
      endBtn.addEventListener('click', () => {
        setState('idle');
      });
    }
  }

  bindControls();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderOrb({ state: 'listening', label: 'Listening', interactive: true });
    const wrap = root.querySelector('[data-slot="orb"]');
    if (wrap) attachInteractiveHandlers(wrap);
    return root;
  },
};

export const Idle = story(renderOrb({ state: 'idle', label: 'Idle' }));

export const Connecting = story(renderOrb({ state: 'connecting', label: 'Connecting' }));

export const Listening = story(renderOrb({ state: 'listening', label: 'Listening' }));

export const Muted = story(renderOrb({ state: 'muted', label: 'Muted' }));
