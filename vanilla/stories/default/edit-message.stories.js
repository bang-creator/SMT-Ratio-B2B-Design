import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 12 Edit Message',
  parameters: { layout: 'padded' },
};

const TRIANGLE_ALERT_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;

function renderEditMessage({
  value = 'Explain how the composer keeps its draft.',
  editing = true,
  discardedReplies = 3,
} = {}) {
  if (!editing) {
    return `
      <div data-slot="edit-message" class="ds-edit-message ds-edit-message--sent">
        <button type="button" class="ds-edit-message__sent-bubble" title="Click message to edit">
          ${value}
        </button>
      </div>
    `.trim();
  }

  const warningHtml = discardedReplies > 0
    ? `
      <div class="ds-edit-message__warning">
        ${TRIANGLE_ALERT_ICON}
        <span>sending starts a new branch; ${discardedReplies} ${discardedReplies === 1 ? 'reply stays' : 'replies stay'} on the old one</span>
      </div>
    `.trim()
    : '';

  return `
    <div data-slot="edit-message" class="ds-edit-message ds-edit-message__card">
      <textarea rows="2" aria-label="Edit your message" class="ds-edit-message__textarea">${value}</textarea>
      ${warningHtml}
      <div class="ds-edit-message__actions">
        <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-btn-cancel">
          Cancel
        </button>
        <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-btn-send">
          Send
        </button>
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Edit Message
 * Natural in-component interaction: Click the sent bubble to open the full editor card;
 * type modifications into the textarea, click Cancel to revert, or click Send to save.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isEditing = true;
    let currentText = 'Explain how the composer keeps its draft.';
    const replies = 3;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>12 Edit Message (Interactive Editor Lifecycle)</code></header>
        <div class="ds-edit-target">
          ${renderEditMessage({ value: currentText, editing: isEditing, discardedReplies: replies })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-edit-target');

    const update = () => {
      target.innerHTML = renderEditMessage({
        value: currentText,
        editing: isEditing,
        discardedReplies: replies,
      });
      bindEvents();
    };

    const bindEvents = () => {
      const bubble = target.querySelector('.ds-edit-message__sent-bubble');
      const cancelBtn = target.querySelector('.ds-btn-cancel');
      const sendBtn = target.querySelector('.ds-btn-send');
      const textarea = target.querySelector('.ds-edit-message__textarea');

      if (bubble) {
        bubble.addEventListener('click', () => {
          isEditing = true;
          update();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          isEditing = false;
          update();
        });
      }

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          if (textarea) currentText = textarea.value;
          isEditing = false;
          update();
        });
      }
    };

    bindEvents();
    return root;
  },
};

/**
 * Sent: Static view of the user message bubble
 */
export const Sent = story(
  'Default / Application / 12 Edit Message / Sent',
  stage('Sent Bubble', renderEditMessage({ editing: false, discardedReplies: 0 }))
);
