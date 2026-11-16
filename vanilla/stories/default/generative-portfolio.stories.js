import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 134 Portfolio overview AUI',
  parameters: { layout: 'padded' },
};

const DEFAULT_HOLDINGS = [
  { symbol: 'ACME', shares: '40', price: '$182.10', value: '$7,284.00' },
  { symbol: 'GLBX', shares: '25', price: '$94.55', value: '$2,363.75' },
  { symbol: 'NORT', shares: '15', price: '$310.20', value: '$4,653.00' },
];

function renderPortfolio({
  total = '$128,430',
  change = '+2.4%',
  isPositive = true,
  positions = '12',
  holdings = DEFAULT_HOLDINGS,
  showChart = true,
} = {}) {
  const changeClass = isPositive
    ? 'ds-gen-portfolio-card__metric-value--positive'
    : 'ds-text-danger';

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <h3 class="ds-gen-portfolio-card__title">Portfolio overview</h3>

      <div class="ds-gen-portfolio-card__metrics">
        <div class="ds-gen-portfolio-card__metric">
          <span class="ds-gen-portfolio-card__metric-label">Total value</span>
          <span class="ds-gen-portfolio-card__metric-value">${total}</span>
        </div>
        <div class="ds-gen-portfolio-card__metric">
          <span class="ds-gen-portfolio-card__metric-label">Today</span>
          <span class="ds-gen-portfolio-card__metric-value ${changeClass}">${change}</span>
        </div>
        <div class="ds-gen-portfolio-card__metric">
          <span class="ds-gen-portfolio-card__metric-label">Positions</span>
          <span class="ds-gen-portfolio-card__metric-value">${positions}</span>
        </div>
      </div>

      ${
        showChart
          ? `
        <div class="ds-gen-portfolio-card__metric">
          <span class="ds-gen-portfolio-card__section-label">Performance</span>
          <div class="ds-mini-bar-chart">
            <div class="ds-mini-bar-col">
              <div class="ds-mini-bar-fill ds-mini-bar-fill--70"></div>
              <span class="ds-gen-portfolio-card__day">M</span>
            </div>
            <div class="ds-mini-bar-col">
              <div class="ds-mini-bar-fill ds-mini-bar-fill--75"></div>
              <span class="ds-gen-portfolio-card__day">T</span>
            </div>
            <div class="ds-mini-bar-col">
              <div class="ds-mini-bar-fill ds-mini-bar-fill--65"></div>
              <span class="ds-gen-portfolio-card__day">W</span>
            </div>
            <div class="ds-mini-bar-col">
              <div class="ds-mini-bar-fill ds-mini-bar-fill--85"></div>
              <span class="ds-gen-portfolio-card__day">T</span>
            </div>
            <div class="ds-mini-bar-col">
              <div class="ds-mini-bar-fill ds-mini-bar-fill--95"></div>
              <span class="ds-gen-portfolio-card__day">F</span>
            </div>
          </div>
        </div>
      `
          : ''
      }

      <div class="ds-gen-portfolio-card__table-wrapper">
        <table class="ds-gen-portfolio-card__table" data-slot="holdings-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Price</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${
              holdings.length === 0
                ? `
              <tr>
                <td colspan="4" class="ds-text-center ds-p-4 ds-text-secondary">No active positions in this portfolio.</td>
              </tr>
            `
                : holdings
                    .map(
                      (h) => `
              <tr data-slot="holding-row">
                <td><strong>${h.symbol}</strong></td>
                <td>${h.shares}</td>
                <td>${h.price}</td>
                <td>${h.value}</td>
              </tr>
            `,
                    )
                    .join('')
            }
          </tbody>
        </table>
      </div>

      <div class="ds-gen-portfolio-card__note">
        Prices delayed by 15 minutes.
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderPortfolio();
    return root;
  },
};

export const NegativeDay = story(
  () => renderPortfolio({
    total: '$124,190',
    change: '-1.8%',
    isPositive: false,
    positions: '12',
  })
);

export const Empty = story(
  () => renderPortfolio({
    total: '$0.00',
    change: '0.0%',
    isPositive: true,
    positions: '0',
    holdings: [],
    showChart: false,
  })
);

export const LongContent = story(
  () => renderPortfolio({
    total: '$248,910',
    change: '+3.1%',
    isPositive: true,
    positions: '8',
    holdings: [
      { symbol: 'ACME', shares: '40', price: '$182.10', value: '$7,284.00' },
      { symbol: 'GLBX', shares: '25', price: '$94.55', value: '$2,363.75' },
      { symbol: 'NORT', shares: '15', price: '$310.20', value: '$4,653.00' },
      { symbol: 'STRP', shares: '100', price: '$45.00', value: '$4,500.00' },
      { symbol: 'APPL', shares: '50', price: '$225.50', value: '$11,275.00' },
      { symbol: 'MSFT', shares: '30', price: '$420.10', value: '$12,603.00' },
      { symbol: 'GOOG', shares: '45', price: '$175.40', value: '$7,893.00' },
      { symbol: 'NVDA', shares: '80', price: '$135.25', value: '$10,820.00' },
    ],
  })
);
