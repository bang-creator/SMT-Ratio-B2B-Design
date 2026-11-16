import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 127 Tooltip icon button AUI',
  parameters: { layout: 'padded' },
};

const SPARKLES_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;
const TRASH_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
const COPY_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
const REFRESH_ICON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></svg>`;

function renderTooltipBtn({
  icon = REFRESH_ICON,
  tooltip = 'Regenerate output',
  variant = 'outline',
  disabled = false,
  isOpen = false,
  side = 'top',
  id = 'btn-1',
} = {}) {
  const variantClass = variant ? `ds-tooltip-icon-btn--${variant}` : '';
  const sideClass = `ds-tooltip-icon-btn-bubble--${side}`;

  return `
    <div class="ds-tooltip-icon-btn-wrapper ${isOpen ? 'is-open' : ''}" data-slot="tooltip-btn-wrapper">
      <button
        type="button"
        class="ds-tooltip-icon-btn ${variantClass}"
        id="${id}"
        aria-label="${tooltip}"
        aria-describedby="tooltip-${id}"
        ${disabled ? 'disabled' : ''}
      >
        ${icon}
        <span class="sr-only">${tooltip}</span>
      </button>
      <div id="tooltip-${id}" role="tooltip" class="ds-tooltip-icon-btn-bubble ${sideClass}">
        ${tooltip}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-flex ds-flex-col ds-gap-4">
        <div class="ds-text-xs ds-text-secondary">Hover or focus buttons below to inspect animated tooltip:</div>
        <div class="ds-flex ds-items-center ds-gap-4">
          ${renderTooltipBtn({
            icon: REFRESH_ICON,
            tooltip: 'Regenerate output',
            variant: 'outline',
            id: 'regen',
          })}
          ${renderTooltipBtn({
            icon: COPY_ICON,
            tooltip: 'Copy code',
            variant: 'ghost',
            isOpen: true,
            side: 'bottom',
            id: 'copy',
          })}
          ${renderTooltipBtn({
            icon: TRASH_ICON,
            tooltip: 'Delete thread',
            variant: 'destructive',
            id: 'delete',
          })}
        </div>
      </div>
    `;
    return root;
  },
};

export const Disabled = story(
  () => `
    <div class="ds-flex ds-items-center ds-gap-3">
      ${renderTooltipBtn({
        icon: SPARKLES_ICON,
        tooltip: 'Generate',
        variant: 'outline',
        disabled: false,
        id: 'gen-active',
      })}
      ${renderTooltipBtn({
        icon: SPARKLES_ICON,
        tooltip: 'Generate (disabled)',
        variant: 'outline',
        disabled: true,
        id: 'gen-disabled',
      })}
    </div>
  `
);

export const Destructive = story(
  () => renderTooltipBtn({
    icon: TRASH_ICON,
    tooltip: 'Delete thread',
    variant: 'destructive',
    isOpen: true,
    side: 'top',
    id: 'trash-open',
  })
);
