import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Drawer',
  parameters: { layout: 'padded' },
};

/* Source: Slide-over details drawer on platform.openai.com
 * Ground truth:
 * - 420px width, elevated surface, shadow-lg
 * - Slide-in animation from right */

export const Default = story(
  'Default / Supplemental / Drawer / Default',
  stage(
    'Inspect Request Drawer',
    `<div class="ds-row">
      <button class="ds-button ds-button--secondary" data-ds-dialog-open="#demo-drawer" type="button">
        <span>Inspect request details</span>
      </button>
      <div class="ds-drawer__backdrop" id="demo-drawer" role="dialog" aria-modal="true" hidden>
        <aside class="ds-drawer ds-drawer--right">
          <div class="ds-dialog__header">
            <h3>Request Log Details</h3>
            <button class="ds-icon-button" data-ds-dialog-close aria-label="Close drawer" type="button">
              <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="ds-dialog__body ds-stack">
            <div class="ds-row">
              <span class="ds-badge ds-badge--active">200 OK</span>
              <span class="ds-muted">req_9xK2048</span>
            </div>
            <div class="ds-structured-list">
              <div class="ds-structured-list__row">
                <span class="ds-structured-list__key">Model</span>
                <span class="ds-structured-list__val">gpt-4o</span>
              </div>
              <div class="ds-structured-list__row">
                <span class="ds-structured-list__key">Latency</span>
                <span class="ds-structured-list__val">340 ms</span>
              </div>
              <div class="ds-structured-list__row">
                <span class="ds-structured-list__key">Total tokens</span>
                <span class="ds-structured-list__val">1,248</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>`
  )
);
