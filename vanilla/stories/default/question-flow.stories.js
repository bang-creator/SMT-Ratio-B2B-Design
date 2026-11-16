import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 63 Question Flow',
  parameters: { layout: 'padded' },
};

const STEPS = [
  {
    id: 'runtime',
    question: 'Select target deployment runtime',
    description: 'Where will your agent workflows execute?',
    pct: '33',
    options: [
      { id: 'node', label: 'Node.js (LTS 20.x)', description: 'Full server capabilities & filesystem access' },
      { id: 'edge', label: 'Cloudflare Workers (Edge)', description: 'Ultra-low latency worldwide execution' },
      { id: 'browser', label: 'Browser Client (Web Worker)', description: 'Direct in-browser sandboxed processing' },
    ],
  },
  {
    id: 'reasoning',
    question: 'Choose default reasoning effort',
    description: 'Configure thinking budget for complex tasks',
    pct: '67',
    options: [
      { id: 'low', label: 'Low effort (Fast response)', description: 'Ideal for lightweight conversions & summaries' },
      { id: 'medium', label: 'Medium effort (Balanced)', description: 'Recommended default for multi-step tasks' },
      { id: 'high', label: 'High effort (Deep reasoning)', description: 'Exhaustive verification for math & code' },
    ],
  },
  {
    id: 'safety',
    question: 'Enable automated guardrails',
    description: 'Content moderation & hallucination checks',
    pct: '100',
    options: [
      { id: 'strict', label: 'Strict moderation filter', description: 'Blocks potential PII and jailbreak vectors' },
      { id: 'audit', label: 'Passive audit logging only', description: 'Records telemetry without blocking runs' },
    ],
  },
];

function renderStepView(step, stepIndex, totalSteps, selectedId) {
  return `
    <div data-slot="question-flow" data-state="open" class="ds-question-flow">
      <div class="ds-question-flow__header">
        <span class="ds-question-flow__counter">${stepIndex + 1} of ${totalSteps}</span>
        <button type="button" class="ds-question-flow__back-btn" data-btn-back ${stepIndex === 0 ? 'disabled' : ''}>
          Back
        </button>
      </div>

      <div role="progressbar" aria-valuenow="${stepIndex + 1}" aria-valuemin="1" aria-valuemax="${totalSteps}" class="ds-question-flow__track">
        <span class="ds-question-flow__bar" data-pct="${step.pct}"></span>
      </div>

      <div class="ds-question-flow__prompt">
        <h4 class="ds-question-flow__title">${step.question}</h4>
        ${step.description ? `<p class="ds-question-flow__description">${step.description}</p>` : ''}
      </div>

      <div class="ds-question-flow__options">
        ${step.options.map((opt) => `
          <button type="button" data-selected="${opt.id === selectedId}" data-id="${opt.id}" class="ds-option-row">
            <span class="ds-option-text">
              <span class="ds-option-label">${opt.label}</span>
              ${opt.description ? `<span class="ds-option-desc">${opt.description}</span>` : ''}
            </span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReceiptView(answers) {
  return `
    <div data-slot="question-flow" data-state="receipt" class="ds-question-flow" role="button" tabindex="0">
      <div class="ds-question-flow__receipt">
        ${STEPS.map((s) => `
          <div class="ds-question-flow__receipt-item">
            <span class="ds-question-flow__receipt-q">${s.question}</span>
            <span class="ds-question-flow__receipt-a">${answers[s.id] || 'None'}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentStepIndex = 0;
    const answers = {};
    let isFinished = false;

    const render = () => {
      if (isFinished) {
        root.innerHTML = `
          <div class="ds-story-stage">
            <div class="ds-story-stage__header">
              <span class="ds-story-stage__title">63 Question Flow (Summary)</span>
              <span class="ds-badge ds-badge--subtle ds-badge--sm">Completed (Click to restart)</span>
            </div>
            <div class="ds-story-stage__body">
              ${renderReceiptView(answers)}
            </div>
          </div>
        `;

        root.querySelector('.ds-question-flow[data-state="receipt"]')?.addEventListener('click', () => {
          currentStepIndex = 0;
          isFinished = false;
          render();
        });
        return;
      }

      const step = STEPS[currentStepIndex];
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">63 Question Flow</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Step ${currentStepIndex + 1} of ${STEPS.length}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderStepView(step, currentStepIndex, STEPS.length, answers[step.id])}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-option-row').forEach((btn) => {
        btn.addEventListener('click', () => {
          const optId = btn.getAttribute('data-id');
          const opt = step.options.find((o) => o.id === optId);
          answers[step.id] = opt ? opt.label : optId;

          if (currentStepIndex < STEPS.length - 1) {
            currentStepIndex++;
          } else {
            isFinished = true;
          }
          render();
        });
      });

      root.querySelector('[data-btn-back]')?.addEventListener('click', () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const Completed = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">63 Question Flow (Completed Receipt)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Summary View</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderReceiptView({
        runtime: 'Node.js (LTS 20.x)',
        reasoning: 'Medium effort (Balanced)',
        safety: 'Strict moderation filter',
      })}
    </div>
  </div>
`);
