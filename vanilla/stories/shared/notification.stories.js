import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Notification',
  parameters: { layout: 'padded' },
};

/* Source: Platform notifications on platform.openai.com
 * Ground truth from platform evidence:
 * - Variant 1 (Callout): Inline guidance and status alerts (12px radius, 12px 16px padding, 400 normal typography)
 *   Styles: Default (info guidance from screenshot), Warning, Danger, Success
 * - Variant 2 (Toast): Floating and inline feedback notifications with dismiss action */

const INFO_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><line x1="8" y1="7" x2="8" y2="11.5"/><circle cx="8" cy="4.5" r="0.75" fill="currentColor"/></svg>`;
const WARNING_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2.5 1.5 13.5h13L8 2.5z"/><line x1="8" y1="6.5" x2="8" y2="9.5"/><circle cx="8" cy="11.5" r="0.75" fill="currentColor"/></svg>`;
const DANGER_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><line x1="5.5" y1="5.5" x2="10.5" y2="10.5"/><line x1="10.5" y1="5.5" x2="5.5" y2="10.5"/></svg>`;
const SUCCESS_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="m5.5 8 2 2 3.5-3.5"/></svg>`;
const CLOSE_ICON = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>`;

/* ── Variant 1: Callout (Inline Layout Banners — Default, Warning, Danger, Success) ── */

export const Callout = story(
  'Default / Shared / Notification / Callout',
  stage(
    'Inline Callout Banners (platform.openai.com Ground Truth)',
    `<div class="ds-story-sections">
      <!-- 1. Default Callout (from platform evidence image) -->
      <section class="ds-story-section">
<div class="ds-callout ds-callout--default" role="status">
          <span class="ds-callout__icon">${INFO_ICON}</span>
          <div class="ds-callout__content">
            Start simple. Do not over-prompt upfront. Begin with a minimal prompt, run evaluations, then add instructions only for behaviors that fail in testing.
          </div>
        </div>
      </section>

      <!-- 2. Warning Callout -->
      <section class="ds-story-section">
<div class="ds-callout ds-callout--warning" role="alert">
          <span class="ds-callout__icon">${WARNING_ICON}</span>
          <div class="ds-callout__content">
            Approaching monthly budget threshold. Organization has consumed 85% of allocated credit for November 2026.
          </div>
        </div>
      </section>

      <!-- 3. Danger Callout -->
      <section class="ds-story-section">
<div class="ds-callout ds-callout--danger" role="alert">
          <span class="ds-callout__icon">${DANGER_ICON}</span>
          <div class="ds-callout__content">
            Payment method required. Automatic recurring invoice failed. Requests are restricted until payment details are updated.
          </div>
        </div>
      </section>

      <!-- 4. Success Callout -->
      <section class="ds-story-section">
<div class="ds-callout ds-callout--success" role="status">
          <span class="ds-callout__icon">${SUCCESS_ICON}</span>
          <div class="ds-callout__content">
            Model fine-tuning completed. Custom snapshot <code>ft:gpt-4o-mini-2024-07-18:custom:v2</code> is ready for deployment.
          </div>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 2: Toast (Floating & Inline Notifications — 5 States) ── */

export const Toast = story(
  'Default / Shared / Notification / Toast',
  stage(
    'Toast Notifications — 5 States (Default, Success, Warning, Error, Information)',
    `<div class="ds-story-sections">
      <!-- 1. Inline State Previews -->
      <section class="ds-story-section">
<div class="ds-stack">
          <!-- 1. Default (Monochrome) -->
          <div class="ds-toast ds-toast--inline ds-toast--default" role="status">
            <span class="ds-toast__icon">${INFO_ICON}</span>
            <div class="ds-toast__content">Default notification: system maintenance scheduled for midnight UTC.</div>
            <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
          </div>

          <!-- 2. Success (Support Green) -->
          <div class="ds-toast ds-toast--inline ds-toast--success" role="status">
            <span class="ds-toast__icon">${SUCCESS_ICON}</span>
            <div class="ds-toast__content">Changes saved successfully. Model snapshot ft:gpt-4o ready.</div>
            <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
          </div>

          <!-- 3. Warning (Support Yellow) -->
          <div class="ds-toast ds-toast--inline ds-toast--warning" role="alert">
            <span class="ds-toast__icon">${WARNING_ICON}</span>
            <div class="ds-toast__content">API rate limit threshold: 85% of monthly credit consumed.</div>
            <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
          </div>

          <!-- 4. Error (Support Red) -->
          <div class="ds-toast ds-toast--inline ds-toast--error" role="alert">
            <span class="ds-toast__icon">${DANGER_ICON}</span>
            <div class="ds-toast__content">Failed to generate secret key. Please verify your permissions.</div>
            <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
          </div>

          <!-- 5. Information (Support Blue) -->
          <div class="ds-toast ds-toast--inline ds-toast--info" role="status">
            <span class="ds-toast__icon">${INFO_ICON}</span>
            <div class="ds-toast__content">API secret key sk-prod-2048 copied to clipboard.</div>
            <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
          </div>
        </div>
      </section>

      <!-- 2. Interactive Floating Triggers -->
      <section class="ds-story-section">
<div class="ds-row">
          <button type="button" class="ds-button ds-button--secondary" data-ds-toast-trigger="#toast-default">
            <span>Show Default</span>
          </button>
          <button type="button" class="ds-button ds-button--secondary" data-ds-toast-trigger="#toast-success">
            <span>Show Success</span>
          </button>
          <button type="button" class="ds-button ds-button--secondary" data-ds-toast-trigger="#toast-warning">
            <span>Show Warning</span>
          </button>
          <button type="button" class="ds-button ds-button--secondary" data-ds-toast-trigger="#toast-error">
            <span>Show Error</span>
          </button>
          <button type="button" class="ds-button ds-button--secondary" data-ds-toast-trigger="#toast-info">
            <span>Show Info</span>
          </button>
        </div>

        <!-- Floating Toast Elements (Fixed bottom-right) -->
        <div class="ds-toast ds-toast--floating ds-toast--default" id="toast-default" role="status" hidden>
          <span class="ds-toast__icon">${INFO_ICON}</span>
          <div class="ds-toast__content">Default notification: system maintenance scheduled.</div>
          <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
        </div>

        <div class="ds-toast ds-toast--floating ds-toast--success" id="toast-success" role="status" hidden>
          <span class="ds-toast__icon">${SUCCESS_ICON}</span>
          <div class="ds-toast__content">Changes saved successfully.</div>
          <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
        </div>

        <div class="ds-toast ds-toast--floating ds-toast--warning" id="toast-warning" role="alert" hidden>
          <span class="ds-toast__icon">${WARNING_ICON}</span>
          <div class="ds-toast__content">API rate limit threshold: 85% consumed.</div>
          <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
        </div>

        <div class="ds-toast ds-toast--floating ds-toast--error" id="toast-error" role="alert" hidden>
          <span class="ds-toast__icon">${DANGER_ICON}</span>
          <div class="ds-toast__content">Failed to generate secret key.</div>
          <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
        </div>

        <div class="ds-toast ds-toast--floating ds-toast--info" id="toast-info" role="status" hidden>
          <span class="ds-toast__icon">${INFO_ICON}</span>
          <div class="ds-toast__content">Key sk-prod-2048 copied to clipboard.</div>
          <button type="button" class="ds-toast__close" aria-label="Dismiss toast">${CLOSE_ICON}</button>
        </div>
      </section>

      <!-- 3. Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div>
          <button type="button" class="ds-button ds-button--secondary" disabled>
            <span>Show Floating Toast</span>
          </button>
        </div>
      </section>
    </div>`
  )
);
