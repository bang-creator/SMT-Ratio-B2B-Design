import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 79 Models',
  parameters: { layout: 'padded' },
};

const ICONS = {
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
  chevronDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
};

const MODELS = [
  { name: 'Fable 5', meta: '1M ctx' },
  { name: 'Opus 5', meta: '400k ctx' },
  { name: 'Haiku 4.5', meta: '200k ctx' },
];

const LONG_MODELS = [
  { name: 'Fable 5', meta: '1M ctx' },
  { name: 'Opus 5 with extended thinking (preview)', meta: '400k ctx' },
  { name: 'Haiku 4.5', meta: '200k ctx' },
  { name: 'Self-hosted Llama 4 Maverick', meta: '128k ctx' },
  { name: 'Gemini 3 Pro', meta: '2M ctx' },
];

function renderModelPickerComposer({
  open = false,
  model = 'Fable 5',
  models = MODELS,
  value = '',
} = {}) {
  const menuItemsHtml = models
    .map((m) => {
      const isSelected = m.name === model;
      return `
        <button
          type="button"
          role="menuitem"
          data-slot="composer-model-item"
          data-model="${m.name}"
          data-active="${isSelected}"
          class="ds-composer-model-item ${isSelected ? 'ds-composer-model-item--active' : ''}"
        >
          <span class="ds-composer-model-name">${m.name}</span>
          <span class="ds-composer-model-meta">${m.meta}</span>
          <span class="ds-composer-model-check">
            ${isSelected ? ICONS.check : ''}
          </span>
        </button>
      `;
    })
    .join('');

  return `
    <div data-slot="composer" class="ds-composer">
      <div data-slot="composer-bar" class="ds-composer-bar">
        <input
          type="text"
          data-slot="composer-input"
          class="ds-composer-input"
          placeholder="Ask anything"
          value="${value}"
          aria-label="Composer query input"
        />

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

            <div class="ds-relative">
              ${
                open
                  ? `
                <div
                  data-slot="composer-menu"
                  class="ds-composer-menu"
                  role="menu"
                  aria-label="Select model"
                >
                  ${menuItemsHtml}
                </div>
              `
                  : ''
              }

              <button
                type="button"
                data-slot="composer-model-trigger"
                class="ds-composer-model-trigger"
                aria-expanded="${open}"
                aria-label="Choose model (currently ${model})"
              >
                <span class="ds-composer-model-trigger-label">${model}</span>
                ${ICONS.chevronDown}
              </button>
            </div>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
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

    let isOpen = false;
    let selectedModel = 'Fable 5';

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">79 Models</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${selectedModel} · ${isOpen ? 'Menu Open' : 'Menu Closed'}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderModelPickerComposer({
              open: isOpen,
              model: selectedModel,
              models: MODELS,
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="composer-model-trigger"]')?.addEventListener('click', () => {
        isOpen = !isOpen;
        render();
      });

      root.querySelectorAll('[data-slot="composer-model-item"]').forEach((item) => {
        item.addEventListener('click', () => {
          selectedModel = item.getAttribute('data-model');
          isOpen = false;
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const LongNames = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">79 Models (Long Names)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Extended Thinking</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderModelPickerComposer({
        open: true,
        model: 'Opus 5 with extended thinking (preview)',
        models: LONG_MODELS,
      })}
    </div>
  </div>
`);
