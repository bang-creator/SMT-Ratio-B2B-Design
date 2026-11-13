import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Content switcher',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'Default / Shared / Content switcher / Default',
  stage(
    'Medium (Default 32px)',
    `<div class="ds-segmented" data-ds-segmented role="radiogroup" aria-label="Code language">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="curl">cURL</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="python">Python</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="javascript">JavaScript</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="rust" disabled data-disabled>Rust (Disabled)</button>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Content switcher / Small',
  stage(
    'Small (28px - Platform Daybreak)',
    `<div class="ds-segmented ds-segmented--sm" data-ds-segmented data-size="sm" role="radiogroup" aria-label="View mode">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="files">Files</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="vector-stores">Vector stores</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="skills">Skills</button>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Content switcher / Pill',
  stage(
    'Pill Shape',
    `<div class="ds-segmented ds-segmented--pill" data-ds-segmented data-pill role="radiogroup" aria-label="Time range">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="24h">24h</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="7d">7 days</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="30d">30 days</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="custom" disabled data-disabled>Custom</button>
    </div>`
  )
);

export const Block = story(
  'Default / Shared / Content switcher / Block',
  stage(
    'Full Width (Block)',
    `<div class="ds-segmented ds-segmented--block" data-ds-segmented data-block role="radiogroup" aria-label="Editor tab">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="editor">Editor</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="preview">Preview</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="history">History</button>
    </div>`
  )
);

export const WithIcons = story(
  'Default / Shared / Content switcher / With Icons',
  stage(
    'With Icons',
    `<div class="ds-segmented" data-ds-segmented role="radiogroup" aria-label="Layout view">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="grid">
        <svg class="ds-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span>Grid</span>
      </button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="list">
        <svg class="ds-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        <span>List</span>
      </button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="table">
        <svg class="ds-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path></svg>
        <span>Table</span>
      </button>
    </div>`
  )
);

export const Ghost = story(
  'Default / Shared / Content switcher / Ghost',
  stage(
    'Ghost Variant',
    `<div class="ds-segmented ds-segmented--ghost" data-ds-segmented data-variant="ghost" role="radiogroup" aria-label="Filter mode">
      <div class="ds-segmented__thumb"></div>
      <button type="button" role="radio" aria-checked="true" aria-pressed="true" data-state="on" data-value="all">All</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="active">Active</button>
      <button type="button" role="radio" aria-checked="false" aria-pressed="false" data-state="off" data-value="archived">Archived</button>
    </div>`
  )
);
