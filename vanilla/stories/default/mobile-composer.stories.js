import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 99 Mobile composer',
  parameters: { layout: 'padded' },
};

const PLUS_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const MIC_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`;
const ARROW_UP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
const SQUARE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>`;

const DEFAULT_ACTIONS = ['Summarize', 'Explain code', 'Write tests', 'Find a bug'];

function renderMobileComposer({
  value = '',
  keyboardOpen = false,
  running = false,
  actions = DEFAULT_ACTIONS,
  hasHandlers = true,
  interactive = false,
} = {}) {
  const isSendDisabled = running ? false : value.trim() === '';

  return `
    <div
      data-slot="mobile-composer"
      class="ds-mobile-composer ${keyboardOpen ? 'ds-mobile-composer--keyboard-open' : ''}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      ${!keyboardOpen ? `
        <div class="ds-mobile-composer__actions" data-slot="actions">
          ${actions.map((act) => `
            <button
              type="button"
              class="ds-mobile-composer__action-pill"
              data-action="${act}"
              ${!hasHandlers ? 'disabled' : ''}
            >
              ${act}
            </button>
          `).join('')}
        </div>
      ` : ''}

      <div class="ds-mobile-composer__input-row">
        <button
          type="button"
          aria-label="Add an attachment"
          class="ds-mobile-composer__attach-btn"
          data-slot="attach-btn"
          ${!hasHandlers ? 'disabled' : ''}
        >
          ${PLUS_ICON}
        </button>

        <div class="ds-mobile-composer__input-field" data-slot="input-field">
          <input
            type="text"
            class="ds-mobile-composer__input"
            placeholder="Message"
            aria-label="Message"
            value="${value}"
            data-slot="input"
            ${!hasHandlers ? 'readonly' : ''}
          />
          ${value === '' ? `
            <span class="ds-mobile-composer__mic-icon" data-slot="mic-icon" aria-hidden="true">
              ${MIC_ICON}
            </span>
          ` : ''}
        </div>

        ${hasHandlers ? `
          <button
            type="button"
            aria-label="${running ? 'Stop' : 'Send'}"
            class="ds-mobile-composer__send-btn"
            data-slot="send-btn"
            ${isSendDisabled ? 'disabled' : ''}
          >
            ${running ? SQUARE_ICON : ARROW_UP}
          </button>
        ` : ''}
      </div>

      ${!keyboardOpen ? `
        <span class="ds-mobile-composer__home-indicator" data-slot="home-bar" aria-hidden="true"></span>
      ` : `
        <span class="ds-mobile-composer__hint" data-slot="keyboard-hint">return to send</span>
      `}
    </div>
  `;
}

function attachInteractiveHandlers(composer) {
  const input = composer.querySelector('[data-slot="input"]');
  const sendBtn = composer.querySelector('[data-slot="send-btn"]');
  const actionPills = composer.querySelectorAll('.ds-mobile-composer__action-pill');

  function updateInput(val) {
    if (!input) return;
    input.value = val;
    let mic = composer.querySelector('[data-slot="mic-icon"]');
    if (val === '') {
      if (!mic) {
        const span = document.createElement('span');
        span.className = 'ds-mobile-composer__mic-icon';
        span.setAttribute('data-slot', 'mic-icon');
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = MIC_ICON;
        input.parentElement.appendChild(span);
      }
      if (sendBtn) sendBtn.disabled = true;
    } else {
      if (mic) mic.remove();
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  if (input) {
    input.addEventListener('input', (e) => {
      updateInput(e.target.value);
    });
  }

  actionPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      updateInput(pill.getAttribute('data-action'));
    });
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      updateInput('');
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderMobileComposer({ interactive: true });
    const composer = root.querySelector('[data-slot="mobile-composer"]');
    if (composer) attachInteractiveHandlers(composer);
    return root;
  },
};

export const KeyboardOpen = story(renderMobileComposer({
  value: '',
  keyboardOpen: true,
  running: false,
  actions: DEFAULT_ACTIONS,
}));

export const Typed = story(renderMobileComposer({
  value: 'Why does the composer re-render?',
  keyboardOpen: true,
  running: false,
  actions: DEFAULT_ACTIONS,
}));

export const Running = story(renderMobileComposer({
  value: '',
  keyboardOpen: false,
  running: true,
  actions: DEFAULT_ACTIONS,
}));

export const Disabled = story(renderMobileComposer({
  value: '',
  keyboardOpen: false,
  running: false,
  actions: DEFAULT_ACTIONS,
  hasHandlers: false,
}));

export const LongContent = story(renderMobileComposer({
  value: 'Find the test that covers draft restore on remote threads after a reload and tell me if it passes',
  keyboardOpen: false,
  running: false,
  actions: [
    ...DEFAULT_ACTIONS,
    'Review my diff',
    'Draft release notes',
    'Explain this error',
  ],
}));
