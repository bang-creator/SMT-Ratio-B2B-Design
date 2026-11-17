import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 64 Recommendation Card',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg class="ds-recommendation-card__receipt-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

function renderRecommendationCard({
  question = 'Enable draft autosave?',
  body = 'Threads lose their draft on switch. Wiring runtime.drafts fixes it with 3 lines and no migration overhead.',
  confidence = 'high confidence',
  state = 'idle',
  acceptedText = 'Enabled for every thread',
} = {}) {
  let footerHtml = '';
  if (state === 'idle') {
    footerHtml = `
      <div class="ds-recommendation-card__confidence">
        <span class="ds-recommendation-card__bars" aria-hidden="true">
          <span class="ds-recommendation-card__bar-1"></span>
          <span class="ds-recommendation-card__bar-2"></span>
          <span class="ds-recommendation-card__bar-3"></span>
        </span>
        <span class="ds-recommendation-card__confidence-label">${confidence}</span>
      </div>
      <div class="ds-recommendation-card__actions">
        <button type="button" class="ds-recommendation-card__btn" data-btn-alt>Alternatives</button>
        <button type="button" class="ds-recommendation-card__btn ds-recommendation-card__btn--primary" data-btn-accept>Accept</button>
      </div>
    `;
  } else {
    footerHtml = `
      <div role="status" class="ds-recommendation-card__receipt" data-receipt-reset title="Click to reset">
        ${CHECK_ICON}
        <span>${acceptedText}</span>
      </div>
    `;
  }

  return `
    <div data-slot="recommendation-card" data-state="${state}" class="ds-recommendation-card">
      <h4 class="ds-recommendation-card__title">${question}</h4>
      <p class="ds-recommendation-card__body">${body}</p>
      <div class="ds-recommendation-card__footer">
        ${footerHtml}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    const proposals = [
      {
        question: 'Enable draft autosave?',
        body: 'Threads lose their draft on switch. Wiring runtime.drafts fixes it with 3 lines and no migration overhead.',
        confidence: 'high confidence',
        acceptedText: 'Enabled for every thread',
      },
      {
        question: 'Index tokens for vector search?',
        body: 'Precomputing dense embeddings on worker startup reduces subsequent query retrieval latency by 85%.',
        confidence: '92% confidence',
        acceptedText: 'Indexed across all active thread clusters',
      },
    ];

    let currentProposal = 0;
    let isAccepted = false;

    const render = () => {
      const p = proposals[currentProposal];
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            ${renderRecommendationCard({
              question: p.question,
              body: p.body,
              confidence: p.confidence,
              state: isAccepted ? 'accepted' : 'idle',
              acceptedText: p.acceptedText,
            })}
          </div>
        </div>
      `;

      root.querySelector('[data-btn-accept]')?.addEventListener('click', () => {
        isAccepted = true;
        render();
      });

      root.querySelector('[data-btn-alt]')?.addEventListener('click', () => {
        currentProposal = (currentProposal + 1) % proposals.length;
        render();
      });

      root.querySelector('[data-receipt-reset]')?.addEventListener('click', () => {
        isAccepted = false;
        render();
      });
    };

    render();
    return root;
  },
};

export const LongRationale = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderRecommendationCard({
        question: 'Migrate to fine-grained atom subscriptions instead of context re-renders?',
        body: 'When large thread histories stream tokens at 90ms intervals, re-rendering the parent React tree causes frame drops and input lag. Splitting state into lightweight atomic subscriptions isolates updates strictly to the active streaming bubble.',
        confidence: 'high confidence',
        state: 'idle',
      })}
    </div>
  </div>
`);
