import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Tool Tips',
  parameters: { layout: 'padded' },
};

/* Source: Platform hover tooltips on platform.openai.com
 * Ground truth:
 * - Elevated background, subtle border, shadow-md
 * - Radius: var(--radius-sm) (6px)
 * - Font-size: 12px (var(--font-size-xs))
 * - Trigger: hover or keyboard focus-within */

export const Default = story(
  'Default / Shared / Tool Tips / Default',
  stage(
    'Standard Tooltip on Action',
    `<div class="ds-row">
      <span class="ds-tooltip">
        <button class="ds-button ds-button--ghost" type="button">
          <span>Batch generate</span>
        </button>
        <span class="ds-tooltip__content" role="tooltip">Queue requests asynchronously</span>
      </span>
    </div>`
  )
);

export const OnIconButton = story(
  'Default / Shared / Tool Tips / On Icon Button',
  stage(
    'Tooltip on Compact Icon Button',
    `<div class="ds-row">
      <span class="ds-tooltip">
        <button class="ds-icon-button" type="button" aria-label="Copy key identifier">
          <svg viewBox="0 0 24 24" class="ds-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <span class="ds-tooltip__content" role="tooltip">Copy secret identifier</span>
      </span>
    </div>`
  )
);

export const Multiline = story(
  'Default / Shared / Tool Tips / Multiline',
  stage(
    'Detailed Explanatory Tooltip',
    `<div class="ds-row">
      <span class="ds-tooltip">
        <button class="ds-button ds-button--secondary" type="button">
          <span>Cache retention</span>
        </button>
        <span class="ds-tooltip__content" role="tooltip">Automatic prompt caching retains prefix tokens for 5 minutes of inactivity.</span>
      </span>
    </div>`
  )
);
