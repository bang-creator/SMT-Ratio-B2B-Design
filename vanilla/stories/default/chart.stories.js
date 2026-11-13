import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Chart',
  parameters: { layout: 'padded' },
};

/* Source: Activity overview and usage analytics charts on platform.openai.com
 * Ground truth:
 * - Activity Area/Line Chart with gradient fill, cursor tracking, and interactive breakdown tooltip
 * - Daily costs vertical stacked bar chart by model with soft limit threshold
 * - Cumulative spend trajectory vs monthly budget limits
 * - Donut model distribution with center readout and interactive hover
 * - TTFT and latency performance comparison bar rows */

const areaPoints = JSON.stringify([
  { x: 60, y: 130, date: 'Fri, Nov 7, 2026', val: '55,200 requests', detail: '31.2k prompt / 24.0k completion' },
  { x: 135, y: 110, date: 'Sat, Nov 8, 2026', val: '80,450 requests', detail: '46.1k prompt / 34.3k completion' },
  { x: 210, y: 95, date: 'Sun, Nov 9, 2026', val: '100,120 requests', detail: '58.0k prompt / 42.1k completion' },
  { x: 285, y: 75, date: 'Mon, Nov 10, 2026', val: '125,800 requests', detail: '72.5k prompt / 53.3k completion' },
  { x: 360, y: 90, date: 'Tue, Nov 11, 2026', val: '105,400 requests', detail: '60.2k prompt / 45.2k completion' },
  { x: 435, y: 45, date: 'Wed, Nov 12, 2026', val: '165,920 requests', detail: '98.4k prompt / 67.5k completion' },
  { x: 510, y: 55, date: 'Thu, Nov 13, 2026', val: '152,100 requests', detail: '88.0k prompt / 64.1k completion' },
  { x: 580, y: 35, date: 'Fri, Nov 14, 2026', val: '180,640 requests', detail: '106.2k prompt / 74.4k completion' },
]);

export const Default = story(
  'Default / Application / Chart / Default',
  stage(
    'Dashboard Activity Volume (platform.openai.com Overview)',
    `<div class="ds-card ds-stack">
      <div class="ds-chart" data-ds-chart="area" data-points='${areaPoints}'>
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Activity</h3>
            <span class="ds-chart__subtitle">Total API request volume across all projects</span>
            <div class="ds-chart__summary">
              <span class="ds-chart__metric">1,428,390</span>
              <span class="ds-chart__trend">+14.2% vs previous 7d</span>
            </div>
          </div>
          <div class="ds-chart__toolbar">
            <div class="ds-row">
              <button class="ds-button ds-button--xs ds-button--outline" data-chart-range="7d" aria-pressed="true">7D</button>
              <button class="ds-button ds-button--xs ds-button--ghost" data-chart-range="14d" aria-pressed="false">14D</button>
              <button class="ds-button ds-button--xs ds-button--ghost" data-chart-range="30d" aria-pressed="false">30D</button>
            </div>
          </div>
        </div>

        <div class="ds-chart-area">
          <div class="ds-chart-area__stage" tabindex="0">
            <svg class="ds-chart-area__svg" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ds-chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-semantic-accent-control)" stop-opacity="0.28" />
                  <stop offset="100%" stop-color="var(--color-semantic-accent-control)" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Gridlines -->
              <line class="ds-chart-area__grid-line" x1="50" y1="20" x2="590" y2="20" />
              <line class="ds-chart-area__grid-line" x1="50" y1="58" x2="590" y2="58" />
              <line class="ds-chart-area__grid-line" x1="50" y1="95" x2="590" y2="95" />
              <line class="ds-chart-area__grid-line" x1="50" y1="133" x2="590" y2="133" />
              <line class="ds-chart-area__grid-line" x1="50" y1="170" x2="590" y2="170" />

              <!-- Y-Axis Labels -->
              <text class="ds-chart-area__axis-label" x="40" y="24" text-anchor="end">200k</text>
              <text class="ds-chart-area__axis-label" x="40" y="62" text-anchor="end">150k</text>
              <text class="ds-chart-area__axis-label" x="40" y="99" text-anchor="end">100k</text>
              <text class="ds-chart-area__axis-label" x="40" y="137" text-anchor="end">50k</text>
              <text class="ds-chart-area__axis-label" x="40" y="174" text-anchor="end">0</text>

              <!-- X-Axis Labels -->
              <text class="ds-chart-area__axis-label" x="60" y="192" text-anchor="middle">Nov 7</text>
              <text class="ds-chart-area__axis-label" x="135" y="192" text-anchor="middle">Nov 8</text>
              <text class="ds-chart-area__axis-label" x="210" y="192" text-anchor="middle">Nov 9</text>
              <text class="ds-chart-area__axis-label" x="285" y="192" text-anchor="middle">Nov 10</text>
              <text class="ds-chart-area__axis-label" x="360" y="192" text-anchor="middle">Nov 11</text>
              <text class="ds-chart-area__axis-label" x="435" y="192" text-anchor="middle">Nov 12</text>
              <text class="ds-chart-area__axis-label" x="510" y="192" text-anchor="middle">Nov 13</text>
              <text class="ds-chart-area__axis-label" x="580" y="192" text-anchor="middle">Nov 14</text>

              <!-- Filled Area -->
              <path class="ds-chart-area__path" d="M 60 170 L 60 130 C 95 125, 105 115, 135 110 C 170 105, 180 98, 210 95 C 245 92, 255 78, 285 75 C 320 72, 330 88, 360 90 C 395 92, 405 50, 435 45 C 470 40, 480 52, 510 55 C 545 58, 555 38, 580 35 L 580 170 Z" />

              <!-- Stroke Line -->
              <path class="ds-chart-area__line" d="M 60 130 C 95 125, 105 115, 135 110 C 170 105, 180 98, 210 95 C 245 92, 255 78, 285 75 C 320 72, 330 88, 360 90 C 395 92, 405 50, 435 45 C 470 40, 480 52, 510 55 C 545 58, 555 38, 580 35" />

              <!-- Interactive Tracking Cursor -->
              <line class="ds-chart-area__cursor-line" x1="0" y1="20" x2="0" y2="170" />
              <circle class="ds-chart-area__cursor-dot" cx="0" cy="0" r="5" />
            </svg>
          </div>
          <div class="ds-chart-tooltip" role="tooltip" aria-hidden="true"></div>
        </div>
      </div>
    </div>`
  )
);

export const DailyCosts = story(
  'Default / Application / Chart / DailyCosts',
  stage(
    'Daily Costs by Model (platform.openai.com/usage)',
    `<div class="ds-card ds-stack">
      <div class="ds-chart" data-ds-chart="stacked-bar">
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Daily spend</h3>
            <span class="ds-chart__subtitle">Nov 1 – Nov 14, 2026</span>
            <div class="ds-chart__summary">
              <span class="ds-chart__metric">$148.65</span>
              <span class="ds-muted">total billed this cycle</span>
            </div>
          </div>
          <div class="ds-chart__toolbar">
            <div class="ds-row">
              <span class="ds-muted" style... NO style>Group by:</span>
              <button class="ds-button ds-button--xs ds-button--outline" aria-pressed="true">Model</button>
              <button class="ds-button ds-button--xs ds-button--ghost" aria-pressed="false">Project</button>
              <button class="ds-button ds-button--xs ds-button--ghost" aria-pressed="false">API key</button>
            </div>
          </div>
        </div>

        <div class="ds-chart__legend">
          <span class="ds-chart__legend-item" data-legend-series="primary">
            <span class="ds-chart__legend-dot ds-chart__legend-dot--primary"></span>
            <span>gpt-4o</span>
          </span>
          <span class="ds-chart__legend-item" data-legend-series="secondary">
            <span class="ds-chart__legend-dot ds-chart__legend-dot--secondary"></span>
            <span>gpt-4o-mini</span>
          </span>
          <span class="ds-chart__legend-item" data-legend-series="tertiary">
            <span class="ds-chart__legend-dot ds-chart__legend-dot--tertiary"></span>
            <span>o3-mini</span>
          </span>
          <span class="ds-chart__legend-item" data-legend-series="muted">
            <span class="ds-chart__legend-dot ds-chart__legend-dot--muted"></span>
            <span>text-embedding-3</span>
          </span>
        </div>

        <div class="ds-chart-bars">
          <div class="ds-chart-bars__stage">
            <div class="ds-chart-bars__y-axis">
              <span>$20</span>
              <span>$15</span>
              <span>$10</span>
              <span>$5</span>
              <span>$0</span>
            </div>
            <div class="ds-chart-bars__grid">
              <span class="ds-chart-bars__grid-line"></span>
              <span class="ds-chart-bars__grid-line"></span>
              <span class="ds-chart-bars__grid-line"></span>
              <span class="ds-chart-bars__grid-line"></span>
              <span class="ds-chart-bars__grid-line"></span>
            </div>
            <div class="ds-chart-bars__threshold">
              <span class="ds-chart-bars__threshold-tag">Soft limit $15.00</span>
            </div>

            <!-- Columns 14 Days -->
            <div class="ds-chart-col" data-date="Nov 1, 2026" data-total="$9.20" data-breakdown='[{"label":"gpt-4o","val":"$5.40","color":"primary"},{"label":"gpt-4o-mini","val":"$2.20","color":"secondary"},{"label":"o3-mini","val":"$1.10","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-16" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-28" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 1</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 2, 2026" data-total="$7.50" data-breakdown='[{"label":"gpt-4o","val":"$4.20","color":"primary"},{"label":"gpt-4o-mini","val":"$2.10","color":"secondary"},{"label":"o3-mini","val":"$0.80","color":"tertiary"},{"label":"text-embedding-3","val":"$0.40","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-6" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-14" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-24" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 2</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 3, 2026" data-total="$11.40" data-breakdown='[{"label":"gpt-4o","val":"$7.00","color":"primary"},{"label":"gpt-4o-mini","val":"$2.80","color":"secondary"},{"label":"o3-mini","val":"$1.10","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-18" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-36" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 3</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 4, 2026" data-total="$8.80" data-breakdown='[{"label":"gpt-4o","val":"$5.10","color":"primary"},{"label":"gpt-4o-mini","val":"$2.30","color":"secondary"},{"label":"o3-mini","val":"$0.90","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-6" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-16" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-28" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 4</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 5, 2026" data-total="$13.20" data-breakdown='[{"label":"gpt-4o","val":"$8.10","color":"primary"},{"label":"gpt-4o-mini","val":"$3.20","color":"secondary"},{"label":"o3-mini","val":"$1.30","color":"tertiary"},{"label":"text-embedding-3","val":"$0.60","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-20" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-42" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 5</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 6, 2026" data-total="$10.10" data-breakdown='[{"label":"gpt-4o","val":"$6.00","color":"primary"},{"label":"gpt-4o-mini","val":"$2.60","color":"secondary"},{"label":"o3-mini","val":"$1.00","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-6" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-16" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-32" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 6</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 7, 2026" data-total="$6.40" data-breakdown='[{"label":"gpt-4o","val":"$3.80","color":"primary"},{"label":"gpt-4o-mini","val":"$1.70","color":"secondary"},{"label":"o3-mini","val":"$0.60","color":"tertiary"},{"label":"text-embedding-3","val":"$0.30","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-4" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-12" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-22" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 7</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 8, 2026" data-total="$8.90" data-breakdown='[{"label":"gpt-4o","val":"$5.30","color":"primary"},{"label":"gpt-4o-mini","val":"$2.30","color":"secondary"},{"label":"o3-mini","val":"$0.90","color":"tertiary"},{"label":"text-embedding-3","val":"$0.40","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-6" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-16" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-28" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 8</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 9, 2026" data-total="$12.60" data-breakdown='[{"label":"gpt-4o","val":"$7.60","color":"primary"},{"label":"gpt-4o-mini","val":"$3.20","color":"secondary"},{"label":"o3-mini","val":"$1.20","color":"tertiary"},{"label":"text-embedding-3","val":"$0.60","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-20" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-40" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 9</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 10, 2026" data-total="$14.10" data-breakdown='[{"label":"gpt-4o","val":"$8.70","color":"primary"},{"label":"gpt-4o-mini","val":"$3.50","color":"secondary"},{"label":"o3-mini","val":"$1.30","color":"tertiary"},{"label":"text-embedding-3","val":"$0.60","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-22" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-44" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 10</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 11, 2026" data-total="$11.80" data-breakdown='[{"label":"gpt-4o","val":"$7.20","color":"primary"},{"label":"gpt-4o-mini","val":"$2.90","color":"secondary"},{"label":"o3-mini","val":"$1.20","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-18" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-38" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 11</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 12, 2026" data-total="$14.85" data-breakdown='[{"label":"gpt-4o","val":"$9.20","color":"primary"},{"label":"gpt-4o-mini","val":"$3.85","color":"secondary"},{"label":"o3-mini","val":"$1.30","color":"tertiary"},{"label":"text-embedding-3","val":"$0.50","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-24" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-46" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 12</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 13, 2026" data-total="$12.90" data-breakdown='[{"label":"gpt-4o","val":"$7.80","color":"primary"},{"label":"gpt-4o-mini","val":"$3.30","color":"secondary"},{"label":"o3-mini","val":"$1.20","color":"tertiary"},{"label":"text-embedding-3","val":"$0.60","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-22" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-40" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 13</span>
            </div>

            <div class="ds-chart-col" data-date="Nov 14, 2026" data-total="$15.60" data-breakdown='[{"label":"gpt-4o","val":"$9.80","color":"primary"},{"label":"gpt-4o-mini","val":"$3.90","color":"secondary"},{"label":"o3-mini","val":"$1.30","color":"tertiary"},{"label":"text-embedding-3","val":"$0.60","color":"muted"}]'>
              <div class="ds-chart-col__track">
                <div class="ds-chart-seg ds-chart-seg--muted ds-h-4" data-series="muted"></div>
                <div class="ds-chart-seg ds-chart-seg--tertiary ds-h-8" data-series="tertiary"></div>
                <div class="ds-chart-seg ds-chart-seg--secondary ds-h-26" data-series="secondary"></div>
                <div class="ds-chart-seg ds-chart-seg--primary ds-h-48" data-series="primary"></div>
              </div>
              <span class="ds-chart-col__label">Nov 14</span>
            </div>
          </div>
          <div class="ds-chart-tooltip" role="tooltip" aria-hidden="true"></div>
        </div>
      </div>
    </div>`
  )
);

export const CumulativeSpend = story(
  'Default / Application / Chart / CumulativeSpend',
  stage(
    'Cumulative Spend vs Monthly Budget (platform.openai.com Billing)',
    `<div class="ds-card ds-stack">
      <div class="ds-chart">
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Cumulative monthly spend</h3>
            <span class="ds-chart__subtitle">Billing period: Nov 1 – Nov 30, 2026</span>
            <div class="ds-chart__summary">
              <span class="ds-chart__metric">$84.20</span>
              <span class="ds-muted">of $120.00 monthly limit (70% pace)</span>
            </div>
          </div>
          <div class="ds-chart__toolbar">
            <span class="ds-badge ds-badge--subtle">Pacing normally</span>
          </div>
        </div>

        <div class="ds-chart-area">
          <div class="ds-chart-area__stage">
            <svg class="ds-chart-area__svg" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ds-chart-cum-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-semantic-chart-series-primary)" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="var(--color-semantic-chart-series-primary)" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Hard Limit Reference Line -->
              <line class="ds-chart-area__grid-line" x1="50" y1="30" x2="590" y2="30" stroke="var(--color-semantic-chart-threshold)" />
              <text class="ds-chart-area__axis-label" x="40" y="34" text-anchor="end">Hard $120</text>

              <!-- Soft Limit Reference Line -->
              <line class="ds-chart-area__grid-line" x1="50" y1="60" x2="590" y2="60" stroke="var(--color-semantic-chart-series-quaternary)" />
              <text class="ds-chart-area__axis-label" x="40" y="64" text-anchor="end">Soft $100</text>

              <!-- Mid Gridline -->
              <line class="ds-chart-area__grid-line" x1="50" y1="110" x2="590" y2="110" />
              <text class="ds-chart-area__axis-label" x="40" y="114" text-anchor="end">$60</text>

              <!-- Baseline -->
              <line class="ds-chart-area__grid-line" x1="50" y1="170" x2="590" y2="170" />
              <text class="ds-chart-area__axis-label" x="40" y="174" text-anchor="end">$0</text>

              <!-- X-Axis Labels -->
              <text class="ds-chart-area__axis-label" x="60" y="192" text-anchor="middle">Nov 1</text>
              <text class="ds-chart-area__axis-label" x="180" y="192" text-anchor="middle">Nov 7</text>
              <text class="ds-chart-area__axis-label" x="310" y="192" text-anchor="middle">Nov 14 (Today)</text>
              <text class="ds-chart-area__axis-label" x="450" y="192" text-anchor="middle">Nov 21</text>
              <text class="ds-chart-area__axis-label" x="580" y="192" text-anchor="middle">Nov 30</text>

              <!-- Actual Cumulative Spend Area (Nov 1 to Nov 14) -->
              <path class="ds-chart-area__path" fill="url(#ds-chart-cum-grad)" d="M 60 170 L 60 162 L 100 154 L 140 144 L 180 132 L 220 120 L 260 106 L 310 92 L 310 170 Z" />

              <!-- Actual Cumulative Spend Stroke -->
              <path class="ds-chart-area__line" d="M 60 162 L 100 154 L 140 144 L 180 132 L 220 120 L 260 106 L 310 92" />

              <!-- Projected Trajectory (Dashed line to end of month) -->
              <path class="ds-chart-area__projected" d="M 310 92 L 360 80 L 410 68 L 470 56 L 530 45 L 580 38" />

              <!-- Current Day Pin Dot -->
              <circle cx="310" cy="92" r="5" fill="var(--color-semantic-chart-series-primary)" stroke="var(--color-semantic-background-surface)" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>`
  )
);

export const ModelDistribution = story(
  'Default / Application / Chart / ModelDistribution',
  stage(
    'Spend Distribution by Model (platform.openai.com/usage)',
    `<div class="ds-card ds-stack">
      <div class="ds-chart" data-ds-chart="donut">
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Model spend distribution</h3>
            <span class="ds-chart__subtitle">Past 30 days cumulative billing breakdown</span>
          </div>
        </div>

        <div class="ds-chart-donut">
          <div class="ds-chart-donut__graphic">
            <svg class="ds-chart-donut__svg" viewBox="0 0 170 170">
              <!-- Series 1: gpt-4o (58% -> stroke-dasharray 218.66 377) -->
              <circle class="ds-chart-donut__segment ds-chart-donut__segment--primary" cx="85" cy="85" r="60" stroke-dasharray="218.66 377" stroke-dashoffset="0" data-series="primary" data-label="gpt-4o" data-val="$86.20 (58%)"></circle>
              <!-- Series 2: gpt-4o-mini (24% -> stroke-dasharray 90.48 377, offset -218.66) -->
              <circle class="ds-chart-donut__segment ds-chart-donut__segment--secondary" cx="85" cy="85" r="60" stroke-dasharray="90.48 377" stroke-dashoffset="-218.66" data-series="secondary" data-label="gpt-4o-mini" data-val="$35.65 (24%)"></circle>
              <!-- Series 3: o3-mini (12% -> stroke-dasharray 45.24 377, offset -309.14) -->
              <circle class="ds-chart-donut__segment ds-chart-donut__segment--tertiary" cx="85" cy="85" r="60" stroke-dasharray="45.24 377" stroke-dashoffset="-309.14" data-series="tertiary" data-label="o3-mini" data-val="$17.85 (12%)"></circle>
              <!-- Series 4: text-embedding-3 (6% -> stroke-dasharray 22.62 377, offset -354.38) -->
              <circle class="ds-chart-donut__segment ds-chart-donut__segment--muted" cx="85" cy="85" r="60" stroke-dasharray="22.62 377" stroke-dashoffset="-354.38" data-series="muted" data-label="text-embedding-3" data-val="$8.95 (6%)"></circle>
            </svg>
            <div class="ds-chart-donut__center">
              <span class="ds-chart-donut__center-value">$148.65</span>
              <span class="ds-chart-donut__center-label">Total spend</span>
            </div>
          </div>

          <div class="ds-chart-donut__legend">
            <div class="ds-chart-donut__legend-row" data-series="primary">
              <div class="ds-chart-donut__legend-label">
                <span class="ds-chart__legend-dot ds-chart__legend-dot--primary"></span>
                <strong>gpt-4o</strong>
              </div>
              <span class="ds-chart-donut__legend-val">$86.20 (58%)</span>
            </div>

            <div class="ds-chart-donut__legend-row" data-series="secondary">
              <div class="ds-chart-donut__legend-label">
                <span class="ds-chart__legend-dot ds-chart__legend-dot--secondary"></span>
                <strong>gpt-4o-mini</strong>
              </div>
              <span class="ds-chart-donut__legend-val">$35.65 (24%)</span>
            </div>

            <div class="ds-chart-donut__legend-row" data-series="tertiary">
              <div class="ds-chart-donut__legend-label">
                <span class="ds-chart__legend-dot ds-chart__legend-dot--tertiary"></span>
                <strong>o3-mini</strong>
              </div>
              <span class="ds-chart-donut__legend-val">$17.85 (12%)</span>
            </div>

            <div class="ds-chart-donut__legend-row" data-series="muted">
              <div class="ds-chart-donut__legend-label">
                <span class="ds-chart__legend-dot ds-chart__legend-dot--muted"></span>
                <strong>text-embedding-3</strong>
              </div>
              <span class="ds-chart-donut__legend-val">$8.95 (6%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>`
  )
);

export const Comparison = story(
  'Default / Application / Chart / Comparison',
  stage(
    'Model Latency Breakdown (TTFT vs Generation)',
    `<div class="ds-card ds-stack">
      <div class="ds-chart">
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Model Latency & Throughput (TTFT)</h3>
            <span class="ds-chart__subtitle">Median Time to First Token and Token Generation Time (ms)</span>
          </div>
          <div class="ds-chart__legend">
            <span class="ds-chart__legend-item">
              <span class="ds-chart__legend-dot ds-chart__legend-dot--primary"></span>
              <span>TTFT</span>
            </span>
            <span class="ds-chart__legend-item">
              <span class="ds-chart__legend-dot ds-chart__legend-dot--secondary"></span>
              <span>Generation</span>
            </span>
          </div>
        </div>

        <div class="ds-bar-chart">
          <div class="ds-bar-chart__row" title="gpt-4o: 240ms TTFT, 460ms Generation (700ms total)">
            <span>gpt-4o</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--25"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--40"></span>
            </div>
            <strong>240ms</strong>
          </div>

          <div class="ds-bar-chart__row" title="gpt-4o-mini: 140ms TTFT, 280ms Generation (420ms total)">
            <span>gpt-4o-mini</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--15"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--25"></span>
            </div>
            <strong>140ms</strong>
          </div>

          <div class="ds-bar-chart__row" title="o3-mini: 420ms TTFT (reasoning), 380ms Generation (800ms total)">
            <span>o3-mini</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--40"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--35"></span>
            </div>
            <strong>420ms</strong>
          </div>
        </div>
      </div>
    </div>`
  )
);
