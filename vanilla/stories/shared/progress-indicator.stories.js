import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Progress Indicator',
  parameters: { layout: 'padded' },
};

/* Source: Multi-step wizard headers on platform.openai.com
 * Ground truth:
 * - Circle step markers (24px)
 * - Interconnecting line (1px subtle border)
 * - States: completed, current, upcoming */

export const Default = story(
  'Default / Shared / Progress Indicator / Default',
  stage(
    'Step-by-Step Flow (Step 2 Active)',
    `<ol class="ds-progress-indicator" aria-label="Fine-tuning wizard progress">
      <li class="ds-progress-step" data-state="completed">
        <span class="ds-progress-step__marker" aria-hidden="true">✓</span>
        <span>Select model</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="current" aria-current="step">
        <span class="ds-progress-step__marker">2</span>
        <span>Upload dataset</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="upcoming">
        <span class="ds-progress-step__marker">3</span>
        <span>Hyperparameters</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="upcoming">
        <span class="ds-progress-step__marker">4</span>
        <span>Review</span>
      </li>
    </ol>`
  )
);

export const Complete = story(
  'Default / Shared / Progress Indicator / Complete',
  stage(
    'All Steps Completed',
    `<ol class="ds-progress-indicator" aria-label="Completed wizard progress">
      <li class="ds-progress-step" data-state="completed">
        <span class="ds-progress-step__marker" aria-hidden="true">✓</span>
        <span>Select model</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="completed">
        <span class="ds-progress-step__marker" aria-hidden="true">✓</span>
        <span>Upload dataset</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="completed">
        <span class="ds-progress-step__marker" aria-hidden="true">✓</span>
        <span>Hyperparameters</span>
        <span class="ds-progress-step__line" aria-hidden="true"></span>
      </li>
      <li class="ds-progress-step" data-state="completed">
        <span class="ds-progress-step__marker" aria-hidden="true">✓</span>
        <span>Review</span>
      </li>
    </ol>`
  )
);
