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

const EYE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const KEY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3"></path></svg>`;

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

export const Password = story(
  'Default / Shared / Text Input / Password',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label>
            <span class="ds-label">API Secret Token</span>
            <div class="ds-input-wrap" data-ds-password-wrap>
              <input type="password" class="ds-input" value="sk-antigravity-999-sec" placeholder="Enter API secret">
              <button type="button" class="ds-password-toggle" data-ds-password-toggle aria-label="Show password">
                ${EYE_ICON}
              </button>
            </div>
          </label>
          <label>
            <span class="ds-label">Disabled</span>
            <div class="ds-input-wrap" data-ds-password-wrap data-disabled="true">
              <input type="password" class="ds-input" value="sk-antigravity-locked" placeholder="Enter API secret" disabled>
              <button type="button" class="ds-password-toggle" data-ds-password-toggle aria-label="Show password" disabled>
                ${EYE_ICON}
              </button>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);

export const WithSupportIcon = story(
  'Default / Shared / Text Input / With Support Icon',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label>
            <span class="ds-label">Monthly budget limit</span>
            <div class="ds-input-group">
              <span class="ds-input-group__prefix">$</span>
              <input type="text" class="ds-input" value="100" placeholder="0" aria-label="Monthly budget limit">
            </div>
          </label>
          <label>
            <span class="ds-label">Key alias</span>
            <div class="ds-input-group">
              <span class="ds-input-group__prefix">${KEY_ICON}</span>
              <input type="text" class="ds-input" placeholder="e.g. staging-vector-store-key" aria-label="Key alias">
            </div>
          </label>
          <label>
            <span class="ds-label">Disabled</span>
            <div class="ds-input-group" data-disabled="true">
              <span class="ds-input-group__prefix">$</span>
              <input type="text" class="ds-input" value="500" disabled aria-label="Allocated credit tier">
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);

export const WithUnit = story(
  'Default / Shared / Text Input / With Unit',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label>
            <span class="ds-label">Confidence threshold</span>
            <div class="ds-input-group">
              <input type="text" class="ds-input" value="80" placeholder="0" inputmode="numeric" aria-label="Confidence threshold">
              <span class="ds-input-group__unit">%</span>
            </div>
          </label>
          <label>
            <span class="ds-label">Request timeout</span>
            <div class="ds-input-group">
              <input type="text" class="ds-input" value="30,000" placeholder="0" inputmode="numeric" aria-label="Request timeout">
              <span class="ds-input-group__unit">ms</span>
            </div>
          </label>
          <label>
            <span class="ds-label">Disabled</span>
            <div class="ds-input-group" data-disabled="true">
              <input type="text" class="ds-input" value="100" disabled aria-label="Fixed quota allocation">
              <span class="ds-input-group__unit">%</span>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);

export const Multiline = story(
  'Default / Shared / Text Input / Multiline',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label>
            <span class="ds-label">Notification email recipients</span>
            <textarea class="ds-textarea ds-input--multiline" placeholder="alerts@acme.com" aria-label="Notification email recipients"></textarea>
          </label>
          <label>
            <span class="ds-label">Invalid</span>
            <textarea class="ds-textarea ds-input--multiline" aria-invalid="true" aria-label="Alert recipients with error">invalid-email-address</textarea>
            <span class="ds-field-error">Enter valid email addresses</span>
          </label>
          <label>
            <span class="ds-label">Disabled</span>
            <textarea class="ds-textarea ds-input--multiline" disabled aria-label="System notification channel">security-alerts@acme.com</textarea>
          </label>
        </div>
      </section>
    </div>`
  )
);
