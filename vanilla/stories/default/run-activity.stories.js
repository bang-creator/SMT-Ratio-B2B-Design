import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 20 Run Activity',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5 shrink-0 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

const DEFAULT_ENTRIES = [
  { id: 'commentary-1', kind: 'commentary', label: 'Inspecting the files', text: 'I’ll inspect the files.' },
  { id: 'read-1', kind: 'tool', label: 'Reading thread.tsx', text: 'Read thread.tsx' },
  { id: 'commentary-2', kind: 'commentary', label: 'Checking the fix', text: 'I found the issue; checking the fix.' },
  { id: 'test-1', kind: 'tool', label: 'Running the tests', text: 'All tests passed.' },
];

function renderRunActivity({
  status = 'complete',
  statusLabel = 'Completed in 42s',
  entries = DEFAULT_ENTRIES,
  open = false,
  latestActivity = 'Checking the fix',
  answer = 'The fix is ready. The tests pass.',
  attention = '',
} = {}) {
  const rotCls = open ? 'ds-rotate-90' : '';

  const entriesHtml = entries
    .map((e) => `
      <li data-activity-kind="${e.kind}">
        <span>${e.label}:</span> ${e.text}
      </li>
    `)
    .join('');

  const timelineHtml = entries.length > 0
    ? `
      <ol class="ds-activity-timeline">
        ${entriesHtml}
      </ol>
    `.trim()
    : '';

  const subtitleHtml = status === 'running' && latestActivity
    ? `<p class="ds-activity-subtitle">${latestActivity}</p>`
    : '';

  return `
    <div data-slot="run-activity" data-status="${status}" data-open="${open}" class="ds-run-activity">
      <button
        type="button"
        aria-expanded="${open}"
        class="ds-activity-trigger"
      >
        <span class="ds-chevron ${rotCls}">${CHEVRON_RIGHT}</span>
        <span class="text-start tabular-nums">${statusLabel}</span>
      </button>

      ${timelineHtml}
      ${subtitleHtml}

      ${attention ? `<div class="ds-activity-attention">${attention}</div>` : ''}

      ${answer ? `
        <div class="ds-activity-answer">
          ${answer}
        </div>
      ` : ''}
    </div>
  `.trim();
}

/**
 * Default: Interactive Run Activity
 * Click to toggle expansion of run timeline steps with smooth rotating chevron.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>20 Run Activity (Interactive Run Timeline)</code></header>
        <div class="ds-activity-target">
          ${renderRunActivity({ open: false })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-activity-target');
    const container = target.querySelector('.ds-run-activity');
    const btn = target.querySelector('.ds-activity-trigger');
    const chevron = target.querySelector('.ds-chevron');

    let isOpen = false;

    if (btn && container && chevron) {
      btn.addEventListener('click', () => {
        isOpen = !isOpen;
        container.setAttribute('data-open', String(isOpen));
        btn.setAttribute('aria-expanded', String(isOpen));
        chevron.classList.toggle('ds-rotate-90', isOpen);
      });
    }

    return root;
  },
};

/**
 * Expanded: Static view showing full step timeline
 */
export const Expanded = story(
  'Default / Application / 20 Run Activity / Expanded',
  stage('Expanded Activity', renderRunActivity({ open: true }))
);

/**
 * Running: Active run with subtitle
 */
export const Running = story(
  'Default / Application / 20 Run Activity / Running',
  stage('Active Run', renderRunActivity({ status: 'running', statusLabel: 'Running tools (12s)', open: false, answer: '' }))
);
