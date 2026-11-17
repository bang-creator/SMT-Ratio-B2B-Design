import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Modal',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'Default / Shared / Modal / Default',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <div class="ds-row">
            <button class="ds-button ds-button--primary" data-ds-dialog-open="#modal-domain" type="button">
              <span>Add allowed domains</span>
            </button>
            <button class="ds-button ds-button--primary" type="button" disabled>
              <span>Add allowed domains</span>
            </button>
          </div>

          <div class="ds-dialog">
            <div class="ds-dialog__header">
              <h3 class="ds-dialog__title">Add allowed domains</h3>
              <p class="ds-dialog__description">Generate a public key for use on the specified domains.</p>
            </div>
            <div class="ds-dialog__body">
              <textarea class="ds-textarea" placeholder="example.com, example-staging.com" rows="3"></textarea>
              <div class="ds-dialog__counter">0/20</div>
            </div>
            <div class="ds-dialog__footer">
              <button class="ds-button ds-button--secondary" type="button">Cancel</button>
              <button class="ds-button ds-button--primary" type="button">Generate key</button>
            </div>
          </div>

          <div class="ds-dialog__backdrop" id="modal-domain" role="dialog" aria-modal="true" hidden>
            <div class="ds-dialog">
              <div class="ds-dialog__header">
                <h3 class="ds-dialog__title">Add allowed domains</h3>
                <p class="ds-dialog__description">Generate a public key for use on the specified domains.</p>
              </div>
              <div class="ds-dialog__body">
                <textarea class="ds-textarea" placeholder="example.com, example-staging.com" rows="3"></textarea>
                <div class="ds-dialog__counter">0/20</div>
              </div>
              <div class="ds-dialog__footer">
                <button class="ds-button ds-button--secondary" data-ds-dialog-close type="button">Cancel</button>
                <button class="ds-button ds-button--primary" type="button">Generate key</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>`
  )
);

export const Destructive = story(
  'Default / Shared / Modal / Destructive',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <div class="ds-row">
            <button class="ds-button ds-button--danger" data-ds-dialog-open="#modal-revoke" type="button">
              <span>Revoke API key</span>
            </button>
            <button class="ds-button ds-button--danger" type="button" disabled>
              <span>Revoke API key</span>
            </button>
          </div>

          <div class="ds-dialog">
            <div class="ds-dialog__header">
              <h3 class="ds-dialog__title">Revoke secret key</h3>
              <p class="ds-dialog__description">Are you sure you want to revoke key <strong>sk-prod-2048</strong>? Any application relying on this token will immediately fail with a 401 Unauthorized error.</p>
            </div>
            <div class="ds-dialog__footer">
              <button class="ds-button ds-button--secondary" type="button">Cancel</button>
              <button class="ds-button ds-button--danger" type="button">Revoke key</button>
            </div>
          </div>

          <div class="ds-dialog__backdrop" id="modal-revoke" role="dialog" aria-modal="true" hidden>
            <div class="ds-dialog">
              <div class="ds-dialog__header">
                <h3 class="ds-dialog__title">Revoke secret key</h3>
                <p class="ds-dialog__description">Are you sure you want to revoke key <strong>sk-prod-2048</strong>? Any application relying on this token will immediately fail with a 401 Unauthorized error.</p>
              </div>
              <div class="ds-dialog__footer">
                <button class="ds-button ds-button--secondary" data-ds-dialog-close type="button">Cancel</button>
                <button class="ds-button ds-button--danger" type="button">Revoke key</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>`
  )
);
