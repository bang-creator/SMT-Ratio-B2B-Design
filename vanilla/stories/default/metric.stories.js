import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Metric',
  parameters: { layout: 'padded' },
};

/* Source: Usage and billing metric cards on platform.openai.com/usage
 * Ground truth:
 * - Card container: 12px radius, elevated surface
 * - Value: bold headline font
 * - Trend: positive/negative percentage change */

export const Default = story(
  'Default / Application / Metric / Default',
  stage(
    'Standard KPI Metric Card',
    `<div class="ds-card ds-stack">
      <span class="ds-metric__label">Total API requests</span>
      <p class="ds-metric__value">1,482,900</p>
      <div class="ds-row">
        <span class="ds-badge ds-badge--active">+14.2%</span>
        <span class="ds-muted">vs previous 30 days</span>
      </div>
    </div>`
  )
);

export const TokenSpend = story(
  'Default / Application / Metric / Token Spend',
  stage(
    'Token Consumption Metric',
    `<div class="ds-card ds-stack">
      <span class="ds-metric__label">Prompt & completion tokens</span>
      <p class="ds-metric__value">84.2M</p>
      <div class="ds-row">
        <span class="ds-badge">$214.50 spend</span>
        <span class="ds-muted">85% of budget</span>
      </div>
    </div>`
  )
);

export const Compact = story(
  'Default / Application / Metric / Compact',
  stage(
    'Compact Metric Row',
    `<div class="ds-row">
      <div class="ds-card ds-stack">
        <span class="ds-metric__label">Active keys</span>
        <p class="ds-metric__value">12</p>
      </div>
      <div class="ds-card ds-stack">
        <span class="ds-metric__label">Rate limit tier</span>
        <p class="ds-metric__value">Tier 4</p>
      </div>
    </div>`
  )
);
