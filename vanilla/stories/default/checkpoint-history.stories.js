import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 70 Checkpoint History',
  parameters: { layout: 'padded' },
};

const RESTORE_ICON = `<svg class="ds-checkpoint-history__restore-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`;

function renderCheckpointHistory({
  checkpoints = [
    { id: 'cp-3', label: 'Added Batch 5 application components (46 to 60)', at: '14:25', files: 15 },
    { id: 'cp-2', label: 'Added Batch 4 application components (31 to 45)', at: '14:20', files: 15 },
    { id: 'cp-1', label: 'Added Batch 3 application components (21 to 30)', at: '14:15', files: 10 },
  ],
  currentId = 'cp-3',
  hasRestore = true,
} = {}) {
  const currentIndex = checkpoints.findIndex((c) => c.id === currentId);

  const itemsHtml = checkpoints
    .map((cp, i) => {
      const isCurrent = cp.id === currentId;
      const isAhead = currentIndex >= 0 && i < currentIndex;

      const trailingHtml = isCurrent
        ? `<span class="ds-checkpoint-history__current-tag">current</span>`
        : hasRestore
          ? `
            <button type="button"
              class="ds-checkpoint-history__restore-btn"
              data-btn-restore="${cp.id}"
              aria-label="Restore to ${cp.label}">
              ${RESTORE_ICON}
              <span>Restore</span>
            </button>
          `
          : '';

      return `
        <div class="ds-checkpoint-history__item ${isCurrent ? 'ds-checkpoint-history__item--current' : ''} ${isAhead ? 'ds-checkpoint-history__item--ahead' : ''}"
          data-slot="checkpoint-item"
          data-id="${cp.id}"
          data-current="${isCurrent}"
          data-ahead="${isAhead}"
          role="button"
          tabindex="0">
          <span class="ds-checkpoint-history__dot" aria-hidden="true"></span>
          <div class="ds-checkpoint-history__content">
            <span class="ds-checkpoint-history__label">${cp.label}</span>
            <span class="ds-checkpoint-history__meta">${cp.at} · ${cp.files} files</span>
          </div>
          ${trailingHtml}
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="checkpoint-history" class="ds-checkpoint-history">
      <div class="ds-checkpoint-history__title">Checkpoints</div>
      <div class="ds-checkpoint-history__list">
        ${itemsHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const CHECKPOINTS = [
      { id: 'cp-3', label: 'Added Batch 5 application components (46 to 60)', at: '14:25', files: 15 },
      { id: 'cp-2', label: 'Added Batch 4 application components (31 to 45)', at: '14:20', files: 15 },
      { id: 'cp-1', label: 'Added Batch 3 application components (21 to 30)', at: '14:15', files: 10 },
    ];

    let activeId = 'cp-3';

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">70 Checkpoint History</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Active: ${activeId} (Click row or Restore)</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderCheckpointHistory({
              checkpoints: CHECKPOINTS,
              currentId: activeId,
              hasRestore: true,
            })}
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-checkpoint-history__item').forEach((item) => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-id');
          if (id) {
            activeId = id;
            render();
          }
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const id = item.getAttribute('data-id');
            if (id) {
              activeId = id;
              render();
            }
          }
        });
      });
    };

    render();
    return root;
  },
};

export const ReadOnly = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">70 Checkpoint History (Read Only)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Display Only Mode</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderCheckpointHistory({
        checkpoints: [
          { id: '1', label: 'Initial repository checkout', at: '09:00', files: 4 },
          { id: '2', label: 'Added adapter interfaces', at: '10:15', files: 12 },
          { id: '3', label: 'Resolved merge conflict', at: '11:40', files: 8 },
        ],
        currentId: '2',
        hasRestore: false,
      })}
    </div>
  </div>
`);
