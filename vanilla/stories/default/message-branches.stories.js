import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 08 Message Branches',
  parameters: { layout: 'padded' },
};

const CHEVRON_LEFT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

const VARIANTS = [
  'Persist the composer draft in the runtime with the thread id as its key. When the active thread changes, read that value back into the composer.',
  'Keep drafts in a thread keyed runtime map, then hydrate the composer whenever a new thread becomes active. Delete the matching entry only after a successful send.',
  'Treat each draft as thread state instead of component state. Restoring it on thread selection keeps the composer stable without adding a second store.',
];

function renderMessageBranches({
  variants = VARIANTS,
  index = 0,
} = {}) {
  const current = variants[index] !== undefined ? index : 0;
  const message = variants[current] || '';

  const controlsHtml = variants.length > 1
    ? `
      <div class="ds-message-branches__controls">
        <button
          type="button"
          aria-label="Show previous response"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-message-branches__btn ds-btn-prev"
          ${current === 0 ? 'disabled' : ''}
        >
          ${CHEVRON_LEFT}
        </button>
        <span class="ds-message-branches__counter font-mono tabular-nums">
          ${current + 1} / ${variants.length}
        </span>
        <button
          type="button"
          aria-label="Show next response"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-message-branches__btn ds-btn-next"
          ${current === variants.length - 1 ? 'disabled' : ''}
        >
          ${CHEVRON_RIGHT}
        </button>
      </div>
    `.trim()
    : '';

  return `
    <div data-slot="message-branches" class="ds-message-branches">
      <p class="ds-message-branches__text">${message}</p>
      ${controlsHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Message Branches
 * Previous and Next Shared small pill icon buttons switch between 3 alternative branch answers.
 * Shows monospace branch counter and handles disabled boundary states.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentIndex = 0;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>08 Message Branches (Interactive Version Switcher)</code></header>
        <div class="ds-branch-target">
          ${renderMessageBranches({ variants: VARIANTS, index: currentIndex })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-branch-target');

    const bindEvents = () => {
      const prevBtn = target.querySelector('.ds-btn-prev');
      const nextBtn = target.querySelector('.ds-btn-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            target.innerHTML = renderMessageBranches({ variants: VARIANTS, index: currentIndex });
            bindEvents();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentIndex < VARIANTS.length - 1) {
            currentIndex++;
            target.innerHTML = renderMessageBranches({ variants: VARIANTS, index: currentIndex });
            bindEvents();
          }
        });
      }
    };

    bindEvents();
    return root;
  },
};

/**
 * SingleVersion: Single branch version
 * When only one response version exists, navigation controls are omitted.
 */
export const SingleVersion = story(
  'Default / Application / 08 Message Branches / Single Version',
  stage('Single Version', renderMessageBranches({ variants: VARIANTS.slice(0, 1), index: 0 }))
);
