import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Scroll Bar',
  parameters: { layout: 'padded' },
};

/* Source: platform.openai.com data tables, sidebar navigation, and model pickers
 * Ground truth:
 * - Slim 4px scrollbar thickness on both axes
 * - Transparent track (no background container line)
 * - Rounded pill thumb: border-radius var(--radius-full)
 * - Thumb color: var(--color-semantic-border-strong) (dark and light modes)
 * - Hover highlight: var(--color-semantic-text-secondary)
 * - Firefox support: scrollbar-width thin, scrollbar-color tokenized */

/* ── 1. Vertical Variant ── */

export const Vertical = story(
  'Default / Shared / Scroll Bar / Vertical',
  stage(
    'Vertical Scroll Bar (Model Catalog & Navigation Menu)',
    `<div class="ds-scroll-area ds-scroll-area--vertical">
      <ul class="ds-scroll-list">
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">gpt-4o</span>
            <span class="ds-scroll-list__meta">Omni flagship model for text and vision tasks</span>
          </div>
          <span class="ds-badge ds-badge--sm">128k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">gpt-4o-mini</span>
            <span class="ds-scroll-list__meta">Fast, lightweight model for everyday tasks</span>
          </div>
          <span class="ds-badge ds-badge--sm">128k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">o1-preview</span>
            <span class="ds-scroll-list__meta">Reasoning model designed for complex problem solving</span>
          </div>
          <span class="ds-badge ds-badge--sm">128k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">o1-mini</span>
            <span class="ds-scroll-list__meta">Fast reasoning model optimized for coding & STEM</span>
          </div>
          <span class="ds-badge ds-badge--sm">128k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">o3-mini</span>
            <span class="ds-scroll-list__meta">Next-generation high-speed reasoning model</span>
          </div>
          <span class="ds-badge ds-badge--sm">200k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">text-embedding-3-large</span>
            <span class="ds-scroll-list__meta">Most capable embedding model for semantic search</span>
          </div>
          <span class="ds-badge ds-badge--sm">8k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">text-embedding-3-small</span>
            <span class="ds-scroll-list__meta">High efficiency embedding model for vector storage</span>
          </div>
          <span class="ds-badge ds-badge--sm">8k</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">dall-e-3</span>
            <span class="ds-scroll-list__meta">High fidelity image generation and refinement</span>
          </div>
          <span class="ds-badge ds-badge--sm">Standard</span>
        </li>
        <li class="ds-scroll-list__item">
          <div class="ds-scroll-list__info">
            <span class="ds-scroll-list__title">whisper-1</span>
            <span class="ds-scroll-list__meta">General-purpose speech recognition and translation</span>
          </div>
          <span class="ds-badge ds-badge--sm">Audio</span>
        </li>
      </ul>
    </div>`
  )
);

/* ── 2. Horizontal Variant ── */

export const Horizontal = story(
  'Default / Shared / Scroll Bar / Horizontal',
  stage(
    'Horizontal Scroll Bar (Resource Rows & Batch Workflows)',
    `<div class="ds-scroll-area ds-scroll-area--horizontal">
      <div class="ds-scroll-row">
        <!-- Card 1 -->
        <div class="ds-scroll-card">
          <div class="ds-scroll-card__header">
            <span class="ds-scroll-card__title">Fine-tune #48</span>
            <span class="ds-badge ds-badge--sm">Succeeded</span>
          </div>
          <span class="ds-scroll-card__meta">ft:gpt-4o-mini:custom-b2b</span>
          <div class="ds-scroll-card__metrics">
            <span>4 epochs</span>
            <span>·</span>
            <span>loss 0.142</span>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="ds-scroll-card">
          <div class="ds-scroll-card__header">
            <span class="ds-scroll-card__title">Batch Inference</span>
            <span class="ds-badge ds-badge--sm">Running</span>
          </div>
          <span class="ds-scroll-card__meta">batch_98fba71c</span>
          <div class="ds-scroll-card__metrics">
            <span>10,000 / 12,500</span>
            <span>·</span>
            <span>45 req/s</span>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="ds-scroll-card">
          <div class="ds-scroll-card__header">
            <span class="ds-scroll-card__title">Vector Store</span>
            <span class="ds-badge ds-badge--sm">Succeeded</span>
          </div>
          <span class="ds-scroll-card__meta">vs_88ba21ef</span>
          <div class="ds-scroll-card__metrics">
            <span>128 files</span>
            <span>·</span>
            <span>4,890 chunks</span>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="ds-scroll-card">
          <div class="ds-scroll-card__header">
            <span class="ds-scroll-card__title">Evaluations Run</span>
            <span class="ds-badge ds-badge--sm">Completed</span>
          </div>
          <span class="ds-scroll-card__meta">eval_prompt_v3</span>
          <div class="ds-scroll-card__metrics">
            <span>accuracy 94.6%</span>
            <span>·</span>
            <span>420ms</span>
          </div>
        </div>

        <!-- Card 5 -->
        <div class="ds-scroll-card">
          <div class="ds-scroll-card__header">
            <span class="ds-scroll-card__title">Model Distillation</span>
            <span class="ds-badge ds-badge--sm">Queued</span>
          </div>
          <span class="ds-scroll-card__meta">distill_o3_to_4o</span>
          <div class="ds-scroll-card__metrics">
            <span>o3-mini target</span>
            <span>·</span>
            <span>pending</span>
          </div>
        </div>
      </div>
    </div>`
  )
);
