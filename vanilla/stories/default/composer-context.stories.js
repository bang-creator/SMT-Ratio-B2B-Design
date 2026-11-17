import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 81 Context',
  parameters: { layout: 'padded' },
};

const ICONS = {
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  arrowUp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
};

function renderContextComposer({
  usage = { system: 12, tools: 8, messages: 0, total: 200 },
  popoverOpen = false,
  value = '',
} = {}) {
  const used = usage.system + usage.tools + usage.messages;
  const fraction = usage.total === 0 ? 0 : used / usage.total;
  const clampedFraction = Math.min(Math.max(fraction, 0), 1);
  const warn = fraction > 0.85;
  const pctUsed = Math.round(fraction * 100);

  const CIRCUMFERENCE = 37.7;
  const dashoffset = (CIRCUMFERENCE * (1 - clampedFraction)).toFixed(1);

  const sysPct = Math.round((usage.system / usage.total) * 100);
  const toolsPct = Math.round((usage.tools / usage.total) * 100);
  const msgsPct = Math.round((usage.messages / usage.total) * 100);

  const sysClass = sysPct >= 6 ? 'ds-context-w-6' : 'ds-context-w-0';
  const toolsClass = toolsPct >= 4 ? 'ds-context-w-4' : 'ds-context-w-0';
  const msgsClass = msgsPct >= 98 ? 'ds-context-w-98' : msgsPct >= 81 ? 'ds-context-w-81' : 'ds-context-w-0';

  return `
    <div data-slot="composer" class="ds-composer">
      <div data-slot="composer-bar" class="ds-composer-bar">
        <input
          type="text"
          data-slot="composer-input"
          class="ds-composer-input"
          placeholder="Ask anything"
          value="${value}"
          aria-label="Composer query input"
        />

        <div data-slot="composer-toolbar" class="ds-composer-toolbar">
          <div data-slot="composer-actions" class="ds-composer-actions">
            <button
              type="button"
              data-slot="composer-attach"
              class="ds-composer-attach-btn ds-icon-button ds-icon-button--ghost ds-button--pill"
              aria-label="Add attachment"
            >
              ${ICONS.plus}
            </button>
          </div>

          <div data-slot="composer-actions" class="ds-composer-actions">
            <div data-slot="composer-context" class="ds-composer-context">
              <div
                data-slot="composer-context-popover"
                data-visible="${popoverOpen}"
                class="ds-composer-context-popover"
                role="tooltip"
              >
                <div class="ds-composer-context-header">
                  <p class="ds-composer-context-title">Context</p>
                  <p
                    data-slot="composer-context-pct"
                    data-warn="${warn}"
                    class="ds-composer-context-pct"
                  >
                    ${pctUsed}%
                  </p>
                </div>

                <div class="ds-composer-context-bar" aria-hidden="true">
                  <span class="ds-composer-context-bar-segment ds-composer-context-bar-system ${sysClass}"></span>
                  <span class="ds-composer-context-bar-segment ds-composer-context-bar-tools ${toolsClass}"></span>
                  <span class="ds-composer-context-bar-segment ds-composer-context-bar-messages ${msgsClass}"></span>
                </div>

                <div class="ds-composer-context-rows">
                  <div class="ds-composer-context-row">
                    <span class="ds-composer-context-row-dot ds-composer-context-bar-system" aria-hidden="true"></span>
                    <span class="ds-composer-context-row-label">System</span>
                    <span class="ds-composer-context-row-val">${usage.system}k</span>
                  </div>

                  <div class="ds-composer-context-row">
                    <span class="ds-composer-context-row-dot ds-composer-context-bar-tools" aria-hidden="true"></span>
                    <span class="ds-composer-context-row-label">Tools</span>
                    <span class="ds-composer-context-row-val">${usage.tools}k</span>
                  </div>

                  <div class="ds-composer-context-row">
                    <span class="ds-composer-context-row-dot ds-composer-context-bar-messages" aria-hidden="true"></span>
                    <span class="ds-composer-context-row-label">Messages</span>
                    <span class="ds-composer-context-row-val">${usage.messages}k</span>
                  </div>
                </div>

                <div class="ds-composer-context-divider" aria-hidden="true"></div>

                <div class="ds-composer-context-footer">
                  <span>Total</span>
                  <span data-slot="composer-context-total" class="ds-composer-context-row-val">${used}k / ${usage.total}k</span>
                </div>
              </div>

              <button
                type="button"
                data-slot="composer-context-trigger"
                data-warn="${warn}"
                aria-label="Context usage (${pctUsed}% used)"
                class="ds-composer-context-trigger"
              >
                <svg viewBox="0 0 16 16" class="ds-composer-context-ring-svg" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" fill="none" stroke-width="2.5" class="ds-composer-context-ring-bg" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    fill="none"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-dasharray="37.7"
                    stroke-dashoffset="${dashoffset}"
                    class="ds-composer-context-ring-fg"
                  />
                </svg>
              </button>
            </div>

            <button
              type="button"
              data-slot="composer-send"
              data-state="${value.trim().length > 0 ? 'active' : 'idle'}"
              class="ds-composer-send-btn ${value.trim().length > 0 ? 'ds-composer-send-btn--active' : ''}"
              aria-label="Send message"
              ${value.trim().length === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowUp}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const PRESETS = [
      { name: 'Fresh thread', usage: { system: 12, tools: 8, messages: 0, total: 200 } },
      { name: 'Active discussion', usage: { system: 12, tools: 8, messages: 84, total: 200 } },
      { name: 'Near limit', usage: { system: 12, tools: 8, messages: 162, total: 200 } },
      { name: 'Full window', usage: { system: 12, tools: 8, messages: 196, total: 200 } },
    ];

    let presetIdx = 0;
    let popoverVisible = false;

    const render = () => {
      const active = PRESETS[presetIdx];
      const used = active.usage.system + active.usage.tools + active.usage.messages;
      const pct = Math.round((used / active.usage.total) * 100);

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderContextComposer({
              usage: active.usage,
              popoverOpen: popoverVisible,
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="composer-context-trigger"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        popoverVisible = !popoverVisible;
        render();
      });

      root.querySelector('[data-slot="composer-context-popover"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        presetIdx = (presetIdx + 1) % PRESETS.length;
        render();
      });
    };

    render();
    return root;
  },
};

export const Warning = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderContextComposer({
        usage: { system: 12, tools: 8, messages: 162, total: 200 },
        popoverOpen: true,
      })}
    </div>
  </div>
`);

export const Full = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderContextComposer({
        usage: { system: 12, tools: 8, messages: 196, total: 200 },
        popoverOpen: true,
      })}
    </div>
  </div>
`);
