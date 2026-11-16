import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 97 Settings',
  parameters: { layout: 'padded' },
};

const DEFAULT_MODELS = ['Opus', 'Sonnet', 'Haiku'];

const DEFAULT_TOGGLES = [
  {
    key: 'tools',
    label: 'Tool use',
    detail: 'Let the model call your tools',
    on: true,
  },
  {
    key: 'memory',
    label: 'Memory',
    detail: 'Remember facts between threads',
    on: false,
  },
];

const DEFAULT_PROMPT =
  "You are a careful engineering assistant. Prefer the repo's existing conventions over your own.";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderSettingsPanel({
  model = 'Sonnet',
  models = DEFAULT_MODELS,
  systemPrompt = DEFAULT_PROMPT,
  temperature = 0.7,
  toggles = DEFAULT_TOGGLES,
  readOnly = false,
  interactive = false,
} = {}) {
  const clampedTemp = clamp(temperature, 0, 2);

  return `
    <div data-slot="settings-panel" class="ds-settings-panel" ${interactive ? 'data-interactive="true"' : ''}>
      <!-- Model Selection -->
      <div class="ds-settings-section">
        <span class="ds-settings-label">model</span>
        <div class="ds-settings-models" role="group" aria-label="Model selection">
          ${models.map((option) => {
            const isActive = option === model;
            if (readOnly) {
              return `
                <span
                  class="ds-settings-model-btn ${isActive ? 'is-active' : ''}"
                  aria-current="${isActive ? 'true' : 'false'}"
                  aria-disabled="true"
                >${option}</span>
              `;
            }
            return `
              <button
                type="button"
                class="ds-settings-model-btn ${isActive ? 'is-active' : ''}"
                aria-pressed="${isActive ? 'true' : 'false'}"
                data-model="${option}"
              >${option}</button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- System Prompt -->
      <div class="ds-settings-section">
        <span class="ds-settings-label">system prompt</span>
        <textarea
          rows="3"
          aria-label="System prompt"
          class="ds-settings-textarea"
          ${readOnly ? 'readonly' : ''}
        >${systemPrompt}</textarea>
      </div>

      <!-- Temperature -->
      <div class="ds-settings-section">
        <div class="ds-settings-temp-header">
          <span class="ds-settings-label">temperature</span>
          <span class="ds-settings-temp-val" data-slot="temp-val">${clampedTemp.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value="${clampedTemp}"
          aria-label="Temperature"
          class="ds-settings-slider"
          ${readOnly ? 'disabled' : ''}
        />
      </div>

      <!-- Toggles -->
      <div class="ds-settings-toggles" role="group" aria-label="Feature toggles">
        ${toggles.map((toggle) => {
          if (readOnly) {
            return `
              <div class="ds-settings-toggle-row" data-key="${toggle.key}">
                <div class="ds-settings-toggle-info">
                  <span class="ds-settings-toggle-label">${toggle.label}</span>
                  <span class="ds-settings-toggle-detail">${toggle.detail}</span>
                </div>
                <span
                  role="switch"
                  aria-checked="${toggle.on ? 'true' : 'false'}"
                  aria-disabled="true"
                  aria-label="${toggle.label}"
                  class="ds-settings-switch"
                >
                  <span class="ds-settings-switch-thumb"></span>
                </span>
              </div>
            `;
          }
          return `
            <div class="ds-settings-toggle-row" data-key="${toggle.key}">
              <div class="ds-settings-toggle-info">
                <span class="ds-settings-toggle-label">${toggle.label}</span>
                <span class="ds-settings-toggle-detail">${toggle.detail}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked="${toggle.on ? 'true' : 'false'}"
                aria-label="${toggle.label}"
                class="ds-settings-switch"
                data-switch-key="${toggle.key}"
              >
                <span class="ds-settings-switch-thumb"></span>
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function attachInteractiveHandlers(panel) {
  // Model selection
  const modelBtns = panel.querySelectorAll('.ds-settings-model-btn[data-model]');
  modelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modelBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    });
  });

  // Temperature slider
  const slider = panel.querySelector('.ds-settings-slider');
  const tempVal = panel.querySelector('[data-slot="temp-val"]');
  if (slider && tempVal) {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      tempVal.textContent = val.toFixed(1);
    });
  }

  // Switches
  const switches = panel.querySelectorAll('.ds-settings-switch[data-switch-key]');
  switches.forEach((sw) => {
    sw.addEventListener('click', () => {
      const isChecked = sw.getAttribute('aria-checked') === 'true';
      sw.setAttribute('aria-checked', isChecked ? 'false' : 'true');
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderSettingsPanel({ interactive: true });
    const panel = root.querySelector('[data-slot="settings-panel"]');
    if (panel) attachInteractiveHandlers(panel);
    return root;
  },
};

export const ReadOnly = story(renderSettingsPanel({
  model: 'Sonnet',
  models: DEFAULT_MODELS,
  systemPrompt: DEFAULT_PROMPT,
  temperature: 0.7,
  toggles: DEFAULT_TOGGLES,
  readOnly: true,
}));

export const Empty = story(renderSettingsPanel({
  model: 'Haiku',
  models: DEFAULT_MODELS,
  systemPrompt: '',
  temperature: 0,
  toggles: DEFAULT_TOGGLES.map((t) => ({ ...t, on: false })),
  readOnly: false,
}));

export const Clamped = story(renderSettingsPanel({
  model: 'Opus',
  models: DEFAULT_MODELS,
  systemPrompt: DEFAULT_PROMPT,
  temperature: 3.4,
  toggles: DEFAULT_TOGGLES,
  readOnly: false,
}));

export const LongContent = story(renderSettingsPanel({
  model: 'Sonnet',
  models: DEFAULT_MODELS,
  systemPrompt:
    "You are a careful engineering assistant working in the assistant-ui monorepo. Prefer the repo's existing conventions over your own. Run the package's tests before proposing a change, keep diffs small, and never touch generated files under dist or .next. When you are unsure which package owns a file, check the nearest package.json first.",
  temperature: 0.3,
  toggles: [
    ...DEFAULT_TOGGLES,
    {
      key: 'web',
      label: 'Web search with citations from the public internet',
      detail:
        'Search the web when the docs do not cover a question, and cite every page used',
      on: true,
    },
  ],
  readOnly: false,
}));
