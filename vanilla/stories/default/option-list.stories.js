import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 62 Option List',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg class="ds-option-checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const RECEIPT_CHECK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderOptionItem(opt, isSelected, isMultiple = false) {
  if (isMultiple) {
    return `
      <button type="button" role="checkbox" aria-checked="${isSelected}" data-id="${opt.id}" class="ds-option-row">
        <span class="ds-option-checkbox-wrapper" aria-hidden="true">
          <span class="ds-option-checkbox">
            ${isSelected ? CHECK_ICON : ''}
          </span>
        </span>
        <span class="ds-option-text">
          <span class="ds-option-label">${opt.label}</span>
          ${opt.description ? `<span class="ds-option-desc">${opt.description}</span>` : ''}
        </span>
      </button>
    `;
  }

  return `
    <button type="button" data-selected="${isSelected}" data-id="${opt.id}" class="ds-option-row">
      <span class="ds-option-text">
        <span class="ds-option-label">${opt.label}</span>
        ${opt.description ? `<span class="ds-option-desc">${opt.description}</span>` : ''}
      </span>
    </button>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const options = [
      { id: 'code', label: 'Code generation & debugging', description: 'Python, TypeScript, Rust, and Go runtimes' },
      { id: 'web', label: 'Web search & retrieval', description: 'Real-time external knowledge grounding' },
      { id: 'diagram', label: 'Architecture diagrams', description: 'Mermaid, SVG flowcharts, and system specs' },
      { id: 'math', label: 'Formal mathematics', description: 'KaTeX LaTeX rendering and sympy solving' },
    ];

    let selected = ['code'];
    let committed = false;

    const render = () => {
      if (committed) {
        const chosen = options.filter((o) => selected.includes(o.id));
        root.innerHTML = `
          <div class="ds-story-stage">
<div class="ds-story-stage__body">
              <div data-slot="option-list" data-state="receipt" class="ds-option-list" role="button" tabindex="0">
                ${chosen.map((o) => `
                  <div class="ds-option-receipt-row">
                    <span class="ds-option-receipt-icon">${RECEIPT_CHECK}</span>
                    <span class="ds-option-text">
                      <span class="ds-option-label">${o.label}</span>
                      <span class="ds-option-desc">${o.description}</span>
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        root.querySelector('.ds-option-list')?.addEventListener('click', () => {
          committed = false;
          render();
        });
        return;
      }

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            <div data-slot="option-list" class="ds-option-list">
              ${options.map((o) => renderOptionItem(o, selected.includes(o.id), true)).join('')}
              <div class="ds-option-footer">
                <span class="ds-option-counter">${selected.length} of ${options.length}</span>
                <button type="button" class="ds-option-confirm-btn" data-btn-confirm ${selected.length === 0 ? 'disabled' : ''}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-option-row').forEach((row) => {
        row.addEventListener('click', () => {
          const id = row.getAttribute('data-id');
          if (selected.includes(id)) {
            selected = selected.filter((x) => x !== id);
          } else {
            selected = [...selected, id];
          }
          render();
        });
      });

      root.querySelector('[data-btn-confirm]')?.addEventListener('click', () => {
        if (selected.length > 0) {
          committed = true;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const SingleSelection = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      <div data-slot="option-list" class="ds-option-list">
        ${renderOptionItem({ id: 'merge', label: 'Merge duplicates', description: 'Combine each pair into one contact, keeping every field.' }, true, false)}
        ${renderOptionItem({ id: 'keep', label: 'Keep both', description: 'Leave the pairs as separate contacts.' }, false, false)}
        ${renderOptionItem({ id: 'review', label: 'Review each pair', description: 'Walk through the 12 pairs one at a time.' }, false, false)}
      </div>
    </div>
  </div>
`);
