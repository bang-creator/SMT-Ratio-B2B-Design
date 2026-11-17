import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 47 Web Preview',
  parameters: { layout: 'padded' },
};

const ROTATE_CW_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-web-preview__reload-svg">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
    <path d="M16 21h5v-5"></path>
  </svg>
`;

const EXTERNAL_LINK_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

function renderWebPreview({
  origin = 'http://localhost:5173/preview',
  loading = false,
  content = `
    <div class="ds-stack" data-direction="vertical" data-gap="2">
      <div class="ds-text-sm ds-font-medium">Sandboxed Application Frame</div>
      <div class="ds-text-xs ds-text-secondary">Rendered inside local isolated preview boundary without host leakage.</div>
    </div>
  `,
} = {}) {
  return `
    <div data-slot="web-preview" class="ds-web-preview">
      <div class="ds-web-preview__bar">
        <button
          type="button"
          aria-label="Reload the preview"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-web-preview__btn ds-web-preview__btn-reload"
        >
          <span class="ds-inline-flex ${loading ? 'ds-web-preview__reload-icon--loading' : ''}">
            ${ROTATE_CW_ICON}
          </span>
        </button>

        <span class="ds-web-preview__url-bar">
          <span class="ds-web-preview__origin">${origin}</span>
        </span>

        <button
          type="button"
          aria-label="Open the preview in a new tab"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-web-preview__btn ds-web-preview__btn-external"
        >
          ${EXTERNAL_LINK_ICON}
        </button>
      </div>

      <div class="ds-web-preview__stage">
        <div
          class="ds-web-preview__content ${loading ? 'ds-web-preview__content--loading' : ''}"
          ${loading ? 'aria-hidden="true"' : ''}
        >
          ${content}
        </div>
        ${
          loading
            ? `
          <div class="ds-web-preview__loading-overlay">
            <span class="ds-thinking-indicator__label">Loading preview</span>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;
}

function bindWebPreviewEvents(root) {
  let isLoading = false;

  function update() {
    const target = root.querySelector('.ds-preview-target');
    if (target) {
      target.innerHTML = renderWebPreview({ loading: isLoading });
      attach();
    }
  }

  function attach() {
    const reloadBtn = root.querySelector('.ds-web-preview__btn-reload');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        isLoading = true;
        update();
        setTimeout(() => {
          isLoading = false;
          update();
        }, 600);
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
<div class="ds-preview-target">
          ${renderWebPreview({ loading: false })}
        </div>
      </section>
    `;
    bindWebPreviewEvents(root);
    return root;
  },
};
