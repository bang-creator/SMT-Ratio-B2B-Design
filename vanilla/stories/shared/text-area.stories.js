import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Text Area',
  parameters: { layout: 'padded' },
};

/* Source: Multiline prompt input on platform.openai.com/playground
 * Ground truth:
 * - Inset box-shadow: 1px var(--color-semantic-border-default)
 * - Hover: 1px var(--color-semantic-border-strong)
 * - Focus: 1px var(--color-semantic-ring-focus)
 * - Radius: var(--radius-md) (8px)
 * - Vertical resize enabled, min-height 96px */

export const Default = story(
  'Default / Shared / Text Area / Default',
  stage(
    'Standard Text Area',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">System prompt</span>
        <textarea class="ds-textarea" placeholder="You are a helpful assistant that writes clean code..."></textarea>
      </label>
    </div>`
  )
);

export const WithHelper = story(
  'Default / Shared / Text Area / With Helper',
  stage(
    'Text Area with Helper Description',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Instructions</span>
        <textarea class="ds-textarea" placeholder="Describe the model personality, formatting, and behavioral guidelines..."></textarea>
        <span class="ds-muted">Keep instructions clear, concise, and structured.</span>
      </label>
    </div>`
  )
);

export const Expanded = story(
  'Default / Shared / Text Area / Expanded',
  stage(
    'Large Multiline Input (160px)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Training data snippet (JSONL)</span>
        <textarea class="ds-textarea" rows="6" placeholder='{"messages": [{"role": "system", "content": "You are helpful."}]}'></textarea>
      </label>
    </div>`
  )
);

export const Invalid = story(
  'Default / Shared / Text Area / Invalid',
  stage(
    'Validation Error State',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Custom prompt</span>
        <textarea class="ds-textarea" aria-invalid="true" placeholder="Enter prompt..."></textarea>
        <span class="ds-field-error">Prompt content cannot exceed 4,096 characters</span>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Text Area / Disabled',
  stage(
    'Disabled Text Area',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Archived dataset description</span>
        <textarea class="ds-textarea" disabled>Fine-tuning dataset snapshot frozen on 2026-01-15. Read-only permissions enforced.</textarea>
      </label>
    </div>`
  )
);
