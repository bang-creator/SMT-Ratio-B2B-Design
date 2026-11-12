import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Popover', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-popover" data-ds-menu><button class="ds-button ds-button--secondary">Open popover</button><div class="ds-popover__content" hidden><p class="ds-muted">Popover content.</p></div></div>`));
export const States = story('Default / Shared / Popover / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-popover" data-ds-menu><button class="ds-button ds-button--secondary">Open popover</button><div class="ds-popover__content" hidden><p class="ds-muted">Popover content.</p></div></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
