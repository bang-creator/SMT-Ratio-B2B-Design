import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Chart',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Chart / Default',
  stage(
    'AMS B2B Cluster Utilization',
    `<div class="ds-card ds-stack ds-brand-ams-b2b">
      <div class="ds-row">
        <strong>PTU Cluster Capacity Utilization</strong>
        <span class="ds-muted">Committed vs Actual</span>
      </div>
      <div class="ds-bar-chart">
        <div class="ds-bar-chart__row">
          <span>Cluster Alpha</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--80"></span></span>
          <strong>82%</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>Cluster Beta</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--60"></span></span>
          <strong>64%</strong>
        </div>
      </div>
    </div>`
  )
);
