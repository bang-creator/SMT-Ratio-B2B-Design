import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 133 Flight tracker AUI',
  parameters: { layout: 'padded' },
};

const PLANE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>`;

function renderFlightTracker({
  airline = 'United · UA 872',
  status = 'On time',
  statusVariant = 'success', // 'success' | 'warning'
  origin = 'SFO',
  dest = 'NRT',
  progressClass = 'ds-gen-flight-card__progress--62',
  elapsed = '6h 40m elapsed',
  remaining = '4h 10m remaining',
  telemetry = 'Alt: 36,000 ft · Speed: 540 mph · Boeing 777-300ER',
} = {}) {
  const badgeClass = statusVariant === 'warning'
    ? 'ds-gen-flight-card__badge ds-text-danger ds-bg-surface-secondary'
    : 'ds-gen-flight-card__badge';

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-flight-card__header">
        <span class="ds-gen-flight-card__airline">${airline}</span>
        <span class="${badgeClass}">${status}</span>
      </div>

      <div class="ds-gen-flight-card__route">
        <span class="ds-gen-flight-card__city-code">${origin}</span>
        <div class="ds-gen-flight-card__plane-icon">
          ${PLANE_ICON}
        </div>
        <span class="ds-gen-flight-card__city-code">${dest}</span>
      </div>

      <div class="ds-gen-flight-card__track">
        <div class="ds-gen-flight-card__progress ${progressClass}"></div>
      </div>

      <div class="ds-gen-flight-card__times">
        <span>${elapsed}</span>
        <span>${remaining}</span>
      </div>

      <div class="ds-flex ds-items-center ds-justify-between ds-border-t ds-border-subtle ds-pt-2">
        <span class="ds-text-xs ds-text-secondary" data-slot="telemetry-info">${telemetry}</span>
        <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="toggle-details">
          Details
        </button>
      </div>

      <div class="ds-hidden ds-p-2 ds-bg-surface-secondary ds-rounded ds-text-xs ds-text-secondary" data-slot="extra-details">
        Departure gate: 42B · Arrival terminal: T1 · Seat: 14A · In-flight WiFi: Active
      </div>
    </div>
  `;
}

function attachFlightHandler(root) {
  const btn = root.querySelector('[data-action="toggle-details"]');
  const details = root.querySelector('[data-slot="extra-details"]');
  if (btn && details) {
    btn.addEventListener('click', () => {
      details.classList.toggle('ds-hidden');
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderFlightTracker();
    attachFlightHandler(root);
    return root;
  },
};

export const Boarding = story(
  () => renderFlightTracker({
    status: 'Boarding',
    progressClass: 'ds-gen-flight-card__progress--0',
    elapsed: 'Scheduled: 11:30 AM',
    remaining: 'Gate closes in 15m',
    telemetry: 'Gate 42B · Group 2 boarding now',
  })
);

export const Landed = story(
  () => renderFlightTracker({
    status: 'Arrived',
    progressClass: 'ds-gen-flight-card__progress--100',
    elapsed: '10h 50m flight time',
    remaining: 'Landed at 3:20 PM',
    telemetry: 'Arrived Gate 21 · Baggage carousel 4',
  })
);

export const Delayed = story(
  () => renderFlightTracker({
    status: 'Delayed 45m',
    statusVariant: 'warning',
    progressClass: 'ds-gen-flight-card__progress--15',
    elapsed: 'Air traffic hold',
    remaining: 'New arrival: 4:05 PM',
    telemetry: 'Holding pattern due to inbound congestion',
  })
);
