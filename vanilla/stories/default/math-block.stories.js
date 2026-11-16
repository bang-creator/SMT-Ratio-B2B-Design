import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 51 Math Block',
  parameters: { layout: 'padded' },
};

function renderFrac(over, under) {
  return `
    <span data-slot="frac" class="ds-frac">
      <span class="ds-frac-top ds-frac__over">${over}</span>
      <span class="ds-frac-bottom ds-frac__under">${under}</span>
    </span>
  `;
}

function renderMathBlock({
  label = 'Attention Formula',
  steps = [
    {
      expression: `Attention(Q, K, V) = softmax(${renderFrac('Q K<sup>T</sup>', '√d<sub>k</sub>')}) V`,
      note: 'Scaled dot-product self-attention mechanism',
    },
  ],
  visibleSteps = 1,
} = {}) {
  const shownSteps = steps.slice(0, visibleSteps);

  const stepsHtml = shownSteps
    .map(
      (s) => `
      <div class="ds-math-block__step">
        <div class="ds-math-expr ds-math-block__expression">
          ${s.expression}
        </div>
        ${s.note ? `<span class="ds-math-block__note">${s.note}</span>` : ''}
      </div>
    `
    )
    .join('');

  return `
    <div data-slot="math-block" class="ds-math-block">
      ${label ? `<span class="ds-math-block__label">${label}</span>` : ''}
      ${stepsHtml}
    </div>
  `;
}

const SAMPLE_STEPS = [
  {
    expression: `E = m c<sup>2</sup>`,
    note: 'Mass-energy equivalence resting formula',
  },
  {
    expression: `E<sup>2</sup> = (p c)<sup>2</sup> + (m<sub>0</sub> c<sup>2</sup>)<sup>2</sup>`,
    note: 'Relativistic dispersion relation',
  },
  {
    expression: `m = ${renderFrac('m<sub>0</sub>', '√(1 - v<sup>2</sup>/c<sup>2</sup>)')}`,
    note: 'Relativistic mass dilation with Lorentz factor',
  },
];

function bindMathEvents(root) {
  let currentVisible = 1;

  function update() {
    const target = root.querySelector('.ds-math-target');
    if (target) {
      target.innerHTML = renderMathBlock({
        label: `Derivation Step ${currentVisible} of ${SAMPLE_STEPS.length}`,
        steps: SAMPLE_STEPS,
        visibleSteps: currentVisible,
      });
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-math-block');
    if (card) {
      card.addEventListener('click', () => {
        currentVisible = (currentVisible % SAMPLE_STEPS.length) + 1;
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
        <header><code>51 Math Block (Interactive Derivation Steps)</code></header>
        <div class="ds-math-target">
          ${renderMathBlock({
            label: `Derivation Step 1 of ${SAMPLE_STEPS.length}`,
            steps: SAMPLE_STEPS,
            visibleSteps: 1,
          })}
        </div>
      </section>
    `;
    bindMathEvents(root);
    return root;
  },
};
