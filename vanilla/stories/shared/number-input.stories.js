import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Number input', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label><span class="ds-label">Quantity</span><input class="ds-input" type="number" value="2" min="0"></label>`));
export const States = story('Default / Shared / Number input / States', stage('States', `<div class=\"ds-story-grid\"><div><label><span class="ds-label">Quantity</span><input class="ds-input" type="number" value="2" min="0"></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
