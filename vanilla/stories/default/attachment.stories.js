import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 111 Attachment AUI',
  parameters: { layout: 'padded' },
};

const FILE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
const IMAGE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
const TABLE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path></svg>`;
const X_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const SPINNER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
const ALERT_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-text-danger" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

function getIconForType(type) {
  if (type === 'image') return IMAGE_ICON;
  if (type === 'table') return TABLE_ICON;
  return FILE_ICON;
}

function renderAttachmentCard({
  id = 'att-1',
  name = 'q3-financial-report.pdf',
  meta = '2.4 MB · PDF',
  type = 'document',
  status = 'ready', // 'ready' | 'uploading' | 'error' | 'sent'
  progress = 0,
} = {}) {
  const icon = getIconForType(type);

  let action = '';
  if (status === 'uploading') {
    action = `<span class="ds-attachment-action">${SPINNER_ICON}</span>`;
  } else if (status === 'error') {
    action = `<span class="ds-attachment-action">${ALERT_ICON}</span>`;
  } else if (status === 'sent') {
    action = '';
  } else {
    action = `
      <button
        type="button"
        aria-label="Remove ${name}"
        data-action="remove-attachment"
        data-attachment-id="${id}"
        class="ds-attachment-remove-btn"
      >
        ${X_ICON}
      </button>
    `;
  }

  return `
    <div
      data-slot="attachment"
      data-attachment-id="${id}"
      data-status="${status}"
      class="ds-attachment-card"
    >
      <div class="ds-attachment-thumb" aria-hidden="true">
        ${icon}
      </div>
      <div class="ds-attachment-info">
        <span class="ds-attachment-name" title="${name}" data-slot="attachment-name">${name}</span>
        <span class="ds-attachment-meta" data-slot="attachment-meta">${meta}</span>
      </div>
      ${action}
      ${
        status === 'uploading'
          ? `<div class="ds-attachment-progress-bar" data-progress="${progress}" data-slot="progress-bar"></div>`
          : ''
      }
    </div>
  `;
}

function attachAttachmentHandlers(root) {
  const removeButtons = root.querySelectorAll('[data-action="remove-attachment"]');
  removeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-attachment-id');
      const card = root.querySelector(`[data-attachment-id="${id}"]`);
      if (card) {
        card.remove();
      }
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-flex ds-flex-col ds-gap-4">
        <div class="ds-flex ds-flex-wrap ds-gap-2" data-slot="interactive-row">
          ${renderAttachmentCard({ id: 'card-1', name: 'financial-audit-oct.pdf', meta: '3.1 MB · PDF', type: 'document' })}
          ${renderAttachmentCard({ id: 'card-2', name: 'app-preview.png', meta: '680 KB · PNG', type: 'image' })}
        </div>
        <div class="ds-flex ds-items-center ds-gap-2">
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-action="reset">
            Reset Cards
          </button>
        </div>
      </div>
    `;

    const row = root.querySelector('[data-slot="interactive-row"]');
    const resetBtn = root.querySelector('[data-action="reset"]');

    attachAttachmentHandlers(root);

    if (resetBtn && row) {
      resetBtn.addEventListener('click', () => {
        row.innerHTML = `
          ${renderAttachmentCard({ id: 'card-1', name: 'financial-audit-oct.pdf', meta: '3.1 MB · PDF', type: 'document' })}
          ${renderAttachmentCard({ id: 'card-2', name: 'app-preview.png', meta: '680 KB · PNG', type: 'image' })}
        `;
        attachAttachmentHandlers(row);
      });
    }

    return root;
  },
};

export const Uploading = story(`
  <div class="ds-flex ds-flex-wrap ds-gap-2">
    ${renderAttachmentCard({ id: 'up-1', name: 'checkout-bug.svg', meta: 'Uploading...', type: 'image', status: 'uploading', progress: 40 })}
    ${renderAttachmentCard({ id: 'up-2', name: 'q3-report.pdf', meta: 'Uploading...', type: 'document', status: 'uploading', progress: 70 })}
  </div>
`);

export const Error = story(`
  <div class="ds-flex ds-flex-wrap ds-gap-2">
    ${renderAttachmentCard({ id: 'err-1', name: 'large-dump.pdf', meta: 'File is larger than 10 MB limit', type: 'document', status: 'error' })}
  </div>
`);

export const Sent = story(`
  <div class="ds-flex ds-flex-col ds-gap-2 ds-items-end">
    <div class="ds-flex ds-gap-2">
      ${renderAttachmentCard({ id: 'sent-1', name: 'checkout-total.jpg', meta: '340 KB · JPG', type: 'image', status: 'sent' })}
      ${renderAttachmentCard({ id: 'sent-2', name: 'q3-report.pdf', meta: '1.2 MB · PDF', type: 'document', status: 'sent' })}
    </div>
    <div class="ds-thread-aui__msg--user">
      Why does the total jump on this screen? The numbers are in the report.
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-flex ds-gap-2 ds-overflow-x-auto ds-p-1 ds-max-w-xl">
    ${renderAttachmentCard({ id: 'many-1', name: 'checkout-bug.svg', meta: 'SVG', type: 'image' })}
    ${renderAttachmentCard({ id: 'many-2', name: 'q3-report.pdf', meta: 'PDF', type: 'document' })}
    ${renderAttachmentCard({ id: 'many-3', name: 'orders-oct.csv', meta: 'CSV', type: 'table' })}
    ${renderAttachmentCard({ id: 'many-4', name: 'contract-draft.docx', meta: 'DOCX', type: 'document' })}
    ${renderAttachmentCard({ id: 'many-5', name: 'mobile-checkout.svg', meta: 'SVG', type: 'image' })}
    ${renderAttachmentCard({ id: 'many-6', name: 'error-log.txt', meta: 'TXT', type: 'document' })}
  </div>
`);
