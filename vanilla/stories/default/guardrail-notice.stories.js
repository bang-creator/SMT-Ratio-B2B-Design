import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 06 Guardrail Notice',
  parameters: { layout: 'padded' },
};

const SHIELD_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;

const POLICIES = [
  {
    title: "I can't generate exploit payloads",
    explanation: 'I cannot generate exploit payloads, buffer overflows, or malware intended to target systems. I can help explain the vulnerability or show how to patch it.',
    policy: 'safety',
    alternatives: [
      'Explain how buffer overflows work',
      'Show safe bounds-checking in C',
      'Suggest static analysis tools to catch overflows',
    ],
  },
  {
    title: "I can't share that",
    explanation: "This asks for another person's home address. I don't look up private details about individuals.",
    policy: 'privacy',
    alternatives: [],
  },
  {
    title: "I can't write a script that bypasses the login on this router",
    explanation: "Breaking into a device without the owner's permission is unauthorized access, even on a network you use every day. If the router is yours, a factory reset gets you back in, and I can walk you through securing it afterwards.",
    policy: 'security',
    alternatives: [
      'Show me how to factory reset a Netgear R7000',
      'Explain how to set a strong admin password',
      'Check my router config for open ports',
      'Explain how default credential attacks work',
    ],
  },
];

function renderGuardrailNotice({
  title = "I can't generate exploit payloads",
  explanation = 'I cannot generate exploit payloads, buffer overflows, or malware intended to target systems. I can help explain the vulnerability or show how to patch it.',
  policy = 'safety',
  alternatives = [],
} = {}) {
  const altsHtml = alternatives.length > 0
    ? `
      <div class="ds-guardrail-notice__alternatives">
        <span class="ds-guardrail-notice__section-title font-mono text-muted-foreground">try instead</span>
        ${alternatives
          .map(
            (alt) =>
              `<button type="button" class="ds-guardrail-notice__alt-btn text-start">${alt}</button>`
          )
          .join('')}
      </div>
    `.trim()
    : '';

  return `
    <div data-slot="guardrail-notice" class="ds-guardrail-notice">
      <div class="ds-guardrail-notice__header">
        <span class="ds-guardrail-notice__icon size-7" title="Click shield to cycle policy">
          ${SHIELD_ICON}
        </span>
        <span class="ds-guardrail-notice__title truncate">${title}</span>
        <span class="ds-guardrail-notice__policy font-mono text-muted-foreground">${policy}</span>
      </div>
      <p class="ds-guardrail-notice__explanation">
        ${explanation}
      </p>
      ${altsHtml}
    </div>
  `.trim();
}

/**
 * Default: Interactive Guardrail Notice
 * Shows amber shield icon, truncated title, monospace policy badge, and interactive suggestions.
 * Clicking the shield icon or any suggestion cycles through real-world policies (safety, privacy, security).
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let currentIdx = 0;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>06 Guardrail Notice (Interactive Policy Switcher)</code></header>
        <div class="ds-guardrail-target">
          ${renderGuardrailNotice(POLICIES[currentIdx])}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-guardrail-target');

    const bindEvents = () => {
      const icon = target.querySelector('.ds-guardrail-notice__icon');
      if (icon) {
        icon.addEventListener('click', () => {
          currentIdx = (currentIdx + 1) % POLICIES.length;
          target.innerHTML = renderGuardrailNotice(POLICIES[currentIdx]);
          bindEvents();
        });
      }
      target.querySelectorAll('.ds-guardrail-notice__alt-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentIdx = (currentIdx + 1) % POLICIES.length;
          target.innerHTML = renderGuardrailNotice(POLICIES[currentIdx]);
          bindEvents();
        });
      });
    };

    bindEvents();
    return root;
  },
};

/**
 * NoAlternative: Refusal with no suggestion list (privacy policy)
 */
export const NoAlternative = story(
  'Default / Application / 06 Guardrail Notice / No Alternative',
  stage('No Alternative', renderGuardrailNotice(POLICIES[1]))
);

/**
 * LongNotice: Stacked suggestions under a security warning
 */
export const LongNotice = story(
  'Default / Application / 06 Guardrail Notice / Long Notice',
  stage('Long Notice', renderGuardrailNotice(POLICIES[2]))
);
