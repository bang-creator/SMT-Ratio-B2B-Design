import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 09 Message Actions',
  parameters: { layout: 'padded' },
};

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-text-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const THUMBS_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 10v12"></path><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3"></path></svg>`;
const THUMBS_DOWN = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"></path></svg>`;
const REGEN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>`;
const MORE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`;

function renderMessageActions({
  copied = false,
  reaction = null,
  regenerating = false,
} = {}) {
  const regenSpinCls = regenerating ? 'ds-spin' : '';

  return `
    <div data-slot="message-actions" class="ds-message-actions">
      <button
        type="button"
        aria-label="${copied ? 'Copied response' : 'Copy response'}"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-copy"
      >
        ${copied ? CHECK_ICON : COPY_ICON}
      </button>

      <button
        type="button"
        aria-label="Mark response helpful"
        aria-pressed="${reaction === 'up'}"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-thumbs-up"
      >
        ${THUMBS_UP}
      </button>

      <button
        type="button"
        aria-label="Mark response unhelpful"
        aria-pressed="${reaction === 'down'}"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-thumbs-down"
      >
        ${THUMBS_DOWN}
      </button>

      <button
        type="button"
        aria-label="Regenerate response"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-regen"
      >
        <span class="${regenSpinCls}">${REGEN_ICON}</span>
      </button>

      <button
        type="button"
        aria-label="More response actions"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-more"
      >
        ${MORE_ICON}
      </button>
    </div>
  `.trim();
}

/**
 * Default: Interactive Message Actions
 * Composes 5 Shared small pill icon-only ghost buttons with dynamic translucent hover:
 * - Copy with iconSwap to green checkmark
 * - Helpful / Unhelpful thumbs with active pressed states
 * - Regenerate with authentic CSS spin animation
 * - More options overflow trigger
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let copied = false;
    let reaction = null; // null | 'up' | 'down'
    let regenerating = false;

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-actions-target">
          ${renderMessageActions({ copied, reaction, regenerating })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-actions-target');

    const update = () => {
      target.innerHTML = renderMessageActions({ copied, reaction, regenerating });
      bindEvents();
    };

    const bindEvents = () => {
      const copyBtn = target.querySelector('.ds-btn-copy');
      const upBtn = target.querySelector('.ds-btn-thumbs-up');
      const downBtn = target.querySelector('.ds-btn-thumbs-down');
      const regenBtn = target.querySelector('.ds-btn-regen');

      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          copied = true;
          update();
          setTimeout(() => {
            copied = false;
            update();
          }, 1800);
        });
      }

      if (upBtn) {
        upBtn.addEventListener('click', () => {
          reaction = reaction === 'up' ? null : 'up';
          update();
        });
      }

      if (downBtn) {
        downBtn.addEventListener('click', () => {
          reaction = reaction === 'down' ? null : 'down';
          update();
        });
      }

      if (regenBtn) {
        regenBtn.addEventListener('click', () => {
          if (!regenerating) {
            regenerating = true;
            update();
            setTimeout(() => {
              regenerating = false;
              update();
            }, 1200);
          }
        });
      }
    };

    bindEvents();
    return root;
  },
};
