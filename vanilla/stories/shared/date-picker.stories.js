import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Date Picker',
  parameters: { layout: 'padded' },
};

/* Source: Usage date filter on platform.openai.com/usage
 * Ground truth:
 * - Trigger: 32px height, pill or 8px radius, calendar icon + label + chevron
 * - Inset 1px border, hover border-strong, focus ring
 * - Dialog: Single calendar or Range picker with preset list on left */

const CALENDAR_ICON = `<svg viewBox="0 0 24 24" class="ds-icon" aria-hidden="true"><path d="M19 11H5v7l.005.102A1 1 0 0 0 6 19h12a1 1 0 0 0 1-1v-7Zm0-4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v2h14V7Zm2 11a3 3 0 0 1-3 3H6a3 3 0 0 1-2.996-2.846L3 18V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 2 0v1h6V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11Z"/></svg>`;

const CHEVRON_ICON = `<span class="ds-select__chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>`;

export const Default = story(
  'Default / Shared / Date Picker / Default',
  stage(
    'Standard Date Picker (32px Compact)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Report period</span>
        <div class="ds-date-picker" data-ds-date-picker>
          <button class="ds-date-picker__trigger" type="button" aria-expanded="false">
            <span class="ds-row">
              ${CALENDAR_ICON}
              <span>Nov 12, 2026</span>
            </span>
            ${CHEVRON_ICON}
          </button>
          <div class="ds-date-picker__dialog" hidden>
            <div class="ds-date-picker__header">
              <strong>November 2026</strong>
              <span>
                <button class="ds-icon-button" type="button" aria-label="Previous month">‹</button>
                <button class="ds-icon-button" type="button" aria-label="Next month">›</button>
              </span>
            </div>
            <div class="ds-date-picker__week">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div class="ds-date-picker__grid">
              <span></span><span></span><span></span><span></span><span></span><span></span>
              <button type="button" aria-pressed="false">1</button>
              <button type="button" aria-pressed="false">2</button>
              <button type="button" aria-pressed="false">3</button>
              <button type="button" aria-pressed="false">4</button>
              <button type="button" aria-pressed="false">5</button>
              <button type="button" aria-pressed="false">6</button>
              <button type="button" aria-pressed="false">7</button>
              <button type="button" aria-pressed="false">8</button>
              <button type="button" aria-pressed="false">9</button>
              <button type="button" aria-pressed="false">10</button>
              <button type="button" aria-pressed="false">11</button>
              <button type="button" aria-pressed="true">12</button>
              <button type="button" aria-pressed="false">13</button>
              <button type="button" aria-pressed="false">14</button>
            </div>
          </div>
        </div>
      </label>
    </div>`
  )
);

export const PillRange = story(
  'Default / Shared / Date Picker / Pill Range',
  stage(
    'Usage Range Filter (Live Platform Model: Presets + Grid)',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Usage activity range</span>
        <div class="ds-date-picker ds-date-picker--pill" data-ds-date-picker data-pill>
          <button class="ds-date-picker__trigger" type="button" aria-expanded="false">
            <span class="ds-row">
              ${CALENDAR_ICON}
              <span>Last 7 days</span>
            </span>
            ${CHEVRON_ICON}
          </button>
          <div class="ds-date-picker__dialog ds-date-picker__dialog--range" hidden>
            <div class="ds-date-picker__presets" role="listbox" aria-label="Preset ranges">
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Today</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Yesterday</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Week to date</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="true">Last 7 days</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Month to date</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Last 30 days</button>
              <button type="button" class="ds-date-picker__preset" aria-selected="false">Last 90 days</button>
            </div>
            <div class="ds-date-picker__calendars">
              <div class="ds-stack">
                <div class="ds-date-picker__header">
                  <strong>November 2026</strong>
                  <span>
                    <button class="ds-icon-button" type="button" aria-label="Previous month">‹</button>
                    <button class="ds-icon-button" type="button" aria-label="Next month">›</button>
                  </span>
                </div>
                <div class="ds-date-picker__week">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div class="ds-date-picker__grid">
                  <span></span><span></span><span></span><span></span><span></span><span></span>
                  <button type="button" aria-pressed="false">1</button>
                  <button type="button" aria-pressed="false">2</button>
                  <button type="button" aria-pressed="false">3</button>
                  <button type="button" aria-pressed="false">4</button>
                  <button type="button" aria-pressed="false">5</button>
                  <button type="button" aria-pressed="true">6</button>
                  <button type="button" aria-pressed="true">7</button>
                  <button type="button" aria-pressed="true">8</button>
                  <button type="button" aria-pressed="true">9</button>
                  <button type="button" aria-pressed="true">10</button>
                  <button type="button" aria-pressed="true">11</button>
                  <button type="button" aria-pressed="true">12</button>
                  <button type="button" aria-pressed="false">13</button>
                  <button type="button" aria-pressed="false">14</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>`
  )
);

export const WithHelper = story(
  'Default / Shared / Date Picker / With Helper',
  stage(
    'Date Picker with Description Helper',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Audit log window</span>
        <div class="ds-date-picker" data-ds-date-picker>
          <button class="ds-date-picker__trigger" type="button" aria-expanded="false">
            <span class="ds-row">
              ${CALENDAR_ICON}
              <span>Last 30 days</span>
            </span>
            ${CHEVRON_ICON}
          </button>
        </div>
        <span class="ds-muted">Events retained for up to 90 days</span>
      </label>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Date Picker / Disabled',
  stage(
    'Disabled Date Picker',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Archived period</span>
        <div class="ds-date-picker" data-ds-date-picker>
          <button class="ds-date-picker__trigger" type="button" aria-expanded="false" disabled>
            <span class="ds-row">
              ${CALENDAR_ICON}
              <span>Oct 1 - Oct 31, 2026</span>
            </span>
            ${CHEVRON_ICON}
          </button>
        </div>
      </label>
    </div>`
  )
);
