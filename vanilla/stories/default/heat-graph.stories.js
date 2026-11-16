import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 129 Heat graph AUI',
  parameters: { layout: 'padded' },
};

function renderHeatGrid(pattern = 'busy') {
  const cols = 52;
  const rows = 7;
  let cells = '';

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let level = 0;
      const idx = c * 7 + r;
      if (pattern === 'empty') {
        level = 0;
      } else if (pattern === 'sparse') {
        if ([12, 45, 89, 120, 204, 250, 310].includes(idx)) {
          level = (idx % 3) + 1;
        }
      } else if (pattern === 'recent-burst') {
        if (c >= 48) {
          level = (idx % 4) + 1;
        }
      } else {
        // busy or default
        level = (idx % 5);
      }
      cells += `<div class="ds-heat-cell ds-heat-cell--${level}" data-slot="heat-cell" data-level="${level}" title="Contribution level ${level}"></div>`;
    }
  }

  return `
    <div class="ds-heat-graph-wrap" data-slot="heat-graph">
      <div class="ds-heat-graph-wrap__header">
        <span data-slot="heat-graph-title">Activity over the past year</span>
        <div class="ds-heat-graph-wrap__legend">
          <span>Less</span>
          <div class="ds-heat-cell ds-heat-cell--0"></div>
          <div class="ds-heat-cell ds-heat-cell--1"></div>
          <div class="ds-heat-cell ds-heat-cell--2"></div>
          <div class="ds-heat-cell ds-heat-cell--3"></div>
          <div class="ds-heat-cell ds-heat-cell--4"></div>
          <span>More</span>
        </div>
      </div>
      <div class="ds-heat-grid">
        ${cells}
      </div>
    </div>
  `;
}

function attachHeatInteractivity(root) {
  const title = root.querySelector('[data-slot="heat-graph-title"]');
  const cells = root.querySelectorAll('[data-slot="heat-cell"]');

  if (title && cells.length > 0) {
    cells.forEach((cell) => {
      cell.addEventListener('mouseenter', () => {
        const lvl = cell.getAttribute('data-level');
        title.textContent = `Activity level: ${lvl} / 4`;
      });
      cell.addEventListener('mouseleave', () => {
        title.textContent = 'Activity over the past year';
      });
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderHeatGrid('busy');
    attachHeatInteractivity(root);
    return root;
  },
};

export const Empty = story(
  () => renderHeatGrid('empty')
);

export const Sparse = story(
  () => renderHeatGrid('sparse')
);

export const RecentBurst = story(
  () => renderHeatGrid('recent-burst')
);

export const Busy = story(
  () => renderHeatGrid('busy')
);
