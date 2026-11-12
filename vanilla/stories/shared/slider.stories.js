import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Slider', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label class="ds-stack"><span class="ds-label">Temperature</span><input type="range" min="0" max="100" value="42"></label>`));
export const States = story('Default / Shared / Slider / States', stage('States', `<div class=\"ds-story-grid\"><div><label class="ds-stack"><span class="ds-label">Temperature</span><input type="range" min="0" max="100" value="42"></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
