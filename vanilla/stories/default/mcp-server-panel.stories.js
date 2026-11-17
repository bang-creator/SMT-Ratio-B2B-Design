import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 27 MCP Server Panel',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-mcp-server-panel__chevron" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const PLUG_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-text-secondary" aria-hidden="true"><path d="M12 22v-5"></path><path d="M9 8V2"></path><path d="M15 8V2"></path><path d="M18 8v5a6 6 0 0 1-12 0V8z"></path></svg>`;

const DEFAULT_SERVERS = [
  { id: 'github', name: 'github', transport: 'stdio', status: 'connected', tools: ['create_issue', 'get_file', 'list_commits'] },
  { id: 'postgres', name: 'postgres', transport: 'stdio', status: 'connected', tools: ['query', 'explain', 'list_tables'] },
  { id: 'slack', name: 'slack', transport: 'sse', status: 'needs-auth', tools: ['post_message', 'read_channel'] },
  { id: 'docker', name: 'docker', transport: 'stdio', status: 'connecting', tools: ['ps', 'logs'] },
];

function renderMcpServerPanel({
  servers = DEFAULT_SERVERS,
  expandedId = null,
} = {}) {
  const connectedCount = servers.filter((s) => s.status === 'connected').length;

  const rowsHtml = servers
    .map((s) => {
      const isExpanded = s.id === expandedId;
      return `
        <div class="ds-mcp-server-panel__item" data-server-id="${s.id}">
          <button type="button" class="ds-mcp-server-panel__row ds-mcp-toggle" data-server-id="${s.id}" aria-expanded="${isExpanded}">
            <span class="ds-mcp-server-panel__chevron ${isExpanded ? 'ds-mcp-server-panel__chevron--expanded' : ''}">${CHEVRON_RIGHT}</span>
            ${PLUG_ICON}
            <span class="ds-flex-1 ds-truncate">${s.name}</span>
            <span class="ds-mcp-server-panel__count">${s.tools.length} tools</span>
            <span class="ds-status-dot ds-status-dot--${s.status}"></span>
          </button>
          ${
            isExpanded
              ? `
            <div class="ds-mcp-server-panel__details">
              <div class="ds-mcp-server-panel__meta">
                <span>${s.transport} · ${s.status}</span>
                ${s.status === 'needs-auth' ? '<button type="button" class="ds-mcp-server-panel__authorize-btn">Authorize</button>' : ''}
              </div>
              <div class="ds-mcp-server-panel__tools">
                ${s.tools.map((t) => `<span class="ds-mcp-server-panel__tool-chip">${t}</span>`).join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="mcp-server-panel" class="ds-mcp-server-panel">
      <div class="ds-mcp-server-panel__header">
        <span class="ds-mcp-server-panel__title">Servers</span>
        <span class="ds-mcp-server-panel__count">${connectedCount} of ${servers.length} connected</span>
      </div>
      <div class="ds-mcp-server-panel__list">
        ${rowsHtml}
      </div>
    </div>
  `;
}

function bindMcpPanelEvents(root, initialServers = DEFAULT_SERVERS, initialExpanded = null) {
  let expandedId = initialExpanded;
  const servers = [...initialServers];

  function attachListeners() {
    const buttons = root.querySelectorAll('.ds-mcp-toggle');
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-server-id');
        expandedId = expandedId === id ? null : id;
        root.innerHTML = renderMcpServerPanel({ servers, expandedId });
        attachListeners();
      });
    });

    const authBtn = root.querySelector('.ds-mcp-server-panel__authorize-btn');
    if (authBtn) {
      authBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        authBtn.textContent = 'Authorized';
        authBtn.classList.add('ds-mcp-server-panel__authorize-btn--authorized');
      });
    }
  }

  attachListeners();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-mcp-target">
          ${renderMcpServerPanel({ expandedId: null })}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-mcp-target');
    bindMcpPanelEvents(target, DEFAULT_SERVERS, null);
    return root;
  },
};
