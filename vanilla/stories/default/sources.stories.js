import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 116 Sources AUI',
  parameters: { layout: 'padded' },
};

const CHEVRON_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const FILE_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;

const SAMPLE_SOURCES = [
  {
    domain: 'github.com',
    title: 'OpenAI Platform design system repo',
    url: 'https://github.com/openai/platform-design-system',
    snippet: 'Production grade pure vanilla web component architecture with strict token integration.',
    author: 'Design Systems Team',
    publishedAt: '2026-03-15',
  },
  {
    domain: 'openai.com',
    title: 'Platform developer documentation & guides',
    url: 'https://platform.openai.com/docs',
    snippet: 'Explore APIs, prompt engineering guides, fine-tuning playbooks, and token limits.',
    author: 'OpenAI Developer Docs',
    publishedAt: '2026-04-01',
  },
  {
    domain: 'w3.org',
    title: 'WCAG 2.1 accessibility guidelines and contrast standards',
    url: 'https://www.w3.org/WAI/WCAG21/quickref/',
    snippet: 'Official standards for Web Content Accessibility Guidelines and inclusive design.',
    author: 'W3C WAI',
    publishedAt: '2025-11-20',
  },
  {
    domain: 'storybook.js.org',
    title: 'Storybook 8 component catalog & interaction testing API',
    url: 'https://storybook.js.org/docs',
    snippet: 'Component driven UI development platform for automated visual regression and testing.',
    author: 'Storybook Maintainers',
    publishedAt: '2026-01-10',
  },
];

function renderSourcesWidget({
  sources = SAMPLE_SOURCES,
  open = true,
  layout = 'grid',
  interactive = false,
} = {}) {
  const badgeDomains = sources.slice(0, 3).map((s) => s.domain || 'doc');

  return `
    <div data-slot="sources" class="ds-sources-box" data-layout="${layout}">
      <button
        type="button"
        class="ds-sources-trigger"
        data-action="toggle-sources"
        aria-expanded="${open ? 'true' : 'false'}"
        aria-label="Toggle sources view"
      >
        ${
          badgeDomains.length > 0
            ? `
          <span class="ds-sources-trigger__badges" aria-hidden="true">
            ${badgeDomains
              .map(
                (d) => `
              <span class="ds-sources-trigger__badge" data-slot="sources-badge">${d.charAt(0).toUpperCase()}</span>
            `,
              )
              .join('')}
          </span>
        `
            : ''
        }
        <span>Sources</span>
        <span class="ds-sources-trigger__count" data-slot="sources-count">${sources.length}</span>
        <span class="ds-sources-trigger__chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
      </button>

      <div
        class="ds-sources-panel ${open ? '' : 'is-collapsed'}"
        data-slot="sources-panel"
      >
        <div class="${layout === 'list' ? 'ds-sources-list' : 'ds-sources-grid'}">
          ${sources
            .map((source, index) => {
              const isDocument = source.type === 'document';
              const glyph = isDocument
                ? `<span class="ds-source-glyph" aria-hidden="true">${FILE_ICON}</span>`
                : `<span class="ds-source-glyph" aria-hidden="true">${(source.domain || 'D').charAt(0).toUpperCase()}</span>`;
              const isSafe = !isDocument && source.url && !source.url.startsWith('javascript:');
              const tag = isSafe ? 'a' : 'div';
              const hrefAttr = isSafe
                ? `href="${source.url}" target="_blank" rel="noopener noreferrer"`
                : '';

              return `
                <${tag}
                  ${hrefAttr}
                  class="ds-source-card ${layout === 'list' ? 'ds-source-card--list' : ''}"
                  data-slot="source-card"
                  data-index="${index}"
                >
                  <div class="ds-source-card__header">
                    ${glyph}
                    <span class="ds-source-card__domain">${source.domain || source.mediaType || 'Document'}</span>
                  </div>
                  <span class="ds-source-card__title">${source.title || source.domain}</span>
                  ${
                    source.snippet
                      ? `
                    <span class="ds-source-card__snippet">${source.snippet}</span>
                  `
                      : ''
                  }
                  ${
                    source.author
                      ? `
                    <span class="ds-source-card__meta">${source.author} · ${source.publishedAt}</span>
                  `
                      : ''
                  }
                </${tag}>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function attachSourcesInteractivity(root) {
  const trigger = root.querySelector('[data-action="toggle-sources"]');
  const panel = root.querySelector('[data-slot="sources-panel"]');

  if (trigger && panel) {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;
      trigger.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      if (nextExpanded) {
        panel.classList.remove('is-collapsed');
      } else {
        panel.classList.add('is-collapsed');
      }
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderSourcesWidget({ open: true, interactive: true });
    attachSourcesInteractivity(root);
    return root;
  },
};

export const NoTitle = story(
  () => renderSourcesWidget({
    open: true,
    sources: [
      { domain: 'developer.mozilla.org', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
      { domain: 'nodejs.org', url: 'https://nodejs.org/api/stream.html' },
    ],
  })
);

export const Documents = story(
  () => renderSourcesWidget({
    open: true,
    sources: [
      { type: 'document', title: 'Q3 board deck.pdf', mediaType: 'application/pdf' },
      { type: 'document', title: 'pricing-2026.xlsx', mediaType: 'spreadsheet' },
    ],
  })
);

export const UnsafeUrl = story(
  () => renderSourcesWidget({
    open: true,
    sources: [
      { domain: 'untrusted', title: 'Untrusted link', url: 'javascript:alert(document.cookie)' },
    ],
  })
);

export const IconFallback = story(
  () => renderSourcesWidget({
    open: true,
    sources: [
      { domain: 'internal.acme.dev', title: 'Deploy runbook', url: 'https://internal.acme.dev/runbooks/deploy' },
      { domain: 'wiki.acme.dev', title: 'On-call guide', url: 'https://wiki.acme.dev/oncall' },
    ],
  })
);

export const LongContent = story(
  () => renderSourcesWidget({
    open: true,
    layout: 'list',
    sources: [
      {
        domain: 'react.dev',
        title: 'useSyncExternalStore: subscribing to an external store from a component',
        url: 'https://react.dev/reference/react/useSyncExternalStore',
      },
      {
        domain: 'rfc-editor.org',
        title: 'RFC 9110: HTTP Semantics, Section 15.5.20 (421 Misdirected Request)',
        url: 'https://www.rfc-editor.org/rfc/rfc9110.html',
      },
      {
        type: 'document',
        title: '2026 vendor security questionnaire, final signed copy.pdf',
        mediaType: 'application/pdf',
      },
    ],
  })
);
