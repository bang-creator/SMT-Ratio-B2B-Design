import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 01 Loading State',
  parameters: { layout: 'padded' },
};

const CELL_SHAPE_CLASSES = {
  dots: 'ds-generation-loader__cell--dots',
  squares: 'ds-generation-loader__cell--squares',
  rounded: 'ds-generation-loader__cell--rounded',
};

const VARIANTS = [
  { variant: 'dots', label: 'Generating response' },
  { variant: 'squares', label: 'Rendering 4 product shots from your brief' },
  { variant: 'rounded', label: 'Analyzing code workspace' },
];

function renderGenerationLoader({ label = 'Generating response', tick = 0, variant = 'dots' } = {}) {
  const pixelOffset = Math.floor(tick / 3);
  const cellClass = CELL_SHAPE_CLASSES[variant] || CELL_SHAPE_CLASSES.dots;

  const cells = Array.from({ length: 9 }, (_, index) => {
    const active = (index * 2 + pixelOffset) % 9 < 3;
    const activeCls = active ? ' ds-generation-loader__cell--active' : '';
    return `<span class="ds-generation-loader__cell ${cellClass}${activeCls}"></span>`;
  }).join('');

  return `
    <div data-slot="generation-loader" class="ds-generation-loader" title="Click to cycle variant">
      <div aria-hidden="true" class="ds-generation-loader__grid">
        ${cells}
      </div>
      <span class="ds-generation-loader__label">
        ${label}
      </span>
    </div>
  `.trim();
}

function createLoaderStory(initialConfig) {
  return {
    render: () => {
      const root = document.createElement('div');
      root.className = 'ds-story';

      let config = { ...initialConfig };
      let tick = 0;

      root.innerHTML = `
        <section class="ds-story-stage">
<div class="ds-loader-viewport">
            <div class="ds-loader-target">
              ${renderGenerationLoader({ ...config, tick })}
            </div>
          </div>
        </section>
      `;

      const target = root.querySelector('.ds-loader-target');

      function updateCells() {
        const cells = target.querySelectorAll('.ds-generation-loader__cell');
        const pixelOffset = Math.floor(tick / 3);
        cells.forEach((cell, index) => {
          const active = (index * 2 + pixelOffset) % 9 < 3;
          cell.classList.toggle('ds-generation-loader__cell--active', active);
        });
      }

      const timer = setInterval(() => {
        tick++;
        updateCells();
      }, 130);

      target.addEventListener('click', () => {
        const nextIdx = (VARIANTS.findIndex((v) => v.variant === config.variant) + 1) % VARIANTS.length;
        config = VARIANTS[nextIdx];
        target.innerHTML = renderGenerationLoader({ ...config, tick });
      });

      return root;
    },
  };
}

export const Default = createLoaderStory(VARIANTS[0]);
export const Squares = createLoaderStory(VARIANTS[1]);
export const Rounded = createLoaderStory(VARIANTS[2]);
