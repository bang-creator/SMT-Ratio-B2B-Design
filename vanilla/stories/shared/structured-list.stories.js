import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Structured list', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-card ds-stack"><div class="ds-row"><strong>API key</strong><span class="ds-muted">Created today</span></div><div class="ds-row"><strong>Environment</strong><span class="ds-muted">Production</span></div></div>`));
export const States = story('Default / Shared / Structured list / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-card ds-stack"><div class="ds-row"><strong>API key</strong><span class="ds-muted">Created today</span></div><div class="ds-row"><strong>Environment</strong><span class="ds-muted">Production</span></div></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
