import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Radio Button',
  parameters: { layout: 'padded' },
};

/* Source: .qHb9t + .Gf1PZ on platform.openai.com
 * Ground truth:
 * - Outer circle: 16×16px (1rem), border-radius: full (9999px)
 * - Resting border: 1px inset var(--color-semantic-border-default)
 * - Hover border: 1px inset var(--color-semantic-border-strong)
 * - Checked: outer border var(--color-semantic-text-primary), inner dot: 8×8px circle
 * - Animation: inner dot scales from 0.4 to 1 with cubic-enter transition
 * - Typography: 14px (var(--font-size-sm)), font-weight: 400 (var(--font-weight-normal))
 * - Consolidated architecture: Enabled vertical group and Disabled states staged inside Default */

const RADIO_DOT = `<span class="ds-radio__dot" aria-hidden="true"></span>`;

export const Default = story(
  'Default / Shared / Radio Button / Default',
  stage(
    'Radio Button States (Vertical Stack & Disabled)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Radio Group (Vertical Stack) -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label class="ds-radio">
            <input type="radio" name="demo-radio-group" value="gpt-4o" checked>
            <span class="ds-radio__control">${RADIO_DOT}</span>
            <span class="ds-radio__label">GPT-4o (High-intelligence flagship)</span>
          </label>
          <label class="ds-radio">
            <input type="radio" name="demo-radio-group" value="gpt-4o-mini">
            <span class="ds-radio__control">${RADIO_DOT}</span>
            <span class="ds-radio__label">GPT-4o mini (Fast, lightweight tasks)</span>
          </label>
          <label class="ds-radio">
            <input type="radio" name="demo-radio-group" value="o1-preview">
            <span class="ds-radio__control">${RADIO_DOT}</span>
            <span class="ds-radio__label">o1-preview (Reasoning and coding)</span>
          </label>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <label class="ds-radio">
            <input type="radio" name="demo-radio-disabled-unselected" value="disabled-unselected" disabled>
            <span class="ds-radio__control">${RADIO_DOT}</span>
            <span class="ds-radio__label">Disabled unselected</span>
          </label>
          <label class="ds-radio">
            <input type="radio" name="demo-radio-disabled-selected" value="disabled-selected" checked disabled>
            <span class="ds-radio__control">${RADIO_DOT}</span>
            <span class="ds-radio__label">Disabled selected</span>
          </label>
        </div>
      </section>
    </div>`
  )
);
