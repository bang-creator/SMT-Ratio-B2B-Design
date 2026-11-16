import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 13 Feedback Dialog',
  parameters: { layout: 'padded' },
};

const THUMBS_DOWN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 14V2"></path><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"></path></svg>`;
const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-text-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

const DEFAULT_REASONS = [
  "Don't like the style",
  'Not factually correct',
  "Didn't follow instructions",
  'Refused to answer',
  'Too verbose',
];

function renderFeedbackDialog({
  reasons = DEFAULT_REASONS,
  selected = ['Not factually correct'],
  note = '',
  sent = false,
} = {}) {
  if (sent) {
    return `
      <div data-slot="feedback-dialog" class="ds-feedback-dialog ds-feedback-dialog--sent" title="Click to reset">
        <div role="status" class="ds-flex ds-items-center ds-gap-2">
          ${CHECK_ICON}
          <span>Thanks. That helps us tune the model.</span>
        </div>
      </div>
    `.trim();
  }

  const chipsHtml = reasons
    .map((reason) => {
      const active = selected.includes(reason);
      const activeCls = active ? ' ds-feedback-dialog__chip--active' : '';
      return `<button type="button" class="ds-feedback-dialog__chip${activeCls}" data-reason="${reason}" aria-pressed="${active}">${reason}</button>`;
    })
    .join('');

  return `
    <div data-slot="feedback-dialog" class="ds-feedback-dialog">
      <div class="ds-feedback-dialog__header">
        <span class="ds-feedback-dialog__icon-badge">
          ${THUMBS_DOWN_ICON}
        </span>
        <span class="ds-feedback-dialog__title">What went wrong?</span>
        <span class="font-mono ds-ml-auto">optional</span>
      </div>

      <div class="ds-feedback-dialog__reasons">
        ${chipsHtml}
      </div>

      <textarea rows="2" placeholder="Anything else?" aria-label="Anything else?" class="ds-feedback-dialog__textarea">${note}</textarea>

      <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-btn-submit ds-self-end">
        Send feedback
      </button>
    </div>
  `.trim();
}

/**
 * Default: Interactive Feedback Dialog
 * Select one or more reason chips, type into the note textarea, and click "Send feedback"
 * to transition to the confirmation state. Click the confirmation state to reset.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let selected = ['Not factually correct'];
    let note = '';
    let sent = false;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>13 Feedback Dialog (Interactive Feedback Form)</code></header>
        <div class="ds-feedback-target">
          ${renderFeedbackDialog({ selected, note, sent })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-feedback-target');

    const update = () => {
      target.innerHTML = renderFeedbackDialog({ selected, note, sent });
      bindEvents();
    };

    const bindEvents = () => {
      if (sent) {
        const dialog = target.querySelector('.ds-feedback-dialog--sent');
        if (dialog) {
          dialog.addEventListener('click', () => {
            sent = false;
            update();
          });
        }
        return;
      }

      target.querySelectorAll('.ds-feedback-dialog__chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const reason = chip.getAttribute('data-reason');
          if (reason) {
            if (selected.includes(reason)) {
              selected = selected.filter((r) => r !== reason);
            } else {
              selected.push(reason);
            }
            update();
          }
        });
      });

      const textarea = target.querySelector('.ds-feedback-dialog__textarea');
      if (textarea) {
        textarea.addEventListener('input', (e) => {
          note = e.target.value;
        });
      }

      const submitBtn = target.querySelector('.ds-btn-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          sent = true;
          update();
        });
      }
    };

    bindEvents();
    return root;
  },
};

/**
 * Sent: Static view of confirmed state
 */
export const Sent = story(
  'Default / Application / 13 Feedback Dialog / Sent',
  stage('Sent Confirmation', renderFeedbackDialog({ sent: true }))
);
