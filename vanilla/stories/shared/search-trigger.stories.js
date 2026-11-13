import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Search Trigger',
  parameters: { layout: 'padded' },
};

/* Source: button.SMRMt on platform.openai.com sidebar
 * Ground truth: height 36px, border-radius var(--radius-lg)=10px, gap 8px,
 * padding 0 10px, icon 20×20, contains "Search" label + ⌘K pill badge.
 * Hover: changes border-color, background, AND color.
 * Click: opens command palette (CMDK dialog). */

const TRIGGER_ICON = `<span class="ds-search-trigger__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.875 4.5C7.35418 4.5 4.5 7.35418 4.5 10.875C4.5 14.3958 7.35418 17.25 10.875 17.25C14.3958 17.25 17.25 14.3958 17.25 10.875C17.25 7.35418 14.3958 4.5 10.875 4.5ZM2.5 10.875C2.5 6.24962 6.24962 2.5 10.875 2.5C15.5004 2.5 19.25 6.24962 19.25 10.875C19.25 12.8273 18.582 14.6236 17.462 16.0478L21.2071 19.7929C21.5976 20.1834 21.5976 20.8166 21.2071 21.2071C20.8166 21.5976 20.1834 21.5976 19.7929 21.2071L16.0478 17.462C14.6236 18.582 12.8273 19.25 10.875 19.25C6.24962 19.25 2.5 15.5004 2.5 10.875Z"></path></svg></span>`;

export const Default = story(
  'Default / Shared / Search Trigger / Default',
  stage(
    'Sidebar Search Trigger (36px, with ⌘K)',
    `<button type="button" class="ds-search-trigger">
      ${TRIGGER_ICON}
      <span class="ds-search-trigger__label">Search</span>
      <kbd class="ds-search-trigger__kbd" aria-hidden="true">⌘K</kbd>
    </button>`
  )
);

export const Disabled = story(
  'Default / Shared / Search Trigger / Disabled',
  stage(
    'Disabled State',
    `<button type="button" class="ds-search-trigger" disabled>
      ${TRIGGER_ICON}
      <span class="ds-search-trigger__label">Search</span>
      <kbd class="ds-search-trigger__kbd" aria-hidden="true">⌘K</kbd>
    </button>`
  )
);
