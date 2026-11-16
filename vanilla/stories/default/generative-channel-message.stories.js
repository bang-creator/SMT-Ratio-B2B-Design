import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 142 Channel message AUI',
  parameters: { layout: 'padded' },
};

function renderChannelMessage({
  channel = '#product-updates',
  time = 'Today at 2:14 PM',
  author = 'Jordan Lee',
  avatar = 'JL',
  intro = 'Shipping three things this week:',
  items = [
    'Faster search across the whole workspace',
    'Dark mode for the mobile app',
    'A refreshed onboarding flow',
  ],
  reactions = [
    { emoji: '🎉', count: 12, active: false },
    { emoji: '🚀', count: 5, active: false },
    { emoji: '❤️', count: 3, active: false },
  ],
  edited = false,
  threadReplies = 0,
} = {}) {
  const itemsHtml = items.map((it) => `<li class="ds-gen-msg-card__list-item">${it}</li>`).join('');
  const reactionsHtml = reactions
    .map(
      (r, idx) => `
    <button type="button" class="ds-gen-msg-card__reaction ${r.active ? 'is-active' : ''}" data-action="toggle-reaction" data-index="${idx}" aria-label="React with ${r.emoji}">
      <span>${r.emoji}</span>
      <span class="ds-reaction-count">${r.count}</span>
    </button>
  `
    )
    .join('');

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-msg-card__header">
        <span class="ds-gen-msg-card__channel">${channel}</span>
        <span class="ds-gen-msg-card__time">${time} ${edited ? '(edited)' : ''}</span>
      </div>

      <div class="ds-gen-msg-card__author">
        <div class="ds-gen-msg-card__avatar">
          <span>${avatar}</span>
        </div>
        <span class="ds-gen-msg-card__author-name">${author}</span>
      </div>

      <div class="ds-gen-msg-card__body">
        <p class="ds-gen-msg-card__p">${intro}</p>
        <ol class="ds-gen-msg-card__list">
          ${itemsHtml}
        </ol>
        <p class="ds-gen-msg-card__p">Let us know what you think!</p>
      </div>

      <div class="ds-gen-msg-card__footer">
        <div class="ds-flex ds-items-center ds-gap-2" data-slot="reactions-container">
          ${reactionsHtml}
        </div>
        <div class="ds-flex ds-items-center ds-gap-2">
          ${
            threadReplies > 0
              ? `<span class="ds-text-xs ds-text-secondary">${threadReplies} replies</span>`
              : ''
          }
          <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="reply">
            Reply
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachChannelMessageHandler(root) {
  root.querySelectorAll('[data-action="toggle-reaction"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const countEl = btn.querySelector('.ds-reaction-count');
      const isActive = btn.classList.toggle('is-active');
      let count = parseInt(countEl.textContent, 10);
      countEl.textContent = isActive ? count + 1 : count - 1;
    });
  });

  const replyBtn = root.querySelector('[data-action="reply"]');
  if (replyBtn) {
    replyBtn.addEventListener('click', () => {
      replyBtn.textContent = 'Replying...';
      replyBtn.disabled = true;
    });
  }
}

export const Default = story(
  () => stage(renderChannelMessage()),
  { postRender: attachChannelMessageHandler }
);

export const WithThreadReplies = story(() =>
  stage(
    renderChannelMessage({
      threadReplies: 7,
      time: 'Yesterday at 4:30 PM',
      reactions: [
        { emoji: '🎉', count: 18, active: true },
        { emoji: '🔥', count: 9, active: false },
      ],
    })
  )
);

export const Edited = story(() =>
  stage(
    renderChannelMessage({
      edited: true,
      time: '10:15 AM',
      intro: 'Updated deployment announcement with hotfix details:',
      items: [
        'Resolved Safari WebSocket disconnection regression',
        'Updated cache headers for static CDN assets',
      ],
    })
  )
);

export const LongContent = story(() =>
  stage(
    renderChannelMessage({
      channel: '#engineering-all',
      author: 'Marcus Vance',
      avatar: 'MV',
      intro: 'Full changelog summary for release 2.4.0 (Deployment candidate):',
      items: [
        'Zero-literal strict token compliance verified across all 151 application stories',
        'Added translucent opacity hover for all ghost controls across any background surface',
        'Full Storybook catalog integration with Playwright test verification',
        'Performance optimization of DOM reconciliation loop reducing paint times by 40%',
        'Extended keyboard navigation shortcuts with a11y focus rings',
      ],
      reactions: [
        { emoji: '🚀', count: 42, active: true },
        { emoji: '👏', count: 31, active: false },
        { emoji: '🙌', count: 16, active: false },
      ],
      threadReplies: 14,
    })
  )
);
