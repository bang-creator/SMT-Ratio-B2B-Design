import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Card Header',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Card Header / Default',
  stage(
    'AMS B2B Card Header',
    `<div class="ds-card ds-brand-ams-b2b">
      <div class="ds-card-header">
        <div class="ds-stack">
          <h3>Customer Data Boundary</h3>
          <span class="ds-muted">Zero data retention (ZDR) policy enforced</span>
        </div>
        <span class="ds-badge ds-badge--active">ZDR Active</span>
      </div>
      <div class="ds-card__body">
        <p class="ds-muted">Inference inputs and outputs are not stored or used for model training.</p>
      </div>
    </div>`
  )
);
