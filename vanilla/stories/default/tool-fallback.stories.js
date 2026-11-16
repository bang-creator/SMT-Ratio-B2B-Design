import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 113 Tool fallback AUI',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const WRENCH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-text-success" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderToolFallback({
  id = 'tool-1',
  toolName = 'get_weather',
  argsText = '{\n  "location": "San Francisco, CA"\n}',
  resultText = '{\n  "temp": 68,\n  "conditions": "Sunny",\n  "humidity": "62%"\n}',
  status = 'complete', // 'running' | 'complete' | 'requires-action' | 'denied' | 'error' | 'cancelled'
  errorText = '',
  approvalPrompt = '',
  open = true,
  interactive = false,
  dimmed = false,
} = {}) {
  let badgeHtml = '';
  if (status === 'running') {
    badgeHtml = '<span class="ds-tool-fallback__badge ds-tool-fallback__badge--running" data-slot="status-badge">running</span>';
  } else if (status === 'requires-action') {
    badgeHtml = '<span class="ds-tool-fallback__badge ds-tool-fallback__badge--warning" data-slot="status-badge">needs approval</span>';
  } else if (status === 'denied') {
    badgeHtml = '<span class="ds-tool-fallback__badge ds-tool-fallback__badge--error" data-slot="status-badge">denied</span>';
  } else if (status === 'error') {
    badgeHtml = '<span class="ds-tool-fallback__badge ds-tool-fallback__badge--error" data-slot="status-badge">failed</span>';
  } else if (status === 'cancelled') {
    badgeHtml = '<span class="ds-tool-fallback__badge" data-slot="status-badge">cancelled</span>';
  } else {
    badgeHtml = CHECK_ICON;
  }

  return `
    <div
      data-slot="tool-fallback"
      data-tool-id="${id}"
      data-status="${status}"
      class="ds-tool-fallback ${dimmed ? 'ds-opacity-60' : ''}"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <button
        type="button"
        class="ds-tool-fallback__trigger"
        data-action="toggle-tool"
        aria-expanded="${open ? 'true' : 'false'}"
      >
        <span class="ds-tool-fallback__chevron ${open ? 'is-expanded' : ''}" data-slot="chevron">
          ${CHEVRON_RIGHT}
        </span>
        <span class="ds-tool-fallback__icon" aria-hidden="true">
          ${WRENCH_ICON}
        </span>
        <span class="ds-tool-fallback__name" data-slot="tool-name">${toolName}</span>
        <span class="ds-flex ds-items-center ds-gap-1" data-slot="status-container">
          ${badgeHtml}
        </span>
      </button>

      <div class="ds-tool-fallback__content ${!open ? 'is-closed' : ''}" data-slot="tool-content">
        ${
          errorText
            ? `
          <div class="ds-tool-fallback__error-card" data-slot="error-card">
            ${errorText}
          </div>
        `
            : ''
        }

        <div>
          <div class="ds-tool-fallback__section-label">Request Arguments</div>
          <pre class="ds-tool-fallback__code" data-slot="tool-args">${argsText}</pre>
        </div>

        ${
          status === 'requires-action'
            ? `
          <div class="ds-tool-fallback__approval" data-slot="approval-box">
            <span class="ds-tool-fallback__approval-prompt">${approvalPrompt || 'Allow this tool to proceed?'}</span>
            <div class="ds-flex ds-items-center ds-gap-2">
              <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="deny-tool">
                Deny
              </button>
              <button type="button" class="ds-button ds-button--primary ds-button--sm" data-action="approve-tool">
                Approve
              </button>
            </div>
          </div>
        `
            : ''
        }

        ${
          status === 'denied'
            ? `
          <div class="ds-tool-fallback__error-card" data-slot="denial-receipt">
            Decision: Tool approval was denied by user.
          </div>
        `
            : ''
        }

        ${
          resultText
            ? `
          <div>
            <div class="ds-tool-fallback__section-label">Result</div>
            <pre class="ds-tool-fallback__code" data-slot="tool-result">${resultText}</pre>
          </div>
        `
            : ''
        }
      </div>
    </div>
  `;
}

function attachToolFallbackInteractivity(root) {
  const cards = root.querySelectorAll('[data-slot="tool-fallback"]');
  cards.forEach((card) => {
    const trigger = card.querySelector('[data-action="toggle-tool"]');
    const chevron = card.querySelector('[data-slot="chevron"]');
    const content = card.querySelector('[data-slot="tool-content"]');

    if (trigger && chevron && content) {
      trigger.addEventListener('click', () => {
        const isExp = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', isExp ? 'false' : 'true');
        chevron.classList.toggle('is-expanded', !isExp);
        content.classList.toggle('is-closed', isExp);
      });
    }

    const approveBtn = card.querySelector('[data-action="approve-tool"]');
    const denyBtn = card.querySelector('[data-action="deny-tool"]');
    const statusContainer = card.querySelector('[data-slot="status-container"]');
    const approvalBox = card.querySelector('[data-slot="approval-box"]');

    if (approveBtn && statusContainer && approvalBox) {
      approveBtn.addEventListener('click', () => {
        card.setAttribute('data-status', 'complete');
        statusContainer.innerHTML = CHECK_ICON;
        approvalBox.remove();

        const resultWrap = document.createElement('div');
        resultWrap.innerHTML = `
          <div class="ds-tool-fallback__section-label">Result</div>
          <pre class="ds-tool-fallback__code" data-slot="tool-result">{\n  "success": true,\n  "deletedBranch": "feat/old-checkout"\n}</pre>
        `;
        content.appendChild(resultWrap);
      });
    }

    if (denyBtn && statusContainer && approvalBox) {
      denyBtn.addEventListener('click', () => {
        card.setAttribute('data-status', 'denied');
        statusContainer.innerHTML = '<span class="ds-tool-fallback__badge ds-tool-fallback__badge--error" data-slot="status-badge">denied</span>';
        approvalBox.remove();

        const denialWrap = document.createElement('div');
        denialWrap.className = 'ds-tool-fallback__error-card';
        denialWrap.setAttribute('data-slot', 'denial-receipt');
        denialWrap.textContent = 'Decision: Tool approval was denied by user.';
        content.appendChild(denialWrap);
      });
    }
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderToolFallback({
      toolName: 'delete_branch',
      argsText: '{\n  "repo": "acme/web",\n  "branch": "feat/old-checkout"\n}',
      status: 'requires-action',
      approvalPrompt: 'Delete feat/old-checkout from acme/web?',
      resultText: '',
      interactive: true,
    });
    attachToolFallbackInteractivity(root);
    return root;
  },
};

export const Running = story(
  () => renderToolFallback({
    toolName: 'get_weather',
    argsText: '{\n  "location": "San Francisco, CA"\n}',
    status: 'running',
    resultText: '',
  })
);

export const RequiresAction = story(
  () => renderToolFallback({
    toolName: 'delete_branch',
    argsText: '{\n  "repo": "acme/web",\n  "branch": "feat/old-checkout"\n}',
    status: 'requires-action',
    approvalPrompt: 'Delete feat/old-checkout from acme/web?',
    resultText: '',
  })
);

export const Denied = story(
  () => renderToolFallback({
    toolName: 'send_email',
    argsText: '{\n  "to": "all-staff@acme.dev",\n  "subject": "Office closed Friday"\n}',
    status: 'denied',
    resultText: '{\n  "error": "Tool approval denied"\n}',
  })
);

export const ToolError = story(
  () => renderToolFallback({
    toolName: 'run_sql',
    argsText: '{\n  "query": "SELECT count(*) FROM orders WHERE status = \'open\'"\n}',
    status: 'error',
    resultText: 'Error: connect ECONNREFUSED 10.0.4.12:5432',
  })
);

export const Error = story(
  () => renderToolFallback({
    toolName: 'run_sql',
    errorText: 'ECONNREFUSED 10.0.4.12:5432: database is not accepting connections',
    argsText: '{\n  "query": "SELECT count(*) FROM orders WHERE status = \'open\'"\n}',
    status: 'error',
    resultText: '',
  })
);

export const Cancelled = story(
  () => renderToolFallback({
    toolName: 'crawl_site',
    argsText: '{\n  "url": "https://docs.acme.dev",\n  "maxPages": 500\n}',
    status: 'cancelled',
    resultText: '',
    dimmed: true,
  })
);

export const LongContent = story(
  () => renderToolFallback({
    toolName: 'list_deployments',
    argsText: '{\n  "project": "web",\n  "status": "ready",\n  "limit": 3\n}',
    status: 'complete',
    resultText: JSON.stringify({
      deployments: [
        {
          id: 'dpl_8f2kQw1',
          url: 'https://web-8f2kqw1-acme.vercel.app',
          commit: 'fix: debounce search input on the pricing page',
          createdAt: '2026-11-03T16:42:10Z',
        },
        {
          id: 'dpl_7c1mZx9',
          url: 'https://web-7c1mzx9-acme.vercel.app',
          commit: 'feat: add annual billing toggle',
          createdAt: '2026-11-02T21:05:44Z',
        },
        {
          id: 'dpl_6b0nYv3',
          url: 'https://web-6b0nyv3-acme.vercel.app',
          commit: 'chore: bump next to 16.0.1',
          createdAt: '2026-11-01T09:18:27Z',
        },
      ],
      hasMore: true,
    }, null, 2),
  })
);
