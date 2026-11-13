import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Spinner',
  parameters: { layout: 'padded' },
};

/* Source: Loading spinners on platform.openai.com
 * Ground truth:
 * - 16px track with border-top-color accent, 800ms linear spin */

export const Default = story(
  'Default / Supplemental / Spinner / Default',
  stage(
    'Standalone Activity Indicator',
    `<div class="ds-row">
      <span class="ds-spinner" role="status" aria-label="Loading"></span>
    </div>`
  )
);

export const WithButton = story(
  'Default / Supplemental / Spinner / With Button',
  stage(
    'Button Loading State',
    `<div class="ds-row">
      <button class="ds-button ds-button--primary" disabled type="button">
        <span class="ds-spinner" aria-hidden="true"></span>
        <span>Generating key...</span>
      </button>
    </div>`
  )
);
