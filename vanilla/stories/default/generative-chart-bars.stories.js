import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 151 Support tickets AUI',
  parameters: { layout: 'padded' },
};

function renderStackedBarChartCard({
  title = 'Support tickets by channel',
  timeframe = 'Weekly',
  totalCount = '124 tickets',
  trend = '+8% vs prev',
  trendPositive = false, // false means tickets increased (more backlog)
  mode = 'Weekly', // 'Weekly' | 'Monthly' | 'Quarterly'
  zeroPhone = false,
  surgeEmail = false,
} = {}) {
  const labels = mode === 'Quarterly' ? ['Q1', 'Q2', 'Q3', 'Q4'] : ['W1', 'W2', 'W3', 'W4'];

  const h1Email = surgeEmail ? 60 : 45;
  const h1Chat = surgeEmail ? 25 : 35;
  const h1Phone = zeroPhone ? 0 : 15;

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <div>
          <h3 class="ds-gen-chart-card__title">${title}</h3>
          <span class="ds-gen-chart-card__subtitle" data-slot="timeframe-subtitle">${timeframe} view</span>
        </div>
        <div class="ds-flex ds-items-center ds-gap-1">
          <button type="button" class="ds-button ${mode === 'Weekly' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-mode" data-mode="Weekly">W</button>
          <button type="button" class="ds-button ${mode === 'Monthly' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-mode" data-mode="Monthly">M</button>
          <button type="button" class="ds-button ${mode === 'Quarterly' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-mode" data-mode="Quarterly">Q</button>
        </div>
      </div>

      <div class="ds-flex ds-items-baseline ds-gap-3 ds-mt-2">
        <span class="ds-text-heading-xl ds-text-bold" data-slot="total-count">${totalCount}</span>
        <span class="ds-badge ${trendPositive ? 'ds-badge--success' : 'ds-badge--warning'} ds-badge--sm">
          ${trend}
        </span>
      </div>

      <div class="ds-gen-chart-card__legend ds-mt-2">
        <div class="ds-gen-chart-card__legend-item">
          <div class="ds-gen-chart-card__dot ds-gen-chart-card__dot--primary"></div>
          <span>Email</span>
        </div>
        <div class="ds-gen-chart-card__legend-item">
          <div class="ds-gen-chart-card__dot ds-gen-chart-card__dot--secondary"></div>
          <span>Chat</span>
        </div>
        <div class="ds-gen-chart-card__legend-item">
          <div class="ds-gen-chart-card__dot ds-gen-chart-card__dot--tertiary"></div>
          <span>Phone</span>
        </div>
      </div>

      <div class="ds-gen-chart-card__chart-wrapper ds-mt-2">
        <svg viewBox="0 0 320 140" fill="none" class="ds-gen-chart-card__svg" aria-label="${title} stacked bar chart">
          <!-- Baseline -->
          <line x1="20" y1="120" x2="300" y2="120" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></line>

          <!-- Col 1 -->
          ${
            h1Phone > 0
              ? `<rect x="50" y="${120 - h1Phone}" width="28" height="${h1Phone}" fill="var(--color-semantic-background-surface-secondary)" rx="2"></rect>`
              : ''
          }
          <rect x="50" y="${120 - h1Phone - h1Chat}" width="28" height="${h1Chat}" fill="color-mix(in srgb, var(--color-semantic-chart-series-primary) 35%, transparent)" rx="2"></rect>
          <rect x="50" y="${120 - h1Phone - h1Chat - h1Email}" width="28" height="${h1Email}" fill="var(--color-semantic-chart-series-primary)" rx="2"></rect>
          <text x="64" y="132" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">${labels[0]}</text>

          <!-- Col 2 -->
          ${
            !zeroPhone
              ? `<rect x="120" y="108" width="28" height="12" fill="var(--color-semantic-background-surface-secondary)" rx="2"></rect>`
              : ''
          }
          <rect x="120" y="${zeroPhone ? 80 : 68}" width="28" height="40" fill="color-mix(in srgb, var(--color-semantic-chart-series-primary) 35%, transparent)" rx="2"></rect>
          <rect x="120" y="${zeroPhone ? 40 : 28}" width="28" height="40" fill="var(--color-semantic-chart-series-primary)" rx="2"></rect>
          <text x="134" y="132" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">${labels[1]}</text>

          <!-- Col 3 -->
          ${
            !zeroPhone
              ? `<rect x="190" y="105" width="28" height="15" fill="var(--color-semantic-background-surface-secondary)" rx="2"></rect>`
              : ''
          }
          <rect x="190" y="${zeroPhone ? 85 : 70}" width="28" height="35" fill="color-mix(in srgb, var(--color-semantic-chart-series-primary) 35%, transparent)" rx="2"></rect>
          <rect x="190" y="${zeroPhone ? 40 : 25}" width="28" height="45" fill="var(--color-semantic-chart-series-primary)" rx="2"></rect>
          <text x="204" y="132" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">${labels[2]}</text>

          <!-- Col 4 -->
          ${
            !zeroPhone
              ? `<rect x="260" y="110" width="28" height="10" fill="var(--color-semantic-background-surface-secondary)" rx="2"></rect>`
              : ''
          }
          <rect x="260" y="${zeroPhone ? 80 : 70}" width="28" height="40" fill="color-mix(in srgb, var(--color-semantic-chart-series-primary) 35%, transparent)" rx="2"></rect>
          <rect x="260" y="${zeroPhone ? 50 : 40}" width="28" height="30" fill="var(--color-semantic-chart-series-primary)" rx="2"></rect>
          <text x="274" y="132" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">${labels[3]}</text>
        </svg>
      </div>
    </div>
  `;
}

function attachBarsHandler(root) {
  root.querySelectorAll('[data-action="set-mode"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      root.querySelectorAll('[data-action="set-mode"]').forEach((b) => {
        b.className = 'ds-button ds-button--ghost ds-button--xs';
      });
      btn.className = 'ds-button ds-button--secondary ds-button--xs';

      const totalEl = root.querySelector('[data-slot="total-count"]');
      const subEl = root.querySelector('[data-slot="timeframe-subtitle"]');
      if (mode === 'Weekly') {
        if (totalEl) totalEl.textContent = '124 tickets';
        if (subEl) subEl.textContent = 'Weekly view';
      } else if (mode === 'Monthly') {
        if (totalEl) totalEl.textContent = '492 tickets';
        if (subEl) subEl.textContent = 'Monthly view';
      } else {
        if (totalEl) totalEl.textContent = '1,840 tickets';
        if (subEl) subEl.textContent = 'Quarterly view';
      }
    });
  });
}

export const Default = story(
  () => stage(renderStackedBarChartCard()),
  { postRender: attachBarsHandler }
);

export const Quarterly = story(() =>
  stage(
    renderStackedBarChartCard({
      mode: 'Quarterly',
      timeframe: 'Quarterly',
      totalCount: '1,840 tickets',
      trend: '-14% vs Q3',
      trendPositive: true,
    })
  )
);

export const ResolvedAll = story(() =>
  stage(
    renderStackedBarChartCard({
      zeroPhone: true,
      totalCount: '86 tickets',
      trend: '-32% resolved',
      trendPositive: true,
    })
  )
);

export const HighVolumeSurge = story(() =>
  stage(
    renderStackedBarChartCard({
      surgeEmail: true,
      totalCount: '310 tickets',
      trend: '+140% surge',
      trendPositive: false,
    })
  )
);
