import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / List',
  parameters: { layout: 'padded' },
};

/* Source: Documentation guides on platform.openai.com/docs
 * Ground truth:
 * - 14px font, 1.5 line height, gap var(--space-2)
 * - Variants: Bulleted (unordered), Numbered (ordered), Unstyled */

export const Default = story(
  'Default / Shared / List / Default',
  stage(
    'Standard Bulleted List',
    `<ul class="ds-list">
      <li>Streaming token generation over Server-Sent Events (SSE)</li>
      <li>Fine-tuning checkpoint snapshot evaluation</li>
      <li>Structured JSON schema output validation</li>
      <li>Prompt caching with automatic prefix retention</li>
    </ul>`
  )
);

export const Ordered = story(
  'Default / Shared / List / Ordered',
  stage(
    'Ordered Numbered Sequence',
    `<ol class="ds-list ds-list--ordered">
      <li>Generate developer API secret key in dashboard</li>
      <li>Set <code>OPENAI_API_KEY</code> environment variable</li>
      <li>Initialize SDK client and call completions endpoint</li>
    </ol>`
  )
);

export const Unstyled = story(
  'Default / Shared / List / Unstyled',
  stage(
    'Unstyled Clean List',
    `<ul class="ds-list ds-list--unstyled">
      <li class="ds-row"><span class="ds-badge">POST</span> <code>/v1/chat/completions</code></li>
      <li class="ds-row"><span class="ds-badge">POST</span> <code>/v1/embeddings</code></li>
      <li class="ds-row"><span class="ds-badge">GET</span> <code>/v1/models</code></li>
    </ul>`
  )
);
