import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 104 Thread list sidebar AUI',
  parameters: { layout: 'padded' },
};

const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const PANEL_LEFT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg>`;
const ARROW_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;

const DEFAULT_THREADS = [
  { id: '1', title: 'Persist composer drafts', time: '10:42', active: true },
  { id: '2', title: 'Fix flaky checkout test', time: '09:15', active: false },
  { id: '3', title: 'Postgres 17 upgrade plan', time: 'Yesterday', active: false },
  { id: '4', title: 'Rate limit headers', time: 'Yesterday', active: false },
];

function renderThreadListSidebar({
  mode = 'default',
  collapsed = false,
  interactive = false,
} = {}) {
  let sidebarBody = '';

  if (mode === 'loading') {
    sidebarBody = `
      <div class="ds-thread-list-aui__group-title">Loading</div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
      <div class="ds-thread-list-aui__skeleton" data-slot="skeleton"></div>
    `;
  } else if (mode === 'empty') {
    sidebarBody = `
      <div class="ds-p-4 ds-text-center ds-text-xs ds-text-secondary" data-slot="empty-msg">
        No saved threads
      </div>
    `;
  } else if (mode === 'long') {
    sidebarBody = `
      <div class="ds-thread-list-aui__group-title">Today</div>
      <div class="ds-thread-list-aui__row is-active">
        <button type="button" class="ds-thread-list-aui__item-btn">
          <span class="ds-thread-list-aui__title">Why does the staging deploy pick up the production environment variables after a rollback</span>
          <span class="ds-thread-list-aui__meta">10:42</span>
        </button>
      </div>
      <div class="ds-thread-list-aui__group-title">Earlier</div>
      ${Array.from({ length: 6 }, (_, i) => `
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
    sidebarBody = `
      <div class="ds-thread-list-aui__group-title">Today</div>
      ${DEFAULT_THREADS.slice(0, 2).map((t) => `
        <div class="ds-thread-list-aui__row ${t.active ? 'is-active' : ''}" data-id="${t.id}">
          <button type="button" class="ds-thread-list-aui__item-btn" data-action="select-thread">
            <span class="ds-thread-list-aui__title">${t.title}</span>
            <span class="ds-thread-list-aui__meta">${t.time}</span>
          </button>
        </div>
      `).join('')}
      <div class="ds-thread-list-aui__group-title">Yesterday</div>
      ${DEFAULT_THREADS.slice(2).map((t) => `
        <div class="ds-thread-list-aui__row ${t.active ? 'is-active' : ''}" data-id="${t.id}">
          <button type="button" class="ds-thread-list-aui__item-btn" data-action="select-thread">
            <span class="ds-thread-list-aui__title">${t.title}</span>
            <span class="ds-thread-list-aui__meta">${t.time}</span>
          </button>
        </div>
      `).join('')}
    `;
  }

  return `
    <div
      data-slot="thread-list-sidebar"
      class="ds-thread-list-sidebar-aui ${collapsed ? 'is-collapsed' : ''}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <!-- Collapsible Sidebar Pane -->
      <aside class="ds-thread-list-sidebar__pane" data-slot="sidebar-pane">
        <div class="ds-thread-list-sidebar__header">
          <button type="button" class="ds-thread-list-sidebar__new-chat-btn" data-action="new-chat">
            ${PLUS_ICON}
            <span>New chat</span>
          </button>
        </div>

        <div class="ds-thread-list-sidebar__list" data-slot="sidebar-list">
          ${sidebarBody}
        </div>

        <div class="ds-thread-list-sidebar-aui__footer">
          <div class="ds-thread-list-sidebar__avatar">OP</div>
          <div class="ds-flex ds-flex-col ds-min-w-0 ds-flex-1">
            <span class="ds-thread-list-sidebar__user-name">OpenAI Platform</span>
            <span class="ds-thread-list-sidebar__user-tier">Pro tier</span>
          </div>
        </div>
      </aside>

      <!-- Main Conversation Inset -->
      <main class="ds-thread-list-sidebar__main" data-slot="sidebar-main">
        <div class="ds-thread-list-sidebar__topbar">
          <div class="ds-thread-list-sidebar__topbar-left">
            <button
              type="button"
              aria-label="Toggle sidebar"
              class="ds-thread-list-sidebar__toggle-btn"
              data-action="toggle-sidebar"
            >
              ${PANEL_LEFT}
            </button>
            <span class="ds-thread-list-sidebar__topbar-title" data-slot="thread-title">Persist composer drafts</span>
          </div>
          <span class="ds-thread-list-sidebar__topbar-badge">gpt-4o</span>
        </div>

        <div class="ds-thread-list-sidebar__chat-body" data-slot="chat-body">
          <div class="ds-sidebar-aui__user-bubble">How do I persist a composer draft across reloads?</div>
          <div class="ds-sidebar-aui__assistant-msg">
            <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts.</span>
          </div>
        </div>

        <div class="ds-thread-list-sidebar__composer">
          <div class="ds-sidebar-aui__input-pill">
            <input
              type="text"
              class="ds-sidebar-aui__input"
              placeholder="Reply to thread..."
              aria-label="Reply to thread"
              data-slot="input"
            />
          </div>
          <button
            type="button"
            aria-label="Send"
            class="ds-sidebar-aui__send-btn"
            data-slot="send-btn"
            disabled
          >
            ${ARROW_UP}
          </button>
        </div>
      </main>
    </div>
  `;
}

function attachInteractiveHandlers(shell) {
  const toggleBtn = shell.querySelector('[data-action="toggle-sidebar"]');
  const newChatBtn = shell.querySelector('[data-action="new-chat"]');
  const threadTitle = shell.querySelector('[data-slot="thread-title"]');
  const list = shell.querySelector('[data-slot="sidebar-list"]');
  const input = shell.querySelector('[data-slot="input"]');
  const sendBtn = shell.querySelector('[data-slot="send-btn"]');
  const chatBody = shell.querySelector('[data-slot="chat-body"]');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      shell.classList.toggle('is-collapsed');
    });
  }

  function bindRowSelection(row) {
    const btn = row.querySelector('[data-action="select-thread"]');
    if (btn) {
      btn.addEventListener('click', () => {
        const allRows = list.querySelectorAll('.ds-thread-list-aui__row');
        allRows.forEach((r) => r.classList.remove('is-active'));
        row.classList.add('is-active');
        const titleEl = row.querySelector('.ds-thread-list-aui__title');
        if (threadTitle && titleEl) threadTitle.textContent = titleEl.textContent;
      });
    }
  }

  const rows = shell.querySelectorAll('.ds-thread-list-aui__row');
  rows.forEach(bindRowSelection);

  if (newChatBtn && list) {
    newChatBtn.addEventListener('click', () => {
      const allRows = list.querySelectorAll('.ds-thread-list-aui__row');
      allRows.forEach((r) => r.classList.remove('is-active'));

      const newRow = document.createElement('div');
      newRow.className = 'ds-thread-list-aui__row is-active';
      newRow.innerHTML = `
        <button type="button" class="ds-thread-list-aui__item-btn" data-action="select-thread">
          <span class="ds-thread-list-aui__title">New Chat</span>
          <span class="ds-thread-list-aui__meta">Just now</span>
        </button>
      `;
      list.insertBefore(newRow, list.firstChild);
      bindRowSelection(newRow);
      if (threadTitle) threadTitle.textContent = 'New Chat';
    });
  }

  if (input) {
    input.addEventListener('input', () => {
      if (sendBtn) sendBtn.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage(input.value);
      }
    });
  }

  function sendMessage(text) {
    if (!text.trim() || !chatBody) return;
    const userBubble = document.createElement('div');
    userBubble.className = 'ds-sidebar-aui__user-bubble';
    userBubble.textContent = text;
    chatBody.appendChild(userBubble);

    const aiMsg = document.createElement('div');
    aiMsg.className = 'ds-sidebar-aui__assistant-msg';
    aiMsg.innerHTML = `<span>Response to "<em>${text}</em>" generated.</span>`;
    chatBody.appendChild(aiMsg);

    chatBody.scrollTop = chatBody.scrollHeight;
    if (input) input.value = '';
    if (sendBtn) sendBtn.disabled = true;
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (input) sendMessage(input.value);
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderThreadListSidebar({ interactive: true });
    const shell = root.querySelector('[data-slot="thread-list-sidebar"]');
    if (shell) attachInteractiveHandlers(shell);
    return root;
  },
};

export const Loading = story(renderThreadListSidebar({ mode: 'loading' }));

export const Empty = story(renderThreadListSidebar({ mode: 'empty' }));

export const LongContent = story(renderThreadListSidebar({ mode: 'long' }));

export const Collapsed = story(renderThreadListSidebar({ collapsed: true }));
