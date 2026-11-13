import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Icon',
  parameters: { layout: 'padded' },
};

/* Source: Navigation and action icons across platform.openai.com
 * Ground truth:
 * - 16px standard size, 2px stroke, currentColor */

export const Default = story(
  'Default / Supplemental / Icon / Default',
  stage(
    'Standard 16px Action Icons',
    `<div class="ds-row">
      <svg viewBox="0 0 24 24" class="ds-icon" aria-label="Overview"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <svg viewBox="0 0 24 24" class="ds-icon" aria-label="API Keys"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      <svg viewBox="0 0 24 24" class="ds-icon" aria-label="Check"><polyline points="20 6 9 17 4 12"/></svg>
      <svg viewBox="0 0 24 24" class="ds-icon" aria-label="Close"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </div>`
  )
);
