import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Number Input',
  parameters: { layout: 'padded' },
};

/* Source: Platform numeric controls on platform.openai.com
 * Ground truth from platform evidence:
 * - Compact Stepper: 32px standard height, 8px container radius (var(--radius-md))
 * - Mathematical centering: Optically and geometrically centered SVG minus/plus icons
 * - Focus behavior: Clean border without intrusive focus ring when clicked
 * - State architecture: Enabled and Disabled states staged directly within the Stepper story */

const MINUS_ICON = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8h9"/></svg>`;
const PLUS_ICON = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg>`;

/* ── Stepper (Consolidated Number Input Variant) ── */

export const Stepper = story(
  'Default / Shared / Number Input / Stepper',
  stage(
    'Interactive Stepper Control (−/+)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Stepper Control -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label>
            <span class="ds-label">Concurrent workers</span>
            <div class="ds-number-stepper" data-ds-number-stepper>
              <button type="button" class="ds-number-stepper__btn" data-step="down" aria-label="Decrease value">
                ${MINUS_ICON}
              </button>
              <input type="number" class="ds-input ds-number-stepper__input" value="4" min="1" max="32" step="1" aria-label="Concurrent workers">
              <button type="button" class="ds-number-stepper__btn" data-step="up" aria-label="Increase value">
                ${PLUS_ICON}
              </button>
            </div>
          </label>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label>
            <span class="ds-label">Concurrent workers</span>
            <div class="ds-number-stepper" data-ds-number-stepper data-disabled="true">
              <button type="button" class="ds-number-stepper__btn" data-step="down" aria-label="Decrease value" disabled>
                ${MINUS_ICON}
              </button>
              <input type="number" class="ds-input ds-number-stepper__input" value="4" min="1" max="32" step="1" aria-label="Concurrent workers" disabled>
              <button type="button" class="ds-number-stepper__btn" data-step="up" aria-label="Increase value" disabled>
                ${PLUS_ICON}
              </button>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);

/* ── With Unit (Input có đơn vị) ── */

export const WithUnit = story(
  'Default / Shared / Number Input / With Unit',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label>
            <span class="ds-label">Confidence threshold</span>
            <div class="ds-input-group">
              <input type="text" class="ds-input" value="80" placeholder="0" inputmode="numeric" aria-label="Confidence threshold">
              <span class="ds-input-group__unit">%</span>
            </div>
          </label>
          <label>
            <span class="ds-label">Request timeout</span>
            <div class="ds-input-group">
              <input type="text" class="ds-input" value="30,000" placeholder="0" inputmode="numeric" aria-label="Request timeout">
              <span class="ds-input-group__unit">ms</span>
            </div>
          </label>
          <label>
            <span class="ds-label">Disabled</span>
            <div class="ds-input-group" data-disabled="true">
              <input type="text" class="ds-input" value="100" disabled aria-label="Fixed quota allocation">
              <span class="ds-input-group__unit">%</span>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);

