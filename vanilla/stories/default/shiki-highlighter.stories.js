import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 124 Shiki highlighter AUI',
  parameters: { layout: 'padded' },
};

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderBlock(language, codeHtml, isStreaming = false) {
  return `
    <div class="ds-highlighter-frame" data-slot="highlighter-frame">
      <div class="ds-highlighter-header">
        <span data-slot="highlighter-language">${language}</span>
        ${
          !isStreaming
            ? `
          <button
            type="button"
            class="ds-image-btn"
            data-action="copy-code"
            aria-label="Copy ${language} code"
          >
            ${COPY_ICON}
          </button>
        `
            : ''
        }
      </div>
      <pre class="ds-highlighter-code" data-slot="highlighter-code"><code>${codeHtml}${isStreaming ? '<span class="ds-streaming-caret" aria-hidden="true"></span>' : ''}</code></pre>
    </div>
  `;
}

function attachCopyHandler(root) {
  const btn = root.querySelector('[data-action="copy-code"]');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        btn.innerHTML = COPY_ICON;
      }, 1500);
    });
  }
}

const TS_CODE_HIGHLIGHTED = `<span class="ds-token-keyword">export async function</span> <span class="ds-token-function">GET</span>(req: Request) {
  <span class="ds-token-keyword">const</span> { searchParams } = <span class="ds-token-keyword">new</span> URL(req.url);
  <span class="ds-token-keyword">const</span> city = searchParams.get(<span class="ds-token-string">"city"</span>);
  <span class="ds-token-keyword">return</span> Response.json({ city, temp: <span class="ds-token-string">21</span> });
}`;

const SQL_HIGHLIGHTED = `<span class="ds-token-keyword">SELECT</span> u.id, u.email, <span class="ds-token-function">count</span>(o.id) <span class="ds-token-keyword">AS</span> orders
<span class="ds-token-keyword">FROM</span> users u
<span class="ds-token-keyword">LEFT JOIN</span> orders o <span class="ds-token-keyword">ON</span> o.user_id = u.id
<span class="ds-highlighter-line is-highlighted"><span class="ds-token-keyword">WHERE</span> u.created_at &gt; now() - interval <span class="ds-token-string">'30 days'</span></span>
<span class="ds-highlighter-line is-highlighted"><span class="ds-token-keyword">GROUP BY</span> u.id</span>
<span class="ds-token-keyword">ORDER BY</span> orders <span class="ds-token-keyword">DESC</span>
<span class="ds-token-keyword">LIMIT</span> <span class="ds-token-string">20</span>;`;

const LONG_LINE = `const res = await fetch("https://api.example.com/v2/organizations/org_7Hq2/projects/prj_91kd/deployments?status=ready&limit=50&include=metadata,builds,aliases", { headers: { Authorization: \`Bearer \${token}\` } });`;

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderBlock('typescript', TS_CODE_HIGHLIGHTED);
    attachCopyHandler(root);
    return root;
  },
};

export const Streaming = story(
  () => renderBlock('typescript', `export async function GET(req: Request) {\n  const { searchParams } = new URL(req.url);\n  const city = searchParams.get("ci`, true)
);

export const HighlightedLines = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderBlock('sql', SQL_HIGHLIGHTED);
    attachCopyHandler(root);
    return root;
  },
};

export const PlainText = story(
  () => renderBlock('text', `$ pnpm build\n\n  Tasks:    12 successful, 12 total\n  Cached:   9 cached, 12 total\n  Time:     41.2s`)
);

export const LongContent = story(
  () => renderBlock('typescript', LONG_LINE)
);
