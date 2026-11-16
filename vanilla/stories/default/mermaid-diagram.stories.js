import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 125 Mermaid diagram AUI',
  parameters: { layout: 'padded' },
};

const MAXIMIZE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;
const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const MINUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ROTATE_CCW_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`;
const CLOSE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const FLOWCHART_SVG = `
  <svg width="340" height="120" viewBox="0 0 340 120" fill="none" class="ds-w-full ds-text-primary" aria-label="Mermaid diagram flowchart">
    <rect x="10" y="40" width="80" height="36" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></rect>
    <text x="50" y="62" fill="var(--color-semantic-text-primary)" font-size="12" text-anchor="middle" font-weight="normal">Request</text>
    
    <path d="M 90 58 L 130 58" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>
    
    <polygon points="170,38 210,58 170,78 130,58" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></polygon>
    <text x="170" y="62" fill="var(--color-semantic-text-primary)" font-size="12" text-anchor="middle" font-weight="normal">Cached?</text>
    
    <path d="M 210 58 L 250 58" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>
    <text x="230" y="52" fill="var(--color-semantic-text-secondary)" font-size="10" text-anchor="middle">Yes</text>
    
    <rect x="250" y="40" width="80" height="36" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></rect>
    <text x="290" y="62" fill="var(--color-semantic-text-primary)" font-size="12" text-anchor="middle" font-weight="normal">Return</text>
  </svg>
`;

const SEQUENCE_SVG = `
  <svg width="420" height="140" viewBox="0 0 420 140" fill="none" class="ds-w-full ds-text-primary" aria-label="Mermaid sequence diagram">
    <rect x="20" y="10" width="70" height="28" rx="4" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="55" y="28" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">User</text>
    <line x1="55" y1="38" x2="55" y2="130" stroke="var(--color-semantic-border-subtle)" stroke-dasharray="3 3"></line>

    <rect x="175" y="10" width="70" height="28" rx="4" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="210" y="28" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">Assistant</text>
    <line x1="210" y1="38" x2="210" y2="130" stroke="var(--color-semantic-border-subtle)" stroke-dasharray="3 3"></line>

    <rect x="320" y="10" width="80" height="28" rx="4" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="360" y="28" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">search_docs</text>
    <line x1="360" y1="38" x2="360" y2="130" stroke="var(--color-semantic-border-subtle)" stroke-dasharray="3 3"></line>

    <line x1="55" y1="60" x2="210" y2="60" stroke="var(--color-semantic-accent-control)" stroke-width="1.5"></line>
    <text x="130" y="55" fill="var(--color-semantic-text-secondary)" font-size="10" text-anchor="middle">How do I persist drafts?</text>

    <line x1="210" y1="85" x2="360" y2="85" stroke="var(--color-semantic-accent-control)" stroke-width="1.5"></line>
    <text x="285" y="80" fill="var(--color-semantic-text-secondary)" font-size="10" text-anchor="middle">query "draft persistence"</text>

    <line x1="360" y1="105" x2="210" y2="105" stroke="var(--color-semantic-text-secondary)" stroke-dasharray="2 2" stroke-width="1.5"></line>
    <text x="285" y="100" fill="var(--color-semantic-text-secondary)" font-size="10" text-anchor="middle">3 matches</text>
  </svg>
`;

const PIPELINE_SVG = `
  <svg width="520" height="100" viewBox="0 0 520 100" fill="none" class="ds-w-full ds-text-primary" aria-label="Mermaid pipeline graph">
    <rect x="10" y="32" width="60" height="32" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="40" y="52" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">Push</text>
    <path d="M 70 48 L 100 48" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>

    <rect x="100" y="32" width="60" height="32" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="130" y="52" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">Build</text>
    <path d="M 160 48 L 190 48" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>

    <rect x="190" y="32" width="60" height="32" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="220" y="52" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">Test</text>
    <path d="M 250 48 L 280 48" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>

    <polygon points="310,32 340,48 310,64 280,48" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></polygon>
    <text x="310" y="52" fill="var(--color-semantic-text-primary)" font-size="10" text-anchor="middle">Pass?</text>
    <path d="M 340 48 L 380 48" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>
    <text x="360" y="42" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">Yes</text>

    <rect x="380" y="32" width="60" height="32" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="410" y="52" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">Deploy</text>
    <path d="M 440 48 L 470 48" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></path>

    <rect x="470" y="32" width="40" height="32" rx="6" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
    <text x="490" y="52" fill="var(--color-semantic-text-primary)" font-size="11" text-anchor="middle">CDN</text>
  </svg>
`;

function renderMermaidCard({ content, showControls = true } = {}) {
  return `
    <div class="ds-mermaid-card" data-slot="mermaid-card">
      <div class="ds-mermaid-header">
        <span data-slot="mermaid-label">mermaid</span>
        ${
          showControls
            ? `
          <div class="ds-mermaid-header__actions">
            <button
              type="button"
              class="ds-image-btn"
              data-action="open-lightbox"
              aria-label="Expand diagram"
            >
              ${MAXIMIZE_ICON}
            </button>
          </div>
        `
            : ''
        }
      </div>
      ${content}

      <div class="ds-mermaid-lightbox is-hidden" data-slot="mermaid-lightbox" role="dialog" aria-modal="true" aria-label="Expanded diagram">
        <div class="ds-mermaid-lightbox__toolbar">
          <span class="ds-font-mono ds-text-xs ds-text-secondary">Diagram Viewer</span>
          <div class="ds-flex ds-items-center ds-gap-1">
            <button type="button" class="ds-image-btn" data-action="zoom-in" aria-label="Zoom in">${PLUS_ICON}</button>
            <button type="button" class="ds-image-btn" data-action="zoom-out" aria-label="Zoom out">${MINUS_ICON}</button>
            <button type="button" class="ds-image-btn" data-action="reset-zoom" aria-label="Reset zoom">${ROTATE_CCW_ICON}</button>
            <button type="button" class="ds-image-btn" data-action="close-lightbox" aria-label="Close diagram">${CLOSE_ICON}</button>
          </div>
        </div>
        <div class="ds-mermaid-lightbox__canvas" data-slot="lightbox-canvas">
          ${content}
        </div>
      </div>
    </div>
  `;
}

function attachMermaidInteractivity(root) {
  const expandBtn = root.querySelector('[data-action="open-lightbox"]');
  const lightbox = root.querySelector('[data-slot="mermaid-lightbox"]');
  const closeBtn = root.querySelector('[data-action="close-lightbox"]');

  if (expandBtn && lightbox) {
    expandBtn.addEventListener('click', () => {
      lightbox.classList.remove('is-hidden');
    });
  }

  if (closeBtn && lightbox) {
    closeBtn.addEventListener('click', () => {
      lightbox.classList.add('is-hidden');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.classList.contains('is-hidden')) {
        lightbox.classList.add('is-hidden');
      }
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderMermaidCard({
      content: `<div class="ds-mermaid-canvas" data-slot="mermaid-canvas">${FLOWCHART_SVG}</div>`,
    });
    attachMermaidInteractivity(root);
    return root;
  },
};

export const Streaming = story(
  () => renderMermaidCard({
    showControls: false,
    content: `
      <div class="ds-mermaid-skeleton" data-slot="skeleton">
        <div class="ds-mermaid-skeleton-node"></div>
        <div class="ds-mermaid-skeleton-line"></div>
        <div class="ds-mermaid-skeleton-node"></div>
      </div>
    `,
  })
);

export const Partial = story(
  () => renderMermaidCard({
    showControls: false,
    content: `
      <div class="ds-p-4 ds-bg-surface-secondary">
        <div class="ds-text-xs ds-text-danger ds-mb-2">Diagram syntax incomplete:</div>
        <pre class="ds-highlighter-code ds-p-2 ds-bg-surface-primary ds-rounded"><code>graph TD\n    A[Request] --&gt; B{Cached?}\n    B --&gt;|Yes| C[Return cached]\n    B --&gt;|No| </code></pre>
      </div>
    `,
  })
);

export const Sequence = story(
  () => renderMermaidCard({
    content: `<div class="ds-mermaid-canvas" data-slot="mermaid-canvas">${SEQUENCE_SVG}</div>`,
  })
);

export const LongContent = story(
  () => renderMermaidCard({
    content: `<div class="ds-mermaid-canvas" data-slot="mermaid-canvas">${PIPELINE_SVG}</div>`,
  })
);
