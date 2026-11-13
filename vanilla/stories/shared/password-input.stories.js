import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Password Input',
  parameters: { layout: 'padded' },
};

/* Source: .Kepsx + .EzGXF on platform.openai.com
 * Ground truth:
 * - Standard 32px compact height, 8px radius
 * - Secure masked text presentation
 * - Box-shadow inset outline with hover and focus-ring states */

const EYE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

export const Default = story(
  'Default / Shared / Password Input / Default',
  stage(
    'Standard Password Field',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Master password</span>
        <input type="password" class="ds-input" value="openai_secret_token_2026" placeholder="Enter password">
      </label>
    </div>`
  )
);

export const WithToggle = story(
  'Default / Shared / Password Input / With Toggle',
  stage(
    'Password Field With Show/Hide Visibility Toggle',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">API Secret Token</span>
        <div class="ds-input-wrap" data-ds-password-wrap>
          <input type="password" class="ds-input" value="sk-antigravity-999-sec" placeholder="Enter API secret">
          <button type="button" class="ds-password-toggle" data-ds-password-toggle aria-label="Show password">
            ${EYE_ICON}
          </button>
        </div>
      </label>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Password Input / Pill',
  stage(
    'Pill Capsule Password Field',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Client Passcode</span>
        <div class="ds-input-wrap" data-ds-password-wrap>
          <input type="password" class="ds-input ds-input--pill" value="987654321" placeholder="Enter PIN">
          <button type="button" class="ds-password-toggle" data-ds-password-toggle aria-label="Show password">
            ${EYE_ICON}
          </button>
        </div>
      </label>
    </div>`
  )
);

export const WithConfirmation = story(
  'Default / Shared / Password Input / With Confirmation',
  stage(
    'Password Reset Stack',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">New password</span>
        <input type="password" class="ds-input" placeholder="At least 12 characters">
      </label>
      <label>
        <span class="ds-label">Confirm new password</span>
        <input type="password" class="ds-input" placeholder="Re-enter password">
      </label>
      <span class="ds-muted">Use numbers, letters, and symbols for high entropy.</span>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Password Input / Disabled',
  stage(
    'Disabled Password Input',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Legacy admin secret</span>
        <input type="password" class="ds-input" value="locked_down_admin_pass" disabled>
      </label>
    </div>`
  )
);
