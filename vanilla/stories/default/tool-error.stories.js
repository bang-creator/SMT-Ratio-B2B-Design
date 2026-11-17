import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 28 Tool Error',
  parameters: { layout: 'padded' },
};

const ALERT_CIRCLE = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-error__icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
const REFRESH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>`;
const SPINNER_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-error__spinner" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

function renderToolError({
  name = 'fetch_issue',
  target = 'octocat/hello-world#42',
  message = 'Request failed with 504 Gateway Timeout: upstream GitHub API connection timed out after 30000ms',
  attempt = 1,
  maxAttempts = 3,
  retrying = false,
  skipped = false,
} = {}) {
  const exhausted = attempt >= maxAttempts;

  return `
    <div data-slot="tool-error" class="ds-tool-error">
      <div class="ds-tool-error__header">
        ${ALERT_CIRCLE}
        <span class="ds-tool-error__name">${name}</span>
        <span class="ds-tool-error__target">${target}</span>
        <span class="ds-tool-error__attempts">${attempt}/${maxAttempts}</span>
      </div>

      <div class="ds-tool-error__callout">
        ${message}
      </div>

      <div class="ds-tool-error__actions">
        <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-tool-error__button ds-tool-error-skip" ${skipped ? 'disabled' : ''}>
          ${skipped ? 'Skipped' : 'Skip'}
        </button>
        <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-tool-error__button ds-tool-error-retry" ${exhausted || retrying || skipped ? 'disabled' : ''}>
          ${retrying ? SPINNER_ICON : REFRESH_ICON}
          <span>${retrying ? 'Retrying' : 'Retry'}</span>
        </button>
      </div>
    </div>
  `;
}

function bindToolErrorEvents(root, initialProps = {}) {
  let state = {
    name: 'fetch_issue',
    target: 'octocat/hello-world#42',
    message: 'Request failed with 504 Gateway Timeout: upstream GitHub API connection timed out after 30000ms',
    attempt: 1,
    maxAttempts: 3,
    retrying: false,
    skipped: false,
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderToolError(state);
    attach();
  }

  function attach() {
    const skipBtn = root.querySelector('.ds-tool-error-skip');
    const retryBtn = root.querySelector('.ds-tool-error-retry');

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        state.skipped = true;
        update();
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        state.retrying = true;
        update();
        setTimeout(() => {
          state.retrying = false;
          state.attempt = Math.min(state.attempt + 1, state.maxAttempts);
          update();
        }, 500);
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-tool-error-target">
          ${renderToolError()}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-tool-error-target');
    bindToolErrorEvents(target);
    return root;
  },
};
