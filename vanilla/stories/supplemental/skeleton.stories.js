import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Skeleton',
  parameters: { layout: 'padded' },
};

/* Source: Loading placeholders across platform.openai.com
 * Ground truth:
 * - Full radius pill skeletons with 1.2s pulse animation */

export const Default = story(
  'Default / Supplemental / Skeleton / Default',
  stage(
    'Paragraph Loading Skeleton',
    `<div class="ds-stack" aria-busy="true" aria-label="Loading content">
      <span class="ds-skeleton ds-skeleton--60"></span>
      <span class="ds-skeleton ds-skeleton--40"></span>
      <span class="ds-skeleton"></span>
    </div>`
  )
);
