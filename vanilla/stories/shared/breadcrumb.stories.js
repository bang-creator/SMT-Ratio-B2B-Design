import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Breadcrumb',
  parameters: { layout: 'padded' },
};

/* Source: Navigation headers on platform.openai.com
 * Ground truth:
 * - Font-size: 14px (var(--font-size-sm))
 * - Separator: slash or subtle glyph
 * - Active page: bold text-primary */

export const Default = story(
  'Default / Shared / Breadcrumb / Default',
  stage(
    'Standard Breadcrumb',
    `<nav class="ds-breadcrumb" aria-label="Breadcrumb">
      <a href="#" class="ds-breadcrumb__link">Workspace</a>
      <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      <a href="#" class="ds-breadcrumb__link">Fine-tuning</a>
      <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      <strong aria-current="page">ft:gpt-4o-mini-2024-07-18</strong>
    </nav>`
  )
);

export const DeepPath = story(
  'Default / Shared / Breadcrumb / Deep Path',
  stage(
    'Deep Nested Hierarchy',
    `<nav class="ds-breadcrumb" aria-label="Breadcrumb">
      <a href="#" class="ds-breadcrumb__link">Default Project</a>
      <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      <a href="#" class="ds-breadcrumb__link">Storage</a>
      <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      <a href="#" class="ds-breadcrumb__link">Files</a>
      <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      <strong aria-current="page">training-dataset-v3.jsonl</strong>
    </nav>`
  )
);
