import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Tool Tips',
  parameters: { layout: 'padded' },
};

/* Source: Contextual help & icon tooltips on platform.openai.com
 * Ground truth from platform evidence:
 * - Trigger: Ghost info icon button (.ds-icon-button.ds-icon-button--ghost) with Lucide info icon
 * - Bubble: Elevated surface, subtle border, shadow-md, 6px radius (var(--radius-sm))
 * - Typography: 12px (var(--font-size-xs)), font-weight: 400 (var(--font-weight-normal))
 * - 8 Direction Placements: Top, Top-Start, Top-End, Bottom, Bottom-Start, Bottom-End, Left, Right
 * - Consolidated Default variant: Interactive trigger, 8-directional showcase, and disabled state */

const INFO_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

function renderTooltipPlacement(placement, label, tooltipText) {
  return `<div class="ds-tooltip-placement-item">
    <span class="ds-tooltip ds-tooltip--${placement}" data-visible="true">
      <button class="ds-icon-button ds-icon-button--ghost" type="button" aria-label="${label}">
        ${INFO_ICON}
      </button>
      <span class="ds-tooltip__content" role="tooltip">${tooltipText}</span>
    </span>
    <span class="ds-tooltip-placement-label">${label}</span>
  </div>`;
}

export const Default = story(
  'Default / Shared / Tool Tips / Default',
  stage(
    'Info Tooltip (Interactive, 8 Placements & Disabled State)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Info Tooltip -->
      <section class="ds-story-section">
<div class="ds-tooltip-demo-row">
          <span class="ds-tooltip ds-tooltip--top">
            <button class="ds-icon-button ds-icon-button--ghost" type="button" aria-label="Information">
              ${INFO_ICON}
            </button>
            <span class="ds-tooltip__content" role="tooltip">Automatic prompt caching retains prefix tokens for 5 minutes.</span>
          </span>
          <span class="ds-muted">Hover or focus the info icon to reveal tooltip</span>
        </div>
      </section>

      <!-- Placements: 8 Directions (Top, Top-Start, Top-End, Bottom, Bottom-Start, Bottom-End, Left, Right) -->
      <section class="ds-story-section">
<div class="ds-tooltip-placements-grid">
          <!-- 1. Top -->
          ${renderTooltipPlacement('top', 'Top', 'Tooltip on top')}

          <!-- 2. Top-Start -->
          ${renderTooltipPlacement('top-start', 'Top-Start', 'Tooltip on top-start')}

          <!-- 3. Top-End -->
          ${renderTooltipPlacement('top-end', 'Top-End', 'Tooltip on top-end')}

          <!-- 4. Bottom -->
          ${renderTooltipPlacement('bottom', 'Bottom', 'Tooltip on bottom')}

          <!-- 5. Bottom-Start -->
          ${renderTooltipPlacement('bottom-start', 'Bottom-Start', 'Tooltip on bottom-start')}

          <!-- 6. Bottom-End -->
          ${renderTooltipPlacement('bottom-end', 'Bottom-End', 'Tooltip on bottom-end')}

          <!-- 7. Left -->
          ${renderTooltipPlacement('left', 'Left', 'Tooltip on left')}

          <!-- 8. Right -->
          ${renderTooltipPlacement('right', 'Right', 'Tooltip on right')}
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover (No Tooltip) -->
      <section class="ds-story-section">
<div class="ds-tooltip-demo-row">
          <span class="ds-tooltip" data-disabled="true">
            <button class="ds-icon-button ds-icon-button--ghost" type="button" aria-label="Information (Disabled)" disabled>
              ${INFO_ICON}
            </button>
            <span class="ds-tooltip__content" role="tooltip">Disabled action tooltip</span>
          </span>
          <span class="ds-muted">Disabled info button displays unavailable cursor without tooltip</span>
        </div>
      </section>
    </div>`
  )
);
