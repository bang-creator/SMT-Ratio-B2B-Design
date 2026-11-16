import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 106 Reasoning AUI',
  parameters: { layout: 'padded' },
};

const BRAIN_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M12 18v4"></path></svg>`;
const CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const STEPS = [
  'The user wants the cheapest way to cut cold-start time on the docs search route.',
  'Moving the embedding model into a module-level singleton avoids reloading it on every request, which accounts for most of the 1.8s.',
  'Caching the top 200 queries would also help, but it adds invalidation work whenever the docs are rebuilt.',
  'Lazy-loading the reranker only matters on long queries, so it is the lowest priority.',
];

function renderReasoning(opts = {}) {
  const {
    open = true,
    duration = ('duration' in opts) ? opts.duration : 14,
    active = false,
    steps = STEPS,
    variant = 'outline',
    interactive = false,
  } = opts;
  const durationText = (duration !== undefined && duration !== null && duration !== false) ? ` (${duration}s)` : '';

  return `
    <div
      data-slot="reasoning-root"
      class="ds-reasoning-root"
      data-variant="${variant}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <button
        type="button"
        class="ds-reasoning-trigger ${active ? 'is-active' : ''}"
        aria-expanded="${open ? 'true' : 'false'}"
        data-slot="reasoning-trigger"
      >
        <span class="ds-reasoning-trigger__icon" aria-hidden="true">
          ${BRAIN_ICON}
        </span>
        <span class="ds-reasoning-trigger__label" data-slot="reasoning-label">
          Reasoning${durationText}
        </span>
        <span class="ds-reasoning-trigger__chevron" aria-hidden="true">
          ${CHEVRON_DOWN}
        </span>
      </button>

      <div
        class="ds-reasoning-content ${!open ? 'is-closed' : ''}"
        data-slot="reasoning-content"
      >
        <div class="ds-reasoning-fade--top" aria-hidden="true"></div>
        <div class="ds-reasoning-text" data-slot="reasoning-text">
          ${steps.map((s) => `<p>${s}</p>`).join('')}
        </div>
        ${active ? '<div class="ds-reasoning-fade--bottom" aria-hidden="true"></div>' : ''}
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(root) {
  const trigger = root.querySelector('[data-slot="reasoning-trigger"]');
  const content = root.querySelector('[data-slot="reasoning-content"]');

  if (trigger && content) {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      content.classList.toggle('is-closed', isExpanded);
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderReasoning({ open: true, duration: 14, interactive: true });
    const el = root.querySelector('[data-slot="reasoning-root"]');
    if (el) attachInteractiveHandlers(el);
    return root;
  },
};

export const Streaming = story(renderReasoning({
  open: true,
  duration: false,
  active: true,
  steps: STEPS.slice(0, 2),
}));

export const Collapsed = story(renderReasoning({
  open: false,
  duration: 14,
  active: false,
  steps: STEPS,
}));

export const LongContent = story(renderReasoning({
  open: true,
  duration: 41,
  active: false,
  steps: [
    ...STEPS,
    'Checking the trace again: the first request after a deploy spends 1.2s loading the model, 0.4s warming the vector index, and 0.2s in the reranker.',
    'A singleton fixes the first two on every warm instance. The cache would only shave the remaining 0.2s for repeated queries, which are about a third of traffic.',
    'So the order is: singleton first, measure again, then decide whether the cache is worth the invalidation work.',
  ],
}));
