import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 140 Shopping cart AUI',
  parameters: { layout: 'padded' },
};

const TRASH_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderCartCard({
  items = [
    { id: '1', name: 'Wireless Headphones', price: '$79.00', priceNum: 79.0 },
    { id: '2', name: 'USB-C Cable (2m)', price: '$12.00', priceNum: 12.0 },
    { id: '3', name: 'Phone Case', price: '$18.00', priceNum: 18.0 },
  ],
  subtotal = '$109.00',
  tax = '$9.81',
  total = '$118.81',
  status = 'active', // 'active' | 'purchased' | 'empty'
  discount = null,
} = {}) {
  if (status === 'purchased') {
    return `
      <div class="ds-generative-card" data-slot="generative-card">
        <h3 class="ds-gen-cart-card__title">Your cart</h3>
        <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
          <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
            ${CHECK_ICON}
            <strong>Order confirmed!</strong>
          </div>
          <span class="ds-text-xs ds-text-secondary">Order #ORD-88219 has been placed.</span>
        </div>
      </div>
    `;
  }

  if (items.length === 0 || status === 'empty') {
    return `
      <div class="ds-generative-card" data-slot="generative-card">
        <h3 class="ds-gen-cart-card__title">Your cart</h3>
        <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
          <span class="ds-text-xs ds-text-secondary">Your cart is empty.</span>
          <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2">
            Continue shopping
          </button>
        </div>
      </div>
    `;
  }

  const itemsHtml = items
    .map(
      (it) => `
    <div class="ds-gen-cart-card__item" data-item-id="${it.id}">
      <span class="ds-gen-cart-card__item-name">${it.name}</span>
      <div class="ds-flex ds-items-center ds-gap-2">
        <span class="ds-gen-cart-card__item-price">${it.price}</span>
        <button type="button" class="ds-button ds-button--ghost ds-button--xs ds-text-secondary" data-action="remove-item" data-id="${it.id}" aria-label="Remove ${it.name}">
          ${TRASH_ICON}
        </button>
      </div>
    </div>
  `
    )
    .join('');

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <h3 class="ds-gen-cart-card__title">Your cart</h3>
        <span class="ds-badge ds-badge--subtle ds-badge--sm" data-slot="count-badge">${items.length} items</span>
      </div>

      <div class="ds-gen-cart-card__items" data-slot="items-container">
        ${itemsHtml}
      </div>

      <div class="ds-gen-cart-card__divider"></div>

      <div class="ds-gen-cart-card__totals">
        <div class="ds-gen-cart-card__total-group">
          <span class="ds-gen-cart-card__total-label">Subtotal</span>
          <span class="ds-gen-cart-card__total-sub" data-slot="subtotal">${subtotal}</span>
        </div>
        ${
          discount
            ? `
          <div class="ds-gen-cart-card__total-group">
            <span class="ds-gen-cart-card__total-label">Discount (${discount.code})</span>
            <span class="ds-gen-cart-card__total-sub ds-text-success">-${discount.amount}</span>
          </div>
        `
            : ''
        }
        <div class="ds-gen-cart-card__total-group">
          <span class="ds-gen-cart-card__total-label">Tax</span>
          <span class="ds-gen-cart-card__total-sub" data-slot="tax">${tax}</span>
        </div>
        <div class="ds-gen-cart-card__total-group">
          <span class="ds-gen-cart-card__total-label">Total</span>
          <span class="ds-gen-cart-card__total-final" data-slot="total">${total}</span>
        </div>
      </div>

      <div class="ds-gen-cart-card__actions" data-slot="actions">
        <button type="button" class="ds-button ds-button--ghost ds-button--sm" data-action="save">Save for later</button>
        <button type="button" class="ds-button ds-button--primary ds-button--sm" data-action="purchase">Purchase</button>
      </div>
    </div>
  `;
}

function attachCartHandler(root) {
  const purchaseBtn = root.querySelector('[data-action="purchase"]');
  const card = root.querySelector('[data-slot="generative-card"]');
  if (!purchaseBtn || !card) return;

  purchaseBtn.addEventListener('click', () => {
    card.innerHTML = `
      <h3 class="ds-gen-cart-card__title">Your cart</h3>
      <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
        <div class="ds-flex ds-items-center ds-gap-2 ds-text-success ds-text-sm">
          ${CHECK_ICON}
          <strong>Order confirmed!</strong>
        </div>
        <span class="ds-text-xs ds-text-secondary">Order #ORD-88219 has been placed.</span>
      </div>
    `;
  });

  root.querySelectorAll('[data-action="remove-item"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const itemEl = root.querySelector(`[data-item-id="${id}"]`);
      if (itemEl) itemEl.remove();

      const remaining = root.querySelectorAll('.ds-gen-cart-card__item');
      const badge = root.querySelector('[data-slot="count-badge"]');
      if (badge) badge.textContent = `${remaining.length} items`;

      if (remaining.length === 0) {
        card.innerHTML = `
          <h3 class="ds-gen-cart-card__title">Your cart</h3>
          <div class="ds-flex ds-flex-col ds-items-center ds-justify-center ds-py-6 ds-gap-2">
            <span class="ds-text-xs ds-text-secondary">Your cart is empty.</span>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-2">
              Continue shopping
            </button>
          </div>
        `;
      }
    });
  });
}

export const Default = story(
  () => stage(renderCartCard()),
  { postRender: attachCartHandler }
);

export const Empty = story(() =>
  stage(
    renderCartCard({
      items: [],
      status: 'empty',
    })
  )
);

export const DiscountApplied = story(() =>
  stage(
    renderCartCard({
      discount: { code: 'PROMO15', amount: '$15.00' },
      total: '$103.81',
    })
  )
);

export const LongList = story(() =>
  stage(
    renderCartCard({
      items: [
        { id: '1', name: 'Mechanical Keyboard (Tenkeyless, Brown Switches)', price: '$129.00' },
        { id: '2', name: 'Ergonomic Vertical Mouse (Wireless)', price: '$65.00' },
        { id: '3', name: 'USB-C Dual 4K Display Adapter Hub', price: '$49.00' },
        { id: '4', name: 'Braided Nylon Thunderbolt 4 Cable (1.8m)', price: '$29.00' },
        { id: '5', name: 'Desk Pad (Felt & Vegan Leather, 90x40cm)', price: '$35.00' },
      ],
      subtotal: '$307.00',
      tax: '$27.63',
      total: '$334.63',
    })
  )
);
