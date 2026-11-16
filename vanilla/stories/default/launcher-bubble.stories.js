import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 96 Launcher',
  parameters: { layout: 'padded' },
};

const CHAT_ICON = `<svg class="ds-launcher-btn__icon-chat" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>`;
const X_ICON = `<svg class="ds-launcher-btn__icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const PROMPTS = [
  'How do I add a thread list?',
  'What changed in 0.14?',
  'Show me an external store example',
];

function renderLauncherHtml({
  open = true,
  unread = 0,
  greeting = 'Need a hand with assistant-ui?',
  prompts = PROMPTS,
  showStart = true,
  readOnly = false,
  selectedPrompt = null,
} = {}) {
  return `
    <div data-slot="launcher-bubble" class="ds-launcher-bubble-wrap">
      ${open ? `
        <div data-slot="launcher-card" class="ds-launcher-card">
          ${selectedPrompt ? `
            <div class="ds-flex ds-flex-col ds-gap-1">
              <span class="ds-launcher-card__greeting" data-slot="active-session-title">Active Thread</span>
              <span class="ds-launcher-card__meta" data-slot="active-prompt-echo">"${selectedPrompt}"</span>
            </div>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2" data-slot="reset-launcher">
              Reset launcher
            </button>
          ` : `
            <div class="ds-flex ds-flex-col ds-gap-1">
              <span class="ds-launcher-card__greeting" data-slot="launcher-greeting">${greeting}</span>
              <span class="ds-launcher-card__meta">typically replies in a minute</span>
            </div>

            ${prompts && prompts.length > 0 ? `
              <div class="ds-launcher-card__prompts" data-slot="launcher-prompts">
                ${prompts.map(p => `
                  <button
                    type="button"
                    class="ds-launcher-card__prompt-btn"
                    data-slot="prompt-btn"
                    ${readOnly ? 'disabled' : ''}
                  >
                    ${p}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            ${showStart && !readOnly ? `
              <button
                type="button"
                class="ds-launcher-card__start-btn"
                data-slot="start-btn"
              >
                Start a conversation
              </button>
            ` : ''}
          `}
        </div>
      ` : ''}

      <button
        type="button"
        aria-expanded="${open}"
        aria-label="${open ? 'Close the assistant' : 'Open the assistant'}"
        class="ds-launcher-btn"
        data-slot="launcher-toggle-btn"
      >
        <span class="ds-launcher-btn__icon-stack">
          ${CHAT_ICON}
          ${X_ICON}
        </span>
        ${!open && unread > 0 ? `
          <span class="ds-launcher-unread-badge" data-slot="launcher-unread-badge">${unread}</span>
        ` : ''}
      </button>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isOpen = true;
    let selectedPrompt = null;

    function attachListeners() {
      const toggleBtn = root.querySelector('[data-slot="launcher-toggle-btn"]');
      const startBtn = root.querySelector('[data-slot="start-btn"]');
      const resetBtn = root.querySelector('[data-slot="reset-launcher"]');
      const promptBtns = root.querySelectorAll('[data-slot="prompt-btn"]');

      toggleBtn?.addEventListener('click', () => {
        isOpen = !isOpen;
        update();
      });

      startBtn?.addEventListener('click', () => {
        selectedPrompt = 'Started fresh conversation';
        update();
      });

      resetBtn?.addEventListener('click', () => {
        selectedPrompt = null;
        update();
      });

      promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedPrompt = btn.textContent.trim();
          update();
        });
      });
    }

    function update() {
      root.innerHTML = renderLauncherHtml({
        open: isOpen,
        unread: 0,
        selectedPrompt,
      });
      attachListeners();
    }

    update();
    return root;
  },
};

export const Closed = story(renderLauncherHtml({
  open: false,
  unread: 0,
}));

export const Unread = story(renderLauncherHtml({
  open: false,
  unread: 3,
}));

export const NoPrompts = story(renderLauncherHtml({
  open: true,
  prompts: [],
}));

export const ReadOnly = story(renderLauncherHtml({
  open: true,
  readOnly: true,
  showStart: false,
}));
