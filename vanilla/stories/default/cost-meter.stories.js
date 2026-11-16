import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 73 Cost Meter',
  parameters: { layout: 'padded' },
};

function formatTokens(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return `${num}`;
}

function renderCostMeter({
  runCost = '$0.042',
  sessionCost = '$1.28',
  lines = [
    { model: 'gpt-4o', inputTokens: 14200, outputTokens: 2800, cost: '$0.038', share: 0.75, pctClass: 'ds-cost-pct-75' },
    { model: 'gpt-4o-mini', inputTokens: 8400, outputTokens: 1200, cost: '$0.004', share: 0.25, pctClass: 'ds-cost-pct-25' },
  ],
} = {}) {
  const segmentsHtml = lines
    .map((line, i) => {
      let segmentModifier = 'ds-cost-meter__segment--primary';
      if (i === 1) segmentModifier = 'ds-cost-meter__segment--secondary';
      if (i >= 2) segmentModifier = 'ds-cost-meter__segment--tertiary';

      const pctAnnounced = Math.round(line.share * 100);

      return `
        <span
          role="meter"
          aria-label="${line.model} cost share"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${pctAnnounced}"
          class="ds-cost-meter__segment ${segmentModifier} ${line.pctClass}"
          data-slot="cost-segment"
        ></span>
      `;
    })
    .join('');

  const linesHtml = lines
    .map(
      (line) => `
    <div class="ds-cost-meter__line" data-slot="cost-line">
      <span class="ds-cost-meter__model">${line.model}</span>
      <div class="ds-cost-meter__telemetry">
        <span class="ds-cost-meter__tokens">
          ${formatTokens(line.inputTokens)} in · ${formatTokens(line.outputTokens)} out
        </span>
        <span class="ds-cost-meter__cost">${line.cost}</span>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="cost-meter" class="ds-cost-meter" role="button" tabindex="0">
      <div class="ds-cost-meter__header">
        <span class="ds-cost-meter__run-cost">${runCost}</span>
        <span class="ds-cost-meter__label">this run</span>
        <span class="ds-cost-meter__session-cost">${sessionCost} session</span>
      </div>

      <div class="ds-cost-meter__track">
        ${segmentsHtml}
      </div>

      <div class="ds-cost-meter__breakdown">
        ${linesHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentPreset = 0;
    const presets = [
      {
        runCost: '$0.042',
        sessionCost: '$1.28',
        lines: [
          { model: 'gpt-4o', inputTokens: 14200, outputTokens: 2800, cost: '$0.038', share: 0.75, pctClass: 'ds-cost-pct-75' },
          { model: 'gpt-4o-mini', inputTokens: 8400, outputTokens: 1200, cost: '$0.004', share: 0.25, pctClass: 'ds-cost-pct-25' },
        ],
      },
      {
        runCost: '$0.089',
        sessionCost: '$1.37',
        lines: [
          { model: 'gpt-4o', inputTokens: 28400, outputTokens: 5600, cost: '$0.076', share: 0.85, pctClass: 'ds-cost-pct-85' },
          { model: 'gpt-4o-mini', inputTokens: 16800, outputTokens: 2400, cost: '$0.013', share: 0.15, pctClass: 'ds-cost-pct-15' },
        ],
      },
      {
        runCost: '$0.145',
        sessionCost: '$1.51',
        lines: [
          { model: 'o1-preview', inputTokens: 32000, outputTokens: 8000, cost: '$0.120', share: 0.70, pctClass: 'ds-cost-pct-70' },
          { model: 'gpt-4o', inputTokens: 12000, outputTokens: 2000, cost: '$0.025', share: 0.30, pctClass: 'ds-cost-pct-30' },
        ],
      },
    ];

    const render = () => {
      const p = presets[currentPreset];
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">73 Cost Meter</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Preset ${currentPreset + 1} of ${presets.length} (Click to cycle)</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderCostMeter(p)}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-cost-meter');
      card?.addEventListener('click', () => {
        currentPreset = (currentPreset + 1) % presets.length;
        render();
      });
      card?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentPreset = (currentPreset + 1) % presets.length;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const OneModel = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">73 Cost Meter (Single Model)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">100% Share Variant</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderCostMeter({
        runCost: '$0.420',
        sessionCost: '$3.10',
        lines: [
          { model: 'gpt-4o', inputTokens: 61400, outputTokens: 9800, cost: '$0.420', share: 1, pctClass: 'ds-cost-pct-100' },
        ],
      })}
    </div>
  </div>
`);
