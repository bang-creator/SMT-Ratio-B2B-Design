import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 108 Conversation map AUI',
  parameters: { layout: 'padded' },
};

const SAMPLE_ENTRIES = [
  {
    id: 'turn-1',
    title: 'Why did the nightly export job fail?',
    preview: 'The job hit the 15 minute Lambda timeout while compressing the March archive.',
    inView: false,
    active: false,
  },
  {
    id: 'turn-2',
    title: 'Can you split the export by month and rerun it?',
    preview: 'Splitting the archive by month keeps each execution safely under four minutes.',
    inView: true,
    active: false,
  },
  {
    id: 'turn-3',
    title: 'Check downstream billing sync pipeline',
    preview: 'Downstream webhooks verified; S3 lifecycle rule transitioned archive to Glacier.',
    inView: true,
    active: true,
  },
  {
    id: 'turn-4',
    title: 'Verify audit log completeness',
    preview: 'Audit log index updated with 2,410 new entry hashes.',
    inView: true,
    active: false,
  },
  {
    id: 'turn-5',
    title: 'Generate summary report for infra team',
    preview: 'Markdown summary prepared with execution graphs and latency breakdown.',
    inView: false,
    active: false,
  },
];

function renderConversationMap({
  entries = SAMPLE_ENTRIES,
  interactive = false,
} = {}) {
  return `
    <nav
      data-slot="conversation-map"
      class="ds-conv-map"
      aria-label="Conversation map"
      ${interactive ? 'data-interactive="true"' : ''}
    >
      ${entries
        .map(
          (e, idx) => `
        <button
          type="button"
          data-slot="conversation-map-tick"
          data-id="${e.id}"
          data-index="${idx}"
          ${e.active ? 'data-active=""' : ''}
          ${e.inView ? 'data-in-view=""' : ''}
          aria-label="${e.title}"
          ${e.active ? 'aria-current="true"' : ''}
          tabindex="${e.active || idx === 0 ? '0' : '-1'}"
          class="ds-conv-map__tick"
        >
          <span class="ds-conv-map__bar"></span>
        </button>
      `,
        )
        .join('')}

      <div class="ds-conv-map__popup" data-slot="conversation-map-popup" aria-hidden="true">
        <div class="ds-conv-map__popup-title" data-slot="popup-title"></div>
        <div class="ds-conv-map__popup-preview" data-slot="popup-preview"></div>
      </div>
    </nav>
  `;
}

function attachMapInteractivity(root, entries = SAMPLE_ENTRIES, onSelect = null) {
  const mapNav = root.querySelector('[data-slot="conversation-map"]');
  if (!mapNav) return;

  const ticks = Array.from(mapNav.querySelectorAll('[data-slot="conversation-map-tick"]'));
  const popup = mapNav.querySelector('[data-slot="conversation-map-popup"]');
  const popupTitle = mapNav.querySelector('[data-slot="popup-title"]');
  const popupPreview = mapNav.querySelector('[data-slot="popup-preview"]');

  function showPopup(index, targetEl) {
    const entry = entries[index];
    if (!entry || !popup) return;

    popupTitle.textContent = entry.title;
    popupPreview.textContent = entry.preview || '';

    popup.classList.add('is-visible');
    popup.setAttribute('aria-hidden', 'false');
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
  }

  ticks.forEach((tick, idx) => {
    tick.addEventListener('mouseenter', () => showPopup(idx, tick));
    tick.addEventListener('mouseleave', hidePopup);

    tick.addEventListener('focus', () => {
      showPopup(idx, tick);
      ticks.forEach((t) => t.setAttribute('tabindex', '-1'));
      tick.setAttribute('tabindex', '0');
    });

    tick.addEventListener('blur', hidePopup);

    tick.addEventListener('click', () => {
      ticks.forEach((t) => {
        t.removeAttribute('data-active');
        t.removeAttribute('aria-current');
      });
      tick.setAttribute('data-active', '');
      tick.setAttribute('aria-current', 'true');
      if (onSelect) onSelect(entries[idx]);
    });

    tick.addEventListener('keydown', (e) => {
      let nextIdx = null;
      if (e.key === 'ArrowUp') nextIdx = Math.max(0, idx - 1);
      else if (e.key === 'ArrowDown') nextIdx = Math.min(ticks.length - 1, idx + 1);
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = ticks.length - 1;

      if (nextIdx !== null) {
        e.preventDefault();
        ticks[nextIdx]?.focus();
      }
    });
  });
}

function renderShell(entries, interactive = false) {
  return `
    <div class="ds-conv-map-shell" data-slot="conv-map-shell">
      <div class="ds-conv-map-shell__messages" data-slot="messages-viewport">
        ${entries.map(
          (e) => `
          <div class="ds-msg-pair" data-message-id="${e.id}">
            <div class="ds-conv-map-shell__msg-title">
              ${e.title}
            </div>
            <div class="ds-conv-map-shell__msg-desc">
              ${e.preview}
            </div>
          </div>
        `,
        ).join('')}
      </div>
      <div class="ds-conv-map-shell__gutter">
        ${renderConversationMap({ entries, interactive })}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderShell(SAMPLE_ENTRIES, true);

    const msgsEl = root.querySelector('[data-slot="messages-viewport"]');
    attachMapInteractivity(root, SAMPLE_ENTRIES, (entry) => {
      const targetMsg = root.querySelector('[data-message-id="' + entry.id + '"]');
      if (targetMsg && msgsEl) {
        targetMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    return root;
  },
};

export const SingleTurn = story(renderShell([
  {
    id: 'single-1',
    title: 'Why did the nightly export job fail?',
    preview: 'The job hit the 15 minute Lambda timeout while compressing the March archive.',
    inView: true,
    active: true,
  },
]));

export const InProgress = story(renderShell([
  {
    id: 'turn-1',
    title: 'Why did the nightly export job fail?',
    preview: 'The job hit the 15 minute Lambda timeout while compressing the March archive.',
    inView: true,
    active: false,
  },
  {
    id: 'turn-2',
    title: 'Can you split the export by month and rerun it for March?',
    preview: 'Waiting for assistant response...',
    inView: true,
    active: true,
  },
]));

export const LongContent = story(renderShell(
  Array.from({ length: 18 }, (_, i) => ({
    id: `long-${i + 1}`,
    title: `Step ${i + 1}: Check status of service #${100 + i}`,
    preview: `Service #${100 + i} reported clean health check across all cluster availability zones.`,
    inView: i < 5,
    active: i === 2,
  })),
));

export const NonText = story(renderShell([
  {
    id: 'mix-1',
    title: "Find last week's p95 latency for the checkout API.",
    preview: 'Executed tool call: query_metrics(checkout-api, 7d). Result: 412ms.',
    inView: true,
    active: false,
  },
  {
    id: 'mix-2',
    title: 'Uploaded image: screenshot-metrics.png',
    preview: 'Image parsed. The screenshot shows the spike at 14:20 UTC.',
    inView: true,
    active: true,
  },
  {
    id: 'mix-3',
    title: 'Compare it with the week before.',
    preview: 'Reasoned for 2s. Latency rose from 288ms to 412ms after Tuesday deploy.',
    inView: true,
    active: false,
  },
]));
