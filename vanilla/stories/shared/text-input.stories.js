import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Text input', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label><span class="ds-label">Project name</span><input class="ds-input" placeholder="My project"></label>`));
export const States = story('Default / Shared / Text input / States', stage('States', `<div class=\"ds-story-grid\"><div><label><span class="ds-label">Project name</span><input class="ds-input" placeholder="My project"></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
