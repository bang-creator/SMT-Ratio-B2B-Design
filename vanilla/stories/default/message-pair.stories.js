import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 07 Message Pair',
  parameters: { layout: 'padded' },
};

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ds-text-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const REGEN_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>`;

const USER_MESSAGE = 'How do I persist composer drafts across threads?';
const WORDS = 'Key the draft by thread id inside the runtime, hydrate the composer when a thread becomes active, and drop the entry after the message sends.'.split(' ');

function renderMessagePairStatic({
  userMessage = USER_MESSAGE,
  words = WORDS,
  visibleWords = WORDS.length,
  streaming = false,
  variant = 'bubble',
} = {}) {
  const shown = words.slice(0, visibleWords);
  const wordsHtml = shown
    .map((word, i) => {
      const isFresh = streaming && shown.length - 1 - i < 2;
      const wordCls = isFresh ? 'ds-streaming-word ds-streaming-word--fresh' : 'ds-streaming-word';
      return `<span class="ds-streaming-token"><span class="${wordCls}">${word}</span> </span>`;
    })
    .join('');

  const caretHtml = streaming && shown.length > 0
    ? '<span aria-hidden="true" class="ds-message-pair__caret"></span>'
    : '';

  const bubbleCls = variant === 'flat'
    ? 'ds-message-pair__user-bubble ds-message-pair__user-bubble--flat'
    : 'ds-message-pair__user-bubble';

  return `
    <div data-slot="message-pair" data-variant="${variant}" class="ds-message-pair">
      <p class="${bubbleCls}">${userMessage}</p>
      <div class="ds-message-pair__assistant-row" tabindex="-1">
        <p>${wordsHtml}${caretHtml}</p>
        <div class="ds-message-pair__toolbar ds-toolbar--visible">
          <button type="button" aria-label="Copy response" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-copy">
            ${COPY_ICON}
          </button>
          <button type="button" aria-label="Regenerate response" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon ds-btn-regen">
            ${REGEN_ICON}
          </button>
        </div>
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Message Pair (Bubble Variant)
 * Starts streaming tokens in real time. Hover over reply shows Shared small pill action buttons.
 * Clicking Regenerate restarts streaming. Clicking Copy swaps icon to checkmark.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-pair-target">
          ${renderMessagePairStatic({ variant: 'bubble', visibleWords: 0, streaming: true })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-pair-target');
    let timer = null;

    function startStream() {
      clearTimeout(timer);
      let count = 0;
      target.innerHTML = renderMessagePairStatic({
        variant: 'bubble',
        visibleWords: 0,
        streaming: true,
      });

      function step() {
        count++;
        if (count <= WORDS.length) {
          target.innerHTML = renderMessagePairStatic({
            variant: 'bubble',
            visibleWords: count,
            streaming: count < WORDS.length,
          });
          bindActions();
          if (count < WORDS.length) {
            timer = setTimeout(step, 90);
          }
        }
      }
      timer = setTimeout(step, 90);
    }

    function bindActions() {
      const copyBtn = target.querySelector('.ds-btn-copy');
      const regenBtn = target.querySelector('.ds-btn-regen');

      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyBtn.innerHTML = CHECK_ICON;
          setTimeout(() => {
            copyBtn.innerHTML = COPY_ICON;
          }, 1800);
        });
      }

      if (regenBtn) {
        regenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startStream();
        });
      }
    }

    setTimeout(startStream, 50);
    return root;
  },
};

/**
 * Flat: Distinct structural variant (User message without paper bubble container)
 */
export const Flat = story(
  'Default / Application / 07 Message Pair / Flat',
  stage(
    'Flat Variant',
    renderMessagePairStatic({
      variant: 'flat',
      visibleWords: WORDS.length,
      streaming: false,
    })
  )
);
