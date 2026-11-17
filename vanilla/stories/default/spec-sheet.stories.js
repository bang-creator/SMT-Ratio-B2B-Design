import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 52 Spec Sheet',
  parameters: { layout: 'padded' },
};

function renderSpecSheet({
  title = 'Model Deployment Specification',
  subtitle = 'gpt-4o · Production Cluster A',
  rows = [
    { label: 'Parameters', value: 'Undisclosed Mixture of Experts', emphasis: false },
    { label: 'Context window', value: '128,000 tokens', emphasis: true },
    { label: 'Max output', value: '16,384 tokens', emphasis: false },
    { label: 'Cold start p99', value: '142ms', emphasis: true },
  ],
} = {}) {
  const rowsHtml = rows
    .map(
      (r) => `
      <div class="ds-spec-sheet__row ds-spec-row">
        <span class="ds-spec-sheet__label">${r.label}</span>
        <span
          class="ds-spec-sheet__value ${r.emphasis ? 'ds-spec-sheet__value--emphasis' : ''}"
          data-emphasis="${r.emphasis ? 'true' : 'false'}"
        >
          ${r.value}
        </span>
      </div>
    `
    )
    .join('');

  return `
    <div data-slot="spec-sheet" class="ds-spec-sheet">
      <div class="ds-spec-sheet__header">
        <span class="ds-spec-sheet__title">${title}</span>
        ${
          subtitle
            ? `<span class="ds-spec-sheet__subtitle">${subtitle}</span>`
            : ''
        }
      </div>
      <div class="ds-spec-sheet__rows">
        ${rowsHtml}
      </div>
    </div>
  `;
}

const MODEL_SPECS = {
  'gpt-4o': {
    title: 'Model Deployment Specification',
    subtitle: 'gpt-4o · Multi-modal Production',
    rows: [
      { label: 'Architecture', value: 'Omni Multi-modal Transformer', emphasis: false },
      { label: 'Context window', value: '128,000 tokens', emphasis: true },
      { label: 'Max output', value: '16,384 tokens', emphasis: false },
      { label: 'Knowledge cutoff', value: 'October 2023', emphasis: false },
      { label: 'Cold start p99', value: '142ms', emphasis: true },
    ],
  },
  'gpt-4o-mini': {
    title: 'Model Deployment Specification',
    subtitle: 'gpt-4o-mini · Cost-efficient Fast Tier',
    rows: [
      { label: 'Architecture', value: 'Distilled Compact Transformer', emphasis: false },
      { label: 'Context window', value: '128,000 tokens', emphasis: true },
      { label: 'Max output', value: '16,384 tokens', emphasis: false },
      { label: 'Pricing', value: '$0.15 / 1M in · $0.60 / 1M out', emphasis: true },
      { label: 'Cold start p99', value: '48ms', emphasis: true },
    ],
  },
  'o1-preview': {
    title: 'Model Deployment Specification',
    subtitle: 'o1-preview · Deep Reasoning Engine',
    rows: [
      { label: 'Architecture', value: 'Reinforcement Learning CoT', emphasis: false },
      { label: 'Context window', value: '128,000 tokens', emphasis: true },
      { label: 'Max output', value: '32,768 tokens', emphasis: true },
      { label: 'Reasoning effort', value: 'Configurable (Low / Med / High)', emphasis: false },
      { label: 'Latency median', value: '4,200ms', emphasis: false },
    ],
  },
};

function bindSpecEvents(root) {
  const models = ['gpt-4o', 'gpt-4o-mini', 'o1-preview'];
  let currentIdx = 0;

  function update() {
    const target = root.querySelector('.ds-spec-target');
    if (target) {
      target.innerHTML = renderSpecSheet(MODEL_SPECS[models[currentIdx]]);
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-spec-sheet');
    if (card) {
      card.addEventListener('click', () => {
        currentIdx = (currentIdx + 1) % models.length;
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-spec-target">
          ${renderSpecSheet(MODEL_SPECS['gpt-4o'])}
        </div>
      </section>
    `;
    bindSpecEvents(root);
    return root;
  },
};
