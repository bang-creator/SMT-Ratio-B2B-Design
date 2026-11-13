import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Alert',
  parameters: { layout: 'padded' },
};

/* Source: Platform notification banners and inline alerts
 * Ground truth:
 * - 14px font, 10px / 12px radius, icon with title and message
 * - Semantic border-color and background */

export const Default = story(
  'Default / Supplemental / Alert / Default',
  stage(
    'Caution Alert Banner',
    `<div class="ds-alert ds-alert--caution" role="alert">
      <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      <div class="ds-alert__content">
        <div class="ds-alert__title">Usage limit notice</div>
        <div>You have reached 80% of your allocated monthly organization spend limit.</div>
      </div>
    </div>`
  )
);

export const Info = story(
  'Default / Supplemental / Alert / Info',
  stage(
    'Informational Alert Banner',
    `<div class="ds-alert ds-alert--info" role="status">
      <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      <div class="ds-alert__content">
        <div class="ds-alert__title">Model update available</div>
        <div>GPT-4o fine-tuning is now supported in all organization workspaces.</div>
      </div>
    </div>`
  )
);

export const Danger = story(
  'Default / Supplemental / Alert / Danger',
  stage(
    'Critical Error Alert Banner',
    `<div class="ds-alert ds-alert--danger" role="alert">
      <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      <div class="ds-alert__content">
        <div class="ds-alert__title">Payment method failed</div>
        <div>Please update your billing credentials to prevent immediate service suspension.</div>
      </div>
    </div>`
  )
);

export const Success = story(
  'Default / Supplemental / Alert / Success',
  stage(
    'Success Confirmation Banner',
    `<div class="ds-alert ds-alert--success" role="status">
      <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <div class="ds-alert__content">
        <div class="ds-alert__title">Dataset validation complete</div>
        <div>Training file verified with 1,240 fine-tuning prompt-completion pairs.</div>
      </div>
    </div>`
  )
);
