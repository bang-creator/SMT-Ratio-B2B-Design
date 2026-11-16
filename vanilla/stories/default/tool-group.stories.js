import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 114 Tool group AUI',
  parameters: { layout: 'padded' },
};

const CHEVRON_RIGHT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-text-success" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const SPINNER = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-animate-spin ds-text-secondary" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
const X_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-text-danger" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const DEFAULT_TOOLS = [
  { id: '1', name: 'fetch_git_status', target: 'repo: acme/web', status: 'done', duration: '45ms' },
  { id: '2', name: 'lint_design_tokens', target: 'docs/design-system/tokens.json', status: 'done', duration: '120ms' },
  { id: '3', name: 'build_vanilla_css', target: 'dist/design-system.css', status: 'done', duration: '85ms' },
];

function renderToolGroup({
  label = '',
  tools = DEFAULT_TOOLS,
  open = true,
  interactive = false,
} = {}) {
  const runningCount = tools.filter((t) => t.status === 'running').length;
  const failedCount = tools.filter((t) => t.status === 'failed').length;

  const displayLabel = label || (tools.length === 1 ? 'Ran 1 tool' : `Ran ${tools.length} tools`);

  let summaryText = '';
  let statusIcon = '';
  if (runningCount > 0) {
    summaryText = `${tools.length - runningCount}/${tools.length}`;
    statusIcon = SPINNER;
  } else if (failedCount > 0) {
    summaryText = `${failedCount} failed`;
    statusIcon = X_ICON;
  } else {
    summaryText = `${tools.length} done`;
    statusIcon = CHECK_ICON;
  }

  return `
    <div
      data-slot="tool-group"
      class="ds-tool-group-card"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      <button
        type="button"
        class="ds-tool-group__trigger"
        data-action="toggle-group"
        aria-expanded="${open ? 'true' : 'false'}"
      >
        <span class="ds-tool-group__chevron ${open ? 'is-expanded' : ''}" data-slot="chevron">
          ${CHEVRON_RIGHT}
        </span>
        <span class="ds-tool-group__title" data-slot="group-title">${displayLabel}</span>
        <span class="ds-tool-group__summary" data-slot="group-summary">${summaryText}</span>
        <span class="ds-flex ds-items-center" data-slot="group-status-icon">
          ${statusIcon}
        </span>
      </button>

      <div class="ds-tool-group__content ${!open ? 'is-closed' : ''}" data-slot="group-content">
        ${tools
          .map((t) => {
            const icon = t.status === 'running' ? SPINNER : t.status === 'failed' ? X_ICON : CHECK_ICON;
            return `
            <div class="ds-tool-group-item" data-tool-id="${t.id}" data-status="${t.status}">
              <span class="ds-tool-group-item__icon">${icon}</span>
              <span class="ds-tool-group-item__name">${t.name}</span>
              <span class="ds-tool-group-item__target" title="${t.target}">${t.target}</span>
              ${
                t.duration
                  ? `<span class="ds-tool-group-item__duration">${t.duration}</span>`
                  : ''
              }
            </div>
          `;
          })
          .join('')}
      </div>
    </div>
  `;
}

function attachToolGroupInteractivity(root) {
  const cards = root.querySelectorAll('[data-slot="tool-group"]');
  cards.forEach((card) => {
    const trigger = card.querySelector('[data-action="toggle-group"]');
    const chevron = card.querySelector('[data-slot="chevron"]');
    const content = card.querySelector('[data-slot="group-content"]');

    if (trigger && chevron && content) {
      trigger.addEventListener('click', () => {
        const isExp = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', isExp ? 'false' : 'true');
        chevron.classList.toggle('is-expanded', !isExp);
        content.classList.toggle('is-closed', isExp);
      });
    }
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderToolGroup({ open: true, interactive: true });
    attachToolGroupInteractivity(root);
    return root;
  },
};

export const Running = story(
  () => renderToolGroup({
    open: true,
    tools: [
      { id: '1', name: 'get_weather', target: 'location: Paris', status: 'done', duration: '120ms' },
      { id: '2', name: 'get_weather', target: 'location: Berlin', status: 'done', duration: '95ms' },
      { id: '3', name: 'search_web', target: 'query: Paris vs Berlin weather this week', status: 'running' },
    ],
  })
);

export const Partial = story(
  () => renderToolGroup({
    open: true,
    tools: [
      { id: '1', name: 'get_weather', target: 'location: Paris', status: 'done', duration: '110ms' },
      { id: '2', name: 'get_weather', target: 'location: Reykjavik (timed out)', status: 'failed', duration: '10000ms' },
      { id: '3', name: 'get_weather', target: 'location: Berlin', status: 'done', duration: '85ms' },
    ],
  })
);

export const Single = story(
  () => renderToolGroup({
    open: true,
    tools: [
      { id: '1', name: 'get_weather', target: 'location: Paris', status: 'done', duration: '110ms' },
    ],
  })
);

export const LongContent = story(
  () => renderToolGroup({
    open: true,
    tools: [
      { id: '1', name: 'read_file', target: 'src/app/page.tsx', status: 'done', duration: '12ms' },
      { id: '2', name: 'read_file', target: 'src/app/layout.tsx', status: 'done', duration: '10ms' },
      { id: '3', name: 'read_file', target: 'src/components/header.tsx', status: 'done', duration: '15ms' },
      { id: '4', name: 'read_file', target: 'src/components/footer.tsx', status: 'done', duration: '8ms' },
      { id: '5', name: 'read_file', target: 'src/lib/auth.ts', status: 'done', duration: '20ms' },
      { id: '6', name: 'read_file', target: 'src/lib/db.ts', status: 'done', duration: '18ms' },
      { id: '7', name: 'read_file', target: 'src/lib/stripe.ts', status: 'done', duration: '14ms' },
      { id: '8', name: 'read_file', target: 'package.json', status: 'done', duration: '5ms' },
    ],
  })
);
