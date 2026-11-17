import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 19 Tool Call',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-tool-call__chevron"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function renderToolCall({
  label = 'Searched the docs',
  activeLabel = 'Searching the docs',
  query = 'draft persistence',
  request = '{"query": "draft persistence"}',
  result = '3 matches, best hit /docs/runtime/drafts',
  running = false,
  failed = false,
  open = false,
} = {}) {
  const currentLabel = running ? activeLabel : label;
  const labelCls = running ? 'ds-thinking-indicator__label' : 'ds-tool-call__label';

  const statusIcon = running
    ? ''
    : failed
      ? X_ICON
      : CHECK_ICON;

  const contentHtml = `
    <div class="ds-tool-call__content">
      <div class="px-3.5 pt-2.5 pb-2">
        <p class="font-mono text-[11px] text-muted-foreground mb-1">Request</p>
        <p class="text-muted-foreground font-mono break-words">${request}</p>
      </div>
      <div class="ds-tool-call__divider"></div>
      <div class="px-3.5 pt-2 pb-2.5">
        <p class="font-mono text-[11px] text-muted-foreground mb-1">Result</p>
        <p class="text-foreground/90 break-words">${result}</p>
      </div>
    </div>
  `.trim();

  return `
    <div data-slot="tool-call" class="ds-tool-call" data-open="${open}">
      <button
        type="button"
        aria-expanded="${open}"
        class="ds-tool-trigger"
      >
        <span class="ds-chevron">${CHEVRON_RIGHT}</span>
        <span class="${labelCls}">
          ${currentLabel}
        </span>
        <span class="ds-tool-call__chip">
          ${query}
        </span>
        <span class="ds-tool-call__status-icon">
          ${statusIcon}
        </span>
      </button>

      ${contentHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Tool Call Disclosure
 * Click to toggle expansion of request and response payload panel with rotating chevron animation.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-tool-target">
          ${renderToolCall({ open: false })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-tool-target');
    let isOpen = false;

    const setupListeners = () => {
      const btn = target.querySelector('.ds-tool-trigger');
      if (btn) {
        btn.addEventListener('click', () => {
          isOpen = !isOpen;
          target.innerHTML = renderToolCall({ open: isOpen });
          setupListeners();
        });
      }
    };

    setupListeners();
    return root;
  },
};

/**
 * Expanded: Static view showing open parameters and results
 */
export const Expanded = story(
  'Default / Application / 19 Tool Call / Expanded',
  stage('Open Tool Call', renderToolCall({ open: true }))
);

/**
 * Running: Active execution state with shimmer animation
 */
export const Running = story(
  'Default / Application / 19 Tool Call / Running',
  stage('Executing Tool', renderToolCall({ running: true, open: false }))
);

/**
 * Failed: Failed tool call with error icon
 */
export const Failed = story(
  'Default / Application / 19 Tool Call / Failed',
  stage('Failed Tool', renderToolCall({ failed: true, open: true, result: 'Connection refused: port 5432' }))
);
