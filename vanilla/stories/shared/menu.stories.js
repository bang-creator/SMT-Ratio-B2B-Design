import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Menu',
  parameters: { layout: 'padded' },
};

/* Source: Context and Overflow menus on platform.openai.com
 * Ground truth:
 * - Default: Overflow Action Menu from https://platform.openai.com/chat/edit?models=gpt-6-astra
 * - Arrow: Action Dropdown with trailing external arrow icons (Open in ChatGPT ↗, View as Markdown ↗)
 * - Typography: 14px (var(--font-size-sm)), 400 normal weight across options and headers
 * - State architecture: Enabled and Disabled states staged directly within each variant story
 * - Disabled cursor: Unavailable macOS cursor (cursor: not-allowed !important) on hover */

const MORE_HORIZONTAL_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="4" cy="8" r="1.25"/><circle cx="8" cy="8" r="1.25"/><circle cx="12" cy="8" r="1.25"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;
const LIGHTNING_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 1.5 2.5 9h5l-1 5.5 6-7.5h-5z"/></svg>`;
const TARGET_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="2.5"/><circle cx="8" cy="8" r="0.75" fill="currentColor"/></svg>`;
const HISTORY_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9L2 6"/><path d="M2 2.5V6h3.5"/><path d="M8 5v3.5l2.5 1.5"/></svg>`;
const ARROW_UP_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13.5V2.5M3.5 7 8 2.5 12.5 7"/></svg>`;

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M3.5 10.5h-.5a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v.5"/></svg>`;
const CHEVRON_DOWN = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>`;
const CHATGPT_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.8 6.5a3.3 3.3 0 0 0-.3-2.6 3.4 3.4 0 0 0-3.3-1.6 3.4 3.4 0 0 0-2.4-.8 3.4 3.4 0 0 0-3.1 1.9 3.4 3.4 0 0 0-2 1.5 3.3 3.3 0 0 0 .4 3.5 3.3 3.3 0 0 0 .3 2.6 3.4 3.4 0 0 0 3.3 1.6 3.4 3.4 0 0 0 2.4.8 3.4 3.4 0 0 0 3.1-1.9 3.4 3.4 0 0 0 2-1.5 3.3 3.3 0 0 0-.4-3.5z"/><path d="M8 8v3.5M8 8 5 6.2M8 8l3-1.8"/></svg>`;
const EXTERNAL_ARROW = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l5-5M4 3.5h4.5V8"/></svg>`;
const CODE_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 5-3 3 3 3M11 5l3 3-3 3M9.5 3.5l-3 9"/></svg>`;

/* ── Variant 1: Default (platform.openai.com/chat/edit?models=gpt-6-astra Ground Truth) ── */

export const Default = story(
  'Default / Shared / Menu / Default',
  stage(
    'Chat Overflow Action Menu (https://platform.openai.com/chat/edit?models=gpt-6-astra)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Overflow Menu -->
      <section class="ds-story-section">
<div class="ds-menu" data-ds-menu data-ds-open="true">
          <button type="button" class="ds-menu__trigger--icon ds-menu__trigger" aria-label="More options" aria-haspopup="true" aria-expanded="true">
            ${MORE_HORIZONTAL_ICON}
          </button>
          <div class="ds-menu__content" role="menu">
            <div class="ds-menu__header">API</div>
            <button type="button" class="ds-menu__item" role="menuitem" data-value="responses">
              <span class="ds-menu__item-left">
                <span class="ds-menu__check">${CHECK_ICON}</span>
                <span>Responses</span>
              </span>
            </button>
            <button type="button" class="ds-menu__item" role="menuitem" data-value="chat-completions">
              <span class="ds-menu__item-left">
                <span class="ds-menu__check-spacer"></span>
                <span>Chat Completions</span>
              </span>
            </button>
            <hr class="ds-menu__separator" role="separator">
            <button type="button" class="ds-menu__item" role="menuitem" data-value="optimize">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${LIGHTNING_ICON}</span>
                <span>Optimize</span>
              </span>
            </button>
            <button type="button" class="ds-menu__item" role="menuitem" data-value="evaluate">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${TARGET_ICON}</span>
                <span>Evaluate</span>
              </span>
            </button>
            <button type="button" class="ds-menu__item" role="menuitem" data-value="history">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${HISTORY_ICON}</span>
                <span>History</span>
              </span>
            </button>
            <hr class="ds-menu__separator" role="separator">
            <button type="button" class="ds-menu__item" role="menuitem" data-value="publish-prompt">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${ARROW_UP_ICON}</span>
                <span>Publish prompt</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-menu" data-ds-menu data-disabled="true">
          <button type="button" class="ds-menu__trigger--icon ds-menu__trigger" aria-label="More options" aria-haspopup="true" aria-expanded="false" disabled>
            ${MORE_HORIZONTAL_ICON}
          </button>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 2: Arrow (Dạng arrow — platform.openai.com Ground Truth) ── */

export const Arrow = story(
  'Default / Shared / Menu / Arrow',
  stage(
    'Action Menu with Chevron Trigger (https://platform.openai.com/chat/edit?models=gpt-6-astra)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Arrow Menu (Khi xổ ra thì chevron hướng ngược xuống) -->
      <section class="ds-story-section">
<div class="ds-menu" data-ds-menu data-ds-open="true">
          <button type="button" class="ds-button ds-button--secondary ds-menu__trigger" aria-haspopup="true" aria-expanded="true">
            <span class="ds-menu__icon">${COPY_ICON}</span>
            <span>Copy Markdown</span>
            <span class="ds-menu__chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
          </button>
          <div class="ds-menu__content" role="menu">
            <button type="button" class="ds-menu__item" role="menuitem" data-value="open-chatgpt">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${CHATGPT_ICON}</span>
                <span>Open in ChatGPT</span>
              </span>
              <span class="ds-menu__item-right" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </button>
            <hr class="ds-menu__separator" role="separator">
            <button type="button" class="ds-menu__item" role="menuitem" data-value="copy-markdown">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${COPY_ICON}</span>
                <span>Copy Markdown</span>
              </span>
            </button>
            <button type="button" class="ds-menu__item" role="menuitem" data-value="view-markdown">
              <span class="ds-menu__item-left">
                <span class="ds-menu__icon">${CODE_ICON}</span>
                <span>View as Markdown</span>
              </span>
              <span class="ds-menu__item-right" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-menu" data-ds-menu data-disabled="true">
          <button type="button" class="ds-button ds-button--secondary ds-menu__trigger" aria-haspopup="true" aria-expanded="false" disabled>
            <span class="ds-menu__icon">${COPY_ICON}</span>
            <span>Copy Markdown</span>
            <span class="ds-menu__chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
          </button>
        </div>
      </section>
    </div>`
  )
);
