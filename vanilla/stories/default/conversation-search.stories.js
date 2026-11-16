import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 94 Search in conversation',
  parameters: { layout: 'padded' },
};

const SEARCH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const CHEVRON_UP = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
const CHEVRON_DOWN = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

const DEFAULT_HITS = [
  {
    id: '1',
    before: 'The composer reads the ',
    match: 'draft',
    after: ' from a per-thread slot.',
    pos: 12,
  },
  {
    id: '2',
    before: 'Clearing the ',
    match: 'draft',
    after: ' on switch fixes it at the source.',
    pos: 46,
  },
  {
    id: '3',
    before: 'Add a regression test for ',
    match: 'draft',
    after: ' restore.',
    pos: 78,
  },
];

function renderConversationSearch({
  query = 'draft',
  hits = DEFAULT_HITS,
  activeIndex = 0,
  showStepper = true,
} = {}) {
  const countText = hits.length === 0 ? '0' : `${activeIndex + 1}/${hits.length}`;
  const active = hits.length > 0 ? hits[activeIndex] : null;

  return `
    <div data-slot="conversation-search" class="ds-conv-search">
      <div class="ds-conv-search__main">
        <div data-slot="search-box" class="ds-conv-search-box">
          <span class="ds-conv-search__icon" aria-hidden="true">${SEARCH_ICON}</span>
          <input
            type="text"
            class="ds-conv-search__input"
            placeholder="Find in conversation"
            aria-label="Find in conversation"
            value="${query}"
            data-slot="search-input"
          />
          <span class="ds-conv-search__counter" data-slot="match-counter">${countText}</span>
          ${
            showStepper
              ? `
            <button
              type="button"
              aria-label="Previous match"
              class="ds-conv-search__btn"
              data-slot="prev-match"
            >
              ${CHEVRON_UP}
            </button>
            <button
              type="button"
              aria-label="Next match"
              class="ds-conv-search__btn"
              data-slot="next-match"
            >
              ${CHEVRON_DOWN}
            </button>
          `
              : ''
          }
        </div>

        ${
          active
            ? `
          <div data-slot="search-excerpt" class="ds-conv-search__excerpt">
            <span class="ds-conv-search__text">${active.before}</span>
            <span class="ds-conv-search-match">${active.match}</span>
            <span class="ds-conv-search__text">${active.after}</span>
          </div>
        `
            : ''
        }
      </div>

      <div data-slot="search-track" class="ds-conv-search__track" aria-hidden="true">
        ${hits
          .map(
            (h, i) => `
          <span
            class="ds-conv-search__marker"
            data-pos="${h.pos}"
            data-active="${i === activeIndex}"
          ></span>
        `,
          )
          .join('')}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let query = 'draft';
    let activeIdx = 0;
    let hits = DEFAULT_HITS;

    const render = () => {
      const badgeText = hits.length > 0
        ? `Match ${activeIdx + 1} of ${hits.length}`
        : '0 Matches';

      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">94 Search in conversation</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">${badgeText}</span>
          </div>
          <div class="ds-story-stage__body">
            ${renderConversationSearch({
              query,
              hits,
              activeIndex: activeIdx,
              showStepper: true,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="search-input"]');
      const prevBtn = root.querySelector('[data-slot="prev-match"]');
      const nextBtn = root.querySelector('[data-slot="next-match"]');

      input?.addEventListener('input', (e) => {
        query = e.target.value;
        if (!query.trim()) {
          hits = [];
          activeIdx = 0;
        } else if ('draft'.includes(query.toLowerCase())) {
          hits = DEFAULT_HITS;
          activeIdx = 0;
        } else {
          hits = [];
          activeIdx = 0;
        }
        render();
        const newInput = root.querySelector('[data-slot="search-input"]');
        newInput?.focus();
        newInput?.setSelectionRange(query.length, query.length);
      });

      prevBtn?.addEventListener('click', () => {
        if (hits.length === 0) return;
        activeIdx = (activeIdx - 1 + hits.length) % hits.length;
        render();
      });

      nextBtn?.addEventListener('click', () => {
        if (hits.length === 0) return;
        activeIdx = (activeIdx + 1) % hits.length;
        render();
      });
    };

    render();
    return root;
  },
};

export const NoMatches = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">94 Search in conversation (No Matches)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Empty Result</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderConversationSearch({
        query: 'checkpoint',
        hits: [],
        activeIndex: 0,
        showStepper: true,
      })}
    </div>
  </div>
`);

export const LastMatch = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">94 Search in conversation (Last Match)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Match 3 of 3</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderConversationSearch({
        query: 'draft',
        hits: DEFAULT_HITS,
        activeIndex: 2,
        showStepper: true,
      })}
    </div>
  </div>
`);

export const ManyHits = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">94 Search in conversation (Many Hits)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">Long Excerpt</span>
    </div>
    <div class="ds-story-stage__body">
      ${renderConversationSearch({
        query: 'thread id',
        hits: [
          { id: '1', before: 'The ', match: 'thread id', after: ' changes.', pos: 12 },
          { id: '2', before: 'The ', match: 'thread id', after: ' changes.', pos: 25 },
          { id: '3', before: 'The ', match: 'thread id', after: ' changes.', pos: 46 },
          {
            id: '4',
            before: 'When remote thread list hydrates after reload, composer points at old slot, so ',
            match: 'thread id',
            after: ' is stale for one render.',
            pos: 60,
          },
          { id: '5', before: 'The ', match: 'thread id', after: ' changes.', pos: 78 },
        ],
        activeIndex: 3,
        showStepper: true,
      })}
    </div>
  </div>
`);
