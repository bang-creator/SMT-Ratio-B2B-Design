import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Text Input',
  parameters: { layout: 'padded' },
};

/* Source: .Kepsx + .EzGXF on platform.openai.com
 * Ground truth:
 * - Height: 32px standard compact, 28px sm
 * - Border-radius: var(--radius-md) (8px), Pill: var(--radius-full)
 * - Padding: 0 12px (var(--space-3))
 * - Box-shadow: 1px inset var(--color-semantic-border-default)
 * - Hover: 1px inset var(--color-semantic-border-strong)
 * - Focus: 1px inset var(--color-semantic-ring-focus), outline: 0
 * - Invalid: 1px inset var(--color-semantic-text-danger) */

export const Default = story(
  'Default / Shared / Text Input / Default',
  stage(
    'Standard Text Input (32px Compact)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Project name</span>
        <input type="text" class="ds-input" placeholder="e.g. Acme Production API">
      </label>
    </div>`
  )
);

export const WithHelper = story(
  'Default / Shared / Text Input / With Helper',
  stage(
    'Text Input with Helper Description',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Endpoint URL</span>
        <input type="text" class="ds-input" value="https://api.openai.com/v1" placeholder="https://...">
        <span class="ds-muted">The base URL used for SDK client requests</span>
      </label>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Text Input / Small',
  stage(
    'Small Size (28px)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Key alias</span>
        <input type="text" class="ds-input ds-input--sm" placeholder="Short identifier">
      </label>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Text Input / Pill',
  stage(
    'Pill Shape (Full Radius)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Filter tags</span>
        <input type="text" class="ds-input ds-input--pill" placeholder="Type tag and press enter...">
      </label>
    </div>`
  )
);

export const Invalid = story(
  'Default / Shared / Text Input / Invalid',
  stage(
    'Validation Error State',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">API Key Name</span>
        <input type="text" class="ds-input" value="" aria-invalid="true" placeholder="Required key name">
        <span class="ds-field-error">Key name cannot be empty</span>
      </label>
    </div>`
  )
);

export const WithClearButton = story(
  'Default / Shared / Text Input / With Clear Button',
  stage(
    'Clearable Input (type to reveal ×)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Search or filter</span>
        <div class="ds-input-wrap" data-ds-clearable>
          <input type="text" class="ds-input" value="fine-tune-gpt-4o" placeholder="Enter query...">
          <button type="button" class="ds-clear-btn" aria-label="Clear input"><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg></button>
        </div>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Text Input / Disabled',
  stage(
    'Disabled Input',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Organization ID</span>
        <input type="text" class="ds-input" value="org-9xK2048XmzL" disabled>
      </label>
    </div>`
  )
);
