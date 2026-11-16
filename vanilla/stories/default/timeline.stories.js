import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 54 Timeline',
  parameters: { layout: 'padded' },
};

const DEFAULT_STAGES = [
  { time: '10:00', title: 'Repository scan', detail: 'Analyzed 151 component definitions' },
  { time: '10:02', title: 'Dependency resolution', detail: 'Indexed token dependencies' },
  { time: '10:05', title: 'Audit execution', detail: 'Evaluating computed styles and layout' },
  { time: '10:08', title: 'Report generation', detail: 'Markdown documentation and screenshots' },
];

function renderTimelineEvents(events) {
  return events
    .map(
      (e, i) => `
    <div class="ds-timeline-item" data-id="${e.id || i}" data-when="${e.when}" role="button" tabindex="0">
      <span class="ds-timeline-time">${e.time}</span>
      <div class="ds-timeline-track">
        <span class="ds-timeline-dot ds-timeline-dot--${e.when}"></span>
        ${i < events.length - 1 ? '<span class="ds-timeline-line"></span>' : ''}
      </div>
      <div class="ds-timeline-content ${i < events.length - 1 ? 'ds-timeline-content--has-next' : ''}">
        <span class="ds-timeline-title ${e.when === 'now' ? 'ds-timeline-title--now' : e.when === 'future' ? 'ds-timeline-title--future' : ''}">${e.title}</span>
        ${e.detail ? `<span class="ds-timeline-detail">${e.detail}</span>` : ''}
      </div>
    </div>
  `
    )
    .join('');
}

function getEvents(step, stages = DEFAULT_STAGES) {
  return stages.map((s, i) => {
    let when = 'future';
    if (i < step) when = 'past';
    else if (i === step) when = 'now';
    return { ...s, when, id: `stage-${i}` };
  });
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentStep = 1;

    const render = () => {
      const activeStage = DEFAULT_STAGES[currentStep];
      root.innerHTML = `
        <div class="ds-story-stage">
          <div class="ds-story-stage__header">
            <span class="ds-story-stage__title">54 Timeline</span>
            <span class="ds-badge ds-badge--subtle ds-badge--sm">Step ${currentStep + 1} of ${DEFAULT_STAGES.length}: ${activeStage.title}</span>
          </div>
          <div class="ds-story-stage__body">
            <div data-slot="timeline" class="ds-timeline-card">
              ${renderTimelineEvents(getEvents(currentStep))}
            </div>
          </div>
        </div>
      `;

      root.querySelectorAll('.ds-timeline-item').forEach((item, index) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          currentStep = index;
          render();
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            currentStep = index;
            render();
          }
        });
      });
    };

    render();
    return root;
  },
};

export const Streaming = story(`
  <div class="ds-story-stage">
    <div class="ds-story-stage__header">
      <span class="ds-story-stage__title">54 Timeline (Streaming)</span>
      <span class="ds-badge ds-badge--subtle ds-badge--sm">2 of 4 Events Arrived</span>
    </div>
    <div class="ds-story-stage__body">
      <div data-slot="timeline" class="ds-timeline-card">
        ${renderTimelineEvents(getEvents(1).slice(0, 2))}
      </div>
    </div>
  </div>
`);
