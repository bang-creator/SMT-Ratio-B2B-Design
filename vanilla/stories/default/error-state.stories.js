import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 10 Error State',
  parameters: { layout: 'padded' },
};

const ALERT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-error-state__icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
const REFRESH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>`;

function renderErrorState({
  title = "Couldn't reach the model",
  detail = 'The request timed out after 30 seconds. Your prompt is still in the composer.',
  retrying = false,
} = {}) {
  if (retrying) {
    return `
      <div data-slot="error-state" role="status" class="ds-error-state ds-error-state--retrying">
        <span class="ds-spin ds-inline-flex ds-mr-2 ds-text-secondary">
          ${REFRESH_ICON}
        </span>
        <span class="ds-thinking-indicator__label ds-text-secondary">
          Retrying
        </span>
      </div>
    `.trim();
  }

  return `
    <div data-slot="error-state" role="alert" class="ds-error-state">
      ${ALERT_ICON}
      <div class="ds-error-state__content">
        <p class="ds-error-state__title">${title}</p>
        <p class="ds-error-state__detail">${detail}</p>
      </div>
      <button type="button" class="ds-button ds-button--danger-soft ds-button--sm ds-button--pill ds-btn-retry">
        ${REFRESH_ICON}
        <span>Retry</span>
      </button>
    </div>
  `.trim();
}

/**
 * Default: Interactive Error State with In-Place Retry Transition
 * Click "Retry" to smoothly transition to the Retrying state with spinning icon and shimmer label.
 * Recovers after 2.5 seconds to demonstrate full lifecycle.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let retrying = false;
    let timer = null;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>10 Error State (Interactive Retry Lifecycle)</code></header>
        <div class="ds-error-target">
          ${renderErrorState({ retrying: false })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-error-target');

    const update = () => {
      target.innerHTML = renderErrorState({ retrying });
      bindEvents();
    };

    const bindEvents = () => {
      const retryBtn = target.querySelector('.ds-btn-retry');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          retrying = true;
          update();
          clearTimeout(timer);
          timer = setTimeout(() => {
            retrying = false;
            update();
          }, 2500);
        });
      }
    };

    bindEvents();
    return root;
  },
};

/**
 * Retrying: Distinct active state (spinning icon and shimmer label)
 */
export const Retrying = story(
  'Default / Application / 10 Error State / Retrying',
  stage('Retrying State', renderErrorState({ retrying: true }))
);
