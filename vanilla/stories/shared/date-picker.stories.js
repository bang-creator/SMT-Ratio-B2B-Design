import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Date Picker',
  parameters: { layout: 'padded' },
};

/* Source: Usage date range picker component on platform.openai.com/usage
 * Ground truth from live platform:
 * - Trigger: 32px height pill button with calendar icon, label, and double chevron
 * - Popover Dialog: Left presets list (Week to date, Month to date, Last 7 days, Last 14 days, Last 30 days)
 *   + Right dual-month side-by-side interactive calendar view (October 2026 & November 2026)
 * - Navigation: Previous month chevron on left month, Next month chevron on right month
 * - Full Interactive Range Selection:
 *   • Click any date to start range selection, click second date to complete range
 *   • Range start/end highlighted with solid white circular badge
 *   • Connected gray strip spanning across all days in the range
 *   • "Today" indicator dot below current date
 *   • Click any preset on the left to immediately apply that range */

const CALENDAR_ICON = `<svg viewBox="0 0 16 16" class="ds-filter-pill__icon" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1.5v3M11 1.5v3M2 7h12"/></svg>`;
const CHEVRON_UP_DOWN = `<svg viewBox="0 0 16 16" class="ds-filter-pill__chevron" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 6 3-3 3 3M5 10l3 3 3-3"/></svg>`;
const LEFT_CHEVRON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13 5 8l5-5"/></svg>`;
const RIGHT_CHEVRON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>`;
const CHECK_ICON = `<svg class="ds-date-picker__check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5 6.5 11.5 3 8"/></svg>`;

const renderDualCalendar = () => `
  <!-- Left Pane: Presets -->
  <div class="ds-date-picker__presets" role="listbox" aria-label="Preset date ranges">
    <button type="button" class="ds-date-picker__preset" data-preset="week-to-date" aria-selected="false">
      <span>Week to date</span>
    </button>
    <button type="button" class="ds-date-picker__preset" data-preset="month-to-date" aria-selected="false">
      <span>Month to date</span>
    </button>
    <button type="button" class="ds-date-picker__preset" data-preset="last-7-days" aria-selected="true">
      <span>Last 7 days</span>
      ${CHECK_ICON}
    </button>
    <button type="button" class="ds-date-picker__preset" data-preset="last-14-days" aria-selected="false">
      <span>Last 14 days</span>
    </button>
    <button type="button" class="ds-date-picker__preset" data-preset="last-30-days" aria-selected="false">
      <span>Last 30 days</span>
    </button>
  </div>

  <!-- Right Pane: Dual Calendar View -->
  <div class="ds-date-picker__dual-calendar">
    <!-- Month Navigation Bar -->
    <div class="ds-date-picker__nav-bar">
      <div class="ds-date-picker__month-header">
        <button type="button" class="ds-date-picker__nav-btn ds-date-picker__nav-btn--prev" aria-label="Previous month">
          ${LEFT_CHEVRON}
        </button>
        <span class="ds-date-picker__month-title">October 2026</span>
      </div>
      <div class="ds-date-picker__month-header">
        <span class="ds-date-picker__month-title">November 2026</span>
        <button type="button" class="ds-date-picker__nav-btn ds-date-picker__nav-btn--next" aria-label="Next month">
          ${RIGHT_CHEVRON}
        </button>
      </div>
    </div>

    <!-- Dual Month Grids -->
    <div class="ds-date-picker__months">
      <!-- Month 1: October 2026 (Starts on Thursday) -->
      <div class="ds-date-picker__month-view">
        <div class="ds-date-picker__weekday-row">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class="ds-date-picker__days-grid">
          <span class="ds-date-picker__day ds-date-picker__day--empty"></span>
          <span class="ds-date-picker__day ds-date-picker__day--empty"></span>
          <span class="ds-date-picker__day ds-date-picker__day--empty"></span>
          <span class="ds-date-picker__day ds-date-picker__day--empty"></span>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-01">1</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-02">2</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-03">3</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-04">4</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-05">5</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-06">6</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-07">7</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-08">8</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-09">9</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-10">10</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-11">11</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-12">12</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-13">13</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-14">14</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-15">15</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-16">16</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-17">17</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-18">18</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-19">19</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-20">20</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-21">21</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-22">22</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-23">23</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-24">24</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-25">25</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-26">26</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-27">27</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-28">28</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-29">29</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-30">30</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-10-31">31</button></div>
        </div>
      </div>

      <!-- Month 2: November 2026 (Starts on Sunday) -->
      <div class="ds-date-picker__month-view">
        <div class="ds-date-picker__weekday-row">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class="ds-date-picker__days-grid">
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-01">1</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-02">2</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-03">3</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-04">4</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-05">5</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-06">6</button></div>

          <!-- Day 7: Start Date of Default 7-Day Range -->
          <div class="ds-date-picker__cell ds-date-picker__cell--range-start">
            <button type="button" class="ds-date-picker__day ds-date-picker__day--start" data-date="2026-11-07">7</button>
          </div>

          <!-- Days 8 - 12: Range Mid with Continuous Strip -->
          <div class="ds-date-picker__cell ds-date-picker__cell--range-mid">
            <button type="button" class="ds-date-picker__day" data-date="2026-11-08">8</button>
          </div>
          <div class="ds-date-picker__cell ds-date-picker__cell--range-mid">
            <button type="button" class="ds-date-picker__day" data-date="2026-11-09">9</button>
          </div>
          <div class="ds-date-picker__cell ds-date-picker__cell--range-mid">
            <button type="button" class="ds-date-picker__day" data-date="2026-11-10">10</button>
          </div>
          <div class="ds-date-picker__cell ds-date-picker__cell--range-mid">
            <button type="button" class="ds-date-picker__day" data-date="2026-11-11">11</button>
          </div>
          <div class="ds-date-picker__cell ds-date-picker__cell--range-mid">
            <button type="button" class="ds-date-picker__day" data-date="2026-11-12">12</button>
          </div>

          <!-- Day 13: End Date + Today Dot -->
          <div class="ds-date-picker__cell ds-date-picker__cell--range-end">
            <button type="button" class="ds-date-picker__day ds-date-picker__day--end" data-date="2026-11-13">
              <span>13</span>
              <span class="ds-date-picker__today-dot"></span>
            </button>
          </div>

          <!-- Days 14 - 30: All fully enabled and selectable! -->
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-14">14</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-15">15</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-16">16</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-17">17</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-18">18</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-19">19</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-20">20</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-21">21</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-22">22</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-23">23</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-24">24</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-25">25</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-26">26</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-27">27</button></div>

          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-28">28</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-29">29</button></div>
          <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-30">30</button></div>
        </div>
      </div>
    </div>
  </div>`;

export const Default = story(
  'Default / Shared / Date Picker / Default',
  stage(
    'Date Range Picker (OpenAI Platform Live Model)',
    `<div class="ds-stack">
      <div class="ds-date-picker" data-ds-date-picker data-ds-open="true">
        <button class="ds-date-picker__trigger" type="button" aria-expanded="true">
          ${CALENDAR_ICON}
          <span class="ds-date-picker__label" data-date-label>Last 7 days</span>
          ${CHEVRON_UP_DOWN}
        </button>

        <div class="ds-date-picker__dialog">
          ${renderDualCalendar()}
        </div>
      </div>
    </div>`
  )
);

export const Interactive = story(
  'Default / Shared / Date Picker / Interactive',
  stage(
    'Interactive Date Range Picker (Click to Toggle & Select Custom Range)',
    `<div class="ds-stack">
      <div class="ds-row">
        <div class="ds-date-picker" data-ds-date-picker>
          <button class="ds-date-picker__trigger" type="button" aria-expanded="false">
            ${CALENDAR_ICON}
            <span class="ds-date-picker__label" data-date-label>Last 7 days</span>
            ${CHEVRON_UP_DOWN}
          </button>

          <div class="ds-date-picker__dialog" hidden>
            ${renderDualCalendar()}
          </div>
        </div>
        <span class="ds-muted">Click trigger to toggle. Click any date to start picking, click second date to complete range.</span>
      </div>
    </div>`
  )
);

export const SingleMonth = story(
  'Default / Shared / Date Picker / Single Month',
  stage(
    'Single Month Compact Picker',
    `<div class="ds-stack">
      <div class="ds-date-picker" data-ds-date-picker data-ds-open="true">
        <button class="ds-date-picker__trigger" type="button" aria-expanded="true">
          ${CALENDAR_ICON}
          <span class="ds-date-picker__label" data-date-label>Nov 13, 2026</span>
          ${CHEVRON_UP_DOWN}
        </button>

        <div class="ds-date-picker__dialog">
          <div class="ds-date-picker__single-calendar">
            <div class="ds-date-picker__nav-bar">
              <button type="button" class="ds-date-picker__nav-btn" aria-label="Previous month">${LEFT_CHEVRON}</button>
              <span class="ds-date-picker__month-title">November 2026</span>
              <button type="button" class="ds-date-picker__nav-btn" aria-label="Next month">${RIGHT_CHEVRON}</button>
            </div>
            <div class="ds-date-picker__weekday-row">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>
            <div class="ds-date-picker__days-grid">
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-01">1</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-02">2</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-03">3</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-04">4</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-05">5</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-06">6</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-07">7</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-08">8</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-09">9</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-10">10</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-11">11</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-12">12</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day ds-date-picker__day--start" data-date="2026-11-13">
                <span>13</span>
                <span class="ds-date-picker__today-dot"></span>
              </button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-14">14</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-15">15</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-16">16</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-17">17</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-18">18</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-19">19</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-20">20</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-21">21</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-22">22</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-23">23</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-24">24</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-25">25</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-26">26</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-27">27</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-28">28</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-29">29</button></div>
              <div class="ds-date-picker__cell"><button type="button" class="ds-date-picker__day" data-date="2026-11-30">30</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Date Picker / Disabled',
  stage(
    'Disabled Date Picker',
    `<div class="ds-stack">
      <div class="ds-date-picker" data-ds-date-picker>
        <button class="ds-date-picker__trigger" type="button" aria-expanded="false" disabled>
          ${CALENDAR_ICON}
          <span>Oct 1 – Oct 31, 2026</span>
          ${CHEVRON_UP_DOWN}
        </button>
      </div>
    </div>`
  )
);
