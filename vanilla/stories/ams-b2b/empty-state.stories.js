import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Empty State',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Empty State / Default',
  stage(
    'AMS B2B Zero-Tenant State',
    `<div class="ds-empty ds-brand-ams-b2b">
      <svg viewBox="0 0 24 24" class="ds-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      <strong>No isolated tenant workspaces configured</strong>
      <p class="ds-muted">Provision an enterprise tenant workspace to isolate data boundaries and assign dedicated throughput.</p>
      <button class="ds-button ds-button--primary" type="button">Provision New Tenant</button>
    </div>`
  )
);
