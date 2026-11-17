import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 82 Draft restore',
  parameters: { layout: 'padded' },
};

const ICONS = {
  pencil: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>`,
  x: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
};

function renderDraftRestore({
  draft = 'Can you review the migration PR and suggest optimizations?',
  savedAt = '2m ago',
} = {}) {
  const singleLineDraft = draft.replace(/\s+/g, ' ').trim();

  return `
    <div data-slot="draft-restore" class="ds-draft-restore">
      <span class="ds-draft-restore-icon" aria-hidden="true">
        ${ICONS.pencil}
      </span>
      <div class="ds-draft-restore-content">
        <span class="ds-draft-restore-text" title="${singleLineDraft}">${singleLineDraft}</span>
        <span class="ds-draft-restore-meta">unsent draft · ${savedAt}</span>
      </div>
      <button
        type="button"
        data-slot="draft-restore-action"
        class="ds-draft-restore-btn"
      >
        Restore
      </button>
      <button
        type="button"
        data-slot="draft-restore-discard"
        aria-label="Discard the draft"
        class="ds-draft-restore-discard"
      >
        ${ICONS.x}
      </button>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let state = 'idle'; // 'idle' | 'restored' | 'discarded'
    const draftText = 'Can you review the migration PR and suggest optimizations?';

    const render = () => {
      let contentHtml = '';
      let badgeText = 'Unsent Draft Available';

      if (state === 'idle') {
        contentHtml = renderDraftRestore({ draft: draftText, savedAt: '2m ago' });
      } else if (state === 'restored') {
        badgeText = 'Restored to Composer';
        contentHtml = `
          <div class="ds-card ds-card--interactive ds-p-3" role="button" tabindex="0" data-btn-reset title="Click to undo and show draft card again">
            <div class="ds-inline-cluster ds-items-center ds-justify-between">
              <span class="ds-text-xs ds-text-secondary">Draft restored to composer input</span>
              <span class="ds-text-xs ds-text-brand">Click to reset</span>
            </div>
            <p class="ds-text-sm ds-mt-1 ds-text-primary">${draftText}</p>
          </div>
        `;
      } else if (state === 'discarded') {
        badgeText = 'Draft Discarded';
        contentHtml = `
          <div class="ds-card ds-card--interactive ds-p-3" role="button" tabindex="0" data-btn-reset title="Click to undo and show draft card again">
            <div class="ds-inline-cluster ds-items-center ds-justify-between">
              <span class="ds-text-xs ds-text-secondary">Unsent draft was discarded</span>
              <span class="ds-text-xs ds-text-brand">Click to restore</span>
            </div>
          </div>
        `;
      }

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${contentHtml}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="draft-restore-action"]')?.addEventListener('click', () => {
        state = 'restored';
        render();
      });

      root.querySelector('[data-slot="draft-restore-discard"]')?.addEventListener('click', () => {
        state = 'discarded';
        render();
      });

      root.querySelector('[data-btn-reset]')?.addEventListener('click', () => {
        state = 'idle';
        render();
      });
    };

    render();
    return root;
  },
};

export const LongDraft = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderDraftRestore({
        draft: "Can you go through the failing checkout tests on the release branch, figure out which ones broke after the payment provider migration, and propose a fix for each one before Thursday's cut?",
        savedAt: 'yesterday',
      })}
    </div>
  </div>
`);

export const MultiLine = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderDraftRestore({
        draft: 'Steps to reproduce:\n1. Open a thread\n2. Switch to another thread\n3. Come back',
        savedAt: 'just now',
      })}
    </div>
  </div>
`);
