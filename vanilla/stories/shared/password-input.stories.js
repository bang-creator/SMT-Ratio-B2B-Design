import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Password input', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label><span class="ds-label">Password</span><input class="ds-input" type="password" value="secret"></label>`));
export const States = story('Default / Shared / Password input / States', stage('States', `<div class=\"ds-story-grid\"><div><label><span class="ds-label">Password</span><input class="ds-input" type="password" value="secret"></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
