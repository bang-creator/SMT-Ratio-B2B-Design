import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 119 Model selector AUI',
  parameters: { layout: 'padded' },
};

const CHEVRON_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const SPARKLE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>`;

const MODELS = [
  {
    id: 'claude-opus-4-5',
    name: 'Claude Opus 4.5',
    desc: '200K context window',
    efforts: true,
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    desc: '400K context window',
    efforts: true,
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    desc: '1M context window',
    efforts: false,
  },
];

const LOCKED_MODELS = [
  MODELS[0],
  { ...MODELS[1], desc: 'Sign in to use', disabled: true },
  { ...MODELS[2], desc: 'Sign in to use', disabled: true },
];

function renderModelSelectorComponent({
  selectedId = 'claude-opus-4-5',
  effort = 'high',
  showEffort = false,
  isOpen = false,
  isStatic = false,
  models = MODELS,
  emptySearch = false,
  searchQuery = '',
} = {}) {
  const selectedModel = models.find((m) => m.id === selectedId);
  const hasEfforts = selectedModel ? (showEffort || selectedModel.efforts) : false;
  const triggerLabel = selectedModel ? selectedModel.name : 'Select model...';

  return `
    <div
      data-slot="model-selector-root"
      class="ds-model-selector-root"
    >
      <button
        type="button"
        class="ds-model-selector-trigger"
        data-action="toggle-popover"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded="${isOpen ? 'true' : 'false'}"
        aria-label="Model: ${triggerLabel}${hasEfforts ? ` ${effort}` : ''}"
        data-slot="model-selector-trigger"
      >
        <span class="ds-model-selector-trigger__value">
          <span class="ds-model-selector-trigger__icon" aria-hidden="true">${SPARKLE_ICON}</span>
          <span class="ds-model-selector-trigger__name" data-slot="trigger-model-name">${triggerLabel}</span>
          ${
            hasEfforts
              ? `
            <span class="ds-model-selector-trigger__effort" data-slot="trigger-effort-badge">${effort}</span>
          `
              : ''
          }
        </span>
        <span class="ds-model-selector-trigger__chevron" aria-hidden="true">${CHEVRON_DOWN}</span>
      </button>

      <div
        class="ds-model-selector-popover ${isOpen ? '' : 'is-hidden'} ${isStatic ? 'ds-model-selector-popover--static' : ''}"
        data-slot="model-selector-popover"
      >
        <div class="ds-model-selector-search">
          <input
            type="text"
            class="ds-model-selector-search__input"
            data-slot="model-search-input"
            placeholder="Search models..."
            value="${searchQuery}"
            aria-label="Search models"
          />
        </div>

        <div
          class="ds-model-selector-list"
          role="listbox"
          aria-label="Available models"
          data-slot="model-list"
        >
          ${
            emptySearch
              ? `
            <div class="ds-model-selector-empty" data-slot="empty-message">No models found for "${searchQuery}"</div>
          `
              : models
                  .map(
                    (m) => `
              <button
                type="button"
                role="option"
                aria-selected="${m.id === selectedId ? 'true' : 'false'}"
                aria-disabled="${m.disabled ? 'true' : 'false'}"
                class="ds-model-selector-item ${m.id === selectedId ? 'is-selected' : ''} ${m.disabled ? 'is-disabled' : ''}"
                data-model-id="${m.id}"
                data-action="select-model"
                ${m.disabled ? 'disabled' : ''}
              >
                <div class="ds-model-selector-item__content">
                  <span class="ds-model-selector-item__name">${m.name}</span>
                  <span class="ds-model-selector-item__desc">${m.desc}</span>
                </div>
                ${
                  m.id === selectedId
                    ? `
                  <span class="ds-model-selector-item__check" data-slot="item-check" aria-hidden="true">${CHECK_ICON}</span>
                `
                    : ''
                }
              </button>
            `,
                  )
                  .join('')
          }
        </div>

        ${
          hasEfforts
            ? `
          <div class="ds-model-selector-effort" data-slot="effort-section">
            <span class="ds-model-selector-effort__label">Reasoning effort</span>
            <div class="ds-model-selector-effort__group" role="radiogroup" aria-label="Reasoning effort">
              <button
                type="button"
                role="radio"
                aria-checked="${effort === 'low' ? 'true' : 'false'}"
                class="ds-model-selector-effort__btn ${effort === 'low' ? 'is-active' : ''}"
                data-effort="low"
                data-action="set-effort"
              >
                Low
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="${effort === 'medium' ? 'true' : 'false'}"
                class="ds-model-selector-effort__btn ${effort === 'medium' ? 'is-active' : ''}"
                data-effort="medium"
                data-action="set-effort"
              >
                Medium
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="${effort === 'high' ? 'true' : 'false'}"
                class="ds-model-selector-effort__btn ${effort === 'high' ? 'is-active' : ''}"
                data-effort="high"
                data-action="set-effort"
              >
                High
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;
}

function attachModelSelectorInteractivity(root) {
  const trigger = root.querySelector('[data-action="toggle-popover"]');
  const popover = root.querySelector('[data-slot="model-selector-popover"]');
  const searchInput = root.querySelector('[data-slot="model-search-input"]');
  const items = root.querySelectorAll('[data-action="select-model"]');
  const effortBtns = root.querySelectorAll('[data-action="set-effort"]');
  const triggerName = root.querySelector('[data-slot="trigger-model-name"]');

  if (trigger && popover) {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const nextExpanded = !isExpanded;
      trigger.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
      if (nextExpanded) {
        popover.classList.remove('is-hidden');
        if (searchInput) searchInput.focus();
      } else {
        popover.classList.add('is-hidden');
      }
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target) && !popover.classList.contains('is-hidden')) {
        popover.classList.add('is-hidden');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.classList.remove('ds-hidden');
        } else {
          item.classList.add('ds-hidden');
        }
      });
    });
  }

  items.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.hasAttribute('disabled')) return;
      const modelName = item.querySelector('.ds-model-selector-item__name')?.textContent;
      if (triggerName && modelName) {
        triggerName.textContent = modelName;
      }
      items.forEach((i) => {
        i.classList.remove('is-selected');
        i.setAttribute('aria-selected', 'false');
        const check = i.querySelector('[data-slot="item-check"]');
        if (check) check.remove();
      });
      item.classList.add('is-selected');
      item.setAttribute('aria-selected', 'true');
      const checkSpan = document.createElement('span');
      checkSpan.className = 'ds-model-selector-item__check';
      checkSpan.setAttribute('data-slot', 'item-check');
      checkSpan.setAttribute('aria-hidden', 'true');
      checkSpan.innerHTML = CHECK_ICON;
      item.appendChild(checkSpan);
      popover.classList.add('is-hidden');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  effortBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      effortBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      const badge = root.querySelector('[data-slot="trigger-effort-badge"]');
      if (badge) {
        badge.textContent = btn.getAttribute('data-effort');
      }
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderModelSelectorComponent({
      selectedId: 'claude-opus-4-5',
      effort: 'high',
      showEffort: true,
      isOpen: false,
    });
    attachModelSelectorInteractivity(root);
    return root;
  },
};

export const Open = story(
  () => renderModelSelectorComponent({
    selectedId: 'claude-opus-4-5',
    effort: 'high',
    showEffort: true,
    isOpen: true,
    isStatic: true,
  })
);

export const Empty = story(
  () => renderModelSelectorComponent({
    selectedId: '',
    isOpen: false,
  })
);

export const Disabled = story(
  () => renderModelSelectorComponent({
    selectedId: 'claude-opus-4-5',
    models: LOCKED_MODELS,
    isOpen: true,
    isStatic: true,
  })
);

export const NoMatches = story(
  () => renderModelSelectorComponent({
    selectedId: 'gpt-5',
    isOpen: true,
    isStatic: true,
    emptySearch: true,
    searchQuery: 'llama',
  })
);
