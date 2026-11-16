import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 149 Create task AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderCreateTaskForm({
  title = 'Fix flaky playwright e2e tests',
  desc = 'Increase timeout and isolate mock sessions across parallel runs.',
  dueDate = '2026-11-28',
  priority = 'medium',
  status = 'form', // 'form' | 'submitted'
} = {}) {
  if (status === 'submitted') {
    return `
      <div class="ds-generative-card ds-gen-task-card" data-slot="generative-card">
        <h3 class="ds-gen-task-card__title">Create task</h3>
        <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
            ${CHECK_ICON}
            <strong>Task created successfully!</strong>
          </div>
          <span class="ds-text-xs ds-text-secondary">Task "${title}" added to backlog.</span>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2" data-action="create-another">
            Create another
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="ds-generative-card ds-gen-task-card" data-slot="generative-card">
      <form class="ds-flex ds-flex-col ds-gap-3" data-slot="task-form" onsubmit="return false;">
        <h3 class="ds-gen-task-card__title">Create task</h3>

        <div class="ds-gen-task-card__field">
          <label for="task-title-input" class="ds-gen-task-card__label">Title</label>
          <input id="task-title-input" type="text" class="ds-gen-task-card__input" data-slot="input-title" placeholder="Task title" value="${title}">
        </div>

        <div class="ds-gen-task-card__field">
          <label for="task-desc-input" class="ds-gen-task-card__label">Description</label>
          <textarea id="task-desc-input" rows="3" class="ds-gen-task-card__textarea" data-slot="input-desc" placeholder="Add more detail...">${desc}</textarea>
        </div>

        <div class="ds-gen-task-card__row">
          <div class="ds-gen-task-card__field ds-gen-task-card__field--flex">
            <label for="task-date-input" class="ds-gen-task-card__label">Due date</label>
            <input id="task-date-input" type="date" class="ds-gen-task-card__input" data-slot="input-date" value="${dueDate}">
          </div>

          <div class="ds-gen-task-card__field">
            <label class="ds-gen-task-card__label">Priority</label>
            <div class="ds-gen-task-card__priority-chips" role="radiogroup" aria-label="Task priority">
              <button type="button" role="radio" aria-checked="${priority === 'low'}" class="ds-gen-task-card__chip ${priority === 'low' ? 'ds-gen-task-card__chip--active' : ''}" data-action="set-priority" data-priority="low">Low</button>
              <button type="button" role="radio" aria-checked="${priority === 'medium'}" class="ds-gen-task-card__chip ${priority === 'medium' ? 'ds-gen-task-card__chip--active' : ''}" data-action="set-priority" data-priority="medium">Med</button>
              <button type="button" role="radio" aria-checked="${priority === 'high'}" class="ds-gen-task-card__chip ${priority === 'high' ? 'ds-gen-task-card__chip--active' : ''}" data-action="set-priority" data-priority="high">High</button>
            </div>
          </div>
        </div>

        <div class="ds-mt-1">
          <button type="submit" class="ds-button ds-button--primary ds-gen-task-card__btn" data-action="submit-task">Create task</button>
        </div>
      </form>
    </div>
  `;
}

function attachTaskHandler(root) {
  const form = root.querySelector('[data-slot="task-form"]');
  const card = root.querySelector('[data-slot="generative-card"]');
  if (!form || !card) return;

  root.querySelectorAll('[data-action="set-priority"]').forEach((chip) => {
    chip.addEventListener('click', () => {
      root.querySelectorAll('[data-action="set-priority"]').forEach((c) => {
        c.classList.remove('ds-gen-task-card__chip--active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('ds-gen-task-card__chip--active');
      chip.setAttribute('aria-checked', 'true');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleInput = form.querySelector('[data-slot="input-title"]');
    const taskTitle = titleInput ? titleInput.value : 'New Task';

    card.innerHTML = `
      <h3 class="ds-gen-task-card__title">Create task</h3>
      <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
          ${CHECK_ICON}
          <strong>Task created successfully!</strong>
        </div>
        <span class="ds-text-xs ds-text-secondary">Task "${taskTitle}" added to backlog.</span>
        <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2" data-action="create-another">
          Create another
        </button>
      </div>
    `;

    const anotherBtn = card.querySelector('[data-action="create-another"]');
    if (anotherBtn) {
      anotherBtn.addEventListener('click', () => {
        card.parentElement.innerHTML = renderCreateTaskForm();
        attachTaskHandler(root);
      });
    }
  });
}

export const Default = story(
  () => stage(renderCreateTaskForm()),
  { postRender: attachTaskHandler }
);

export const Submitted = story(() =>
  stage(
    renderCreateTaskForm({
      status: 'submitted',
      title: 'Audit and refactor 151 components',
    })
  )
);

export const UrgentPriority = story(() =>
  stage(
    renderCreateTaskForm({
      title: 'Security Vulnerability: Hotfix token auth in production',
      desc: 'CVE-2026-9912 vulnerability discovered in JWT verification library. Immediate patch deployment required.',
      dueDate: '2026-11-17',
      priority: 'high',
    })
  )
);

export const LongDescription = story(() =>
  stage(
    renderCreateTaskForm({
      title: 'Full Storybook Component Matrix Verification Protocol',
      desc: 'Execute end-to-end headless browser regression suite covering all 151 application stories with strict zero-guess ground-truth token verification, transparent hover state validation across all background surfaces, and DOM hierarchy alignment.',
      dueDate: '2026-12-01',
      priority: 'medium',
    })
  )
);
