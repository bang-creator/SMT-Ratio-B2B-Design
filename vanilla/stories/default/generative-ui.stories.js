import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 126 Generative UI AUI',
  parameters: { layout: 'padded' },
};

function renderMarkdownCard() {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-generative-card__title" data-slot="card-title">Standup, Tuesday</div>
      <ul class="ds-generative-card__list" data-slot="card-list">
        <li>Search reindex finished overnight</li>
        <li><code class="ds-font-mono ds-text-xs ds-p-1 ds-bg-surface-secondary ds-rounded">billing-worker</code> retries are back under 1%</li>
        <li>Mobile release moves to <strong>Thursday</strong></li>
      </ul>
      <div class="ds-generative-card__footer">
        Notes are in the <a href="#" class="ds-text-primary ds-underline" onclick="return false;">team doc</a>.
      </div>
    </div>
  `;
}

function renderDiagramCard() {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-generative-card__title" data-slot="card-title">Refund approval</div>
      <div class="ds-mermaid-canvas ds-p-2" data-slot="card-diagram">
        <svg width="280" height="90" viewBox="0 0 280 90" fill="none" class="ds-w-full ds-text-primary" aria-label="Refund approval flowchart">
          <rect x="5" y="30" width="80" height="30" rx="4" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
          <text x="45" y="50" fill="var(--color-semantic-text-primary)" font-size="10" text-anchor="middle">Refund request</text>
          
          <line x1="85" y1="45" x2="115" y2="45" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></line>

          <polygon points="140,25 165,45 140,65 115,45" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></polygon>
          <text x="140" y="48" fill="var(--color-semantic-text-primary)" font-size="9" text-anchor="middle">&gt; $500?</text>

          <line x1="165" y1="45" x2="195" y2="45" stroke="var(--color-semantic-border-default)" stroke-width="1.5"></line>

          <rect x="195" y="30" width="80" height="30" rx="4" fill="var(--color-semantic-background-surface-secondary)" stroke="var(--color-semantic-border-subtle)"></rect>
          <text x="235" y="50" fill="var(--color-semantic-text-primary)" font-size="10" text-anchor="middle">Manager review</text>
        </svg>
      </div>
    </div>
  `;
}

function renderMapCard() {
  return `
    <div class="ds-generative-card" data-slot="generative-card">
      <div class="ds-generative-card__title" data-slot="card-title">Europe trip itinerary</div>
      <div class="ds-generative-card__itinerary" data-slot="map-itinerary">
        <div class="ds-generative-card__row is-selected" data-slot="itinerary-row" data-city="Lisbon">
          <div class="ds-flex ds-items-center ds-gap-2">
            <span class="ds-status-dot ds-status-dot--completed" aria-hidden="true"></span>
            <span class="ds-generative-card__city" data-slot="city-name">Lisbon</span>
          </div>
          <span class="ds-generative-card__date">Day 1 to 3</span>
        </div>
        <div class="ds-generative-card__row" data-slot="itinerary-row" data-city="Porto">
          <div class="ds-flex ds-items-center ds-gap-2">
            <span class="ds-status-dot ds-status-dot--completed" aria-hidden="true"></span>
            <span class="ds-generative-card__city" data-slot="city-name">Porto</span>
          </div>
          <span class="ds-generative-card__date">Day 4 to 5</span>
        </div>
        <div class="ds-generative-card__row" data-slot="itinerary-row" data-city="Madrid">
          <div class="ds-flex ds-items-center ds-gap-2">
            <span class="ds-status-dot ds-status-dot--completed" aria-hidden="true"></span>
            <span class="ds-generative-card__city" data-slot="city-name">Madrid</span>
          </div>
          <span class="ds-generative-card__date">Day 6 to 8</span>
        </div>
      </div>
    </div>
  `;
}

function attachItineraryHandlers(root) {
  const rows = root.querySelectorAll('[data-slot="itinerary-row"]');
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('is-selected'));
      row.classList.add('is-selected');
    });
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-flex ds-flex-col ds-gap-4 ds-max-w-md ds-w-100">
        ${renderMarkdownCard()}
        ${renderDiagramCard()}
        ${renderMapCard()}
      </div>
    `;
    attachItineraryHandlers(root);
    return root;
  },
};

export const Markdown = story(
  () => renderMarkdownCard()
);

export const Diagram = story(
  () => renderDiagramCard()
);

export const Map = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = renderMapCard();
    attachItineraryHandlers(root);
    return root;
  },
};
