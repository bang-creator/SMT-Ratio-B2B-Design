import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 138 Ride status AUI',
  parameters: { layout: 'padded' },
};

const MAP_PIN = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
const CAR_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.1 2 11.5V16c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`;

function renderRideStatusCard({
  eta = 'Arriving in 4 min',
  vehicle = 'Toyota Camry · ABC 1234',
  address = '123 Market St',
  driver = 'Alex',
  rating = '4.98 ★',
  status = 'active', // 'active' | 'cancelled' | 'arriving'
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <h3 class="ds-gen-ride-card__eta" data-slot="eta">${eta}</h3>
        ${
          status === 'active' || status === 'arriving'
            ? `<span class="ds-badge ds-badge--primary ds-badge--sm"><span class="ds-beacon ds-beacon--online"></span> En route</span>`
            : `<span class="ds-badge ds-badge--danger ds-badge--sm">Cancelled</span>`
        }
      </div>
      <span class="ds-gen-ride-card__vehicle">${vehicle}</span>
      <div class="ds-gen-ride-card__divider"></div>
      <div class="ds-gen-ride-card__grid">
        <div class="ds-gen-ride-card__pickup">
          <div class="ds-gen-ride-card__pin-icon">
            ${MAP_PIN}
          </div>
          <div class="ds-gen-ride-card__meta">
            <span class="ds-gen-ride-card__label">Pick up</span>
            <span class="ds-gen-ride-card__value">${address}</span>
          </div>
        </div>
        <div class="ds-gen-ride-card__driver">
          <span class="ds-gen-ride-card__label">Driver</span>
          <span class="ds-gen-ride-card__value">${driver} · <span class="ds-gen-ride-card__rating">${rating}</span></span>
        </div>
      </div>

      <div class="ds-flex ds-items-center ds-justify-end ds-gap-2 ds-mt-3 ds-pt-2" data-slot="actions">
        ${
          status === 'cancelled'
            ? `<span class="ds-text-xs ds-text-secondary">Ride was cancelled. No fee charged.</span>`
            : `
          <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="cancel">
            Cancel ride
          </button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-action="contact">
            Contact driver
          </button>
        `
        }
      </div>
    </div>
  `;
}

function attachRideHandler(root) {
  const cancelBtn = root.querySelector('[data-action="cancel"]');
  const contactBtn = root.querySelector('[data-action="contact"]');
  const etaEl = root.querySelector('[data-slot="eta"]');
  const actionsEl = root.querySelector('[data-slot="actions"]');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      etaEl.textContent = 'Ride cancelled';
      actionsEl.innerHTML = `<span class="ds-text-xs ds-text-secondary">Ride was cancelled. No fee charged.</span>`;
      const badge = root.querySelector('.ds-badge');
      if (badge) {
        badge.className = 'ds-badge ds-badge--danger ds-badge--sm';
        badge.textContent = 'Cancelled';
      }
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      contactBtn.textContent = 'Calling driver...';
      contactBtn.disabled = true;
    });
  }
}

export const Default = story(
  () => stage(renderRideStatusCard()),
  { postRender: attachRideHandler }
);

export const ArrivingNow = story(() =>
  stage(
    renderRideStatusCard({
      eta: 'Arriving now (1 min)',
      vehicle: 'Tesla Model 3 · 8XYZ901',
      address: 'Terminal 2, Door 4 (Departures)',
      driver: 'Maria S.',
      rating: '4.99 ★',
      status: 'arriving',
    })
  )
);

export const Cancelled = story(() =>
  stage(
    renderRideStatusCard({
      eta: 'Ride cancelled',
      vehicle: 'Toyota Camry · ABC 1234',
      address: '123 Market St',
      driver: 'Alex',
      rating: '4.98 ★',
      status: 'cancelled',
    })
  )
);

export const LongDetails = story(() =>
  stage(
    renderRideStatusCard({
      eta: 'Arriving in 12 min (Heavy traffic)',
      vehicle: 'Mercedes-Benz Sprinter Van (XL) · CAL-994821',
      address: 'San Francisco International Airport, International Terminal G, Curbside Pickup Zone 3B',
      driver: 'Christopher Alexander-Montgomery',
      rating: '5.0 ★ (1,240 trips)',
    })
  )
);
