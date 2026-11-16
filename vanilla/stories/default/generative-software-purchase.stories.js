import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 150 Software purchase AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderSoftwarePurchaseCard({
  title = 'Purchase Pro plan',
  purpose = 'Engineering team',
  startDate = '2026-11-15',
  renewalDate = '2027-11-15',
  seats = '10',
  frequency = 'Monthly',
  total = '$125 per month',
  status = 'active', // 'active' | 'confirmed'
} = {}) {
  if (status === 'confirmed') {
    return `
      <div class="ds-generative-card ds-gen-purchase-card" data-slot="generative-card">
        <h3 class="ds-gen-purchase-card__title">${title}</h3>
        <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
            ${CHECK_ICON}
            <strong>Subscription confirmed!</strong>
          </div>
          <span class="ds-text-xs ds-text-secondary">Pro plan with ${seats} seats active for ${purpose}.</span>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2" data-action="reset-form">
            Manage license
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="ds-generative-card ds-gen-purchase-card" data-slot="generative-card">
      <form class="ds-flex ds-flex-col ds-gap-3" data-slot="purchase-form" onsubmit="return false;">
        <div class="ds-flex ds-items-center ds-justify-between">
          <h3 class="ds-gen-purchase-card__title">${title}</h3>
          <span class="ds-badge ds-badge--primary ds-badge--sm">Active preview</span>
        </div>

        <div class="ds-gen-purchase-card__field">
          <label for="purchase-purpose-input" class="ds-gen-purchase-card__label">What is it for?</label>
          <input id="purchase-purpose-input" type="text" class="ds-gen-purchase-card__input" data-slot="purpose-input" placeholder="e.g. Engineering team" value="${purpose}">
        </div>

        <div class="ds-gen-purchase-card__grid">
          <div class="ds-gen-purchase-card__field">
            <label for="purchase-start-input" class="ds-gen-purchase-card__label">Start date</label>
            <input id="purchase-start-input" type="date" class="ds-gen-purchase-card__input" value="${startDate}">
          </div>
          <div class="ds-gen-purchase-card__field">
            <label for="purchase-renewal-input" class="ds-gen-purchase-card__label">Renewal date</label>
            <input id="purchase-renewal-input" type="date" class="ds-gen-purchase-card__input" value="${renewalDate}">
          </div>
        </div>

        <div class="ds-gen-purchase-card__grid">
          <div class="ds-gen-purchase-card__field">
            <label for="purchase-volume-select" class="ds-gen-purchase-card__label">Volume</label>
            <select id="purchase-volume-select" class="ds-gen-purchase-card__select" data-slot="volume-select">
              <option value="5" ${seats === '5' ? 'selected' : ''}>5 seats ($60/mo)</option>
              <option value="10" ${seats === '10' ? 'selected' : ''}>10 seats ($125/mo)</option>
              <option value="25" ${seats === '25' ? 'selected' : ''}>25 seats ($300/mo)</option>
              <option value="50" ${seats === '50' ? 'selected' : ''}>50 seats ($550/mo)</option>
            </select>
          </div>
          <div class="ds-gen-purchase-card__field">
            <label for="purchase-freq-select" class="ds-gen-purchase-card__label">Frequency</label>
            <select id="purchase-freq-select" class="ds-gen-purchase-card__select" data-slot="freq-select">
              <option value="Monthly" ${frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
              <option value="Annual" ${frequency === 'Annual' ? 'selected' : ''}>Annual (Save 20%)</option>
            </select>
          </div>
        </div>

        <div class="ds-gen-purchase-card__total">
          <span class="ds-gen-purchase-card__total-label">Total</span>
          <span class="ds-gen-purchase-card__total-value" data-slot="total-display">${total}</span>
        </div>

        <div class="ds-gen-purchase-card__actions">
          <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="discard">Discard</button>
          <button type="submit" class="ds-button ds-button--primary ds-button--sm" data-action="confirm">Confirm</button>
        </div>
      </form>
    </div>
  `;
}

function attachPurchaseHandler(root) {
  const form = root.querySelector('[data-slot="purchase-form"]');
  const card = root.querySelector('[data-slot="generative-card"]');
  if (!form || !card) return;

  const volSelect = form.querySelector('[data-slot="volume-select"]');
  const freqSelect = form.querySelector('[data-slot="freq-select"]');
  const totalDisplay = form.querySelector('[data-slot="total-display"]');

  function updateTotal() {
    const seats = parseInt(volSelect.value, 10);
    const isAnnual = freqSelect.value === 'Annual';
    let baseMonthly = 12.5;
    if (seats === 5) baseMonthly = 12;
    if (seats === 25) baseMonthly = 12;
    if (seats === 50) baseMonthly = 11;

    if (isAnnual) {
      const annualTotal = Math.round(seats * baseMonthly * 12 * 0.8);
      totalDisplay.textContent = `$${annualTotal.toLocaleString()} per year`;
    } else {
      const monthlyTotal = Math.round(seats * baseMonthly);
      totalDisplay.textContent = `$${monthlyTotal} per month`;
    }
  }

  if (volSelect && freqSelect && totalDisplay) {
    volSelect.addEventListener('change', updateTotal);
    freqSelect.addEventListener('change', updateTotal);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const seats = volSelect ? volSelect.value : '10';
    const purposeInput = form.querySelector('[data-slot="purpose-input"]');
    const purpose = purposeInput ? purposeInput.value : 'Engineering team';

    card.innerHTML = `
      <h3 class="ds-gen-purchase-card__title">Purchase Pro plan</h3>
      <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
          ${CHECK_ICON}
          <strong>Subscription confirmed!</strong>
        </div>
        <span class="ds-text-xs ds-text-secondary">Pro plan with ${seats} seats active for ${purpose}.</span>
        <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2" data-action="reset-form">
          Manage license
        </button>
      </div>
    `;

    const resetBtn = card.querySelector('[data-action="reset-form"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        card.parentElement.innerHTML = renderSoftwarePurchaseCard();
        attachPurchaseHandler(root);
      });
    }
  });

  const discardBtn = form.querySelector('[data-action="discard"]');
  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      form.reset();
      updateTotal();
    });
  }
}

export const Default = story(
  () => stage(renderSoftwarePurchaseCard()),
  { postRender: attachPurchaseHandler }
);

export const AnnualBilling = story(() =>
  stage(
    renderSoftwarePurchaseCard({
      frequency: 'Annual',
      seats: '25',
      total: '$2,880 per year',
      purpose: 'Global AI Research Lab',
    })
  )
);

export const Confirmed = story(() =>
  stage(
    renderSoftwarePurchaseCard({
      status: 'confirmed',
      seats: '50',
      purpose: 'Product Infrastructure Org',
    })
  )
);

export const EnterpriseCustom = story(() =>
  stage(
    renderSoftwarePurchaseCard({
      title: 'Enterprise Custom Agreement',
      purpose: 'Fortune 500 Core Operations',
      seats: '50',
      frequency: 'Annual',
      total: '$5,280 per year (Invoiced)',
      startDate: '2026-12-01',
      renewalDate: '2027-12-01',
    })
  )
);
