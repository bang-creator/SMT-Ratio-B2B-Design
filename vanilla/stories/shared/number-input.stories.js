import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Number Input',
  parameters: { layout: 'padded' },
};

/* Source: .Kepsx + .EzGXF on platform.openai.com
 * Ground truth:
 * - Standard 32px height, 8px radius
 * - Native numeric constraints (min, max, step)
 * - Box-shadow inset outline with hover and focus-ring states */

export const Default = story(
  'Default / Shared / Number Input / Default',
  stage(
    'Standard Number Input',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Max completion tokens</span>
        <input type="number" class="ds-input" value="2048" min="1" max="128000" step="256">
      </label>
    </div>`
  )
);

export const Temperature = story(
  'Default / Shared / Number Input / Temperature',
  stage(
    'Decimal Step (0.0 to 2.0)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Sampling temperature</span>
        <input type="number" class="ds-input" value="1.0" min="0" max="2" step="0.1">
        <span class="ds-muted">Higher values make output more random, lower values more focused</span>
      </label>
    </div>`
  )
);

export const Stepper = story(
  'Default / Shared / Number Input / Stepper',
  stage(
    'Interactive Stepper Control (−/+ buttons)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Concurrent workers</span>
        <div class="ds-number-stepper" data-ds-number-stepper>
          <button type="button" class="ds-number-stepper__btn" data-step="down" aria-label="Decrease value">−</button>
          <input type="number" class="ds-input ds-number-stepper__input" value="4" min="1" max="32" step="1" aria-label="Concurrent workers">
          <button type="button" class="ds-number-stepper__btn" data-step="up" aria-label="Increase value">+</button>
        </div>
      </label>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Number Input / Small',
  stage(
    'Small Size (28px)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Batch size</span>
        <input type="number" class="ds-input ds-input--sm" value="16" min="1" max="100">
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Number Input / Disabled',
  stage(
    'Disabled Number Input',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Fixed concurrency quota</span>
        <input type="number" class="ds-input" value="50" disabled>
      </label>
    </div>`
  )
);
