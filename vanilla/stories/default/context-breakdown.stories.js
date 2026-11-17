import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 83 Context breakdown',
  parameters: { layout: 'padded' },
};

const fmt = (n) => n.toLocaleString('en-US');

function getSegments(conversation = 0, files = 0) {
  return [
    { label: 'System prompt', tokens: 1800, tintClass: 'ds-context-tint-system', pctKey: '1' },
    { label: 'Tools', tokens: 4200, tintClass: 'ds-context-tint-tools', pctKey: '3' },
    ...(files > 0 ? [{ label: 'Attached files', tokens: files, tintClass: 'ds-context-tint-files', pctKey: '30' }] : []),
    ...(conversation > 0
      ? [
          {
            label: 'Conversation',
            tokens: conversation,
            tintClass: 'ds-context-tint-conversation',
            pctKey: conversation >= 90000 ? '74' : '61',
          },
        ]
      : []),
  ];
}

function renderContextBreakdown({ conversation = 0, files = 0, limit = 128000 } = {}) {
  const segments = getSegments(conversation, files);
  const used = segments.reduce((sum, s) => sum + s.tokens, 0);
  const pressure = limit === 0 ? 0 : used / limit;
  const isWarn = pressure > 0.85;
  const headroom = Math.max(0, limit - used);

  const meterSegmentsHtml = segments
    .map(
      (s) => `
      <span
        role="meter"
        aria-label="${s.label} context usage"
        data-slot="context-meter-segment"
        data-pct="${s.pctKey}"
        class="ds-context-meter-segment ${s.tintClass}"
      ></span>
    `,
    )
    .join('');

  const rowsHtml = segments
    .map(
      (s) => `
      <div class="ds-context-legend-item">
        <span class="ds-context-legend-dot ${s.tintClass}" aria-hidden="true"></span>
        <span class="ds-context-legend-label">${s.label}</span>
        <span class="ds-context-legend-value">${fmt(s.tokens)}</span>
      </div>
    `,
    )
    .join('');

  return `
    <div data-slot="context-breakdown" class="ds-context-breakdown ds-card--interactive" role="button" tabindex="0" title="Click to cycle usage presets">
      <div class="ds-context-breakdown-header">
        <span class="ds-context-breakdown-title">Context</span>
        <span
          data-slot="context-breakdown-usage"
          data-warn="${isWarn}"
          class="ds-context-breakdown-usage"
        >
          ${fmt(used)} / ${fmt(limit)}
        </span>
      </div>

      <div class="ds-context-meter-track" aria-hidden="true">
        ${meterSegmentsHtml}
      </div>

      <div class="ds-context-legend-list">
        ${rowsHtml}
        <div class="ds-context-legend-item">
          <span class="ds-context-legend-dot ds-context-tint-headroom" aria-hidden="true"></span>
          <span class="ds-context-legend-label">Headroom</span>
          <span data-slot="context-headroom-val" class="ds-context-legend-value">${fmt(headroom)}</span>
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
      { name: 'Fresh thread', conversation: 0, files: 0 },
      { name: 'Near limit (95%)', conversation: 78200, files: 38500 },
      { name: 'Over limit (107%)', conversation: 94600, files: 38500 },
    ];

    let presetIdx = 0;

    const render = () => {
      const active = PRESETS[presetIdx];

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderContextBreakdown(active)}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="context-breakdown"]')?.addEventListener('click', () => {
        presetIdx = (presetIdx + 1) % PRESETS.length;
        render();
      });
    };

    render();
    return root;
  },
};

export const NearLimit = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderContextBreakdown({ conversation: 78200, files: 38500 })}
    </div>
  </div>
`);

export const OverLimit = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderContextBreakdown({ conversation: 94600, files: 38500 })}
    </div>
  </div>
`);
