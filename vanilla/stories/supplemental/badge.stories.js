import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Badge',
  parameters: { layout: 'padded' },
};

/* Source: Status indicators and metadata tags across platform.openai.com
 * Ground truth:
 * - 24px height standard, 18px compact
 * - Pill shape radius-full, uppercase / small font */

export const Default = story(
  'Default / Supplemental / Badge / Default',
  stage(
    'Neutral Metadata Badge',
    `<div class="ds-row">
      <span class="ds-badge">Default</span>
      <span class="ds-badge">Beta</span>
      <span class="ds-badge">Tier 4</span>
    </div>`
  )
);

export const Active = story(
  'Default / Supplemental / Badge / Active',
  stage(
    'Active Accent Badge',
    `<div class="ds-row">
      <span class="ds-badge ds-badge--active">Active</span>
      <span class="ds-badge ds-badge--active">+14.2%</span>
    </div>`
  )
);

export const Danger = story(
  'Default / Supplemental / Badge / Danger',
  stage(
    'Critical Status Badge',
    `<div class="ds-row">
      <span class="ds-badge ds-badge--danger">Deprecated</span>
      <span class="ds-badge ds-badge--danger">Suspended</span>
    </div>`
  )
);

export const Small = story(
  'Default / Supplemental / Badge / Small',
  stage(
    'Compact 18px Badge',
    `<div class="ds-row">
      <span class="ds-badge ds-badge--sm">v2.0</span>
      <span class="ds-badge ds-badge--sm ds-badge--active">Live</span>
    </div>`
  )
);
