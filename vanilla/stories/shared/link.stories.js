import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Link',
  parameters: { layout: 'padded' },
};

/* Source: Navigation and inline docs links on platform.openai.com
 * Ground truth from platform evidence (e.g. https://platform.openai.com/storage/files):
 * - External link: "Learn about file purposes ↗" with underline on text only and trailing diagonal arrow
 * - Standard link: Underline offset 3px, 1px thickness, 400 normal font-weight
 * - Typography: 14px (var(--font-size-sm)), var(--color-semantic-text-primary)
 * - State architecture: Enabled and Disabled states staged directly within each variant story
 * - Disabled cursor: Unavailable macOS cursor (cursor: not-allowed !important) on hover */

const EXTERNAL_ARROW = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l5-5M4 3.5h4.5V8"/></svg>`;

/* ── Variant 1: Default (Standard Text Link) ── */

export const Default = story(
  'Default / Shared / Link / Default',
  stage(
    'Standard Text Link',
    `<div class="ds-story-sections">
      <section class="ds-story-section">
<div class="ds-stack">
          <p>Explore the complete API reference in the <a href="#" class="ds-link">developer documentation</a> for parameter schemas.</p>
          <div>
            <a href="#" class="ds-link">Explore developer documentation</a>
          </div>
        </div>
      </section>

      <section class="ds-story-section">
<div class="ds-stack">
          <p>Explore the complete API reference in the <a href="#" class="ds-link" aria-disabled="true" tabindex="-1" onclick="return false;">developer documentation</a> for parameter schemas.</p>
          <div>
            <a href="#" class="ds-link" aria-disabled="true" tabindex="-1" onclick="return false;">Explore developer documentation</a>
          </div>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 2: External (Ground Truth: "Learn about file purposes ↗") ── */

export const External = story(
  'Default / Shared / Link / External',
  stage(
    'External Documentation Link (platform.openai.com Ground Truth)',
    `<div class="ds-story-sections">
      <section class="ds-story-section">
<div class="ds-stack">
          <div>
            <a href="https://platform.openai.com/docs" target="_blank" rel="noopener noreferrer" class="ds-link ds-link--external">
              <span class="ds-link__text">Learn about file purposes</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
          <div>
            <a href="https://platform.openai.com/docs" target="_blank" rel="noopener noreferrer" class="ds-link ds-link--external">
              <span class="ds-link__text">View OpenAI Cookbook</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
        </div>
      </section>

      <section class="ds-story-section">
<div class="ds-stack">
          <div>
            <a href="#" class="ds-link ds-link--external" aria-disabled="true" tabindex="-1" onclick="return false;">
              <span class="ds-link__text">Learn about file purposes</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
          <div>
            <a href="#" class="ds-link ds-link--external" aria-disabled="true" tabindex="-1" onclick="return false;">
              <span class="ds-link__text">View OpenAI Cookbook</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
        </div>
      </section>
    </div>`
  )
);

/* ── Variant 3: Subtle (Secondary Muted Link) ── */

export const Subtle = story(
  'Default / Shared / Link / Subtle',
  stage(
    'Subtle Secondary Link',
    `<div class="ds-story-sections">
      <section class="ds-story-section">
<div class="ds-stack">
          <p class="ds-muted">Need higher rate limits? <a href="#" class="ds-link ds-link--subtle">Contact enterprise sales</a> to request custom tier access.</p>
          <div>
            <a href="#" class="ds-link ds-link--subtle ds-link--external">
              <span class="ds-link__text">Terms and policies</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
        </div>
      </section>

      <section class="ds-story-section">
<div class="ds-stack">
          <p class="ds-muted">Need higher rate limits? <a href="#" class="ds-link ds-link--subtle" aria-disabled="true" tabindex="-1" onclick="return false;">Contact enterprise sales</a> to request custom tier access.</p>
          <div>
            <a href="#" class="ds-link ds-link--subtle ds-link--external" aria-disabled="true" tabindex="-1" onclick="return false;">
              <span class="ds-link__text">Terms and policies</span>
              <span class="ds-link__icon" aria-hidden="true">${EXTERNAL_ARROW}</span>
            </a>
          </div>
        </div>
      </section>
    </div>`
  )
);
