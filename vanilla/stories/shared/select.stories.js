import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Select',
  parameters: { layout: 'padded' },
};

/* Source: .fsluc select trigger + dropdown menu on platform.openai.com
 * Ground truth:
 * - Height: 32px standard compact, 28px small (--control-size-sm)
 * - Border-radius: var(--radius-md) (8px)
 * - Inset box-shadow: 1px var(--color-semantic-border-default)
 * - Hover: 1px var(--color-semantic-border-strong)
 * - Focus: 1px var(--color-semantic-ring-focus) with offset ring
 * - Menu: 12px radius, shadow-lg, 32px option items */

export const Default = story(
  'Default / Shared / Select / Default',
  stage(
    'Standard Select (32px Compact)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Model</span>
        <div class="ds-select" data-ds-select data-value="gpt-4o">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false">
            <span data-ds-value>gpt-4o</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button class="ds-select__option" role="option" data-value="gpt-4o" aria-selected="true">
              <span>gpt-4o</span>
            </button>
            <button class="ds-select__option" role="option" data-value="gpt-4o-mini" aria-selected="false">
              <span>gpt-4o-mini</span>
            </button>
            <button class="ds-select__option" role="option" data-value="o1" aria-selected="false">
              <span>o1</span>
            </button>
            <button class="ds-select__option" role="option" data-value="o3-mini" aria-selected="false">
              <span>o3-mini</span>
            </button>
          </div>
        </div>
      </label>
    </div>`
  )
);

export const WithHelper = story(
  'Default / Shared / Select / With Helper',
  stage(
    'Select with Description Helper',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Reasoning effort</span>
        <div class="ds-select" data-ds-select data-value="Medium">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false">
            <span data-ds-value>Medium</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button class="ds-select__option" role="option" data-value="Low" aria-selected="false">
              <span>Low</span>
            </button>
            <button class="ds-select__option" role="option" data-value="Medium" aria-selected="true">
              <span>Medium</span>
            </button>
            <button class="ds-select__option" role="option" data-value="High" aria-selected="false">
              <span>High</span>
            </button>
          </div>
        </div>
        <span class="ds-muted">Controls reasoning token budget and step depth</span>
      </label>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Select / Small',
  stage(
    'Small Size (28px)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Output format</span>
        <div class="ds-select ds-select--sm" data-ds-select data-value="json_object">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false">
            <span data-ds-value>json_object</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button class="ds-select__option" role="option" data-value="text" aria-selected="false">
              <span>text</span>
            </button>
            <button class="ds-select__option" role="option" data-value="json_object" aria-selected="true">
              <span>json_object</span>
            </button>
            <button class="ds-select__option" role="option" data-value="json_schema" aria-selected="false">
              <span>json_schema</span>
            </button>
          </div>
        </div>
      </label>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Select / Pill',
  stage(
    'Usage Filter Pill Trigger',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Project filter</span>
        <div class="ds-select ds-select--pill" data-ds-select data-pill data-value="Default project">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false">
            <span data-ds-value>Default project</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
          <div class="ds-select__menu" role="listbox" hidden>
            <button class="ds-select__option" role="option" data-value="Default project" aria-selected="true">
              <span>Default project</span>
            </button>
            <button class="ds-select__option" role="option" data-value="Production API" aria-selected="false">
              <span>Production API</span>
            </button>
            <button class="ds-select__option" role="option" data-value="Staging Sandbox" aria-selected="false">
              <span>Staging Sandbox</span>
            </button>
          </div>
        </div>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Select / Disabled',
  stage(
    'Disabled Select',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Organization Tier</span>
        <div class="ds-select" data-ds-select data-value="Tier 5 (Enterprise)">
          <button class="ds-select__trigger" type="button" role="combobox" aria-expanded="false" disabled>
            <span data-ds-value>Tier 5 (Enterprise)</span>
            <span class="ds-select__chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </button>
        </div>
      </label>
    </div>`
  )
);
