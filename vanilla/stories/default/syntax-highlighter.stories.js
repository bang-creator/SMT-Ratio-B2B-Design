import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 123 Syntax highlighter AUI',
  parameters: { layout: 'padded' },
};

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderBlock({ language, code, formattedHtml }) {
  return `
    <div class="ds-highlighter-frame" data-slot="highlighter-frame">
      <div class="ds-highlighter-header">
        <span data-slot="highlighter-language">${language}</span>
        <button
          type="button"
          class="ds-image-btn"
          data-action="copy-code"
          aria-label="Copy ${language} code"
        >
          ${COPY_ICON}
        </button>
      </div>
      <pre class="ds-highlighter-code" data-slot="highlighter-code"><code>${formattedHtml || code}</code></pre>
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

const PYTHON_CODE = `import httpx

async def fetch_forecast(city: str) -> dict:
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get("https://api.weather.dev/v1/forecast", params={"q": city})
        res.raise_for_status()
        return res.json()`;

const PYTHON_HIGHLIGHTED = `<span class="ds-token-keyword">import</span> httpx

<span class="ds-token-keyword">async def</span> <span class="ds-token-function">fetch_forecast</span>(city: <span class="ds-token-keyword">str</span>) -&gt; <span class="ds-token-keyword">dict</span>:
    <span class="ds-token-keyword">async with</span> httpx.AsyncClient(timeout=<span class="ds-token-string">10</span>) <span class="ds-token-keyword">as</span> client:
        res = <span class="ds-token-keyword">await</span> client.get(<span class="ds-token-string">"https://api.weather.dev/v1/forecast"</span>, params={<span class="ds-token-string">"q"</span>: city})
        res.raise_for_status()
        <span class="ds-token-keyword">return</span> res.json()`;

const GLEAM_CODE = `import gleam/io
import gleam/list

pub fn main() {
  ["ada", "grace", "linus"]
  |> list.filter(fn(name) { name != "ada" })
  |> list.each(fn(name) { io.println("hello, " <> name) })
}`;

const LONG_LINE = `export const config = { runtime: "edge", regions: ["iad1", "sfo1", "fra1", "hnd1"], maxDuration: 30, headers: { "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" } };`;

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderBlock({
      language: 'python',
      code: PYTHON_CODE,
      formattedHtml: PYTHON_HIGHLIGHTED,
    });
    attachCopyHandler(root);
    return root;
  },
};

export const Python = story(
  () => renderBlock({
    language: 'python',
    code: PYTHON_CODE,
    formattedHtml: PYTHON_HIGHLIGHTED,
  })
);

export const UnknownLanguage = story(
  () => renderBlock({
    language: 'gleam',
    code: GLEAM_CODE,
  })
);

export const LongContent = story(
  () => renderBlock({
    language: 'ts',
    code: LONG_LINE,
  })
);
