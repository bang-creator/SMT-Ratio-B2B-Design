import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 100 Thread AUI',
  parameters: { layout: 'padded' },
};

const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ARROW_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
const SPARKLE_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`;
const CHEVRON_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const QUESTION = 'How do I persist a composer draft across reloads?';

function renderThread({
  mode = 'default',
  interactive = false,
} = {}) {
  let contentHtml = '';

  if (mode === 'empty') {
    contentHtml = `
      <div class="ds-thread-aui__empty" data-slot="empty-state">
        <div class="ds-thread-aui__empty-icon" aria-hidden="true">
          ${SPARKLE_ICON}
        </div>
        <h3 class="ds-thread-aui__empty-title">How can I help you today?</h3>
        <p class="ds-thread-aui__empty-sub">Ask questions about your codebase, debug failures, or generate tests.</p>
        <div class="ds-thread-aui__starters">
          <button type="button" class="ds-thread-aui__starter-chip" data-chip="Explain re-renders">Explain re-renders</button>
          <button type="button" class="ds-thread-aui__starter-chip" data-chip="Add test suite">Add test suite</button>
          <button type="button" class="ds-thread-aui__starter-chip" data-chip="Refactor to tokens">Refactor to tokens</button>
        </div>
      </div>
    `;
  } else if (mode === 'streaming') {
    contentHtml = `
      <div class="ds-thread-aui__msg--user">${QUESTION}</div>
      <div class="ds-thread-aui__msg--assistant">
        <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts. With a<span class="ds-thread-aui__cursor" aria-hidden="true"></span></span>
      </div>
    `;
  } else if (mode === 'error') {
    contentHtml = `
      <div class="ds-thread-aui__msg--user">${QUESTION}</div>
      <div class="ds-thread-aui__msg--assistant">
        <span>Drafts live on the composer, so</span>
        <div class="ds-thread-aui__error-card" data-slot="error-card">
          <span>429 Too Many Requests: rate limit reached for gpt-5 on this key.</span>
          <button type="button" class="ds-thread-aui__retry-btn">Retry</button>
        </div>
      </div>
    `;
  } else if (mode === 'tools') {
    contentHtml = `
      <div class="ds-thread-aui__msg--user">Is the docs search returning the drafts guide?</div>
      <div class="ds-thread-aui__msg--assistant">
        <div class="ds-thread-aui__reasoning" data-slot="reasoning">
          <div class="ds-thread-aui__reasoning-header">
            ${CHEVRON_DOWN}
            <span>Thought for 2 seconds</span>
          </div>
          <p class="ds-thread-aui__reasoning-body">The user wants to know whether search indexes the drafts guide. I will query for it and check the top hit.</p>
        </div>

        <div class="ds-thread-aui__tool-call" data-slot="tool-call">
          <div class="ds-thread-aui__tool-header">
            <span class="ds-thread-aui__tool-name">search_docs</span>
            <span class="ds-thread-aui__tool-badge">3 matches</span>
          </div>
          <pre class="ds-thread-aui__tool-args">args: { "query": "draft persistence", "limit": 5 }</pre>
        </div>

        <span>Yes. Searching for <strong>draft persistence</strong> returns 3 matches, and the top hit is <code>/docs/runtime/drafts</code>.</span>
      </div>
    `;
  } else if (mode === 'requires-action') {
    contentHtml = `
      <div class="ds-thread-aui__msg--user">Clear the build cache and rerun the tests.</div>
      <div class="ds-thread-aui__msg--assistant">
        <div class="ds-thread-aui__action-card" data-slot="action-card">
          <div class="ds-thread-aui__action-header">
            <span class="ds-thread-aui__action-title">run_command</span>
            <span class="ds-thread-aui__action-badge">requires approval</span>
          </div>
          <pre class="ds-thread-aui__tool-args">rm -rf .turbo && pnpm vitest run --changed</pre>
          <div class="ds-thread-aui__action-buttons">
            <button type="button" class="ds-thread-aui__approve-btn">Approve</button>
            <button type="button" class="ds-thread-aui__reject-btn">Reject</button>
          </div>
        </div>
      </div>
    `;
  } else if (mode === 'long') {
    contentHtml = `
      <div class="ds-thread-aui__msg--user">${QUESTION}</div>
      <div class="ds-thread-aui__msg--assistant">
        <span>Save the draft on every change and restore it when the thread mounts.</span>
        <pre class="ds-thread-aui__tool-args">const aui = useAui();
useEffect(() => {
  const saved = localStorage.getItem(\`draft:\${threadId}\`);
  if (saved) aui.composer.setText(saved);
}, [aui, threadId]);</pre>
        <span>Key the storage entry by thread id so switching threads does not leak a draft into the wrong conversation.</span>
      </div>
      <div class="ds-thread-aui__msg--user">Does that survive a remote thread list switch?</div>
      <div class="ds-thread-aui__msg--assistant">
        <span>Yes, as long as the effect depends on the thread id. The remote thread list remounts the thread body on a switch, so the effect runs again and reads the entry for the new id.</span>
      </div>
    `;
  } else {
    // Default
    contentHtml = `
      <div class="ds-thread-aui__msg--user">${QUESTION}</div>
      <div class="ds-thread-aui__msg--assistant">
        <span>Drafts live on the composer, so the simplest path is to save <code>composer.text</code> whenever it changes and restore it when the thread mounts.</span>
      </div>
    `;
  }

  return `
    <div
      data-slot="thread"
      class="ds-thread-aui"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-thread-aui__viewport" data-slot="thread-viewport">
        ${contentHtml}
      </div>

      <div class="ds-thread-aui__composer-bar">
        <div class="ds-thread-aui__composer-box">
          <button type="button" aria-label="Add attachment" class="ds-thread-aui__composer-attach" data-slot="attach-btn">
            ${PLUS_ICON}
          </button>
          <textarea
            class="ds-thread-aui__composer-input"
            rows="1"
            placeholder="Reply to thread..."
            aria-label="Reply to thread"
            data-slot="composer-input"
          ></textarea>
          <button
            type="button"
            aria-label="Send message"
            class="ds-thread-aui__composer-send"
            data-slot="composer-send"
            disabled
          >
            ${ARROW_UP}
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(threadEl) {
  const viewport = threadEl.querySelector('[data-slot="thread-viewport"]');
  const input = threadEl.querySelector('[data-slot="composer-input"]');
  const sendBtn = threadEl.querySelector('[data-slot="composer-send"]');
  const starterChips = threadEl.querySelectorAll('.ds-thread-aui__starter-chip');

  function sendMessage(text) {
    if (!text.trim()) return;
    const emptyState = viewport.querySelector('[data-slot="empty-state"]');
    if (emptyState) emptyState.remove();

    const userMsg = document.createElement('div');
    userMsg.className = 'ds-thread-aui__msg--user';
    userMsg.textContent = text;
    viewport.appendChild(userMsg);

    // AI placeholder response
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ds-thread-aui__msg--assistant';
    aiMsg.innerHTML = `<span>Understood: "<em>${text}</em>". Processing request in context of current active repository conventions.</span>`;
    viewport.appendChild(aiMsg);

    viewport.scrollTop = viewport.scrollHeight;
    input.value = '';
    sendBtn.disabled = true;
  }

  if (input) {
    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      sendMessage(input.value);
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
    root.innerHTML = renderThread({ mode: 'empty', interactive: true });
    const threadEl = root.querySelector('[data-slot="thread"]');
    if (threadEl) attachInteractiveHandlers(threadEl);
    return root;
  },
};

export const Empty = story(renderThread({ mode: 'empty' }));

export const Streaming = story(renderThread({ mode: 'streaming' }));

export const Error = story(renderThread({ mode: 'error' }));

export const ToolCalls = story(renderThread({ mode: 'tools' }));

export const RequiresAction = story(renderThread({ mode: 'requires-action' }));

export const LongContent = story(renderThread({ mode: 'long' }));
