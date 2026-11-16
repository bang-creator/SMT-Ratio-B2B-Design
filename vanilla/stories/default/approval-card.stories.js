import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 61 Approval Card',
  parameters: { layout: 'padded' },
};

const ICONS = {
  terminal: `<svg class="ds-approval-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
  danger: `<svg class="ds-approval-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  check: `<svg class="ds-approval-card__receipt-icon ds-approval-card__receipt-icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  denied: `<svg class="ds-approval-card__receipt-icon ds-approval-card__receipt-icon--denied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  spinner: `<svg class="ds-approval-card__receipt-icon ds-approval-card__receipt-icon--running" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`,
};

function renderApprovalCard({
  title = 'Run command',
  subtitle = 'The agent wants to run a shell command',
  description = '',
  command = 'pnpm vitest run --changed',
  details = [
    { label: 'Directory', value: '/Users/thaibang/Documents/OpenAI Design System' },
    { label: 'Timeout', value: '30s' },
  ],
  variant = 'default',
  state = 'request',
  receiptText = '',
  allowOnceLabel = 'Allow once',
  alwaysAllowLabel = 'Always allow',
  denyLabel = 'Deny',
} = {}) {
  const icon = variant === 'destructive' ? ICONS.danger : ICONS.terminal;

  let actionsHtml = '';
  if (state === 'request') {
    actionsHtml = `
      <button type="button" class="ds-approval-card__btn" data-btn-deny>${denyLabel}</button>
      ${alwaysAllowLabel ? `<button type="button" class="ds-approval-card__btn" data-btn-always>${alwaysAllowLabel}</button>` : ''}
      <button type="button" class="ds-approval-card__btn ds-approval-card__btn--primary" data-btn-allow>${allowOnceLabel}</button>
    `;
  } else if (state === 'running') {
    actionsHtml = `
      <div role="status" class="ds-approval-card__receipt" data-receipt-reset title="Click to reset">
        ${ICONS.spinner}
        <span>${receiptText || 'Approved, running'}</span>
      </div>
    `;
  } else if (state === 'done') {
    actionsHtml = `
      <div role="status" class="ds-approval-card__receipt" data-receipt-reset title="Click to reset">
        ${ICONS.check}
        <span>${receiptText || 'Finished'}</span>
      </div>
    `;
  } else if (state === 'denied') {
    actionsHtml = `
      <div role="status" class="ds-approval-card__receipt" data-receipt-reset title="Click to reset">
        ${ICONS.denied}
        <span>${receiptText || 'Denied'}</span>
      </div>
    `;
  }

  const detailsHtml = details && details.length
    ? `
      <dl class="ds-approval-card__details">
        ${details.map((d) => `
          <div class="ds-approval-card__detail-row">
            <dt class="ds-approval-card__detail-label">${d.label}</dt>
            <dd class="ds-approval-card__detail-value">${d.value}</dd>
          </div>
        `).join('')}
      </dl>
    `
    : '';

  return `
    <div data-slot="approval-card" data-variant="${variant}" data-state="${state}" class="ds-approval-card">
      <div class="ds-approval-card__header">
        <div class="ds-approval-card__icon-box">
          ${icon}
        </div>
        <div class="ds-approval-card__title-group">
          <h4 class="ds-approval-card__title">${title}</h4>
          <p class="ds-approval-card__subtitle">${subtitle}</p>
        </div>
      </div>

      ${description ? `<p class="ds-approval-card__description">${description}</p>` : ''}
      ${command ? `<div class="ds-approval-card__command">${command}</div>` : ''}
      ${detailsHtml}

      <div class="ds-approval-card__actions">
        ${actionsHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentState = 'request';

    const render = () => {
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">61 Approval Card</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">State: ${currentState}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderApprovalCard({
              title: 'Run command',
              subtitle: 'The agent wants to run a shell command',
              command: 'pnpm vitest run --changed',
              state: currentState,
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-btn-deny]')?.addEventListener('click', () => {
        currentState = 'denied';
        render();
      });

      root.querySelector('[data-btn-always]')?.addEventListener('click', () => {
        currentState = 'done';
        render();
      });

      root.querySelector('[data-btn-allow]')?.addEventListener('click', () => {
        currentState = 'running';
        render();
        setTimeout(() => {
          if (currentState === 'running') {
            currentState = 'done';
            render();
          }
        }, 800);
      });

      root.querySelector('[data-receipt-reset]')?.addEventListener('click', () => {
        currentState = 'request';
        render();
      });
    };

    render();
    return root;
  },
};

export const Destructive = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">61 Approval Card (Destructive)</span>
      <span class="ds-badge ds-badge--danger ds-badge--sm">Irreversible Action</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderApprovalCard({
        title: 'Delete 12 archived conversations',
        subtitle: 'This action cannot be undone',
        description: 'The selected conversations and their generated files will be permanently removed.',
        variant: 'destructive',
        state: 'request',
        command: '',
        details: [
          { label: 'Conversations', value: '12 archived threads' },
          { label: 'Generated files', value: '38 workspace artifacts' },
        ],
        allowOnceLabel: 'Delete conversations',
        alwaysAllowLabel: '',
        denyLabel: 'Keep conversations',
      })}
    </div>
  </div>
`);
