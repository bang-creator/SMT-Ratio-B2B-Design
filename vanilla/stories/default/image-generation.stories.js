import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 35 Image Generation',
  parameters: { layout: 'padded' },
};

const REFRESH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 21h5v-5"></path></svg>`;

function renderImageGeneration({
  prompt = 'A minimalist geometric isometric rendering of an AI terminal interface',
  generating = false,
} = {}) {
  const dotsHtml = Array.from({ length: 64 })
    .map(() => `<span class="ds-gen-matrix__dot" aria-hidden="true"></span>`)
    .join('');

  return `
    <div data-slot="image-generation" class="ds-image-generation">
      <div class="ds-image-generation__frame ${generating ? 'ds-image-generation__frame--generating' : ''}">
        ${generating ? `<div class="ds-gen-matrix">${dotsHtml}</div>` : '<div class="ds-image-art"></div>'}
        <span class="ds-image-generation__resolution">1024 × 1024</span>
      </div>
      <div class="ds-image-generation__footer">
        <p class="ds-image-generation__prompt">
          ${generating ? '<span class="ds-image-generation__shimmer">Generating</span>' : prompt}
        </p>
        <button type="button" aria-label="Regenerate image" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-image-generation__btn ds-image-gen-trigger" ${generating ? 'disabled' : ''}>
          ${REFRESH_ICON}
        </button>
      </div>
    </div>
  `;
}

function bindImageGenEvents(root, initialProps = {}) {
  let state = {
    prompt: 'A minimalist geometric isometric rendering of an AI terminal interface',
    generating: false,
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderImageGeneration(state);
    attach();
  }

  function attach() {
    const trigger = root.querySelector('.ds-image-gen-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        state.generating = true;
        update();
        setTimeout(() => {
          state.generating = false;
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
        <header><code>35 Image Generation (Interactive Image Synthesis)</code></header>
        <div class="ds-image-gen-target">
          ${renderImageGeneration({ generating: false })}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-image-gen-target');
    bindImageGenEvents(target);
    return root;
  },
};
