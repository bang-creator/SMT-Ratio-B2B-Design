import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 43 Data Table',
  parameters: { layout: 'padded' },
};

const SAMPLE_ROWS = [
  {
    id: 'row-1',
    model: 'gpt-4o',
    context: '128k',
    inputCost: 2.5,
    input: '$2.50 / 1M',
    output: '$10.00 / 1M',
    latencyMs: 420,
    latency: '420ms',
    status: 'Active',
    statusTone: 'success',
  },
  {
    id: 'row-2',
    model: 'gpt-4o-mini',
    context: '128k',
    inputCost: 0.15,
    input: '$0.15 / 1M',
    output: '$0.60 / 1M',
    latencyMs: 190,
    latency: '190ms',
    status: 'Active',
    statusTone: 'success',
  },
  {
    id: 'row-3',
    model: 'o1-preview',
    context: '128k',
    inputCost: 15.0,
    input: '$15.00 / 1M',
    output: '$60.00 / 1M',
    latencyMs: 2400,
    latency: '2400ms',
    status: 'Preview',
    statusTone: 'neutral',
  },
];

function renderDataTable({
  rows = SAMPLE_ROWS,
  sortKey = null,
  sortDirection = 'asc',
  emptyMessage = 'No rows available',
} = {}) {
  let displayRows = [...rows];
  if (sortKey) {
    displayRows.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }

  const theadHtml = `
    <thead class="ds-data-table__thead">
      <tr>
        <th scope="col" class="ds-data-table__th">
          <button type="button" class="ds-data-table__sort-btn" data-sort="model" aria-label="Sort by Model">
            Model
            ${sortKey === 'model' ? `<span class="ds-data-table__sort-arrow">${sortDirection === 'asc' ? '↑' : '↓'}</span>` : ''}
          </button>
        </th>
        <th scope="col" class="ds-data-table__th ds-data-table__th--end">Context</th>
        <th scope="col" class="ds-data-table__th ds-data-table__th--end">
          <button type="button" class="ds-data-table__sort-btn" data-sort="inputCost" aria-label="Sort by Input Cost">
            Input
            ${sortKey === 'inputCost' ? `<span class="ds-data-table__sort-arrow">${sortDirection === 'asc' ? '↑' : '↓'}</span>` : ''}
          </button>
        </th>
        <th scope="col" class="ds-data-table__th ds-data-table__th--end">Output</th>
        <th scope="col" class="ds-data-table__th ds-data-table__th--end" ${sortKey === 'latencyMs' ? `aria-sort="${sortDirection === 'asc' ? 'ascending' : 'descending'}"` : ''}>
          <button type="button" class="ds-data-table__sort-btn" data-sort="latencyMs" aria-label="Sort by Latency">
            Latency
            ${sortKey === 'latencyMs' ? `<span class="ds-data-table__sort-arrow">${sortDirection === 'asc' ? '↑' : '↓'}</span>` : ''}
          </button>
        </th>
        <th scope="col" class="ds-data-table__th ds-data-table__th--end">Status</th>
      </tr>
    </thead>
  `;

  const tbodyHtml =
    displayRows.length === 0
      ? `
    <tbody>
      <tr>
        <td colspan="6" class="ds-data-table__empty">${emptyMessage}</td>
      </tr>
    </tbody>
  `
      : `
    <tbody class="ds-data-table__tbody">
      ${displayRows
        .map(
          (r) => `
        <tr data-row-id="${r.id}">
          <td class="ds-data-table__td ds-font-medium">${r.model}</td>
          <td class="ds-data-table__td ds-data-table__td--end">${r.context}</td>
          <td class="ds-data-table__td ds-data-table__td--end">${r.input}</td>
          <td class="ds-data-table__td ds-data-table__td--end">${r.output}</td>
          <td class="ds-data-table__td ds-data-table__td--end">${r.latency}</td>
          <td class="ds-data-table__td ds-data-table__td--end">
            <span class="ds-data-table__badge ${r.statusTone === 'success' ? 'ds-data-table__badge--success' : 'ds-data-table__badge--neutral'}">
              ${r.status}
            </span>
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  `;

  return `
    <div data-slot="data-table" class="ds-data-table">
      <table class="ds-data-table__table">
        <caption class="sr-only">Model Benchmarks & Pricing</caption>
        ${theadHtml}
        ${tbodyHtml}
      </table>
    </div>
  `;
}

function bindTableInteractive(root, initialRows) {
  let sortKey = null;
  let sortDirection = 'asc';

  function update() {
    const target = root.querySelector('.ds-table-target');
    if (target) {
      target.innerHTML = renderDataTable({ rows: initialRows, sortKey, sortDirection });
      bind();
    }
  }

  function bind() {
    root.querySelectorAll('.ds-data-table__sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sort');
        if (sortKey === key) {
          if (sortDirection === 'asc') {
            sortDirection = 'desc';
          } else {
            sortKey = null;
            sortDirection = 'asc';
          }
        } else {
          sortKey = key;
          sortDirection = 'asc';
        }
        update();
      });
    });
  }

  bind();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-table-target">
          ${renderDataTable()}
        </div>
      </section>
    `;
    bindTableInteractive(root, SAMPLE_ROWS);
    return root;
  },
};
