import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 92 Connection state',
  parameters: { layout: 'padded' },
};

const CLOUD_OFF = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 2 20 20"></path><path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193"></path><path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07"></path></svg>`;
const SPINNER = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderConnectionState({
  phase = 'dropped',
  attempt = 3,
  resumedTokens = 1248,
} = {}) {
  return `
    <div data-slot="connection-state" class="ds-connection-state" data-phase="${phase}">
      ${
        phase === 'dropped'
          ? `
        <span class="ds-connection-state__icon" aria-hidden="true">${CLOUD_OFF}</span>
        <span class="ds-connection-state__text" data-slot="conn-text">Connection lost. The run kept going on the server.</span>
        <button type="button" class="ds-connection-state__reconnect-btn" data-slot="reconnect-btn">
          Reconnect
        </button>
      `
          : ''
      }

      ${
        phase === 'reconnecting'
          ? `
        <span class="ds-connection-state__icon" aria-hidden="true">${SPINNER}</span>
        <span class="ds-connection-state__text" data-slot="conn-text">Reconnecting</span>
        <span class="ds-connection-state__meta" data-slot="conn-meta">attempt ${attempt}</span>
      `
          : ''
      }

      ${
        phase === 'resumed'
          ? `
        <span class="ds-connection-state__icon" aria-hidden="true">${CHECK_ICON}</span>
        <span class="ds-connection-state__text" data-slot="conn-text">Picked the stream back up.</span>
        <span class="ds-connection-state__meta" data-slot="conn-meta">+${resumedTokens} tokens</span>
      `
          : ''
      }
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentPhase = 'dropped';
    let currentAttempt = 1;

    const render = () => {
      const badgeText = currentPhase === 'dropped'
        ? 'Connection Lost'
        : currentPhase === 'reconnecting'
        ? `Reconnecting (Attempt ${currentAttempt})`
        : 'Stream Resumed';

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            <div class="ds-flex ds-flex-col ds-gap-3 ds-items-start">
              ${renderConnectionState({
                phase: currentPhase,
                attempt: currentAttempt,
                resumedTokens: 1248,
              })}
              ${
                currentPhase === 'resumed'
                  ? `
                <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-slot="simulate-drop">
                  Drop connection again
                </button>
              `
                  : ''
              }
            </div>
          </div>
        </div>
      `;

      root.querySelector('[data-slot="reconnect-btn"]')?.addEventListener('click', () => {
        currentPhase = 'reconnecting';
        currentAttempt = 1;
        render();

        setTimeout(() => {
          currentPhase = 'resumed';
          render();
        }, 800);
      });

      root.querySelector('[data-slot="simulate-drop"]')?.addEventListener('click', () => {
        currentPhase = 'dropped';
        render();
      });
    };

    render();
    return root;
  },
};

export const Reconnecting = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderConnectionState({ phase: 'reconnecting', attempt: 3 })}
    </div>
  </div>
`);

export const Resumed = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderConnectionState({ phase: 'resumed', resumedTokens: 1248 })}
    </div>
  </div>
`);
