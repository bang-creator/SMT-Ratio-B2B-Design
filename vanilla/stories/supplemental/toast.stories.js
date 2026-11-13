import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Toast',
  parameters: { layout: 'padded' },
};

/* Source: Floating toast notices on platform.openai.com
 * Ground truth:
 * - Fixed bottom-right notification
 * - Elevated background, 12px radius, shadow-lg */

export const Default = story(
  'Default / Supplemental / Toast / Default',
  stage(
    'Floating Success Toast',
    `<div class="ds-row">
      <div class="ds-toast">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>API key copied to clipboard</span>
        <button class="ds-icon-button" type="button" aria-label="Dismiss toast">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>`
  )
);
