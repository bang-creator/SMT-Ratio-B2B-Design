import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 132 Order tracking AUI',
  parameters: { layout: 'padded' },
};

function renderOrderStatusCard({
  orderNo = '48213',
  tracking = 'TRK-982318',
  status = 'in-transit', // 'processing' | 'in-transit' | 'delivered' | 'delayed'
} = {}) {
  let headerBadge = '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--active">In transit</span>';
  let bannerTitle = 'Order confirmed';
  let bannerDesc = 'Your package is on its way and scheduled for delivery today.';

  if (status === 'delivered') {
    headerBadge = '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--success">Delivered</span>';
    bannerTitle = 'Package delivered';
    bannerDesc = 'Left at front door. Handed directly to resident.';
  } else if (status === 'delayed') {
    headerBadge = '<span class="ds-gen-order-card__badge ds-text-danger ds-bg-surface-secondary">Delayed</span>';
    bannerTitle = 'Weather delay';
    bannerDesc = 'Severe conditions in transit hub. New delivery date: Tomorrow.';
  } else if (status === 'processing') {
    headerBadge = '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--pending">Processing</span>';
    bannerTitle = 'Packing your items';
    bannerDesc = 'Our fulfillment center is preparing your shipment.';
  }

  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-gen-order-card__header">
        <h3 class="ds-gen-order-card__title">Order No. ${orderNo}</h3>
        ${headerBadge}
      </div>

      <div class="ds-gen-order-card__banner">
        <div class="ds-gen-order-card__banner-title">${bannerTitle}</div>
        <div class="ds-gen-order-card__banner-desc">${bannerDesc}</div>
      </div>

      <div class="ds-gen-order-card__timeline">
        <div class="ds-gen-order-card__step">
          <div class="ds-gen-order-card__step-info">
            <span class="ds-gen-order-card__step-name">Order placed</span>
            <span class="ds-gen-order-card__step-time">Today at 9:02 AM</span>
          </div>
          <span class="ds-gen-order-card__badge ds-gen-order-card__badge--success">Done</span>
        </div>

        <div class="ds-gen-order-card__step">
          <div class="ds-gen-order-card__step-info">
            <span class="ds-gen-order-card__step-name">Shipped with courier</span>
            <span class="ds-gen-order-card__step-time">Today at 1:15 PM</span>
          </div>
          ${
            status === 'processing'
              ? '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--pending">Pending</span>'
              : '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--success">Done</span>'
          }
        </div>

        <div class="ds-gen-order-card__step">
          <div class="ds-gen-order-card__step-info">
            <span class="ds-gen-order-card__step-name ${status === 'delivered' ? '' : 'ds-gen-order-card__step-name--pending'}">Out for delivery</span>
            <span class="ds-gen-order-card__step-time">${status === 'delivered' ? 'Delivered at 4:15 PM' : 'Estimated 5:30 PM'}</span>
          </div>
          ${
            status === 'delivered'
              ? '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--success">Done</span>'
              : status === 'delayed'
                ? '<span class="ds-gen-order-card__badge ds-text-danger ds-bg-surface-secondary">Delayed</span>'
                : status === 'in-transit'
                  ? '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--active">In transit</span>'
                  : '<span class="ds-gen-order-card__badge ds-gen-order-card__badge--pending">Pending</span>'
          }
        </div>
      </div>

      <div class="ds-gen-order-card__footer">
        <span>Tracking: ${tracking}</span>
        <button type="button" class="ds-button ds-button--secondary ds-button--sm" data-action="track-btn">
          Track package
        </button>
      </div>

      <div class="ds-hidden ds-p-3 ds-bg-surface-secondary ds-rounded-lg ds-text-xs ds-text-secondary" data-slot="tracking-details">
        Courier: FedEx Express · Driver location: 1.2 miles away · Stop 4 of 12
      </div>
    </div>
  `;
}

function attachTrackingHandler(root) {
  const btn = root.querySelector('[data-action="track-btn"]');
  const details = root.querySelector('[data-slot="tracking-details"]');
  if (btn && details) {
    btn.addEventListener('click', () => {
      details.classList.toggle('ds-hidden');
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderOrderStatusCard({ status: 'in-transit' });
    attachTrackingHandler(root);
    return root;
  },
};

export const Delivered = story(
  () => renderOrderStatusCard({ status: 'delivered' })
);

export const Delayed = story(
  () => renderOrderStatusCard({ status: 'delayed' })
);

export const Processing = story(
  () => renderOrderStatusCard({ status: 'processing' })
);
