import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 84 Prompt library',
  parameters: { layout: 'padded' },
};

const ICONS = {
  bookmark: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>`,
};

const PROMPTS = [
  {
    id: '1',
    name: 'Review this PR',
    body: 'Review {branch} against the repo conventions. Judge whether it should exist before checking correctness.',
    variables: ['branch'],
  },
  {
    id: '2',
    name: 'Write a changeset',
    body: 'Write a patch changeset for {package} in lowercase, one line.',
    variables: ['package'],
  },
  {
    id: '3',
    name: 'Explain this file',
    body: 'Explain what this file does and which invariants it protects.',
    variables: [],
  },
];

const LONG_PROMPT = {
  id: '4',
  name: 'Draft a customer incident report for the enterprise support channel',
  body: 'Write an incident report for {customer} covering the outage on {date}. Start with impact in one sentence, then the timeline from {start_time} to {end_time}, the root cause in plain words, and what {team} is changing so it does not happen again. Keep it under 300 words and avoid internal service names.',
  variables: ['customer', 'date', 'start_time', 'end_time', 'team'],
};

function renderPromptLibrary({
  query = '',
  prompts = PROMPTS,
  selectedId = '1',
} = {}) {
  const matches = prompts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );
  const selected = matches.find((p) => p.id === selectedId);

  const itemsHtml = matches
    .map((p) => {
      const isSelected = p.id === selectedId;
      return `
        <button
          type="button"
          role="option"
          data-slot="prompt-item"
          data-id="${p.id}"
          aria-selected="${isSelected}"
          class="ds-prompt-item ${isSelected ? 'ds-prompt-item--selected' : ''}"
        >
          <span class="ds-prompt-item-name">${p.name}</span>
          ${
            p.variables.length > 0
              ? `<span class="ds-prompt-item-vars">${p.variables.length} ${p.variables.length === 1 ? 'var' : 'vars'}</span>`
              : ''
          }
        </button>
      `;
    })
    .join('');

  return `
    <div data-slot="prompt-library" class="ds-prompt-library">
      <div class="ds-prompt-search">
        <span class="ds-prompt-search-icon" aria-hidden="true">
          ${ICONS.bookmark}
        </span>
        <input
          type="text"
          data-slot="prompt-search-input"
          placeholder="Search prompts"
          value="${query}"
          aria-label="Search saved prompts"
          role="combobox"
          aria-expanded="${matches.length > 0}"
        />
      </div>

      <div class="ds-prompt-list" role="listbox" aria-label="Saved prompts">
        ${itemsHtml}
      </div>

      ${
        matches.length === 0
          ? `<span data-slot="prompt-empty" class="ds-prompt-empty">Nothing matches “${query}”</span>`
          : ''
      }

      ${
        selected
          ? `
        <div data-slot="prompt-preview" class="ds-prompt-preview">
          <p class="ds-prompt-preview-body">${selected.body}</p>
          ${
            selected.variables.length > 0
              ? `
            <div class="ds-prompt-preview-vars">
              ${selected.variables
                .map((v) => `<span class="ds-prompt-var-tag">{${v}}</span>`)
                .join('')}
            </div>
          `
              : ''
          }
        </div>
      `
          : ''
      }
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentQuery = '';
    let currentSelectedId = '1';

    const render = () => {
      const matches = PROMPTS.filter((p) =>
        p.name.toLowerCase().includes(currentQuery.toLowerCase()),
      );
      const selected = matches.find((p) => p.id === currentSelectedId);

      const badgeText = selected
        ? selected.name
        : matches.length > 0
        ? `${matches.length} prompts`
        : 'No matches';

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderPromptLibrary({
              query: currentQuery,
              prompts: PROMPTS,
              selectedId: currentSelectedId,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="prompt-search-input"]');
      if (input) {
        input.focus();
        input.setSelectionRange(currentQuery.length, currentQuery.length);

        input.addEventListener('input', (e) => {
          currentQuery = e.target.value;
          const currentMatches = PROMPTS.filter((p) =>
            p.name.toLowerCase().includes(currentQuery.toLowerCase()),
          );
          if (!currentMatches.some((p) => p.id === currentSelectedId) && currentMatches.length > 0) {
            currentSelectedId = currentMatches[0].id;
          }
          render();
        });

        input.addEventListener('keydown', (e) => {
          const currentMatches = PROMPTS.filter((p) =>
            p.name.toLowerCase().includes(currentQuery.toLowerCase()),
          );
          if (currentMatches.length === 0) return;
          const at = currentMatches.findIndex((p) => p.id === currentSelectedId);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = (at + 1) % currentMatches.length;
            currentSelectedId = currentMatches[nextIdx].id;
            render();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = (at - 1 + currentMatches.length) % currentMatches.length;
            currentSelectedId = currentMatches[prevIdx].id;
            render();
          }
        });
      }

      root.querySelectorAll('[data-slot="prompt-item"]').forEach((item) => {
        item.addEventListener('click', () => {
          currentSelectedId = item.getAttribute('data-id');
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const Filtered = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderPromptLibrary({
        query: 'write',
        prompts: PROMPTS,
        selectedId: '2',
      })}
    </div>
  </div>
`);

export const NoMatches = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderPromptLibrary({
        query: 'deploy checklist',
        prompts: PROMPTS,
        selectedId: '',
      })}
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderPromptLibrary({
        query: '',
        prompts: [LONG_PROMPT, ...PROMPTS],
        selectedId: '4',
      })}
    </div>
  </div>
`);
