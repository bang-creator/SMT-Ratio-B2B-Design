import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Segmented Control',
  parameters: { layout: 'padded' },
};

/* Source: Sliding segmented view switcher on platform.openai.com
 * Ground truth:
 * - 32px height, 8px radius container, 6px radius sliding thumb
 * - Active text primary, inactive secondary */

export const Default = story(
  'Default / Supplemental / Segmented Control / Default',
  stage(
    'Time Window Switcher',
    `<div class="ds-segmented" role="tablist" aria-label="Time window">
      <div class="ds-segmented__thumb" aria-hidden="true"></div>
      <button role="tab" aria-selected="true" aria-pressed="true" type="button">Day</button>
      <button role="tab" aria-selected="false" aria-pressed="false" type="button">Week</button>
      <button role="tab" aria-selected="false" aria-pressed="false" type="button">Month</button>
    </div>`
  )
);

export const Pill = story(
  'Default / Supplemental / Segmented Control / Pill',
  stage(
    'Pill Mode Switcher',
    `<div class="ds-segmented ds-segmented--pill" role="tablist" aria-label="Mode switch">
      <div class="ds-segmented__thumb" aria-hidden="true"></div>
      <button role="tab" aria-selected="true" aria-pressed="true" type="button">Chat</button>
      <button role="tab" aria-selected="false" aria-pressed="false" type="button">Completion</button>
    </div>`
  )
);
