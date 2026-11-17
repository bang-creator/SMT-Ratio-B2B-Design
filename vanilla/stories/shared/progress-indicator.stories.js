import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Progress Indicator',
  parameters: { layout: 'padded' },
};

/* Source: Multi-step wizard headers on platform.openai.com
 * Ground truth:
 * - Circle step markers (24px)
 * - Interconnecting line (1px subtle border)
 * - States: completed (✓ checkmark), current (double-ring focus border), upcoming (number)
 * - Interactive: click any step or navigate via Arrow keys to switch steps
 * - Variants: Vertical (Default) and Horizontal */

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;

/* ── Variant 1: Default (Vertical Stepper Flow) ── */

export const Default = story(
  'Default / Shared / Progress Indicator / Default',
  stage(
    'Vertical Wizard Step Flow (Click Steps to Navigate)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Vertical Step Flow -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav aria-label="Fine-tuning wizard progress">
            <ol class="ds-progress-indicator ds-progress-indicator--vertical" data-ds-progress-indicator>
              <li class="ds-progress-step" data-state="completed" data-step="1">
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker" aria-hidden="true">${CHECK_ICON}</span>
                  <span class="ds-progress-step__line" aria-hidden="true"></span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Select model</span>
                  <span class="ds-progress-step__desc">Choose base foundation model</span>
                </div>
              </li>
              <li class="ds-progress-step" data-state="current" data-step="2" aria-current="step">
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker">2</span>
                  <span class="ds-progress-step__line" aria-hidden="true"></span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Upload dataset</span>
                  <span class="ds-progress-step__desc">Upload JSONL training and validation data</span>
                </div>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="3">
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker">3</span>
                  <span class="ds-progress-step__line" aria-hidden="true"></span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Hyperparameters</span>
                  <span class="ds-progress-step__desc">Configure learning rate and batch size</span>
                </div>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="4">
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker">4</span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Review & Submit</span>
                  <span class="ds-progress-step__desc">Verify configurations and start training</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav aria-label="Disabled wizard progress">
            <ol class="ds-progress-indicator ds-progress-indicator--vertical" data-ds-progress-indicator data-disabled="true">
              <li class="ds-progress-step" data-state="completed" data-step="1" disabled>
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker" aria-hidden="true">${CHECK_ICON}</span>
                  <span class="ds-progress-step__line" aria-hidden="true"></span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Select model</span>
                </div>
              </li>
              <li class="ds-progress-step" data-state="current" data-step="2" aria-current="step" disabled>
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker">2</span>
                  <span class="ds-progress-step__line" aria-hidden="true"></span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Upload dataset</span>
                </div>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="3" disabled>
                <div class="ds-progress-step__indicator">
                  <span class="ds-progress-step__marker">3</span>
                </div>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Hyperparameters</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 2: Horizontal (Horizontal Stepper Flow) ── */

export const Horizontal = story(
  'Default / Shared / Progress Indicator / Horizontal',
  stage(
    'Horizontal Wizard Step Flow (Click Steps to Navigate)',
    `<div class="ds-story-sections">
      <!-- Enabled: Interactive Horizontal Stepper -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav aria-label="Horizontal wizard progress">
            <ol class="ds-progress-indicator ds-progress-indicator--horizontal" data-ds-progress-indicator>
              <li class="ds-progress-step" data-state="completed" data-step="1">
                <span class="ds-progress-step__marker" aria-hidden="true">${CHECK_ICON}</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Select model</span>
                </div>
                <span class="ds-progress-step__line" aria-hidden="true"></span>
              </li>
              <li class="ds-progress-step" data-state="current" data-step="2" aria-current="step">
                <span class="ds-progress-step__marker">2</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Upload dataset</span>
                </div>
                <span class="ds-progress-step__line" aria-hidden="true"></span>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="3">
                <span class="ds-progress-step__marker">3</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Hyperparameters</span>
                </div>
                <span class="ds-progress-step__line" aria-hidden="true"></span>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="4">
                <span class="ds-progress-step__marker">4</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Review</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <!-- Disabled: Unavailable Cursor on Hover -->
      <section class="ds-story-section">
<div class="ds-stack">
          <nav aria-label="Disabled horizontal wizard progress">
            <ol class="ds-progress-indicator ds-progress-indicator--horizontal" data-ds-progress-indicator data-disabled="true">
              <li class="ds-progress-step" data-state="completed" data-step="1" disabled>
                <span class="ds-progress-step__marker" aria-hidden="true">${CHECK_ICON}</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Select model</span>
                </div>
                <span class="ds-progress-step__line" aria-hidden="true"></span>
              </li>
              <li class="ds-progress-step" data-state="current" data-step="2" aria-current="step" disabled>
                <span class="ds-progress-step__marker">2</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Upload dataset</span>
                </div>
                <span class="ds-progress-step__line" aria-hidden="true"></span>
              </li>
              <li class="ds-progress-step" data-state="upcoming" data-step="3" disabled>
                <span class="ds-progress-step__marker">3</span>
                <div class="ds-progress-step__content">
                  <span class="ds-progress-step__title">Hyperparameters</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>
    </div>`
  )
);
