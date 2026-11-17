import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Badge',
  parameters: { layout: 'padded' },
};

const ICON_EXTERNAL = `<svg class="ds-badge__icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`;
const ICON_CHEVRON = `<svg class="ds-badge__icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;
const ICON_CHECK = `<svg class="ds-badge__icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
const ICON_CLOSE = `<svg class="ds-badge__icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
const ICON_INFO = `<svg class="ds-badge__icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
const INDICATOR = `<span class="ds-badge__indicator" aria-hidden="true"><span class="ds-badge__dot"></span></span>`;

export const Default = story(
  'Default / Shared / Badge / Default',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--default">Default</span>
          <span class="ds-badge ds-badge--green">Green</span>
          <span class="ds-badge ds-badge--red">Red</span>
          <span class="ds-badge ds-badge--blue">Blue</span>
          <span class="ds-badge ds-badge--purple">Purple</span>
          <span class="ds-badge ds-badge--yellow">Yellow</span>
          <span class="ds-badge ds-badge--orange">Orange</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--default">${INDICATOR}Default</span>
          <span class="ds-badge ds-badge--green">${INDICATOR}Online</span>
          <span class="ds-badge ds-badge--red">${INDICATOR}Failed</span>
          <span class="ds-badge ds-badge--blue">${INDICATOR}Running</span>
          <span class="ds-badge ds-badge--purple">${INDICATOR}Processing</span>
          <span class="ds-badge ds-badge--yellow">${INDICATOR}Warning</span>
          <span class="ds-badge ds-badge--orange">${INDICATOR}Pending</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--default">Docs ${ICON_EXTERNAL}</span>
          <span class="ds-badge ds-badge--green">Completed ${ICON_CHECK}</span>
          <span class="ds-badge ds-badge--red">Dismiss ${ICON_CLOSE}</span>
          <span class="ds-badge ds-badge--blue">Explore ${ICON_CHEVRON}</span>
          <span class="ds-badge ds-badge--purple">Features ${ICON_INFO}</span>
          <span class="ds-badge ds-badge--yellow">Review ${ICON_CHEVRON}</span>
          <span class="ds-badge ds-badge--orange">Details ${ICON_EXTERNAL}</span>
        </div>
      </section>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Badge / Pill',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--pill ds-badge--default">Default</span>
          <span class="ds-badge ds-badge--pill ds-badge--green">Green</span>
          <span class="ds-badge ds-badge--pill ds-badge--red">Red</span>
          <span class="ds-badge ds-badge--pill ds-badge--blue">Global</span>
          <span class="ds-badge ds-badge--pill ds-badge--purple">Purple</span>
          <span class="ds-badge ds-badge--pill ds-badge--yellow">Yellow</span>
          <span class="ds-badge ds-badge--pill ds-badge--orange">Orange</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--pill ds-badge--default">${INDICATOR}Draft</span>
          <span class="ds-badge ds-badge--pill ds-badge--green">${INDICATOR}Live</span>
          <span class="ds-badge ds-badge--pill ds-badge--red">${INDICATOR}Offline</span>
          <span class="ds-badge ds-badge--pill ds-badge--blue">${INDICATOR}Active</span>
          <span class="ds-badge ds-badge--pill ds-badge--purple">${INDICATOR}Staging</span>
          <span class="ds-badge ds-badge--pill ds-badge--yellow">${INDICATOR}Degraded</span>
          <span class="ds-badge ds-badge--pill ds-badge--orange">${INDICATOR}Paused</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--pill ds-badge--default">Docs ${ICON_EXTERNAL}</span>
          <span class="ds-badge ds-badge--pill ds-badge--green">Verified ${ICON_CHECK}</span>
          <span class="ds-badge ds-badge--pill ds-badge--red">Revoked ${ICON_CLOSE}</span>
          <span class="ds-badge ds-badge--pill ds-badge--blue">Global ${ICON_CHEVRON}</span>
          <span class="ds-badge ds-badge--pill ds-badge--purple">Premium ${ICON_INFO}</span>
          <span class="ds-badge ds-badge--pill ds-badge--yellow">Limited ${ICON_CHEVRON}</span>
          <span class="ds-badge ds-badge--pill ds-badge--orange">Beta ${ICON_EXTERNAL}</span>
        </div>
      </section>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Badge / Small',
  stage(
    `<div class="ds-story-sections">
      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--sm ds-badge--default">v1.2</span>
          <span class="ds-badge ds-badge--sm ds-badge--green">Pass</span>
          <span class="ds-badge ds-badge--sm ds-badge--red">Fail</span>
          <span class="ds-badge ds-badge--sm ds-badge--blue">New</span>
          <span class="ds-badge ds-badge--sm ds-badge--purple">Pro</span>
          <span class="ds-badge ds-badge--sm ds-badge--yellow">Warn</span>
          <span class="ds-badge ds-badge--sm ds-badge--orange">Tier 1</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--sm ds-badge--pill ds-badge--green">${INDICATOR}Live</span>
          <span class="ds-badge ds-badge--sm ds-badge--pill ds-badge--blue">${INDICATOR}Sync</span>
          <span class="ds-badge ds-badge--sm ds-badge--pill ds-badge--red">${INDICATOR}Error</span>
          <span class="ds-badge ds-badge--sm ds-badge--default">${INDICATOR}Idle</span>
          <span class="ds-badge ds-badge--sm ds-badge--yellow">${INDICATOR}Busy</span>
        </div>
      </section>

      <section class="ds-story-section">
        <div class="ds-row">
          <span class="ds-badge ds-badge--sm ds-badge--default">Docs ${ICON_EXTERNAL}</span>
          <span class="ds-badge ds-badge--sm ds-badge--green">Done ${ICON_CHECK}</span>
          <span class="ds-badge ds-badge--sm ds-badge--red">Stop ${ICON_CLOSE}</span>
          <span class="ds-badge ds-badge--sm ds-badge--pill ds-badge--blue">Next ${ICON_CHEVRON}</span>
          <span class="ds-badge ds-badge--sm ds-badge--pill ds-badge--purple">Info ${ICON_INFO}</span>
        </div>
      </section>
    </div>`
  )
);
