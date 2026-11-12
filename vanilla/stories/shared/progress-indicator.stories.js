import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Progress indicator', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-row"><span class="ds-step ds-step--done">1</span><span class="ds-step ds-step--done">2</span><span class="ds-step">3</span><span class="ds-muted">Complete</span></div>`));
export const States = story('Default / Shared / Progress indicator / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-row"><span class="ds-step ds-step--done">1</span><span class="ds-step ds-step--done">2</span><span class="ds-step">3</span><span class="ds-muted">Complete</span></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
