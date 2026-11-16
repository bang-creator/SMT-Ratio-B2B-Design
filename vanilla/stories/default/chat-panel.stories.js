import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 88 Chat panel',
  parameters: { layout: 'padded' },
};

const ARROW_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;

const QUESTION = 'Why did my draft disappear?';
const ANSWER =
  'Drafts were living in component state, so switching threads reset them. The runtime now keys every draft by thread id and restores it when you come back.';

const LONG_TURNS = [
  { role: 'user', text: QUESTION },
  { role: 'assistant', text: ANSWER },
  { role: 'user', text: 'Does that cover threads loaded from the server?' },
  { role: 'assistant', text: 'Yes. Remote threads use the same key, so a draft written before a reload comes back once the thread list hydrates.' },
  { role: 'user', text: 'And if two tabs edit the same thread?' },
  { role: 'assistant', text: 'The last write wins. Each tab saves on blur, so the tab you leave last sets the draft the other one sees.' },
];

function renderChatPanel({
  turns = [{ role: 'user', text: QUESTION }, { role: 'assistant', text: ANSWER }],
  isTyping = false,
  placeholder = 'Message',
  sendDisabled = false,
} = {}) {
  return `
    <div data-slot="chat-panel" class="ds-chat-panel">
      <div data-slot="chat-panel-messages" class="ds-chat-panel__messages">
        ${turns.map((t) => {
          if (t.role === 'user') {
            return `<div data-slot="chat-panel-user-message" class="ds-chat-panel__user-msg">${t.text}</div>`;
          } else {
            return `<p data-slot="chat-panel-assistant-message" class="ds-chat-panel__ai-msg">${t.text}</p>`;
          }
        }).join('')}
        ${
          isTyping
            ? `
          <div data-slot="chat-panel-typing" class="ds-chat-panel__typing" aria-label="Assistant is typing">
            <span class="ds-chat-panel__typing-dot"></span>
            <span class="ds-chat-panel__typing-dot"></span>
            <span class="ds-chat-panel__typing-dot"></span>
          </div>
        `
            : ''
        }
      </div>

      <div data-slot="chat-panel-composer" class="ds-chat-panel__composer">
        <input
          type="text"
          class="ds-chat-panel__input"
          placeholder="${placeholder}"
          aria-label="${placeholder}"
          data-slot="composer-input"
        />
        <button
          type="button"
          aria-label="Send"
          class="ds-chat-panel__send-btn"
          ${sendDisabled ? 'disabled' : ''}
          data-slot="send-btn"
        >
          ${ARROW_UP}
        </button>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let turns = [
      { role: 'user', text: QUESTION },
      { role: 'assistant', text: ANSWER },
    ];
    let isTyping = false;

    const render = () => {
      const badgeText = isTyping
        ? 'Assistant Typing...'
        : `${turns.length} message${turns.length > 1 ? 's' : ''}`;

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">88 Chat panel</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderChatPanel({
              turns,
              isTyping,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="composer-input"]');
      const sendBtn = root.querySelector('[data-slot="send-btn"]');
      const messagesContainer = root.querySelector('[data-slot="chat-panel-messages"]');

      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      function handleSend() {
        const val = input?.value.trim();
        if (!val || isTyping) return;
        turns.push({ role: 'user', text: val });
        isTyping = true;
        render();

        setTimeout(() => {
          isTyping = false;
          turns.push({
            role: 'assistant',
            text: `Processed: "${val}". Memory synchronized successfully.`,
          });
          render();
        }, 500);
      }

      sendBtn?.addEventListener('click', handleSend);
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
      });
    };

    render();
    return root;
  },
};

export const Empty = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">88 Chat panel (Empty)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Fresh Thread</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderChatPanel({ turns: [] })}
    </div>
  </div>
`);

export const Typing = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">88 Chat panel (Typing)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Generating Response</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderChatPanel({
        turns: [{ role: 'user', text: QUESTION }],
        isTyping: true,
      })}
    </div>
  </div>
`);

export const LongThread = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">88 Chat panel (Long Thread)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Scroll Overflow</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderChatPanel({
        turns: LONG_TURNS,
        isTyping: false,
      })}
    </div>
  </div>
`);
