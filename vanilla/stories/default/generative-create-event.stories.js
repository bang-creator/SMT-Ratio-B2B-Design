import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 135 Create event AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

const DEFAULT_EVENTS = [
  { title: 'Design review', time: '9:00 to 9:30 AM', category: 'work', bar: 'primary' },
  { title: 'Lunch with Sam', time: '12:30 to 1:30 PM', category: 'personal', bar: 'warning' },
  { title: 'Flight to Tokyo', time: '6:45 PM', category: 'travel', bar: 'success' },
];

function renderCreateEventCard({
  day = '24',
  month = 'July',
  weekday = 'Friday',
  events = DEFAULT_EVENTS,
  isAdded = false,
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-event-card__date-header">
        <span class="ds-gen-event-card__day-num">${day}</span>
        <div class="ds-gen-event-card__date-meta">
          <span class="ds-gen-event-card__month">${month}</span>
          <span class="ds-gen-event-card__weekday">${weekday}</span>
        </div>
      </div>

      <div class="ds-gen-event-card__divider"></div>

      <div class="ds-gen-event-card__schedule" data-slot="schedule-list">
        ${
          events.length === 0
            ? `
          <div class="ds-text-xs ds-text-secondary ds-p-3 ds-text-center">
            No events scheduled for this day. Enjoy your free time!
          </div>
        `
            : events
                .map(
                  (e) => `
          <div class="ds-gen-event-card__row">
            <div class="ds-gen-event-card__row-main">
              <div class="ds-gen-event-card__bar ds-gen-event-card__bar--${e.bar}"></div>
              <div class="ds-gen-event-card__details">
                <span class="ds-gen-event-card__event-title">${e.title}</span>
                <span class="ds-gen-event-card__event-time">${e.time}</span>
              </div>
            </div>
            <span class="ds-gen-event-card__badge ds-gen-event-card__badge--${e.category}">
              ${e.category.charAt(0).toUpperCase() + e.category.slice(1)}
            </span>
          </div>
        `,
                )
                .join('')
        }
      </div>

      <div class="ds-gen-event-card__actions" data-slot="action-mount">
        ${
          isAdded
            ? `
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
            ${CHECK_ICON}
            <span>Events added to your calendar!</span>
          </div>
        `
            : `
          <button type="button" class="ds-button ds-button--ghost">Discard</button>
          <button type="button" class="ds-button ds-button--primary" data-action="add-calendar">
            Add to calendar
          </button>
        `
        }
      </div>
    </div>
  `;
}

function attachEventHandler(root) {
  const btn = root.querySelector('[data-action="add-calendar"]');
  const mount = root.querySelector('[data-slot="action-mount"]');

  if (btn && mount) {
    btn.addEventListener('click', () => {
      mount.innerHTML = `
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-xs ds-text-success">
          ${CHECK_ICON}
          <span>Events added to your calendar!</span>
        </div>
      `;
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderCreateEventCard();
    attachEventHandler(root);
    return root;
  },
};

export const Added = story(
  () => renderCreateEventCard({ isAdded: true })
);

export const EmptySchedule = story(
  () => renderCreateEventCard({
    day: '25',
    weekday: 'Saturday',
    events: [],
  })
);

export const LongContent = story(
  () => renderCreateEventCard({
    events: [
      { title: 'Morning standup', time: '8:30 to 9:00 AM', category: 'work', bar: 'primary' },
      { title: 'Design system sync & token review', time: '9:30 to 10:30 AM', category: 'work', bar: 'primary' },
      { title: 'Lunch with engineering team', time: '12:00 to 1:00 PM', category: 'personal', bar: 'warning' },
      { title: 'Customer feedback interview', time: '2:30 to 3:15 PM', category: 'work', bar: 'primary' },
      { title: 'Flight UA 872 to Tokyo Narita', time: '6:45 PM', category: 'travel', bar: 'success' },
    ],
  })
);
