import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Breadcrumb',
  parameters: { layout: 'padded' },
};

/* Source: Navigation headers on platform.openai.com (specifically https://platform.openai.com/audio/realtime/edit)
 * Ground truth from platform evidence:
 * - Hierarchy: Root link ("Realtime") › Switcher trigger ("New audio prompt ↕") › Status badge ("Draft")
 * - Separator: Subtle chevron right glyph (›) instead of slash
 * - Switcher Crumb: Interactive selector trigger composing .ds-dropdown with double chevron (↕)
 * - Status Badge: Compact rounded pill (.ds-badge.ds-badge--sm) with leading pencil icon
 * - Typography: 14px (var(--font-size-sm)), medium weight for active/current crumb, secondary for parent links
 * - State architecture: Enabled and Disabled states staged directly within each variant story */

const CHEVRON_RIGHT = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 4 4 4-4 4"/></svg>`;
const CHEVRON_UP_DOWN = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg>`;
const PENCIL_ICON = `<svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 2a1.414 1.414 0 0 1 2 2L4.5 12.5l-2.5.5.5-2.5L11 2z"/></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;

/* ── Variant 1: Default (Realtime Audio Edit — platform.openai.com Ground Truth) ── */

export const Default = story(
  'Default / Shared / Breadcrumb / Default',
  stage(
    'Realtime Audio Edit Header (https://platform.openai.com/audio/realtime/edit)',
    `<div class="ds-story-sections">
      <!-- Enabled: Switcher Crumb + Draft Badge -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link">Realtime</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <div class="ds-dropdown ds-breadcrumb__dropdown" data-ds-dropdown>
            <button class="ds-breadcrumb__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span class="ds-breadcrumb__current" data-ds-dropdown-value>New audio prompt</span>
              <span class="ds-select__chevron" aria-hidden="true">${CHEVRON_UP_DOWN}</span>
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>New audio prompt</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Customer support assistant</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Voice translation bot</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Interactive storytelling</span>
                </button>
              </div>
            </div>
          </div>
          <span class="ds-badge ds-badge--sm ds-breadcrumb__badge">
            ${PENCIL_ICON}
            <span>Draft</span>
          </span>
        </nav>
      </section>

      <!-- Disabled State -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Realtime</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <div class="ds-dropdown ds-breadcrumb__dropdown" data-ds-dropdown>
            <button class="ds-breadcrumb__trigger ds-dropdown__trigger" type="button" aria-expanded="false" disabled>
              <span class="ds-breadcrumb__current">New audio prompt</span>
              <span class="ds-select__chevron" aria-hidden="true">${CHEVRON_UP_DOWN}</span>
            </button>
          </div>
          <span class="ds-badge ds-badge--sm ds-breadcrumb__badge" data-disabled="true">
            ${PENCIL_ICON}
            <span>Draft</span>
          </span>
        </nav>
      </section>
    </div>`
  )
);

/* ── Variant 2: Standard (Platform Hierarchy with Chevrons) ── */

export const Standard = story(
  'Default / Shared / Breadcrumb / Standard',
  stage(
    'Standard Hierarchy (Platform Navigation)',
    `<div class="ds-story-sections">
      <!-- Enabled -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link">Workspace</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link">Audio</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <strong class="ds-breadcrumb__current" aria-current="page">Realtime</strong>
        </nav>
      </section>

      <!-- Disabled -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Workspace</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Audio</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <strong class="ds-breadcrumb__current" aria-disabled="true" aria-current="page">Realtime</strong>
        </nav>
      </section>
    </div>`
  )
);

/* ── Variant 3: DeepPath (Deep Hierarchy with Status Badge) ── */

export const DeepPath = story(
  'Default / Shared / Breadcrumb / Deep Path',
  stage(
    'Deep Nested Hierarchy With Status',
    `<div class="ds-story-sections">
      <!-- Enabled -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link">Default Project</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link">Audio</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link">Realtime</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <div class="ds-dropdown ds-breadcrumb__dropdown" data-ds-dropdown>
            <button class="ds-breadcrumb__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span class="ds-breadcrumb__current" data-ds-dropdown-value>Voice Agent Session 2049</span>
              <span class="ds-select__chevron" aria-hidden="true">${CHEVRON_UP_DOWN}</span>
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>Voice Agent Session 2049</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Voice Agent Session 2048</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Voice Agent Session 2047</span>
                </button>
              </div>
            </div>
          </div>
          <span class="ds-badge ds-badge--sm ds-breadcrumb__badge ds-badge--active">
            <span>Live</span>
          </span>
        </nav>
      </section>

      <!-- Disabled -->
      <section class="ds-story-section">
<nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Default Project</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Audio</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <a href="#" class="ds-breadcrumb__link" aria-disabled="true">Realtime</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">${CHEVRON_RIGHT}</span>
          <div class="ds-dropdown ds-breadcrumb__dropdown" data-ds-dropdown>
            <button class="ds-breadcrumb__trigger ds-dropdown__trigger" type="button" aria-expanded="false" disabled>
              <span class="ds-breadcrumb__current">Voice Agent Session 2049</span>
              <span class="ds-select__chevron" aria-hidden="true">${CHEVRON_UP_DOWN}</span>
            </button>
          </div>
          <span class="ds-badge ds-badge--sm ds-breadcrumb__badge" data-disabled="true">
            <span>Live</span>
          </span>
        </nav>
      </section>
    </div>`
  )
);
