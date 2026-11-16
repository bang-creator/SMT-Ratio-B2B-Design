import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 110 MCP config dialog AUI',
  parameters: { layout: 'padded' },
};

const PLUS_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
const PLUG_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-text-secondary" aria-hidden="true"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a6 6 0 0 1-12 0V8z"></path></svg>`;
const CHEVRON_RIGHT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-mcp-server-panel__chevron" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

const SAMPLE_SERVERS = [
  {
    id: 'github',
    name: 'github-mcp',
    transport: 'streamable-http',
    status: 'connected',
    tools: ['create_issue', 'get_file', 'list_commits', 'create_pr'],
  },
  {
    id: 'postgres',
    name: 'postgres-analytics',
    transport: 'stdio',
    status: 'connected',
    tools: ['run_query', 'explain_plan', 'list_tables'],
  },
  {
    id: 'slack',
    name: 'slack-bot',
    transport: 'sse',
    status: 'needs-auth',
    tools: ['post_message', 'read_channel'],
  },
  {
    id: 'docker',
    name: 'docker-runtime',
    transport: 'stdio',
    status: 'connecting',
    tools: ['container_ps', 'logs_tail'],
  },
];

function renderMcpConfigDialog({
  servers = SAMPLE_SERVERS,
  expandedId = 'github',
  interactive = true,
} = {}) {
  const connectedCount = servers.filter((s) => s.status === 'connected').length;

  return `
    <div
      data-slot="mcp-config"
      class="ds-mcp-config-card"
      role="dialog"
      aria-label="Model Context Protocol Configuration"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <div class="ds-mcp-config-header">
        <div>
          <div class="ds-mcp-config-title">Model Context Protocol</div>
          <div class="ds-mcp-config-desc">Manage connected MCP server endpoints and runtime tools</div>
        </div>
        <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-action="add-server">
          ${PLUS_ICON} Add server
        </button>
      </div>

      <div class="ds-mcp-server-list" data-slot="server-list">
        ${
          servers.length === 0
            ? `
          <div class="ds-text-secondary ds-text-xs" data-slot="empty-state">
            No MCP servers configured yet. Click "Add server" to register a stdio or SSE transport.
          </div>
        `
            : servers
                .map((s) => {
                  const isExpanded = s.id === expandedId;
                  return `
            <div class="ds-mcp-server-item" data-server-id="${s.id}">
              <button
                type="button"
                class="ds-mcp-server-row"
                data-action="toggle-server"
                data-server-id="${s.id}"
                aria-expanded="${isExpanded ? 'true' : 'false'}"
              >
                <span class="ds-mcp-server-panel__chevron ${isExpanded ? 'ds-mcp-server-panel__chevron--expanded' : ''}">
                  ${CHEVRON_RIGHT}
                </span>
                ${PLUG_ICON}
                <span class="ds-mcp-server-name">${s.name}</span>
                <span class="ds-mcp-server-count">${s.tools.length} tools</span>
                <span class="ds-status-dot ds-status-dot--${s.status}"></span>
              </button>

              <div class="ds-mcp-server-details ${!isExpanded ? 'is-hidden' : ''}" data-slot="details-${s.id}">
                <div class="ds-mcp-server-meta">
                  <span>${s.transport} · ${s.status}</span>
                  ${
                    s.status === 'needs-auth'
                      ? '<button type="button" class="ds-mcp-server-panel__authorize-btn" data-action="authorize-server" data-server-id="' +
                        s.id +
                        '">Authorize</button>'
                      : ''
                  }
                </div>
                <div class="ds-mcp-server-tools">
                  ${s.tools
                    .map((t) => `<span class="ds-mcp-server-panel__tool-chip">${t}</span>`)
                    .join('')}
                </div>
              </div>
            </div>
          `;
                })
                .join('')
        }
      </div>

      <div class="ds-mcp-config-footer">
        <span class="ds-mcp-config-summary" data-slot="config-summary">
          ${connectedCount} of ${servers.length} connected
        </span>
        <button type="button" class="ds-button ds-button--primary ds-button--sm" data-action="done">
          Done
        </button>
      </div>
    </div>
  `;
}

function attachMcpInteractivity(root, initialServers = SAMPLE_SERVERS) {
  const card = root.querySelector('[data-slot="mcp-config"]');
  if (!card) return;

  const serverItems = card.querySelectorAll('.ds-mcp-server-item');
  serverItems.forEach((item) => {
    const toggleBtn = item.querySelector('[data-action="toggle-server"]');
    const chevron = item.querySelector('.ds-mcp-server-panel__chevron');
    const details = item.querySelector('.ds-mcp-server-details');

    if (toggleBtn && chevron && details) {
      toggleBtn.addEventListener('click', () => {
        const isExp = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', isExp ? 'false' : 'true');
        chevron.classList.toggle('ds-mcp-server-panel__chevron--expanded', !isExp);
        details.classList.toggle('is-hidden', isExp);
      });
    }

    const authBtn = item.querySelector('[data-action="authorize-server"]');
    if (authBtn) {
      authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        authBtn.textContent = 'Authorized';
        authBtn.disabled = true;
        const statusDot = item.querySelector('.ds-status-dot');
        if (statusDot) {
          statusDot.className = 'ds-status-dot ds-status-dot--connected';
        }
        const summary = card.querySelector('[data-slot="config-summary"]');
        if (summary) {
          summary.textContent = '3 of 4 connected';
        }
      });
    }
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderMcpConfigDialog({ expandedId: 'slack' });
    attachMcpInteractivity(root);
    return root;
  },
};

export const Empty = story(renderMcpConfigDialog({ servers: [] }));

export const NeedsAuth = story(renderMcpConfigDialog({ expandedId: 'slack' }));

export const Connecting = story(renderMcpConfigDialog({ expandedId: 'docker' }));

export const LongList = story(renderMcpConfigDialog({
  servers: [
    ...SAMPLE_SERVERS,
    {
      id: 'redis',
      name: 'redis-cache',
      transport: 'stdio',
      status: 'connected',
      tools: ['get_key', 'set_key', 'flush_keys'],
    },
    {
      id: 'linear',
      name: 'linear-issues',
      transport: 'sse',
      status: 'connected',
      tools: ['create_ticket', 'search_issues', 'assign_team'],
    },
  ],
  expandedId: 'linear',
}));
