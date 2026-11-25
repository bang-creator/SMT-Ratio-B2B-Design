import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 03 Streaming text',
  parameters: { layout: 'padded' },
};

const SEGMENTS = [
  { text: 'Here is what changed in the latest release: the composer now' },
  { text: 'restores drafts per thread, tool calls stream partial arguments' },
  { text: 'through' },
  { text: 'useAuiState', mono: true },
  { text: 'selectors, and reasoning traces collapse on their own the moment' },
  { text: 'a reply starts streaming.' },
];

const WORDS = SEGMENTS.flatMap((segment) =>
  segment.text.split(' ').map((word) => ({ word, mono: segment.mono ?? false }))
);

function renderStreamingHtml(words, count, streaming) {
  const shown = words.slice(0, count);

  const wordsHtml = shown
    .map(({ word, mono }, i) => {
      const isFresh = streaming && shown.length - 1 - i < 3;
      const wordCls = isFresh ? 'ds-streaming-word ds-streaming-word--fresh' : 'ds-streaming-word';
      const content = mono
        ? `<span class="ds-streaming-code">${word}</span>`
        : word;

      return `<span class="ds-streaming-token"><span class="${wordCls}">${content}</span> </span>`;
    })
    .join('');

  const caretHtml = streaming && shown.length > 0
    ? '<span aria-hidden="true" class="ds-streaming-caret"></span>'
    : '';

  return `<p data-slot="streaming-text" class="ds-streaming-text" title="Click to pause, resume or restart">${wordsHtml}${caretHtml}</p>`;
}

/**
 * Default: Live Interactive Streaming Text
 * Streams words smoothly via requestAnimationFrame with punctuation-aware cadence,
 * blur-slide token reveal, 3-word fresh highlight trail, and graceful caret settle.
 * Clicking on the text pauses, resumes, or replays the stream.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
        <div class="ds-stream-viewport">
          <p data-slot="streaming-text" class="ds-streaming-text" title="Click text to pause or replay"></p>
        </div>
      </section>
    `;

    const textEl = root.querySelector('.ds-streaming-text');
    let currentIndex = 0;
    let rafId = 0;
    let nextWordAt = 0;
    let isPlaying = true;
    const decayTimers = [];
    const wordSpans = [];

    const caret = document.createElement('span');
    caret.setAttribute('aria-hidden', 'true');
    caret.className = 'ds-streaming-caret';

    const isReduced = () => (
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      || Boolean(root.closest('[data-reduced-motion="true"]'))
    );

    const clearPending = () => {
      if (rafId) {
        clearTimeout(rafId);
        rafId = 0;
      }
      while (decayTimers.length) {
        clearTimeout(decayTimers.pop());
      }
    };

    const cadenceFor = (word) => {
      if (/[.!?]$/.test(word)) return 75;
      return 48;
    };

    const appendWord = (item, fresh) => {
      const token = document.createElement('span');
      token.className = 'ds-streaming-token';

      const wordSpan = document.createElement('span');
      wordSpan.className = fresh ? 'ds-streaming-word ds-streaming-word--fresh' : 'ds-streaming-word';

      if (item.mono) {
        const code = document.createElement('span');
        code.className = 'ds-streaming-code';
        code.textContent = item.word;
        wordSpan.appendChild(code);
      } else {
        wordSpan.textContent = item.word;
      }

      token.appendChild(wordSpan);
      token.appendChild(document.createTextNode(' '));
      wordSpans.push(wordSpan);

      if (fresh) {
        if (caret.parentNode) textEl.insertBefore(token, caret);
        else {
          textEl.appendChild(token);
          textEl.appendChild(caret);
        }
      } else {
        textEl.appendChild(token);
      }
    };

    const finishStream = () => {
      isPlaying = false;
      const tailSpans = wordSpans.slice(Math.max(0, wordSpans.length - 3));
      tailSpans.forEach((span, idx) => {
        decayTimers.push(window.setTimeout(() => {
          span.classList.remove('ds-streaming-word--fresh');
        }, idx * 85));
      });
      decayTimers.push(window.setTimeout(() => {
        caret.classList.add('ds-streaming-caret--done');
        decayTimers.push(window.setTimeout(() => {
          if (!isPlaying && caret.parentNode) caret.parentNode.removeChild(caret);
        }, 210));
      }, tailSpans.length * 85));
    };

    const tick = () => {
      rafId = 0;
      if (!isPlaying || !textEl.isConnected) return;
      const item = WORDS[currentIndex];
      appendWord(item, true);
      if (wordSpans.length > 3) {
        wordSpans[wordSpans.length - 4].classList.remove('ds-streaming-word--fresh');
      }
      currentIndex++;
      if (currentIndex >= WORDS.length) {
        finishStream();
        return;
      }
      rafId = window.setTimeout(tick, cadenceFor(item.word));
    };

    function resetAndStart() {
      clearPending();
      currentIndex = 0;
      wordSpans.length = 0;
      textEl.innerHTML = '';
      caret.classList.remove('ds-streaming-caret--done');
      if (isReduced()) {
        WORDS.forEach((item) => appendWord(item, false));
        currentIndex = WORDS.length;
        isPlaying = false;
        return;
      }
      textEl.appendChild(caret);
      isPlaying = true;
      tick();
    }

    textEl.addEventListener('click', () => {
      if (currentIndex >= WORDS.length) {
        resetAndStart();
      } else if (isPlaying) {
        clearPending();
        isPlaying = false;
      } else {
        isPlaying = true;
        tick();
      }
    });

    requestAnimationFrame(() => {
      if (root.isConnected) {
        resetAndStart();
      } else {
        requestAnimationFrame(() => {
          if (root.isConnected) resetAndStart();
        });
      }
    });

    return root;
  },
};

/**
 * Complete: Static settled state
 * The stream has finished, all tokens are settled to primary text color, and the caret is removed.
 */
export const Complete = story(
  'Default / Application / 03 Streaming text / Complete',
  stage('Complete', renderStreamingHtml(WORDS, WORDS.length, false))
);
