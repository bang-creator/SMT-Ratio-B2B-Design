import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Toggle Tips',
  parameters: { layout: 'padded' },
};

/* Source: Contextual help tips on platform.openai.com
 * Ground truth:
 * - Icon trigger (16px help icon)
 * - Toggles explanatory tooltip/popover card */

export const Default = story(
  'Default / Shared / Toggle Tips / Default',
  stage(
    'Toggle Tip on Switch Setting',
    `<div class="ds-row">
      <div class="ds-inline-help">
        <label class="ds-switch">
          <span>Streaming mode</span>
          <button class="ds-switch__control" type="button" role="switch" aria-checked="true" data-ds-switch>
            <span class="ds-switch__thumb"></span>
          </button>
        </label>
        <span class="ds-tooltip">
          <button class="ds-icon-button" type="button" aria-label="Streaming explanation">
            <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </button>
          <span class="ds-tooltip__content" role="tooltip">Stream output tokens via server-sent events (SSE)</span>
        </span>
      </div>
    </div>`
  )
);

export const InlineInput = story(
  'Default / Shared / Toggle Tips / Inline Input',
  stage(
    'Toggle Tip alongside Field Label',
    `<div class="ds-stack">
      <label>
        <div class="ds-row">
          <span class="ds-label">Temperature</span>
          <span class="ds-tooltip">
            <button class="ds-icon-button" type="button" aria-label="Temperature explanation">
              <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </button>
            <span class="ds-tooltip__content" role="tooltip">Controls randomness: 0 is deterministic, 2 is creative</span>
          </span>
        </div>
        <input type="number" class="ds-input" value="1.0" min="0" max="2" step="0.1">
      </label>
    </div>`
  )
);
