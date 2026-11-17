import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 95 Thread search',
  parameters: { layout: 'padded' },
};

const SEARCH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const PIN_ICON = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>`;

const THREADS = [
  {
    id: '1',
    title: 'Draft restore across threads',
    group: 'Today',
    preview: 'Clearing the slot on switch',
    pinned: true,
  },
  {
    id: '2',
    title: 'Converter drops empty parts',
    group: 'Today',
    preview: 'Guard added, tests green',
  },
  {
    id: '3',
    title: 'Elements gap analysis',
    group: 'Yesterday',
    preview: '63 candidates, graded',
  },
  {
    id: '4',
    title: 'Queue ordering trap',
    group: 'Earlier',
    preview: 'Direct enqueue overtakes buffered',
  },
];

const LONG_THREADS = [
  {
    id: '1',
    title: 'Draft restore across threads after a reload on remote thread lists',
    group: 'Today',
    preview: 'Keying the slot by the remote id once it resolves fixes the cause, and a regression test covers it',
    pinned: true,
  },
  {
    id: '2',
    title: 'Why the converter drops tool calls with an empty args object in streaming mode',
    group: 'Today',
    preview: 'Added defensive checks to ensure empty payloads pass schema validation before dispatch',
  },
];

function renderThreadSearch({
  threads = THREADS,
  query = '',
  activeId = '1',
  readOnly = false,
} = {}) {
  const matches = threads.filter((t) =>
    `${t.title} ${t.preview}`.toLowerCase().includes(query.toLowerCase()),
  );
  const pinned = matches.filter((t) => t.pinned);
  const groups = [...new Set(matches.filter((t) => !t.pinned).map((t) => t.group))];

  return `
    <div data-slot="thread-search" class="ds-thread-search">
      <div data-slot="search-input-box" class="ds-thread-search__input-box">
        <span class="ds-thread-search__icon" aria-hidden="true">${SEARCH_ICON}</span>
        <input
          type="text"
          class="ds-thread-search__input"
          placeholder="Search threads"
          aria-label="Search threads"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          value="${query}"
          data-slot="search-input"
        />
      </div>

      <div class="ds-thread-search__list" role="listbox" aria-label="Threads" data-slot="thread-list">
        ${
          pinned.length > 0
            ? `
          <div role="group" aria-label="Pinned" class="ds-thread-search__group">
            <span class="ds-thread-search__group-label" aria-hidden="true">pinned</span>
            ${pinned.map((t) => renderThreadItem(t, activeId, readOnly)).join('')}
          </div>
        `
            : ''
        }

        ${groups
          .map(
            (group) => `
          <div role="group" aria-label="${group}" class="ds-thread-search__group">
            <span class="ds-thread-search__group-label" aria-hidden="true">${group}</span>
            ${matches
              .filter((t) => !t.pinned && t.group === group)
              .map((t) => renderThreadItem(t, activeId, readOnly))
              .join('')}
          </div>
        `,
          )
          .join('')}

        ${
          matches.length === 0
            ? `
          <span role="status" class="ds-thread-search__empty" data-slot="search-empty">
            ${threads.length === 0 ? 'No threads yet' : `No thread matches “${query}”`}
          </span>
        `
            : ''
        }
      </div>
    </div>
  `;
}

function renderThreadItem(thread, activeId, readOnly) {
  const isSelected = thread.id === activeId;
  const tag = readOnly ? 'div' : 'button';
  const buttonAttrs = readOnly ? '' : 'type="button" tabIndex="-1"';

  return `
    <${tag}
      ${buttonAttrs}
      role="option"
      aria-selected="${isSelected}"
      data-slot="thread-option"
      data-thread-id="${thread.id}"
      class="ds-thread-search__item ${isSelected ? 'ds-thread-search__item--active' : ''}"
    >
      <div class="ds-thread-search__title-row">
        ${thread.pinned ? `<span class="ds-thread-search__pin-icon" aria-hidden="true">${PIN_ICON}</span>` : ''}
        <span class="ds-thread-search__title" title="${thread.title}">${thread.title}</span>
      </div>
      <span class="ds-thread-search__preview" title="${thread.preview}">${thread.preview}</span>
    </${tag}>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentQuery = '';
    let currentActiveId = '1';

    const render = () => {
      const matched = THREADS.filter((t) =>
        `${t.title} ${t.preview}`.toLowerCase().includes(currentQuery.toLowerCase()),
      );
      const active = matched.find((t) => t.id === currentActiveId);
      const badgeText = active
        ? active.title
        : matched.length > 0
        ? `${matched.length} threads`
        : 'No matches';

      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderThreadSearch({
              threads: THREADS,
              query: currentQuery,
              activeId: currentActiveId,
            })}
          </div>
        </div>
      `;

      const input = root.querySelector('[data-slot="search-input"]');
      const options = root.querySelectorAll('[data-slot="thread-option"]');

      input?.addEventListener('input', (e) => {
        currentQuery = e.target.value;
        const currentMatches = THREADS.filter((t) =>
          `${t.title} ${t.preview}`.toLowerCase().includes(currentQuery.toLowerCase()),
        );
        if (currentMatches.length > 0 && !currentMatches.some((t) => t.id === currentActiveId)) {
          currentActiveId = currentMatches[0].id;
        }
        render();
        const newInput = root.querySelector('[data-slot="search-input"]');
        newInput?.focus();
        newInput?.setSelectionRange(currentQuery.length, currentQuery.length);
      });

      input?.addEventListener('keydown', (e) => {
        const currentMatches = THREADS.filter((t) =>
          `${t.title} ${t.preview}`.toLowerCase().includes(currentQuery.toLowerCase()),
        );
        if (currentMatches.length === 0) return;
        const curIdx = currentMatches.findIndex((t) => t.id === currentActiveId);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = (curIdx + 1) % currentMatches.length;
          currentActiveId = currentMatches[nextIdx].id;
          render();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = (curIdx - 1 + currentMatches.length) % currentMatches.length;
          currentActiveId = currentMatches[prevIdx].id;
          render();
        }
      });

      options.forEach((opt) => {
        opt.addEventListener('click', () => {
          currentActiveId = opt.getAttribute('data-thread-id');
          render();
        });
      });
    };

    render();
    return root;
  },
};

export const Filtered = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderThreadSearch({
        threads: THREADS,
        query: 'draft',
        activeId: '1',
      })}
    </div>
  </div>
`);

export const NoMatches = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderThreadSearch({
        threads: THREADS,
        query: 'billing webhook',
        activeId: '2',
      })}
    </div>
  </div>
`);

export const LongContent = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderThreadSearch({
        threads: LONG_THREADS,
        query: '',
        activeId: '2',
      })}
    </div>
  </div>
`);
