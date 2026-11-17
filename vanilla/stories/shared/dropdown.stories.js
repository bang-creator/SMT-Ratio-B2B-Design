import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Dropdown',
  parameters: { layout: 'padded' },
};

/* Source: Filter & Model Dropdowns on platform.openai.com
 * Ground truth from platform screenshots:
 * - Trigger: composes .ds-select__trigger with 32px compact height, 8px radius, subtle border
 * - Text color: var(--color-semantic-text-secondary) (soft/lighter text both in trigger and menu items)
 * - Icon: composes .ds-select__chevron with double chevron (up-down chevrons) on far right
 * - Menu: composes .ds-select__menu with 12px radius, shadow-menu, elevated surface
 * - Search: composes .ds-search-input.ds-search-input--block with transparent background
 * - Scrollbar: composes .ds-scrollbar with 4px offset from right boundary
 * - Options: composes .ds-select__option with leading checkmark indicator for checked items, aligned indent for unchecked items */

const CHEVRON_UP_DOWN = `<span class="ds-select__chevron" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg></span>`;
const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;
const SEARCH_INPUT = `
  <div class="ds-search-input ds-search-input--block" data-ds-search-input>
    <span class="ds-search-input__icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.875 4.5C7.35418 4.5 4.5 7.35418 4.5 10.875C4.5 14.3958 7.35418 17.25 10.875 17.25C14.3958 17.25 17.25 14.3958 17.25 10.875C17.25 7.35418 14.3958 4.5 10.875 4.5ZM2.5 10.875C2.5 6.24962 6.24962 2.5 10.875 2.5C15.5004 2.5 19.25 6.24962 19.25 10.875C19.25 12.8273 18.582 14.6236 17.462 16.0478L21.2071 19.7929C21.5976 20.1834 21.5976 20.8166 21.2071 21.2071C20.8166 21.5976 20.1834 21.5976 19.7929 21.2071L16.0478 17.462C14.6236 18.582 12.8273 19.25 10.875 19.25C6.24962 19.25 2.5 15.5004 2.5 10.875Z"></path></svg>
    </span>
    <input type="text" class="ds-search-input__field" placeholder="Search..." aria-label="Search models">
  </div>`;

/* ── Variant 1: Default (Expand Without Search) ── */

export const Default = story(
  'Default / Shared / Dropdown / Default',
  stage(
    'Standard Dropdown (Expand Without Search)',
    `<div class="ds-story-sections">
      <!-- Enabled: Single Selection -->
      <section class="ds-story-section">
<div class="ds-dropdown" data-ds-dropdown>
          <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-dropdown__value" data-ds-dropdown-value>Standard</span>
            ${CHEVRON_UP_DOWN}
          </button>
          <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
            <div class="ds-dropdown__list ds-scrollbar">
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                <span class="ds-dropdown__check">${CHECK_ICON}</span>
                <span>Standard</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>Compact</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>Expanded</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>Custom</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Enabled: Checkable Option List (Multi-Select) -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label>
            <span class="ds-label">Models</span>
            <div class="ds-dropdown" data-ds-dropdown data-multi="true" data-placeholder="Select models...">
              <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
                <span class="ds-dropdown__value" data-ds-dropdown-value>2 selected</span>
                ${CHEVRON_UP_DOWN}
              </button>
              <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
                <div class="ds-dropdown__list ds-scrollbar">
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4.1-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="true" data-checked="true">
                    <span class="ds-dropdown__check">${CHECK_ICON}</span>
                    <span>gpt-4.1-mini-2025-04-14</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-2024-08-06</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="true" data-checked="true">
                    <span class="ds-dropdown__check">${CHECK_ICON}</span>
                    <span>gpt-4o-2024-11-20</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-mini-2024-07-18</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o1</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o1-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o3-mini</span>
                  </button>
                </div>
              </div>
            </div>
          </label>
        </div>
      </section>

      <!-- Disabled State -->
      <section class="ds-story-section">
<div class="ds-row">
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-expanded="false" disabled>
              <span class="ds-dropdown__value">Standard</span>
              ${CHEVRON_UP_DOWN}
            </button>
          </div>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-expanded="false" disabled>
              <span class="ds-dropdown__value">2 selected</span>
              ${CHEVRON_UP_DOWN}
            </button>
          </div>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 2: With Search (Expand With Search) ── */

export const WithSearch = story(
  'Default / Shared / Dropdown / With Search',
  stage(
    'Searchable Dropdown (platform.openai.com Ground Truth)',
    `<div class="ds-story-sections">
      <!-- Enabled: Single Selection with Search -->
      <section class="ds-story-section">
<div class="ds-dropdown" data-ds-dropdown>
          <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-dropdown__value" data-ds-dropdown-value>Select model</span>
            ${CHEVRON_UP_DOWN}
          </button>
          <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
            ${SEARCH_INPUT}
            <div class="ds-dropdown__list ds-scrollbar">
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4.1-mini</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4.1-mini-2025-04-14</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4o</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4o-2024-08-06</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4o-2024-11-20</span>
              </button>
              <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                <span>gpt-4o-mini</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Enabled: Checkable Option List with Search (Image 2 Replica) -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label>
            <span class="ds-label">Models</span>
            <div class="ds-dropdown" data-ds-dropdown data-multi="true" data-ds-open="true" data-placeholder="Select models...">
              <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="true">
                <span class="ds-dropdown__value" data-ds-dropdown-value>2 selected</span>
                ${CHEVRON_UP_DOWN}
              </button>
              <div class="ds-select__menu ds-dropdown__menu" role="listbox">
                ${SEARCH_INPUT}
                <div class="ds-dropdown__list ds-scrollbar">
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4.1-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="true" data-checked="true">
                    <span class="ds-dropdown__check">${CHECK_ICON}</span>
                    <span>gpt-4.1-mini-2025-04-14</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-2024-08-06</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="true" data-checked="true">
                    <span class="ds-dropdown__check">${CHECK_ICON}</span>
                    <span>gpt-4o-2024-11-20</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>gpt-4o-mini-2024-07-18</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o1</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o1-mini</span>
                  </button>
                  <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-checked="false">
                    <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                    <span>o3-mini</span>
                  </button>
                </div>
              </div>
            </div>
          </label>
        </div>
      </section>

      <!-- Disabled State -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label>
            <span class="ds-label">Models</span>
            <div class="ds-dropdown" data-ds-dropdown>
              <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-expanded="false" disabled>
                <span class="ds-dropdown__value">2 selected</span>
                ${CHEVRON_UP_DOWN}
              </button>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);
