import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Progress bar', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-stack"><span class="ds-muted">Build progress</span><div class="ds-summary__progress"><span class="ds-summary__line ds-summary__line--pink"></span></div></div>`));
export const States = story('Default / Shared / Progress bar / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-stack"><span class="ds-muted">Build progress</span><div class="ds-summary__progress"><span class="ds-summary__line ds-summary__line--pink"></span></div></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
