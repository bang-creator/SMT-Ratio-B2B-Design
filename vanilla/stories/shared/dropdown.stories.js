import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Dropdown',
  parameters: { layout: 'padded' },
};

/* Source: Actions & Filter dropdowns on platform.openai.com
 * Ground truth:
 * - Trigger button: 32px height, 8px radius
 * - Menu: 12px radius, shadow-menu / shadow-lg, 32px items
 * - Keyboard navigation: ArrowDown, ArrowUp, Escape */

export const Default = story(
  'Default / Shared / Dropdown / Default',
  stage(
    'Standard Action Dropdown',
    `<div class="ds-row">
      <div class="ds-menu" data-ds-menu>
        <button class="ds-button ds-button--outline ds-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false">
          <span>Actions</span>
          <span class="ds-select__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <div class="ds-menu__content" role="menu" hidden>
          <button class="ds-menu__item" role="menuitem">
            <span>Duplicate configuration</span>
          </button>
          <button class="ds-menu__item" role="menuitem">
            <span>Rename project</span>
          </button>
          <button class="ds-menu__item" role="menuitem">
            <span>Export schema (JSON)</span>
          </button>
          <button class="ds-menu__item ds-menu__item--danger" role="menuitem">
            <span>Revoke access</span>
          </button>
        </div>
      </div>
    </div>`
  )
);

export const Secondary = story(
  'Default / Shared / Dropdown / Secondary',
  stage(
    'Secondary Variant',
    `<div class="ds-row">
      <div class="ds-menu" data-ds-menu>
        <button class="ds-button ds-button--secondary ds-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false">
          <span>Filter by date</span>
          <span class="ds-select__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
        <div class="ds-menu__content" role="menu" hidden>
          <button class="ds-menu__item" role="menuitem">
            <span>Last 24 hours</span>
          </button>
          <button class="ds-menu__item" role="menuitem">
            <span>Last 7 days</span>
          </button>
          <button class="ds-menu__item" role="menuitem">
            <span>Last 30 days</span>
          </button>
          <button class="ds-menu__item" role="menuitem">
            <span>All time</span>
          </button>
        </div>
      </div>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Dropdown / Disabled',
  stage(
    'Disabled Dropdown',
    `<div class="ds-row">
      <div class="ds-menu" data-ds-menu>
        <button class="ds-button ds-button--outline ds-menu__trigger" type="button" aria-haspopup="menu" aria-expanded="false" disabled>
          <span>Actions</span>
          <span class="ds-select__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </button>
      </div>
    </div>`
  )
);
