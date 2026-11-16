import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 44 Number Ticker',
  parameters: { layout: 'padded' },
};

function renderRollingDigits(value) {
  const formatted = Number(value).toLocaleString('en-US');
  const chars = formatted.split('');

  return chars
    .map((char) => {
      if (/\d/.test(char)) {
        const d = Number(char);
        return `
          <span class="ds-number-ticker__slot ds-ticker-slot" aria-hidden="true">
            <span class="ds-number-ticker__col ds-ticker-col ds-ticker-digit-${d}" data-digit="${d}">
              <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span>
              <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>
            </span>
          </span>
        `;
      }
      return `<span class="ds-number-ticker__char" aria-hidden="true">${char}</span>`;
    })
    .join('');
}

function renderNumberTicker({
  value = 142857,
  label = 'Total tokens processed this session',
} = {}) {
  const formatted = Number(value).toLocaleString('en-US');

  return `
    <div data-slot="number-ticker" class="ds-number-ticker ds-ticker-interactive" role="button" tabindex="0" title="Click to process more tokens">
      <span class="ds-number-ticker__value ds-ticker-value" aria-label="${formatted}">
        ${renderRollingDigits(value)}
      </span>
      <span class="ds-number-ticker__label">${label}</span>
    </div>
  `;
}

function bindTickerEvents(root) {
  let val = 142857;

  function update() {
    const target = root.querySelector('.ds-ticker-target');
    if (target) {
      target.innerHTML = renderNumberTicker({ value: val });
      attach();
    }
  }

  function attach() {
    const ticker = root.querySelector('.ds-ticker-interactive');
    if (ticker) {
      ticker.addEventListener('click', () => {
        val += 1428;
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
        <header><code>44 Number Ticker (Interactive Rolling Digit Counter)</code></header>
        <div class="ds-ticker-target">
          ${renderNumberTicker({
            value: 142857,
            label: 'Total tokens processed this session',
          })}
        </div>
      </section>
    `;
    bindTickerEvents(root);
    return root;
  },
};
