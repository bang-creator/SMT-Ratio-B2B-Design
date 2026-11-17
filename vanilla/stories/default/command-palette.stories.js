import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 85 Command palette',
  parameters: { layout: 'padded' },
};

const ICONS = {
  search: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
};

const COMMANDS = [
  { id: 'new', label: 'New thread', group: 'Thread', keys: ['⌘', 'N'] },
  { id: 'search', label: 'Search threads', group: 'Thread', keys: ['⌘', 'K'] },
  { id: 'share', label: 'Share conversation', group: 'Thread', keys: ['⌘', 'S'] },
  { id: 'model', label: 'Switch model', group: 'Session', keys: ['⌘', 'M'] },
  { id: 'stop', label: 'Stop the run', group: 'Session', keys: ['esc'] },
];

const MORE_COMMANDS = [
  ...COMMANDS,
  { id: 'rename', label: 'Rename thread', group: 'Thread', keys: ['⌘', 'R'] },
  { id: 'archive', label: 'Archive thread', group: 'Thread', keys: ['⌘', 'E'] },
  {
    id: 'export',
    label: 'Export conversation as Markdown with attachments',
    group: 'Thread',
    keys: ['⌘', '⇧', 'E'],
  },
  { id: 'retry', label: 'Retry last message', group: 'Session', keys: ['⌘', '↵'] },
  { id: 'effort', label: 'Change reasoning effort', group: 'Session', keys: [] },
  { id: 'theme', label: 'Toggle dark mode', group: 'App', keys: ['⌘', '⇧', 'L'] },
  { id: 'settings', label: 'Open settings', group: 'App', keys: ['⌘', ','] },
  { id: 'shortcuts', label: 'Keyboard shortcuts', group: 'App', keys: ['?'] },
];

function renderCommandPalette({
  query = '',
  activeId = 'new',
  commands = COMMANDS,
} = {}) {
  const matches = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );
  const groups = [...new Set(matches.map((c) => c.group))];

  return `
    <div data-slot="command-palette" class="ds-cmd-palette">
      <div class="ds-cmd-palette-header">
        <span class="ds-cmd-palette-icon" aria-hidden="true">
          ${ICONS.search}
        </span>
        <input
          type="text"
          data-slot="command-palette-input"
          class="ds-cmd-palette-input"
          placeholder="Type a command"
          value="${query}"
          aria-label="Type a command"
          role="combobox"
          aria-expanded="${matches.length > 0}"
        />
        <span class="ds-cmd-palette-kbd">esc</span>
      </div>

      <div class="ds-cmd-palette-list" role="listbox" aria-label="Commands">
        ${
          matches.length > 0
            ? groups
                .map(
                  (group) => `
              <div role="group" aria-label="${group}">
                <div class="ds-cmd-palette-group-title">${group}</div>
                ${matches
                  .filter((c) => c.group === group)
                  .map(
                    (c) => `
                  <button
                    type="button"
                    role="option"
                    data-slot="command-palette-item"
                    data-id="${c.id}"
                    aria-selected="${c.id === activeId}"
                    class="ds-cmd-palette-item ${c.id === activeId ? 'ds-cmd-palette-item--active' : ''}"
                  >
                    <span class="ds-cmd-palette-label">${c.label}</span>
                    ${
                      c.keys.length > 0
                        ? `
                      <span class="ds-cmd-palette-keys">
                        ${c.keys.map((k) => `<span class="ds-cmd-palette-kbd">${k}</span>`).join('')}
                      </span>
                    `
                        : ''
                    }
                  </button>
                `,
                  )
                  .join('')}
              </div>
            `,
                )
                .join('')
            : `
            <div data-slot="command-palette-empty" class="ds-cmd-palette-empty">
              No command matches “${query}”
            </div>
          `
        }
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentQuery = '';
    let currentActiveId = 'new';
    let executedLabel = '';

    const render = () => {
      const matches = COMMANDS.filter((c) =>
        c.label.toLowerCase().includes(currentQuery.toLowerCase()),
      );
      const active = matches.find((c) => c.id === currentActiveId);

      const badgeText = executedLabel
        ? `Ran: ${executedLabel}`
        : active
        ? active.label
        : matches.length > 0
        ? `${matches.length} commands`
        : 'No matches';

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderCommandPalette({
              query: currentQuery,
              activeId: currentActiveId,
              commands: COMMANDS,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="command-palette-input"]');
      if (input) {
        input.focus();
        input.setSelectionRange(currentQuery.length, currentQuery.length);

        input.addEventListener('input', (e) => {
          currentQuery = e.target.value;
          const currentMatches = COMMANDS.filter((c) =>
            c.label.toLowerCase().includes(currentQuery.toLowerCase()),
          );
          if (!currentMatches.some((c) => c.id === currentActiveId) && currentMatches.length > 0) {
            currentActiveId = currentMatches[0].id;
          }
          executedLabel = '';
          render();
        });

        input.addEventListener('keydown', (e) => {
          const currentMatches = COMMANDS.filter((c) =>
            c.label.toLowerCase().includes(currentQuery.toLowerCase()),
          );
          if (currentMatches.length === 0) return;
          const at = currentMatches.findIndex((c) => c.id === currentActiveId);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = (at + 1) % currentMatches.length;
            currentActiveId = currentMatches[nextIdx].id;
            render();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = (at - 1 + currentMatches.length) % currentMatches.length;
            currentActiveId = currentMatches[prevIdx].id;
            render();
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const chosen = currentMatches.find((c) => c.id === currentActiveId);
            if (chosen) {
              executedLabel = chosen.label;
              render();
            }
          }
        });
      }

      root.querySelectorAll('[data-slot="command-palette-item"]').forEach((item) => {
        item.addEventListener('click', () => {
          currentActiveId = item.getAttribute('data-id');
          executedLabel = item.querySelector('.ds-cmd-palette-label')?.textContent || '';
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const Filtered = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCommandPalette({
        query: 'thread',
        activeId: 'search',
        commands: COMMANDS,
      })}
    </div>
  </div>
`);

export const NoMatches = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCommandPalette({
        query: 'deploy to staging',
        activeId: 'new',
        commands: COMMANDS,
      })}
    </div>
  </div>
`);

export const LongList = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderCommandPalette({
        query: '',
        activeId: 'export',
        commands: MORE_COMMANDS,
      })}
    </div>
  </div>
`);
