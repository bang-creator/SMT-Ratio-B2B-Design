import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 68 Agent Handoff',
  parameters: { layout: 'padded' },
};

const ICONS = {
  bot: `<svg class="ds-agent-handoff__bot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 17v1"></path><path d="M15 17v1"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path></svg>`,
  arrowRight: `<svg class="ds-agent-handoff__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`,
};

function renderAgentHandoff({
  from = 'Triage',
  to = 'Maintainer',
  reason = 'Triage reproduced the report and narrowed it to the converter, so the fix goes to the agent that can write and verify a patch.',
  carried = [
    'The failing test and its output',
    'The two files the reader already narrowed to',
  ],
  settled = false,
} = {}) {
  const carriedHtml =
    carried.length > 0
      ? `
    <div class="ds-agent-handoff__carried">
      <span class="ds-agent-handoff__carried-label">carried over</span>
      ${carried
        .map(
          (item) => `
        <span class="ds-agent-handoff__carried-item">${item}</span>
      `
        )
        .join('')}
    </div>
  `
      : '';

  return `
    <div data-slot="agent-handoff" data-settled="${settled}" class="ds-agent-handoff ${settled ? 'ds-agent-handoff--settled' : ''}" role="button" tabindex="0">
      <div class="ds-agent-handoff__header">
        <span class="ds-agent-handoff__pill ds-agent-handoff__pill--from">
          ${ICONS.bot}
          <span>${from}</span>
        </span>

        ${ICONS.arrowRight}

        <span class="ds-agent-handoff__pill ds-agent-handoff__pill--to">
          ${ICONS.bot}
          <span>${to}</span>
        </span>
      </div>

      <p class="ds-agent-handoff__reason">${reason}</p>

      ${carriedHtml}
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isSettled = false;

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">68 Agent Handoff</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${isSettled ? 'Settled (Click to hand off)' : 'Handing Off (Active)'}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderAgentHandoff({ settled: isSettled })}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-agent-handoff');
      card?.addEventListener('click', () => {
        isSettled = !isSettled;
        render();
      });
      card?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isSettled = !isSettled;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const NothingCarried = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">68 Agent Handoff (Empty Context)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Direct Delegation</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderAgentHandoff({
        from: 'Router',
        to: 'Billing',
        reason: 'The question is about an invoice, which only the billing agent can see.',
        carried: [],
        settled: true,
      })}
    </div>
  </div>
`);
