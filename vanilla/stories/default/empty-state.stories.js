import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 89 Empty state',
  parameters: { layout: 'padded' },
};

const ARROW_UP = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;

const DEFAULT_SUGGESTIONS = [
  'Explain this repo',
  'Find a bug',
  'Write a migration',
  'Review my open diff',
];

const MANY_SUGGESTIONS = [
  'Explain this repo',
  'Find why the converter drops empty parts',
  'Write a migration for 0.14',
  "Summarize yesterday's PRs",
  'Add a regression test',
  'Review my open diff',
];

function renderEmptyState({
  greeting = 'What are we building?',
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = 'Ask anything',
  disabled = false,
} = {}) {
  return `
    <div data-slot="empty-state" class="ds-empty-state">
      <h2 data-slot="empty-state-greeting" class="ds-empty-state__greeting">${greeting}</h2>

      ${
        suggestions && suggestions.length > 0
          ? `
        <div data-slot="empty-state-suggestions" class="ds-empty-state__suggestions">
          ${suggestions
            .map(
              (s) => `
            <button
              type="button"
              data-slot="empty-state-suggestion"
              class="ds-empty-state__suggestion"
              ${disabled ? 'disabled' : ''}
            >${s}</button>
          `,
            )
            .join('')}
        </div>
      `
          : ''
      }

      <div data-slot="empty-state-composer" class="ds-empty-state__composer">
        <input
          type="text"
          class="ds-empty-state__input"
          placeholder="${placeholder}"
          aria-label="${placeholder}"
          data-slot="composer-input"
        />
        <button
          type="button"
          aria-label="Send"
          class="ds-empty-state__send-btn"
          ${disabled ? 'disabled' : ''}
          data-slot="send-btn"
        >
          ${ARROW_UP}
        </button>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let submittedQuery = null;

    const render = () => {
      let bodyHtml = '';
      let badgeText = submittedQuery ? 'Active Session' : 'Starter Prompts';

      if (submittedQuery) {
        bodyHtml = `
          <div data-slot="empty-state" class="ds-empty-state">
            <h2 class="ds-empty-state__greeting" data-slot="submitted-header">Session Started</h2>
            <div class="ds-card ds-card--interactive ds-p-4 ds-w-full ds-text-left" role="button" tabindex="0" data-slot="reset-session" title="Click to reset">
              <span class="ds-text-xs ds-text-secondary ds-block ds-mb-1">Active user prompt:</span>
              <p class="ds-text-sm ds-text-primary ds-font-medium ds-m-0">"${submittedQuery}"</p>
              <span class="ds-text-xs ds-text-brand ds-block ds-mt-2">Click card to reset to empty state</span>
            </div>
          </div>
        `;
      } else {
        bodyHtml = renderEmptyState({
          greeting: 'What are we building?',
          suggestions: DEFAULT_SUGGESTIONS,
        });
      }

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">89 Empty state</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${bodyHtml}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="reset-session"]')?.addEventListener('click', () => {
        submittedQuery = null;
        render();
      });

      const input = root.querySelector('[data-slot="composer-input"]');
      const sendBtn = root.querySelector('[data-slot="send-btn"]');
      const suggestionBtns = root.querySelectorAll('[data-slot="empty-state-suggestion"]');

      function handleSend(text) {
        if (!text) return;
        submittedQuery = text;
        render();
      }

      sendBtn?.addEventListener('click', () => {
        handleSend(input?.value.trim());
      });

      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend(input?.value.trim());
        }
      });

      suggestionBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          handleSend(btn.textContent.trim());
        });
      });
    };

    render();
    return root;
  },
};

export const NoSuggestions = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">89 Empty state (No Suggestions)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Quiet Surface</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderEmptyState({
        greeting: 'What are we building?',
        suggestions: [],
      })}
    </div>
  </div>
`);

export const ManySuggestions = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">89 Empty state (Many Prompts)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Multi-row Wrap</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderEmptyState({
        greeting: 'Good morning, Harry. Where do we start?',
        suggestions: MANY_SUGGESTIONS,
      })}
    </div>
  </div>
`);
