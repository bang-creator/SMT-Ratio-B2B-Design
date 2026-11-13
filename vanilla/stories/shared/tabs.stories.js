import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Shared / Tabs',
  parameters: { layout: 'padded' },
};

export const Default = story(
  'Default / Shared / Tabs / Default',
  stage(
    'Underline Tabs (Platform Standard)',
    `<div class="ds-stack">
      <div class="ds-tabs" data-ds-tabs role="tablist" aria-label="Storage sections">
        <div class="ds-tabs__indicator"></div>
        <button class="ds-tab" role="tab" aria-selected="true" data-state="on" data-panel="tab-files" id="tab-btn-files" aria-controls="tab-files">
          <span class="ds-tab__content">Files</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-vectors" id="tab-btn-vectors" aria-controls="tab-vectors">
          <span class="ds-tab__content">Vector stores</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-skills" id="tab-btn-skills" aria-controls="tab-skills">
          <span class="ds-tab__content">Skills</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-archives" id="tab-btn-archives" aria-controls="tab-archives" disabled data-disabled>
          <span class="ds-tab__content">Archives (Disabled)</span>
        </button>
      </div>
      <div class="ds-tabpanel" id="tab-files" role="tabpanel" aria-labelledby="tab-btn-files">
        <p class="ds-text">Files content: Manage datasets, documents, and upload artifacts for fine-tuning and retrieval.</p>
      </div>
      <div class="ds-tabpanel" id="tab-vectors" role="tabpanel" aria-labelledby="tab-btn-vectors" hidden>
        <p class="ds-text">Vector stores content: Semantic search indices configured for assistants and file search tools.</p>
      </div>
      <div class="ds-tabpanel" id="tab-skills" role="tabpanel" aria-labelledby="tab-btn-skills" hidden>
        <p class="ds-text">Skills content: Custom agent tool integrations and function definitions.</p>
      </div>
      <div class="ds-tabpanel" id="tab-archives" role="tabpanel" aria-labelledby="tab-btn-archives" hidden>
        <p class="ds-text">Archives content: Historical records.</p>
      </div>
    </div>`
  )
);

export const WithIcons = story(
  'Default / Shared / Tabs / With Icons',
  stage(
    'Tabs with Icons',
    `<div class="ds-stack">
      <div class="ds-tabs" data-ds-tabs role="tablist" aria-label="Resources">
        <div class="ds-tabs__indicator"></div>
        <button class="ds-tab" role="tab" aria-selected="true" data-state="on" data-panel="tab-icon-files" id="tab-btn-icon-files" aria-controls="tab-icon-files">
          <span class="ds-tab__content">
            <svg class="ds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Files</span>
          </span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-icon-vectors" id="tab-btn-icon-vectors" aria-controls="tab-icon-vectors">
          <span class="ds-tab__content">
            <svg class="ds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            <span>Vector stores</span>
          </span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-icon-skills" id="tab-btn-icon-skills" aria-controls="tab-icon-skills">
          <span class="ds-tab__content">
            <svg class="ds-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            <span>Skills</span>
          </span>
        </button>
      </div>
      <div class="ds-tabpanel" id="tab-icon-files" role="tabpanel" aria-labelledby="tab-btn-icon-files">
        <p class="ds-text">Files tab active.</p>
      </div>
      <div class="ds-tabpanel" id="tab-icon-vectors" role="tabpanel" aria-labelledby="tab-btn-icon-vectors" hidden>
        <p class="ds-text">Vector stores tab active.</p>
      </div>
      <div class="ds-tabpanel" id="tab-icon-skills" role="tabpanel" aria-labelledby="tab-btn-icon-skills" hidden>
        <p class="ds-text">Skills tab active.</p>
      </div>
    </div>`
  )
);

export const WithBadges = story(
  'Default / Shared / Tabs / With Badges',
  stage(
    'Tabs with Count Badges',
    `<div class="ds-stack">
      <div class="ds-tabs" data-ds-tabs role="tablist" aria-label="Usage metrics">
        <div class="ds-tabs__indicator"></div>
        <button class="ds-tab" role="tab" aria-selected="true" data-state="on" data-panel="tab-badge-requests" id="tab-btn-requests" aria-controls="tab-badge-requests">
          <span class="ds-tab__content">
            <span>Requests</span>
            <span class="ds-badge">1.2M</span>
          </span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-badge-tokens" id="tab-btn-tokens" aria-controls="tab-badge-tokens">
          <span class="ds-tab__content">
            <span>Tokens</span>
            <span class="ds-badge">84.5M</span>
          </span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-badge-errors" id="tab-btn-errors" aria-controls="tab-badge-errors">
          <span class="ds-tab__content">
            <span>Errors</span>
            <span class="ds-badge">0</span>
          </span>
        </button>
      </div>
      <div class="ds-tabpanel" id="tab-badge-requests" role="tabpanel" aria-labelledby="tab-btn-requests">
        <p class="ds-text">Request volume: 1,248,390 API calls across all models in the selected billing period.</p>
      </div>
      <div class="ds-tabpanel" id="tab-badge-tokens" role="tabpanel" aria-labelledby="tab-btn-tokens" hidden>
        <p class="ds-text">Token usage: 84,520,110 tokens (Prompt: 62.1M, Completion: 22.4M).</p>
      </div>
      <div class="ds-tabpanel" id="tab-badge-errors" role="tabpanel" aria-labelledby="tab-btn-errors" hidden>
        <p class="ds-text">Error rate: 0.00% system availability.</p>
      </div>
    </div>`
  )
);

export const Block = story(
  'Default / Shared / Tabs / Block',
  stage(
    'Full Width (Block)',
    `<div class="ds-stack">
      <div class="ds-tabs ds-tabs--block" data-ds-tabs data-block="true" role="tablist" aria-label="Editor views">
        <div class="ds-tabs__indicator"></div>
        <button class="ds-tab" role="tab" aria-selected="true" data-state="on" data-panel="tab-block-code" id="tab-btn-code" aria-controls="tab-block-code">
          <span class="ds-tab__content">Code</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-block-preview" id="tab-btn-preview" aria-controls="tab-block-preview">
          <span class="ds-tab__content">Preview</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-block-console" id="tab-btn-console" aria-controls="tab-block-console">
          <span class="ds-tab__content">Console</span>
        </button>
      </div>
      <div class="ds-tabpanel" id="tab-block-code" role="tabpanel" aria-labelledby="tab-btn-code">
        <p class="ds-text">Source code editor pane.</p>
      </div>
      <div class="ds-tabpanel" id="tab-block-preview" role="tabpanel" aria-labelledby="tab-btn-preview" hidden>
        <p class="ds-text">Live output preview pane.</p>
      </div>
      <div class="ds-tabpanel" id="tab-block-console" role="tabpanel" aria-labelledby="tab-btn-console" hidden>
        <p class="ds-text">Execution console and diagnostics.</p>
      </div>
    </div>`
  )
);

export const UsageOverview = story(
  'Default / Shared / Tabs / Usage Overview',
  stage(
    'Multi-Tab Bar (Platform Usage)',
    `<div class="ds-stack">
      <div class="ds-tabs" data-ds-tabs role="tablist" aria-label="Usage categories">
        <div class="ds-tabs__indicator"></div>
        <button class="ds-tab" role="tab" aria-selected="true" data-state="on" data-panel="tab-usage-capabilities" id="tab-btn-capabilities" aria-controls="tab-usage-capabilities">
          <span class="ds-tab__content">API capabilities</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-usage-spend" id="tab-btn-spend" aria-controls="tab-usage-spend">
          <span class="ds-tab__content">Spend categories</span>
        </button>
        <button class="ds-tab" role="tab" aria-selected="false" data-state="off" data-panel="tab-usage-rate-limits" id="tab-btn-ratelimits" aria-controls="tab-usage-rate-limits">
          <span class="ds-tab__content">Rate limits</span>
        </button>
      </div>
      <div class="ds-tabpanel" id="tab-usage-capabilities" role="tabpanel" aria-labelledby="tab-btn-capabilities">
        <p class="ds-text">API capabilities usage breakdown: Chat completions, Embeddings, Audio, Images.</p>
      </div>
      <div class="ds-tabpanel" id="tab-usage-spend" role="tabpanel" aria-labelledby="tab-btn-spend" hidden>
        <p class="ds-text">Spend categories: Daily billing, commitment tracking, credit balance.</p>
      </div>
      <div class="ds-tabpanel" id="tab-usage-rate-limits" role="tabpanel" aria-labelledby="tab-btn-ratelimits" hidden>
        <p class="ds-text">Rate limits: TPM (Tokens per minute), RPM (Requests per minute) allocations.</p>
      </div>
    </div>`
  )
);
