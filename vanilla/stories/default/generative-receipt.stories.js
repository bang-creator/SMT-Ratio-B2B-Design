import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 143 Purchase receipt AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const KEYBOARD_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-text-secondary" aria-label="Mechanical Keyboard"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="10" y1="12" x2="10.01" y2="12"></line><line x1="14" y1="12" x2="14.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`;
const HEADPHONES_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-text-secondary" aria-label="Headphones"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path></svg>`;
const CODE_ICON = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ds-text-secondary" aria-label="Software License"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;

function renderReceiptCard({
  itemTitle = 'Mechanical Keyboard, Tactile',
  qty = 'Qty 1',
  delivery = 'July 29 to August 1',
  seller = 'Northwind Supply Co.',
  paid = '$149.00',
  icon = KEYBOARD_ICON,
  status = 'complete', // 'complete' | 'refunded' | 'digital'
  statusLabel = 'Purchase complete',
  detailsExpanded = false,
} = {}) {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-receipt-card__badge-row">
        ${
          status === 'refunded'
            ? `<span class="ds-badge ds-badge--danger ds-badge--sm">Refund issued</span>`
            : `<span class="ds-badge ds-badge--success ds-badge--sm">${CHECK_ICON} ${statusLabel}</span>`
        }
      </div>

      <div class="ds-gen-receipt-card__item">
        <div class="ds-gen-receipt-card__thumb">
          ${icon}
        </div>
        <div class="ds-gen-receipt-card__item-info">
          <span class="ds-gen-receipt-card__item-title">${itemTitle}</span>
          <span class="ds-gen-receipt-card__item-qty">${qty}</span>
        </div>
      </div>

      <div class="ds-gen-receipt-card__divider"></div>

      <div class="ds-gen-receipt-card__details">
        <div class="ds-gen-receipt-card__detail-row">
          <span class="ds-gen-receipt-card__detail-label">Estimated delivery</span>
          <span class="ds-gen-receipt-card__detail-value">${delivery}</span>
        </div>
        <div class="ds-gen-receipt-card__detail-row">
          <span class="ds-gen-receipt-card__detail-label">Sold by</span>
          <span class="ds-gen-receipt-card__detail-value">${seller}</span>
        </div>
        <div class="ds-gen-receipt-card__detail-row">
          <span class="ds-gen-receipt-card__detail-label">Paid</span>
          <span class="ds-gen-receipt-card__detail-value ds-gen-receipt-card__detail-value--paid">${paid}</span>
        </div>
      </div>

      <div class="ds-mt-2" data-slot="expanded-details" ${detailsExpanded ? '' : 'hidden'}>
        <div class="ds-p-3 ds-rounded-md ds-bg-surface-secondary ds-flex ds-flex-col ds-gap-1 ds-text-xs">
          <div class="ds-flex ds-justify-between">
            <span class="ds-text-secondary">Order ID:</span>
            <span>ORD-77401-2026</span>
          </div>
          <div class="ds-flex ds-justify-between">
            <span class="ds-text-secondary">Tracking:</span>
            <span>FDX-99023812</span>
          </div>
          <div class="ds-flex ds-justify-between">
            <span class="ds-text-secondary">Payment:</span>
            <span>Visa ending in 4242</span>
          </div>
        </div>
      </div>

      <div class="ds-mt-2">
        <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-gen-receipt-card__action" data-action="toggle-details">
          ${detailsExpanded ? 'Hide details' : 'View details'}
        </button>
      </div>
    </div>
  `;
}

function attachReceiptHandler(root) {
  const toggleBtn = root.querySelector('[data-action="toggle-details"]');
  const detailsPane = root.querySelector('[data-slot="expanded-details"]');
  if (!toggleBtn || !detailsPane) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = detailsPane.hasAttribute('hidden');
    if (isHidden) {
      detailsPane.removeAttribute('hidden');
      toggleBtn.textContent = 'Hide details';
    } else {
      detailsPane.setAttribute('hidden', '');
      toggleBtn.textContent = 'View details';
    }
  });
}

export const Default = story(
  () => stage(renderReceiptCard()),
  { postRender: attachReceiptHandler }
);

export const Refunded = story(() =>
  stage(
    renderReceiptCard({
      status: 'refunded',
      statusLabel: 'Refund issued',
      delivery: 'Cancelled',
      paid: '$0.00 (Refunded $149.00)',
    })
  )
);

export const DigitalDelivery = story(() =>
  stage(
    renderReceiptCard({
      status: 'complete',
      statusLabel: 'Activated',
      itemTitle: 'Developer Studio Pro — Annual License',
      qty: '1 Seat',
      delivery: 'Instant digital delivery',
      seller: 'OpenAI Developer Platform',
      paid: '$240.00',
      icon: CODE_ICON,
      detailsExpanded: true,
    })
  )
);

export const LongItemName = story(() =>
  stage(
    renderReceiptCard({
      itemTitle: 'Ultra-Wide Custom Bluetooth Mechanical Keyboard (Hot-swappable PBT Keycaps, RGB Backlight, Aerospace Aluminum Frame)',
      qty: 'Qty 2',
      delivery: 'August 12 to August 16',
      seller: 'Mechanical Keyboards Direct Global Logistics Ltd.',
      paid: '$428.00',
      icon: HEADPHONES_ICON,
    })
  )
);
