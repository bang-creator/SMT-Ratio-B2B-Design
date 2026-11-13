import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Contained List',
  parameters: { layout: 'padded' },
};

/* Source: Storage and organization team roster on platform.openai.com
 * Ground truth:
 * - 12px radius, elevated surface
 * - 1px subtle divider between items
 * - Hover highlight */

export const Default = story(
  'Default / Shared / Contained List / Default',
  stage(
    'Standard Contained List',
    `<div class="ds-contained-list">
      <div class="ds-contained-list__header">Organization Members</div>
      <div class="ds-contained-list__item">
        <div class="ds-stack">
          <strong>Ada Lovelace</strong>
          <span class="ds-muted">ada@example.com</span>
        </div>
        <span class="ds-badge">Owner</span>
      </div>
      <div class="ds-contained-list__item">
        <div class="ds-stack">
          <strong>Alan Turing</strong>
          <span class="ds-muted">alan@example.com</span>
        </div>
        <span class="ds-badge">Admin</span>
      </div>
      <div class="ds-contained-list__item">
        <div class="ds-stack">
          <strong>Claude Shannon</strong>
          <span class="ds-muted">claude@example.com</span>
        </div>
        <span class="ds-badge">Member</span>
      </div>
    </div>`
  )
);

export const Interactive = story(
  'Default / Shared / Contained List / Interactive',
  stage(
    'Interactive File Shards List',
    `<div class="ds-contained-list">
      <div class="ds-contained-list__header">Training Datasets</div>
      <div class="ds-contained-list__item">
        <div class="ds-row">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div class="ds-stack">
            <strong>dataset_train_v2.jsonl</strong>
            <span class="ds-muted">14,200 examples • 24.8 MB</span>
          </div>
        </div>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Details</button>
      </div>
      <div class="ds-contained-list__item">
        <div class="ds-row">
          <svg viewBox="0 0 24 24" class="ds-icon"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div class="ds-stack">
            <strong>validation_eval_v2.jsonl</strong>
            <span class="ds-muted">1,500 examples • 2.6 MB</span>
          </div>
        </div>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Details</button>
      </div>
    </div>`
  )
);
