import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 71 Schedule Card',
  parameters: { layout: 'padded' },
};

const ICONS = {
  clock: `<svg class="ds-schedule-card__clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  check: `<svg class="ds-schedule-card__icon-ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  x: `<svg class="ds-schedule-card__icon-fail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
};

const DEFAULT_HISTORY = [
  { id: '1', at: 'Today, 06:00', ok: true },
  { id: '2', at: 'Yesterday, 06:00', ok: true },
  { id: '3', at: 'Sat, 06:00', ok: false },
];

function renderScheduleCard({
  name = 'Triage the issue queue',
  cadence = 'every day at 06:00',
  nextRun = 'Tomorrow, 06:00',
  enabled = true,
  history = DEFAULT_HISTORY,
} = {}) {
  const historyHtml = history
    .map(
      (run) => `
    <div class="ds-schedule-card__history-item">
      ${run.ok ? ICONS.check : ICONS.x}
      <span class="ds-schedule-card__history-at">${run.at}</span>
      <span class="ds-schedule-card__history-status">${run.ok ? 'ok' : 'failed'}</span>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="schedule-card" class="ds-schedule-card">
      <div class="ds-schedule-card__header">
        <span class="ds-schedule-card__icon-badge">
          ${ICONS.clock}
        </span>
        <div class="ds-schedule-card__meta">
          <span class="ds-schedule-card__name">${name}</span>
          <span class="ds-schedule-card__cadence">${cadence}</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked="${enabled}"
          aria-label="${enabled ? 'Pause' : 'Resume'} ${name}"
          class="ds-schedule-card__switch"
          data-slot="schedule-switch"
        >
          <span class="ds-schedule-card__switch-thumb"></span>
        </button>
      </div>

      <div class="ds-schedule-card__next ${!enabled ? 'ds-schedule-card__next--paused' : ''}" data-paused="${!enabled}">
        <span class="ds-schedule-card__next-label">next</span>
        <span class="ds-schedule-card__next-val">${enabled ? nextRun : 'paused'}</span>
      </div>

      <div class="ds-schedule-card__history">
        <span class="ds-schedule-card__history-title">recent runs</span>
        ${historyHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isEnabled = true;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderScheduleCard({ enabled: isEnabled })}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="schedule-switch"]')?.addEventListener('click', () => {
        isEnabled = !isEnabled;
        render();
      });
    };

    render();
    return root;
  },
};

export const Paused = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderScheduleCard({
        name: 'Weekly vector reindexing',
        cadence: 'every Sunday at 02:00',
        nextRun: 'paused',
        enabled: false,
        history: [
          { id: '1', at: 'Sun Oct 27, 02:00', ok: true },
          { id: '2', at: 'Sun Oct 20, 02:00', ok: true },
        ],
      })}
    </div>
  </div>
`);
