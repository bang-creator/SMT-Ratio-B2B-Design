import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Modal',
  parameters: { layout: 'padded' },
};

/* Source: .htOZM + ._5XoXU on platform.openai.com
 * Ground truth:
 * - Backdrop: blurred canvas overlay with fade-in
 * - Dialog: max-width 480px, 12px radius, elevated surface, shadow-lg
 * - Entrance: scale(0.96) translateY(8px) -> scale(1) translateY(0)
 * - Header: title + 28px close icon button
 * - Footer: action buttons (Cancel / Confirm)
 * - Keyboard: Escape closes, backdrop click closes */

export const Default = story(
  'Default / Shared / Modal / Default',
  stage(
    'Standard Action Modal',
    `<div class="ds-row">
      <button class="ds-button ds-button--primary" data-ds-dialog-open="#modal-standard" type="button">
        <span>Create secret key</span>
      </button>
      <div class="ds-dialog__backdrop" id="modal-standard" role="dialog" aria-modal="true" hidden>
        <section class="ds-dialog">
          <div class="ds-dialog__header">
            <h3>Create new secret key</h3>
            <button class="ds-icon-button" data-ds-dialog-close aria-label="Close dialog" type="button">
              <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="ds-dialog__body">
            <div class="ds-stack">
              <label>
                <span class="ds-label">Key name</span>
                <input type="text" class="ds-input" placeholder="e.g. CI/CD Pipeline Deployment" autofocus>
              </label>
              <span class="ds-muted">You will only be able to view this secret key once after creation.</span>
            </div>
          </div>
          <div class="ds-dialog__footer">
            <button class="ds-button ds-button--secondary" data-ds-dialog-close type="button">Cancel</button>
            <button class="ds-button ds-button--primary" type="button">Create key</button>
          </div>
        </section>
      </div>
    </div>`
  )
);

export const Destructive = story(
  'Default / Shared / Modal / Destructive',
  stage(
    'Destructive Confirmation Dialog',
    `<div class="ds-row">
      <button class="ds-button ds-button--danger" data-ds-dialog-open="#modal-destructive" type="button">
        <span>Revoke API key</span>
      </button>
      <div class="ds-dialog__backdrop" id="modal-destructive" role="dialog" aria-modal="true" hidden>
        <section class="ds-dialog">
          <div class="ds-dialog__header">
            <h3>Revoke secret key</h3>
            <button class="ds-icon-button" data-ds-dialog-close aria-label="Close dialog" type="button">
              <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="ds-dialog__body">
            <p>Are you sure you want to revoke key <strong>sk-prod-9xK2048</strong>? Any application or script relying on this token will immediately fail with a 401 Unauthorized error.</p>
          </div>
          <div class="ds-dialog__footer">
            <button class="ds-button ds-button--secondary" data-ds-dialog-close type="button">Cancel</button>
            <button class="ds-button ds-button--danger" type="button">Revoke key</button>
          </div>
        </section>
      </div>
    </div>`
  )
);
