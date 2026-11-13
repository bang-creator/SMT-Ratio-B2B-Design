import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Copy Field',
  parameters: { layout: 'padded' },
};

/* Source: API key copy fields on platform.openai.com
 * Ground truth:
 * - 32px height, 8px radius
 * - Monospace font, trailing copy action button */

export const Default = story(
  'Default / Supplemental / Copy Field / Default',
  stage(
    'Secret Key Copy Field',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Production API Key</span>
        <div class="ds-copy-field">
          <input class="ds-input" value="sk-proj-9xK2048XmzL49PqW..." readonly>
          <button class="ds-button ds-button--secondary" type="button">Copy</button>
        </div>
      </label>
    </div>`
  )
);

export const ProjectId = story(
  'Default / Supplemental / Copy Field / Project ID',
  stage(
    'Organization & Project ID',
    `<div class="ds-stack">
      <label>
        <span class="ds-label">Project ID</span>
        <div class="ds-copy-field">
          <input class="ds-input" value="proj_829mZq9X" readonly>
          <button class="ds-button ds-button--secondary" type="button">Copy</button>
        </div>
      </label>
    </div>`
  )
);
