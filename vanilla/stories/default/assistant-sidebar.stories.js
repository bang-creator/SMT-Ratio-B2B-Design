import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 102 Assistant sidebar AUI',
  parameters: { layout: 'padded' },
};

const BOT_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>`;
const ARROW_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
const SPARKLE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`;

const QUESTION = 'Draft the release notes for version 2.4';

function renderAssistantSidebar({
  mode = 'default',
  interactive = false,
} = {}) {
  let bodyHtml = '';

  if (mode === 'empty') {
    bodyHtml = `
      <div class="ds-sidebar-aui__empty" data-slot="empty-state">
        <div class="ds-sidebar-aui__empty-icon" aria-hidden="true">
          ${SPARKLE_ICON}
        </div>
        <h4 class="ds-sidebar-aui__empty-title">How can I help you?</h4>
        <p class="ds-sidebar-aui__empty-sub">Ask questions beside your workspace.</p>
        <div class="ds-sidebar-aui__starters">
          <button type="button" class="ds-sidebar-aui__starter-chip" data-chip="Explain code">Explain code</button>
          <button type="button" class="ds-sidebar-aui__starter-chip" data-chip="Write tests">Write tests</button>
        </div>
      </div>
    `;
  } else if (mode === 'streaming') {
    bodyHtml = `
      <div class="ds-sidebar-aui__user-bubble">${QUESTION}</div>
      <div class="ds-sidebar-aui__assistant-msg">
        <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts. With a<span class="ds-sidebar-aui__cursor" aria-hidden="true"></span></span>
      </div>
    `;
  } else if (mode === 'error') {
    bodyHtml = `
      <div class="ds-sidebar-aui__user-bubble">${QUESTION}</div>
      <div class="ds-sidebar-aui__assistant-msg">
        <span>Drafts live on the composer, so</span>
        <div class="ds-sidebar-aui__error-card" data-slot="error-card">
          <span>429: rate limit reached</span>
          <button type="button" class="ds-thread-aui__retry-btn">Retry</button>
        </div>
      </div>
    `;
  } else if (mode === 'long') {
    bodyHtml = `
      <div class="ds-sidebar-aui__user-bubble">${QUESTION}</div>
      <div class="ds-sidebar-aui__assistant-msg">
        <span>Save the draft on every change and restore it when the thread mounts.</span>
        <pre class="ds-thread-aui__tool-args">const aui = useAui();
useEffect(() => {
  const saved = localStorage.getItem('draft:' + threadId);
  if (saved) aui.composer.setText(saved);
}, [aui, threadId]);</pre>
        <span>Key the storage entry by thread id so switching threads does not leak a draft into the wrong conversation.</span>
      </div>
      <div class="ds-sidebar-aui__user-bubble">Does that survive a remote thread list switch?</div>
      <div class="ds-sidebar-aui__assistant-msg">
        <span>Yes, as long as the effect depends on the thread id. The remote thread list remounts the thread body on a switch, so the effect runs again.</span>
      </div>
    `;
  } else {
    // Default
    bodyHtml = `
      <div class="ds-sidebar-aui__user-bubble">${QUESTION}</div>
      <div class="ds-sidebar-aui__assistant-msg">
        <span>Here is the proposed changelog based on recent commits across the repository.</span>
      </div>
    `;
  }

  return `
    <div
      data-slot="assistant-sidebar"
      class="ds-sidebar-aui-wrap"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-sidebar-aui__workspace">
        <div class="ds-sidebar-aui__workspace-icon" aria-hidden="true">
          ${BOT_ICON}
        </div>
        <h4 class="ds-sidebar-aui__workspace-title">Workspace</h4>
        <p class="ds-sidebar-aui__workspace-sub">Resize the assistant beside your app.</p>
      </div>

      <div class="ds-sidebar-aui__handle" data-slot="resize-handle" aria-hidden="true"></div>

      <div class="ds-sidebar-aui__pane" data-slot="sidebar-pane">
        <div class="ds-sidebar-aui__header">
          <span class="ds-sidebar-aui__header-title">Assistant</span>
          <span class="ds-sidebar-aui__header-badge">gpt-4o</span>
        </div>

        <div class="ds-sidebar-aui__body" data-slot="sidebar-body">
          ${bodyHtml}
        </div>

        <div class="ds-sidebar-aui__composer">
          <div class="ds-sidebar-aui__input-pill">
            <input
              type="text"
              class="ds-sidebar-aui__input"
              placeholder="Ask anything..."
              aria-label="Ask anything"
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
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(wrap) {
  const input = wrap.querySelector('[data-slot="input"]');
  const sendBtn = wrap.querySelector('[data-slot="send-btn"]');
  const body = wrap.querySelector('[data-slot="sidebar-body"]');
  const starterChips = wrap.querySelectorAll('.ds-sidebar-aui__starter-chip');

  function sendMessage(text) {
    if (!text.trim() || !body) return;
    const empty = body.querySelector('[data-slot="empty-state"]');
    if (empty) empty.remove();

    const userBubble = document.createElement('div');
    userBubble.className = 'ds-sidebar-aui__user-bubble';
    userBubble.textContent = text;
    body.appendChild(userBubble);

    const aiMsg = document.createElement('div');
    aiMsg.className = 'ds-sidebar-aui__assistant-msg';
    aiMsg.innerHTML = `<span>Processing question: "<em>${text}</em>".</span>`;
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

  starterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sendMessage(chip.getAttribute('data-chip'));
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderAssistantSidebar({ mode: 'empty', interactive: true });
    const wrap = root.querySelector('[data-slot="assistant-sidebar"]');
    if (wrap) attachInteractiveHandlers(wrap);
    return root;
  },
};

export const Empty = story(renderAssistantSidebar({ mode: 'empty' }));

export const Streaming = story(renderAssistantSidebar({ mode: 'streaming' }));

export const Error = story(renderAssistantSidebar({ mode: 'error' }));

export const LongContent = story(renderAssistantSidebar({ mode: 'long' }));
