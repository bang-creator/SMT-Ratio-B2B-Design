import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Toggle',
  parameters: { layout: 'padded' },
};

/* Source: Platform settings toggles on platform.openai.com/settings
 * Ground truth from platform evidence & screenshots:
 * - Track: 36×20px capsule pill (border-radius: var(--radius-full))
 * - Inactive Track (OFF): var(--color-semantic-switch-track-inactive)
 * - Active Track (ON): var(--color-semantic-switch-track-active)
 * - Thumb: 16×16px white circle (var(--color-semantic-switch-thumb)) with soft drop shadow
 * - Motion: translateX(2px) [OFF] -> translateX(18px) [ON] with cubic-enter transition (150ms)
 * - Layout with content: Toggle control on the LEFT, Title and Support text on the RIGHT
 * - Typography: 14px Title (400 normal weight), 12px Support text (var(--color-semantic-text-secondary))
 * - Variants:
 *   - Default: Standalone toggle switch only, with disabled state staged inside
 *   - WithContent: Toggle switch with title and description support text (matching platform settings) */

const THUMB = `<span class="ds-switch__thumb" aria-hidden="true"></span>`;

/* ── Story 1: Default (Standalone Toggle Control) ── */

export const Default = story(
  'Default / Shared / Toggle / Default',
  stage(
    'Standalone Toggle Switch',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Toggle Switch -->
      <section class="ds-story-section">
<div class="ds-row">
          <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="Toggle switch off" data-ds-switch>
            ${THUMB}
          </button>
          <button type="button" role="switch" class="ds-switch__control" aria-checked="true" aria-label="Toggle switch on" data-ds-switch>
            ${THUMB}
          </button>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-row">
          <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="Toggle switch off disabled" disabled>
            ${THUMB}
          </button>
          <button type="button" role="switch" class="ds-switch__control" aria-checked="true" aria-label="Toggle switch on disabled" disabled>
            ${THUMB}
          </button>
        </div>
      </section>
    </div>`
  )
);

/* ── Story 2: With Content (Title & Support Text on Right) ── */

export const WithContent = story(
  'Default / Shared / Toggle / With Content',
  stage(
    'Toggle with Title and Support Text',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Toggle with Content -->
      <section class="ds-story-section">
<div class="ds-stack">
          <!-- ON State matching platform screenshot -->
          <label class="ds-switch">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="true" aria-label="Disable all new API key creation" data-ds-switch>
              ${THUMB}
            </button>
            <div class="ds-switch__content">
              <span class="ds-switch__title">Disable all new API key creation</span>
              <span class="ds-switch__desc">Prevents users from creating any new API keys.</span>
            </div>
          </label>

          <!-- OFF State matching platform screenshot -->
          <label class="ds-switch">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="Require multi-factor authentication" data-ds-switch>
              ${THUMB}
            </button>
            <div class="ds-switch__content">
              <span class="ds-switch__title">Require multi-factor authentication</span>
              <span class="ds-switch__desc">Enforce two-factor verification code for all project members.</span>
            </div>
          </label>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label class="ds-switch" data-disabled="true">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="Disable all new API key creation disabled" disabled>
              ${THUMB}
            </button>
            <div class="ds-switch__content">
              <span class="ds-switch__title">Disable all new API key creation</span>
              <span class="ds-switch__desc">Prevents users from creating any new API keys.</span>
            </div>
          </label>
        </div>
      </section>
    </div>`
  )
);
