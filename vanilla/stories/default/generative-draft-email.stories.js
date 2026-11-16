import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 139 Draft email AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const PAPERCLIP_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>`;

function renderDraftEmailCard({
  from = 'me@example.com',
  to = 'sarah.connor@example.com',
  subject = 'Q4 roadmap review',
  body = `Hi Sarah,\n\nFollowing up on our sync earlier today, let me know if Friday works to review the Q4 priorities.\n\nBest,`,
  status = 'draft', // 'draft' | 'sent' | 'discarded'
  attachments = [],
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <h3 class="ds-gen-email-card__title">New message</h3>

      ${
        status === 'sent'
          ? `
        <div class="ds-flex ds-items-center ds-justify-between ds-mt-3 ds-p-3 ds-rounded-md ds-bg-surface-secondary">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
            ${CHECK_ICON}
            <span>Email sent to <strong>${to}</strong></span>
          </div>
          <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="undo-send">
            Undo
          </button>
        </div>
      `
          : `
        <form class="ds-flex ds-flex-col ds-gap-3 ds-mt-2" data-slot="email-form" onsubmit="return false;">
          <div class="ds-gen-email-card__row">
            <span class="ds-gen-email-card__label ds-gen-email-card__label--inline">From:</span>
            <span class="ds-gen-email-card__static">${from}</span>
          </div>

          <div class="ds-gen-email-card__row">
            <label for="email-to-input" class="ds-gen-email-card__label ds-gen-email-card__label--inline">To:</label>
            <input id="email-to-input" type="email" class="ds-gen-email-card__input" data-slot="input-to" placeholder="recipient@example.com" value="${to}">
          </div>

          <div class="ds-gen-email-card__field">
            <label for="email-subject-input" class="ds-gen-email-card__label">Subject</label>
            <input id="email-subject-input" type="text" class="ds-gen-email-card__input" data-slot="input-subject" placeholder="Subject" value="${subject}">
          </div>

          <div class="ds-gen-email-card__field">
            <label for="email-body-input" class="ds-gen-email-card__label">Message</label>
            <textarea id="email-body-input" rows="4" class="ds-gen-email-card__textarea" data-slot="input-body" placeholder="Write your message...">${body}</textarea>
          </div>

          ${
            attachments.length > 0
              ? `
            <div class="ds-flex ds-flex-wrap ds-gap-2 ds-pt-1">
              ${attachments
                .map(
                  (att) => `
                <div class="ds-badge ds-badge--subtle ds-badge--sm ds-flex ds-items-center ds-gap-1">
                  ${PAPERCLIP_ICON}
                  <span>${att.name}</span>
                  <span class="ds-text-secondary">(${att.size})</span>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }

          <div class="ds-gen-email-card__actions">
            <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="discard">Discard</button>
            <button type="submit" class="ds-button ds-button--primary ds-button--sm" data-action="send">Send email</button>
          </div>
        </form>
      `
      }
    </div>
  `;
}

function attachEmailHandler(root) {
  const form = root.querySelector('[data-slot="email-form"]');
  const card = root.querySelector('[data-slot="generative-card"]');
  if (!form || !card) return;

  const toInput = form.querySelector('[data-slot="input-to"]');
  const sendBtn = form.querySelector('[data-action="send"]');
  const discardBtn = form.querySelector('[data-action="discard"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const recipient = toInput ? toInput.value : 'sarah.connor@example.com';
    card.innerHTML = `
      <h3 class="ds-gen-email-card__title">New message</h3>
      <div class="ds-flex ds-items-center ds-justify-between ds-mt-3 ds-p-3 ds-rounded-md ds-bg-surface-secondary">
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
          ${CHECK_ICON}
          <span>Email sent to <strong>${recipient}</strong></span>
        </div>
        <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="undo-send">
          Undo
        </button>
      </div>
    `;

    const undoBtn = card.querySelector('[data-action="undo-send"]');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        card.parentElement.innerHTML = renderDraftEmailCard({ to: recipient });
        attachEmailHandler(root);
      });
    }
  });

  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      card.innerHTML = `
        <h3 class="ds-gen-email-card__title">New message</h3>
        <div class="ds-flex ds-items-center ds-justify-between ds-mt-3 ds-p-3 ds-rounded-md ds-bg-surface-secondary">
          <span class="ds-text-xs ds-text-secondary">Draft discarded</span>
          <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="restore">
            Restore
          </button>
        </div>
      `;
      const restoreBtn = card.querySelector('[data-action="restore"]');
      if (restoreBtn) {
        restoreBtn.addEventListener('click', () => {
          card.parentElement.innerHTML = renderDraftEmailCard();
          attachEmailHandler(root);
        });
      }
    });
  }
}

export const Default = story(
  () => stage(renderDraftEmailCard()),
  { postRender: attachEmailHandler }
);

export const Sent = story(() =>
  stage(
    renderDraftEmailCard({
      status: 'sent',
      to: 'alex.v@platform.openai.com',
    })
  )
);

export const WithAttachments = story(() =>
  stage(
    renderDraftEmailCard({
      to: 'team-design@openai.com',
      subject: 'Updated Token Specs & Handoff Checklist',
      attachments: [
        { name: 'tokens-v2.json', size: '24 KB' },
        { name: 'HANDOFF.pdf', size: '1.2 MB' },
      ],
    })
  )
);

export const LongBody = story(() =>
  stage(
    renderDraftEmailCard({
      to: 'leadership-sync@example.com',
      subject: 'Executive Summary: Design System Component Refactor Milestone 3',
      body: `Hi Leadership Team,\n\nWe are pleased to report that the component refactor across all application fixtures has successfully reached 90% completion.\n\nKey accomplishments:\n- 100% tokenized color hierarchy with zero hardcoded literals.\n- Full composition with Shared atomics (.ds-button, .ds-badge, .ds-input).\n- Rigorous Playwright and Chrome verification with zero console regressions.\n\nNext steps include the final validation suite.\n\nSincerely,\nDesign System Core Team`,
    })
  )
);
