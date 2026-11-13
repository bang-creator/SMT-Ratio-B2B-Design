import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Search Input',
  parameters: { layout: 'padded' },
};

/* Source: .Kepsx on platform.openai.com/storage
 * Ground truth: height 32px, border-radius var(--radius-md)=8px, gap 8px,
 * paddingLeft 10px, input padding 0 12px (--space-3), icon 14×14.
 * Variant: outline – box-shadow: 0 0 0 1px inset.
 * Hover: border gets stronger (only). Focus: border becomes ring-focus.
 * End-adornment support: [data-has-end-adornment] adds padding-right and
 * allows trailing elements like a clear button. */

const SEARCH_ICON = `<span class="ds-search-input__icon" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.875 4.5C7.35418 4.5 4.5 7.35418 4.5 10.875C4.5 14.3958 7.35418 17.25 10.875 17.25C14.3958 17.25 17.25 14.3958 17.25 10.875C17.25 7.35418 14.3958 4.5 10.875 4.5ZM2.5 10.875C2.5 6.24962 6.24962 2.5 10.875 2.5C15.5004 2.5 19.25 6.24962 19.25 10.875C19.25 12.8273 18.582 14.6236 17.462 16.0478L21.2071 19.7929C21.5976 20.1834 21.5976 20.8166 21.2071 21.2071C20.8166 21.5976 20.1834 21.5976 19.7929 21.2071L16.0478 17.462C14.6236 18.582 12.8273 19.25 10.875 19.25C6.24962 19.25 2.5 15.5004 2.5 10.875Z"></path></svg></span>`;

const CLEAR_BUTTON = `<button type="button" class="ds-search-input__clear" aria-label="Clear search" hidden><svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg></button>`;

export const Default = story(
  'Default / Shared / Search Input / Default',
  stage(
    'Workspace Search Input (32px Compact, outline)',
    `<div class="ds-search-input" data-ds-search-input>
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search files by name..." aria-label="Search">
    </div>`
  )
);

export const WithClearButton = story(
  'Default / Shared / Search Input / With Clear Button',
  stage(
    'With Clear Button (type to reveal ×)',
    `<div class="ds-search-input" data-ds-search-input data-has-end-adornment>
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search..." aria-label="Search">
      ${CLEAR_BUTTON}
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Search Input / Pill',
  stage(
    'API Keys Global Search (32px Pill Capsule)',
    `<div class="ds-search-input ds-search-input--pill" data-ds-search-input data-pill>
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search..." aria-label="Search API keys">
    </div>`
  )
);

export const PillWithClear = story(
  'Default / Shared / Search Input / Pill With Clear',
  stage(
    'API Keys Global Search With Clear Button (type to reveal ×)',
    `<div class="ds-search-input ds-search-input--pill" data-ds-search-input data-pill data-has-end-adornment>
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search..." aria-label="Search API keys">
      ${CLEAR_BUTTON}
    </div>`
  )
);

export const Block = story(
  'Default / Shared / Search Input / Block',
  stage(
    'Full Width (Block)',
    `<div class="ds-search-input ds-search-input--block" data-ds-search-input data-block>
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search files by name..." aria-label="Search">
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Search Input / Disabled',
  stage(
    'Disabled State',
    `<div class="ds-search-input" data-ds-search-input data-disabled="true">
      ${SEARCH_ICON}
      <input type="text" class="ds-search-input__field" placeholder="Search files by name..." aria-label="Search disabled" disabled>
    </div>`
  )
);
