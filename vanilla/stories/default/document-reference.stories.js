import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 38 Document Reference',
  parameters: { layout: 'padded' },
};

const FILE_TEXT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;

const SAMPLE_ANCHORS = [
  {
    page: 12,
    quote: 'SOC2 Type II compliance controls verified for all API egress endpoints and TLS session termination proxies.',
  },
  {
    page: 27,
    quote: 'Zero data retention policy enforced for fine-tuning customer models across multi-tenant GPU compute partitions.',
  },
  {
    page: 34,
    quote: 'Cross-region automated failover guarantees 99.99% availability with zero-downtime key rotation protocols.',
  },
];

function renderDocumentReference({
  title = 'Annual Platform Security Audit 2024.pdf',
  pages = 48,
  anchors = SAMPLE_ANCHORS,
  activePage = 12,
} = {}) {
  const anchorsHtml = anchors
    .map(
      (a) => `
    <button type="button" class="ds-doc-anchor" data-page="${a.page}" aria-current="${a.page === activePage ? 'true' : 'false'}">
      <span class="ds-doc-anchor__page">p. ${a.page}</span>
      <span class="ds-doc-anchor__quote">${a.quote}</span>
    </button>
  `
    )
    .join('');

  return `
    <div data-slot="document-reference" class="ds-doc-reference">
      <div class="ds-doc-reference__header">
        <div class="ds-doc-reference__icon-box">${FILE_TEXT}</div>
        <div class="ds-doc-reference__meta">
          <span class="ds-doc-reference__title">${title}</span>
          <span class="ds-doc-reference__subtitle">${pages} pages · ${anchors.length} cited</span>
        </div>
      </div>
      <div class="ds-doc-reference__list">
        ${anchorsHtml}
      </div>
    </div>
  `;
}

function bindInteractiveAnchors(root) {
  const anchors = root.querySelectorAll('.ds-doc-anchor');
  anchors.forEach((btn) => {
    btn.addEventListener('click', () => {
      anchors.forEach((a) => a.setAttribute('aria-current', 'false'));
      btn.setAttribute('aria-current', 'true');
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>38 Document Reference (Interactive Citation Jumps)</code></header>
        <div class="ds-doc-target">
          ${renderDocumentReference({ activePage: 12 })}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-doc-target');
    bindInteractiveAnchors(target);
    return root;
  },
};
