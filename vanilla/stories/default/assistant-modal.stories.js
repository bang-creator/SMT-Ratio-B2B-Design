import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 101 Assistant modal AUI',
  parameters: { layout: 'padded' },
};

const BOT_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const ARROW_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
const SPARKLE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`;

const QUESTION = 'How do I persist a composer draft across reloads?';

function renderAssistantModal({
  open = true,
  mode = 'default',
  interactive = false,
} = {}) {
  let bodyHtml = '';

  if (mode === 'empty') {
    bodyHtml = `
      <div class="ds-modal-aui__empty" data-slot="empty-state">
        <div class="ds-modal-aui__empty-icon" aria-hidden="true">
          ${SPARKLE_ICON}
        </div>
        <h4 class="ds-modal-aui__empty-title">How can I help you today?</h4>
        <p class="ds-modal-aui__empty-sub">Ask questions about your project or debug issues.</p>
        <div class="ds-modal-aui__starters">
          <button type="button" class="ds-modal-aui__starter-chip" data-chip="Explain re-renders">Explain re-renders</button>
          <button type="button" class="ds-modal-aui__starter-chip" data-chip="Add test suite">Add test suite</button>
        </div>
      </div>
    `;
  } else if (mode === 'streaming') {
    bodyHtml = `
      <div class="ds-modal-aui__user-bubble">${QUESTION}</div>
      <div class="ds-modal-aui__assistant-msg">
        <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts. With a<span class="ds-modal-aui__cursor" aria-hidden="true"></span></span>
      </div>
    `;
  } else if (mode === 'error') {
    bodyHtml = `
      <div class="ds-modal-aui__user-bubble">${QUESTION}</div>
      <div class="ds-modal-aui__assistant-msg">
        <span>Drafts live on the composer, so</span>
        <div class="ds-modal-aui__error-card" data-slot="error-card">
          <span>429: rate limit reached</span>
          <button type="button" class="ds-thread-aui__retry-btn">Retry</button>
        </div>
      </div>
    `;
  } else {
    // Default
    bodyHtml = `
      <div class="ds-modal-aui__user-bubble">${QUESTION}</div>
      <div class="ds-modal-aui__assistant-msg">
        <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts.</span>
      </div>
    `;
  }

  return `
    <div
      data-slot="assistant-modal"
      class="ds-modal-aui-wrap"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div
        class="ds-modal-aui ${!open ? 'ds-modal-aui--closed' : ''}"
        data-slot="modal-dialog"
      >
        <div class="ds-modal-aui__header">
          <div class="ds-modal-aui__header-title">
            <span aria-hidden="true">${BOT_ICON}</span>
            <span>Assistant</span>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            class="ds-modal-aui__close-btn"
            data-slot="close-btn"
          >
            ${X_ICON}
          </button>
        </div>

        <div class="ds-modal-aui__body" data-slot="modal-body">
          ${bodyHtml}
        </div>

        <div class="ds-modal-aui__composer">
          <div class="ds-modal-aui__input-pill">
            <input
              type="text"
              class="ds-modal-aui__input"
              placeholder="Message..."
              aria-label="Message"
              data-slot="input"
            />
          </div>
          <button
            type="button"
            aria-label="Send"
            class="ds-modal-aui__send-btn"
            data-slot="send-btn"
            disabled
          >
            ${ARROW_UP}
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open Assistant"
        class="ds-modal-aui__launcher"
        data-slot="launcher-btn"
      >
        ${BOT_ICON}
      </button>
    </div>
  `;
}

function attachInteractiveHandlers(wrap) {
  const modal = wrap.querySelector('[data-slot="modal-dialog"]');
  const launcher = wrap.querySelector('[data-slot="launcher-btn"]');
  const closeBtn = wrap.querySelector('[data-slot="close-btn"]');
  const input = wrap.querySelector('[data-slot="input"]');
  const sendBtn = wrap.querySelector('[data-slot="send-btn"]');
  const body = wrap.querySelector('[data-slot="modal-body"]');

  function toggleModal(isOpen) {
    if (modal) {
      if (isOpen) {
        modal.classList.remove('ds-modal-aui--closed');
      } else {
        modal.classList.add('ds-modal-aui--closed');
      }
    }
  }

  if (launcher) {
    launcher.addEventListener('click', () => {
      const isClosed = modal && modal.classList.contains('ds-modal-aui--closed');
      toggleModal(isClosed);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toggleModal(false);
    });
  }

  function sendMessage(text) {
    if (!text.trim() || !body) return;
    const empty = body.querySelector('[data-slot="empty-state"]');
    if (empty) empty.remove();

    const userBubble = document.createElement('div');
    userBubble.className = 'ds-modal-aui__user-bubble';
    userBubble.textContent = text;
    body.appendChild(userBubble);

    const aiMsg = document.createElement('div');
    aiMsg.className = 'ds-modal-aui__assistant-msg';
    aiMsg.innerHTML = `<span>Received request: "<em>${text}</em>". Processing assistant output.</span>`;
    body.appendChild(aiMsg);

    body.scrollTop = body.scrollHeight;
    if (input) input.value = '';
    if (sendBtn) sendBtn.disabled = true;
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
    root.innerHTML = renderAssistantModal({ open: true, mode: 'default', interactive: true });
    const wrap = root.querySelector('[data-slot="assistant-modal"]');
    if (wrap) attachInteractiveHandlers(wrap);
    return root;
  },
};

export const Closed = story(renderAssistantModal({
  open: false,
  mode: 'default',
}));

export const Empty = story(renderAssistantModal({
  open: true,
  mode: 'empty',
}));

export const Streaming = story(renderAssistantModal({
  open: true,
  mode: 'streaming',
}));

export const Error = story(renderAssistantModal({
  open: true,
  mode: 'error',
}));
