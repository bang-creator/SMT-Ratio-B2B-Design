import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 14 Stopped Run',
  parameters: { layout: 'padded' },
};

const SQUARE_ICON = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>`;
const ARROW_RIGHT_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

const INITIAL_WORDS = 'The migration is complete up to step three. The remaining files require'.split(' ');
const CONTINUED_WORDS = 'The migration is complete up to step three. The remaining files require manual updates to their type definitions and verifying the downstream exports across packages/core.'.split(' ');

function renderStoppedRun({
  words = INITIAL_WORDS,
  reason = 'interrupted',
} = {}) {
  return `
    <div data-slot="stopped-run" class="ds-stopped-run">
      <p class="ds-stopped-run__text">
        ${words.join(' ')}<span aria-hidden="true" class="ds-stopped-run__cursor"></span>
      </p>

      <div class="ds-stopped-run__bar">
        <span class="ds-stopped-run__badge font-mono">
          ${SQUARE_ICON}
          ${reason}
        </span>

        <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-btn-continue ds-ml-auto">
          <span>Continue</span>
          ${ARROW_RIGHT_ICON}
        </button>

        <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-btn-discard">
          <span>Discard</span>
        </button>
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Stopped Run
 * Click "Continue" to resume the interrupted response and extend the generated text.
 * Click "Discard" to reset back to the initial interrupted state.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isContinued = false;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>14 Stopped Run (Interactive Continuation Lifecycle)</code></header>
        <div class="ds-stopped-target">
          ${renderStoppedRun({ words: INITIAL_WORDS, reason: 'interrupted' })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-stopped-target');

    const update = () => {
      target.innerHTML = renderStoppedRun({
        words: isContinued ? CONTINUED_WORDS : INITIAL_WORDS,
        reason: isContinued ? 'continued' : 'interrupted',
      });
      bindEvents();
    };

    const bindEvents = () => {
      const continueBtn = target.querySelector('.ds-btn-continue');
      const discardBtn = target.querySelector('.ds-btn-discard');

      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          isContinued = true;
          update();
        });
      }

      if (discardBtn) {
        discardBtn.addEventListener('click', () => {
          isContinued = false;
          update();
        });
      }
    };

    bindEvents();
    return root;
  },
};

/**
 * LengthLimit: Stopped due to max token length
 */
export const LengthLimit = story(
  'Default / Application / 14 Stopped Run / Length Limit',
  stage('Max Tokens Reached', renderStoppedRun({ words: INITIAL_WORDS, reason: 'length limit' }))
);
