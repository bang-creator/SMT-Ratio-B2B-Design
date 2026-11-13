import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Section Header',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Section Header / Default',
  stage(
    'AMS B2B Section Header',
    `<div class="ds-section-heading ds-brand-ams-b2b">
      <div class="ds-stack">
        <h2>Tenant Quota Allocation</h2>
        <p class="ds-muted">Committed tokens per minute (TPM) and requests per minute (RPM)</p>
      </div>
    </div>`
  )
);

export const WithAction = story(
  'AMS B2B / Application / Section Header / With Action',
  stage(
    'Section Header with Action',
    `<div class="ds-section-heading ds-brand-ams-b2b">
      <div class="ds-stack">
        <h2>Single Sign-On (SAML / SCIM)</h2>
        <p class="ds-muted">Manage enterprise identity providers and role synchronization</p>
      </div>
      <button class="ds-button ds-button--secondary ds-button--sm" type="button">Configure IdP</button>
    </div>`
  )
);
