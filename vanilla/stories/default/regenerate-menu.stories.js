import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 17 Regenerate Menu',
  parameters: { layout: 'padded' },
};

const REFRESH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19"></path></svg>`;

const DEFAULT_OPTIONS = [
  { id: 'opus', label: 'Try again with Opus 5', detail: 'slower' },
  { id: 'sonnet', label: 'Try again with Sonnet 5', detail: 'balanced' },
  { id: 'haiku', label: 'Try again with Haiku 4.5', detail: 'fastest' },
];

function renderRegenerateMenu({
  options = DEFAULT_OPTIONS,
  open = true,
  currentId = 'sonnet',
  interactive = true,
} = {}) {
  const optionsHtml = options
    .map((option) => {
      const isCurrent = option.id === currentId;
      const tag = isCurrent ? 'current' : option.detail;
      const tagCls = isCurrent ? 'font-mono text-[11px] text-foreground/90 shrink-0' : 'font-mono text-[11px] text-muted-foreground shrink-0';

      if (interactive) {
        return `
          <button
            type="button"
            data-id="${option.id}"
            class="ds-regen-item"
          >
            <span class="truncate">${option.label}</span>
            <span class="${tagCls}">${tag}</span>
          </button>
        `;
      }
      return `
        <div class="ds-regen-item">
          <span class="truncate">${option.label}</span>
          <span class="${tagCls}">${tag}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="regenerate-menu" class="ds-regenerate-menu">
      <button
        type="button"
        aria-expanded="${open}"
        aria-label="Regenerate with a different model"
        class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-regen-trigger"
      >
        ${REFRESH_ICON}
      </button>

      ${open ? `
        <div class="ds-floating-panel">
          ${optionsHtml}
        </div>
      ` : ''}
    </div>
  `.trim();
}

/**
 * Default: Interactive Regenerate Menu
 * Composes Shared small pill icon ghost button for trigger.
 * Clicking the trigger toggles the model selection popover; clicking a model picks it as current.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-regen-target">
          ${renderRegenerateMenu({ open: true, currentId: 'sonnet' })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-regen-target');
    let isOpen = true;
    let selected = 'sonnet';

    const setupListeners = () => {
      const trigger = target.querySelector('.ds-regen-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => {
          isOpen = !isOpen;
          target.innerHTML = renderRegenerateMenu({ open: isOpen, currentId: selected });
          setupListeners();
        });
      }

      target.querySelectorAll('.ds-regen-item').forEach((btn) => {
        btn.addEventListener('click', () => {
          selected = btn.getAttribute('data-id');
          target.innerHTML = renderRegenerateMenu({ open: isOpen, currentId: selected });
          setupListeners();
        });
      });
    };

    setupListeners();
    return root;
  },
};

/**
 * Closed: Trigger in collapsed state
 */
export const Closed = story(
  'Default / Application / 17 Regenerate Menu / Closed',
  stage('Collapsed Trigger', renderRegenerateMenu({ open: false, currentId: 'sonnet' }))
);
