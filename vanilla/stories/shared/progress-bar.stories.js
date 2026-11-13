import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Progress Bar',
  parameters: { layout: 'padded' },
};

/* Source: Batch jobs and fine-tuning progress on platform.openai.com
 * Ground truth:
 * - Track height: 6px, radius full
 * - Fill: full radius, text-primary background
 * - Transition: width 200ms cubic-bezier */

export const Default = story(
  'Default / Shared / Progress Bar / Default',
  stage(
    'Standard Progress Bar (65%)',
    `<div class="ds-stack">
      <div class="ds-row">
        <span class="ds-label">Uploading training shards</span>
        <span class="ds-muted">65%</span>
      </div>
      <div class="ds-progress-bar" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
        <div class="ds-progress-bar__fill"></div>
      </div>
    </div>`
  )
);

export const Indeterminate = story(
  'Default / Shared / Progress Bar / Indeterminate',
  stage(
    'Indeterminate Activity Progress',
    `<div class="ds-stack">
      <div class="ds-row">
        <span class="ds-label">Validating JSONL token counts</span>
        <span class="ds-muted">Calculating...</span>
      </div>
      <div class="ds-progress-bar ds-progress-bar--indeterminate" role="progressbar" aria-label="Validating tokens">
        <div class="ds-progress-bar__fill"></div>
      </div>
    </div>`
  )
);

export const Complete = story(
  'Default / Shared / Progress Bar / Complete',
  stage(
    'Completed Progress (100%)',
    `<div class="ds-stack">
      <div class="ds-row">
        <span class="ds-label">Epoch 3 / 3</span>
        <span class="ds-muted">100%</span>
      </div>
      <div class="ds-progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
        <div class="ds-progress-bar__fill"></div>
      </div>
    </div>`
  )
);
