import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 11 Message Queue',
  parameters: { layout: 'padded' },
};

const ARROW_UP = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const INITIAL_QUEUED = [
  { id: 'a', text: 'Also add a changeset' },
  { id: 'b', text: 'Then run the full suite' },
];

function renderMessageQueue({
  running = 'Fix the converter and add a guard',
  queued = INITIAL_QUEUED,
  hasCancel = true,
} = {}) {
  const queuedItemsHtml = queued
    .map(
      (msg, index) => `
    <li class="ds-message-queue__item" data-id="${msg.id}">
      <span class="ds-message-queue__item-index">${index + 1}</span>
      <span class="ds-message-queue__item-text">${msg.text}</span>
      <button type="button" aria-label="Send now" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon">
        ${ARROW_UP}
      </button>
      ${hasCancel ? `
        <button type="button" aria-label="Remove &quot;${msg.text}&quot; from the queue" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon" data-cancel-id="${msg.id}">
          ${X_ICON}
        </button>
      ` : ''}
    </li>
  `
    )
    .join('');

  return `
    <div data-slot="message-queue" class="ds-message-queue">
      <div class="ds-message-queue__running-card">
        <span class="ds-beacon ds-beacon--accent" aria-hidden="true">
          <span class="ds-beacon__ping"></span>
          <span class="ds-beacon__dot"></span>
        </span>
        <span class="ds-message-queue__running-title">${running}</span>
        <span class="ds-message-queue__status-label">running</span>
      </div>

      ${queued.length > 0 ? `
        <div class="ds-message-queue__header">
          <span class="ds-message-queue__meta">${queued.length} queued</span>
          <span class="ds-message-queue__meta">sends when this finishes</span>
        </div>
      ` : ''}

      <ul class="ds-message-queue__list">
        ${queuedItemsHtml}
      </ul>

      ${queued.length === 0 ? `
        <div class="ds-flex ds-justify-center ds-pt-2">
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-queue-reset-btn">Reset queue</button>
        </div>
      ` : ''}
    </div>
  `.trim();
}

/**
 * Single Consolidated Interactive Story (Rule 1 & Rule 2)
 * Demonstrates initial queue with interactive cancel action that transitions to empty state.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-queue-target">
          ${renderMessageQueue()}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-queue-target');
    let items = [...INITIAL_QUEUED];

    const update = () => {
      target.innerHTML = renderMessageQueue({ queued: items });
      setupListeners();
    };

    const setupListeners = () => {
      target.querySelectorAll('button[data-cancel-id]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-cancel-id');
          items = items.filter((it) => it.id !== id);
          update();
        });
      });

      const resetBtn = target.querySelector('.ds-queue-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          items = [...INITIAL_QUEUED];
          update();
        });
      }
    };

    setupListeners();
    return root;
  },
};
