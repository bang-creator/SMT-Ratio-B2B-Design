import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 16 Speaker Identity',
  parameters: { layout: 'padded' },
};

const USER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const BOT_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>`;
const TOOL_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;

const DEFAULT_TURNS = [
  { id: '1', kind: 'user', name: 'You', text: 'Why is the draft map per-thread instead of per-composer?' },
  { id: '2', kind: 'agent', name: 'Assistant', detail: 'claude-3-7-sonnet', text: 'Because threads swap underneath a single composer instance; keying the draft by thread id lets each thread remember its own unsent words.' },
  { id: '3', kind: 'subagent', name: 'Draft Store', detail: 'in-memory', text: 'Hydrated slot thread_2814 with 114 characters.' },
  { id: '4', kind: 'tool', name: 'read_thread_state', detail: '0.4ms', text: '{"activeThreadId":"thread_2814","draftCount":3}' },
];

const TWO_SPEAKERS = [
  { id: '1', kind: 'user', name: 'You', text: 'Summarize the open issues tagged runtime.' },
  { id: '2', kind: 'agent', name: 'Assistant', text: 'There are 14 open. Most are about remote thread list sync.' },
];

const LONG_TURNS = [
  {
    id: '1',
    kind: 'user',
    name: 'Platform Engineering Lead for Edge Deployments',
    detail: 'organization_admin',
    text: 'We run a remote thread list backed by Postgres and users switch threads constantly on mobile. How do I persist composer drafts across threads so a half-written message survives a reload, a thread switch, and a dropped connection?',
  },
  {
    id: '2',
    kind: 'agent',
    name: 'Assistant',
    detail: 'claude-3-7-sonnet',
    text: 'Key the draft by thread id inside the runtime, hydrate the composer when a thread becomes active, and drop the entry after the message sends. If you need it to survive reloads, sync that map to local storage.',
  },
  {
    id: '3',
    kind: 'tool',
    name: 'fetch_remote_thread_inventory_with_retry_and_exponential_backoff',
    detail: '241ms',
    text: 'https://api.example.com/v2/organizations/org_9918/projects/proj_8817/threads?limit=100',
  },
];

const MODES = [DEFAULT_TURNS, TWO_SPEAKERS, LONG_TURNS];

function renderSpeakerIdentity({ turns = DEFAULT_TURNS } = {}) {
  const turnsHtml = turns
    .map((turn) => {
      const avatarCls = `ds-speaker-avatar ds-speaker-avatar--${turn.kind}`;
      const icon = turn.kind === 'user' ? USER_ICON : turn.kind === 'tool' ? TOOL_ICON : BOT_ICON;

      return `
        <div class="ds-speaker-turn flex gap-2.5">
          <span class="${avatarCls} flex size-6 shrink-0 items-center justify-center rounded-lg ${turn.kind === 'subagent' ? 'rounded-full' : ''}">
            ${icon}
          </span>
          <div class="ds-speaker-content flex min-w-0 flex-1 flex-col gap-0.5">
            <div class="ds-speaker-header flex items-baseline gap-1.5">
              <span class="ds-speaker-name text-[13px] font-medium leading-none">${turn.name}</span>
              ${turn.detail ? `<span class="ds-speaker-detail font-mono text-[11px] leading-none">${turn.detail}</span>` : ''}
            </div>
            <p class="ds-speaker-text text-[13.5px] leading-relaxed break-words">${turn.text}</p>
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="speaker-identity" class="ds-speaker-identity flex w-full max-w-sm flex-col gap-3.5" title="Click to cycle speaker turns">
      ${turnsHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Speaker Identity
 * Displays user, assistant, subagent, and tool speaker turns with distinct semantic tokens and avatars.
 * Clicking cycles through conversation complexity modes.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let modeIdx = 0;

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-speaker-target">
          ${renderSpeakerIdentity({ turns: MODES[modeIdx] })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-speaker-target');

    target.addEventListener('click', () => {
      modeIdx = (modeIdx + 1) % MODES.length;
      target.innerHTML = renderSpeakerIdentity({ turns: MODES[modeIdx] });
    });

    return root;
  },
};

/**
 * TwoSpeakers: Simple dialogue
 */
export const TwoSpeakers = story(
  'Default / Application / 16 Speaker Identity / Two Speakers',
  stage('Two Speakers', renderSpeakerIdentity({ turns: TWO_SPEAKERS }))
);

/**
 * LongTurns: Deep enterprise thread with admin roles and tool payloads
 */
export const LongTurns = story(
  'Default / Application / 16 Speaker Identity / Long Turns',
  stage('Long Turns', renderSpeakerIdentity({ turns: LONG_TURNS }))
);
