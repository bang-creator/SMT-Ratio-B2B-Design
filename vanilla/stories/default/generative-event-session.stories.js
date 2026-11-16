import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 146 Conference session AUI',
  parameters: { layout: 'padded' },
};

const CHECK_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const CALENDAR_ICON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;

function renderSessionCard({
  track = 'TRACK 2 · AI ENGINEERING',
  title = 'Building Reliable Agent Loops',
  desc = 'A practical look at retries, tool-call verification, and human-in-the-loop patterns for production agents.',
  hall = 'Hall B',
  time = '2:30 PM to 3:15 PM',
  speakers = [
    { name: 'Priya Nair', role: 'Staff Engineer, Agentbase', initials: 'PN' },
  ],
  booked = false,
} = {}) {
  const speakersHtml = speakers
    .map(
      (sp) => `
    <div class="ds-gen-session-card__footer ds-py-1">
      <div class="ds-gen-session-card__speaker">
        <div class="ds-gen-session-card__avatar" aria-label="${sp.name} avatar">
          <span>${sp.initials}</span>
        </div>
        <div class="ds-gen-session-card__speaker-info">
          <span class="ds-gen-session-card__speaker-name">${sp.name}</span>
          <span class="ds-gen-session-card__speaker-role">${sp.role}</span>
        </div>
      </div>
      <button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="view-speaker" data-speaker="${sp.name}">
        Bio
      </button>
    </div>
  `
    )
    .join('');

  return `
    <div class="ds-generative-card ds-gen-session-card" data-slot="generative-card">
      <div class="ds-flex ds-items-center ds-justify-between">
        <span class="ds-gen-session-card__track">${track}</span>
        ${
          booked
            ? `<span class="ds-badge ds-badge--success ds-badge--sm" data-slot="booked-badge">${CHECK_ICON} Added</span>`
            : `<button type="button" class="ds-button ds-button--ghost ds-button--xs" data-action="toggle-schedule">${CALENDAR_ICON} Add</button>`
        }
      </div>

      <h3 class="ds-gen-session-card__title">${title}</h3>
      <p class="ds-gen-session-card__desc">${desc}</p>

      <div class="ds-gen-session-card__meta">
        <span>${hall}</span>
        <span>•</span>
        <span>${time}</span>
      </div>

      <div class="ds-gen-session-card__divider"></div>

      <div class="ds-flex ds-flex-col ds-gap-2">
        ${speakersHtml}
      </div>
    </div>
  `;
}

function attachSessionHandler(root) {
  const toggleBtn = root.querySelector('[data-action="toggle-schedule"]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.outerHTML = `<span class="ds-badge ds-badge--success ds-badge--sm" data-slot="booked-badge">${CHECK_ICON} Added</span>`;
    });
  }

  root.querySelectorAll('[data-action="view-speaker"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-speaker');
      btn.textContent = 'Viewed';
      btn.disabled = true;
    });
  });
}

export const Default = story(
  () => stage(renderSessionCard()),
  { postRender: attachSessionHandler }
);

export const Booked = story(() =>
  stage(
    renderSessionCard({
      booked: true,
      time: '11:00 AM to 12:00 PM',
      hall: 'Main Auditorium',
    })
  )
);

export const Keynote = story(() =>
  stage(
    renderSessionCard({
      track: 'PLENARY KEYNOTE',
      title: 'State of Frontier Intelligence 2026',
      desc: 'Opening keynote unveiling next-generation reasoning architectures, multimodal orchestration, and developer preview capabilities.',
      hall: 'Grand Ballroom A',
      time: '9:00 AM to 10:30 AM',
      speakers: [
        { name: 'Dr. Mira Murati', role: 'Chief Technology Officer', initials: 'MM' },
        { name: 'Greg Brockman', role: 'President & Co-founder', initials: 'GB' },
      ],
      booked: true,
    })
  )
);

export const MultiSpeakerLongContent = story(() =>
  stage(
    renderSessionCard({
      track: 'WORKSHOP & PANEL',
      title: 'Enterprise Safety, Governance, and Scalable Alignment at Scale',
      desc: 'An intensive technical breakout session covering automated evaluations, red-teaming frameworks, compliance policies, and deterministic guardrail pipelines across high-throughput enterprise API deployments.',
      hall: 'Breakout Room 204 (West Wing)',
      time: '3:30 PM to 5:00 PM',
      speakers: [
        { name: 'Dr. Aris Thorne', role: 'VP AI Safety Research, Horizon Labs', initials: 'AT' },
        { name: 'Claire Zhao', role: 'Director of Policy & Governance, ComplianceNet', initials: 'CZ' },
        { name: 'David K. O’Connor', role: 'Principal Security Architect, CloudSecure', initials: 'DO' },
      ],
    })
  )
);
