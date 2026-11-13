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
 * - Indeterminate: background var(--color-semantic-text-primary), horizontal dash SVG stroke
 * - Animation: scale(0.6) -> scale(1) with cubic-enter transition */

const CHECK_SVG = `<svg class="ds-checkbox__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8.25L6.5 11L12.25 5.25"></path></svg>`;
const DASH_SVG = `<svg class="ds-checkbox__dash" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8h8.5"></path></svg>`;

export const Default = story(
  'Default / Shared / Checkbox / Default',
  stage(
    'Checkbox States (Unchecked, Checked, Indeterminate)',
    `<div class="ds-stack">
      <label class="ds-checkbox">
        <input type="checkbox">
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Unchecked option</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox" checked>
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Checked option</span>
      </label>
      <label class="ds-checkbox" data-indeterminate="true">
        <input type="checkbox" data-indeterminate="true">
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Indeterminate option</span>
      </label>
    </div>`
  )
);

export const Group = story(
  'Default / Shared / Checkbox / Group',
  stage(
    'Checkbox Group',
    `<div class="ds-stack">
      <label class="ds-checkbox">
        <input type="checkbox" checked>
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Developer newsletter</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox">
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Security and maintenance announcements</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox" checked>
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
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
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Disabled unchecked</span>
      </label>
      <label class="ds-checkbox">
        <input type="checkbox" checked disabled>
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Disabled checked</span>
      </label>
      <label class="ds-checkbox" data-indeterminate="true">
        <input type="checkbox" data-indeterminate="true" disabled>
        <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
        <span>Disabled indeterminate</span>
      </label>
    </div>`
  )
);
