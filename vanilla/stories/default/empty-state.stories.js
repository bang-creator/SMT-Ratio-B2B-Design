import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Empty State',
  parameters: { layout: 'padded' },
};

/* Source: Zero-data screens across platform.openai.com
 * Ground truth:
 * - Dashed container or centered card
 * - SVG icon, heading, descriptive body, and CTA button */

export const Default = story(
  'Default / Application / Empty State / Default',
  stage(
    'Standard Zero-Data State',
    `<div class="ds-empty">
      <svg viewBox="0 0 24 24" class="ds-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      <strong>No fine-tuning models found</strong>
      <p class="ds-muted">Fine-tune custom models tailored to your domain by uploading formatted training datasets.</p>
      <button class="ds-button ds-button--primary" type="button">Create fine-tune</button>
    </div>`
  )
);

export const Compact = story(
  'Default / Application / Empty State / Compact',
  stage(
    'Compact Empty Resource Box',
    `<div class="ds-card ds-empty">
      <strong>No active webhooks</strong>
      <p class="ds-muted">Configure endpoint listeners to receive event notifications.</p>
      <button class="ds-button ds-button--secondary ds-button--sm" type="button">Add endpoint</button>
    </div>`
  )
);
