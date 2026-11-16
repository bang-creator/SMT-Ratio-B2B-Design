import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 98 Onboarding',
  parameters: { layout: 'padded' },
};

const DEFAULT_STEPS = [
  {
    title: 'Ask about your own code',
    body: 'It reads the repo you point it at, so questions can be specific rather than general.',
    example: 'Why does the composer re-render on every keystroke?',
  },
  {
    title: 'Let it do the work',
    body: 'It can edit files and run your test command, and it shows you the diff before anything lands.',
    example: 'Fix the failing converter test and add a regression case.',
  },
  {
    title: 'Keep it honest',
    body: 'Every tool call is visible, and anything with side effects waits for you to approve it.',
    example: 'Run the full suite and summarize what broke.',
  },
];

function renderOnboarding({
  steps = DEFAULT_STEPS,
  index = 0,
  interactive = false,
} = {}) {
  const current = Math.min(Math.max(index, 0), steps.length - 1);
  const step = steps[current] || steps[0];
  const isLast = current >= steps.length - 1;

  return `
    <div
      data-slot="onboarding"
      class="ds-onboarding"
      data-current-index="${current}"
      data-total-steps="${steps.length}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-onboarding__content" data-slot="step-content">
        <span class="ds-onboarding__counter" data-slot="step-counter">${current + 1} of ${steps.length}</span>
        <h3 class="ds-onboarding__title" data-slot="step-title">${step.title}</h3>
        <p class="ds-onboarding__body" data-slot="step-body">${step.body}</p>
        <div class="ds-onboarding__example" data-slot="step-example">${step.example}</div>
      </div>

      <div class="ds-onboarding__footer">
        <div class="ds-onboarding__dots" data-slot="dots-container" aria-hidden="true">
          ${steps.map((_, i) => `
            <span class="ds-onboarding__dot ${i === current ? 'is-active' : ''}" data-dot-index="${i}"></span>
          `).join('')}
        </div>

        <button
          type="button"
          class="ds-onboarding__skip-btn"
          data-action="skip"
        >
          Skip
        </button>

        <button
          type="button"
          class="ds-onboarding__next-btn"
          data-action="next"
        >
          ${isLast ? 'Start' : 'Next'}
        </button>
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(card, steps) {
  let currentIndex = 0;
  const counter = card.querySelector('[data-slot="step-counter"]');
  const title = card.querySelector('[data-slot="step-title"]');
  const body = card.querySelector('[data-slot="step-body"]');
  const example = card.querySelector('[data-slot="step-example"]');
  const dots = card.querySelectorAll('.ds-onboarding__dot');
  const nextBtn = card.querySelector('[data-action="next"]');
  const skipBtn = card.querySelector('[data-action="skip"]');

  function updateStep(newIdx) {
    currentIndex = newIdx % steps.length;
    const step = steps[currentIndex];
    const isLast = currentIndex === steps.length - 1;

    card.setAttribute('data-current-index', currentIndex);
    if (counter) counter.textContent = `${currentIndex + 1} of ${steps.length}`;
    if (title) title.textContent = step.title;
    if (body) body.textContent = step.body;
    if (example) example.textContent = step.example;
    if (nextBtn) nextBtn.textContent = isLast ? 'Start' : 'Next';

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex === steps.length - 1) {
        updateStep(0);
      } else {
        updateStep(currentIndex + 1);
      }
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      updateStep(steps.length - 1);
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderOnboarding({ interactive: true });
    const card = root.querySelector('[data-slot="onboarding"]');
    if (card) attachInteractiveHandlers(card, DEFAULT_STEPS);
    return root;
  },
};

export const MiddleStep = story(renderOnboarding({
  steps: DEFAULT_STEPS,
  index: 1,
}));

export const LastStep = story(renderOnboarding({
  steps: DEFAULT_STEPS,
  index: 2,
}));

export const SingleStep = story(renderOnboarding({
  steps: DEFAULT_STEPS.slice(0, 1),
  index: 0,
}));

export const LongContent = story(renderOnboarding({
  steps: [
    {
      title: 'Connect your tools before your first question',
      body: 'Add the MCP servers your team already uses, such as Linear, GitHub and your internal docs search, so answers can cite real tickets and pull requests instead of guessing. You can change these later in settings, and nothing is called until you approve the first request.',
      example:
        'Find the Linear ticket for the draft restore bug, link the PR that fixed it, and tell me whether the regression test covers remote threads.',
    },
    ...DEFAULT_STEPS.slice(1),
  ],
  index: 0,
}));
