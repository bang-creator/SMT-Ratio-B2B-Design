import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 22 Terminal Block',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-diff-stat-add" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const X_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-diff-stat-remove" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
const SPINNER_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

function renderTerminalBlock({
  command = 'pnpm test',
  cwd = '~/projects/assistant-ui',
  lines = [
    '✓ src/components/button.test.tsx (3 tests) 18ms',
    '✓ src/components/composer.test.tsx (8 tests) 42ms',
    '✓ src/components/thread.test.tsx (12 tests) 95ms',
    'Tests: 23 passed, 23 total',
    'Snapshots: 0 total',
    'Time: 1.42s',
  ],
  stderr = [],
  done = true,
  exitCode = 0,
  duration = '1.4s',
  variant = 'paper',
} = {}) {
  const isFailed = done && exitCode !== 0;
  const statusIcon = !done
    ? SPINNER_ICON
    : isFailed
      ? X_ICON
      : CHECK_ICON;

  const exitText = done
    ? `<span class="ds-terminal-block__exit ${isFailed ? 'ds-terminal-block__exit--fail' : ''}">exit ${exitCode}</span>`
    : '';

  const durationHtml = done && duration
    ? `<span class="ds-terminal-block__exit">${duration}</span>`
    : '';

  const allLines = [
    ...lines.map((l, i) => ({ text: l, isStderr: false, isLast: i === lines.length - 1 })),
    ...stderr.map((l) => ({ text: l, isStderr: true, isLast: false })),
  ];

  const linesHtml = allLines
    .map(
      (item) => `
    <div class="ds-terminal-block__line ${item.isStderr ? 'ds-terminal-block__line--stderr' : item.isLast ? 'ds-terminal-block__line--last' : ''}">
      <span>${item.text}</span>
    </div>
  `
    )
    .join('');

  const cursorHtml = !done ? `<span class="ds-terminal-cursor"></span>` : '';

  return `
    <div data-slot="terminal-block" class="ds-terminal-block ${variant === 'ink' ? 'ds-terminal-block--ink' : ''}">
      <div class="ds-terminal-block__header">
        <span class="ds-terminal-block__cmd">
          ${cwd ? `<span class="ds-terminal-block__cwd">${cwd} $ </span>` : ''}${command}
        </span>
        <div class="ds-terminal-block__status">
          ${statusIcon}
          ${exitText}
          ${durationHtml}
          ${done ? `<button type="button" aria-label="Copy output" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-copy-btn">${COPY_ICON}</button>` : ''}
        </div>
      </div>
      <div class="ds-terminal-block__viewport">
        ${linesHtml}
        ${cursorHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Terminal Block (Paper Surface)
 * Click copy button to trigger clipboard copy animation.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-terminal-target">
          ${renderTerminalBlock({ done: true, exitCode: 0, duration: '1.4s', variant: 'paper' })}
        </div>
      </section>
    `;

    const copyBtn = root.querySelector('.ds-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyBtn.innerHTML = CHECK_ICON;
        setTimeout(() => {
          copyBtn.innerHTML = COPY_ICON;
        }, 1500);
      });
    }

    return root;
  },
};

/**
 * Ink: Distinct structural variant (High-contrast dark terminal surface)
 */
export const Ink = story(
  'Default / Application / 22 Terminal Block / Ink',
  stage('Ink Surface Variant', renderTerminalBlock({ variant: 'ink', done: true, exitCode: 0, duration: '1.4s' }))
);

/**
 * Running: Active terminal execution with spinner and pulsing cursor
 */
export const Running = story(
  'Default / Application / 22 Terminal Block / Running',
  stage('Running Command', renderTerminalBlock({ done: false, lines: ['Running vitest suite...'] }))
);

/**
 * Failed: Non-zero exit code with error outputs
 */
export const Failed = story(
  'Default / Application / 22 Terminal Block / Failed',
  stage(
    'Failed Command',
    renderTerminalBlock({
      done: true,
      exitCode: 1,
      duration: '0.8s',
      lines: ['✗ src/components/button.test.tsx'],
      stderr: ['Error: Expected 3 to equal 4'],
    })
  )
);
