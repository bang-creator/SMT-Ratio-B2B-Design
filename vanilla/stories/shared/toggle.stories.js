import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Toggle',
  parameters: { layout: 'padded' },
};

/* Source: .M38jh (track) + ._9I9IG (thumb) on platform.openai.com
 * Ground truth:
 * - Track: 36px width, 20px height, border-radius: full (9999px)
 * - Thumb: 16×16px circle, background var(--color-primitive-gray-0), shadow
 * - Motion: translateX(2px) -> translateX(18px) with cubic-enter transition (150ms)
 * - Active squash: thumb width expands slightly to 18px on press
 * - Checked: background switches to var(--color-semantic-text-primary) */

const THUMB = `<span class="ds-switch__thumb" aria-hidden="true"></span>`;

export const Default = story(
  'Default / Shared / Toggle / Default',
  stage(
    'Interactive Toggle Switch',
    `<label class="ds-switch">
      <span>Stream responses</span>
      <button type="button" role="switch" class="ds-switch__control" aria-checked="false" data-ds-switch>
        ${THUMB}
      </button>
    </label>`
  )
);

export const Checked = story(
  'Default / Shared / Toggle / Checked',
  stage(
    'Pre-checked Toggle',
    `<label class="ds-switch">
      <span>Auto-recharge credits</span>
      <button type="button" role="switch" class="ds-switch__control" aria-checked="true" data-ds-switch>
        ${THUMB}
      </button>
    </label>`
  )
);

export const SettingsList = story(
  'Default / Shared / Toggle / Settings List',
  stage(
    'Settings Toggle Stack',
    `<div class="ds-stack">
      <label class="ds-switch">
        <div>
          <strong>Usage alerts</strong>
          <div class="ds-muted">Receive email when approaching spending limit</div>
        </div>
        <button type="button" role="switch" class="ds-switch__control" aria-checked="true" data-ds-switch>
          ${THUMB}
        </button>
      </label>
      <label class="ds-switch">
        <div>
          <strong>Multi-factor authentication</strong>
          <div class="ds-muted">Require an authenticator app code to sign in</div>
        </div>
        <button type="button" role="switch" class="ds-switch__control" aria-checked="false" data-ds-switch>
          ${THUMB}
        </button>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Toggle / Disabled',
  stage(
    'Disabled States',
    `<div class="ds-stack">
      <label class="ds-switch">
        <span>Disabled off</span>
        <button type="button" role="switch" class="ds-switch__control" aria-checked="false" disabled>
          ${THUMB}
        </button>
      </label>
      <label class="ds-switch">
        <span>Disabled on</span>
        <button type="button" role="switch" class="ds-switch__control" aria-checked="true" disabled>
          ${THUMB}
        </button>
      </label>
    </div>`
  )
);
