import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 67 Agent Card',
  parameters: { layout: 'padded' },
};

const ICONS = {
  bot: `<svg class="ds-agent-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 17v1"></path><path d="M15 17v1"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path></svg>`,
  check: `<svg class="ds-agent-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
};

function renderAgentCard({
  name = 'Maintainer',
  version = '1.4.0',
  provider = 'assistant-ui',
  description = 'Works through the issue queue: reproduces the report, writes the fix, and opens the PR.',
  skills = [
    { name: 'triage', desc: 'Read an issue and label it' },
    { name: 'repro', desc: 'Build a minimal reproduction' },
    { name: 'patch', desc: 'Open a PR with the fix' },
  ],
  endpoint = 'https://agents.example.com/a2a',
  model = 'opus',
  connected = false,
} = {}) {
  const skillsHtml = skills
    .map(
      (s) => `
    <div class="ds-agent-card__skill-row">
      <span class="ds-agent-card__skill-tag">${s.name}</span>
      <span class="ds-agent-card__skill-desc">${s.desc}</span>
    </div>
  `
    )
    .join('');

  const btnHtml = connected
    ? `
      <button type="button" class="ds-agent-card__btn ds-agent-card__btn--connected" data-btn-action title="Click to disconnect">
        ${ICONS.check}
        <span>Connected</span>
      </button>
    `
    : `
      <button type="button" class="ds-agent-card__btn ds-agent-card__btn--connect" data-btn-action>
        <span>Connect</span>
      </button>
    `;

  return `
    <div data-slot="agent-card" data-connected="${connected}" class="ds-agent-card">
      <div class="ds-agent-card__header">
        <div class="ds-agent-card__icon-box">
          ${ICONS.bot}
        </div>
        <div class="ds-agent-card__title-group">
          <div class="ds-agent-card__title-row">
            <h4 class="ds-agent-card__name">${name}</h4>
            <span class="ds-agent-card__version">v${version}</span>
          </div>
          <span class="ds-agent-card__provider">${provider}</span>
        </div>
      </div>

      <p class="ds-agent-card__description">${description}</p>

      ${skills && skills.length ? `<div class="ds-agent-card__skills">${skillsHtml}</div>` : ''}

      <div class="ds-agent-card__meta-bar">
        <span class="ds-agent-card__endpoint">${endpoint}</span>
        <span class="ds-agent-card__model">${model}</span>
      </div>

      ${btnHtml}
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isConn = false;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">67 Agent Card</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${isConn ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderAgentCard({ connected: isConn })}
          </div>
        </div>
      `;

      root.querySelector('[data-btn-action]')?.addEventListener('click', () => {
        isConn = !isConn;
        render();
      });
    };

    render();
    return root;
  },
};

export const Connected = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">67 Agent Card (Connected State)</span>
      <span class="ds-badge ds-badge--success ds-badge--sm">Active Integration</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderAgentCard({ connected: true })}
    </div>
  </div>
`);
