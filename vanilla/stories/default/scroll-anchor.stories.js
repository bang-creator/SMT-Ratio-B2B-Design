import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 90 Scroll anchor',
  parameters: { layout: 'padded' },
};

const ARROW_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`;

const SHORT_MESSAGES = [
  { role: 'user', text: 'Why does the thread jump while streaming?' },
  { role: 'assistant', text: 'The viewport pins to the bottom only while you are already there.' },
];

const DEFAULT_MESSAGES = [
  { role: 'user', text: 'Can you walk me through how the viewport decides whether to follow new content?' },
  { role: 'assistant', text: 'The viewport tracks whether you were at the bottom before each layout change. If you were, it scrolls to the new bottom after the change commits.' },
  { role: 'user', text: 'What about a code block that keeps growing horizontally?' },
  { role: 'assistant', text: 'A growing code block expands the message height, triggering the same bottom pin logic.' },
  { role: 'user', text: 'And if I manually scroll up to read previous turns?' },
  { role: 'assistant', text: 'It pauses auto-scroll and displays a floating pill indicating unread messages.' },
];

const LONG_MESSAGES = [
  {
    role: 'user',
    text: 'Can you walk me through how the viewport decides whether to follow new content, including what happens when an image loads late?',
  },
  {
    role: 'assistant',
    text: 'The viewport tracks whether you were at the bottom before each layout change. If you were, it scrolls to the new bottom after the change commits. A late image counts as a layout change, so it is handled the same way as new tokens. If you had scrolled up, nothing moves and the jump pill takes over once new content lands below the fold.',
  },
  {
    role: 'user',
    text: 'What about a code block that keeps growing horizontally?',
  },
];

function renderScrollAnchor({
  messages = DEFAULT_MESSAGES,
  pinned = false,
  newCount = 2,
} = {}) {
  return `
    <div data-slot="scroll-anchor" class="ds-scroll-anchor">
      <div class="ds-scroll-anchor__top-fade" aria-hidden="true"></div>

      <div data-slot="scroll-anchor-viewport" class="ds-scroll-anchor__viewport">
        ${messages.map((m) => {
          if (m.role === 'user') {
            return `<div data-slot="scroll-anchor-user-message" class="ds-scroll-anchor__user-msg">${m.text}</div>`;
          } else {
            return `<p data-slot="scroll-anchor-assistant-message" class="ds-scroll-anchor__ai-msg">${m.text}</p>`;
          }
        }).join('')}
      </div>

      ${
        !pinned && newCount > 0
          ? `
        <button
          type="button"
          data-slot="scroll-anchor-jump-btn"
          class="ds-scroll-anchor__btn"
          aria-label="${newCount} new messages. Scroll to bottom"
        >
          <span class="ds-scroll-anchor__icon" aria-hidden="true">${ARROW_DOWN}</span>
          <span>${newCount} new ${newCount === 1 ? 'message' : 'messages'}</span>
        </button>
      `
          : ''
      }
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isPinned = false;
    let count = 2;

    const render = () => {
      const badgeText = isPinned ? 'Pinned to Bottom' : `${count} New Messages Below Fold`;

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderScrollAnchor({
              messages: DEFAULT_MESSAGES,
              pinned: isPinned,
              newCount: count,
            })}
          </div>
        </div>
      `;

      const viewport = root.querySelector('[data-slot="scroll-anchor-viewport"]');
      const jumpBtn = root.querySelector('[data-slot="scroll-anchor-jump-btn"]');

      if (isPinned && viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }

      jumpBtn?.addEventListener('click', () => {
        isPinned = true;
        count = 0;
        render();
      });

      viewport?.addEventListener('scroll', () => {
        const atBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 10;
        if (atBottom && !isPinned) {
          isPinned = true;
          count = 0;
          render();
        } else if (!atBottom && isPinned) {
          isPinned = false;
          count = 1;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const Short = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderScrollAnchor({
        messages: SHORT_MESSAGES,
        pinned: true,
        newCount: 0,
      })}
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderScrollAnchor({
        messages: LONG_MESSAGES,
        pinned: false,
        newCount: 3,
      })}
    </div>
  </div>
`);
