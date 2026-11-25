import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Button',
  parameters: { layout: 'padded' },
};

/* ── SVG Icons ── */

const PLUS_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const ARROW_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
const LIGHTNING_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
const TRASH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

const SPARKLES = `<span class="ds-button__sparkles" aria-hidden="true"><span class="ds-button__sparkle ds-button__sparkle--1"></span><span class="ds-button__sparkle ds-button__sparkle--2"></span><span class="ds-button__sparkle ds-button__sparkle--3"></span><span class="ds-button__sparkle ds-button__sparkle--4"></span><span class="ds-button__sparkle ds-button__sparkle--5"></span></span>`;
const SPINNER = `<svg class="ds-button__spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>`;
const ACTION_ARROW_ICON = `<svg class="ds-button__action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;

/* ── Helpers ── */

/**
 * Render an interactive Action Button (idle -> pending -> success -> idle)
 * @param {string} cls   - base button classes
 * @param {string} inner - optional extra markup placed inside button (e.g. sparkles)
 */
function actionButtonMarkup(cls, inner = '') {
  return `<button type="button" class="${cls} ds-button--action" data-ds-action-button data-state="idle" data-label="Save changes" data-pending-label="Saving" data-success-label="Saved" aria-busy="false">` +
    `<span class="ds-button__sr-only" data-action-sr-label="true">Save changes</span>` +
    `<span class="ds-button__sr-only" role="status" data-action-sr-status="true"></span>` +
    `<span class="ds-button__action-content" aria-hidden="true">` +
      `<span class="ds-button__action-morph">` +
        `<span class="ds-button__action-sizer">Save changes</span>` +
        `<span class="ds-button__action-label">Save changes</span>` +
      `</span>` +
      `<span class="ds-button__action-icon-slot">` +
        `<span class="ds-button__action-phase" data-phase="idle">${ACTION_ARROW_ICON}</span>` +
      `</span>` +
    `</span>` +
    `${inner}</button>`;
}

/**
 * Build one style section showing:
 *   Heading (SF Mono 12px)
 *   Row: text-only | icon-left | icon-right | icon-both | icon-only | disabled | loading | action
 *
 * @param {string} styleTitle - section title in SF Mono 12px
 * @param {string} cls        - full class string for the button
 * @param {string} label      - visible text label
 * @param {object} opts
 * @param {string} opts.leadIcon  - SVG for leading position
 * @param {string} opts.trailIcon - SVG for trailing position
 * @param {string} opts.inner     - extra markup placed inside every button (e.g. sparkles)
 */
function styleSection(styleTitle, cls, label, { leadIcon = PLUS_ICON, trailIcon = ARROW_ICON, inner = '' } = {}) {
  const btn = (content, extraCls = '', aria = '', extraAttrs = '') =>
    `<button type="button" class="${cls}${extraCls ? ' ' + extraCls : ''}"${aria ? ` aria-label="${aria}"` : ''}${extraAttrs ? ' ' + extraAttrs : ''}>${content}${inner}</button>`;
  return `<section class="ds-story-section">
    <header><code>${styleTitle}</code></header>
    <div class="ds-row">
      ${btn(`<span>${label}</span>`)}
      ${btn(`${leadIcon}<span>${label}</span>`)}
      ${btn(`<span>${label}</span>${trailIcon}`)}
      ${btn(`${leadIcon}<span>${label}</span>${trailIcon}`)}
      ${btn(leadIcon, 'ds-button--icon', label)}
      ${btn(`<span>Disabled</span>`, '', '', 'disabled')}
      ${btn(`${SPINNER}<span>Loading…</span>`, 'ds-button--loading', '', 'aria-busy="true"')}
      ${actionButtonMarkup(cls, inner)}
    </div>
  </section>`;
}

/**
 * Render all 7 button styles in distinct sections for a variant
 * @param {string} modifier - optional class modifier like 'ds-button--pill' or 'ds-button--sm'
 */
function renderButtonSections(modifier = '') {
  const c = (base) => (modifier ? `${base} ${modifier}` : base);
  return `<div class="ds-story-sections">
    ${styleSection('Primary', c('ds-button ds-button--primary'), 'Primary')}
    ${styleSection('Secondary', c('ds-button ds-button--secondary'), 'Secondary')}
    ${styleSection('Outline', c('ds-button ds-button--outline'), 'Outline')}
    ${styleSection('Ghost', c('ds-button ds-button--ghost'), 'Ghost')}
    ${styleSection('Danger', c('ds-button ds-button--danger'), 'Danger', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
    ${styleSection('Danger Solid', c('ds-button ds-button--danger-solid'), 'Delete', { leadIcon: TRASH_ICON, trailIcon: TRASH_ICON })}
    ${styleSection('Ultrafast', c('ds-button ds-button--ultra'), 'Ultrafast', { leadIcon: LIGHTNING_ICON, trailIcon: LIGHTNING_ICON, inner: SPARKLES })}
  </div>`;
}

/* ── Variant: Default (32 px) ── */

export const Default = story(
  'Default / Shared / Button / Default',
  stage('Default (32 px)', renderButtonSections())
);

/* ── Variant: Pill ── */

export const Pill = story(
  'Default / Shared / Button / Pill',
  stage('Pill (border-radius: full)', renderButtonSections('ds-button--pill'))
);

/* ── Variant: Small (28 px) ── */

export const Small = story(
  'Default / Shared / Button / Small',
  stage('Small (28 px)', renderButtonSections('ds-button--sm'))
);

/* ── Variant: Small Pill (28 px, border-radius: full) ── */

export const SmallPill = story(
  'Default / Shared / Button / Small Pill',
  stage('Small Pill (28 px, border-radius: full)', renderButtonSections('ds-button--sm ds-button--pill'))
);
