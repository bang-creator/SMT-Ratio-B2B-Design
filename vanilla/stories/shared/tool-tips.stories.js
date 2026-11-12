import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Tool tips', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<span class="ds-tooltip"><button class="ds-button ds-button--ghost">Hover or focus</button><span class="ds-tooltip__content" role="tooltip">Token-backed tooltip.</span></span>`));
export const States = story('Default / Shared / Tool tips / States', stage('States', `<div class=\"ds-story-grid\"><div><span class="ds-tooltip"><button class="ds-button ds-button--ghost">Hover or focus</button><span class="ds-tooltip__content" role="tooltip">Token-backed tooltip.</span></span></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
