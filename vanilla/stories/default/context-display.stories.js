import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 109 Context display AUI',
  parameters: { layout: 'padded' },
};

const RING_SIZE = 18;
const RING_STROKE = 2.5;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2; // 7.75
const RING_CIRCUMFERENCE = +(2 * Math.PI * RING_RADIUS).toFixed(2); // 48.69

function formatTokenCount(num) {
  if (num === 0) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

function getTier(percent) {
  if (percent >= 85) return 'critical';
  if (percent >= 65) return 'warning';
  return 'normal';
}

function renderContextComponent({
  variant = 'ring', // 'ring' | 'bar' | 'text'
  totalTokens = 31400,
  modelContextWindow = 128000,
  segments = [
    { label: 'Input tokens', tokens: 24800 },
    { label: 'Output tokens', tokens: 6600 },
  ],
} = {}) {
  const percent = Math.min(100, Math.round((totalTokens / modelContextWindow) * 100));
  const tier = getTier(percent);
  const strokeDashoffset = +(RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE).toFixed(2);

  let visual = '';
  if (variant === 'ring') {
    visual = `
      <svg class="ds-context-ring-svg" width="${RING_SIZE}" height="${RING_SIZE}" viewBox="0 0 ${RING_SIZE} ${RING_SIZE}" aria-hidden="true">
        <circle class="ds-context-ring-bg" cx="${RING_SIZE / 2}" cy="${RING_SIZE / 2}" r="${RING_RADIUS}" fill="none" stroke-width="${RING_STROKE}"></circle>
        <circle class="ds-context-ring-meter" cx="${RING_SIZE / 2}" cy="${RING_SIZE / 2}" r="${RING_RADIUS}" fill="none" stroke-width="${RING_STROKE}" stroke-linecap="round" stroke-dasharray="${RING_CIRCUMFERENCE}" stroke-dashoffset="${strokeDashoffset}"></circle>
      </svg>
      <span class="ds-context-ring-label" data-slot="percent-label">${percent}%</span>
    `;
  } else if (variant === 'bar') {
    visual = `
      <div class="ds-context-bar-track" aria-hidden="true">
        <div class="ds-context-bar-fill" data-percent="${percent}"></div>
      </div>
      <span class="ds-context-bar-label" data-slot="bar-label">${formatTokenCount(totalTokens)} (${percent}%)</span>
    `;
  } else {
    visual = `
      <span class="ds-context-text-label" data-slot="text-label">${formatTokenCount(totalTokens)} / ${formatTokenCount(modelContextWindow)}</span>
    `;
  }

  return `
    <div class="ds-context-root" data-slot="context-display-root" data-tier="${tier}" data-variant="${variant}">
      <button
        type="button"
        class="ds-context-trigger"
        data-slot="context-display-trigger"
        aria-label="Context usage: ${formatTokenCount(totalTokens)} of ${formatTokenCount(modelContextWindow)} (${percent}%)"
      >
        ${visual}
      </button>

      <div class="ds-context-popover" data-slot="context-display-popover" aria-hidden="true">
        <div class="ds-context-popover__header">
          <span class="ds-context-popover__pct" data-slot="popover-pct">${percent}% full</span>
          <span class="ds-context-popover__count" data-slot="popover-count">${formatTokenCount(totalTokens)} / ${formatTokenCount(modelContextWindow)}</span>
        </div>
        <div class="ds-context-popover__track" aria-hidden="true">
          <div class="ds-context-popover__fill" data-percent="${percent}"></div>
        </div>
        <div class="ds-context-popover__segments">
          ${segments
            .map(
              (seg) => `
            <div class="ds-context-popover__seg-row">
              <span class="ds-context-popover__seg-label">${seg.label}</span>
              <span class="ds-context-popover__seg-val">${formatTokenCount(seg.tokens)}</span>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderUsageRow(totalTokens, segments) {
  return `
    <div class="ds-flex ds-flex-wrap ds-items-center ds-justify-center ds-gap-6 ds-p-6">
      ${renderContextComponent({ variant: 'ring', totalTokens, segments })}
      ${renderContextComponent({ variant: 'bar', totalTokens, segments })}
      ${renderContextComponent({ variant: 'text', totalTokens, segments })}
    </div>
  `;
}

function attachContextInteractivity(root) {
  const items = root.querySelectorAll('[data-slot="context-display-root"]');
  items.forEach((item) => {
    const trigger = item.querySelector('[data-slot="context-display-trigger"]');
    const popover = item.querySelector('[data-slot="context-display-popover"]');

    if (!trigger || !popover) return;

    function show() {
      popover.classList.add('is-visible');
      popover.setAttribute('aria-hidden', 'false');
    }

    function hide() {
      popover.classList.remove('is-visible');
      popover.setAttribute('aria-hidden', 'true');
    }

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-flex ds-flex-col ds-gap-4">
        <div data-slot="interactive-mount">
          ${renderUsageRow(31400, [
            { label: 'Input tokens', tokens: 24800 },
            { label: 'Output tokens', tokens: 6600 },
          ])}
        </div>
        <div class="ds-flex ds-items-center ds-justify-center ds-gap-2">
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-tokens="0">0k (Empty)</button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-tokens="31400">31k (Low)</button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-tokens="92200">92k (Warning)</button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-tokens="117000">117k (Critical)</button>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-tokens="141600">141k (Overflow)</button>
        </div>
      </div>
    `;

    const mount = root.querySelector('[data-slot="interactive-mount"]');
    attachContextInteractivity(root);

    root.querySelectorAll('[data-tokens]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-tokens'), 10);
        mount.innerHTML = renderUsageRow(val, [
          { label: 'Input tokens', tokens: Math.round(val * 0.75) },
          { label: 'Output tokens', tokens: Math.round(val * 0.25) },
        ]);
        attachContextInteractivity(mount);
      });
    });

    return root;
  },
};

export const Empty = story(renderUsageRow(0, []));

export const Low = story(renderUsageRow(31400, [
  { label: 'Input tokens', tokens: 24800 },
  { label: 'Output tokens', tokens: 6600 },
]));

export const Warning = story(renderUsageRow(92200, [
  { label: 'Input tokens', tokens: 71300 },
  { label: 'Cached input tokens', tokens: 41200 },
  { label: 'Output tokens', tokens: 20900 },
]));

export const Critical = story(renderUsageRow(117000, [
  { label: 'Input tokens', tokens: 88100 },
  { label: 'Output tokens', tokens: 20500 },
  { label: 'Reasoning tokens', tokens: 8400 },
]));

export const Overflow = story(renderUsageRow(141600, [
  { label: 'Input tokens', tokens: 141600 },
]));
