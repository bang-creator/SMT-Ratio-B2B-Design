import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 74 Quota Banner',
  parameters: { layout: 'padded' },
};

function renderQuotaBanner({
  used = 760000,
  limit = 1000000,
  unit = 'tokens',
  resetsIn = '4h 12m',
  upgradeLabel = 'Upgrade tier',
} = {}) {
  const left = Math.max(0, limit - used);
  const ratio = limit === 0 ? 0 : used / limit;
  const exhausted = limit > 0 && left === 0;
  const tight = !exhausted && ratio >= 0.9;

  let leftModifier = '';
  let barModifier = '';
  if (exhausted) {
    leftModifier = 'ds-quota-banner__left--exhausted';
    barModifier = 'ds-quota-banner__bar--exhausted';
  } else if (tight) {
    leftModifier = 'ds-quota-banner__left--tight';
    barModifier = 'ds-quota-banner__bar--tight';
  }

  const pct = Math.min(100, Math.round(ratio * 100));

  function fmt(val) {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${Math.round(val / 1000)}k`;
    return `${val}`;
  }

  return `
    <div data-slot="quota-banner" class="ds-quota-banner" data-state="${exhausted ? 'exhausted' : tight ? 'tight' : 'normal'}" role="button" tabindex="0">
      <div class="ds-quota-banner__header">
        <span class="ds-quota-banner__left ${leftModifier}">
          ${fmt(left)} ${unit} left
        </span>
        <span class="ds-quota-banner__resets">
          resets in ${resetsIn}
        </span>
      </div>

      <span
        role="meter"
        aria-label="${unit} used"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${pct}"
        aria-valuetext="${fmt(used)} of ${fmt(limit)} ${unit} used"
        class="ds-quota-banner__track"
      >
        <span
          class="ds-quota-banner__bar ${barModifier} ds-cost-pct-${pct}"
          data-slot="quota-fill"
        ></span>
      </span>

      <div class="ds-quota-banner__footer">
        <span class="ds-quota-banner__usage">
          ${fmt(used)} of ${fmt(limit)} used
        </span>
        <button
          type="button"
          class="ds-quota-banner__btn"
          data-btn-upgrade
        >
          ${upgradeLabel}
        </button>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentStep = 0;
    const states = [
      { used: 500000, limit: 1000000, resetsIn: '6h 30m' },
      { used: 900000, limit: 1000000, resetsIn: '1h 15m' },
      { used: 1000000, limit: 1000000, resetsIn: '8m' },
    ];

    const render = () => {
      const state = states[currentStep];
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">74 Quota Banner</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${currentStep === 0 ? 'Normal Capacity' : currentStep === 1 ? 'Tight (Amber Alert)' : 'Exhausted (Red Limit)'}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderQuotaBanner(state)}
          </div>
        </div>
      `;

      const card = root.querySelector('.ds-quota-banner');
      card?.addEventListener('click', (e) => {
        const upgradeBtn = e.target.closest('[data-btn-upgrade]');
        if (upgradeBtn) {
          e.stopPropagation();
          currentStep = 0;
          render();
          return;
        }
        currentStep = (currentStep + 1) % states.length;
        render();
      });

      card?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          currentStep = (currentStep + 1) % states.length;
          render();
        }
      });
    };

    render();
    return root;
  },
};

export const Exhausted = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">74 Quota Banner (Exhausted Limit)</span>
      <span class="ds-badge ds-badge--danger ds-badge--sm">Quota Depleted</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderQuotaBanner({
        used: 2500000,
        limit: 2500000,
        unit: 'tokens',
        resetsIn: '12m',
        upgradeLabel: 'Upgrade plan',
      })}
    </div>
  </div>
`);
