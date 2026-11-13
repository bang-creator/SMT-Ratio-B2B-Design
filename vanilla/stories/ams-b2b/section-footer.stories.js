import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Section Footer',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Section Footer / Default',
  stage(
    'AMS B2B Section Footer',
    `<footer class="ds-row ds-brand-ams-b2b">
      <span class="ds-muted">SLA Commitment: 99.95% uptime verified</span>
      <button class="ds-button ds-button--secondary ds-button--sm" type="button">Download SLA Report</button>
    </footer>`
  )
);
