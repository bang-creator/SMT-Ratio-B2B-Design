import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Chart',
  parameters: { layout: 'padded' },
};

/* Source: AMS B2B Enterprise PTU management and cluster telemetry */

const throughputPoints = JSON.stringify([
  { x: 60, y: 140, date: '00:00 UTC', val: '42,000 TPM', detail: 'Cluster Alpha: 84% utilized' },
  { x: 135, y: 110, date: '04:00 UTC', val: '68,500 TPM', detail: 'Cluster Alpha: 92% utilized' },
  { x: 210, y: 85, date: '08:00 UTC', val: '94,200 TPM', detail: 'Cluster Alpha: 96% utilized' },
  { x: 285, y: 70, date: '12:00 UTC', val: '118,000 TPM', detail: 'Cluster Alpha: 99% utilized' },
  { x: 360, y: 60, date: '16:00 UTC', val: '135,400 TPM', detail: 'Cluster Alpha: 98% utilized' },
  { x: 435, y: 80, date: '20:00 UTC', val: '104,200 TPM', detail: 'Cluster Alpha: 91% utilized' },
  { x: 510, y: 120, date: '22:00 UTC', val: '58,000 TPM', detail: 'Cluster Alpha: 86% utilized' },
  { x: 580, y: 135, date: '24:00 UTC', val: '45,000 TPM', detail: 'Cluster Alpha: 82% utilized' },
]);

export const Default = story(
  'AMS B2B / Application / Chart / Default',
  stage(
    'AMS B2B PTU Cluster Capacity Utilization',
    `<div class="ds-card ds-stack ds-brand-ams-b2b">
      <div class="ds-chart">
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">PTU Cluster Capacity Utilization</h3>
            <span class="ds-chart__subtitle">Dedicated Provisioned Throughput Units (Committed vs Burst)</span>
          </div>
          <div class="ds-chart__legend">
            <span class="ds-chart__legend-item">
              <span class="ds-chart__legend-dot ds-chart__legend-dot--primary"></span>
              <span>Committed Base</span>
            </span>
            <span class="ds-chart__legend-item">
              <span class="ds-chart__legend-dot ds-chart__legend-dot--secondary"></span>
              <span>Burst Buffer</span>
            </span>
          </div>
        </div>

        <div class="ds-bar-chart">
          <div class="ds-bar-chart__row" title="Cluster Alpha (us-east): 82% committed, 12% burst">
            <span>Cluster Alpha</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--80"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--15"></span>
            </div>
            <strong>94%</strong>
          </div>

          <div class="ds-bar-chart__row" title="Cluster Beta (eu-west): 64% committed, 8% burst">
            <span>Cluster Beta</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--60"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--10"></span>
            </div>
            <strong>70%</strong>
          </div>

          <div class="ds-bar-chart__row" title="Cluster Gamma (ap-northeast): 45% committed, 5% burst">
            <span>Cluster Gamma</span>
            <div class="ds-bar-chart__track--segmented">
              <span class="ds-bar-chart__seg ds-bar-chart__seg--primary ds-bar-chart__bar--40"></span>
              <span class="ds-bar-chart__seg ds-bar-chart__seg--secondary ds-bar-chart__bar--10"></span>
            </div>
            <strong>50%</strong>
          </div>
        </div>
      </div>
    </div>`
  )
);

export const Throughput = story(
  'AMS B2B / Application / Chart / Throughput',
  stage(
    'AMS B2B Real-time Provisioned Throughput (TPM)',
    `<div class="ds-card ds-stack ds-brand-ams-b2b">
      <div class="ds-chart" data-ds-chart="area" data-points='${throughputPoints}'>
        <div class="ds-chart__header">
          <div class="ds-chart__title-group">
            <h3 class="ds-chart__title">Provisioned Throughput (TPM)</h3>
            <span class="ds-chart__subtitle">Hourly Token Throughput across dedicated PTU nodes</span>
            <div class="ds-chart__summary">
              <span class="ds-chart__metric">135.4k TPM</span>
              <span class="ds-chart__trend">Peak throughput</span>
            </div>
          </div>
          <div class="ds-chart__toolbar">
            <span class="ds-badge ds-badge--subtle">Live telemetry</span>
          </div>
        </div>

        <div class="ds-chart-area">
          <div class="ds-chart-area__stage" tabindex="0">
            <svg class="ds-chart-area__svg" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ds-chart-ams-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--color-semantic-chart-series-secondary)" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="var(--color-semantic-chart-series-secondary)" stop-opacity="0" />
                </linearGradient>
              </defs>

              <line class="ds-chart-area__grid-line" x1="50" y1="20" x2="590" y2="20" />
              <line class="ds-chart-area__grid-line" x1="50" y1="60" x2="590" y2="60" />
              <line class="ds-chart-area__grid-line" x1="50" y1="100" x2="590" y2="100" />
              <line class="ds-chart-area__grid-line" x1="50" y1="140" x2="590" y2="140" />
              <line class="ds-chart-area__grid-line" x1="50" y1="170" x2="590" y2="170" />

              <text class="ds-chart-area__axis-label" x="40" y="24" text-anchor="end">150k</text>
              <text class="ds-chart-area__axis-label" x="40" y="64" text-anchor="end">120k</text>
              <text class="ds-chart-area__axis-label" x="40" y="104" text-anchor="end">80k</text>
              <text class="ds-chart-area__axis-label" x="40" y="144" text-anchor="end">40k</text>
              <text class="ds-chart-area__axis-label" x="40" y="174" text-anchor="end">0</text>

              <text class="ds-chart-area__axis-label" x="60" y="192" text-anchor="middle">00:00</text>
              <text class="ds-chart-area__axis-label" x="135" y="192" text-anchor="middle">04:00</text>
              <text class="ds-chart-area__axis-label" x="210" y="192" text-anchor="middle">08:00</text>
              <text class="ds-chart-area__axis-label" x="285" y="192" text-anchor="middle">12:00</text>
              <text class="ds-chart-area__axis-label" x="360" y="192" text-anchor="middle">16:00</text>
              <text class="ds-chart-area__axis-label" x="435" y="192" text-anchor="middle">20:00</text>
              <text class="ds-chart-area__axis-label" x="510" y="192" text-anchor="middle">22:00</text>
              <text class="ds-chart-area__axis-label" x="580" y="192" text-anchor="middle">24:00</text>

              <path class="ds-chart-area__path" fill="url(#ds-chart-ams-grad)" d="M 60 170 L 60 140 C 95 130, 105 118, 135 110 C 170 100, 180 90, 210 85 C 245 80, 255 72, 285 70 C 320 68, 330 62, 360 60 C 395 58, 405 75, 435 80 C 470 85, 480 115, 510 120 C 545 125, 555 132, 580 135 L 580 170 Z" />
              <path class="ds-chart-area__line" stroke="var(--color-semantic-chart-series-secondary)" d="M 60 140 C 95 130, 105 118, 135 110 C 170 100, 180 90, 210 85 C 245 80, 255 72, 285 70 C 320 68, 330 62, 360 60 C 395 58, 405 75, 435 80 C 470 85, 480 115, 510 120 C 545 125, 555 132, 580 135" />

              <line class="ds-chart-area__cursor-line" x1="0" y1="20" x2="0" y2="170" />
              <circle class="ds-chart-area__cursor-dot" cx="0" cy="0" r="5" fill="var(--color-semantic-chart-series-secondary)" />
            </svg>
          </div>
          <div class="ds-chart-tooltip" role="tooltip" aria-hidden="true"></div>
        </div>
      </div>
    </div>`
  )
);
