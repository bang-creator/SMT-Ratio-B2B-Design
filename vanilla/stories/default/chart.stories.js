import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Chart',
  parameters: { layout: 'padded' },
};

/* Source: Usage analytics charts on platform.openai.com/usage
 * Ground truth:
 * - Bar rows with day label, proportional track fill, and numeric count
 * - Colors: text-primary or accent-control */

export const Default = story(
  'Default / Application / Chart / Default',
  stage(
    'Daily Request Volume Chart',
    `<div class="ds-card ds-stack">
      <div class="ds-row">
        <strong>Requests per day</strong>
        <span class="ds-muted">Past 5 days</span>
      </div>
      <div class="ds-bar-chart">
        <div class="ds-bar-chart__row">
          <span>Mon</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--80"></span></span>
          <strong>84k</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>Tue</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--60"></span></span>
          <strong>57k</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>Wed</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--90"></span></span>
          <strong>92k</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>Thu</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--75"></span></span>
          <strong>74k</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>Fri</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--100"></span></span>
          <strong>108k</strong>
        </div>
      </div>
    </div>`
  )
);

export const Comparison = story(
  'Default / Application / Chart / Comparison',
  stage(
    'Model Latency Comparison (TTFT)',
    `<div class="ds-card ds-stack">
      <div class="ds-row">
        <strong>Time to First Token (TTFT)</strong>
        <span class="ds-muted">Median latency (ms)</span>
      </div>
      <div class="ds-bar-chart">
        <div class="ds-bar-chart__row">
          <span>gpt-4o</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--40"></span></span>
          <strong>240ms</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>gpt-4o-mini</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--25"></span></span>
          <strong>150ms</strong>
        </div>
        <div class="ds-bar-chart__row">
          <span>o3-mini</span>
          <span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--70"></span></span>
          <strong>420ms</strong>
        </div>
      </div>
    </div>`
  )
);
