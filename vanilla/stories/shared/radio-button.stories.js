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
 * - Animation: inner dot scales from 0.4 to 1 with cubic-enter transition */

const RADIO_DOT = `<span class="ds-radio__dot" aria-hidden="true"></span>`;

export const Default = story(
  'Default / Shared / Radio Button / Default',
  stage(
    'Radio Group (Vertical Stack)',
    `<div class="ds-stack">
      <label class="ds-radio">
        <input type="radio" name="demo-radio" value="gpt-4o" checked>
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>GPT-4o (High-intelligence flagship)</span>
      </label>
      <label class="ds-radio">
        <input type="radio" name="demo-radio" value="gpt-4o-mini">
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>GPT-4o mini (Fast, lightweight tasks)</span>
      </label>
      <label class="ds-radio">
        <input type="radio" name="demo-radio" value="o1-preview">
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>o1-preview (Reasoning and coding)</span>
      </label>
    </div>`
  )
);

export const Horizontal = story(
  'Default / Shared / Radio Button / Horizontal',
  stage(
    'Horizontal Layout',
    `<div class="ds-row">
      <label class="ds-radio">
        <input type="radio" name="demo-horizontal" value="personal" checked>
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>Personal</span>
      </label>
      <label class="ds-radio">
        <input type="radio" name="demo-horizontal" value="team">
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>Team</span>
      </label>
      <label class="ds-radio">
        <input type="radio" name="demo-horizontal" value="enterprise">
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>Enterprise</span>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Radio Button / Disabled',
  stage(
    'Disabled States',
    `<div class="ds-row">
      <label class="ds-radio">
        <input type="radio" name="demo-disabled" disabled>
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>Disabled unselected</span>
      </label>
      <label class="ds-radio">
        <input type="radio" name="demo-disabled-2" checked disabled>
        <span class="ds-radio__control">${RADIO_DOT}</span>
        <span>Disabled selected</span>
      </label>
    </div>`
  )
);
