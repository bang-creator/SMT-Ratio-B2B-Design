import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 33 Inline Citation',
  parameters: { layout: 'padded' },
};

const SOURCES = {
  '1': {
    domain: 'platform.openai.com',
    initial: 'O',
    date: 'Oct 2024',
    title: 'OpenAI Platform Interface Guidelines',
    snippet: 'Authentic design tokens and consistent components ensure low visual friction and high scanability across dense developer tools.',
    url: 'https://platform.openai.com',
  },
  '2': {
    domain: 'github.com',
    initial: 'G',
    date: 'Nov 2024',
    title: 'OpenAI Design System Architecture',
    snippet: 'Atomic components in Shared power complex application cards with zero runtime overhead and strict token adherence.',
    url: 'https://github.com/openai',
  },
};

function renderInlineCitation({ activeSource = null } = {}) {
  const current = activeSource ? SOURCES[activeSource] : null;

  return `
    <div data-slot="inline-citation">
      <p>
        The platform uses an understated, clean typography hierarchy
        <button type="button" class="ds-citation-pill ds-cite-btn" data-source="1" aria-label="Source 1: OpenAI Platform Interface Guidelines" aria-expanded="${activeSource === '1'}">1</button>
        across all secondary readouts and controls, reserving medium weights solely for primary actions
        <button type="button" class="ds-citation-pill ds-cite-btn" data-source="2" aria-label="Source 2: Design System Architecture" aria-expanded="${activeSource === '2'}">2</button>.
      </p>

      <div class="ds-citation-card ${current ? 'ds-citation-card--open' : ''} ds-citation-popover">
        ${
          current
            ? `
          <div class="ds-citation-card__meta">
            <span class="ds-domain-badge">${current.initial}</span>
            <span>${current.domain}</span>
            <span>· ${current.date}</span>
          </div>
          <div class="ds-citation-card__title">${current.title}</div>
          <div class="ds-citation-card__snippet">
            ${current.snippet}
          </div>
          <a href="${current.url}" target="_blank" rel="noopener noreferrer" class="ds-citation-card__link">
            Open source
          </a>
        `
            : ''
        }
      </div>
    </div>
  `;
}

function bindCitationEvents(root) {
  let activeSource = null;

  function update() {
    const target = root.querySelector('.ds-citation-target');
    if (target) {
      target.innerHTML = renderInlineCitation({ activeSource });
      attach();
    }
  }

  function attach() {
    const buttons = root.querySelectorAll('.ds-cite-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-source');
        activeSource = activeSource === id ? null : id;
        update();
      });
    });
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>33 Inline Citation (Interactive Source Popover)</code></header>
        <div class="ds-citation-target">
          ${renderInlineCitation({ activeSource: null })}
        </div>
      </section>
    `;
    bindCitationEvents(root);
    return root;
  },
};
