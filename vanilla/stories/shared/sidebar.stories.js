import { story } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Sidebar',
  parameters: { layout: 'fullscreen' },
};

const COLLAPSE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M6 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2V5H6Zm4 0v14h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-8ZM3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Z" clip-rule="evenodd"/></svg>`;
const CHEVRON_PAIR_ICON = `<svg width="8" height="12" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.34151 0.747423C4.71854 0.417526 5.28149 0.417526 5.65852 0.747423L9.65852 4.24742C10.0742 4.61111 10.1163 5.24287 9.75259 5.6585C9.38891 6.07414 8.75715 6.11626 8.34151 5.75258L5.00001 2.82877L1.65852 5.75258C1.24288 6.11626 0.61112 6.07414 0.247438 5.6585C-0.116244 5.24287 -0.0741267 4.61111 0.34151 4.24742L4.34151 0.747423ZM0.246065 10.3578C0.608879 9.94139 1.24055 9.89795 1.65695 10.2608L5.00001 13.1737L8.34308 10.2608C8.75948 9.89795 9.39115 9.94139 9.75396 10.3578C10.1168 10.7742 10.0733 11.4058 9.65695 11.7687L5.65695 15.2539C5.28043 15.582 4.7196 15.582 4.34308 15.2539L0.343082 11.7687C-0.0733128 11.4058 -0.116749 10.7742 0.246065 10.3578Z"/></svg>`;
const SEARCH_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.875 4.5C7.35418 4.5 4.5 7.35418 4.5 10.875C4.5 14.3958 7.35418 17.25 10.875 17.25C14.3958 17.25 17.25 14.3958 17.25 10.875C17.25 7.35418 14.3958 4.5 10.875 4.5ZM2.5 10.875C2.5 6.24962 6.24962 2.5 10.875 2.5C15.5004 2.5 19.25 6.24962 19.25 10.875C19.25 12.8273 18.582 14.6236 17.462 16.0478L21.2071 19.7929C21.5976 20.1834 21.5976 20.8166 21.2071 21.2071C20.8166 21.5976 20.1834 21.5976 19.7929 21.2071L16.0478 17.462C14.6236 18.582 12.8273 19.25 10.875 19.25C6.24962 19.25 2.5 15.5004 2.5 10.875Z"/></svg>`;
const HOME_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.5 11.737c0-.728-.005-1.07-.038-1.298l-.044-.201a1.999 1.999 0 0 0-.238-.52l-.111-.155c-.12-.15-.276-.283-.681-.577l-.496-.354-3.7-2.612c-.933-.658-1.295-.898-1.585-1.002l-.12-.036a2 2 0 0 0-.853-.026l-.121.026c-.318.08-.64.287-1.704 1.038l-3.7 2.612c-.595.42-.871.621-1.039.78l-.138.151a2 2 0 0 0-.35.675c-.072.244-.082.528-.082 1.499v5.062l.003.727c.003.2.01.364.022.506.022.271.06.372.084.422l.083.133a1 1 0 0 0 .354.303l.049.022c.062.022.17.047.373.063.283.023.656.025 1.232.025h1.8v-3.25a3.5 3.5 0 1 1 7 0V19h1.8c.576 0 .949-.002 1.232-.025.272-.022.373-.06.422-.085l.134-.082a.998.998 0 0 0 .303-.354l.021-.05a1.47 1.47 0 0 0 .064-.372c.023-.284.024-.656.024-1.233v-5.062Zm2 5.062c0 .544.001 1.012-.03 1.396a3.22 3.22 0 0 1-.23 1.024l-.067.143a3 3 0 0 1-1.104 1.195l-.207.116c-.378.192-.771.264-1.167.296-.383.032-.852.03-1.395.03h-2.8a1 1 0 0 1-1-1v-4.25a1.5 1.5 0 0 0-3 0V20a1 1 0 0 1-1 1H6.7c-.543 0-1.012.002-1.395-.03a3.224 3.224 0 0 1-1.025-.23l-.142-.067a3 3 0 0 1-1.196-1.104l-.115-.206c-.192-.378-.264-.772-.297-1.167a9.947 9.947 0 0 1-.026-.638L2.5 16.8v-5.062c0-.85-.01-1.478.163-2.065.145-.49.383-.949.7-1.35l.149-.174c.363-.396.835-.72 1.443-1.15l3.7-2.612c.929-.655 1.604-1.152 2.372-1.344l.24-.052a4 4 0 0 1 1.707.052l.284.087c.656.233 1.275.684 2.087 1.257L19.045 7l.488.345c.457.33.82.618 1.104.978l.115.153a4 4 0 0 1 .585 1.197l.057.223c.114.525.106 1.098.106 1.842V16.8Z"/></svg>`;
const RESPONSES_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4.5C7.5271 4.5 4 7.91095 4 12C4 13.6958 4.5996 15.263 5.62036 16.5254C5.80473 16.7534 5.87973 17.0509 5.82551 17.339C5.72928 17.8505 5.60336 18.3503 5.45668 18.8401C6.08722 18.743 6.69878 18.6098 7.2983 18.4395C7.54758 18.3687 7.81461 18.3975 8.04312 18.5197C9.20727 19.1423 10.5566 19.5 12 19.5C16.4729 19.5 20 16.0891 20 12C20 7.91095 16.4729 4.5 12 4.5ZM2 12C2 6.70021 6.53177 2.5 12 2.5C17.4682 2.5 22 6.70021 22 12C22 17.2998 17.4682 21.5 12 21.5C10.3694 21.5 8.82593 21.1286 7.46141 20.4675C6.36717 20.7507 5.2423 20.9253 4.06155 20.9981C3.72191 21.019 3.39493 20.8658 3.19366 20.5915C2.9924 20.3171 2.94448 19.9592 3.06647 19.6415C3.35663 18.8859 3.6004 18.1448 3.77047 17.399C2.65693 15.8695 2 14.0088 2 12Z"/></svg>`;
const API_KEYS_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 4C12.2386 4 10 6.23858 10 9C10 9.50683 10.0751 9.99431 10.2141 10.4529C10.3211 10.8059 10.225 11.1892 9.96418 11.45L5.14645 16.2678C5.05268 16.3615 5 16.4887 5 16.6213V19H7.37868C7.51129 19 7.63847 18.9473 7.73223 18.8536L8.5 18.0858V16.5C8.5 15.9477 8.94772 15.5 9.5 15.5H11.0858L12.55 14.0358C12.8108 13.775 13.1941 13.6789 13.5471 13.7859C14.0057 13.9249 14.4932 14 15 14C17.7614 14 20 11.7614 20 9C20 6.23858 17.7614 4 15 4ZM8 9C8 5.13401 11.134 2 15 2C18.866 2 22 5.13401 22 9C22 12.866 18.866 16 15 16C14.508 16 14.0269 15.9491 13.5622 15.852L12.2071 17.2071C12.0196 17.3946 11.7652 17.5 11.5 17.5H10.5V18.5C10.5 18.7652 10.3946 19.0196 10.2071 19.2071L9.14645 20.2678C8.67761 20.7366 8.04172 21 7.37868 21H4C3.44772 21 3 20.5523 3 20V16.6213C3 15.9583 3.26339 15.3224 3.73223 14.8536L8.14801 10.4378C8.05092 9.97307 8 9.49204 8 9Z"/><path d="M17.75 8C17.75 8.9665 16.9665 9.75 16 9.75C15.0335 9.75 14.25 8.9665 14.25 8C14.25 7.0335 15.0335 6.25 16 6.25C16.9665 6.25 17.75 7.0335 17.75 8Z"/></svg>`;
const SETTINGS_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M11.568 3.5a1 1 0 0 0-.863.494l-.811 1.381A3.001 3.001 0 0 1 7.33 6.856l-1.596.013a1 1 0 0 0-.858.501l-.439.761a1 1 0 0 0-.004.992l.792 1.4a3 3 0 0 1 0 2.954l-.792 1.4a1 1 0 0 0 .004.992l.439.76a1 1 0 0 0 .858.502l1.596.013a3 3 0 0 1 2.564 1.48l.811 1.382a1 1 0 0 0 .863.494h.87a1 1 0 0 0 .862-.494l.812-1.381a3.001 3.001 0 0 1 2.563-1.481l1.596-.013a1 1 0 0 0 .86-.501l.438-.761a1 1 0 0 0 .004-.992l-.793-1.4a3 3 0 0 1 0-2.954l.793-1.4a1 1 0 0 0-.004-.992l-.439-.76a1 1 0 0 0-.858-.502l-1.597-.013a3 3 0 0 1-2.563-1.48L13.3 3.993a1 1 0 0 0-.862-.494h-.87ZM8.98 2.981A3.001 3.001 0 0 1 11.568 1.5h.87c1.064 0 2.049.564 2.588 1.481l.811 1.382a1 1 0 0 0 .855.494l1.596.013a3 3 0 0 1 2.575 1.502l.44.76a3 3 0 0 1 .011 2.975l-.792 1.4a1 1 0 0 0 0 .985l.792 1.401a3 3 0 0 1-.012 2.974l-.439.761a3.001 3.001 0 0 1-2.575 1.503l-1.597.012a1 1 0 0 0-.854.494l-.811 1.382a3.001 3.001 0 0 1-2.588 1.481h-.87a3.001 3.001 0 0 1-2.588-1.481l-.811-1.382a1 1 0 0 0-.855-.494l-1.596-.012a3.001 3.001 0 0 1-2.576-1.503l-.438-.76a3 3 0 0 1-.013-2.975l.793-1.4a1 1 0 0 0 0-.985l-.793-1.4a3 3 0 0 1 .013-2.975l.438-.761A3.001 3.001 0 0 1 5.718 4.87l1.596-.013a1 1 0 0 0 .855-.494l.81-1.382Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M12.003 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM8.502 12a3.5 3.5 0 1 1 7 .001 3.5 3.5 0 0 1-7-.001Z" clip-rule="evenodd"/></svg>`;
const GLOBE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;

export const Default = story(
  'Default / Shared / Sidebar / Default',
  `
    <div class="ds-shell">
      <aside class="ds-sidebar" data-ds-sidebar aria-label="Sidebar navigation">
        <div class="ds-sidebar__header">
          <button type="button" class="ds-sidebar__brand" aria-label="Default project">
            <span class="ds-sidebar__brand-label">Default project</span>
            <span class="ds-sidebar__brand-chevron">${CHEVRON_PAIR_ICON}</span>
          </button>
          <button type="button" class="ds-sidebar__collapse" data-ds-sidebar-collapse aria-label="Collapse sidebar" aria-expanded="true">
            ${COLLAPSE_ICON}
          </button>
        </div>

        <button type="button" class="ds-search-trigger ds-sidebar__search" data-ds-search-trigger aria-haspopup="dialog" aria-expanded="false" aria-keyshortcuts="Meta+K Control+K">
          <span class="ds-search-trigger__icon" aria-hidden="true">${SEARCH_ICON}</span>
          <span class="ds-search-trigger__label">Search</span>
          <kbd class="ds-search-trigger__kbd" aria-hidden="true">⌘K</kbd>
        </button>

        <nav class="ds-nav" aria-label="Primary navigation">
          <a class="ds-nav__item is-active" href="#home" data-nav-id="home" aria-current="page">
            ${HOME_ICON}
            <span class="ds-nav__label">Home</span>
          </a>
          <a class="ds-nav__item" href="#responses" data-nav-id="responses">
            ${RESPONSES_ICON}
            <span class="ds-nav__label">Responses</span>
          </a>
          <a class="ds-nav__item" href="#api-keys" data-nav-id="api-keys">
            ${API_KEYS_ICON}
            <span class="ds-nav__label">API Keys</span>
          </a>
          <a class="ds-nav__item" href="#settings" data-nav-id="settings">
            ${SETTINGS_ICON}
            <span class="ds-nav__label">Settings</span>
          </a>
        </nav>

        <div class="ds-sidebar__footer">
          <div class="ds-menu ds-menu--top ds-menu--block" data-ds-menu>
            <button type="button" class="ds-nav__item ds-menu__trigger" aria-haspopup="menu" aria-expanded="false">
              ${GLOBE_ICON}
              <span class="ds-nav__label">Language</span>
            </button>
            <div class="ds-menu__content" role="menu" aria-label="Language" hidden>
              <button type="button" class="ds-menu__item" role="menuitemradio" aria-checked="false" data-value="ko">
                <span class="ds-menu__item-left">
                  <span class="ds-menu__check">${CHECK_ICON}</span>
                  <span>한국어</span>
                </span>
              </button>
              <button type="button" class="ds-menu__item" role="menuitemradio" aria-checked="true" data-value="en">
                <span class="ds-menu__item-left">
                  <span class="ds-menu__check">${CHECK_ICON}</span>
                  <span>English</span>
                </span>
              </button>
              <button type="button" class="ds-menu__item" role="menuitemradio" aria-checked="false" data-value="vi">
                <span class="ds-menu__item-left">
                  <span class="ds-menu__check">${CHECK_ICON}</span>
                  <span>Tiếng Việt</span>
                </span>
              </button>
            </div>
          </div>

          <button type="button" class="ds-sidebar__account" aria-label="Thai Bang Organization">
            <span class="ds-avatar" aria-hidden="true">T</span>
            <span class="ds-sidebar__account-info">
              <span class="ds-sidebar__account-title">Thai Bang</span>
              <span class="ds-sidebar__account-support">Organization</span>
            </span>
          </button>
        </div>
      </aside>

      <div class="ds-dialog__backdrop" data-ds-search-dialog role="dialog" aria-modal="true" aria-label="Search" hidden>
        <section class="ds-cmd-palette" data-slot="command-palette">
          <div class="ds-cmd-palette-header">
            <span class="ds-cmd-palette-icon" aria-hidden="true">${SEARCH_ICON}</span>
            <input type="text" class="ds-cmd-palette-input" data-slot="command-palette-input" placeholder="Search for anything..." aria-label="Search for anything" role="combobox" aria-expanded="true" autocomplete="off">
            <span class="ds-cmd-palette-kbd">esc</span>
          </div>
          <div class="ds-cmd-palette-list" role="listbox" aria-label="Navigation items">
            <div class="ds-cmd-palette-group-title">Navigation</div>
            <button type="button" class="ds-cmd-palette-item ds-cmd-palette-item--active" role="option" data-slot="command-palette-item" data-id="home" aria-selected="true">
              <span class="ds-cmd-palette-item-icon" aria-hidden="true">${HOME_ICON}</span>
              <span class="ds-cmd-palette-label">Home</span>
            </button>
            <button type="button" class="ds-cmd-palette-item" role="option" data-slot="command-palette-item" data-id="responses" aria-selected="false">
              <span class="ds-cmd-palette-item-icon" aria-hidden="true">${RESPONSES_ICON}</span>
              <span class="ds-cmd-palette-label">Responses</span>
            </button>
            <button type="button" class="ds-cmd-palette-item" role="option" data-slot="command-palette-item" data-id="api-keys" aria-selected="false">
              <span class="ds-cmd-palette-item-icon" aria-hidden="true">${API_KEYS_ICON}</span>
              <span class="ds-cmd-palette-label">API Keys</span>
            </button>
            <button type="button" class="ds-cmd-palette-item" role="option" data-slot="command-palette-item" data-id="settings" aria-selected="false">
              <span class="ds-cmd-palette-item-icon" aria-hidden="true">${SETTINGS_ICON}</span>
              <span class="ds-cmd-palette-label">Settings</span>
            </button>
            <div class="ds-cmd-palette-empty" data-slot="command-palette-empty" hidden>No matching pages</div>
          </div>
        </section>
      </div>

      <main class="ds-main" aria-label="Workspace canvas"></main>
    </div>
  `,
  { layout: 'fullscreen' }
);
