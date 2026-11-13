import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Section Header',
  parameters: { layout: 'padded' },
};

/* Source: Section headings on platform.openai.com
 * Ground truth:
 * - Title: 18px / 20px (var(--font-size-heading-md))
 * - Action: right-aligned secondary or ghost control */

export const Default = story(
  'Default / Application / Section Header / Default',
  stage(
    'Standard Section Header',
    `<div class="ds-section-heading">
      <div class="ds-stack">
        <h2>Organization credentials</h2>
        <p class="ds-muted">Access permissions and service account configurations</p>
      </div>
    </div>`
  )
);

export const WithAction = story(
  'Default / Application / Section Header / With Action',
  stage(
    'Section Header with Action',
    `<div class="ds-section-heading">
      <div class="ds-stack">
        <h2>Active fine-tuning jobs</h2>
        <p class="ds-muted">Monitor loss curves, token throughput, and epoch convergence</p>
      </div>
      <button class="ds-button ds-button--secondary ds-button--sm" type="button">Refresh status</button>
    </div>`
  )
);
