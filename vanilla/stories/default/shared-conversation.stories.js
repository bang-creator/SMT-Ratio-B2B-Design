import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 93 Shared conversation',
  parameters: { layout: 'padded' },
};

const LINK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;

const DEFAULT_TURNS = [
  { id: '1', role: 'user', text: 'Why are JWT tokens expiring early after 15 minutes instead of 2 hours?' },
  { id: '2', role: 'assistant', text: 'The clock skew tolerance was set to 0s in the gateway verification middleware.' },
];

const LONG_TURNS = [
  {
    id: '1',
    role: 'user',
    text: 'Why did the draft survive the thread switch, and why only on remote threads loaded after a reload?',
  },
  {
    id: '2',
    role: 'assistant',
    text: 'The composer read a slot keyed by the old thread id. Remote threads get their id after the list hydrates, so for one render the composer still pointed at the previous slot and copied its text forward.',
  },
  {
    id: '3',
    role: 'user',
    text: 'So clearing the slot on switch is enough?',
  },
  {
    id: '4',
    role: 'assistant',
    text: 'Clearing it fixes the symptom. Keying the slot by the remote id once it resolves fixes the cause, and a regression test covers the reload path.',
  },
];

function renderSharedConversation({
  title = 'Debugging Auth Token Expiration',
  sharedBy = 'harry',
  sharedAt = 'just now',
  turns = DEFAULT_TURNS,
} = {}) {
  return `
    <div data-slot="shared-conversation" class="ds-shared-conv">
      <div data-slot="shared-conversation-header" class="ds-shared-conv__header">
        <span class="ds-shared-conv__icon" aria-hidden="true">${LINK_ICON}</span>
        <div class="ds-shared-conv__title-wrap">
          <span class="ds-shared-conv__title" title="${title}">${title}</span>
          <span class="ds-shared-conv__meta">shared by ${sharedBy} · ${sharedAt}</span>
        </div>
      </div>

      <div data-slot="shared-conversation-turns" class="ds-shared-conv__turns">
        ${
          turns.length > 0
            ? turns
                .map(
                  (turn) => `
              <div
                data-slot="shared-conversation-message"
                data-speaker="${turn.role}"
                class="ds-shared-conv__msg"
              >
                ${turn.text}
              </div>
            `,
                )
                .join('')
            : '<div class="ds-text-xs ds-text-secondary ds-py-2 ds-text-center">No messages in this shared link yet.</div>'
        }
      </div>

      <div data-slot="shared-conversation-footer" class="ds-shared-conv__footer">
        <span class="ds-shared-conv__readonly" data-slot="readonly-badge">read only</span>
        <button
          type="button"
          class="ds-shared-conv__continue-btn"
          data-slot="continue-btn"
        >
          Continue in your own chat
        </button>
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let continued = false;

    const render = () => {
      let bodyHtml = '';
      let badgeText = continued ? 'Forked to Personal' : 'Shared Link (Read-Only)';

      if (continued) {
        bodyHtml = `
          <div data-slot="shared-conversation" class="ds-shared-conv ds-p-4">
            <span class="ds-font-medium ds-text-sm" data-slot="forked-status">Forked to your personal workspace</span>
            <span class="ds-text-secondary ds-text-xs ds-mt-1 ds-block">All turns have been imported. You can now compose replies.</span>
            <button type="button" class="ds-button ds-button--secondary ds-button--sm ds-mt-3" data-slot="reset-fork">
              Reset to read only
            </button>
          </div>
        `;
      } else {
        bodyHtml = renderSharedConversation({
          title: 'Debugging Auth Token Expiration',
          sharedBy: 'harry',
          sharedAt: 'just now',
          turns: DEFAULT_TURNS,
        });
      }

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${bodyHtml}
          </div>
        </div>
      `;

      root.querySelector('[data-slot="continue-btn"]')?.addEventListener('click', () => {
        continued = true;
        render();
      });

      root.querySelector('[data-slot="reset-fork"]')?.addEventListener('click', () => {
        continued = false;
        render();
      });
    };

    render();
    return root;
  },
};

export const Empty = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderSharedConversation({
        title: 'Untitled conversation',
        sharedBy: 'harry',
        sharedAt: 'just now',
        turns: [],
      })}
    </div>
  </div>
`);

export const SingleTurn = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderSharedConversation({
        title: 'Converter drops empty parts',
        sharedBy: 'simon',
        sharedAt: '5 minutes ago',
        turns: [
          {
            id: '1',
            role: 'user',
            text: 'Why does the converter drop tool calls with an empty args object?',
          },
        ],
      })}
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderSharedConversation({
        title: 'Draft restore across threads after a reload on remote thread lists',
        sharedBy: 'harry.mitchell@assistant-ui.com',
        sharedAt: 'Oct 28, 2026',
        turns: LONG_TURNS,
      })}
    </div>
  </div>
`);
