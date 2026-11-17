import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Code Snippet',
  parameters: { layout: 'padded' },
};

/* Source: platform.openai.com/docs & platform.openai.com/api-keys
 * Ground truth:
 * - Font family: var(--font-family-mono)
 * - Strict 400 weight rule: font-weight 400 (normal) across all code, prompts, and line numbers
 * - Elevation & surface: var(--color-semantic-background-surface-secondary)
 * - Subtle border: 1px solid var(--color-semantic-border-subtle)
 * - Reused atomic components: .ds-button.ds-button--ghost.ds-button--sm for copy actions
 * - Interactive copy feedback: smooth icon/label transition to checkmark */

const COPY_ICON = `<svg class="ds-icon ds-code-snippet__copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg class="ds-icon ds-code-snippet__check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

/* ── 1. Singleline Variant ── */

export const Singleline = story(
  'Default / Shared / Code Snippet / Singleline',
  stage(
    'Singleline Code Snippet (Terminal Commands & API Endpoints)',
    `<div class="ds-code-snippet-group">
      <!-- Command snippet with prompt -->
      <div class="ds-code-snippet ds-code-snippet--singleline" data-slot="code-snippet">
        <div class="ds-code-snippet__body">
          <span class="ds-code-snippet__prompt" aria-hidden="true">$</span>
          <code class="ds-code-snippet__code">npm install openai</code>
        </div>
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ds-code-snippet__copy-btn" aria-label="Copy command">
          ${COPY_ICON}
          ${CHECK_ICON}
        </button>
      </div>

      <!-- Python pip command -->
      <div class="ds-code-snippet ds-code-snippet--singleline" data-slot="code-snippet">
        <div class="ds-code-snippet__body">
          <span class="ds-code-snippet__prompt" aria-hidden="true">$</span>
          <code class="ds-code-snippet__code">pip install openai</code>
        </div>
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ds-code-snippet__copy-btn" aria-label="Copy command">
          ${COPY_ICON}
          ${CHECK_ICON}
        </button>
      </div>

      <!-- API endpoint URL -->
      <div class="ds-code-snippet ds-code-snippet--singleline" data-slot="code-snippet">
        <div class="ds-code-snippet__body">
          <code class="ds-code-snippet__code">https://api.openai.com/v1/chat/completions</code>
        </div>
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ds-code-snippet__copy-btn" aria-label="Copy endpoint">
          ${COPY_ICON}
          ${CHECK_ICON}
        </button>
      </div>

      <!-- Environment variable export -->
      <div class="ds-code-snippet ds-code-snippet--singleline" data-slot="code-snippet">
        <div class="ds-code-snippet__body">
          <span class="ds-code-snippet__prompt" aria-hidden="true">$</span>
          <code class="ds-code-snippet__code">export OPENAI_API_KEY="sk-proj-abc123xyz"</code>
        </div>
        <button type="button" class="ds-button ds-button--ghost ds-button--icon ds-button--sm ds-code-snippet__copy-btn" aria-label="Copy export">
          ${COPY_ICON}
          ${CHECK_ICON}
        </button>
      </div>
    </div>`
  )
);

/* ── 2. Inline Variant ── */

export const Inline = story(
  'Default / Shared / Code Snippet / Inline',
  stage(
    'Inline Code Snippet (Prose Documentation)',
    `<div class="ds-code-snippet-prose">
      <!-- Within prose paragraph -->
      <p>
        All API requests require authentication. Pass your secret key in the HTTP request via the
        <code class="ds-code-snippet--inline">Authorization: Bearer $OPENAI_API_KEY</code> header.
        When requesting streaming tokens, set <code class="ds-code-snippet--inline">stream: true</code> in the body payload.
      </p>

      <!-- Parameter descriptions -->
      <p>
        Supported models include <code class="ds-code-snippet--inline">gpt-4o</code>,
        <code class="ds-code-snippet--inline">gpt-4o-mini</code>, and
        <code class="ds-code-snippet--inline">o3-mini</code> for high-speed reasoning tasks.
      </p>
    </div>`
  )
);

/* ── 3. Multiline Variant ── */

export const Multiline = story(
  'Default / Shared / Code Snippet / Multiline',
  stage(
    'Multiline Code Snippet (Syntax Highlighted SDK & API Payloads)',
    `<div class="ds-code-snippet-group">
      <!-- Python SDK Code Snippet -->
      <div class="ds-code-snippet ds-code-snippet--multiline" data-slot="code-snippet">
        <div class="ds-code-snippet__header">
          <span class="ds-code-snippet__lang">python</span>
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-code-snippet__copy-btn">
            ${COPY_ICON}
            ${CHECK_ICON}
            <span class="ds-code-snippet__copy-label">Copy</span>
          </button>
        </div>
        <div class="ds-code-snippet__content">
          <div class="ds-code-snippet__lines" aria-hidden="true">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
            <span>11</span>
            <span>12</span>
          </div>
          <pre class="ds-code-snippet__pre"><code><span class="ds-code-token--keyword">from</span> openai <span class="ds-code-token--keyword">import</span> OpenAI

client = <span class="ds-code-token--function">OpenAI</span>()

completion = client.chat.completions.<span class="ds-code-token--function">create</span>(
    model=<span class="ds-code-token--string">"gpt-4o"</span>,
    messages=[
        {<span class="ds-code-token--string">"role"</span>: <span class="ds-code-token--string">"developer"</span>, <span class="ds-code-token--string">"content"</span>: <span class="ds-code-token--string">"You are a helpful assistant."</span>},
        {<span class="ds-code-token--string">"role"</span>: <span class="ds-code-token--string">"user"</span>, <span class="ds-code-token--string">"content"</span>: <span class="ds-code-token--string">"Write a haiku about artificial intelligence."</span>}
    ]
)

<span class="ds-code-token--function">print</span>(completion.choices[<span class="ds-code-token--number">0</span>].message.content)</code></pre>
        </div>
      </div>

      <!-- cURL HTTP Request Snippet -->
      <div class="ds-code-snippet ds-code-snippet--multiline" data-slot="code-snippet">
        <div class="ds-code-snippet__header">
          <span class="ds-code-snippet__lang">bash</span>
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-code-snippet__copy-btn">
            ${COPY_ICON}
            ${CHECK_ICON}
            <span class="ds-code-snippet__copy-label">Copy</span>
          </button>
        </div>
        <div class="ds-code-snippet__content">
          <div class="ds-code-snippet__lines" aria-hidden="true">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
          <pre class="ds-code-snippet__pre"><code>curl https://api.openai.com/v1/chat/completions \\
  -H <span class="ds-code-token--string">"Content-Type: application/json"</span> \\
  -H <span class="ds-code-token--string">"Authorization: Bearer $OPENAI_API_KEY"</span> \\
  -d <span class="ds-code-token--string">'{"model": "gpt-4o", "messages": [{"role": "user", "content": "Hello!"}]}'</span></code></pre>
        </div>
      </div>
    </div>`
  )
);
