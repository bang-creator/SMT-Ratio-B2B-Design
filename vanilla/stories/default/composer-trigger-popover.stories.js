import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 120 Composer trigger popover AUI',
  parameters: { layout: 'padded' },
};

const WRENCH_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
const USER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
const FILE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
const GLOBE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
const LANGUAGES_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>`;
const SPINNER = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-animate-spin" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

const MENTION_ITEMS = [
  { category: 'Tools', id: 'get_weather', label: 'Get weather', desc: 'Current conditions for a city', icon: WRENCH_ICON },
  { category: 'Tools', id: 'web_search', label: 'Web search', desc: 'Search the public web', icon: WRENCH_ICON },
  { category: 'Files', id: 'pricing_md', label: 'pricing.md', desc: 'docs/pricing.md', icon: FILE_ICON },
  { category: 'People', id: 'priya_shah', label: 'Priya Shah', desc: 'Design', icon: USER_ICON },
  { category: 'People', id: 'marco_rossi', label: 'Marco Rossi', desc: 'Engineering', icon: USER_ICON },
];

const SLASH_COMMANDS = [
  { category: 'Commands', id: 'summarize', label: '/summarize', desc: 'Summarize the conversation', icon: FILE_ICON },
  { category: 'Commands', id: 'translate', label: '/translate', desc: 'Translate to another language', icon: LANGUAGES_ICON },
  { category: 'Commands', id: 'search', label: '/search', desc: 'Search the web', icon: GLOBE_ICON },
];

function renderPopoverCard({
  items = MENTION_ITEMS,
  emptyMessage = '',
  isLoading = false,
  flat = false,
} = {}) {
  let contentHtml = '';
  if (isLoading) {
    contentHtml = `
      <div class="ds-trigger-popover-loading" data-slot="popover-loading">
        ${SPINNER}
        <span>Loading suggestions...</span>
      </div>
    `;
  } else if (emptyMessage) {
    contentHtml = `
      <div class="ds-trigger-popover-empty" data-slot="popover-empty">${emptyMessage}</div>
    `;
  } else if (flat) {
    contentHtml = items
      .map(
        (i) => `
      <button
        type="button"
        role="option"
        class="ds-trigger-popover-item"
        data-slot="trigger-item"
        data-id="${i.id}"
        data-label="${i.label}"
      >
        <span class="ds-trigger-popover-item__icon" aria-hidden="true">${i.icon}</span>
        <div class="ds-trigger-popover-item__content">
          <span class="ds-trigger-popover-item__label" data-slot="item-label">${i.label}</span>
          <span class="ds-trigger-popover-item__desc" data-slot="item-desc">${i.desc}</span>
        </div>
      </button>
    `,
      )
      .join('');
  } else {
    const categories = [...new Set(items.map((i) => i.category))];
    contentHtml = categories
      .map(
        (cat) => `
      <div class="ds-trigger-popover-tab" data-slot="popover-tab">${cat}</div>
      ${items
        .filter((i) => i.category === cat)
        .map(
          (i) => `
        <button
          type="button"
          role="option"
          class="ds-trigger-popover-item"
          data-slot="trigger-item"
          data-id="${i.id}"
          data-label="${i.label}"
        >
          <span class="ds-trigger-popover-item__icon" aria-hidden="true">${i.icon}</span>
          <div class="ds-trigger-popover-item__content">
            <span class="ds-trigger-popover-item__label" data-slot="item-label">${i.label}</span>
            <span class="ds-trigger-popover-item__desc" data-slot="item-desc">${i.desc}</span>
          </div>
        </button>
      `,
        )
        .join('')}
    `,
      )
      .join('');
  }

  return `
    <div data-slot="composer-trigger-popover" class="ds-trigger-popover-card">
      <div class="ds-flex ds-flex-col" role="listbox" aria-label="Trigger suggestions">
        ${contentHtml}
      </div>
    </div>
  `;
}

function renderStage({
  text = 'Ask @',
  popoverProps = {},
  showPopover = true,
} = {}) {
  return `
    <div class="ds-flex ds-flex-col ds-gap-2 ds-w-100 ds-max-w-md ds-relative" data-slot="composer-stage">
      <div class="ds-composer-popover-container ${showPopover ? '' : 'is-hidden'}" data-slot="popover-container">
        ${renderPopoverCard(popoverProps)}
      </div>

      <div class="ds-card ds-p-3 ds-bg-surface-secondary ds-w-100">
        <input
          type="text"
          class="ds-input-bare ds-w-100 ds-text-sm"
          data-slot="composer-input"
          placeholder="Type @ to mention or / for commands"
          value="${text}"
          aria-label="Composer input"
        />
      </div>
    </div>
  `;
}

function attachPopoverInteractivity(root) {
  const input = root.querySelector('[data-slot="composer-input"]');
  const popoverContainer = root.querySelector('[data-slot="popover-container"]');
  const items = root.querySelectorAll('[data-slot="trigger-item"]');

  if (input && popoverContainer) {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.includes('@') || val.includes('/')) {
        popoverContainer.classList.remove('is-hidden');
      } else {
        popoverContainer.classList.add('is-hidden');
      }
    });

    items.forEach((item) => {
      item.addEventListener('click', () => {
        const label = item.getAttribute('data-label');
        input.value = `Ask @${label} `;
        popoverContainer.classList.add('is-hidden');
        input.focus();
      });
    });
  }
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderStage({
      text: 'Ask @',
      popoverProps: { items: MENTION_ITEMS },
      showPopover: true,
    });
    attachPopoverInteractivity(root);
    return root;
  },
};

export const Categories = story(
  () => renderStage({
    text: 'Ask @',
    popoverProps: { items: MENTION_ITEMS },
    showPopover: true,
  })
);

export const Search = story(
  () => renderStage({
    text: 'Ask @pri',
    popoverProps: {
      items: [
        { category: 'People', id: 'priya_shah', label: 'Priya Shah', desc: 'Design', icon: USER_ICON },
      ],
      flat: true,
    },
    showPopover: true,
  })
);

export const Commands = story(
  () => renderStage({
    text: '/',
    popoverProps: { items: SLASH_COMMANDS, flat: true },
    showPopover: true,
  })
);

export const NoMatches = story(
  () => renderStage({
    text: '/deploy',
    popoverProps: { emptyMessage: 'No matching commands' },
    showPopover: true,
  })
);

export const Loading = story(
  () => renderStage({
    text: 'Ask @mar',
    popoverProps: { isLoading: true },
    showPopover: true,
  })
);
