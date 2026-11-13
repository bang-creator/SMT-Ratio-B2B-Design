import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Filter Chip',
  parameters: { layout: 'padded' },
};

/* Source: Usage and Logs filter row on platform.openai.com
 * Ground truth:
 * - 32px height, full radius, leading label, 28px dismiss button */

export const Default = story(
  'Default / Supplemental / Filter Chip / Default',
  stage(
    'Active Dismissible Filter Chip',
    `<div class="ds-row">
      <span class="ds-filter-chip">
        <span>Model: gpt-4o</span>
        <button class="ds-icon-button" aria-label="Remove filter" type="button">
          <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </span>
      <span class="ds-filter-chip">
        <span>Status: 200 OK</span>
        <button class="ds-icon-button" aria-label="Remove filter" type="button">
          <svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </span>
    </div>`
  )
);
