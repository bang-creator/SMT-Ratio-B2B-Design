import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Slider',
  parameters: { layout: 'padded' },
};

/* Source: Playground model parameter sliders on platform.openai.com/playground
 * Ground truth:
 * - 4px track, 16px thumb, white with shadow
 * - Range: 0 to 1 or 0 to 2, step: 0.01 / 0.1 */

export const Default = story(
  'Default / Shared / Slider / Default',
  stage(
    'Standard Range Slider',
    `<div class="ds-stack">
      <label class="ds-slider" data-ds-slider>
        <div class="ds-row">
          <span class="ds-label">Temperature</span>
          <span class="ds-muted" data-ds-readout>0.7</span>
        </div>
        <div class="ds-slider__track">
          <input type="range" min="0" max="2" step="0.05" value="0.7">
        </div>
      </label>
    </div>`
  )
);

export const WithReadout = story(
  'Default / Shared / Slider / With Readout',
  stage(
    'Top P Nucleus Sampling Slider',
    `<div class="ds-stack">
      <label class="ds-slider" data-ds-slider>
        <div class="ds-row">
          <span class="ds-label">Top P</span>
          <span class="ds-muted" data-ds-readout>1.0</span>
        </div>
        <div class="ds-slider__track">
          <input type="range" min="0" max="1" step="0.01" value="1.0">
        </div>
        <div class="ds-row">
          <span class="ds-muted">0.0 (Strict)</span>
          <span class="ds-muted">1.0 (Standard)</span>
        </div>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Slider / Disabled',
  stage(
    'Disabled Slider',
    `<div class="ds-stack">
      <label class="ds-slider">
        <div class="ds-row">
          <span class="ds-label">Presence penalty</span>
          <span class="ds-muted">0.0</span>
        </div>
        <div class="ds-slider__track">
          <input type="range" min="-2" max="2" step="0.1" value="0.0" disabled>
        </div>
      </label>
    </div>`
  )
);
