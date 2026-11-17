import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Pagination',
  parameters: { layout: 'padded' },
};

/* Source: Platform table footer pagination on platform.openai.com
 * Ground truth from platform evidence & specification:
 * - 1 single consolidated variant: Default
 * - Left status: "Page 1 of 10", "Rows per page 10 v"
 * - Navigation: first ("«"), previous ("‹"), page buttons (1, 2, 3, ···, 8, 9, 10), next ("›"), last ("»")
 * - Compact controls: 28px height, rounded corners, subtle border outline
 * - Active page: high-contrast text without intrusive box
 * - State architecture: Enabled and Disabled states staged directly within the story */

const CHEVRON_UP_DOWN = `<span class="ds-select__chevron" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg></span>`;
const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;
const FIRST_PAGE_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 12-4-4 4-4m-4 8-4-4 4-4"/></svg>`;
const PREV_PAGE_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 12-4-4 4-4"/></svg>`;
const NEXT_PAGE_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>`;
const LAST_PAGE_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 4 4 4-4 4m4-8 4 4-4 4"/></svg>`;

/* ── Pagination (Consolidated Single Variant) ── */

export const Default = story(
  'Default / Shared / Pagination / Default',
  stage(
    'Table Footer Pagination',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Table Pagination -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav class="ds-pagination" data-ds-pagination data-current-page="1" data-total-pages="10" aria-label="Pagination">
            <div class="ds-pagination__left">
              <span class="ds-pagination__status">Page <span data-ds-page-current>1</span> of <span data-ds-page-total>10</span></span>
              <div class="ds-pagination__rows-per-page">
                <span class="ds-pagination__label">Rows per page</span>
                <div class="ds-dropdown ds-dropdown--sm ds-pagination__dropdown" data-ds-dropdown data-ds-rows-dropdown>
                  <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Rows per page">
                    <span class="ds-dropdown__value" data-ds-dropdown-value data-ds-rows-value>10</span>
                    ${CHEVRON_UP_DOWN}
                  </button>
                  <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
                    <div class="ds-dropdown__list ds-scrollbar">
                      <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true" data-value="10">
                        <span class="ds-dropdown__check">${CHECK_ICON}</span>
                        <span>10</span>
                      </button>
                      <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false" data-value="20">
                        <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                        <span>20</span>
                      </button>
                      <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false" data-value="50">
                        <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                        <span>50</span>
                      </button>
                      <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false" data-value="100">
                        <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                        <span>100</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ds-pagination__right">
              <div class="ds-pagination__nav-group">
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" data-ds-page-action="first" aria-label="First page" disabled>
                  ${FIRST_PAGE_ICON}
                </button>
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" data-ds-page-action="prev" aria-label="Previous page" disabled>
                  ${PREV_PAGE_ICON}
                </button>
              </div>

              <div class="ds-pagination__pages" role="group" aria-label="Page selection">
                <button type="button" class="ds-pagination__page is-active" data-page="1" aria-current="page">1</button>
                <button type="button" class="ds-pagination__page" data-page="2">2</button>
                <button type="button" class="ds-pagination__page" data-page="3">3</button>
                <span class="ds-pagination__ellipsis" aria-hidden="true">···</span>
                <button type="button" class="ds-pagination__page" data-page="8">8</button>
                <button type="button" class="ds-pagination__page" data-page="9">9</button>
                <button type="button" class="ds-pagination__page" data-page="10">10</button>
              </div>

              <div class="ds-pagination__nav-group">
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" data-ds-page-action="next" aria-label="Next page">
                  ${NEXT_PAGE_ICON}
                </button>
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" data-ds-page-action="last" aria-label="Last page">
                  ${LAST_PAGE_ICON}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav class="ds-pagination" data-ds-pagination data-disabled="true" data-current-page="1" data-total-pages="10" aria-label="Pagination">
            <div class="ds-pagination__left">
              <span class="ds-pagination__status">Page <span data-ds-page-current>1</span> of <span data-ds-page-total>10</span></span>
              <div class="ds-pagination__rows-per-page">
                <span class="ds-pagination__label">Rows per page</span>
                <div class="ds-dropdown ds-dropdown--sm ds-pagination__dropdown" data-ds-dropdown data-ds-rows-dropdown data-disabled="true">
                  <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" disabled aria-label="Rows per page">
                    <span class="ds-dropdown__value" data-ds-dropdown-value data-ds-rows-value>10</span>
                    ${CHEVRON_UP_DOWN}
                  </button>
                </div>
              </div>
            </div>

            <div class="ds-pagination__right">
              <div class="ds-pagination__nav-group">
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" aria-label="First page" disabled>
                  ${FIRST_PAGE_ICON}
                </button>
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" aria-label="Previous page" disabled>
                  ${PREV_PAGE_ICON}
                </button>
              </div>

              <div class="ds-pagination__pages" role="group" aria-label="Page selection">
                <button type="button" class="ds-pagination__page is-active" aria-current="page" disabled>1</button>
                <button type="button" class="ds-pagination__page" disabled>2</button>
                <button type="button" class="ds-pagination__page" disabled>3</button>
                <span class="ds-pagination__ellipsis" aria-hidden="true">···</span>
                <button type="button" class="ds-pagination__page" disabled>8</button>
                <button type="button" class="ds-pagination__page" disabled>9</button>
                <button type="button" class="ds-pagination__page" disabled>10</button>
              </div>

              <div class="ds-pagination__nav-group">
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" aria-label="Next page" disabled>
                  ${NEXT_PAGE_ICON}
                </button>
                <button type="button" class="ds-icon-button ds-icon-button--ghost ds-pagination__btn ds-pagination__btn--nav" aria-label="Last page" disabled>
                  ${LAST_PAGE_ICON}
                </button>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>`
  )
);

/* ── Inline Pagination Variant (Table / List Header & Footer) ── */

export const Inline = story(
  'Default / Shared / Pagination / Inline',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <nav class="ds-pagination ds-pagination--inline" data-ds-pagination-inline data-page="1" data-page-size="10" data-total-items="42" data-entity="invoices" aria-label="Invoices pagination">
            <span class="ds-pagination__summary">1-10 of 42 invoices</span>
            <div class="ds-pagination__nav-group">
              <button type="button" class="ds-pagination__btn" data-ds-page-action="prev" aria-label="Previous page" disabled>
                ${PREV_PAGE_ICON}
              </button>
              <button type="button" class="ds-pagination__btn" data-ds-page-action="next" aria-label="Next page">
                ${NEXT_PAGE_ICON}
              </button>
            </div>
          </nav>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-stack">
          <nav class="ds-pagination ds-pagination--inline" data-disabled="true" aria-label="Disabled pagination">
            <span class="ds-pagination__summary">1-1 invoices</span>
            <div class="ds-pagination__nav-group">
              <button type="button" class="ds-pagination__btn" aria-label="Previous page" disabled>
                ${PREV_PAGE_ICON}
              </button>
              <button type="button" class="ds-pagination__btn" aria-label="Next page" disabled>
                ${NEXT_PAGE_ICON}
              </button>
            </div>
          </nav>
        </div>
      </section>
    </div>`
  )
);
