import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 76 Slash commands',
  parameters: { layout: 'padded' },
};

const ICONS = {
  search: `<svg class="ds-composer-cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  book: `<svg class="ds-composer-cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  branch: `<svg class="ds-composer-cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>`,
  sparkles: `<svg class="ds-composer-cmd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
};

const COMMANDS = [
  { name: 'review', desc: 'Review the current diff', icon: ICONS.search },
  { name: 'explain', desc: 'Explain the selection', icon: ICONS.book },
  { name: 'branch', desc: 'Start a new branch', icon: ICONS.branch },
  { name: 'improve', desc: 'Suggest improvements', icon: ICONS.sparkles },
];

const LONG_COMMANDS = [
  {
    name: 'review',
    desc: 'Review the current diff against repo conventions and flag anything that should not ship',
    icon: ICONS.search,
  },
  {
    name: 'release-notes',
    desc: 'Draft comprehensive release notes from every merged pull request since the last production tag',
    icon: ICONS.sparkles,
  },
];

function renderSlashComposer({
  value = '/',
  commands = COMMANDS,
  activeIndex = 0,
} = {}) {
  const matches = value.startsWith('/')
    ? commands.filter((c) => c.name.startsWith(value.slice(1).toLowerCase()))
    : [];

  const showMenu = matches.length > 0;

  const menuItemsHtml = matches
    .map((cmd, i) => {
      const isActive = i === activeIndex;
      return `
        <button
          type="button"
          role="menuitem"
          data-slot="composer-menu-item"
          data-cmd="${cmd.name}"
          data-active="${isActive}"
          class="ds-composer-cmd-item ${isActive ? 'ds-composer-cmd-item--active' : ''}"
        >
          ${cmd.icon}
          <span class="ds-composer-cmd-name">/${cmd.name}</span>
          <span class="ds-composer-cmd-desc">${cmd.desc}</span>
          ${isActive ? '<kbd class="ds-composer-cmd-kbd">↵</kbd>' : ''}
        </button>
      `;
    })
    .join('');

  return `
    <div data-slot="composer" class="ds-composer">
      ${
        showMenu
          ? `
        <div data-slot="composer-menu" class="ds-composer-menu" role="menu" aria-label="Slash commands">
          ${menuItemsHtml}
        </div>
      `
          : ''
      }

      <div data-slot="composer-bar" class="ds-composer-bar">
        <input
          type="text"
          data-slot="composer-input"
          class="ds-composer-input"
          placeholder="Ask anything or type / for commands"
          value="${value}"
          aria-label="Composer query input"
        />

        <div data-slot="composer-toolbar" class="ds-composer-toolbar">
          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-attach"
              class="ds-composer-attach-btn ds-icon-button ds-icon-button--ghost ds-button--pill"
              aria-label="Add attachment"
            >
              ${ICONS.plus}
            </button>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-send"
              data-state="${value.trim().length > 0 ? 'active' : 'idle'}"
              class="ds-composer-send-btn ${value.trim().length > 0 ? 'ds-composer-send-btn--active' : ''}"
              aria-label="Send message"
              ${value.trim().length === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowUp}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentVal = '/';
    let activeIdx = 0;

    const render = () => {
      const matches = currentVal.startsWith('/')
        ? COMMANDS.filter((c) => c.name.startsWith(currentVal.slice(1).toLowerCase()))
        : [];

      const statusBadge = matches.length > 0
        ? `${matches.length} command${matches.length > 1 ? 's' : ''}`
        : currentVal.startsWith('/')
        ? 'No matches'
        : 'Idle';

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">76 Slash commands</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${statusBadge}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderSlashComposer({
              value: currentVal,
              commands: COMMANDS,
              activeIndex: activeIdx,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="composer-input"]');
      if (input) {
        input.focus();
        input.setSelectionRange(currentVal.length, currentVal.length);

        input.addEventListener('input', (e) => {
          currentVal = e.target.value;
          activeIdx = 0;
          render();
        });

        input.addEventListener('keydown', (e) => {
          if (matches.length === 0) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIdx = (activeIdx + 1) % matches.length;
            render();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIdx = (activeIdx - 1 + matches.length) % matches.length;
            render();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const chosen = matches[activeIdx];
            if (chosen) {
              currentVal = `/${chosen.name} `;
              activeIdx = 0;
              render();
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            currentVal = '';
            render();
          }
        });
      }

      root.querySelectorAll('[data-slot="composer-menu-item"]').forEach((item) => {
        item.addEventListener('click', () => {
          const cmd = item.getAttribute('data-cmd');
          currentVal = `/${cmd} `;
          activeIdx = 0;
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const LongDescriptions = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">76 Slash commands (Long Descriptions)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Text Truncation</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderSlashComposer({
        value: '/',
        commands: LONG_COMMANDS,
        activeIndex: 0,
      })}
    </div>
  </div>
`);
