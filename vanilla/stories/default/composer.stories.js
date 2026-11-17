import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 75 Composer',
  parameters: { layout: 'padded' },
};

const ICONS = {
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  chevronDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  mic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
  square: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>`,
  file: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
  close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
};

function renderComposer({
  value = '',
  placeholder = 'Ask anything or type / for commands...',
  model = 'gpt-4o',
  streaming = false,
  dragActive = false,
  attachments = [],
} = {}) {
  const isIdle = value.trim().length === 0;
  const sendIcon = streaming ? ICONS.square : ICONS.arrowUp;
  const sendState = streaming ? 'streaming' : isIdle ? 'idle' : 'active';

  const attachmentsHtml = attachments && attachments.length
    ? `
      <div data-slot="composer-attachments" class="ds-inline-cluster ds-composer-attachments" data-gap="2">
        ${attachments.map((att) => `
          <div class="ds-badge ds-badge--subtle ds-badge--sm ds-badge--pill">
            ${ICONS.file}
            <span>${att.name}</span>
            <button type="button" class="ds-icon-button ds-icon-button--ghost ds-icon-button--sm ds-button--pill" aria-label="Remove attachment">
              ${ICONS.close}
            </button>
          </div>
        `).join('')}
      </div>
    `
    : '';

  return `
    <div data-slot="composer" class="ds-composer">
      <div data-slot="composer-bar" class="ds-composer-bar" data-drag-active="${dragActive}">
        ${attachmentsHtml}
        <input
          type="text"
          data-slot="composer-input"
          class="ds-composer-input"
          placeholder="${placeholder}"
          value="${value}"
          aria-label="Composer query input"
        />

        <div data-slot="composer-toolbar" class="ds-composer-toolbar">
          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-attach"
              class="ds-composer-attach-btn"
              aria-label="Add attachment"
            >
              ${ICONS.plus}
            </button>

            <button
              type="button"
              data-slot="composer-model-trigger"
              class="ds-composer-model-trigger"
              aria-label="Select model"
            >
              <span>${model}</span>
              ${ICONS.chevronDown}
            </button>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-voice-button"
              class="ds-composer-voice-btn"
              aria-label="Start voice input"
            >
              ${ICONS.mic}
            </button>

            <button
              type="button"
              data-slot="composer-send"
              data-state="${sendState}"
              class="ds-composer-send-btn ${sendState !== 'idle' ? 'ds-composer-send-btn--active' : ''}"
              aria-label="${streaming ? 'Stop generating' : 'Send message'}"
              ${sendState === 'idle' ? 'disabled' : ''}
            >
              ${sendIcon}
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

    let currentVal = '';
    let isStreaming = false;
    const models = ['gpt-4o', 'gpt-4o-mini', 'o1-preview'];
    let modelIdx = 0;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderComposer({
              value: currentVal,
              model: models[modelIdx],
              streaming: isStreaming,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="composer-input"]');
      input?.addEventListener('input', (e) => {
        currentVal = e.target.value;
        const sendBtn = root.querySelector('[data-slot="composer-send"]');
        if (sendBtn && !isStreaming) {
          const isIdle = currentVal.trim().length === 0;
          sendBtn.setAttribute('data-state', isIdle ? 'idle' : 'active');
          if (isIdle) {
            sendBtn.classList.remove('ds-composer-send-btn--active');
            sendBtn.setAttribute('disabled', '');
          } else {
            sendBtn.classList.add('ds-composer-send-btn--active');
            sendBtn.removeAttribute('disabled');
          }
        }
      });

      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && currentVal.trim().length > 0 && !isStreaming) {
          e.preventDefault();
          isStreaming = true;
          render();
        }
      });

      root.querySelector('[data-slot="composer-send"]')?.addEventListener('click', () => {
        if (isStreaming) {
          isStreaming = false;
          currentVal = '';
          render();
        } else if (currentVal.trim().length > 0) {
          isStreaming = true;
          render();
        }
      });

      root.querySelector('[data-slot="composer-model-trigger"]')?.addEventListener('click', () => {
        modelIdx = (modelIdx + 1) % models.length;
        render();
      });
    };

    render();
    return root;
  },
};

export const WithAttachments = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderComposer({
        value: 'Inspect these token definitions against platform ground truth',
        model: 'gpt-4o',
        attachments: [
          { name: 'tokens.json', kind: 'text' },
          { name: 'spec-screenshot.png', kind: 'image' },
        ],
      })}
    </div>
  </div>
`);
