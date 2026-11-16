import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 50 Activity Graph',
  parameters: { layout: 'padded' },
};

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function generateSampleGrid(seed = 1) {
  // 16 columns x 7 rows = 112 cells
  return Array.from({ length: 16 * 7 }, (_, i) => {
    const col = Math.floor(i / 7);
    const row = i % 7;
    const pseudoRand = (i * 17 + seed * 31 + col * 7 + row * 13) % 100;
    let level = 0;
    if (pseudoRand > 80) level = 4;
    else if (pseudoRand > 60) level = 3;
    else if (pseudoRand > 40) level = 2;
    else if (pseudoRand > 20) level = 1;
    return { col, row, level, count: level * 8 + (pseudoRand % 7) };
  });
}

function renderActivityGraph({
  title = 'API Activity',
  total = '1,842 requests',
  seed = 1,
} = {}) {
  const cells = generateSampleGrid(seed);

  const dayLabelsHtml = DAY_LABELS.map(
    (label) => `<span class="ds-activity-graph__day-label">${label}</span>`
  ).join('');

  const cellsHtml = cells
    .map(
      (c) => `
      <span
        class="ds-activity-graph__cell ds-heat-cell ds-heat-lvl-${c.level}"
        data-level="${c.level}"
        data-count="${c.count}"
        data-col="${c.col}"
        data-row="${c.row}"
        title="Col ${c.col + 1}, Day ${c.row + 1}: ${c.count} events"
      ></span>
    `
    )
    .join('');

  return `
    <div data-slot="activity-graph" class="ds-activity-graph ds-activity-graph-interactive" role="button" tabindex="0" title="Click to simulate new activity stream">
      <div class="ds-activity-graph__header">
        <span class="ds-activity-graph__title">${title}</span>
        <span class="ds-activity-graph__total">${total}</span>
      </div>

      <div class="ds-activity-graph__body">
        <div class="ds-activity-graph__day-labels" aria-hidden="true">
          ${dayLabelsHtml}
        </div>
        <div class="ds-activity-graph__grid ds-heat-grid" role="grid" aria-label="${title}: ${total}">
          ${cellsHtml}
        </div>
      </div>

      <div class="ds-activity-graph__legend" aria-hidden="true">
        <span class="ds-activity-graph__legend-label">less</span>
        <span class="ds-activity-graph__cell ds-heat-lvl-0" data-level="0"></span>
        <span class="ds-activity-graph__cell ds-heat-lvl-1" data-level="1"></span>
        <span class="ds-activity-graph__cell ds-heat-lvl-2" data-level="2"></span>
        <span class="ds-activity-graph__cell ds-heat-lvl-3" data-level="3"></span>
        <span class="ds-activity-graph__cell ds-heat-lvl-4" data-level="4"></span>
        <span class="ds-activity-graph__legend-label">more</span>
      </div>
    </div>
  `;
}

function bindActivityEvents(root) {
  let seed = 1;
  const totals = ['1,842 requests', '2,104 requests', '2,658 requests', '3,120 requests'];

  function update() {
    const target = root.querySelector('.ds-activity-target');
    if (target) {
      target.innerHTML = renderActivityGraph({
        seed,
        total: totals[(seed - 1) % totals.length],
      });
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-activity-graph-interactive');
    if (card) {
      card.addEventListener('click', () => {
        seed++;
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>50 Activity Graph (Interactive Heatmap &amp; Event Stream)</code></header>
        <div class="ds-activity-target">
          ${renderActivityGraph({ seed: 1, total: '1,842 requests' })}
        </div>
      </section>
    `;
    bindActivityEvents(root);
    return root;
  },
};
