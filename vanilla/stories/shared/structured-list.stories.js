import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Structured List',
  parameters: { layout: 'padded' },
};

/* Source: Model details and metadata specs on platform.openai.com
 * Ground truth:
 * - 2-column key/value grid (180px key, remaining value)
 * - 12px radius, subtle row dividers */

export const Default = story(
  'Default / Shared / Structured List / Default',
  stage(
    'Model Specs Metadata',
    `<div class="ds-structured-list">
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Model identifier</span>
        <span class="ds-structured-list__val"><code>gpt-4o-2024-08-06</code></span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Context window</span>
        <span class="ds-structured-list__val">128,000 tokens</span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Max output tokens</span>
        <span class="ds-structured-list__val">16,384 tokens</span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Training cutoff</span>
        <span class="ds-structured-list__val">October 2023</span>
      </div>
    </div>`
  )
);

export const KeyDetails = story(
  'Default / Shared / Structured List / Key Details',
  stage(
    'API Key Security Metadata',
    `<div class="ds-structured-list">
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Key ID</span>
        <span class="ds-structured-list__val"><code>key_9xK2048XmzL</code></span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Created by</span>
        <span class="ds-structured-list__val">Ada Lovelace (ada@example.com)</span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Permissions</span>
        <span class="ds-structured-list__val"><span class="ds-badge">All endpoints (Read/Write)</span></span>
      </div>
      <div class="ds-structured-list__row">
        <span class="ds-structured-list__key">Last used</span>
        <span class="ds-structured-list__val">2 minutes ago</span>
      </div>
    </div>`
  )
);
