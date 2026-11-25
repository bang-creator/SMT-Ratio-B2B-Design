import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Filter',
  parameters: { layout: 'padded' },
};

/* Source: Filter pills & toolbar on https://platform.openai.com/settings/organization/projects
 * Ground truth:
 * - Unselected pill: height 32px, radius full, 1px solid border-default, bg transparent, muted text-secondary
 * - Hover (unselected): border-strong, 4% tint bg, text-sidebar
 * - Selected / Active pill ([data-active="true"]): transparent border, 12% surface bg, text-sidebar medium (500), inline clear button (×)
 * - Popover Menu (.ds-filter__menu): radius-xl (12px), shadow-menu, background-menu, option items 32px
 * - Filter Bar Reset ([data-ds-filter-reset]): 32×32px circular outline × button shown when any filter or search is active */

const GLOBE_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2a9.5 9.5 0 0 1 0 12M8 2a9.5 9.5 0 0 0 0 12"/></svg>`;
const ARCHIVE_TRAY_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="11" height="10" rx="2"/><path d="M2.5 9.5h3l1.2 1.5h2.6l1.2-1.5h3"/></svg>`;
const STATUS_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="2.2"/><path d="M4.6 11.4a4.8 4.8 0 0 1 0-6.8M11.4 4.6a4.8 4.8 0 0 1 0 6.8"/></svg>`;
const CLOSE_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"/></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;
const SEARCH_ICON = `<span class="ds-search-input__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.875 4.5C7.35418 4.5 4.5 7.35418 4.5 10.875C4.5 14.3958 7.35418 17.25 10.875 17.25C14.3958 17.25 17.25 14.3958 17.25 10.875C17.25 7.35418 14.3958 4.5 10.875 4.5ZM2.5 10.875C2.5 6.24962 6.24962 2.5 10.875 2.5C15.5004 2.5 19.25 6.24962 19.25 10.875C19.25 12.8273 18.582 14.6236 17.462 16.0478L21.2071 19.7929C21.5976 20.1834 21.5976 20.8166 21.2071 21.2071C20.8166 21.5976 20.1834 21.5976 19.7929 21.2071L16.0478 17.462C14.6236 18.582 12.8273 19.25 10.875 19.25C6.24962 19.25 2.5 15.5004 2.5 10.875Z"></path></svg></span>`;
const RELOAD_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>`;
const PLUS_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`;

export const Default = story(
  'Default / Shared / Filter / Default',
  stage(
    'Filter States (Unselected, Active with Clear, Multi-Select, and Disabled)',
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-row">
          <div class="ds-filter" data-ds-filter data-label="Geography">
            <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="ds-filter__icon" aria-hidden="true">${GLOBE_ICON}</span>
              <span data-ds-filter-value>Geography</span>
              <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>${CLOSE_ICON}</span>
            </button>
            <div class="ds-filter__menu" role="listbox" hidden>
              <div class="ds-filter__list ds-scrollbar">
                <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="true" data-checked="true">
                  <span class="ds-filter__check">${CHECK_ICON}</span>
                  <span>All regions</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="global" aria-selected="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>Global</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="us" aria-selected="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>United States</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="eu" aria-selected="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>Europe</span>
                </button>
              </div>
            </div>
          </div>

          <div class="ds-filter" data-ds-filter data-label="Status" data-active="true">
            <button type="button" class="ds-filter__trigger" data-active="true" aria-haspopup="listbox" aria-expanded="false">
              <span class="ds-filter__icon" aria-hidden="true">${STATUS_ICON}</span>
              <span data-ds-filter-value>Active</span>
              <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value">${CLOSE_ICON}</span>
            </button>
            <div class="ds-filter__menu" role="listbox" hidden>
              <div class="ds-filter__list ds-scrollbar">
                <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>All statuses</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="active" aria-selected="true" data-checked="true">
                  <span class="ds-filter__check">${CHECK_ICON}</span>
                  <span>Active</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="archived" aria-selected="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>Archived</span>
                </button>
              </div>
            </div>
          </div>

          <div class="ds-filter" data-ds-filter data-label="Retention" data-multi="true">
            <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false">
              <span class="ds-filter__icon" aria-hidden="true">${ARCHIVE_TRAY_ICON}</span>
              <span data-ds-filter-value>Retention</span>
              <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>${CLOSE_ICON}</span>
            </button>
            <div class="ds-filter__menu" role="listbox" hidden>
              <div class="ds-filter__list ds-scrollbar">
                <button type="button" class="ds-filter__item" role="option" data-value="zero" aria-checked="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>Zero data retention</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="30d" aria-checked="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>30-day logging</span>
                </button>
                <button type="button" class="ds-filter__item" role="option" data-value="90d" aria-checked="false">
                  <span class="ds-filter__check ds-filter__check--empty"></span>
                  <span>90-day archive</span>
                </button>
              </div>
            </div>
          </div>

          <div class="ds-filter" data-ds-filter data-label="Disabled">
            <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false" disabled>
              <span class="ds-filter__icon" aria-hidden="true">${GLOBE_ICON}</span>
              <span data-ds-filter-value>Disabled</span>
            </button>
          </div>
        </div>
      </section>
    </div>`
  )
);

export const WithSearch = story(
  'Default / Shared / Filter / With Search',
  stage(
    'Searchable Filter Popover',
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-filter" data-ds-filter data-label="Data retention">
          <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-filter__icon" aria-hidden="true">${ARCHIVE_TRAY_ICON}</span>
            <span data-ds-filter-value>Data retention</span>
            <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>${CLOSE_ICON}</span>
          </button>
          <div class="ds-filter__menu" role="listbox" hidden>
            <div class="ds-search-input ds-search-input--block" data-ds-search-input>
              ${SEARCH_ICON}
              <input type="text" class="ds-search-input__field" placeholder="Search options..." aria-label="Search filter options">
            </div>
            <div class="ds-filter__list ds-scrollbar">
              <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="true" data-checked="true">
                <span class="ds-filter__check">${CHECK_ICON}</span>
                <span>All policies</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="standard" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Standard</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="zdr" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Zero data retention</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="custom" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Custom policy</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>`
  )
);

export const FilterBar = story(
  'Default / Shared / Filter / Filter Bar',
  stage(
    'OpenAI Platform Projects Toolbar Row (Search + Filters + Clear All + Actions)',
    `<div class="ds-filter-bar">
      <div class="ds-filter-bar__group">
        <div class="ds-search-input ds-search-input--pill" data-ds-search-input data-pill data-has-end-adornment>
          ${SEARCH_ICON}
          <input type="text" class="ds-search-input__field" placeholder="Search projects by name..." aria-label="Search projects">
          <button type="button" class="ds-search-input__clear" aria-label="Clear search" hidden>${CLOSE_ICON}</button>
        </div>

        <div class="ds-filter" data-ds-filter data-label="Geography">
          <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-filter__icon" aria-hidden="true">${GLOBE_ICON}</span>
            <span data-ds-filter-value>Geography</span>
            <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>${CLOSE_ICON}</span>
          </button>
          <div class="ds-filter__menu" role="listbox" hidden>
            <div class="ds-filter__list ds-scrollbar">
              <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="true" data-checked="true">
                <span class="ds-filter__check">${CHECK_ICON}</span>
                <span>All regions</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="global" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Global</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="us" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>United States</span>
              </button>
            </div>
          </div>
        </div>

        <div class="ds-filter" data-ds-filter data-label="Data retention">
          <button type="button" class="ds-filter__trigger" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-filter__icon" aria-hidden="true">${ARCHIVE_TRAY_ICON}</span>
            <span data-ds-filter-value>Data retention</span>
            <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value" hidden>${CLOSE_ICON}</span>
          </button>
          <div class="ds-filter__menu" role="listbox" hidden>
            <div class="ds-filter__list ds-scrollbar">
              <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="true" data-checked="true">
                <span class="ds-filter__check">${CHECK_ICON}</span>
                <span>All policies</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="standard" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Standard</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="zdr" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Zero data retention</span>
              </button>
            </div>
          </div>
        </div>

        <div class="ds-filter" data-ds-filter data-label="Status" data-active="true">
          <button type="button" class="ds-filter__trigger" data-active="true" aria-haspopup="listbox" aria-expanded="false">
            <span class="ds-filter__icon" aria-hidden="true">${STATUS_ICON}</span>
            <span data-ds-filter-value>Active</span>
            <span class="ds-filter__clear" role="button" tabindex="0" aria-label="Clear current value">${CLOSE_ICON}</span>
          </button>
          <div class="ds-filter__menu" role="listbox" hidden>
            <div class="ds-filter__list ds-scrollbar">
              <button type="button" class="ds-filter__item" role="option" data-value="all" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>All statuses</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="active" aria-selected="true" data-checked="true">
                <span class="ds-filter__check">${CHECK_ICON}</span>
                <span>Active</span>
              </button>
              <button type="button" class="ds-filter__item" role="option" data-value="archived" aria-selected="false">
                <span class="ds-filter__check ds-filter__check--empty"></span>
                <span>Archived</span>
              </button>
            </div>
          </div>
        </div>

        <button type="button" class="ds-filter-reset" data-ds-filter-reset aria-label="Clear all filters">${CLOSE_ICON}</button>
      </div>

      <div class="ds-filter-bar__actions">
        <button type="button" class="ds-button ds-button--secondary">${RELOAD_ICON}<span>Reload</span></button>
        <button type="button" class="ds-button ds-button--primary">${PLUS_ICON}<span>Create</span></button>
      </div>
    </div>`
  )
);
