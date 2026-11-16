import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 18 Confidence Marker',
  parameters: { layout: 'padded' },
};

const DEFAULT_CLAIMS = [
  {
    id: '1',
    text: 'The composer owns its draft from 0.14 onward.',
    confidence: 'grounded',
    basis: 'migration-0.14.md',
  },
  {
    id: '2',
    text: 'Most apps will not need the hydrate effect anymore.',
    confidence: 'inferred',
    basis: 'from the changed API',
  },
  {
    id: '3',
    text: 'Removing it should cut a render on every thread switch.',
    confidence: 'uncertain',
    basis: 'not measured',
  },
];

const LABEL = {
  grounded: 'from a source',
  inferred: 'inferred',
  uncertain: 'unverified',
};

function renderConfidenceMarker({
  claims = DEFAULT_CLAIMS,
  hoveredId = '1',
  interactive = true,
} = {}) {
  const hovered = claims.find((c) => c.id === hoveredId);

  const claimsHtml = claims
    .map((c) => {
      const isHovered = c.id === hoveredId;
      const textCls = isHovered ? 'text-foreground/95' : 'text-foreground/70';
      const underCls = `ds-confidence--${c.confidence}`;

      if (interactive) {
        return `<button type="button" data-id="${c.id}" class="ds-claim-btn ${underCls} ${textCls}">${c.text} </button>`;
      }
      return `<span class="${underCls} ${textCls}">${c.text} </span>`;
    })
    .join('');

  const badgeHtml = hovered
    ? `
      <span role="status" class="ds-confidence-badge ds-floating-panel font-mono text-[11px] text-muted-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
        <span aria-hidden="true" class="ds-claim-dot ds-claim-dot--${hovered.confidence} size-1.5 rounded-full"></span>
        ${LABEL[hovered.confidence]} · ${hovered.basis}
      </span>
    `.trim()
    : '';

  return `
    <div data-slot="confidence-marker" class="ds-confidence-marker flex w-full max-w-sm flex-col gap-2.5">
      <p class="text-[13.5px] leading-relaxed">
        ${claimsHtml}
      </p>

      <div class="ds-confidence-footer flex h-9 items-start">
        ${badgeHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Confidence Marker
 * Highlights claims with confidence underlines (emerald grounded, amber inferred, red dotted uncertain).
 * Hovering or clicking any claim displays its evidence basis in the floating status chip.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>18 Confidence Marker (Interactive Evidence Inspection)</code></header>
        <div class="ds-confidence-target">
          ${renderConfidenceMarker({ hoveredId: '1' })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-confidence-target');
    const updateHover = (id) => {
      target.querySelectorAll('.ds-claim-btn').forEach((btn) => {
        const isHovered = btn.getAttribute('data-id') === id;
        btn.classList.toggle('text-foreground/95', isHovered);
        btn.classList.toggle('text-foreground/70', !isHovered);
      });
      const footer = target.querySelector('.ds-confidence-footer');
      if (!footer) return;
      const hovered = DEFAULT_CLAIMS.find((c) => c.id === id);
      if (hovered) {
        footer.innerHTML = `
          <span role="status" class="ds-confidence-badge ds-floating-panel font-mono text-[11px] text-muted-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1.5">
            <span aria-hidden="true" class="ds-claim-dot ds-claim-dot--${hovered.confidence} size-1.5 rounded-full"></span>
            ${LABEL[hovered.confidence]} · ${hovered.basis}
          </span>
        `.trim();
      } else {
        footer.innerHTML = '';
      }
    };

    target.querySelectorAll('.ds-claim-btn').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        updateHover(btn.getAttribute('data-id'));
      });
      btn.addEventListener('click', () => {
        updateHover(btn.getAttribute('data-id'));
      });
    });
    return root;
  },
};

/**
 * Grounded: Static verified claim
 */
export const Grounded = story(
  'Default / Application / 18 Confidence Marker / Grounded',
  stage('Verified Source', renderConfidenceMarker({ hoveredId: '1', interactive: false }))
);

/**
 * Uncertain: Static unverified claim
 */
export const Uncertain = story(
  'Default / Application / 18 Confidence Marker / Uncertain',
  stage('Unverified Claim', renderConfidenceMarker({ hoveredId: '3', interactive: false }))
);
