import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 26 Elicitation Form',
  parameters: { layout: 'padded' },
};

const PLUG_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a6 6 0 0 1-12 0V8z"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-diff-stat-add" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-diff-stat-remove" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function renderElicitationForm({
  server = 'github',
  message = 'GitHub MCP server is requesting clarification on repository and branch.',
  state = 'request',
  fields = [
    { name: 'repo', label: 'Repository', value: 'openai/design-system', kind: 'text', required: true },
    { name: 'scope', label: 'Commit scope', value: 'feat', kind: 'choice', options: ['feat', 'fix', 'refactor'] },
  ],
} = {}) {
  const fieldsHtml = fields
    .map((f) => {
      if (f.kind === 'choice') {
        return `
          <div class="ds-elicitation-form__field">
            <span class="ds-elicitation-form__label">${f.label}</span>
            <div class="ds-tag-group">
              ${(f.options || [])
                .map(
                  (opt) => `
                <button type="button" class="ds-filter-chip ${opt === f.value ? 'ds-filter-chip--active' : ''}" data-choice="${opt}">
                  ${opt}
                </button>
              `
                )
                .join('')}
            </div>
          </div>
        `;
      }
      return `
        <div class="ds-elicitation-form__field">
          <label class="ds-elicitation-form__label">${f.label}${f.required ? ' *' : ''}</label>
          <input type="text" class="ds-elicitation-form__input" value="${f.value}" />
        </div>
      `;
    })
    .join('');

  const footerHtml =
    state === 'request'
      ? `
        <div class="ds-flex ds-items-center ds-justify-end ds-gap-2">
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-elicitation-decline">Decline</button>
          <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-elicitation-send">Send</button>
        </div>
      `
      : state === 'accepted'
        ? `
        <div class="ds-flex ds-items-center ds-justify-end ds-gap-1 ds-diff-stat-add ds-text-xs ds-elicitation-receipt" title="Click to reset">
          ${CHECK_ICON}
          <span>Sent to ${server}</span>
        </div>
      `
        : `
        <div class="ds-flex ds-items-center ds-justify-end ds-gap-1 ds-diff-stat-remove ds-text-xs ds-elicitation-receipt" title="Click to reset">
          ${X_ICON}
          <span>Declined</span>
        </div>
      `;

  return `
    <div data-slot="elicitation-form" class="ds-elicitation-form">
      <div class="ds-elicitation-form__header">
        <div class="ds-elicitation-form__icon">${PLUG_ICON}</div>
        <span class="ds-font-medium ds-flex-1">${server}</span>
        <span class="ds-terminal-block__exit">needs input</span>
      </div>
      <p class="ds-elicitation-form__prompt">${message}</p>
      <div>
        ${fieldsHtml}
      </div>
      ${footerHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Elicitation Form
 * Edit inputs, toggle choice chips, and submit with Send or dismiss with Decline.
 * Displays receipt state on submission; click receipt to reset.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentState = 'request';
    let currentScope = 'feat';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-elicitation-target">
          ${renderElicitationForm({ state: currentState })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-elicitation-target');

    const update = () => {
      target.innerHTML = renderElicitationForm({
        state: currentState,
        fields: [
          { name: 'repo', label: 'Repository', value: 'openai/design-system', kind: 'text', required: true },
          { name: 'scope', label: 'Commit scope', value: currentScope, kind: 'choice', options: ['feat', 'fix', 'refactor'] },
        ],
      });
      bindEvents();
    };

    const bindEvents = () => {
      const sendBtn = target.querySelector('.ds-elicitation-send');
      const declineBtn = target.querySelector('.ds-elicitation-decline');
      const receipt = target.querySelector('.ds-elicitation-receipt');

      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          currentState = 'accepted';
          update();
        });
      }

      if (declineBtn) {
        declineBtn.addEventListener('click', () => {
          currentState = 'declined';
          update();
        });
      }

      if (receipt) {
        receipt.addEventListener('click', () => {
          currentState = 'request';
          update();
        });
      }

      target.querySelectorAll('.ds-filter-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          const val = chip.getAttribute('data-choice');
          if (val) {
            currentScope = val;
            update();
          }
        });
      });
    };

    bindEvents();
    return root;
  },
};
