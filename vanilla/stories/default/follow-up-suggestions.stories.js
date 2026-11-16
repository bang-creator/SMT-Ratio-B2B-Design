import { story } from '../story-helpers.js';

export default {
  title: 'Default / Application / 112 Follow-up suggestions AUI',
  parameters: { layout: 'padded' },
};

const ARROW_UP_RIGHT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-followup-chip__icon" aria-hidden="true"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`;

const QUESTION = 'Our checkout conversion dropped 8% last week. Where should I look first?';
const ANSWER = 'Start with the payment step. The drop lines up with the new address form, and mobile Safari sessions abandon there twice as often as last month.';

function renderChips({ suggestions = [], showFade = false } = {}) {
  if (!suggestions || suggestions.length === 0) return '';
  return `
    <div class="ds-followup-container" data-slot="follow-up-container">
      <div
        data-slot="follow-up-suggestions"
        class="ds-followup-wrap"
        role="group"
        aria-label="Suggested follow-up questions"
      >
        ${suggestions
          .map((s, idx) => {
            const hasTitle = Boolean(s.title);
            return `
          <button
            type="button"
            class="ds-followup-chip"
            data-slot="followup-chip"
            data-index="${idx}"
            data-prompt="${s.prompt}"
            aria-label="${s.prompt}"
          >
            ${
              hasTitle
                ? `<span class="ds-followup-chip__title">${s.title}</span><span class="ds-followup-chip__label">· ${s.label}</span>`
                : `<span class="ds-followup-chip__title">${s.prompt}</span>`
            }
            ${ARROW_UP_RIGHT}
          </button>
        `;
          })
          .join('')}
      </div>
      ${showFade ? '<div class="ds-followup-fade-right" aria-hidden="true"></div>' : ''}
    </div>
  `;
}

function renderFixture({
  question = QUESTION,
  answer = ANSWER,
  suggestions = [],
  isRunning = false,
  showFade = false,
} = {}) {
  return `
    <div class="ds-followup-fixture" data-slot="fixture">
      <div class="ds-followup-fixture__user">
        <div class="ds-followup-fixture__user-bubble">${question}</div>
      </div>
      <div class="ds-followup-fixture__assistant">${answer}</div>
      <div class="ds-followup-fixture__chips" data-slot="chips-mount">
        ${isRunning ? '' : renderChips({ suggestions, showFade })}
      </div>
    </div>
  `;
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <div class="ds-stack-v">
        <div class="ds-text-secondary ds-text-xs" data-slot="hint">
          Click any suggestion chip below to dispatch that follow-up prompt:
        </div>
        ${renderFixture({
          suggestions: [
            { prompt: 'Compare mobile Safari to Chrome' },
            { prompt: 'Which address fields cause the most errors?' },
            { prompt: 'Draft an A/B test for the old form' },
          ],
        })}
      </div>
    `;

    const chipsMount = root.querySelector('[data-slot="chips-mount"]');
    const hint = root.querySelector('[data-slot="hint"]');

    function attachListeners() {
      root.querySelectorAll('[data-slot="followup-chip"]').forEach((chip) => {
        chip.addEventListener('click', () => {
          const prompt = chip.getAttribute('data-prompt');
          if (hint) {
            hint.textContent = `Dispatched: "${prompt}"`;
          }
          if (chipsMount) {
            chipsMount.innerHTML = renderChips({
              suggestions: [
                { prompt: 'Generate SQL query for device breakdown' },
                { prompt: 'Export telemetry report to CSV' },
              ],
            });
            attachListeners();
          }
        });
      });
    }

    attachListeners();
    return root;
  },
};

export const Single = story(
  () => renderFixture({
    suggestions: [{ prompt: 'Compare mobile Safari to Chrome' }],
    showFade: false,
  })
);

export const WithLabels = story(
  () => renderFixture({
    suggestions: [
      {
        title: 'Funnel',
        label: 'by device',
        prompt: 'Break the checkout funnel down by device',
      },
      {
        title: 'Sessions',
        label: 'last 7 days',
        prompt: 'Show recorded sessions that abandoned at payment',
      },
      {
        title: 'Rollback',
        label: 'address form',
        prompt: 'What happens if we roll back the address form?',
      },
    ],
    showFade: false,
  })
);

export const Running = story(
  () => renderFixture({
    isRunning: true,
    suggestions: [{ prompt: 'Compare mobile Safari to Chrome' }],
  })
);

export const LongContent = story(
  () => renderFixture({
    suggestions: [
      { prompt: 'Compare mobile Safari to Chrome' },
      { prompt: 'Which address fields cause the most errors?' },
      { prompt: 'Draft an A/B test for the old form' },
      { prompt: 'Estimate the revenue impact of the drop' },
      { prompt: 'Write a short incident summary for the team' },
      { prompt: 'List every checkout change shipped this month' },
    ],
    showFade: true,
  })
);
