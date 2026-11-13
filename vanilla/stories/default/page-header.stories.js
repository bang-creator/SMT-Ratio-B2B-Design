import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Page Header',
  parameters: { layout: 'padded' },
};

/* Source: Page headers on platform.openai.com
 * Ground truth:
 * - Title: 24px/28px (var(--font-size-heading-lg))
 * - Actions: 32px compact buttons on the right */

export const Default = story(
  'Default / Application / Page Header / Default',
  stage(
    'Standard Application Page Header',
    `<header class="ds-page__header">
      <div class="ds-stack">
        <h1>Storage & Files</h1>
        <p class="ds-muted">Manage training datasets, fine-tuning artifacts, and batch input files.</p>
      </div>
      <div class="ds-row">
        <button class="ds-button ds-button--secondary" type="button">Documentation</button>
        <button class="ds-button ds-button--primary" type="button">Upload file</button>
      </div>
    </header>`
  )
);

export const WithBreadcrumb = story(
  'Default / Application / Page Header / With Breadcrumb',
  stage(
    'Page Header with Breadcrumb Hierarchy',
    `<header class="ds-page__header">
      <div class="ds-stack">
        <nav class="ds-breadcrumb" aria-label="Breadcrumb">
          <a href="#">Projects</a>
          <span aria-hidden="true">/</span>
          <a href="#">Production</a>
          <span aria-hidden="true">/</span>
          <strong aria-current="page">API Keys</strong>
        </nav>
        <h1>API Keys</h1>
        <p class="ds-muted">Secret keys allow authentication for programmatic client requests.</p>
      </div>
      <button class="ds-button ds-button--primary" type="button">Create new secret key</button>
    </header>`
  )
);
