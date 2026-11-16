import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 04 Typing Indicator',
  parameters: { layout: 'padded' },
};

function renderTypingIndicator({ variant = 'bubble' } = {}) {
  const dots = `
    <span aria-hidden="true" class="ds-typing-indicator__dot"></span>
    <span aria-hidden="true" class="ds-typing-indicator__dot"></span>
    <span aria-hidden="true" class="ds-typing-indicator__dot"></span>
  `.trim();

  if (variant === 'bare') {
    return `
      <div data-slot="typing-indicator" data-variant="bare" role="status" aria-label="Assistant is typing" class="ds-typing-indicator ds-typing-indicator--bare" title="Click to toggle variant">
        ${dots}
      </div>
    `.trim();
  }

  return `
    <div data-slot="typing-indicator" data-variant="bubble" class="ds-typing-indicator ds-typing-indicator--bubble" title="Click to toggle variant">
      <div role="status" aria-label="Assistant is typing" class="ds-typing-indicator__dots">
        ${dots}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Variant Toggle
 * Displays authentic 3-dot bouncing animation with -0.32s, -0.16s, 0s keyframe delays.
 * Click to toggle between Bubble and Bare variants.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let variant = 'bubble';

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>04 Typing Indicator (Interactive Variant Toggle: Bubble / Bare)</code></header>
        <div class="ds-typing-target">
          ${renderTypingIndicator({ variant })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-typing-target');
    target.addEventListener('click', () => {
      variant = variant === 'bubble' ? 'bare' : 'bubble';
      target.innerHTML = renderTypingIndicator({ variant });
    });

    return root;
  },
};

/**
 * Bubble: Distinct structural variant (Paper surface with full pill radius)
 */
export const Bubble = story(
  'Default / Application / 04 Typing Indicator / Bubble',
  stage('Bubble', renderTypingIndicator({ variant: 'bubble' }))
);

/**
 * Bare: Distinct structural variant (Inline dots without paper wrapper)
 */
export const Bare = story(
  'Default / Application / 04 Typing Indicator / Bare',
  stage('Bare', renderTypingIndicator({ variant: 'bare' }))
);
