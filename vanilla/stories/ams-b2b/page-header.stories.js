import { story, stage } from '../story-helpers.js';

export default {
  title: 'AMS B2B / Application / Page Header',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'AMS B2B / Application / Page Header / Default',
  stage(
    'AMS B2B Enterprise Page Header',
    `<header class="ds-page__header ds-brand-ams-b2b">
      <div class="ds-stack">
        <h1>Enterprise Access & Compliance</h1>
        <p class="ds-muted">Manage tenant isolation, data residency, and audit logs.</p>
      </div>
      <div class="ds-row">
        <button class="ds-button ds-button--secondary" type="button">Audit Log</button>
        <button class="ds-button ds-button--primary" type="button">Export Compliance Report</button>
      </div>
    </header>`
  )
);

export const WithBreadcrumb = story(
  'AMS B2B / Application / Page Header / With Breadcrumb',
  stage(
    'Enterprise Header with Hierarchy',
    `<header class="ds-page__header ds-brand-ams-b2b">
      <div class="ds-stack">
        <nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#">Organization</a>
          <span aria-hidden="true">/</span>
          <a href="#">Tenants</a>
          <span aria-hidden="true">/</span>
          <strong aria-current="page">Dedicated Instances</strong>
        </nav>
        <h1>Dedicated Instances</h1>
        <p class="ds-muted">Isolated model serving infrastructure with dedicated throughput quotas.</p>
      </div>
      <button class="ds-button ds-button--primary" type="button">Provision Instance</button>
    </header>`
  )
);
