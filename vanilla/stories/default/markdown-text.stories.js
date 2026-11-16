import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 122 Markdown text AUI',
  parameters: { layout: 'padded' },
};

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function attachCopyHandler(root) {
  const copyBtns = root.querySelectorAll('[data-action="copy-code"]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        btn.innerHTML = COPY_ICON;
      }, 1500);
    });
  });
}

function renderCodeBlock({ lang = 'ts', code = '', isStreaming = false } = {}) {
  return `
    <div class="ds-highlighter-frame" data-slot="code-frame">
      <div class="ds-highlighter-header">
        <span class="ds-font-mono ds-text-xs ds-text-secondary">${lang}</span>
        ${
          !isStreaming
            ? `
          <button type="button" class="ds-image-btn" data-action="copy-code" aria-label="Copy code">
            ${COPY_ICON}
          </button>
        `
            : ''
        }
      </div>
      <pre class="ds-highlighter-code"><code class="ds-font-mono ds-text-xs">${code}${isStreaming ? '<span class="ds-streaming-caret" aria-hidden="true"></span>' : ''}</code></pre>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-markdown-card" data-slot="markdown-card">
        <h2>Interactive Markdown Block</h2>
        <p>Click the copy button in the code header to test interaction feedback:</p>
        ${renderCodeBlock({
          lang: 'javascript',
          code: 'console.log("Interactive OpenAI Markdown verified!");',
        })}
      </div>
    `;
    attachCopyHandler(root);
    return root;
  },
};

export const Streaming = story(
  () => `
    <div class="ds-markdown-card" data-slot="markdown-card">
      <h2>Retry with backoff</h2>
      <p>Wrap the call so a failed request waits a little longer each time:</p>
      ${renderCodeBlock({
        lang: 'ts',
        code: `async function withRetry<T>(fn: () => Promise<T>, attempts = 3) {\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();`,
        isStreaming: true,
      })}
    </div>
  `
);

export const CodeBlock = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-markdown-card" data-slot="markdown-card">
        <p>Add the provider at the root of your app:</p>
        ${renderCodeBlock({
          lang: 'tsx',
          code: `import { AssistantRuntimeProvider } from "@assistant-ui/react";\nimport { Thread } from "@/components/assistant-ui/thread";\n\nexport function App({ runtime }) {\n  return (\n    <AssistantRuntimeProvider runtime={runtime}>\n      <Thread />\n    </AssistantRuntimeProvider>\n  );\n}`,
        })}
        <p class="ds-mt-3">Then run <code class="ds-font-mono ds-text-xs ds-p-1 ds-bg-surface-secondary ds-rounded">pnpm dev</code> and open <strong>localhost:3000</strong>.</p>
      </div>
    `;
    attachCopyHandler(root);
    return root;
  },
};

export const Gfm = story(
  () => `
    <div class="ds-markdown-card" data-slot="markdown-card">
      <h3>Launch checklist</h3>
      <ul class="ds-list-none ds-p-0 ds-m-0 ds-flex ds-flex-col ds-gap-1">
        <li class="ds-flex ds-items-center ds-gap-2">
          <input type="checkbox" checked disabled />
          <span>Pricing page copy approved</span>
        </li>
        <li class="ds-flex ds-items-center ds-gap-2">
          <input type="checkbox" checked disabled />
          <span>Stripe products created</span>
        </li>
        <li class="ds-flex ds-items-center ds-gap-2">
          <input type="checkbox" disabled />
          <span><s>Blog post</s> moved to next week</span>
        </li>
        <li class="ds-flex ds-items-center ds-gap-2">
          <input type="checkbox" disabled />
          <span>Announce in #general</span>
        </li>
      </ul>
      <ol class="ds-mt-3 ds-pl-4">
        <li>Merge the release branch</li>
        <li>Tag <code class="ds-font-mono ds-text-xs">v2.4.0</code></li>
        <li>Watch error rates for an hour</li>
      </ol>
      <blockquote class="ds-markdown-blockquote">
        Rollback is one click from the deployments page.
      </blockquote>
      <hr class="ds-my-3 ds-border-subtle" />
      <p>Questions go to <a href="#" class="ds-text-accent" onclick="return false;">the launch doc</a>.</p>
    </div>
  `
);

export const LongContent = story(
  () => `
    <div class="ds-markdown-card" data-slot="markdown-card">
      <p>Here is how the plans compare:</p>
      <div class="ds-markdown-table-wrapper" data-slot="table-wrapper">
        <table class="ds-markdown-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Monthly price</th>
              <th>Annual price</th>
              <th>Seats</th>
              <th>Messages / mo</th>
              <th>SSO</th>
              <th>Audit log</th>
              <th>Support</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td>$0</td>
              <td>$0</td>
              <td>1</td>
              <td>500</td>
              <td>No</td>
              <td>No</td>
              <td>Community</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>$20</td>
              <td>$192</td>
              <td>5</td>
              <td>10,000</td>
              <td>No</td>
              <td>30 days</td>
              <td>Email, 2 days</td>
            </tr>
            <tr>
              <td>Team</td>
              <td>$60</td>
              <td>$576</td>
              <td>25</td>
              <td>50,000</td>
              <td>Yes</td>
              <td>1 year</td>
              <td>Email, same day</td>
            </tr>
            <tr>
              <td>Enterprise</td>
              <td>Custom</td>
              <td>Custom</td>
              <td>Unlimited</td>
              <td>Unlimited</td>
              <td>Yes</td>
              <td>Unlimited</td>
              <td>Dedicated channel</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
);
