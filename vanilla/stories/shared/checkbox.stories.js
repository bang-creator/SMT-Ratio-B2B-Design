import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Checkbox',
  parameters: { layout: 'padded' },
};

/* Source: ._4-y7O on platform.openai.com
 * Ground truth:
 * - Control size: 16×16px (1rem)
 * - Border-radius: var(--radius-xs) (4px)
 * - Resting border: 1px inset var(--color-semantic-border-default)
 * - Hover: 1px inset var(--color-semantic-border-strong)
 * - Checked: background var(--color-semantic-text-primary), checkmark SVG stroke
 * - Animation: scale(0.6) -> scale(1) with cubic-enter transition */

const CHECK_SVG = `<svg class="ds-checkbox__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8.25L6.5 11L12.25 5.25"></path></svg>`;

export const Default = story(
  'Default / Shared / Checkbox / Default',
  stage(
    'Standard Checkbox (16×16 Custom Control)',
    `<label class="ds-checkbox">
      <input type="checkbox">
      <span class="ds-checkbox__control">${CHECK_SVG}</span>
      <span>Remember this device</span>
    </label>`
  )
);

export const Checked = story(
  'Default / Shared / Checkbox / Checked',
  stage(
    'Pre-checked Option',
    `<label class="ds-checkbox">
      <input type="checkbox" checked>
      <span class="ds-checkbox__control">${CHECK_SVG}</span>
      <span>Automatic billing enabled</span>
    </label>`
  )
);

export const Group = story(
  'Default / Shared / Checkbox / Group',
  stage(
    'Checkbox Group',
    `<div class="ds-stack">
      <label class="ds-checkbox">
        <input type="checkbox" checked>
        <span class="ds-checkbox__control">${CHECK_SVG}</span>
        <span>Developer newsletter</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox">
        <span class="ds-checkbox__control">${CHECK_SVG}</span>
        <span>Security and maintenance announcements</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox" checked>
        <span class="ds-checkbox__control">${CHECK_SVG}</span>
        <span>API status alerts</span>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Checkbox / Disabled',
  stage(
    'Disabled States',
    `<div class="ds-row">
      <label class="ds-checkbox">
        <input type="checkbox" disabled>
        <span class="ds-checkbox__control">${CHECK_SVG}</span>
        <span>Disabled unchecked</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox" checked disabled>
        <span class="ds-checkbox__control">${CHECK_SVG}</span>
        <span>Disabled checked</span>
      </label>
    </div>`
  )
);
