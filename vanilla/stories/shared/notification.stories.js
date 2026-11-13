import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Notification',
  parameters: { layout: 'padded' },
};

/* Source: Platform alert banners on platform.openai.com
 * Ground truth:
 * - 10px radius, 12px 16px padding
 * - SVG status icon (16px)
 * - Variants: Info, Caution, Danger, Success */

export const Default = story(
  'Default / Shared / Notification / Default',
  stage(
    'Info Notification Banner',
    `<div class="ds-stack">
      <div class="ds-alert ds-alert--info" role="status">
        <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <div class="ds-alert__content">
          <div class="ds-alert__title">Scheduled maintenance notice</div>
          <p class="ds-muted">Batch processing queues will undergo standard database upgrades on Sunday at 08:00 UTC.</p>
        </div>
      </div>
    </div>`
  )
);

export const Caution = story(
  'Default / Shared / Notification / Caution',
  stage(
    'Warning / Caution Notification',
    `<div class="ds-stack">
      <div class="ds-alert ds-alert--caution" role="alert">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        <div class="ds-alert__content">
          <div class="ds-alert__title">Approaching monthly budget threshold</div>
          <p class="ds-muted">Organization has consumed 85% of allocated credit for November 2026.</p>
        </div>
      </div>
    </div>`
  )
);

export const Danger = story(
  'Default / Shared / Notification / Danger',
  stage(
    'Danger / Critical Alert',
    `<div class="ds-stack">
      <div class="ds-alert ds-alert--danger" role="alert">
        <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        <div class="ds-alert__content">
          <div class="ds-alert__title">Payment method required</div>
          <p class="ds-muted">Automatic recurring invoice failed. Requests are restricted until updated.</p>
        </div>
      </div>
    </div>`
  )
);

export const Success = story(
  'Default / Shared / Notification / Success',
  stage(
    'Success Confirmation',
    `<div class="ds-stack">
      <div class="ds-alert ds-alert--success" role="status">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div class="ds-alert__content">
          <div class="ds-alert__title">Model fine-tuning completed</div>
          <p class="ds-muted">Custom snapshot <code>ft:gpt-4o-mini-2024-07-18:custom:v2</code> is ready for inference.</p>
        </div>
      </div>
    </div>`
  )
);
