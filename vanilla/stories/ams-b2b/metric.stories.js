import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Metric',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Metric / Default',
  stage(
    'AMS B2B Enterprise Throughput Metric',
    `<div class="ds-card ds-stack ds-brand-ams-b2b">
      <span class="ds-metric__label">Provisioned Throughput (PTU)</span>
      <p class="ds-metric__value">250 PTU</p>
      <div class="ds-row">
        <span class="ds-badge ds-badge--active">Dedicated Cluster</span>
        <span class="ds-muted">us-east-1 (N. Virginia)</span>
      </div>
    </div>`
  )
);
