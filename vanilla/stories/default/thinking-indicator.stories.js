import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 02 Thinking indicator',
  parameters: { layout: 'padded' },
};

const LABELS = [
  'Thinking',
  'Reading packages/core/src/react/runtimes/RemoteThreadList.tsx',
  'Searching embeddings for relevant context',
  'Running typecheck on generated output',
  'Synthesizing final response',
];

function renderThinkingIndicator({ label = 'Thinking', elapsed } = {}) {
  const elapsedHtml = elapsed !== undefined
    ? `<span class="ds-thinking-indicator__elapsed">${elapsed}</span>`
    : '';

  return `
    <div data-slot="thinking-indicator" class="ds-thinking-indicator" title="Click to cycle task">
      <span aria-hidden="true" class="ds-thinking-indicator__dot"></span>
      <span class="ds-thinking-indicator__label">${label}</span>
      ${elapsedHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Live Thinking Indicator
 * Displays running timer that increments in real-time. Click to switch task.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let seconds = 0;
    let labelIdx = 0;

    const formatElapsed = (sec) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-thinking-target">
          ${renderThinkingIndicator({ label: LABELS[labelIdx], elapsed: formatElapsed(seconds) })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-thinking-target');

    const timer = setInterval(() => {
      seconds++;
      const elapsedEl = target.querySelector('.ds-thinking-indicator__elapsed');
      if (elapsedEl) {
        elapsedEl.textContent = formatElapsed(seconds);
      }
    }, 1000);

    target.addEventListener('click', () => {
      labelIdx = (labelIdx + 1) % LABELS.length;
      target.innerHTML = renderThinkingIndicator({ label: LABELS[labelIdx], elapsed: formatElapsed(seconds) });
    });

    return root;
  },
};

/**
 * WithTimer: Static snapshot with 0:14 timer
 */
export const WithTimer = story(
  'Default / Application / 02 Thinking indicator / With Timer',
  stage('With Timer (0:14)', renderThinkingIndicator({ label: 'Thinking', elapsed: '0:14' }))
);

/**
 * LongLabel: Truncates long paths in a 256px container while keeping timer visible
 */
export const LongLabel = story(
  'Default / Application / 02 Thinking indicator / Long Label',
  stage(
    'Long Label (w-64)',
    `<div class="ds-thinking-indicator-container--narrow">
      ${renderThinkingIndicator({
        label: 'Reading packages/core/src/react/runtimes/RemoteThreadListThreadListRuntimeCore.tsx',
        elapsed: '2:41',
      })}
    </div>`
  )
);
