import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 136 View event AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderViewEventCard({
  date = 'Friday, July 24',
  title = 'Design review',
  details = '9:00 to 9:30 AM · Conference Room B',
  avatars = ['ER', 'SW', 'JD'],
  status = 'pending', // 'pending' | 'accepted' | 'declined'
} = {}) {
  const avatarHtml = avatars
    .map((a) => `<div class="ds-gen-view-event-card__avatar" data-slot="avatar">${a}</div>`)
    .join('');

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <span class="ds-gen-view-event-card__date">${date}</span>
      <h3 class="ds-gen-view-event-card__title">${title}</h3>
      <span class="ds-gen-view-event-card__details">${details}</span>

      <div class="ds-gen-view-event-card__attendees" data-slot="attendee-list">
        ${avatarHtml}
        <span class="ds-text-xs ds-text-secondary ds-ml-1">${avatars.length} attending</span>
      </div>

      <div class="ds-gen-view-event-card__actions" data-slot="action-mount">
        ${
          status === 'accepted'
            ? `
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
            ${CHECK_ICON}
            <span>You accepted this invitation</span>
          </div>
        `
            : status === 'declined'
              ? `
          <span class="ds-text-xs ds-text-secondary">Invitation declined</span>
        `
              : `
          <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="decline">
            Decline
          </button>
          <button type="button" class="ds-button ds-button--primary ds-button--sm" data-action="accept">
            Accept
          </button>
        `
        }
      </div>
    </div>
  `;
}

function attachRsvpHandler(root) {
  const acceptBtn = root.querySelector('[data-action="accept"]');
  const declineBtn = root.querySelector('[data-action="decline"]');
  const mount = root.querySelector('[data-slot="action-mount"]');

  if (acceptBtn && mount) {
    acceptBtn.addEventListener('click', () => {
      mount.innerHTML = `
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
          ${CHECK_ICON}
          <span>You accepted this invitation</span>
        </div>
      `;
    });
  }

  if (declineBtn && mount) {
    declineBtn.addEventListener('click', () => {
      mount.innerHTML = `<span class="ds-text-xs ds-text-secondary">Invitation declined</span>`;
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderViewEventCard();
    attachRsvpHandler(root);
    return root;
  },
};

export const Accepted = story(
  () => renderViewEventCard({ status: 'accepted' })
);

export const Declined = story(
  () => renderViewEventCard({ status: 'declined' })
);

export const LongContent = story(
  () => renderViewEventCard({
    date: 'Wednesday, August 12 · 2:00 PM to 4:00 PM',
    title: 'Platform Architecture & High-Fidelity Design System Alignment Workshop',
    details: 'Virtual · Google Meet: meet.google.com/xyz-uvwx-qrs · Agenda in doc',
    avatars: ['TB', 'ER', 'SW', 'JD', 'AM', 'PS'],
  })
);
