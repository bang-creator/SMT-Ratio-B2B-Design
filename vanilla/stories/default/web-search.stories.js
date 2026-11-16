import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 32 Web Search',
  parameters: { layout: 'padded' },
};

const SEARCH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-web-search__icon" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

const DEFAULT_RESULTS = [
  { title: 'Assistant UI Documentation · Overview', domain: 'docs.assistant-ui.com' },
  { title: 'OpenAI API Reference & Platform Guides', domain: 'platform.openai.com' },
  { title: 'Interactive Elements for AI Applications', domain: 'github.com' },
];

function renderWebSearch({
  query = 'site:platform.openai.com/docs assistant-ui',
  searching = false,
  results = DEFAULT_RESULTS,
} = {}) {
  const statusText = searching
    ? `<span class="ds-web-search__shimmer">Searching</span>`
    : `<span>Read ${results.length} sources</span>`;

  const resultsHtml = results
    .map(
      (r) => `
    <div class="ds-web-search__result">
      <span class="ds-domain-badge">${r.domain.charAt(0).toUpperCase()}</span>
      <span class="ds-web-search__title">${r.title}</span>
      <span class="ds-web-search__domain">${r.domain}</span>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="web-search" class="ds-web-search">
      <div class="ds-web-search__pill ds-web-search-trigger" title="Click to trigger search cycle">
        ${SEARCH_ICON}
        <span>${query}</span>
      </div>
      <div class="ds-web-search__status">
        ${statusText}
      </div>
      <div class="ds-web-search__results">
        ${resultsHtml}
      </div>
    </div>
  `;
}

function bindWebSearchEvents(root, initialProps = {}) {
  let state = {
    query: 'site:platform.openai.com/docs assistant-ui',
    searching: false,
    results: DEFAULT_RESULTS,
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderWebSearch(state);
    attach();
  }

  function attach() {
    const trigger = root.querySelector('.ds-web-search-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        state.searching = true;
        state.results = [];
        update();
        setTimeout(() => {
          state.searching = false;
          state.results = DEFAULT_RESULTS;
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
        <header><code>32 Web Search (Sources &amp; Real-time Retrieval)</code></header>
        <div class="ds-web-search-target">
          ${renderWebSearch()}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-web-search-target');
    bindWebSearchEvents(target);
    return root;
  },
};
