import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 59 Task Card',
  parameters: { layout: 'padded' },
};

const ICONS = {
  done: `<svg class="ds-task-card__icon ds-task-card__icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  working: `<svg class="ds-task-card__icon ds-task-card__icon--working" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
  waiting: `<span class="ds-task-card__dot--waiting" aria-hidden="true"></span>`,
  failed: `<svg class="ds-task-card__icon ds-task-card__icon--failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  chevron: `<svg class="ds-task-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
};

function renderTask({
  label = 'Review the runtime architecture',
  state = 'working',
  meta = 'research',
  elapsed = '0:18',
  isOpen = false,
  transcript = [
    'Read the runtime entry point.',
    'Checked the thread lifecycle.',
    'Prepared the findings.',
  ],
  actions = '',
  result = undefined,
} = {}) {
  const icon = state === 'done' ? ICONS.done : state === 'failed' ? ICONS.failed : state === 'waiting' ? ICONS.waiting : ICONS.working;

  const transcriptHtml = transcript && transcript.length
    ? `
      <div data-slot="task-card-transcript" class="ds-task-card__transcript" ${isOpen ? '' : 'hidden'}>
        ${transcript.map((t) => `<div class="ds-task-card__transcript-item"><span class="ds-task-card__transcript-text">${t}</span></div>`).join('')}
      </div>
    `
    : '';

  const actionsHtml = actions
    ? `<div data-slot="task-card-actions" class="ds-task-card__actions">${actions}</div>`
    : '';

  const resultHtml = result
    ? `<div data-slot="task-card-result" class="ds-task-card__result">${result}</div>`
    : '';

  return `
    <div data-slot="task-card" data-state="${state}" data-open="${isOpen}" class="ds-task-card">
      <button type="button" aria-expanded="${isOpen}" class="ds-task-card__trigger" data-task-trigger>
        ${icon}
        <span class="sr-only">${state}</span>
        <span class="ds-task-card__label">${label}</span>
        ${meta ? `<span class="ds-task-card__meta">${meta}</span>` : ''}
        ${elapsed ? `<span class="ds-task-card__elapsed">${elapsed}</span>` : ''}
        ${transcript && transcript.length ? ICONS.chevron : ''}
      </button>
      ${actionsHtml}
      ${transcriptHtml}
      ${resultHtml}
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let open = true;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">59 Task Card</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Working (Accordion Toggle)</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderTask({
              label: 'Review the runtime architecture',
              state: 'working',
              meta: 'research',
              elapsed: '0:18',
              isOpen: open,
              transcript: [
                'Read the runtime entry point.',
                'Checked the thread lifecycle.',
                'Prepared the findings.',
              ],
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-task-trigger]')?.addEventListener('click', () => {
        open = !open;
        render();
      });
    };

    render();
    return root;
  },
};

export const WaitingWithActions = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">59 Task Card (Waiting for Action)</span>
      <span class="ds-badge ds-badge--warning ds-badge--sm">Approval Required</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderTask({
        label: 'Deploy the docs preview',
        meta: 'deploy',
        state: 'waiting',
        elapsed: '1:04',
        isOpen: false,
        actions: `
          <div class="ds-task-card__actions-row">
            <span class="ds-text-xs ds-text-secondary">Needs approval to push to preview branch.</span>
            <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill">
              Approve
            </button>
          </div>
        `,
      })}
    </div>
  </div>
`);
