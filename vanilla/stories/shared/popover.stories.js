import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Popover',
  parameters: { layout: 'padded' },
};

/* Source: Context, Settings & Filter popovers on platform.openai.com
 * Ground truth from platform evidence & specification:
 * - 1 single consolidated variant: Default
 * - 2 bottom buttons arranged horizontally: Secondary button (left) and Primary button (right)
 * - 8 directional placements: Top, Top-Start, Top-End, Bottom, Bottom-Start, Bottom-End, Left, Right
 * - Interactive: click trigger to toggle, click outside or Cancel/Apply to close
 * - State architecture: Enabled interactive, 8 directional placements, and Disabled states */

const renderPopoverContent = (title, description = 'Configure active parameters and routing options for this resource.') => `
  <div class="ds-popover__content" role="dialog" hidden>
    <div class="ds-popover__header">
      <h4 class="ds-popover__title">${title}</h4>
      <p class="ds-popover__body">${description}</p>
    </div>
    <div class="ds-popover__footer">
      <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-ds-popover-close>Cancel</button>
      <button type="button" class="ds-button ds-button--primary ds-button--sm" data-ds-popover-close>Apply</button>
    </div>
  </div>`;

export const Default = story(
  'Default / Shared / Popover / Default',
  stage(
    'Standard Popover Panel (8 Placements & Disabled State)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Standard Popover -->
      <section class="ds-story-section">
<div class="ds-row">
          <div class="ds-popover" data-ds-popover>
            <button class="ds-button ds-button--secondary ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Filter parameters</span>
            </button>
            <div class="ds-popover__content" role="dialog" hidden>
              <div class="ds-popover__header">
                <h4 class="ds-popover__title">Active filters</h4>
                <p class="ds-popover__body">Select model types and endpoint configurations.</p>
              </div>
              <div class="ds-stack">
                <label class="ds-checkbox">
                  <input type="checkbox" checked>
                  <span class="ds-checkbox__control">
                    <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                  </span>
                  <span>Production models</span>
                </label>
                <label class="ds-checkbox">
                  <input type="checkbox">
                  <span class="ds-checkbox__control">
                    <svg class="ds-checkbox__check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6"/></svg>
                  </span>
                  <span>Snapshot endpoints</span>
                </label>
              </div>
              <div class="ds-popover__footer">
                <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-ds-popover-close>Cancel</button>
                <button type="button" class="ds-button ds-button--primary ds-button--sm" data-ds-popover-close>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Placements: 8 Directions (Top, Top-Start, Top-End, Bottom, Bottom-Start, Bottom-End, Left, Right) -->
      <section class="ds-story-section">
<div class="ds-popover-placements-grid">
          <!-- 1. Top -->
          <div class="ds-popover ds-popover--top" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Top</span>
            </button>
            ${renderPopoverContent('Top placement', 'Positioned directly above the trigger, horizontally centered.')}
          </div>

          <!-- 2. Top-Start -->
          <div class="ds-popover ds-popover--top-start" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Top-Start</span>
            </button>
            ${renderPopoverContent('Top-Start placement', 'Positioned above the trigger, aligned with its left edge.')}
          </div>

          <!-- 3. Top-End -->
          <div class="ds-popover ds-popover--top-end" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Top-End</span>
            </button>
            ${renderPopoverContent('Top-End placement', 'Positioned above the trigger, aligned with its right edge.')}
          </div>

          <!-- 4. Bottom -->
          <div class="ds-popover ds-popover--bottom" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Bottom</span>
            </button>
            ${renderPopoverContent('Bottom placement', 'Positioned directly below the trigger, horizontally centered.')}
          </div>

          <!-- 5. Bottom-Start -->
          <div class="ds-popover ds-popover--bottom-start" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Bottom-Start</span>
            </button>
            ${renderPopoverContent('Bottom-Start placement', 'Positioned below the trigger, aligned with its left edge.')}
          </div>

          <!-- 6. Bottom-End -->
          <div class="ds-popover ds-popover--bottom-end" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Bottom-End</span>
            </button>
            ${renderPopoverContent('Bottom-End placement', 'Positioned below the trigger, aligned with its right edge.')}
          </div>

          <!-- 7. Left -->
          <div class="ds-popover ds-popover--left" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Left</span>
            </button>
            ${renderPopoverContent('Left placement', 'Positioned to the left of the trigger, vertically centered.')}
          </div>

          <!-- 8. Right -->
          <div class="ds-popover ds-popover--right" data-ds-popover>
            <button class="ds-button ds-button--outline ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false">
              <span>Right</span>
            </button>
            ${renderPopoverContent('Right placement', 'Positioned to the right of the trigger, vertically centered.')}
          </div>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-row">
          <div class="ds-popover" data-ds-popover data-disabled="true">
            <button class="ds-button ds-button--secondary ds-popover__trigger" type="button" aria-haspopup="dialog" aria-expanded="false" disabled>
              <span>Disabled popover</span>
            </button>
          </div>
        </div>
      </section>
    </div>`
  )
);
