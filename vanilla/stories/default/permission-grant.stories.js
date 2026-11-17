import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 29 Permission Grant',
  parameters: { layout: 'padded' },
};

const KEY_ROUND_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path><path d="m15.5 7.5 3 3L22 7l-3-3"></path></svg>`;

function renderPermissionGrant({
  capability = 'Write files to workspace',
  requester = 'Claude Engineer',
  reach = [
    'Modify files in /src/components',
    'Execute npm run build',
  ],
  scope = 'pending',
} = {}) {
  const actionsHtml =
    scope === 'pending'
      ? `
        <div class="ds-permission-grant__footer">
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-permission-grant__btn ds-perm-deny">Deny</button>
          <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-permission-grant__btn ds-perm-session">This session</button>
          <button type="button" class="ds-button ds-button--primary ds-button--sm ds-button--pill ds-permission-grant__btn ds-permission-grant__btn--always ds-perm-always">Always</button>
        </div>
      `
      : `
        <div class="ds-permission-grant__footer">
          <span class="ds-permission-grant__receipt" role="button" tabindex="0" title="Click to reset">
            ${scope === 'denied' ? 'denied' : `granted · ${scope}`}
          </span>
        </div>
      `;

  return `
    <div data-slot="permission-grant" class="ds-permission-grant">
      <div class="ds-permission-grant__header">
        <div class="ds-permission-grant__icon-box">${KEY_ROUND_ICON}</div>
        <div class="ds-permission-grant__title-group">
          <span class="ds-permission-grant__capability">${capability}</span>
          <span class="ds-permission-grant__requester">requested by ${requester}</span>
        </div>
      </div>

      <div class="ds-permission-grant__reach">
        <span class="ds-permission-grant__reach-label">this grants</span>
        ${reach
          .map(
            (item) => `
          <div class="ds-permission-grant__reach-item">
            <span class="ds-permission-grant__bullet"></span>
            <span>${item}</span>
          </div>
        `
          )
          .join('')}
      </div>

      ${actionsHtml}
    </div>
  `;
}

function bindPermEvents(root, initialProps = {}) {
  let state = {
    capability: 'Write files to workspace',
    requester: 'Claude Engineer',
    reach: [
      'Modify files in /src/components',
      'Execute npm run build',
    ],
    scope: 'pending',
    ...initialProps,
  };

  function update() {
    root.innerHTML = renderPermissionGrant(state);
    attach();
  }

  function attach() {
    const denyBtn = root.querySelector('.ds-perm-deny');
    const sessionBtn = root.querySelector('.ds-perm-session');
    const alwaysBtn = root.querySelector('.ds-perm-always');

    if (denyBtn) {
      denyBtn.addEventListener('click', () => {
        state.scope = 'denied';
        update();
      });
    }

    if (sessionBtn) {
      sessionBtn.addEventListener('click', () => {
        state.scope = 'session';
        update();
      });
    }

    if (alwaysBtn) {
      alwaysBtn.addEventListener('click', () => {
        state.scope = 'always';
        update();
      });
    }

    const receipt = root.querySelector('.ds-permission-grant__receipt');
    if (receipt) {
      receipt.addEventListener('click', () => {
        state.scope = 'pending';
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-perm-target">
          ${renderPermissionGrant()}
        </div>
      </section>
    `;
    const target = root.querySelector('.ds-perm-target');
    bindPermEvents(target);
    return root;
  },
};
