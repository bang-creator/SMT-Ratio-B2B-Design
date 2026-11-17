import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Form',
  parameters: { layout: 'padded' },
};

/* Source: Realtime Audio Edit configuration panel on platform.openai.com/audio/realtime/edit
 * Ground truth from live platform evidence:
 * - Collapsible Sections: Model, Audio, Conversation behavior, Tools (each with chevron indicator)
 * - Model Section:
 *   • Model selector dropdown ("gpt-realtime-2 ↕")
 *   • User transcript model selector ("gpt-realtime-whisper ↕")
 *   • Max tokens segmented control ("Custom" | "Unlimited") + helper text "Uses the model maximum."
 * - Audio Section:
 *   • Voice selector dropdown ("Marin ↕")
 *   • Noise reduction selector ("Far field ↕")
 * - Conversation behavior Section:
 *   • Automatic turn detection selector ("Normal ↕")
 *   • Threshold slider (0.00 to 1.00, step 0.01) + tabular readout ("0.50")
 *   • Prefix padding slider (0 to 1000 ms, step 50) + tabular readout ("300 ms")
 *   • Silence duration slider (0 to 2000 ms, step 50) + tabular readout ("500 ms")
 *   • Idle timeout toggle switch (resting false)
 * - Tools Section:
 *   • Functions toggle switch (resting true)
 *   • MCP servers toggle switch (resting false)
 * - Strict 400 font-weight rules on labels, 32px standard compact heights, composed shared sub-components */

const CHEVRON_UP = `<svg viewBox="0 0 16 16" width="14" height="14" class="ds-form-section__chevron" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 10 4-4 4 4"/></svg>`;
const CHEVRON_UP_DOWN = `<span class="ds-select__chevron" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg></span>`;
const CHECK_ICON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;
const THUMB = `<span class="ds-switch__thumb" aria-hidden="true"></span>`;

const renderFormPanel = (disabled = false) => `
  <div class="ds-form-panel ds-scrollbar" ${disabled ? 'data-disabled="true"' : ''}>
    <!-- ── 1. Model Section ── -->
    <details class="ds-form-section" open>
      <summary class="ds-form-section__header">
        <span>Model</span>
        ${CHEVRON_UP}
      </summary>
      <div class="ds-form-section__body">
        <!-- Model Dropdown -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Model</span>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
              <span data-ds-dropdown-value>gpt-realtime-2</span>
              ${CHEVRON_UP_DOWN}
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>gpt-realtime-2</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>gpt-realtime</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>gpt-4o-realtime-preview</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- User Transcript Model -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">User transcript model</span>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
              <span data-ds-dropdown-value>gpt-realtime-whisper</span>
              ${CHEVRON_UP_DOWN}
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>gpt-realtime-whisper</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>whisper-1</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Max Tokens (Segmented Control) -->
        <div class="ds-form-row ds-form-row--stack">
          <div class="ds-form-row__top">
            <span class="ds-form-row__label">Max tokens</span>
            <div class="ds-segmented ds-segmented--sm" data-ds-segmented role="radiogroup" aria-label="Max tokens">
              <div class="ds-segmented__thumb"></div>
              <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="custom" ${disabled ? 'disabled data-disabled' : ''}>Custom</button>
              <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="unlimited" ${disabled ? 'disabled data-disabled' : ''}>Unlimited</button>
            </div>
          </div>
          <span class="ds-form-row__helper">Uses the model maximum.</span>
        </div>
      </div>
    </details>

    <!-- ── 2. Audio Section ── -->
    <details class="ds-form-section" open>
      <summary class="ds-form-section__header">
        <span>Audio</span>
        ${CHEVRON_UP}
      </summary>
      <div class="ds-form-section__body">
        <!-- Voice -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Voice</span>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
              <span data-ds-dropdown-value>Marin</span>
              ${CHEVRON_UP_DOWN}
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>Marin</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Alloy</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Echo</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Fable</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Onyx</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Nova</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Shimmer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Noise Reduction -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Noise reduction</span>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
              <span data-ds-dropdown-value>Far field</span>
              ${CHEVRON_UP_DOWN}
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>Far field</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Near field</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Disabled</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>

    <!-- ── 3. Conversation Behavior Section ── -->
    <details class="ds-form-section" open>
      <summary class="ds-form-section__header">
        <span>Conversation behavior</span>
        ${CHEVRON_UP}
      </summary>
      <div class="ds-form-section__body">
        <!-- Automatic Turn Detection -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Automatic turn<br>detection</span>
          <div class="ds-dropdown" data-ds-dropdown>
            <button class="ds-select__trigger ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" ${disabled ? 'disabled' : ''}>
              <span data-ds-dropdown-value>Normal</span>
              ${CHEVRON_UP_DOWN}
            </button>
            <div class="ds-select__menu ds-dropdown__menu" role="listbox" hidden>
              <div class="ds-dropdown__list ds-scrollbar">
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="true" data-checked="true">
                  <span class="ds-dropdown__check">${CHECK_ICON}</span>
                  <span>Normal</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Semantic (advanced)</span>
                </button>
                <button type="button" class="ds-select__option ds-dropdown__item" role="option" aria-selected="false">
                  <span class="ds-dropdown__check ds-dropdown__check--empty"></span>
                  <span>Disabled</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Threshold Slider -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Threshold</span>
          <div class="ds-slider ds-form-slider" data-ds-slider>
            <input type="range" min="0" max="1" step="0.01" value="0.50" data-decimals="2" aria-label="Threshold" ${disabled ? 'disabled' : ''}>
            <span class="ds-form-slider__readout" data-ds-readout>0.50</span>
          </div>
        </div>

        <!-- Prefix Padding Slider -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Prefix padding</span>
          <div class="ds-slider ds-form-slider" data-ds-slider>
            <input type="range" min="0" max="1000" step="50" value="300" data-unit="ms" aria-label="Prefix padding" ${disabled ? 'disabled' : ''}>
            <span class="ds-form-slider__readout" data-ds-readout>300 ms</span>
          </div>
        </div>

        <!-- Silence Duration Slider -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Silence duration</span>
          <div class="ds-slider ds-form-slider" data-ds-slider>
            <input type="range" min="0" max="2000" step="50" value="500" data-unit="ms" aria-label="Silence duration" ${disabled ? 'disabled' : ''}>
            <span class="ds-form-slider__readout" data-ds-readout>500 ms</span>
          </div>
        </div>

        <!-- Idle Timeout Switch -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Idle timeout</span>
          <label class="ds-switch">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="Idle timeout" data-ds-switch ${disabled ? 'disabled data-disabled' : ''}>
              ${THUMB}
            </button>
          </label>
        </div>
      </div>
    </details>

    <!-- ── 4. Tools Section ── -->
    <details class="ds-form-section" open>
      <summary class="ds-form-section__header">
        <span>Tools</span>
        ${CHEVRON_UP}
      </summary>
      <div class="ds-form-section__body">
        <!-- Functions Switch -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">Functions</span>
          <label class="ds-switch">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="true" aria-label="Functions" data-ds-switch ${disabled ? 'disabled data-disabled' : ''}>
              ${THUMB}
            </button>
          </label>
        </div>

        <!-- MCP Servers Switch -->
        <div class="ds-form-row">
          <span class="ds-form-row__label">MCP servers</span>
          <label class="ds-switch">
            <button type="button" role="switch" class="ds-switch__control" aria-checked="false" aria-label="MCP servers" data-ds-switch ${disabled ? 'disabled data-disabled' : ''}>
              ${THUMB}
            </button>
          </label>
        </div>
      </div>
    </details>
  </div>`;

export const Default = story(
  'Default / Shared / Form / Default',
  stage(
    'Realtime Audio Edit Form (https://platform.openai.com/audio/realtime/edit)',
    `<div class="ds-story-sections">
      <!-- Enabled State -->
      <section class="ds-story-section">
${renderFormPanel(false)}
      </section>

      <!-- Disabled State -->
      <section class="ds-story-section">
${renderFormPanel(true)}
      </section>
    </div>`
  )
);
