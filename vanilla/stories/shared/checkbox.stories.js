import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Checkbox',
  parameters: { layout: 'padded' },
};

const CHECK_SVG = `<svg class="ds-checkbox__check" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8.25L6.5 11L12.25 5.25"></path></svg>`;
const DASH_SVG = `<svg class="ds-checkbox__dash" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.75 8h8.5"></path></svg>`;

export const Default = story(
  'Default / Shared / Checkbox / Default',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-stack">
          <label class="ds-checkbox">
            <input type="checkbox">
            <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
            <span>Unchecked</span>
          </label>
          <label class="ds-checkbox">
            <input type="checkbox" checked>
            <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
            <span>Checked</span>
          </label>
          <label class="ds-checkbox" data-indeterminate="true">
            <input type="checkbox" data-indeterminate="true">
            <span class="ds-checkbox__control">${CHECK_SVG}${DASH_SVG}</span>
            <span>Indeterminate</span>
          </label>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-checkbox-surface-panel">
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
        </div>
      </section>
    </div>`
  )
);
