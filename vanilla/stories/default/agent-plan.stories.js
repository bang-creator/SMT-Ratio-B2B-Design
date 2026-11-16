import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 57 Agent Plan',
  parameters: { layout: 'padded' },
};

const ICONS = {
  check: `<svg class="ds-agent-plan__icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  spinner: `<svg class="ds-agent-plan__icon--active" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
  dot: `<span class="ds-agent-plan__dot--pending" aria-hidden="true"></span>`,
};

function renderPlanSteps(steps, completedIndex) {
  const allDone = completedIndex >= steps.length;
  return steps
    .map((s, i) => {
      const isDone = allDone || i < completedIndex;
      const isActive = !allDone && i === completedIndex;
      const statusText = isDone ? 'done' : isActive ? 'in progress' : 'not started';
      const icon = isDone ? ICONS.check : isActive ? ICONS.spinner : ICONS.dot;
      const labelClass = isDone
        ? 'ds-agent-plan__label--done'
        : isActive
          ? 'ds-agent-plan__label--active'
          : 'ds-agent-plan__label--pending';

      return `
        <li class="ds-agent-plan__item" data-step-index="${i}" role="button" tabindex="0">
          <span class="ds-agent-plan__icon-wrapper">
            ${icon}
          </span>
          <div class="ds-agent-plan__content">
            <span class="ds-agent-plan__label ${labelClass}">${s.label}</span>
            <span class="sr-only"> ${statusText}</span>
            ${isActive && s.description ? `<span class="ds-agent-plan__description">${s.description}</span>` : ''}
          </div>
        </li>
      `;
    })
    .join('');
}

function renderPlanCard({
  title = 'Plan',
  completed = 2,
  total = 4,
  pct = '50',
  isCard = true,
  steps = [
    { label: 'Download source specifications from repository' },
    { label: 'Map tokens to OpenAI platform color palette' },
    { label: 'Verify zero inline styles and zero raw hex literals', description: 'Checking 151 components across vanilla/' },
    { label: 'Execute full automated Playwright audit matrix' },
  ],
} = {}) {
  return `
    <div data-slot="agent-plan" class="ds-agent-plan ${isCard ? 'ds-agent-plan--card' : ''}" role="region" aria-label="${title}">
      <div class="ds-agent-plan__header">
        <span class="ds-agent-plan__title">${title}</span>
        <span class="ds-agent-plan__counter">${completed} of ${total}</span>
      </div>
      <div role="progressbar" aria-label="${title} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" class="ds-agent-plan__track">
        <span class="ds-agent-plan__bar" data-pct="${pct}"></span>
      </div>
      <ul class="ds-agent-plan__list">
        ${renderPlanSteps(steps, completed)}
      </ul>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const steps = [
      { label: 'Download source specifications', description: 'Fetching repository tree via API' },
      { label: 'Map tokens to OpenAI platform palette', description: 'Checking docs/design-system/tokens.json' },
      { label: 'Verify zero inline styles', description: 'Running scripts/check-literals.mjs' },
      { label: 'Execute automated Playwright matrix', description: 'Testing computed styles & screenshots' },
    ];

    let currentStep = 1;

    const render = () => {
      const pctMap = ['0', '25', '50', '75', '100'];
      const pct = pctMap[Math.min(currentStep, pctMap.length - 1)];

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">57 Agent Plan</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Step ${currentStep} of ${steps.length} (${pct}%)</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderPlanCard({
              title: 'Composer draft implementation',
              completed: currentStep,
              total: steps.length,
              pct,
              isCard: true,
              steps,
            })}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-agent-plan__item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(item.getAttribute('data-step-index'), 10);
          currentStep = (idx + 1) % (steps.length + 1);
          render();
        });
      });

      const card = root.querySelector('.ds-agent-plan--card');
      card?.addEventListener('click', () => {
        currentStep = (currentStep + 1) % (steps.length + 1);
        render();
      });
    };

    render();
    return root;
  },
};

export const Bare = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">57 Agent Plan (Bare Variant)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Embedded Inline</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderPlanCard({
        title: 'Background migration',
        completed: 3,
        total: 4,
        pct: '75',
        isCard: false,
        steps: [
          { label: 'Read existing composer state' },
          { label: 'Design draft store architecture' },
          { label: 'Wire runtime persistence', description: 'Saving drafts on change' },
          { label: 'Run comprehensive integration tests' },
        ],
      })}
    </div>
  </div>
`);
