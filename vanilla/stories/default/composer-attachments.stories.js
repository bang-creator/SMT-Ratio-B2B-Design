import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 78 Attachments',
  parameters: { layout: 'padded' },
};

const ICONS = {
  image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
  archive: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>`,
  text: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>`,
  spinner: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  x: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
};

function renderAttachmentsComposer({
  value = '',
  placeholder = 'Ask anything',
  attachments = [],
} = {}) {
  const chipsHtml = attachments
    .map((att) => {
      const icon = ICONS[att.kind] || ICONS.text;
      let actionHtml = '';

      if (att.state === 'uploading') {
        actionHtml = `<span class="ds-composer-attachment-spinner">${ICONS.spinner}</span>`;
      } else if (att.removable !== false) {
        actionHtml = `
          <button
            type="button"
            aria-label="Remove ${att.name}"
            data-slot="composer-attachment-remove"
            data-file="${att.name}"
            class="ds-composer-attachment-remove-btn"
          >
            ${ICONS.x}
          </button>
        `;
      } else {
        actionHtml = `<span class="ds-composer-attachment-status-check">${ICONS.check}</span>`;
      }

      return `
        <div
          data-slot="composer-attachment"
          data-state="${att.state || 'done'}"
          data-name="${att.name}"
          class="ds-composer-attachment"
        >
          <span class="ds-composer-attachment-icon-box" aria-hidden="true">
            ${icon}
          </span>
          <span class="ds-composer-attachment-info">
            <span class="ds-composer-attachment-name" title="${att.name}">${att.name}</span>
            <span class="ds-composer-attachment-meta">${att.meta}</span>
          </span>
          <span class="ds-composer-attachment-action">
            ${actionHtml}
          </span>
          ${
            att.state === 'uploading'
              ? `
            <span class="ds-composer-attachment-progress" data-pct="${att.progress || 0}" aria-hidden="true">
              <span class="ds-composer-attachment-progress-fill"></span>
            </span>
          `
              : ''
          }
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="composer" class="ds-composer">
      <div data-slot="composer-bar" class="ds-composer-bar">
        ${
          attachments.length > 0
            ? `
          <div data-slot="composer-attachments" class="ds-composer-attachments">
            ${chipsHtml}
          </div>
        `
            : ''
        }

        <input
          type="text"
          data-slot="composer-input"
          class="ds-composer-input"
          placeholder="${placeholder}"
          value="${value}"
          aria-label="Composer query input"
        />

        <div data-slot="composer-toolbar" class="ds-composer-toolbar">
          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-attach"
              class="ds-composer-attach-btn ds-icon-button ds-icon-button--ghost ds-button--pill"
              aria-label="Add attachment"
            >
              ${ICONS.plus}
            </button>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-send"
              data-state="${value.trim().length > 0 || attachments.length > 0 ? 'active' : 'idle'}"
              class="ds-composer-send-btn ${value.trim().length > 0 || attachments.length > 0 ? 'ds-composer-send-btn--active' : ''}"
              aria-label="Send message"
              ${value.trim().length === 0 && attachments.length === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowUp}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const INITIAL_FILES = [
      { name: 'design-spec.pdf', meta: '1.4 MB', state: 'done', kind: 'text', removable: true },
      { name: 'screenshot.png', meta: '420 KB', state: 'done', kind: 'image', removable: true },
    ];

    let currentFiles = [...INITIAL_FILES];
    let query = 'Inspect token contracts in these documents';

    const render = () => {
      const badgeText = currentFiles.length > 0
        ? `${currentFiles.length} file${currentFiles.length > 1 ? 's' : ''} attached`
        : 'All removed (click + to restore)';

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">78 Attachments</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderAttachmentsComposer({
              attachments: currentFiles,
              value: query,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="composer-input"]');
      input?.addEventListener('input', (e) => {
        query = e.target.value;
      });

      root.querySelectorAll('[data-slot="composer-attachment-remove"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const file = btn.getAttribute('data-file');
          currentFiles = currentFiles.filter((f) => f.name !== file);
          render();
        });
      });

      root.querySelector('[data-slot="composer-attach"]')?.addEventListener('click', () => {
        if (currentFiles.length === 0) {
          currentFiles = [...INITIAL_FILES];
        } else {
          currentFiles.push({
            name: `audit-report-${currentFiles.length + 1}.log`,
            meta: '38 KB',
            state: 'done',
            kind: 'text',
            removable: true,
          });
        }
        render();
      });
    };

    render();
    return root;
  },
};

export const Uploading = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">78 Attachments (Uploading)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">In Flight</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderAttachmentsComposer({
        value: '',
        attachments: [
          {
            name: 'screenshot.png',
            meta: 'uploading',
            state: 'uploading',
            progress: 62,
            kind: 'image',
          },
          {
            name: 'fixtures.zip',
            meta: 'uploading',
            state: 'uploading',
            progress: 18,
            kind: 'archive',
          },
        ],
      })}
    </div>
  </div>
`);

export const Failed = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">78 Attachments (Failed)</span>
      <span class="ds-badge ds-badge--danger ds-badge--sm">Upload Error</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderAttachmentsComposer({
        value: 'Why does this trace stall at step 4?',
        attachments: [
          {
            name: 'trace.log',
            meta: '38 KB',
            state: 'done',
            kind: 'text',
          },
          {
            name: 'heap-snapshot.zip',
            meta: 'Too large, max 25 MB',
            state: 'error',
            kind: 'archive',
          },
        ],
      })}
    </div>
  </div>
`);

export const ManyFiles = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">78 Attachments (Many Files)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Multi-row Wrap</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderAttachmentsComposer({
        value: '',
        attachments: [
          { name: 'home.png', meta: '212 KB', state: 'done', kind: 'image' },
          { name: 'settings.png', meta: '184 KB', state: 'done', kind: 'image' },
          { name: 'checkout.png', meta: '201 KB', state: 'done', kind: 'image' },
          { name: 'server.log', meta: '1.2 MB', state: 'done', kind: 'text' },
          { name: 'build-output.zip', meta: '4.8 MB', state: 'done', kind: 'archive' },
        ],
      })}
    </div>
  </div>
`);
