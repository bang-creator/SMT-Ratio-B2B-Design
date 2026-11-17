import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 21 Tool Timeline',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__chevron" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const SPARKLES_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path></svg>`;
const FILE_SEARCH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="11.5" cy="14.5" r="2.5"></circle><path d="m13.5 16.5 2 2"></path></svg>`;
const TERMINAL_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;
const PEN_LINE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>`;

function renderToolTimeline({
  restingLabel = '4 steps · 2 files changed',
  activeLabel = 'Working for 3s',
  streaming = false,
  open = true,
  steps = [
    { verb: 'Thinking', chip: 'planning the change', icon: SPARKLES_ICON },
    { verb: 'Read', chip: 'thread.tsx', icon: FILE_SEARCH_ICON },
    { verb: 'Ran', chip: 'pnpm vitest', icon: TERMINAL_ICON },
    { verb: 'Edited', chip: 'composer.tsx', icon: PEN_LINE_ICON },
  ],
  stats = [
    { file: 'composer.tsx', added: 14, removed: 3 },
    { file: 'use-draft.ts', added: 42 },
  ],
} = {}) {
  const labelHtml = streaming
    ? `<span class="ds-thinking-indicator__label">${activeLabel}</span>`
    : `<span>${restingLabel}</span>`;

  const stepsHtml = steps
    .map(
      (s, i) => `
    <div class="ds-tool-timeline__step">
      ${s.icon}
      ${streaming && i === steps.length - 1 ? `<span class="ds-thinking-indicator__label">${s.verb}</span>` : `<span>${s.verb}</span>`}
      <span class="ds-reasoning-chip">${s.chip}</span>
    </div>
  `
    )
    .join('');

  const statsHtml = stats.length
    ? `
    <div class="ds-tool-timeline__stats">
      ${stats
        .map(
          (stat) => `
        <span class="ds-file-stat">
          <span>${stat.file}</span>
          ${stat.added !== undefined ? `<span class="ds-diff-stat-add">+${stat.added}</span>` : ''}
          ${stat.removed !== undefined ? `<span class="ds-diff-stat-remove">−${stat.removed}</span>` : ''}
        </span>
      `
        )
        .join('')}
    </div>
  `
    : '';

  return `
    <div data-slot="tool-timeline" class="ds-tool-timeline" data-open="${open}">
      <button type="button" class="ds-tool-timeline__trigger ds-tool-timeline-btn" aria-expanded="${open}">
        ${CHEVRON_RIGHT}
        ${labelHtml}
      </button>
      <div class="ds-tool-timeline__content">
        ${stepsHtml}
        ${statsHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Tool Timeline Disclosure
 * Click to toggle expansion of tool execution steps and file change diff statistics.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-timeline-target">
          ${renderToolTimeline({ open: true, streaming: false })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-timeline-target');
    const container = target.querySelector('.ds-tool-timeline');
    const btn = target.querySelector('.ds-tool-timeline-btn');

    if (btn && container) {
      btn.addEventListener('click', () => {
        const isOpen = container.getAttribute('data-open') === 'true';
        const nextOpen = !isOpen;
        container.setAttribute('data-open', String(nextOpen));
        btn.setAttribute('aria-expanded', String(nextOpen));
      });
    }

    return root;
  },
};

/**
 * Streaming: Active run execution with shimmer label
 */
export const Streaming = story(
  'Default / Application / 21 Tool Timeline / Streaming',
  stage('Active Execution', renderToolTimeline({ open: true, streaming: true }))
);
