import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 69 Background Inbox',
  parameters: { layout: 'padded' },
};

const ICONS = {
  spinner: `<svg class="ds-background-inbox__icon ds-background-inbox__icon--running" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`,
  check: `<svg class="ds-background-inbox__icon ds-background-inbox__icon--ready" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  x: `<svg class="ds-background-inbox__icon ds-background-inbox__icon--failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
};

function renderBackgroundInbox({
  runs = [],
  hasCollect = true,
} = {}) {
  const readyCount = runs.filter((r) => r.state === 'ready').length;
  const runningCount = runs.filter((r) => r.state === 'running').length;

  const counterText = readyCount > 0 ? `${readyCount} ready` : runs.length > 0 ? `${runningCount} in flight` : 'all collected';
  const isReady = readyCount > 0;

  let itemsHtml = '';
  if (runs.length === 0) {
    itemsHtml = `
      <div class="ds-text-xs ds-text-secondary ds-background-inbox__empty">
        No background runs remaining. Click card to reload.
      </div>
    `;
  } else {
    itemsHtml = runs
      .map((run) => {
        const icon =
          run.state === 'running'
            ? ICONS.spinner
            : run.state === 'failed'
              ? ICONS.x
              : ICONS.check;

        const summaryHtml = run.summary
          ? `<span class="ds-background-inbox__item-summary">${run.summary}</span>`
          : '';

        const content = `
          <span class="ds-background-inbox__icon-wrap">${icon}</span>
          <span class="ds-background-inbox__content">
            <span class="ds-background-inbox__item-title">${run.title}</span>
            ${summaryHtml}
          </span>
          <span class="ds-background-inbox__elapsed">${run.elapsed}</span>
        `;

        if (hasCollect) {
          return `
            <button type="button"
              class="ds-background-inbox__item"
              data-slot="inbox-item"
              data-run-id="${run.id}"
              data-state="${run.state}"
              ${run.state === 'running' ? 'disabled' : ''}>
              ${content}
            </button>
          `;
        }

        return `
          <div class="ds-background-inbox__item"
            data-slot="inbox-item"
            data-run-id="${run.id}"
            data-state="${run.state}">
            ${content}
          </div>
        `;
      })
      .join('');
  }

  return `
    <div data-slot="background-inbox" class="ds-background-inbox" role="region" aria-label="Background inbox">
      <div class="ds-background-inbox__header">
        <span class="ds-background-inbox__title">Running elsewhere</span>
        <span class="ds-background-inbox__counter ${isReady ? 'ds-background-inbox__counter--ready' : ''}">
          ${counterText}
        </span>
      </div>

      <div class="ds-background-inbox__list">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const INITIAL_RUNS = [
      { id: '1', title: 'Playwright headless browser audit', summary: '190 stories audited', state: 'ready', elapsed: '42s' },
      { id: '2', title: 'CSS token compilation', summary: 'base.css -> design-system.css', state: 'ready', elapsed: '1.2s' },
      { id: '3', title: 'Live Storybook daemon', summary: 'port 6006 active', state: 'running', elapsed: '14m' },
    ];

    let runs = [...INITIAL_RUNS];

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">69 Background Inbox</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Click ready item to collect</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderBackgroundInbox({ runs, hasCollect: true })}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-background-inbox__item:not(:disabled)').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const runId = item.getAttribute('data-run-id');
          runs = runs.filter((r) => r.id !== runId);
          render();
        });
      });

      if (runs.length === 0) {
        root.querySelector('.ds-background-inbox')?.addEventListener('click', () => {
          runs = [...INITIAL_RUNS];
          render();
        });
      }
    };

    render();
    return root;
  },
};

export const InFlight = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">69 Background Inbox (In Flight)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Active Daemons</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderBackgroundInbox({
        runs: [
          { id: '1', title: 'Audit adapters for parity gaps', state: 'running', elapsed: '4m' },
          { id: '2', title: 'Regenerate API reference', state: 'running', elapsed: '1m' },
        ],
        hasCollect: false,
      })}
    </div>
  </div>
`);
