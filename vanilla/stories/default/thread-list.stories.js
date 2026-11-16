import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 103 Thread list AUI',
  parameters: { layout: 'padded' },
};

const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const PENCIL_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>`;
const TRASH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;

const DEFAULT_GROUPS = [
  {
    title: 'Today',
    threads: [
      { id: 't-1', title: 'Persist composer drafts', time: '10:42', active: true, unread: false },
      { id: 't-2', title: 'Fix flaky checkout test', time: '09:15', active: false, unread: true },
    ],
  },
  {
    title: 'Yesterday',
    threads: [
      { id: 't-3', title: 'Postgres 17 upgrade plan', time: 'Yesterday', active: false, unread: false },
      { id: 't-4', title: 'Rate limit headers', time: 'Yesterday', active: false, unread: false },
    ],
  },
  {
    title: 'Earlier',
    threads: [
      { id: 't-5', title: 'Quarterly usage report', time: 'Nov 8', active: false, unread: false },
      { id: 't-6', title: 'Onboarding email copy', time: 'Nov 5', active: false, unread: false },
    ],
  },
];

function renderThreadList({
  mode = 'default',
  groups = DEFAULT_GROUPS,
  interactive = false,
} = {}) {
  let bodyContent = '';

  if (mode === 'loading') {
    bodyContent = `
      <div class="ds-thread-list-aui__group-title">Loading</div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
    `;
  } else if (mode === 'empty') {
    bodyContent = `
      <div class="ds-p-4 ds-text-center ds-text-xs ds-text-secondary" data-slot="empty-msg">
        No saved threads
      </div>
    `;
  } else if (mode === 'untitled') {
    bodyContent = `
      <div class="ds-thread-list-aui__group-title">Today</div>
      <div class="ds-thread-list-aui__row is-active" data-id="u-1">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">New Chat</span>
          <span class="ds-thread-list-aui__meta">10:42</span>
        </button>
      </div>
      <div class="ds-thread-list-aui__row" data-id="u-2">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">New Chat</span>
          <span class="ds-thread-list-aui__meta">09:15</span>
        </button>
      </div>
      <div class="ds-thread-list-aui__row" data-id="u-3">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">Rate limit headers</span>
          <span class="ds-thread-list-aui__meta">08:00</span>
        </button>
      </div>
    `;
  } else if (mode === 'long') {
    bodyContent = `
      <div class="ds-thread-list-aui__group-title">Today</div>
      <div class="ds-thread-list-aui__row is-active">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">Why does the staging deploy pick up the production environment variables after a rollback from the release branch</span>
          <span class="ds-thread-list-aui__meta">10:42</span>
        </button>
      </div>
      <div class="ds-thread-list-aui__row">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">Compare p95 latency across us-east-1, eu-west-1, and ap-southeast-2 for the last 30 days</span>
          <span class="ds-thread-list-aui__meta">09:15</span>
        </button>
      </div>
      <div class="ds-thread-list-aui__group-title">Earlier</div>
      ${Array.from({ length: 8 }, (_, i) => `
        <div class="ds-thread-list-aui__row">
          <button type="button" class="ds-thread-list-aui__item-btn">
            <span class="ds-thread-list-aui__title">Support ticket #${4812 - i}</span>
            <span class="ds-thread-list-aui__meta">Nov ${8 - i}</span>
          </button>
        </div>
      `).join('')}
    `;
  } else {
    // Default & Interactive
    bodyContent = groups.map((g) => `
      <div class="ds-thread-list-aui__group-title">${g.title}</div>
      ${g.threads.map((t) => `
        <div class="ds-thread-list-aui__row ${t.active ? 'is-active' : ''}" data-thread-id="${t.id}" aria-selected="${t.active}">
          <button type="button" class="ds-thread-list-aui__item-btn" data-action="select-thread">
            <span class="ds-thread-list-aui__title">${t.title}</span>
            <span class="ds-thread-list-aui__meta">
              ${t.unread ? '<span class="ds-thread-list-aui__unread-dot" aria-hidden="true"></span>' : ''}
              <span>${t.time}</span>
            </span>
          </button>
          <div class="ds-thread-list-aui__actions">
            <button type="button" aria-label="Rename ${t.title}" class="ds-thread-list-aui__action-btn" data-action="rename">
              ${PENCIL_ICON}
            </button>
            <button type="button" aria-label="Delete ${t.title}" class="ds-thread-list-aui__action-btn" data-action="delete">
              ${TRASH_ICON}
            </button>
          </div>
        </div>
      `).join('')}
    `).join('');
  }

  return `
    <div
      data-slot="thread-list"
      class="ds-thread-list-aui"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-thread-list-aui__header">
        <span class="ds-thread-list-aui__header-title">Chats</span>
        <button
          type="button"
          aria-label="New chat"
          class="ds-thread-list-aui__new-btn"
          data-action="new-chat"
        >
          ${PLUS_ICON}
        </button>
      </div>

      <div class="ds-thread-list-aui__body" role="listbox" aria-label="Threads" data-slot="thread-body">
        ${bodyContent}
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(threadListEl) {
  const body = threadListEl.querySelector('[data-slot="thread-body"]');
  const newBtn = threadListEl.querySelector('[data-action="new-chat"]');

  function bindRowHandlers(row) {
    const itemBtn = row.querySelector('[data-action="select-thread"]');
    const deleteBtn = row.querySelector('[data-action="delete"]');

    if (itemBtn) {
      itemBtn.addEventListener('click', () => {
        const allRows = body.querySelectorAll('.ds-thread-list-aui__row');
        allRows.forEach((r) => {
          r.classList.remove('is-active');
          r.setAttribute('aria-selected', 'false');
        });
        row.classList.add('is-active');
        row.setAttribute('aria-selected', 'true');
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        row.remove();
      });
    }
  }

  const rows = threadListEl.querySelectorAll('.ds-thread-list-aui__row');
  rows.forEach(bindRowHandlers);

  if (newBtn && body) {
    newBtn.addEventListener('click', () => {
      const allRows = body.querySelectorAll('.ds-thread-list-aui__row');
      allRows.forEach((r) => {
        r.classList.remove('is-active');
        r.setAttribute('aria-selected', 'false');
      });

      const newRow = document.createElement('div');
      newRow.className = 'ds-thread-list-aui__row is-active';
      newRow.setAttribute('aria-selected', 'true');
      newRow.setAttribute('data-thread-id', `new-${Date.now()}`);
      newRow.innerHTML = `
        <button type="button" class="ds-thread-list-aui__item-btn" data-action="select-thread">
          <span class="ds-thread-list-aui__title">New Chat</span>
          <span class="ds-thread-list-aui__meta"><span>Just now</span></span>
        </button>
        <div class="ds-thread-list-aui__actions">
          <button type="button" aria-label="Rename New Chat" class="ds-thread-list-aui__action-btn" data-action="rename">
            ${PENCIL_ICON}
          </button>
          <button type="button" aria-label="Delete New Chat" class="ds-thread-list-aui__action-btn" data-action="delete">
            ${TRASH_ICON}
          </button>
        </div>
      `;
      body.insertBefore(newRow, body.firstChild);
      bindRowHandlers(newRow);
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderThreadList({ interactive: true });
    const el = root.querySelector('[data-slot="thread-list"]');
    if (el) attachInteractiveHandlers(el);
    return root;
  },
};

export const Loading = story(renderThreadList({ mode: 'loading' }));

export const Empty = story(renderThreadList({ mode: 'empty' }));

export const Untitled = story(renderThreadList({ mode: 'untitled' }));

export const LongContent = story(renderThreadList({ mode: 'long' }));
