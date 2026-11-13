import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Pagination',
  parameters: { layout: 'padded' },
};

/* Source: Storage and API logs pagination on platform.openai.com
 * Ground truth:
 * - Summary count: text-secondary, 14px
 * - Action buttons: 28px/32px compact controls
 * - Disabled state on boundary bounds */

export const Default = story(
  'Default / Shared / Pagination / Default',
  stage(
    'Standard Table Pagination',
    `<div class="ds-row">
      <span class="ds-muted">Showing 11–20 of 148 results</span>
      <nav class="ds-pagination" aria-label="Pagination">
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Previous</button>
        <span class="ds-muted" aria-current="page">Page 2 of 15</span>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Next</button>
      </nav>
    </div>`
  )
);

export const FirstPage = story(
  'Default / Shared / Pagination / First Page',
  stage(
    'First Page (Previous Disabled)',
    `<div class="ds-row">
      <span class="ds-muted">Showing 1–10 of 42 results</span>
      <nav class="ds-pagination" aria-label="Pagination">
        <button class="ds-button ds-button--ghost ds-button--sm" type="button" disabled>Previous</button>
        <span class="ds-muted" aria-current="page">Page 1 of 5</span>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Next</button>
      </nav>
    </div>`
  )
);

export const LastPage = story(
  'Default / Shared / Pagination / Last Page',
  stage(
    'Last Page (Next Disabled)',
    `<div class="ds-row">
      <span class="ds-muted">Showing 41–42 of 42 results</span>
      <nav class="ds-pagination" aria-label="Pagination">
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Previous</button>
        <span class="ds-muted" aria-current="page">Page 5 of 5</span>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button" disabled>Next</button>
      </nav>
    </div>`
  )
);
