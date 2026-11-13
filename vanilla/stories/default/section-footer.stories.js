import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Section Footer',
  parameters: { layout: 'padded' },
};

/* Source: Section footers on platform.openai.com
 * Ground truth:
 * - Subtle border-top
 * - Flex layout with info on left, action buttons on right */

export const Default = story(
  'Default / Application / Section Footer / Default',
  stage(
    'Standard Section Footer',
    `<footer class="ds-row">
      <span class="ds-muted">Last synchronized 2 minutes ago</span>
      <button class="ds-button ds-button--secondary ds-button--sm" type="button">View all audit events</button>
    </footer>`
  )
);

export const WithActions = story(
  'Default / Application / Section Footer / With Actions',
  stage(
    'Form Section Footer with Action Controls',
    `<footer class="ds-row">
      <span class="ds-muted">Unsaved modifications detected</span>
      <div class="ds-row">
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Discard</button>
        <button class="ds-button ds-button--primary ds-button--sm" type="button">Save changes</button>
      </div>
    </footer>`
  )
);
