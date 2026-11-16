import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 121 Directive text AUI',
  parameters: { layout: 'padded' },
};

const USER_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const FILE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
const TOOL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
const COMMAND_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="7" y1="21" x2="17" y2="3"></line></svg>`;

function chip(type, label, icon = true) {
  let iconSvg = '';
  if (icon) {
    if (type === 'user') iconSvg = USER_ICON;
    else if (type === 'file') iconSvg = FILE_ICON;
    else if (type === 'command') iconSvg = COMMAND_ICON;
    else iconSvg = TOOL_ICON;
  }
  return `<span class="ds-directive-chip" data-slot="directive-text-chip" data-directive-type="${type}" aria-label="${type}: ${label}">${iconSvg ? iconSvg : ''}<span>${label}</span></span>`;
}

function renderBubble(content) {
  return `
    <div class="ds-flex ds-w-100 ds-max-w-md ds-justify-end" data-slot="bubble-wrap">
      <div class="ds-msg-timing-fixture__bubble--user ds-w-100" data-slot="user-bubble">
        <div class="ds-font-normal ds-text-sm ds-m-0">
          ${content}
        </div>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderBubble(
      `Ask ${chip('user', 'Priya Shah')} to review ${chip('file', 'pricing.md')} and then run ${chip('command', 'summarize')}.`
    );
    return root;
  },
};

export const PlainText = story(
  () => renderBubble("What's the weather in Tokyo this weekend?")
);

export const MixedTypes = story(
  () => renderBubble(
    `Ask ${chip('user', 'Priya Shah')} to review ${chip('file', 'pricing.md')} and then run ${chip('command', 'summarize')}.`
  )
);

export const NoIcons = story(
  () => renderBubble(
    `Use ${chip('tool', 'Get Weather', false)} and ${chip('tool', 'Search', false)} for this.`
  )
);

export const Partial = story(
  () => renderBubble(
    `Use ${chip('tool', 'Get Weather')} and then :tool[Sea`
  )
);

export const LongContent = story(
  () => renderBubble(
    `Compare ${chip('file', '2026 enterprise pricing and packaging proposal.md')} with ${chip('file', 'competitor teardown, October.pdf')} and flag gaps for ${chip('user', 'Alexandra Montgomery-Whitfield')}.`
  )
);
