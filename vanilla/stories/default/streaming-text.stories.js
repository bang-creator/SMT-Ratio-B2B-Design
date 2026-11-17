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
      const isFresh = streaming && shown.length - 1 - i < 2;
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
 * Starts streaming tokens naturally with 95ms cadence, highlighting fresh words in blue,
 * pulsing the caret, and transitioning words smoothly to settled state.
 * Clicking on the text pauses, resumes, or replays stream.
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
    let timer = null;
    let isPlaying = true;
    const wordSpans = [];

    const caret = document.createElement('span');
    caret.setAttribute('aria-hidden', 'true');
    caret.className = 'ds-streaming-caret';

    function addNextWord() {
      if (currentIndex >= WORDS.length) {
        if (caret.parentNode) caret.parentNode.removeChild(caret);
        wordSpans.forEach((span) => span.classList.remove('ds-streaming-word--fresh'));
        isPlaying = false;
        return;
      }

      const item = WORDS[currentIndex];
      const token = document.createElement('span');
      token.className = 'ds-streaming-token';

      const wordSpan = document.createElement('span');
      wordSpan.className = 'ds-streaming-word ds-streaming-word--fresh';

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

      if (caret.parentNode) {
        textEl.insertBefore(token, caret);
      } else {
        textEl.appendChild(token);
        textEl.appendChild(caret);
      }

      for (let j = 0; j < wordSpans.length - 2; j++) {
        wordSpans[j].classList.remove('ds-streaming-word--fresh');
      }

      currentIndex++;
      timer = setTimeout(addNextWord, 95);
    }

    function resetAndStart() {
      clearTimeout(timer);
      currentIndex = 0;
      wordSpans.length = 0;
      textEl.innerHTML = '';
      textEl.appendChild(caret);
      isPlaying = true;
      addNextWord();
    }

    textEl.addEventListener('click', () => {
      if (currentIndex >= WORDS.length) {
        resetAndStart();
      } else if (isPlaying) {
        clearTimeout(timer);
        isPlaying = false;
      } else {
        isPlaying = true;
        addNextWord();
      }
    });

    setTimeout(() => {
      resetAndStart();
    }, 50);

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
