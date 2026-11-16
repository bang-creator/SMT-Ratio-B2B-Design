import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 115 Quote AUI',
  parameters: { layout: 'padded' },
};

const X_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const SHORT_QUOTE = 'The runtime system follows a layered architecture.';
const LONG_QUOTE =
  'Each thread keeps its own composer, so a draft typed in one conversation never leaks into another. When the user switches threads, the composer state is saved to the thread list adapter and restored the next time that thread opens, including attachments that finished uploading.';

function renderSentMessage({
  quote = SHORT_QUOTE,
  text = 'Can you explain how the layers connect?',
} = {}) {
  return `
    <div class="ds-flex ds-w-100 ds-max-w-md ds-justify-end" data-slot="sent-message-wrap">
      <div class="ds-msg-timing-fixture__bubble--user ds-w-100" data-slot="user-bubble">
        <div class="ds-quote-block" data-slot="quote-block">
          <span class="ds-quote-block__text" data-slot="quote-text">${quote}</span>
        </div>
        <p class="ds-font-normal ds-text-sm ds-m-0" data-slot="user-text">${text}</p>
      </div>
    </div>
  `;
}

function renderComposerQuote({
  quote = SHORT_QUOTE,
  placeholder = 'Ask about this passage...',
  value = '',
  interactive = true,
} = {}) {
  return `
    <div class="ds-card ds-p-3 ds-bg-surface-default ds-max-w-md ds-w-100" data-slot="composer-fixture">
      <div class="ds-composer-quote" data-slot="composer-quote">
        <span class="ds-composer-quote__text" data-slot="composer-quote-text">${quote}</span>
        ${
          interactive
            ? `
          <button
            type="button"
            class="ds-composer-quote__dismiss"
            data-action="dismiss-quote"
            aria-label="Remove quote"
          >
            ${X_ICON}
          </button>
        `
            : ''
        }
      </div>
      <div class="ds-pt-2">
        <input
          type="text"
          class="ds-input-bare ds-w-100 ds-text-sm"
          placeholder="${placeholder}"
          value="${value}"
          aria-label="${placeholder}"
          data-slot="composer-input"
        >
      </div>
    </div>
  `;
}

function attachQuoteInteractivity(root) {
  const dismissBtn = root.querySelector('[data-action="dismiss-quote"]');
  const quotePreview = root.querySelector('[data-slot="composer-quote"]');

  if (dismissBtn && quotePreview) {
    dismissBtn.addEventListener('click', () => {
      quotePreview.classList.add('is-hidden');
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderComposerQuote({
      quote: SHORT_QUOTE,
      value: 'Can you explain how the layers connect?',
      interactive: true,
    });
    attachQuoteInteractivity(root);
    return root;
  },
};

export const ComposerQuote = story(
  () => renderComposerQuote({
    quote: SHORT_QUOTE,
    value: '',
    interactive: true,
  })
);

export const Sent = story(
  () => renderSentMessage({
    quote: SHORT_QUOTE,
    text: 'Can you explain how the layers connect?',
  })
);

export const LongContent = story(
  () => `
    <div class="ds-flex ds-flex-col ds-gap-4 ds-max-w-md ds-w-100">
      ${renderSentMessage({
        quote: LONG_QUOTE,
        text: 'Does this also cover remote threads?',
      })}
      ${renderComposerQuote({
        quote: LONG_QUOTE,
        value: '',
        interactive: false,
      })}
    </div>
  `
);
