import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 39 Memory Chips',
  parameters: { layout: 'padded' },
};

const BRAIN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M12 18v4"></path></svg>`;
const X_ICON = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const INITIAL_CHIPS = [
  { id: 'mem-1', text: 'Prefers TypeScript strict mode', change: 'added' },
  { id: 'mem-2', text: 'Deploy target: Cloudflare Workers', change: 'updated' },
  { id: 'mem-3', text: 'Uses Tailwind CSS v4', change: 'existing' },
];

function renderMemoryChips({ chips = INITIAL_CHIPS, onForget = true } = {}) {
  const freshCount = chips.filter((c) => c.change !== 'existing').length;
  const headerText = freshCount > 0 ? `remembered ${freshCount}` : 'memory';

  const chipsHtml = chips.length > 0
    ? chips
        .map(
          (c) => `
        <span
          class="ds-memory-chip ${c.change === 'existing' ? 'ds-memory-chip--existing' : 'ds-memory-chip--fresh'}"
          data-id="${c.id}"
          data-change="${c.change}"
        >
          <span class="ds-memory-chip__text">${c.text}</span>
          ${
            onForget
              ? `
            <button
              type="button"
              aria-label="Forget ${c.text}"
              class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-memory-chip__forget"
              data-forget-id="${c.id}"
            >
              ${X_ICON}
            </button>
          `
              : ''
          }
        </span>
      `
        )
        .join('')
    : '<button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-memory-reset">Reset memories</button>';

  return `
    <div data-slot="memory-chips" class="ds-memory-chips">
      <div class="ds-memory-chips__header">
        ${BRAIN_ICON}
        <span class="ds-memory-chips__title">${headerText}</span>
      </div>
      <div class="ds-memory-chips__list">
        ${chipsHtml}
      </div>
    </div>
  `;
}

function bindForgetHandlers(root, initialList) {
  let currentChips = [...initialList];

  function rebind() {
    const target = root.querySelector('.ds-memory-target');
    if (!target) return;

    target.querySelectorAll('.ds-memory-chip__forget').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-forget-id');
        currentChips = currentChips.filter((c) => c.id !== id);
        target.innerHTML = renderMemoryChips({ chips: currentChips, onForget: true });
        rebind();
      });
    });

    const resetBtn = target.querySelector('.ds-memory-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentChips = [...initialList];
        target.innerHTML = renderMemoryChips({ chips: currentChips, onForget: true });
        rebind();
      });
    }
  }

  rebind();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>39 Memory Chips (Interactive Context Retention)</code></header>
        <div class="ds-memory-target">
          ${renderMemoryChips({ chips: INITIAL_CHIPS })}
        </div>
      </section>
    `;
    bindForgetHandlers(root, INITIAL_CHIPS);
    return root;
  },
};
