import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 65 Artifact Card',
  parameters: { layout: 'padded' },
};

const ICONS = {
  file: `<svg class="ds-artifact-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
  arrow: `<svg class="ds-artifact-card__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`,
};

function renderArtifact({
  title = 'assistant-ui-design-tokens.json',
  meta = 'Document · v3 · just now',
  generating = false,
  words = 420,
} = {}) {
  const metaHtml = generating
    ? `
      <p class="ds-artifact-card__meta">
        <span class="ds-artifact-card__shimmer-label">Writing</span>
        <span>·</span>
        <span class="ds-tabular-nums">${words} words</span>
      </p>
    `
    : `<p class="ds-artifact-card__meta">${meta}</p>`;

  return `
    <div data-slot="artifact-card" data-generating="${generating}" class="ds-artifact-card" role="button" tabindex="0">
      <div class="ds-artifact-card__icon-box">
        ${ICONS.file}
      </div>
      <div class="ds-artifact-card__content">
        <h4 class="ds-artifact-card__title">${title}</h4>
        ${metaHtml}
      </div>
      ${ICONS.arrow}
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isGen = true;
    let words = 128;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderArtifact({
              title: 'Draft persistence RFC',
              meta: 'Document · v3 · just now',
              generating: isGen,
              words,
            })}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-artifact-card');
      card?.addEventListener('click', () => {
        isGen = !isGen;
        words = isGen ? 420 : 128;
        render();
      });
      card?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isGen = !isGen;
          words = isGen ? 420 : 128;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const LongTitle = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderArtifact({
        title: 'Migrating the thread list from local storage to the remote adapter',
        meta: 'Document · v14 · edited yesterday at 18:42 by Ana Ruiz',
        generating: false,
      })}
    </div>
  </div>
`);
