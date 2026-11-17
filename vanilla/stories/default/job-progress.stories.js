import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 55 Job Progress',
  parameters: { layout: 'padded' },
};

const ICONS = {
  spinner: `<svg class="ds-job-progress__icon ds-job-progress__icon--running" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
  check: `<svg class="ds-job-progress__icon ds-job-progress__icon--success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  failed: `<svg class="ds-job-progress__icon ds-job-progress__icon--failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  cancelled: `<svg class="ds-job-progress__icon ds-job-progress__icon--cancelled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>`,
  cancelBtn: `<svg class="ds-job-progress__cancel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
};

function renderJobCard(s) {
  return `
    <div data-slot="job-progress" data-state="${s.state}" class="ds-job-progress" role="region" aria-label="Job progress card">
      <div class="ds-job-progress__header">
        ${s.icon}
        <span class="ds-job-progress__title">Verify the fix on CI</span>
        <span class="ds-job-progress__meta">${s.meta}</span>
        ${s.state === 'running' ? `<button type="button" aria-label="Cancel the job" class="ds-job-progress__cancel" data-cancel-btn>${ICONS.cancelBtn}</button>` : ''}
      </div>

      <div role="progressbar" aria-label="Verify the fix on CI progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.pct}" class="ds-job-progress__track">
        <span class="ds-job-progress__bar ${s.barClass}" data-pct="${s.pct}"></span>
      </div>

      <div class="ds-job-progress__body">
        <div class="ds-job-progress__stages">
          <span class="ds-job-progress__stage ${s.activeStage === 0 ? 'ds-job-progress__stage--active' : ''}">clone</span>
          <span class="ds-job-progress__stage ${s.activeStage === 1 ? 'ds-job-progress__stage--active' : ''}">install</span>
          <span class="ds-job-progress__stage ${s.activeStage === 2 ? 'ds-job-progress__stage--active' : ''}">build</span>
          <span class="ds-job-progress__stage ${s.activeStage === 3 ? 'ds-job-progress__stage--active' : ''}">test</span>
        </div>
        <p class="ds-job-progress__description">${s.desc}</p>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const STAGES_FLOW = [
      {
        state: 'running',
        pct: '20',
        meta: 'about 3 min',
        activeStage: 0,
        desc: 'Fetching the branch from remote...',
        icon: ICONS.spinner,
        barClass: '',
      },
      {
        state: 'running',
        pct: '65',
        meta: 'about 1 min',
        activeStage: 2,
        desc: 'Compiling packages with turbopack...',
        icon: ICONS.spinner,
        barClass: '',
      },
      {
        state: 'success',
        pct: '100',
        meta: 'done',
        activeStage: 3,
        desc: 'All 412 unit and integration tests passed.',
        icon: ICONS.check,
        barClass: 'ds-job-progress__bar--success',
      },
    ];

    let current = 1;
    let isCancelled = false;

    const render = () => {
      let stateObj;
      if (isCancelled) {
        stateObj = {
          state: 'cancelled',
          pct: '65',
          meta: 'cancelled',
          activeStage: -1,
          desc: 'Job was cancelled by the user. Click card to resume.',
          icon: ICONS.cancelled,
          barClass: 'ds-job-progress__bar--cancelled',
        };
      } else {
        stateObj = STAGES_FLOW[current];
      }

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderJobCard(stateObj)}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-job-progress');
      card?.addEventListener('click', (e) => {
        const cancelBtn = e.target.closest('[data-cancel-btn]');
        if (cancelBtn) {
          e.stopPropagation();
          isCancelled = true;
          render();
          return;
        }
        if (isCancelled) {
          isCancelled = false;
        } else {
          current = (current + 1) % STAGES_FLOW.length;
        }
        render();
      });
    };

    render();
    return root;
  },
};

export const Failed = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderJobCard({
        state: 'failed',
        pct: '40',
        meta: 'failed',
        activeStage: 1,
        desc: 'Dependency installation failed: ERESOLVE peer conflict in react-dom.',
        icon: ICONS.failed,
        barClass: 'ds-job-progress__bar--failed',
      })}
    </div>
  </div>
`);
