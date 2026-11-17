import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 66 Todo List',
  parameters: { layout: 'padded' },
};

const ICONS = {
  check: `<svg class="ds-todo-item__icon ds-todo-item__icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  fail: `<svg class="ds-todo-item__icon ds-todo-item__icon--failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  minus: `<svg class="ds-todo-item__icon ds-todo-item__icon--cancelled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  spinner: `<svg class="ds-todo-item__spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
};

function renderTodoItem(item) {
  let indicator = '';
  if (item.status === 'done') {
    indicator = `<span class="ds-todo-item__box ds-todo-item__box--done">${ICONS.check}</span>`;
  } else if (item.status === 'failed') {
    indicator = `<span class="ds-todo-item__box ds-todo-item__box--failed">${ICONS.fail}</span>`;
  } else if (item.status === 'cancelled') {
    indicator = `<span class="ds-todo-item__box ds-todo-item__box--cancelled">${ICONS.minus}</span>`;
  } else if (item.status === 'active') {
    indicator = ICONS.spinner;
  } else {
    indicator = '<span class="ds-todo-item__box"></span>';
  }

  return `
    <li class="ds-todo-item" data-status="${item.status}" data-id="${item.id}" role="button" tabindex="0">
      <span class="ds-todo-item__icon-wrapper" aria-hidden="true">
        ${indicator}
      </span>
      <span class="sr-only">${item.status}</span>
      <div class="ds-todo-item__content">
        <span class="ds-todo-item__text">${item.text}</span>
        ${
          item.status === 'failed' && item.reason
            ? `<p class="ds-todo-item__meta">${item.reason}</p>`
            : item.description
              ? `<p class="ds-todo-item__meta">${item.description}</p>`
              : ''
        }
      </div>
    </li>
  `;
}

function renderTodoListCard({
  title = 'Todos',
  description = 'Automated workspace verification tasks',
  revision = 3,
  items = [],
  isCard = true,
  maxVisible = undefined,
  isExpanded = false,
} = {}) {
  const doneCount = items.filter((i) => i.status === 'done').length;
  const totalCount = items.filter((i) => i.status !== 'cancelled').length;
  const ratioText = revision !== undefined ? `${doneCount}/${totalCount} · rev ${revision}` : `${doneCount}/${totalCount}`;

  let visibleItems = items;
  let canFold = false;
  let hiddenCount = 0;

  if (maxVisible !== undefined && items.length > maxVisible) {
    canFold = true;
    hiddenCount = items.length - maxVisible;
    if (!isExpanded) {
      visibleItems = items.slice(0, maxVisible);
    }
  }

  return `
    <div data-slot="todo-list" class="ds-todo-list ${isCard ? 'ds-todo-list--card' : ''}">
      <div class="ds-todo-list__header">
        <div class="ds-todo-list__heading">
          <h4 class="ds-todo-list__title">${title}</h4>
          ${description ? `<p class="ds-todo-list__description">${description}</p>` : ''}
        </div>
        <span class="ds-todo-list__ratio">${ratioText}</span>
      </div>

      <ul class="ds-todo-list__items">
        ${visibleItems.map(renderTodoItem).join('')}
      </ul>

      ${
        canFold
          ? `<button type="button" class="ds-todo-list__fold-btn" data-btn-fold>
              ${isExpanded ? 'Show less' : `Show ${hiddenCount} more`}
            </button>`
          : ''
      }
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let items = [
      { id: '1', text: 'Set up zero-literal design token audit script', status: 'done' },
      { id: '2', text: 'Implement specular shimmer highlight in CSS', status: 'done' },
      { id: '3', text: 'Build Playwright audit matrix for 190 stories', status: 'active', description: 'Testing computed layout and responsive boundaries' },
      { id: '4', text: 'Compile production native bundle', status: 'failed', reason: 'Missing linker dependency (exit code 1)' },
      { id: '5', text: 'Release production design system storybook', status: 'pending' },
    ];

    let isExpanded = false;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderTodoListCard({
              title: 'Verification pipeline',
              description: 'Workspace validation checklist',
              revision: 3,
              items,
              isCard: true,
              maxVisible: 3,
              isExpanded,
            })}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-todo-item').forEach((row) => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          const target = items.find((i) => i.id === id);
          if (target) {
            const nextStatus = {
              pending: 'active',
              active: 'done',
              done: 'failed',
              failed: 'pending',
              cancelled: 'pending',
            }[target.status] || 'pending';
            target.status = nextStatus;
            render();
          }
        });
      });

      root.querySelector('[data-btn-fold]')?.addEventListener('click', () => {
        isExpanded = !isExpanded;
        render();
      });
    };

    render();
    return root;
  },
};

export const Bare = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderTodoListCard({
        title: 'Converter fix',
        description: 'Empty tool result handling',
        revision: 4,
        isCard: false,
        items: [
          { id: 'read', text: 'Read the failing test', status: 'done' },
          { id: 'fix', text: 'Fix the converter source', status: 'done' },
          { id: 'verify', text: 'Re-run the full test suite', status: 'done' },
        ],
      })}
    </div>
  </div>
`);
