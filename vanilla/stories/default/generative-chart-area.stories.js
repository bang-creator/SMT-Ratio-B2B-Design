import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 144 Weekly active users AUI',
  parameters: { layout: 'padded' },
};

function renderAreaChartCard({
  title = 'Weekly active users',
  subtitle = 'Last 7 days',
  totalUsers = '24,850',
  trend = '+12.4%',
  trendPositive = true,
  period = '7D',
  empty = false,
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <div>
          <h3 class="ds-gen-chart-card__title">${title}</h3>
          <span class="ds-gen-chart-card__subtitle" data-slot="subtitle">${subtitle}</span>
        </div>
        <div class="ds-flex ds-items-center ds-gap-1">
          <button type="button" class="ds-button ${period === '7D' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-period" data-period="7D">7D</button>
          <button type="button" class="ds-button ${period === '30D' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-period" data-period="30D">30D</button>
          <button type="button" class="ds-button ${period === '90D' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-period" data-period="90D">90D</button>
        </div>
      </div>

      <div class="ds-flex ds-items-baseline ds-gap-3 ds-mt-2">
        <span class="ds-text-heading-xl ds-text-bold" data-slot="total-users">${totalUsers}</span>
        ${
          trend
            ? `
          <span class="ds-badge ${trendPositive ? 'ds-badge--success' : 'ds-badge--danger'} ds-badge--sm">
            ${trend}
          </span>
        `
            : ''
        }
      </div>

      <div class="ds-gen-chart-card__legend ds-mt-2">
        <div class="ds-gen-chart-card__legend-item">
          <div class="ds-gen-chart-card__dot ds-gen-chart-card__dot--primary"></div>
          <span>Returning users</span>
        </div>
        <div class="ds-gen-chart-card__legend-item">
          <div class="ds-gen-chart-card__dot ds-gen-chart-card__dot--secondary"></div>
          <span>New users</span>
        </div>
      </div>

      <div class="ds-gen-chart-card__chart-wrapper ds-mt-2">
        ${
          empty
            ? `
          <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-8 ds-gap-1">
            <span class="ds-text-xs ds-text-secondary">No user activity recorded for this period</span>
          </div>
        `
            : `
          <svg viewBox="0 0 320 140" fill="none" class="ds-gen-chart-card__svg" aria-label="Weekly active users stacked area chart">
            <!-- Area paths -->
            <path d="M 10 120 L 55 105 L 100 110 L 145 95 L 190 85 L 235 115 L 280 125 L 280 130 L 10 130 Z" fill="color-mix(in srgb, var(--color-semantic-accent-control) 25%, transparent)"></path>
            <path d="M 10 90 L 55 85 L 100 80 L 145 70 L 190 60 L 235 95 L 280 100 L 280 125 L 235 115 L 190 85 L 145 95 L 100 110 L 55 105 L 10 120 Z" fill="var(--color-semantic-accent-control)" opacity="0.65"></path>

            <!-- Line strokes -->
            <path d="M 10 120 L 55 105 L 100 110 L 145 95 L 190 85 L 235 115 L 280 125" stroke="var(--color-semantic-accent-control)" stroke-width="1.5"></path>
            <path d="M 10 90 L 55 85 L 100 80 L 145 70 L 190 60 L 235 95 L 280 100" stroke="var(--color-semantic-text-primary)" stroke-width="2"></path>

            <!-- Baseline -->
            <line x1="10" y1="130" x2="280" y2="130" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></line>

            <!-- X axis labels -->
            <text x="10" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">M</text>
            <text x="55" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">T</text>
            <text x="100" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">W</text>
            <text x="145" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">T</text>
            <text x="190" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">F</text>
            <text x="235" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">S</text>
            <text x="280" y="139" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">S</text>
          </svg>
        `
        }
      </div>
    </div>
  `;
}

function attachAreaChartHandler(root) {
  root.querySelectorAll('[data-action="set-period"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = btn.getAttribute('data-period');
      root.querySelectorAll('[data-action="set-period"]').forEach((b) => {
        b.className = 'ds-button ds-button--ghost ds-button--xs';
      });
      btn.className = 'ds-button ds-button--secondary ds-button--xs';

      const totalEl = root.querySelector('[data-slot="total-users"]');
      const subEl = root.querySelector('[data-slot="subtitle"]');
      if (p === '7D') {
        if (totalEl) totalEl.textContent = '24,850';
        if (subEl) subEl.textContent = 'Last 7 days';
      } else if (p === '30D') {
        if (totalEl) totalEl.textContent = '98,420';
        if (subEl) subEl.textContent = 'Last 30 days';
      } else {
        if (totalEl) totalEl.textContent = '312,100';
        if (subEl) subEl.textContent = 'Last 90 days';
      }
    });
  });
}

export const Default = story(
  () => stage(renderAreaChartCard()),
  { postRender: attachAreaChartHandler }
);

export const Downtrend = story(() =>
  stage(
    renderAreaChartCard({
      totalUsers: '18,410',
      trend: '-4.2%',
      trendPositive: false,
      subtitle: 'Trailing 7 days (Post-incident)',
    })
  )
);

export const HighGrowth = story(() =>
  stage(
    renderAreaChartCard({
      totalUsers: '52,900',
      trend: '+48.9%',
      trendPositive: true,
      subtitle: 'Post-launch week',
    })
  )
);

export const EmptyData = story(() =>
  stage(
    renderAreaChartCard({
      totalUsers: '0',
      trend: null,
      subtitle: 'New workspace',
      empty: true,
    })
  )
);
