import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 30 Computer Use',
  parameters: { layout: 'padded' },
};

const MOUSE_POINTER = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="3 3 10.07 19.97 12.58 12.58 19.97 10.07 3 3"></polygon></svg>`;

const DEFAULT_STEPS = [
  { id: '1', action: 'navigate', target: 'https://platform.openai.com/playground', x: 20, y: 25 },
  { id: '2', action: 'type', target: 'textarea[placeholder="Enter prompt..."]', x: 35, y: 45 },
  { id: '3', action: 'click', target: 'Button[name="Run"]', x: 62, y: 65 },
  { id: '4', action: 'scroll', target: 'div.output-stream', x: 50, y: 75 },
  { id: '5', action: 'click', target: 'Button[name="Save"]', x: 80, y: 30 },
];

function renderComputerUse({
  url = 'https://platform.openai.com/playground',
  steps = DEFAULT_STEPS,
  activeIndex = 2,
} = {}) {
  const active = steps[activeIndex] || steps[0];
  const stepNumber = activeIndex + 1;
  const trailCount = Math.min(activeIndex + 1, 3);
  const startIdx = Math.max(0, activeIndex - 2);

  const dotsHtml = [];
  for (let i = startIdx; i <= activeIndex; i++) {
    const stepNum = i + 1;
    dotsHtml.push(`<span class="ds-computer-dot ds-computer-dot-${stepNum}" aria-hidden="true"></span>`);
  }

  return `
    <div data-slot="computer-use" class="ds-computer-use">
      <div class="ds-computer-use__bar">
        <div class="ds-window-dots">
          <span class="ds-window-dot ds-window-dot--close" aria-hidden="true"></span>
          <span class="ds-window-dot ds-window-dot--minimize" aria-hidden="true"></span>
          <span class="ds-window-dot ds-window-dot--maximize" aria-hidden="true"></span>
        </div>
        <span class="ds-computer-use__address">${url}</span>
      </div>

      <div class="ds-computer-use__viewport ds-computer-use-advance" title="Click viewport to advance step">
        ${dotsHtml.join('')}
        <div class="ds-computer-cursor ds-computer-cursor--step-${stepNumber}">
          ${MOUSE_POINTER}
        </div>
      </div>

      <div class="ds-computer-use__footer">
        <span class="ds-computer-use__action">${active.action}</span>
        <span class="ds-computer-use__target">${active.target}</span>
        <span class="ds-computer-use__step">${stepNumber}/${steps.length}</span>
      </div>
    </div>
  `;
}

function bindComputerUseEvents(root, initialProps = {}) {
  let state = {
    url: 'https://platform.openai.com/playground',
    steps: DEFAULT_STEPS,
    activeIndex: 2,
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderComputerUse(state);
    attach();
  }

  function attach() {
    const viewport = root.querySelector('.ds-computer-use__viewport');
    if (viewport) {
      viewport.addEventListener('click', () => {
        state.activeIndex = (state.activeIndex + 1) % state.steps.length;
        update();
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
        <header><code>30 Computer Use (Interactive Browser Simulation)</code></header>
        <div class="ds-computer-target">
          ${renderComputerUse()}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-computer-target');
    bindComputerUseEvents(target);
    return root;
  },
};
