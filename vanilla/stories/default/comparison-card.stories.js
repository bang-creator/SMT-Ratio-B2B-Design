import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 53 Comparison Card',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-comparison-card__icon-check" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

const MINUS_ICON = `
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ds-comparison-card__icon-minus" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
`;

const DEFAULT_OPTIONS = [
  {
    id: 'gpt-4o',
    name: 'gpt-4o',
    headline: 'Omni multimodal intelligence',
    traits: ['Vision analysis', 'Audio reasoning', 'Structured outputs'],
  },
  {
    id: 'gpt-4o-mini',
    name: 'gpt-4o-mini',
    headline: 'Fast lightweight operations',
    traits: ['Vision analysis', false, 'Structured outputs'],
  },
];

const DEFAULT_TRAIT_LABELS = ['Vision analysis', 'Audio reasoning', 'Structured outputs'];

const THREE_OPTIONS = [
  {
    id: 'cloud',
    name: 'Managed Cloud',
    headline: 'Zero ops setup',
    traits: ['Hosted infra', 'Live stream', 'SSO auth'],
  },
  {
    id: 'hybrid',
    name: 'Hybrid VPC',
    headline: 'Data stays in-region',
    traits: [false, 'Live stream', 'SSO auth'],
  },
  {
    id: 'onprem',
    name: 'Air-gapped',
    headline: 'Full self-host',
    traits: [false, 'Live stream', false],
  },
];

const THREE_TRAIT_LABELS = ['Hosted infra', 'Live stream', 'SSO auth'];

function renderComparisonCard({
  options = DEFAULT_OPTIONS,
  traitLabels = DEFAULT_TRAIT_LABELS,
  recommendedId = 'gpt-4o',
  reason = 'gpt-4o is recommended for comprehensive multimodal tasks requiring audio and vision understanding.',
} = {}) {
  const optionsHtml = options
    .map((option) => {
      const isRecommended = option.id === recommendedId;

      const traitsHtml = traitLabels
        .map((label, i) => {
          const trait = option.traits[i];
          const absent = !trait;
          const icon = absent ? MINUS_ICON : CHECK_ICON;
          const text = absent ? label : trait;
          return `
            <span class="ds-comparison-card__trait ${absent ? 'ds-comparison-card__trait--absent' : ''}">
              ${icon}
              <span class="ds-truncate">${text}</span>
            </span>
          `;
        })
        .join('');

      return `
        <div
          class="ds-comparison-card__option ds-comp-option ${isRecommended ? 'ds-comparison-card__option--pick ds-comp-option--pick' : ''}"
          data-option-id="${option.id}"
          data-recommended="${isRecommended ? 'true' : 'false'}"
          role="button"
          tabindex="0"
          aria-pressed="${isRecommended ? 'true' : 'false'}"
        >
          <div class="ds-comparison-card__header">
            <span class="ds-comparison-card__title-row">
              <span class="ds-comparison-card__name">${option.name}</span>
              ${
                isRecommended
                  ? `<span class="ds-comparison-card__pick">pick</span>`
                  : ''
              }
            </span>
            <span class="ds-comparison-card__headline">${option.headline}</span>
          </div>
          <div class="ds-comparison-card__traits">
            ${traitsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="comparison-card" class="ds-comparison-card">
      <div class="ds-comparison-card__options">
        ${optionsHtml}
      </div>
      <p class="ds-comparison-card__reason">${reason}</p>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentRec = 'gpt-4o';
    const REASONS = {
      'gpt-4o': 'gpt-4o is recommended for comprehensive multimodal tasks requiring audio and vision understanding.',
      'gpt-4o-mini': 'gpt-4o-mini is recommended when latency under 50ms and high-volume cost minimization are critical priorities.',
      none: 'Both models fit the workload. Select either option above to mark it as the recommended pick.',
    };

    const update = () => {
      const activeReason = currentRec ? (REASONS[currentRec] || REASONS.none) : REASONS.none;
      root.innerHTML = `
        <div class="ds-story-stage">
<div class="ds-story-stage__body">
            <div id="comp-mount">
              ${renderComparisonCard({
                recommendedId: currentRec,
                reason: activeReason,
              })}
            </div>
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-comparison-card__option').forEach((opt) => {
        opt.addEventListener('click', () => {
          const optId = opt.getAttribute('data-option-id');
          if (currentRec === optId) {
            currentRec = '';
          } else {
            currentRec = optId;
          }
          update();
        });
        opt.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            opt.click();
          }
        });
      });
    };

    update();
    return root;
  },
};

export const ThreeOptions = story(`
  <div class="ds-story-stage">
<div class="ds-story-stage__body">
      ${renderComparisonCard({
        options: THREE_OPTIONS,
        traitLabels: THREE_TRAIT_LABELS,
        recommendedId: 'cloud',
        reason: 'Managed Cloud is recommended for rapid prototyping with zero infrastructure overhead.',
      })}
    </div>
  </div>
`);
