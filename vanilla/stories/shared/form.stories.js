import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Form',
  parameters: { layout: 'padded' },
};

/* Source: Project and organization settings forms on platform.openai.com
 * Ground truth:
 * - Stack spacing: gap var(--space-4)
 * - 32px inputs and buttons
 * - Inline validation helpers */

export const Default = story(
  'Default / Shared / Form / Default',
  stage(
    'Standard Settings Form',
    `<form class="ds-stack" onsubmit="return false;">
      <label>
        <span class="ds-label">Project name</span>
        <input type="text" class="ds-input" value="Production Platform API">
        <span class="ds-muted">Used to identify requests in usage reports</span>
      </label>
      <label>
        <span class="ds-label">Default inference model</span>
        <div class="ds-select" data-ds-select data-value="gpt-4o">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false">
            <span data-ds-value>gpt-4o</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button class="ds-select__option" role="option" data-value="gpt-4o" aria-selected="true">gpt-4o</button>
            <button class="ds-select__option" role="option" data-value="gpt-4o-mini" aria-selected="false">gpt-4o-mini</button>
          </div>
        </div>
      </label>
      <div class="ds-row">
        <button class="ds-button ds-button--ghost" type="button">Cancel</button>
        <button class="ds-button ds-button--primary" type="submit">Save changes</button>
      </div>
    </form>`
  )
);

export const WithValidation = story(
  'Default / Shared / Form / With Validation',
  stage(
    'Form with Validation Error',
    `<form class="ds-stack" onsubmit="return false;">
      <label>
        <span class="ds-label">Secret key name</span>
        <input type="text" class="ds-input" value="" aria-invalid="true" placeholder="Enter key name">
        <span class="ds-field-error">Key identifier is required</span>
      </label>
      <div class="ds-row">
        <button class="ds-button ds-button--ghost" type="button">Cancel</button>
        <button class="ds-button ds-button--primary" type="submit" disabled>Create secret key</button>
      </div>
    </form>`
  )
);
