import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 58 Subagent List',
  parameters: { layout: 'padded' },
};

const ICONS = {
  check: `<svg class="ds-subagent-item__icon ds-subagent-item__icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  spinner: `<svg class="ds-subagent-item__icon ds-subagent-item__icon--running" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
};

function renderSubagentCards(agents) {
  return agents
    .map(
      (a) => `
    <div class="ds-subagent-item" data-agent="${a.name}" data-status="${a.done ? 'done' : 'running'}" role="button" tabindex="0">
      <div class="ds-subagent-item__header">
        ${a.done ? ICONS.check : ICONS.spinner}
        <span class="ds-subagent-item__name">${a.name}</span>
        <span class="ds-subagent-item__model">${a.model}</span>
      </div>
      <div role="progressbar" aria-label="${a.name} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a.pct}" class="ds-subagent-item__track">
        <span class="ds-subagent-item__bar ${a.done ? 'ds-subagent-item__bar--done' : ''} ${a.shimmer ? 'ds-subagent-item__bar--shimmer' : ''}" data-pct="${a.pct}"></span>
      </div>
    </div>
  `
    )
    .join('');
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const steps = [
      [
        { name: 'Research Worker', model: 'o1-preview', done: false, pct: '45' },
        { name: 'Code Generator', model: 'gpt-4o', done: false, pct: '20' },
        { name: 'QA Verifier', model: 'gpt-4o-mini', done: false, pct: '20' },
      ],
      [
        { name: 'Research Worker', model: 'o1-preview', done: true, pct: '100' },
        { name: 'Code Generator', model: 'gpt-4o', done: false, pct: '65' },
        { name: 'QA Verifier', model: 'gpt-4o-mini', done: false, pct: '20' },
      ],
      [
        { name: 'Research Worker', model: 'o1-preview', done: true, pct: '100' },
        { name: 'Code Generator', model: 'gpt-4o', done: true, pct: '100' },
        { name: 'QA Verifier', model: 'gpt-4o-mini', done: true, pct: '100' },
      ],
    ];

    let current = 1;

    const render = () => {
      const activeAgents = steps[current];
      const doneCount = activeAgents.filter((a) => a.done).length;

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">58 Subagent List</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${doneCount} of ${activeAgents.length} Completed</span>
          </div>
          <div class="ds-story-stage__body">
            <div data-slot="subagent-list" class="ds-subagent-list">
              ${renderSubagentCards(activeAgents)}
            </div>
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-subagent-item').forEach((item) => {
        item.addEventListener('click', () => {
          current = (current + 1) % steps.length;
          render();
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            current = (current + 1) % steps.length;
            render();
          }
        });
      });
    };

    render();
    return root;
  },
};

export const Summarizing = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">58 Subagent List (Summarizing)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Synthesizing Outputs</span>
    </div>
    <div class="ds-story-stage__body">
      <div data-slot="subagent-list" class="ds-subagent-list">
        ${renderSubagentCards([
          { name: 'Explore the runtime', model: 'haiku', done: true, pct: '100' },
          { name: 'Fix composer types', model: 'sonnet', done: true, pct: '100' },
          { name: 'Write regression tests', model: 'sonnet', done: true, pct: '100' },
          { name: 'Summarize findings', model: 'haiku', done: false, pct: '45' },
        ])}
      </div>
    </div>
  </div>
`);
