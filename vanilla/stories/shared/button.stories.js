import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Button',
  parameters: { layout: 'padded' },
};

/* ── SVG Icons ── */

const PLUS_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ARROW_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const LIGHTNING_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const GEAR_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
const GLOBE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
const TRASH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

const SPARKLES = `<span class="ds-button__sparkles" aria-hidden="true"><span class="ds-button__sparkle ds-button__sparkle--1"></span><span class="ds-button__sparkle ds-button__sparkle--2"></span><span class="ds-button__sparkle ds-button__sparkle--3"></span><span class="ds-button__sparkle ds-button__sparkle--4"></span><span class="ds-button__sparkle ds-button__sparkle--5"></span></span>`;
const SPINNER = `<svg class="ds-button__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>`;

/* ── Helpers ── */

/**
 * Build one style row showing icon placements:
 *   text-only | icon-left | icon-right | icon-both | icon-only
 *
 * @param {string} cls   - full class string for the button
 * @param {string} label - visible text label
 * @param {object} opts
 * @param {string} opts.leadIcon  - SVG for leading position
 * @param {string} opts.trailIcon - SVG for trailing position
 * @param {string} opts.inner     - extra markup placed inside every button (e.g. sparkles)
 */
function styleRow(cls, label, { leadIcon = PLUS_ICON, trailIcon = ARROW_ICON, inner = '' } = {}) {
  const btn = (content, extraCls = '', aria = '') =>
    `<button type="button" class="${cls}${extraCls ? ' ' + extraCls : ''}"${aria ? ` aria-label="${aria}"` : ''}>${content}${inner}</button>`;
  return `<div class="ds-row">
    ${btn(`<span>${label}</span>`)}
    ${btn(`${leadIcon}<span>${label}</span>`)}
    ${btn(`<span>${label}</span>${trailIcon}`)}
    ${btn(`${leadIcon}<span>${label}</span>${trailIcon}`)}
    ${btn(leadIcon, 'ds-button--icon', label)}
  </div>`;
}

/* ── Variant: Default (32 px) ── */

export const Default = story(
  'Default / Shared / Button / Default',
  stage(
    'Default (32 px)',
    `<div class="ds-stack">
      ${styleRow('ds-button ds-button--primary', 'Primary')}
      ${styleRow('ds-button ds-button--secondary', 'Secondary')}
      ${styleRow('ds-button ds-button--outline', 'Outline')}
      ${styleRow('ds-button ds-button--ghost', 'Ghost')}
      ${styleRow('ds-button ds-button--danger', 'Danger', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--danger-solid', 'Delete', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--ultra', 'Ultrafast', { leadIcon: LIGHTNING_ICON, trailIcon: LIGHTNING_ICON, inner: SPARKLES })}
    </div>`
  )
);

/* ── Variant: Pill ── */

export const Pill = story(
  'Default / Shared / Button / Pill',
  stage(
    'Pill (border-radius: full)',
    `<div class="ds-stack">
      ${styleRow('ds-button ds-button--primary ds-button--pill', 'Primary')}
      ${styleRow('ds-button ds-button--secondary ds-button--pill', 'Secondary')}
      ${styleRow('ds-button ds-button--outline ds-button--pill', 'Outline')}
      ${styleRow('ds-button ds-button--ghost ds-button--pill', 'Ghost')}
      ${styleRow('ds-button ds-button--danger ds-button--pill', 'Danger', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--danger-solid ds-button--pill', 'Delete', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--ultra ds-button--pill', 'Ultrafast', { leadIcon: LIGHTNING_ICON, trailIcon: LIGHTNING_ICON, inner: SPARKLES })}
    </div>`
  )
);

/* ── Variant: Small (28 px) ── */

export const Small = story(
  'Default / Shared / Button / Small',
  stage(
    'Small (28 px)',
    `<div class="ds-stack">
      ${styleRow('ds-button ds-button--primary ds-button--sm', 'Primary')}
      ${styleRow('ds-button ds-button--secondary ds-button--sm', 'Secondary')}
      ${styleRow('ds-button ds-button--outline ds-button--sm', 'Outline')}
      ${styleRow('ds-button ds-button--ghost ds-button--sm', 'Ghost')}
      ${styleRow('ds-button ds-button--danger ds-button--sm', 'Danger', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--danger-solid ds-button--sm', 'Delete', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
      ${styleRow('ds-button ds-button--ultra ds-button--sm', 'Ultrafast', { leadIcon: LIGHTNING_ICON, trailIcon: LIGHTNING_ICON, inner: SPARKLES })}
    </div>`
  )
);

/* ── Variant: Icon Button ── */

export const IconButton = story(
  'Default / Shared / Button / Icon Button',
  stage(
    'Icon Button (32 px & 28 px)',
    `<div class="ds-stack">
      <div class="ds-row">
        <button type="button" class="ds-button ds-button--ghost ds-button--icon" aria-label="Settings">${GEAR_ICON}</button>
        <button type="button" class="ds-button ds-button--primary ds-button--icon" aria-label="Add">${PLUS_ICON}</button>
        <button type="button" class="ds-button ds-button--secondary ds-button--icon" aria-label="Settings">${GEAR_ICON}</button>
        <button type="button" class="ds-button ds-button--outline ds-button--icon" aria-label="Globe">${GLOBE_ICON}</button>
        <button type="button" class="ds-button ds-button--danger ds-button--icon" aria-label="Delete">${TRASH_ICON}</button>
        <button type="button" class="ds-button ds-button--danger-solid ds-button--icon" aria-label="Delete">${TRASH_ICON}</button>
        <button type="button" class="ds-button ds-button--ultra ds-button--icon" aria-label="Ultrafast">${LIGHTNING_ICON}${SPARKLES}</button>
      </div>
      <div class="ds-row">
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm" aria-label="Settings">${GEAR_ICON}</button>
        <button type="button" class="ds-button ds-button--primary ds-button--icon ds-button--sm" aria-label="Add">${PLUS_ICON}</button>
        <button type="button" class="ds-button ds-button--secondary ds-button--icon ds-button--sm" aria-label="Settings">${GEAR_ICON}</button>
        <button type="button" class="ds-button ds-button--outline ds-button--icon ds-button--sm" aria-label="Globe">${GLOBE_ICON}</button>
        <button type="button" class="ds-button ds-button--danger ds-button--icon ds-button--sm" aria-label="Delete">${TRASH_ICON}</button>
        <button type="button" class="ds-button ds-button--danger-solid ds-button--icon ds-button--sm" aria-label="Delete">${TRASH_ICON}</button>
        <button type="button" class="ds-button ds-button--ultra ds-button--icon ds-button--sm" aria-label="Ultrafast">${LIGHTNING_ICON}${SPARKLES}</button>
      </div>
    </div>`
  )
);
