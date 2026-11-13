import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Link',
  parameters: { layout: 'padded' },
};

/* Source: Navigation and inline docs links on platform.openai.com
 * Ground truth:
 * - Color: text-primary or accent-control
 * - Underline: offset 3px on hover or default
 * - Focus: visible focus ring */

export const Default = story(
  'Default / Shared / Link / Default',
  stage(
    'Standard Text Link',
    `<div class="ds-stack">
      <p>Explore the complete API reference in the <a href="#" class="ds-link">developer documentation</a> for parameter schemas.</p>
    </div>`
  )
);

export const External = story(
  'Default / Shared / Link / External',
  stage(
    'External Documentation Link',
    `<div class="ds-row">
      <a href="https://platform.openai.com/docs" target="_blank" rel="noopener noreferrer" class="ds-link ds-row">
        <span>View OpenAI Cookbook</span>
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
      </a>
    </div>`
  )
);

export const Subtle = story(
  'Default / Shared / Link / Subtle',
  stage(
    'Subtle Secondary Link',
    `<div class="ds-stack">
      <p class="ds-muted">Need higher rate limits? <a href="#" class="ds-link ds-link--subtle">Contact enterprise sales</a> to request custom tier access.</p>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Link / Disabled',
  stage(
    'Disabled Link',
    `<div class="ds-row">
      <a href="#" class="ds-link" aria-disabled="true" tabindex="-1">Manage legacy credentials</a>
    </div>`
  )
);
