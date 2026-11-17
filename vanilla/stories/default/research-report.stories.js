import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 40 Research Report',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const SPINNER_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

const INITIAL_SECTIONS = [
  {
    id: 'sec-1',
    heading: '1. Executive Summary',
    state: 'done',
    sources: 8,
    preview: 'Recent advances shift agent design from sequential re-act prompts toward tool timeline streaming.',
  },
  {
    id: 'sec-2',
    heading: '2. Latency Optimization & Specular Shimmer',
    state: 'writing',
    sources: 14,
    preview: 'Specular highlight reflection creates real-time cognitive feedback during inference pauses.',
  },
  {
    id: 'sec-3',
    heading: '3. Empirical Benchmarks',
    state: 'pending',
    sources: 12,
  },
];

function renderResearchReport({
  title = 'Deep Research: Autonomous Agent Architectures in 2025',
  sourcesRead = 34,
  sections = INITIAL_SECTIONS,
} = {}) {
  const doneCount = sections.filter((s) => s.state === 'done').length;

  const sectionsHtml = sections
    .map((s) => {
      let iconHtml = '';
      if (s.state === 'done') {
        iconHtml = `<span class="ds-report-section__status ds-report-section__status--done">${CHECK_ICON}</span>`;
      } else if (s.state === 'writing') {
        iconHtml = `<span class="ds-report-section__status ds-report-section__status--writing">${SPINNER_ICON}</span>`;
      } else {
        iconHtml = `<span class="ds-report-section__status"><span class="ds-report-section__status--pending"></span></span>`;
      }

      return `
        <div class="ds-report-section ${s.state === 'pending' ? 'ds-report-section--pending' : ''}" data-state="${s.state}">
          <div class="ds-report-section__row">
            ${iconHtml}
            <span class="ds-report-section__heading">${s.heading}</span>
            ${s.sources ? `<span class="ds-report-section__sources">${s.sources} src</span>` : ''}
          </div>
          ${s.preview ? `<p class="ds-report-section__preview">${s.preview}</p>` : ''}
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="research-report" class="ds-research-report ds-research-report-interactive" title="Click to advance research progress">
      <div class="ds-research-report__header">
        <span class="ds-research-report__title">${title}</span>
        <span class="ds-research-report__subtitle">${doneCount}/${sections.length} sections · ${sourcesRead} sources read</span>
      </div>
      <div class="ds-research-report__list">
        ${sectionsHtml}
      </div>
    </div>
  `;
}

function bindResearchEvents(root, initialProps = {}) {
  let sections = [
    {
      id: 'sec-1',
      heading: '1. Executive Summary',
      state: 'done',
      sources: 8,
      preview: 'Recent advances shift agent design from sequential re-act prompts toward tool timeline streaming.',
    },
    {
      id: 'sec-2',
      heading: '2. Latency Optimization & Specular Shimmer',
      state: 'writing',
      sources: 14,
      preview: 'Specular highlight reflection creates real-time cognitive feedback during inference pauses.',
    },
    {
      id: 'sec-3',
      heading: '3. Empirical Benchmarks',
      state: 'pending',
      sources: 12,
    },
  ];

  function update() {
    const target = root.querySelector('.ds-report-target');
    if (target) {
      target.innerHTML = renderResearchReport({ sections });
      attach();
    }
  }

  function attach() {
    const card = root.querySelector('.ds-research-report-interactive');
    if (card) {
      card.addEventListener('click', () => {
        const writingIdx = sections.findIndex((s) => s.state === 'writing');
        if (writingIdx !== -1) {
          sections[writingIdx].state = 'done';
          if (writingIdx + 1 < sections.length) {
            sections[writingIdx + 1].state = 'writing';
            sections[writingIdx + 1].preview = 'Empirical benchmarks confirm 3.8x throughput increase across multi-turn reasoning traces.';
          }
        } else {
          // Reset
          sections = [
            {
              id: 'sec-1',
              heading: '1. Executive Summary',
              state: 'done',
              sources: 8,
              preview: 'Recent advances shift agent design from sequential re-act prompts toward tool timeline streaming.',
            },
            {
              id: 'sec-2',
              heading: '2. Latency Optimization & Specular Shimmer',
              state: 'writing',
              sources: 14,
              preview: 'Specular highlight reflection creates real-time cognitive feedback during inference pauses.',
            },
            {
              id: 'sec-3',
              heading: '3. Empirical Benchmarks',
              state: 'pending',
              sources: 12,
            },
          ];
        }
        update();
      });
    }
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-report-target">
          ${renderResearchReport()}
        </div>
      </section>
    `;
    bindResearchEvents(root);
    return root;
  },
};
