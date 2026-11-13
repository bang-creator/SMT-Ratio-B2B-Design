import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Supplemental / Code Block',
  parameters: { layout: 'padded' },
};

/* Source: Documentation code snippets on platform.openai.com/docs
 * Ground truth:
 * - Monospace font: var(--font-family-mono)
 * - Elevated / secondary background, 8px radius
 * - Copy snippet action button */

export const Default = story(
  'Default / Supplemental / Code Block / Default',
  stage(
    'Python SDK Snippet',
    `<div class="ds-stack">
      <div class="ds-row">
        <span class="ds-badge">python</span>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Copy</button>
      </div>
      <pre class="ds-code"><code>import OpenAI from 'openai';

const client = new OpenAI();
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Say hello!' }],
});</code></pre>
    </div>`
  )
);

export const Shell = story(
  'Default / Supplemental / Code Block / Shell',
  stage(
    'cURL Command Snippet',
    `<div class="ds-stack">
      <div class="ds-row">
        <span class="ds-badge">bash</span>
        <button class="ds-button ds-button--ghost ds-button--sm" type="button">Copy</button>
      </div>
      <pre class="ds-code"><code>curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello!"}]}'</code></pre>
    </div>`
  )
);
