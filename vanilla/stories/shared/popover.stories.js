import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Popover',
  parameters: { layout: 'padded' },
};

/* Source: Settings & Filter popovers on platform.openai.com
 * Ground truth:
 * - Trigger button: 32px height
 * - Content panel: 240px min-width, 12px radius, elevated surface, shadow-lg
 * - Keyboard navigation: Escape closes popover */

export const Default = story(
  'Default / Shared / Popover / Default',
  stage(
    'Standard Popover Panel',
    `<div class="ds-row">
      <div class="ds-popover" data-ds-menu>
        <button class="ds-button ds-button--outline" type="button" aria-haspopup="dialog" aria-expanded="false">
          <span>Filter parameters</span>
        </button>
        <div class="ds-popover__content" hidden>
          <span class="ds-label">Active filters</span>
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
          <div class="ds-row">
            <button class="ds-button ds-button--secondary ds-button--sm" type="button">Reset</button>
            <button class="ds-button ds-button--primary ds-button--sm" type="button">Apply</button>
          </div>
        </div>
      </div>
    </div>`
  )
);

export const PlacementRight = story(
  'Default / Shared / Popover / Placement Right',
  stage(
    'Right-Aligned Popover',
    `<div class="ds-row">
      <div class="ds-popover" data-ds-menu>
        <button class="ds-button ds-button--secondary" type="button" aria-haspopup="dialog" aria-expanded="false">
          <span>More info</span>
        </button>
        <div class="ds-popover__content ds-popover__content--right" hidden>
          <strong class="ds-label">Usage quota details</strong>
          <p class="ds-muted">Monthly spend is calculated from cached, completion, and reasoning tokens across all projects.</p>
        </div>
      </div>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Popover / Disabled',
  stage(
    'Disabled Popover Trigger',
    `<div class="ds-row">
      <div class="ds-popover" data-ds-menu>
        <button class="ds-button ds-button--outline" type="button" aria-haspopup="dialog" aria-expanded="false" disabled>
          <span>Filter parameters</span>
        </button>
      </div>
    </div>`
  )
);
