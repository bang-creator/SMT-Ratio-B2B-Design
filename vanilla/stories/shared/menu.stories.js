import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Menu',
  parameters: { layout: 'padded' },
};

/* Source: Context and Organization dropdown menus on platform.openai.com
 * Ground truth:
 * - Floating card: 12px radius (--radius-xl), shadow-menu, background: var(--color-semantic-background-menu)
 * - Item height: 32px (standard) / 28px (compact)
 * - Hover: sublayer ::before with smooth opacity transition
 * - Danger action: red text and background tint
 * - Keyboard navigation: ArrowUp/ArrowDown, Home/End, Escape to close */

const USER_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
const SETTINGS_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
const BILLING_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-icon"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`;
const LOGOUT_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`;
const MORE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="ds-icon"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>`;

export const Default = story(
  'Default / Shared / Menu / Default',
  stage(
    'Organization & Account Menu',
    `<div class="ds-menu" data-ds-menu>
      <button type="button" class="ds-button ds-button--secondary ds-menu__trigger" aria-haspopup="true" aria-expanded="false">
        <span>Bang Thai</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="ds-menu__content" role="menu">
        <button type="button" class="ds-menu__item" role="menuitem">
          <span class="ds-menu__item-left">
            ${USER_ICON}
            <span>Profile & preferences</span>
          </span>
          <span class="ds-menu__shortcut">⌘P</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span class="ds-menu__item-left">
            ${SETTINGS_ICON}
            <span>Organization settings</span>
          </span>
          <span class="ds-menu__shortcut">⌘S</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span class="ds-menu__item-left">
            ${BILLING_ICON}
            <span>Billing & limits</span>
          </span>
        </button>
        <hr class="ds-menu__separator" role="separator">
        <button type="button" class="ds-menu__item ds-menu__item--danger" role="menuitem" data-color="danger">
          <span class="ds-menu__item-left">
            ${LOGOUT_ICON}
            <span>Log out</span>
          </span>
        </button>
      </div>
    </div>`
  )
);

export const ContextMenu = story(
  'Default / Shared / Menu / Context Menu',
  stage(
    'Row Actions Menu (Three Dots)',
    `<div class="ds-menu" data-ds-menu>
      <button type="button" class="ds-icon-button ds-menu__trigger" aria-label="Row actions" aria-haspopup="true" aria-expanded="false">
        ${MORE_ICON}
      </button>
      <div class="ds-menu__content" role="menu">
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>Edit key name</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>Copy tracking ID</span>
          <span class="ds-menu__shortcut">⌘C</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>View usage logs</span>
        </button>
        <hr class="ds-menu__separator" role="separator">
        <button type="button" class="ds-menu__item ds-menu__item--danger" role="menuitem" data-color="danger">
          <span>Revoke secret key</span>
        </button>
      </div>
    </div>`
  )
);

export const Compact = story(
  'Default / Shared / Menu / Compact',
  stage(
    'Compact Density (28px Items)',
    `<div class="ds-menu ds-menu--compact" data-ds-menu>
      <button type="button" class="ds-button ds-button--outline ds-button--sm ds-menu__trigger" aria-haspopup="true" aria-expanded="false">
        <span>Filters</span>
      </button>
      <div class="ds-menu__content" role="menu">
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>Sort by newest</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>Sort by size</span>
        </button>
        <button type="button" class="ds-menu__item" role="menuitem">
          <span>Sort by cost</span>
        </button>
      </div>
    </div>`
  )
);
