import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 72 Trace Waterfall',
  parameters: { layout: 'padded' },
};

const DEFAULT_SPANS = [
  {
    id: 'run',
    name: 'agent.run',
    depth: 0,
    startMs: 0,
    durationMs: 1840,
    status: 'completed',
  },
  {
    id: 'model',
    name: 'chat.completions',
    depth: 1,
    startMs: 40,
    durationMs: 720,
    status: 'completed',
  },
  {
    id: 'search',
    name: 'web_search',
    depth: 1,
    startMs: 790,
    durationMs: 460,
    status: 'completed',
  },
  {
    id: 'fetch',
    name: 'fetch page',
    depth: 2,
    startMs: 830,
    durationMs: 380,
    status: 'completed',
  },
  {
    id: 'final',
    name: 'chat.completions',
    depth: 1,
    startMs: 1280,
    durationMs: 560,
    status: 'completed',
  },
];

function renderTraceWaterfall({
  spans = DEFAULT_SPANS,
  totalMs = 1840,
  visibleCount = spans.length,
} = {}) {
  const spanTotal = totalMs || 1;
  const visibleSpans = spans.slice(0, visibleCount);

  const rowsHtml = visibleSpans
    .map((item) => {
      const leftPct = Math.min(100, Math.max(0, Math.round((item.startMs / spanTotal) * 100)));
      const widthPct = Math.min(100, Math.max(2, Math.round((item.durationMs / spanTotal) * 100)));

      let statusModifier = 'ds-trace-waterfall__bar--completed';
      if (item.status === 'running') statusModifier = 'ds-trace-waterfall__bar--running';
      if (item.status === 'failed') statusModifier = 'ds-trace-waterfall__bar--failed';

      return `
        <div class="ds-trace-waterfall__row" data-slot="trace-row" role="button" tabindex="0">
          <span class="ds-trace-waterfall__name ds-trace-depth-${item.depth}">
            ${item.name}
          </span>
          <span
            role="img"
            aria-label="${item.status}, starts at ${item.startMs}ms, runs ${item.durationMs}ms"
            class="ds-trace-waterfall__track"
          >
            <span
              class="ds-trace-waterfall__bar ${statusModifier} ds-bar-l-${leftPct} ds-bar-w-${widthPct}"
            ></span>
          </span>
          <span class="ds-trace-waterfall__duration">
            ${item.durationMs}
          </span>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="trace-waterfall" class="ds-trace-waterfall">
      <div class="ds-trace-waterfall__header">
        <span class="ds-trace-waterfall__title">Trace</span>
        <span class="ds-trace-waterfall__total">
          ${totalMs}ms
        </span>
      </div>

      <div class="ds-trace-waterfall__list">
        ${rowsHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const countSequence = [DEFAULT_SPANS.length, 2, 3];
    let seqIdx = 0;

    const render = () => {
      const count = countSequence[seqIdx];
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderTraceWaterfall({ visibleCount: count })}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-trace-waterfall__row').forEach((row) => {
        row.addEventListener('click', () => {
          seqIdx = (seqIdx + 1) % countSequence.length;
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const Streaming = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderTraceWaterfall({
        spans: [
          { id: 'run', name: 'agent.run', depth: 0, startMs: 0, durationMs: 1400, status: 'running' },
          { id: 'model', name: 'chat.completions', depth: 1, startMs: 40, durationMs: 720, status: 'completed' },
          { id: 'search', name: 'web_search', depth: 1, startMs: 790, durationMs: 610, status: 'running' },
        ],
        totalMs: 1400,
        visibleCount: 3,
      })}
    </div>
  </div>
`);
