import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Slider',
  parameters: { layout: 'padded' },
};

/* Source: Playground image & model settings sliders on platform.openai.com/playground/images
 * Ground truth from platform screenshot:
 * - Layout: Single inline horizontal row (Title on left, range slider in middle, readout on right)
 * - Track: 4px rounded height with dual-tone progress gradient (active progress vs subtle unfilled track)
 * - Thumb Indicator: 14px hollow ring circle with 2px border and canvas center fill
 * - Motion: Smooth hover highlight to text-primary, active micro-scale (1.08)
 * - Variants:
 *   - Default: Standard range slider without readout number
 *   - WithReadout: Range slider with inline title, slider track, and tabular readout */

export const Default = story(
  'Default / Shared / Slider / Default',
  stage(
    'Standard Range Slider (No Readout)',
    `<div class="ds-stack">
      <label class="ds-slider" data-ds-slider>
        <span class="ds-slider__label">Number of images</span>
        <div class="ds-slider__track">
          <input type="range" min="1" max="4" step="1" value="3" aria-label="Number of images">
        </div>
      </label>

      <label class="ds-slider" data-ds-slider>
        <span class="ds-slider__label">Temperature</span>
        <div class="ds-slider__track">
          <input type="range" min="0" max="2" step="0.05" value="0.7" aria-label="Temperature">
        </div>
      </label>
    </div>`
  )
);

export const WithReadout = story(
  'Default / Shared / Slider / With Readout',
  stage(
    'Range Slider with Readout (Inline Row)',
    `<div class="ds-stack">
      <label class="ds-slider" data-ds-slider>
        <span class="ds-slider__label">Number of images</span>
        <div class="ds-slider__track">
          <input type="range" min="1" max="4" step="1" value="3" aria-label="Number of images">
        </div>
        <span class="ds-slider__readout" data-ds-readout>3</span>
      </label>

      <label class="ds-slider" data-ds-slider>
        <span class="ds-slider__label">Temperature</span>
        <div class="ds-slider__track">
          <input type="range" min="0" max="2" step="0.05" value="0.7" data-decimals="2" aria-label="Temperature">
        </div>
        <span class="ds-slider__readout" data-ds-readout>0.70</span>
      </label>

      <label class="ds-slider" data-ds-slider>
        <span class="ds-slider__label">Top P</span>
        <div class="ds-slider__track">
          <input type="range" min="0" max="1" step="0.01" value="1.0" data-decimals="2" aria-label="Top P">
        </div>
        <span class="ds-slider__readout" data-ds-readout>1.00</span>
      </label>
    </div>`
  )
);
