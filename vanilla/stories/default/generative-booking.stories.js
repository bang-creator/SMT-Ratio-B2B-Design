import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 131 Table reservation AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderBookingCard({
  name = 'Elena Rostova',
  guests = '2',
  date = '2026-11-20',
  seating = 'indoor',
  reminder = true,
  isConfirmed = false,
  isFullyBooked = false,
  note = '',
} = {}) {
  if (isConfirmed) {
    return `
      <div class="ds-generative-card" data-slot="generative-card">
        <div class="ds-gen-booking-card__header">
          <h3 class="ds-gen-booking-card__title">Reservation confirmed</h3>
          <span class="ds-gen-booking-card__subtitle">We look forward to welcoming you!</span>
        </div>
        <div class="ds-flex ds-items-center ds-gap-2 ds-p-3 ds-bg-surface-secondary ds-rounded-lg ds-text-sm ds-text-success">
          ${CHECK_ICON}
          <span>Table reserved for ${name} (${guests} guests, ${seating})</span>
        </div>
        <div class="ds-text-xs ds-text-secondary">
          Date: ${date} · Confirmation #RES-5819 · Reminder active
        </div>
      </div>
    `;
  }

  return `
    <form class="ds-generative-card" data-slot="generative-card" onsubmit="return false;">
      <div class="ds-gen-booking-card__header">
        <h3 class="ds-gen-booking-card__title">Reserve a table</h3>
        <span class="ds-gen-booking-card__subtitle">We hold the table for 15 minutes past the reserved time.</span>
      </div>

      ${
        note
          ? `
        <div class="ds-p-2 ds-bg-surface-secondary ds-rounded ds-text-xs ds-text-secondary">
          ${note}
        </div>
      `
          : ''
      }

      <div class="ds-gen-booking-card__field">
        <label class="ds-gen-booking-card__label" for="booking-name">Name</label>
        <input id="booking-name" type="text" class="ds-gen-booking-card__input" placeholder="Full name" value="${name}">
      </div>

      <div class="ds-gen-booking-card__field">
        <label class="ds-gen-booking-card__label" for="booking-party">Party size</label>
        <select id="booking-party" class="ds-gen-booking-card__input">
          <option value="1" ${guests === '1' ? 'selected' : ''}>1 guest</option>
          <option value="2" ${guests === '2' ? 'selected' : ''}>2 guests</option>
          <option value="3" ${guests === '3' ? 'selected' : ''}>3 guests</option>
          <option value="4" ${guests === '4' ? 'selected' : ''}>4 guests</option>
          <option value="8" ${guests === '8' ? 'selected' : ''}>8+ guests (Private dining)</option>
        </select>
      </div>

      <div class="ds-gen-booking-card__field">
        <label class="ds-gen-booking-card__label" for="booking-date">Date</label>
        <input id="booking-date" type="date" class="ds-gen-booking-card__input" value="${date}">
      </div>

      <div class="ds-gen-booking-card__field">
        <span class="ds-gen-booking-card__label">Seating preference</span>
        <div class="ds-gen-booking-card__options">
          <label class="ds-gen-booking-card__radio-label">
            <input type="radio" name="seating" value="indoor" ${seating === 'indoor' ? 'checked' : ''}>
            <span>Indoor</span>
          </label>
          <label class="ds-gen-booking-card__radio-label">
            <input type="radio" name="seating" value="patio" ${seating === 'patio' ? 'checked' : ''}>
            <span>Patio</span>
          </label>
        </div>
      </div>

      <label class="ds-gen-booking-card__checkbox-label">
        <input type="checkbox" ${reminder ? 'checked' : ''} class="ds-checkbox">
        <span>Send a reminder 1 hour before</span>
      </label>

      <div class="ds-gen-booking-card__actions" data-slot="actions">
        <button type="button" class="ds-button ds-button--ghost">Cancel</button>
        <button
          type="submit"
          class="ds-button ds-button--primary"
          data-action="confirm-booking"
          ${isFullyBooked ? 'disabled' : ''}
        >
          ${isFullyBooked ? 'Fully booked' : 'Confirm reservation'}
        </button>
      </div>
    </form>
  `;
}

function attachFormHandler(root) {
  const form = root.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#booking-name')?.value || 'Guest';
      const guests = form.querySelector('#booking-party')?.value || '2';
      const date = form.querySelector('#booking-date')?.value || '2026-11-20';
      const seating = form.querySelector('input[name="seating"]:checked')?.value || 'indoor';
      root.innerHTML = renderBookingCard({
        name,
        guests,
        date,
        seating,
        isConfirmed: true,
      });
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderBookingCard();
    attachFormHandler(root);
    return root;
  },
};

export const Confirmed = story(
  () => renderBookingCard({ isConfirmed: true })
);

export const FullyBooked = story(
  () => renderBookingCard({
    date: '2026-12-31',
    isFullyBooked: true,
    note: 'New Year Eve seating is fully committed. Please select another date.',
  })
);

export const LargeParty = story(
  () => renderBookingCard({
    guests: '8',
    note: 'Parties of 8 or more will be seated in the private wine room with our tasting menu.',
  })
);
