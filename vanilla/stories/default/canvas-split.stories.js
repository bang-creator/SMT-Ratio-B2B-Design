import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 91 Canvas',
  parameters: { layout: 'padded' },
};

const FILE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const DEFAULT_LINES = [
  { text: 'Migrating to 0.14', heading: true },
  { text: 'The composer now owns its draft, so `useState` in the parent is no longer read.' },
  { text: 'Replace the local draft with `useDraft(threadId)` and drop the hydrate effect.' },
  { text: 'Threads that switch mid-edit keep their own draft instead of inheriting the last one.' },
];

const LONG_LINES = [
  ...DEFAULT_LINES,
  { text: 'Remote thread lists', heading: true },
  { text: '`RemoteThreadListAdapter.list` now returns a cursor. Pass it back to load the next page.' },
  { text: 'Archived threads are excluded by default. Set `includeArchived: true` to keep the old behavior.' },
  { text: 'Attachments', heading: true },
  { text: '`SimpleImageAttachmentAdapter` is now exported from `@assistant-ui/react`. Update the import path.' },
  { text: 'Uploads larger than 20 MB are rejected before the request starts, with a typed error you can show in the composer.' },
];

function renderCanvasSplit({
  title = 'migration-0.14.md',
  version = 3,
  saved = true,
  writing = false,
  reply = 'Done. The note is saved as version 3.',
  lines = DEFAULT_LINES,
  disabled = false,
} = {}) {
  return `
    <div data-slot="canvas-split" class="ds-canvas-split">
      <div data-slot="canvas-split-thread" class="ds-canvas-split__thread">
        <div data-slot="canvas-split-message" data-speaker="user" class="ds-canvas-split__message">
          Draft the migration note for 0.14
        </div>
        <div data-slot="canvas-split-message" data-speaker="assistant" class="ds-canvas-split__message">
          ${reply}
        </div>
      </div>

      <div data-slot="canvas-split-document" class="ds-canvas-split__doc">
        <div data-slot="canvas-split-header" class="ds-canvas-split__doc-header">
          <span class="ds-canvas-split__doc-icon" aria-hidden="true">${FILE_ICON}</span>
          <span class="ds-canvas-split__doc-title" title="${title}">${title}</span>
          <span class="ds-canvas-split__doc-version">v${version}</span>
          <span data-slot="canvas-saved-status" class="ds-canvas-split__doc-status" data-saved="${saved}">
            ${saved ? `${CHECK_ICON} saved` : 'editing'}
          </span>
          <button
            type="button"
            aria-label="Copy ${title}"
            class="ds-canvas-split__btn"
            ${disabled ? 'disabled' : ''}
            data-slot="copy-btn"
          >
            ${COPY_ICON}
          </button>
          <button
            type="button"
            aria-label="Close canvas"
            class="ds-canvas-split__btn"
            ${disabled ? 'disabled' : ''}
            data-slot="close-btn"
          >
            ${X_ICON}
          </button>
        </div>

        <div data-slot="canvas-split-body" class="ds-canvas-split__doc-body">
          ${lines
            .map(
              (l) => `
            <p
              data-slot="canvas-split-line"
              ${l.heading ? 'data-heading="true"' : ''}
              class="ds-canvas-split__line"
            >${l.text}</p>
          `,
            )
            .join('')}
          ${writing ? `<span class="ds-canvas-split__cursor" aria-hidden="true"></span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isClosed = false;
    let isCopied = false;

    const render = () => {
      let bodyHtml = '';
      let badgeText = isClosed ? 'Canvas Closed' : isCopied ? 'Copied!' : 'v3 Saved';

      if (isClosed) {
        bodyHtml = `
          <div data-slot="canvas-split" class="ds-canvas-split ds-canvas-split--closed ds-flex ds-items-center ds-justify-center">
            <span class="ds-text-secondary ds-text-sm" data-slot="closed-notice">Canvas closed.</span>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-ms-3" data-slot="reopen-canvas">
              Reopen
            </button>
          </div>
        `;
      } else {
        bodyHtml = renderCanvasSplit({
          title: isCopied ? 'Copied to clipboard!' : 'migration-0.14.md',
        });
      }

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${bodyHtml}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="reopen-canvas"]')?.addEventListener('click', () => {
        isClosed = false;
        render();
      });

      const copyBtn = root.querySelector('[data-slot="copy-btn"]');
      const closeBtn = root.querySelector('[data-slot="close-btn"]');

      copyBtn?.addEventListener('click', () => {
        isCopied = true;
        render();
        setTimeout(() => {
          isCopied = false;
          render();
        }, 1500);
      });

      closeBtn?.addEventListener('click', () => {
        isClosed = true;
        render();
      });
    };

    render();
    return root;
  },
};

export const Empty = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCanvasSplit({
        title: 'migration-0.14.md',
        version: 1,
        saved: false,
        writing: true,
        reply: 'Opening it in the canvas.',
        lines: [],
      })}
    </div>
  </div>
`);

export const Writing = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCanvasSplit({
        title: 'migration-0.14.md',
        version: 3,
        saved: false,
        writing: true,
        reply: 'Opened it in the canvas. Editing now.',
        lines: DEFAULT_LINES.slice(0, 2),
      })}
    </div>
  </div>
`);

export const LongDocument = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCanvasSplit({
        title: 'migration-0.14-composer-drafts-and-remote-thread-list-upgrade-guide.md',
        version: 12,
        saved: true,
        reply: 'Opened it in the canvas with the full upgrade guide.',
        lines: LONG_LINES,
      })}
    </div>
  </div>
`);
