import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 05 Reasoning Effort',
  parameters: { layout: 'padded' },
};

const LEVELS = [
  { key: 'low', label: 'Low', budget: 2000 },
  { key: 'medium', label: 'Medium', budget: 8000 },
  { key: 'high', label: 'High', budget: 24000 },
  { key: 'max', label: 'Max', budget: 64000 },
];

function fmt(n) {
  return n.toLocaleString('en-US');
}

function renderReasoningEffort({
  levels = LEVELS,
  selectedKey = 'medium',
  spent = 3412,
  interactive = true,
} = {}) {
  const selected = levels.find((l) => l.key === selectedKey) || levels[1];
  const budget = selected.budget;
  const pct = Math.min(100, Math.round((spent / budget) * 100));

  const items = levels
    .map((level) => {
      const active = level.key === selectedKey;
      if (interactive) {
        return `<button type="button" class="ds-reasoning-effort__btn" data-key="${level.key}" aria-pressed="${active}">${level.label}</button>`;
      }
      return `<span class="ds-reasoning-effort__btn flex-1" aria-current="${active ? 'true' : 'false'}">${level.label}</span>`;
    })
    .join('');

  return `
    <div data-slot="reasoning-effort" class="ds-reasoning-effort">
      <div class="ds-reasoning-effort__header">
        <span class="ds-reasoning-effort__title font-medium">Thinking</span>
        <span class="ds-reasoning-effort__stats font-mono tabular-nums">${fmt(spent)} / ${fmt(budget)}</span>
      </div>
      <div class="ds-reasoning-effort__pill rounded-full">
        ${items}
      </div>
      <span role="progressbar" aria-label="Thinking budget used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-valuetext="${fmt(spent)} of ${fmt(budget)}" class="ds-reasoning-effort__track">
        <span class="ds-reasoning-effort__fill ds-reasoning-effort__fill--${selectedKey}"></span>
      </span>
    </div>
  `.trim();
}

/**
 * Default: Interactive Reasoning Effort
 * Click Low, Medium, High, or Max to dynamically update budget allocation and animate progress bar.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentKey = 'medium';
    const spentMap = { low: 1650, medium: 3412, high: 18240, max: 41312 };

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>05 Reasoning Effort (Interactive Level Selection)</code></header>
        <div class="ds-reasoning-effort-target">
          ${renderReasoningEffort({ selectedKey: currentKey, spent: spentMap[currentKey], interactive: true })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-reasoning-effort-target');

    const bindEvents = () => {
      target.querySelectorAll('.ds-reasoning-effort__btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-key');
          if (key) {
            currentKey = key;
            target.innerHTML = renderReasoningEffort({
              selectedKey: currentKey,
              spent: spentMap[currentKey] || 3412,
              interactive: true,
            });
            bindEvents();
          }
        });
      });
    };

    bindEvents();
    return root;
  },
};

/**
 * ReadOnly: Static disabled state (max budget allocated)
 */
export const ReadOnly = story(
  'Default / Application / 05 Reasoning Effort / Read Only',
  stage(
    'Read Only (Max Budget)',
    renderReasoningEffort({
      selectedKey: 'max',
      spent: 41312,
      interactive: false,
    })
  )
);
