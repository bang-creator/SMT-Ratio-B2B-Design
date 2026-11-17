import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 48 Diagram',
  parameters: { layout: 'padded' },
};

const MINUS_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;

const PLUS_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;

const ROTATE_CCW_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
`;

const MAXIMIZE_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
    <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
    <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
    <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
  </svg>
`;

function renderSampleSvg() {
  return `
    <svg viewBox="0 0 320 100" width="320" height="100" aria-label="System architecture pipeline" role="img" class="ds-block">
      <!-- Client Node -->
      <rect x="10" y="25" width="80" height="50" rx="8" fill="var(--color-surface-container)" stroke="var(--color-semantic-border-subtle)" stroke-width="1.5"></rect>
      <text x="50" y="54" text-anchor="middle" font-size="12" font-weight="500" fill="var(--color-semantic-text-primary)" font-family="inherit">Client</text>

      <!-- Connecting line 1 -->
      <line x1="90" y1="50" x2="120" y2="50" stroke="var(--color-semantic-border-subtle)" stroke-width="1.5" stroke-dasharray="3 3"></line>

      <!-- Gateway Node -->
      <rect x="120" y="25" width="80" height="50" rx="8" fill="var(--color-surface-container)" stroke="var(--color-semantic-chart-series-primary)" stroke-width="1.5"></rect>
      <text x="160" y="54" text-anchor="middle" font-size="12" font-weight="500" fill="var(--color-semantic-text-primary)" font-family="inherit">Gateway</text>

      <!-- Connecting line 2 -->
      <line x1="200" y1="50" x2="230" y2="50" stroke="var(--color-semantic-border-subtle)" stroke-width="1.5" stroke-dasharray="3 3"></line>

      <!-- Model Node -->
      <rect x="230" y="25" width="80" height="50" rx="8" fill="var(--color-surface-container)" stroke="var(--color-semantic-border-subtle)" stroke-width="1.5"></rect>
      <text x="270" y="54" text-anchor="middle" font-size="12" font-weight="500" fill="var(--color-semantic-text-primary)" font-family="inherit">gpt-4o</text>
    </svg>
  `;
}

function renderDiagram({
  title = 'System Architecture Diagram',
  zoom = 1,
  canExpand = true,
} = {}) {
  const percentText = `${Math.round(zoom * 100)}%`;

  return `
    <div data-slot="diagram" class="ds-diagram">
      <div class="ds-diagram__toolbar">
        <span class="ds-diagram__title">${title}</span>
        <span class="ds-diagram__zoom">${percentText}</span>
        <button
          type="button"
          aria-label="Zoom out"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-diagram__btn ds-diagram__btn-zoom-out"
        >
          ${MINUS_ICON}
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-diagram__btn ds-diagram__btn-zoom-in"
        >
          ${PLUS_ICON}
        </button>
        <button
          type="button"
          aria-label="Reset the view"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-diagram__btn ds-diagram__btn-reset"
        >
          ${ROTATE_CCW_ICON}
        </button>
        <button
          type="button"
          aria-label="Open full screen"
          class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-diagram__btn ds-diagram__btn-expand"
          ${canExpand ? '' : 'disabled'}
        >
          ${MAXIMIZE_ICON}
        </button>
      </div>

      <div class="ds-diagram__stage">
        <div
          class="ds-diagram__viewport"
          data-zoom="${Math.round(zoom * 100)}"
        >
          ${renderSampleSvg()}
        </div>
      </div>
    </div>
  `;
}

function bindDiagramEvents(root) {
  let zoomLevels = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let currentIdx = 2; // 1.0 (100%)

  function update() {
    const target = root.querySelector('.ds-diagram-target');
    if (target) {
      target.innerHTML = renderDiagram({ zoom: zoomLevels[currentIdx] });
      attach();
    }
  }

  function attach() {
    const zoomInBtn = root.querySelector('.ds-diagram__btn-zoom-in');
    const zoomOutBtn = root.querySelector('.ds-diagram__btn-zoom-out');
    const resetBtn = root.querySelector('.ds-diagram__btn-reset');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (currentIdx < zoomLevels.length - 1) {
          currentIdx++;
          update();
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (currentIdx > 0) {
          currentIdx--;
          update();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentIdx = 2; // 100%
        update();
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
<div class="ds-diagram-target">
          ${renderDiagram({ zoom: 1 })}
        </div>
      </section>
    `;
    bindDiagramEvents(root);
    return root;
  },
};
