import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Tag',
  parameters: { layout: 'padded' },
};

/* Source: Status tags & filter chips on platform.openai.com
 * Ground truth:
 * - Badge: 24px height, full radius, secondary background
 * - Small: 20px height
 * - Filter chip: 32px standard compact with dismiss icon button */

export const Default = story(
  'Default / Shared / Tag / Default',
  stage(
    'Standard Pill Badges',
    `<div class="ds-row">
      <span class="ds-badge">Production</span>
      <span class="ds-badge">Staging</span>
      <span class="ds-badge">Evaluation</span>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Tag / Small',
  stage(
    'Compact Badges (20px)',
    `<div class="ds-row">
      <span class="ds-badge ds-badge--sm">v1.2</span>
      <span class="ds-badge ds-badge--sm">Latest</span>
      <span class="ds-badge ds-badge--sm">Deprecated</span>
    </div>`
  )
);

export const FilterChip = story(
  'Default / Shared / Tag / Filter Chip',
  stage(
    'Interactive Dismissible Filter Chip',
    `<div class="ds-row">
      <span class="ds-filter-chip">
        <span>model: gpt-4o</span>
        <button class="ds-icon-button" type="button" aria-label="Remove filter">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </span>
      <span class="ds-filter-chip">
        <span>status: completed</span>
        <button class="ds-icon-button" type="button" aria-label="Remove filter">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </span>
    </div>`
  )
);

export const Active = story(
  'Default / Shared / Tag / Active',
  stage(
    'Active / Highlighted Badge',
    `<div class="ds-row">
      <span class="ds-badge ds-badge--active">Active Organization</span>
      <span class="ds-badge">Archived</span>
    </div>`
  )
);
