import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 148 Response time AUI',
  parameters: { layout: 'padded' },
};

function renderLineChartCard({
  title = 'Response time',
  percentile = 'p50',
  latency = '190 ms',
  badgeVariant = 'subtle', // 'subtle' | 'warning' | 'success' | 'danger'
  isSpike = false,
  isLow = false,
  statusNotice = null,
} = {}) {
  const linePath = isSpike
    ? 'M 20 80 C 50 82, 60 85, 76 80 C 100 70, 115 40, 132 20 C 160 12, 175 10, 188 12 C 215 15, 230 45, 244 65 C 270 75, 285 80, 300 82'
    : isLow
      ? 'M 20 100 C 50 102, 60 105, 76 102 C 100 98, 115 95, 132 96 C 160 92, 175 90, 188 92 C 215 95, 230 98, 244 100 C 270 102, 285 104, 300 102'
      : 'M 20 85 C 50 90, 60 95, 76 92 C 100 80, 115 60, 132 55 C 160 40, 175 25, 188 25 C 215 25, 230 45, 244 48 C 270 55, 285 70, 300 75';

  const points = isSpike
    ? [[20, 80], [76, 80], [132, 20], [188, 12], [244, 65], [300, 82]]
    : isLow
      ? [[20, 100], [76, 102], [132, 96], [188, 92], [244, 100], [300, 102]]
      : [[20, 85], [76, 92], [132, 55], [188, 25], [244, 48], [300, 75]];

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <div>
          <h3 class="ds-gen-chart-card__title">${title} (${percentile})</h3>
          <span class="ds-text-xs ds-text-secondary">Average over 24 hours</span>
        </div>
        <div class="ds-flex ds-items-center ds-gap-1">
          <button type="button" class="ds-button ${percentile === 'p50' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-pct" data-pct="p50">p50</button>
          <button type="button" class="ds-button ${percentile === 'p95' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-pct" data-pct="p95">p95</button>
          <button type="button" class="ds-button ${percentile === 'p99' ? 'ds-button--secondary' : 'ds-button--ghost'} ds-button--xs" data-action="set-pct" data-pct="p99">p99</button>
        </div>
      </div>

      <div class="ds-flex ds-items-baseline ds-gap-3 ds-mt-2">
        <span class="ds-text-heading-xl ds-text-bold" data-slot="latency-val">${latency}</span>
        <span class="ds-badge ds-badge--${badgeVariant} ds-badge--sm" data-slot="latency-badge">
          ${percentile.toUpperCase()} Target: &lt; 250ms
        </span>
      </div>

      ${
        statusNotice
          ? `
        <div class="ds-mt-2 ds-p-2 ds-rounded-md ds-bg-surface-secondary ds-text-xs ds-text-secondary">
          ${statusNotice}
        </div>
      `
          : ''
      }

      <div class="ds-gen-chart-card__chart-wrapper ds-mt-2">
        <svg viewBox="0 0 320 130" fill="none" class="ds-gen-chart-card__svg" aria-label="${title} line chart">
          <!-- Grid lines -->
          <line x1="20" y1="20" x2="300" y2="20" stroke="var(--color-semantic-border-subtle)" stroke-width="1" stroke-dasharray="2 2"></line>
          <line x1="20" y1="65" x2="300" y2="65" stroke="var(--color-semantic-border-subtle)" stroke-width="1" stroke-dasharray="2 2"></line>
          <line x1="20" y1="110" x2="300" y2="110" stroke="var(--color-semantic-border-subtle)" stroke-width="1"></line>

          <!-- Smooth line -->
          <path d="${linePath}" stroke="var(--color-semantic-chart-series-primary)" stroke-width="2"></path>

          <!-- Points -->
          ${points.map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="3" fill="var(--color-semantic-chart-series-primary)"></circle>`).join('\n          ')}

          <!-- Labels -->
          <text x="20" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">12a</text>
          <text x="76" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">4a</text>
          <text x="132" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">8a</text>
          <text x="188" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">12p</text>
          <text x="244" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">4p</text>
          <text x="300" y="124" fill="var(--color-semantic-text-secondary)" font-size="9" text-anchor="middle">8p</text>
        </svg>
      </div>
    </div>
  `;
}

function attachLineChartHandler(root) {
  root.querySelectorAll('[data-action="set-pct"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pct = btn.getAttribute('data-pct');
      root.querySelectorAll('[data-action="set-pct"]').forEach((b) => {
        b.className = 'ds-button ds-button--ghost ds-button--xs';
      });
      btn.className = 'ds-button ds-button--secondary ds-button--xs';

      const latEl = root.querySelector('[data-slot="latency-val"]');
      const badge = root.querySelector('[data-slot="latency-badge"]');
      const titleEl = root.querySelector('.ds-gen-chart-card__title');

      if (titleEl) titleEl.textContent = `Response time (${pct})`;

      if (pct === 'p50') {
        if (latEl) latEl.textContent = '190 ms';
        if (badge) {
          badge.className = 'ds-badge ds-badge--subtle ds-badge--sm';
          badge.textContent = 'P50 Target: < 250ms';
        }
      } else if (pct === 'p95') {
        if (latEl) latEl.textContent = '380 ms';
        if (badge) {
          badge.className = 'ds-badge ds-badge--warning ds-badge--sm';
          badge.textContent = 'P95 Target: < 400ms';
        }
      } else {
        if (latEl) latEl.textContent = '840 ms';
        if (badge) {
          badge.className = 'ds-badge ds-badge--danger ds-badge--sm';
          badge.textContent = 'P99 Target: < 600ms';
        }
      }
    });
  });
}

export const Default = story(
  () => stage(renderLineChartCard()),
  { postRender: attachLineChartHandler }
);

export const Spike = story(() =>
  stage(
    renderLineChartCard({
      percentile: 'p99',
      latency: '840 ms',
      badgeVariant: 'danger',
      isSpike: true,
      statusNotice: 'Spike caused by downstream cache invalidation at 12:30 PM.',
    })
  )
);

export const LowLatency = story(() =>
  stage(
    renderLineChartCard({
      latency: '42 ms',
      badgeVariant: 'success',
      isLow: true,
      statusNotice: 'Cloudflare edge caching active (99.4% hit ratio).',
    })
  )
);

export const SLAExceeded = story(() =>
  stage(
    renderLineChartCard({
      percentile: 'p99',
      latency: '1,420 ms',
      badgeVariant: 'danger',
      isSpike: true,
      statusNotice: 'Critical SLA breach: Database pool exhaustion on cluster us-east-1.',
    })
  )
);
