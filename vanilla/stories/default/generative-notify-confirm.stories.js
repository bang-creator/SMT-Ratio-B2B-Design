import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 147 Confirm dialog AUI',
  parameters: { layout: 'padded' },
};

const TRASH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
const INFO_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderConfirmDialog({
  title = 'Delete this file?',
  desc = 'This action cannot be undone. Are you sure you want to continue?',
  cancelText = 'Cancel',
  confirmText = 'Yes, delete',
  variant = 'danger', // 'danger' | 'info' | 'confirmed'
} = {}) {
  if (variant === 'confirmed') {
    return `
      <div class="ds-generative-card ds-gen-confirm-card" data-slot="generative-card" role="status">
        <div class="ds-flex ds-items-center ds-justify-between ds-p-2">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
            ${CHECK_ICON}
            <span>Action completed successfully</span>
          </div>
          <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="reset">
            Reset
          </button>
        </div>
      </div>
    `;
  }

  const isDanger = variant === 'danger';
  const iconSvg = isDanger ? TRASH_ICON : INFO_ICON;
  const confirmBtnClass = isDanger ? 'ds-button--danger' : 'ds-button--primary';

  return `
    <div class="ds-generative-card ds-gen-confirm-card" data-slot="generative-card" role="alertdialog" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-desc">
      <div class="ds-gen-confirm-card__header">
        <div class="ds-gen-confirm-card__icon ${isDanger ? 'ds-gen-confirm-card__icon--danger' : 'ds-gen-confirm-card__icon--info'}">
          ${iconSvg}
        </div>
        <div class="ds-gen-confirm-card__body">
          <h3 id="confirm-dialog-title" class="ds-gen-confirm-card__title">${title}</h3>
          <p id="confirm-dialog-desc" class="ds-gen-confirm-card__desc">${desc}</p>
        </div>
      </div>

      <div class="ds-gen-confirm-card__actions" data-slot="actions">
        <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="cancel">${cancelText}</button>
        <button type="button" class="ds-button ${confirmBtnClass} ds-button--sm" data-action="confirm">${confirmText}</button>
      </div>
    </div>
  `;
}

function attachConfirmHandler(root) {
  const card = root.querySelector('[data-slot="generative-card"]');
  const confirmBtn = root.querySelector('[data-action="confirm"]');
  const cancelBtn = root.querySelector('[data-action="cancel"]');
  if (!card) return;

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      card.innerHTML = `
        <div class="ds-flex ds-items-center ds-justify-between ds-p-2">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
            ${CHECK_ICON}
            <span>File deleted successfully</span>
          </div>
          <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="undo">
            Undo
          </button>
        </div>
      `;

      const undoBtn = card.querySelector('[data-action="undo"]');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          card.parentElement.innerHTML = renderConfirmDialog();
          attachConfirmHandler(root);
        });
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      card.innerHTML = `
        <div class="ds-flex ds-items-center ds-justify-between ds-p-2">
          <span class="ds-text-xs ds-text-secondary">Deletion cancelled</span>
          <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="retry">
            Reopen
          </button>
        </div>
      `;
      const retryBtn = card.querySelector('[data-action="retry"]');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          card.parentElement.innerHTML = renderConfirmDialog();
          attachConfirmHandler(root);
        });
      }
    });
  }
}

export const Default = story(
  () => stage(renderConfirmDialog()),
  { postRender: attachConfirmHandler }
);

export const Info = story(() =>
  stage(
    renderConfirmDialog({
      variant: 'info',
      title: 'Publish changes to Production?',
      desc: 'All 151 application component updates will be deployed live to the shared Storybook catalog.',
      cancelText: 'Keep as draft',
      confirmText: 'Publish changes',
    })
  )
);

export const Confirmed = story(() =>
  stage(
    renderConfirmDialog({
      variant: 'confirmed',
    })
  )
);

export const LongDescription = story(() =>
  stage(
    renderConfirmDialog({
      title: 'Revoke root API key "prod-master-key-01"?',
      desc: 'Revoking this key immediately breaks authentication for 14 automated background workers, 3 third-party CRM webhook endpoints, and all live client SDK queries until keys are rotated in secrets management.',
      cancelText: 'Cancel',
      confirmText: 'Revoke key now',
    })
  )
);
