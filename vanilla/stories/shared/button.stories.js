import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Button',
  parameters: { layout: 'padded' },
};

/* Source: .lkCln on platform.openai.com
 * Ground truth:
 * - Default height: 32px (compact standard md/sm)
 * - Border-radius: var(--radius-md) (8px), Pill: var(--radius-full)
 * - Variants: solid (primary), soft (secondary), outline, ghost, danger
 * - Motion: transform scale(0.98) on :active, 150ms cubic-bezier transition
 * - Focus-visible: 2px offset ring */

const PLUS_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>`;
const ARROW_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.293 6.293 17.586 10.586H4v2h13.586l-4.293 4.293 1.414 1.414L21.414 11.586l-6.707-6.707-1.414 1.414z"></path></svg>`;

export const Default = story(
  'Default / Shared / Button / Default',
  stage(
    'Button Variants (32px Standard Compact)',
    `<div class="ds-row">
      <button type="button" class="ds-button ds-button--primary">Primary</button>
      <button type="button" class="ds-button ds-button--secondary">Secondary</button>
      <button type="button" class="ds-button ds-button--outline">Outline</button>
      <button type="button" class="ds-button ds-button--ghost">Ghost</button>
      <button type="button" class="ds-button ds-button--danger">Danger</button>
    </div>`
  )
);

export const Small = story(
  'Default / Shared / Button / Small',
  stage(
    'Small Size (28px)',
    `<div class="ds-row">
      <button type="button" class="ds-button ds-button--primary ds-button--sm">Primary</button>
      <button type="button" class="ds-button ds-button--secondary ds-button--sm">Secondary</button>
      <button type="button" class="ds-button ds-button--outline ds-button--sm">Outline</button>
      <button type="button" class="ds-button ds-button--ghost ds-button--sm">Ghost</button>
      <button type="button" class="ds-button ds-button--danger ds-button--sm">Danger</button>
    </div>`
  )
);

export const Pill = story(
  'Default / Shared / Button / Pill',
  stage(
    'Pill Shape (Full Radius)',
    `<div class="ds-row">
      <button type="button" class="ds-button ds-button--primary ds-button--pill">Primary Pill</button>
      <button type="button" class="ds-button ds-button--secondary ds-button--pill">Secondary Pill</button>
      <button type="button" class="ds-button ds-button--outline ds-button--pill">Outline Pill</button>
      <button type="button" class="ds-button ds-button--ghost ds-button--pill">Ghost Pill</button>
    </div>`
  )
);

export const WithIcon = story(
  'Default / Shared / Button / With Icon',
  stage(
    'Buttons With Icons',
    `<div class="ds-row">
      <button type="button" class="ds-button ds-button--primary">${PLUS_ICON}<span>Create new</span></button>
      <button type="button" class="ds-button ds-button--secondary"><span>Continue</span>${ARROW_ICON}</button>
      <button type="button" class="ds-button ds-button--outline">${PLUS_ICON}<span>Add item</span></button>
      <button type="button" class="ds-button ds-button--ghost">${PLUS_ICON}<span>Filter</span></button>
    </div>`
  )
);

export const Block = story(
  'Default / Shared / Button / Block',
  stage(
    'Full Width (Block)',
    `<div class="ds-stack">
      <button type="button" class="ds-button ds-button--primary ds-button--block">Full Width Primary</button>
      <button type="button" class="ds-button ds-button--secondary ds-button--block">Full Width Secondary</button>
    </div>`
  )
);

export const Disabled = story(
  'Default / Shared / Button / Disabled',
  stage(
    'Disabled States',
    `<div class="ds-row">
      <button type="button" class="ds-button ds-button--primary" disabled>Primary</button>
      <button type="button" class="ds-button ds-button--secondary" disabled>Secondary</button>
      <button type="button" class="ds-button ds-button--outline" disabled>Outline</button>
      <button type="button" class="ds-button ds-button--ghost" disabled>Ghost</button>
      <button type="button" class="ds-button ds-button--danger" disabled>Danger</button>
    </div>`
  )
);
