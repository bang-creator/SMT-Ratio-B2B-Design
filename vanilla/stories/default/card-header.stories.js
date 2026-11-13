import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Card Header',
  parameters: { layout: 'padded' },
};

/* Source: Card container headers on platform.openai.com
 * Ground truth:
 * - Title: 16px medium
 * - Muted description: 14px secondary
 * - Optional status badge or action control */

export const Default = story(
  'Default / Application / Card Header / Default',
  stage(
    'Standard Card Header',
    `<div class="ds-card">
      <div class="ds-card-header">
        <div class="ds-stack">
          <h3>Token usage overview</h3>
          <span class="ds-muted">Daily breakdown of prompt and completion activity</span>
        </div>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Export</button>
      </div>
      <div class="ds-card__body">
        <p class="ds-muted">Usage metrics will display inside the card canvas.</p>
      </div>
    </div>`
  )
);

export const WithBadge = story(
  'Default / Application / Card Header / With Badge',
  stage(
    'Card Header with Status Badge',
    `<div class="ds-card">
      <div class="ds-card-header">
        <div class="ds-row">
          <h3>Production deployment</h3>
          <span class="ds-badge ds-badge--active">Healthy</span>
        </div>
        <button class="ds-icon-button" type="button" aria-label="Settings">
          <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
    </div>`
  )
);
