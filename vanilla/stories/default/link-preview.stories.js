import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 34 Link Preview',
  parameters: { layout: 'padded' },
};

function renderLinkPreview({
  layout = 'card',
  site = 'openai.com',
  title = 'OpenAI Platform — Developer APIs and SDKs',
  description = 'Build and deploy autonomous agents, fine-tune models, and integrate streaming completions.',
} = {}) {
  const thumbClass = layout === 'compact' ? 'ds-link-preview__thumb--compact' : '';

  return `
    <article data-slot="link-preview" class="ds-link-preview ds-link-preview--${layout}">
      <div class="ds-link-preview__thumb ${thumbClass}">
        <div class="ds-image-art"></div>
      </div>
      <div class="ds-link-preview__body">
        <div class="ds-link-preview__site-row">
          <span class="ds-domain-badge">${site.charAt(0).toUpperCase()}</span>
          <span class="ds-link-preview__site">${site}</span>
        </div>
        <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" class="ds-link-preview__title">
          ${title}
        </a>
        <span class="ds-link-preview__desc">${description}</span>
      </div>
    </article>
  `;
}

function bindLinkPreviewEvents(root) {
  let layout = 'card';

  function update() {
    const target = root.querySelector('.ds-link-preview-target');
    if (target) {
      target.innerHTML = renderLinkPreview({ layout });
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-link-preview');
    if (card) {
      card.addEventListener('click', (e) => {
        // Only toggle if not clicking on link itself
        if (e.target.closest('a')) return;
        layout = layout === 'card' ? 'compact' : 'card';
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
        <header><code>34 Link Preview (Interactive Card &amp; Compact Layout)</code></header>
        <div class="ds-link-preview-target">
          ${renderLinkPreview({ layout: 'card' })}
        </div>
      </section>
    `;
    bindLinkPreviewEvents(root);
    return root;
  },
};

export const Compact = story(
  'Default / Application / 34 Link Preview / Compact',
  stage('Compact Layout', renderLinkPreview({ layout: 'compact' }))
);
