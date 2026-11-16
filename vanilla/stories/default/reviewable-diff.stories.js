import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 24 Reviewable Diff',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const X_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function renderReviewableDiff({
  filename = 'thread.tsx',
  hunks = [
    {
      id: 'hunk-1',
      range: '@@ -12,4 +12,6 @@',
      decision: 'pending',
      lines: [
        { kind: 'context', text: 'export function Thread() {' },
        { kind: 'added', text: '  const { stream } = useChat();' },
        { kind: 'added', text: '  const draft = useDraft();' },
      ],
    },
    {
      id: 'hunk-2',
      range: '@@ -45,3 +47,3 @@',
      decision: 'kept',
      lines: [
        { kind: 'removed', text: '  return <LegacyThreadView />;' },
        { kind: 'added', text: '  return <ModernThreadView draft={draft} />;' },
      ],
    },
  ],
} = {}) {
  const keptCount = hunks.filter((h) => h.decision === 'kept').length;
  const pendingCount = hunks.filter((h) => h.decision === 'pending').length;

  const hunksHtml = hunks
    .map(
      (hunk) => `
    <div class="ds-reviewable-diff__hunk ${hunk.decision === 'discarded' ? 'ds-reviewable-diff__hunk--discarded' : ''}" data-hunk-id="${hunk.id}">
      <div class="ds-reviewable-diff__hunk-bar">
        <span>${hunk.range}</span>
        <div class="ds-row-actions">
          ${
            hunk.decision === 'pending'
              ? `
            <button type="button" aria-label="Discard hunk ${hunk.range}" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-hunk-discard-btn">
              ${X_ICON} Discard
            </button>
            <button type="button" aria-label="Keep hunk ${hunk.range}" class="ds-button ds-button--secondary ds-button--sm ds-button--pill ds-hunk-keep-btn">
              ${CHECK_ICON} Keep
            </button>
          `
              : `<span class="ds-hunk-tag ${hunk.decision === 'kept' ? 'ds-hunk-tag--kept' : ''}">${hunk.decision}</span>`
          }
        </div>
      </div>
      <div class="ds-code-diff__viewport">
        ${hunk.lines
          .map(
            (l) => `
          <div class="ds-code-diff__line ds-code-diff__line--${l.kind}">
            <span class="ds-code-diff__gutter">${l.kind === 'added' ? '+' : l.kind === 'removed' ? '−' : ''}</span>
            <span>${l.text}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="reviewable-diff" class="ds-reviewable-diff">
      <div class="ds-code-diff__header">
        <span class="ds-code-diff__filename">${filename}</span>
        <span class="ds-code-diff__stats ds-reviewable-header-stats">${keptCount} of ${hunks.length} kept</span>
      </div>
      <div>
        ${hunksHtml}
      </div>
      <div class="ds-reviewable-diff__footer">
        <span class="ds-code-diff__stats ds-reviewable-footer-stats">${pendingCount > 0 ? `${pendingCount} left to review` : 'All reviewed'}</span>
        <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-reviewable-diff__apply-btn" ${pendingCount > 0 ? 'disabled' : ''}>
          Apply ${keptCount}
        </button>
      </div>
    </div>
  `.trim();
}

function bindReviewEvents(root) {
  const updateSummary = () => {
    const hunks = Array.from(root.querySelectorAll('.ds-reviewable-diff__hunk'));
    const total = hunks.length;
    let kept = 0;
    let pending = 0;

    hunks.forEach((h) => {
      const tag = h.querySelector('.ds-hunk-tag');
      if (tag) {
        if (tag.textContent.trim() === 'kept') kept += 1;
      } else {
        pending += 1;
      }
    });

    const headerStats = root.querySelector('.ds-reviewable-header-stats');
    if (headerStats) headerStats.textContent = `${kept} of ${total} kept`;

    const footerStats = root.querySelector('.ds-reviewable-footer-stats');
    if (footerStats) footerStats.textContent = pending > 0 ? `${pending} left to review` : 'All reviewed';

    const applyBtn = root.querySelector('.ds-reviewable-diff__apply-btn');
    if (applyBtn) {
      applyBtn.textContent = `Apply ${kept}`;
      applyBtn.disabled = pending > 0;
    }
  };

  root.querySelectorAll('.ds-hunk-keep-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const hunk = e.target.closest('.ds-reviewable-diff__hunk');
      if (hunk) {
        hunk.classList.remove('ds-reviewable-diff__hunk--discarded');
        const actions = hunk.querySelector('.ds-row-actions');
        actions.innerHTML = '<span class="ds-hunk-tag ds-hunk-tag--kept">kept</span>';
        updateSummary();
      }
    });
  });

  root.querySelectorAll('.ds-hunk-discard-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const hunk = e.target.closest('.ds-reviewable-diff__hunk');
      if (hunk) {
        hunk.classList.add('ds-reviewable-diff__hunk--discarded');
        const actions = hunk.querySelector('.ds-row-actions');
        actions.innerHTML = '<span class="ds-hunk-tag">discarded</span>';
        updateSummary();
      }
    });
  });
}

/**
 * Default: Interactive Reviewable Diff
 * Composes Shared small pill buttons for Keep, Discard, and Apply actions.
 * Reviewing hunks enables the Apply button and dynamically updates statistics.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>24 Reviewable Diff (Interactive Hunk Review)</code></header>
        <div class="ds-review-target">
          ${renderReviewableDiff()}
        </div>
      </section>
    `;

    bindReviewEvents(root);
    return root;
  },
};
