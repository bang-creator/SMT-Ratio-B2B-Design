import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 60 Agent Status',
  parameters: { layout: 'padded' },
};

const ICONS = {
  done: `<svg class="ds-agent-status__icon ds-agent-status__icon--done" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  failed: `<svg class="ds-agent-status__icon ds-agent-status__icon--failed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  pause: `<svg class="ds-agent-status__trailing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  replay: `<svg class="ds-agent-status__trailing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
};

function renderStatusPill({
  state = 'working',
  label = 'Auditing component fidelity...',
  elapsed = '4s',
} = {}) {
  let leadingIcon = '';
  if (state === 'done') {
    leadingIcon = ICONS.done;
  } else if (state === 'failed') {
    leadingIcon = ICONS.failed;
  } else if (state === 'working') {
    leadingIcon = '<span class="ds-agent-status__dot ds-agent-status__dot--working" aria-hidden="true"></span>';
  } else {
    leadingIcon = '<span class="ds-agent-status__dot ds-agent-status__dot--waiting" aria-hidden="true"></span>';
  }

  const trailingIcon = state === 'done' || state === 'failed' ? ICONS.replay : ICONS.pause;
  const trailingLabel = state === 'done' || state === 'failed' ? 'Restart agent' : 'Pause agent';

  return `
    <span data-slot="agent-status" data-state="${state}" class="ds-agent-status" role="button" tabindex="0">
      ${leadingIcon}
      <span class="sr-only">${state}</span>
      <span class="ds-agent-status__label">${label}</span>
      ${elapsed && state !== 'done' && state !== 'failed' ? `<span class="ds-agent-status__elapsed">${elapsed}</span>` : ''}
      <button type="button" aria-label="${trailingLabel}" class="ds-agent-status__trailing" data-trailing-btn>
        ${trailingIcon}
      </button>
    </span>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const states = [
      { state: 'working', label: 'Refactoring composer', elapsed: '0:24' },
      { state: 'waiting', label: 'Waiting for approval', elapsed: '1:02' },
      { state: 'done', label: 'Finished, 2 files changed', elapsed: '' },
      { state: 'failed', label: 'Tests failed, 3 errors', elapsed: '' },
    ];

    let current = 0;

    const render = () => {
      const s = states[current];
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderStatusPill(s)}
          </div>
        </div>
      `;

      const pill = root.querySelector('.ds-agent-status');
      pill?.addEventListener('click', (e) => {
        const trailingBtn = e.target.closest('[data-trailing-btn]');
        if (trailingBtn) {
          e.stopPropagation();
          // Restart or toggle
          if (s.state === 'done' || s.state === 'failed') {
            current = 0;
          } else if (s.state === 'working') {
            current = 1;
          } else {
            current = 0;
          }
          render();
          return;
        }
        current = (current + 1) % states.length;
        render();
      });

      pill?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          current = (current + 1) % states.length;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const LongLabel = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderStatusPill({
        state: 'working',
        label: 'Regenerating the API reference for every package in the monorepo',
        elapsed: '14:08',
      })}
    </div>
  </div>
`);
