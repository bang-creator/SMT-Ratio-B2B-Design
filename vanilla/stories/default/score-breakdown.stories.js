import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 56 Score Breakdown',
  parameters: { layout: 'padded' },
};

function renderScoreCard({
  total = '8.8',
  outOf = '10',
  verdict = 'High Quality',
  verdictClass = 'ds-score-breakdown__verdict--high',
  criteria = [
    { label: 'Ground truth accuracy', score: '9.2', weight: '2', pct: '92', note: 'Direct match with platform DOM structure' },
    { label: 'Typography token adherence', score: '8.5', weight: '1', pct: '85', note: 'Strict 400 weight on all secondary text' },
    { label: 'Motion safety compliance', score: '9.0', weight: '1', pct: '90', note: 'Transitions honor prefers-reduced-motion' },
  ],
} = {}) {
  const criteriaHtml = criteria
    .map(
      (c) => `
    <div class="ds-score-breakdown__item">
      <div class="ds-score-breakdown__meta-row">
        <span class="ds-score-breakdown__label">${c.label}</span>
        <span class="ds-score-breakdown__weight">×${c.weight}</span>
        <span class="ds-score-breakdown__score">${c.score}</span>
      </div>
      <div role="meter" aria-label="${c.label} score" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.pct}" class="ds-score-breakdown__track">
        <span class="ds-score-breakdown__bar" data-pct="${c.pct}"></span>
      </div>
      ${c.note ? `<p class="ds-score-breakdown__note">${c.note}</p>` : ''}
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="score-breakdown" class="ds-score-breakdown" role="button" tabindex="0">
      <div class="ds-score-breakdown__header">
        <span class="ds-score-breakdown__total">${total}</span>
        <span class="ds-score-breakdown__out-of">/ ${outOf}</span>
        <span class="ds-score-breakdown__verdict ${verdictClass}">${verdict}</span>
      </div>
      <div class="ds-score-breakdown__list">
        ${criteriaHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const models = [
      {
        name: 'GPT-4o (Production Evaluation)',
        total: '9.1',
        outOf: '10',
        verdict: 'Excellent',
        verdictClass: 'ds-score-breakdown__verdict--high',
        criteria: [
          { label: 'Reasoning depth', score: '9.5', weight: '2', pct: '95', note: 'Flawless multi-step deduction' },
          { label: 'Formatting adherence', score: '9.0', weight: '1', pct: '90' },
          { label: 'Response speed', score: '8.5', weight: '1', pct: '85' },
        ],
      },
      {
        name: 'Fine-tuned Micro (Experimental)',
        total: '6.8',
        outOf: '10',
        verdict: 'Moderate',
        verdictClass: 'ds-score-breakdown__verdict--mid',
        criteria: [
          { label: 'Reasoning depth', score: '6.0', weight: '2', pct: '60', note: 'Hallucinated intermediate step' },
          { label: 'Formatting adherence', score: '8.0', weight: '1', pct: '80' },
          { label: 'Response speed', score: '9.2', weight: '1', pct: '92', note: 'Ultra-low latency' },
        ],
      },
    ];

    let current = 0;

    const render = () => {
      const m = models[current];
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderScoreCard(m)}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-score-breakdown');
      card?.addEventListener('click', () => {
        current = (current + 1) % models.length;
        render();
      });
      card?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          current = (current + 1) % models.length;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const Streaming = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderScoreCard({
        total: '4.5',
        outOf: '5',
        verdict: 'Approve',
        verdictClass: 'ds-score-breakdown__verdict--high',
        criteria: [
          { label: 'Fixes the root cause', score: '4.5', weight: '3', pct: '90', note: 'Clears the slot at the source rather than at the call site.' },
        ],
      })}
    </div>
  </div>
`);
