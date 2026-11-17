import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 77 Mentions',
  parameters: { layout: 'padded' },
};

const ICONS = {
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
};

const PEOPLE = [
  { name: 'Mara', role: 'human' },
  { name: 'Max', role: 'agent' },
  { name: 'Aiden', role: 'agent' },
  { name: 'Ana', role: 'human' },
];

const LONG_PEOPLE = [
  { name: 'Release_Coordinator_Agent_Staging', role: 'agent' },
  { name: 'Rosalind_Featherstonehaugh', role: 'human' },
];

function filterPeople(query, list) {
  const atIdx = query.lastIndexOf('@');
  if (atIdx === -1) return [];
  const search = query.slice(atIdx + 1).toLowerCase();
  return list.filter((p) => p.name.toLowerCase().startsWith(search));
}

function renderMentionComposer({
  value = '@',
  people = PEOPLE,
  activeIndex = 0,
} = {}) {
  const matches = filterPeople(value, people);
  const showMenu = matches.length > 0;

  const menuItemsHtml = matches
    .map((person, idx) => {
      const isActive = idx === activeIndex;
      return `
        <button
          type="button"
          role="menuitem"
          data-slot="composer-person-item"
          data-name="${person.name}"
          data-active="${isActive}"
          class="ds-composer-person-item ${isActive ? 'ds-composer-person-item--active' : ''}"
        >
          <span class="ds-composer-person-avatar" aria-hidden="true">${person.name[0]}</span>
          <span class="ds-composer-person-name">${person.name}</span>
          <span class="ds-composer-person-role">${person.role}</span>
        </button>
      `;
    })
    .join('');

  return `
    <div data-slot="composer" class="ds-composer">
      ${
        showMenu
          ? `
        <div data-slot="composer-menu" class="ds-composer-menu" role="menu" aria-label="Mention people or agents">
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
          placeholder="Ask anything or use @ to mention"
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

    let currentVal = 'Loop in @';
    let activeIdx = 0;

    const render = () => {
      const matches = filterPeople(currentVal, PEOPLE);
      const statusBadge = matches.length > 0
        ? `${matches.length} mention${matches.length > 1 ? 's' : ''}`
        : currentVal.includes('@')
        ? 'No matches'
        : 'Idle';

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderMentionComposer({
              value: currentVal,
              people: PEOPLE,
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
              const atIdx = currentVal.lastIndexOf('@');
              const prefix = atIdx !== -1 ? currentVal.slice(0, atIdx) : currentVal;
              currentVal = `${prefix}@${chosen.name} `;
              activeIdx = 0;
              render();
            }
          } else if (e.key === 'Escape') {
            e.preventDefault();
            const atIdx = currentVal.lastIndexOf('@');
            if (atIdx !== -1) {
              currentVal = currentVal.slice(0, atIdx);
            }
            render();
          }
        });
      }

      root.querySelectorAll('[data-slot="composer-person-item"]').forEach((item) => {
        item.addEventListener('click', () => {
          const name = item.getAttribute('data-name');
          const atIdx = currentVal.lastIndexOf('@');
          const prefix = atIdx !== -1 ? currentVal.slice(0, atIdx) : currentVal;
          currentVal = `${prefix}@${name} `;
          activeIdx = 0;
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const LongNames = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderMentionComposer({
        value: 'Hand this to @R',
        people: LONG_PEOPLE,
        activeIndex: 0,
      })}
    </div>
  </div>
`);
