import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 130 Riverside Loft AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderStayCard({
  title = 'Riverside Loft',
  price = '$142',
  location = 'Alfama · 2 guests · 1 bed',
  rating = '★ 4.9',
  isBooked = false,
  isSoldOut = false,
  interactive = false,
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-stay-card__heading" data-slot="stay-title">${title}</div>
      <div class="ds-gen-stay-photo" data-slot="stay-photo">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-label="Loft interior graphic">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div class="ds-gen-stay-card__meta">
        <span class="ds-gen-stay-card__meta-text">${location}</span>
        <span class="ds-gen-stay-card__rating">${rating}</span>
      </div>
      <div data-slot="action-mount">
        ${
          isBooked
            ? `
          <div class="ds-flex ds-items-center ds-justify-center ds-gap-2 ds-p-2 ds-bg-surface-secondary ds-rounded-lg ds-text-sm ds-text-success" data-slot="confirmation">
            ${CHECK_ICON}
            <span>Reserved! Confirmation #RL-8942 sent</span>
          </div>
        `
            : isSoldOut
              ? `
          <button type="button" class="ds-button ds-button--ghost ds-gen-stay-card__action" disabled>
            Sold out for selected dates
          </button>
        `
              : `
          <button type="button" class="ds-button ds-button--primary ds-gen-stay-card__action" data-action="book-stay">
            Book for ${price}/night
          </button>
        `
        }
      </div>
    </div>
  `;
}

function attachBookingHandler(root) {
  const btn = root.querySelector('[data-action="book-stay"]');
  const mount = root.querySelector('[data-slot="action-mount"]');

  if (btn && mount) {
    btn.addEventListener('click', () => {
      mount.innerHTML = `
        <div class="ds-flex ds-items-center ds-justify-center ds-gap-2 ds-p-2 ds-bg-surface-secondary ds-rounded-lg ds-text-sm ds-text-success" data-slot="confirmation">
          ${CHECK_ICON}
          <span>Reserved! Confirmation #RL-8942 sent</span>
        </div>
      `;
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderStayCard({ interactive: true });
    attachBookingHandler(root);
    return root;
  },
};

export const Booked = story(
  () => renderStayCard({ isBooked: true })
);

export const SoldOut = story(
  () => renderStayCard({ isSoldOut: true })
);

export const LongContent = story(
  () => renderStayCard({
    title: 'Historic Waterfront Penthouse with Panoramic River Tejo Views & Private Terrace',
    price: '$385',
    location: 'Alfama Historical Quarter · 6 guests · 3 bedrooms · 2 baths',
    rating: '★ 4.98 (124 reviews)',
  })
);
