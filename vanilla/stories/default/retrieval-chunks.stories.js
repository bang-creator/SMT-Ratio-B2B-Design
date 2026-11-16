import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 37 Retrieval Chunks',
  parameters: { layout: 'padded' },
};

const DATABASE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`;

const SAMPLE_CHUNKS = [
  {
    id: 'chunk-1',
    source: 'vector_search.py',
    locator: '§4.1',
    score: 0.94,
    pctClass: 'ds-chunk-meter__fill--94',
    text: 'The cosine distance between normalized embeddings evaluates semantic proximity in latent space, minimizing high-dimensional distortion.',
  },
  {
    id: 'chunk-2',
    source: 'indexer.ts',
    locator: '§2.8',
    score: 0.82,
    pctClass: 'ds-chunk-meter__fill--82',
    text: 'Chunks are indexed into HNSW graphs with M=16 efConstruction=200 for sub-10ms retrieval latency over billion-scale datasets.',
  },
  {
    id: 'chunk-3',
    source: 'reranker.rs',
    locator: '§7.3',
    score: 0.71,
    pctClass: 'ds-chunk-meter__fill--71',
    text: 'Cross-encoder scoring evaluates reciprocal rank fusion scores across dense and sparse lexical search candidates.',
  },
];

function renderRetrievalChunks({
  query = 'embedding vector cosine similarity threshold',
  searching = false,
  chunks = SAMPLE_CHUNKS,
} = {}) {
  const statusHtml = searching
    ? '<span class="ds-retrieval-status__shimmer">Retrieving</span>'
    : `<span>${chunks.length} passages above threshold</span>`;

  const chunksHtml = chunks
    .map(
      (c) => `
    <div class="ds-chunk-card" data-slot="chunk-card">
      <div class="ds-chunk-card__header">
        <span class="ds-chunk-card__source">${c.source}</span>
        <span class="ds-chunk-card__locator">${c.locator}</span>
        <span class="ds-chunk-card__score ${c.score >= 0.8 ? 'ds-chunk-card__score--high' : ''}">${c.score.toFixed(2)}</span>
      </div>
      <p class="ds-chunk-card__excerpt">${c.text}</p>
      <span
        role="meter"
        aria-label="${c.source} relevance score"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${Math.round(c.score * 100)}"
        aria-valuetext="${c.score.toFixed(2)} of 1.00"
        class="ds-chunk-meter"
      >
        <span class="ds-chunk-meter__fill ${c.pctClass}"></span>
      </span>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="retrieval-chunks" class="ds-retrieval-chunks">
      <div class="ds-retrieval-pill ds-retrieval-trigger" title="Click to trigger retrieval cycle">
        ${DATABASE_ICON}
        <span>${query}</span>
      </div>
      <div class="ds-retrieval-status">
        ${statusHtml}
      </div>
      <div class="ds-retrieval-list">
        ${chunksHtml}
      </div>
    </div>
  `;
}

function bindRetrievalEvents(root, initialProps = {}) {
  let state = {
    query: 'embedding vector cosine similarity threshold',
    searching: false,
    chunks: SAMPLE_CHUNKS,
    ...initialProps,
  };

  function update() {
    const target = root.querySelector('.ds-retrieval-target');
    if (target) {
      target.innerHTML = renderRetrievalChunks(state);
      attach();
    }
  }

  function attach() {
    const trigger = root.querySelector('.ds-retrieval-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        state.searching = true;
        state.chunks = [];
        update();
        setTimeout(() => {
          state.searching = false;
          state.chunks = SAMPLE_CHUNKS;
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
        <header><code>37 Retrieval Chunks (Interactive Vector Passages)</code></header>
        <div class="ds-retrieval-target">
          ${renderRetrievalChunks()}
        </div>
      </section>
    `;
    bindRetrievalEvents(root);
    return root;
  },
};
