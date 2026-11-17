import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 31 Code Runner',
  parameters: { layout: 'padded' },
};

const PLAY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const SPINNER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

function renderCodeRunner({
  language = 'typescript',
  code = 'const greeting: string = "Hello, world!";\nconsole.log(greeting.toUpperCase());',
  state = 'ok',
  output = ['HELLO, WORLD!'],
  duration = '42ms',
} = {}) {
  const isRunning = state === 'running';

  const outputHtml = state !== 'idle'
    ? `
      <div class="ds-code-runner__output">
        <span class="ds-code-runner__output-label">output</span>
        ${output.map((line) => `<span class="ds-code-runner__line ${state === 'error' ? 'ds-code-runner__line--error' : ''}">${line}</span>`).join('')}
        ${isRunning ? '<span class="ds-code-runner__cursor"></span>' : ''}
      </div>
    `
    : '';

  return `
    <div data-slot="code-runner" class="ds-code-runner">
      <div class="ds-code-runner__header">
        <span class="ds-code-runner__lang">${language}</span>
        ${duration && !isRunning ? `<span class="ds-code-runner__duration">${duration}</span>` : ''}
        <button type="button" aria-label="Run snippet" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-code-runner__btn ds-code-runner-trigger" ${isRunning ? 'disabled' : ''}>
          ${isRunning ? SPINNER_ICON : PLAY_ICON}
        </button>
      </div>
      <pre class="ds-code-runner__code-area"><code>${code}</code></pre>
      ${outputHtml}
    </div>
  `;
}

function bindCodeRunnerEvents(root, initialProps = {}) {
  let state = {
    language: 'typescript',
    code: 'const greeting: string = "Hello, world!";\nconsole.log(greeting.toUpperCase());',
    state: 'ok',
    output: ['HELLO, WORLD!'],
    duration: '42ms',
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderCodeRunner(state);
    attach();
  }

  function attach() {
    const runBtn = root.querySelector('.ds-code-runner-trigger');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        state.state = 'running';
        state.output = ['Compiling TypeScript...', 'Executing...'];
        update();
        setTimeout(() => {
          state.state = 'ok';
          state.output = ['HELLO, WORLD!'];
          state.duration = '38ms';
          update();
        }, 500);
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-code-runner-target">
          ${renderCodeRunner()}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-code-runner-target');
    bindCodeRunnerEvents(target);
    return root;
  },
};
