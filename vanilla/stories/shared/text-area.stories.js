import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Text area', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label><span class="ds-label">Prompt</span><textarea class="ds-textarea" placeholder="Write a prompt"></textarea></label>`));
export const States = story('Default / Shared / Text area / States', stage('States', `<div class=\"ds-story-grid\"><div><label><span class="ds-label">Prompt</span><textarea class="ds-textarea" placeholder="Write a prompt"></textarea></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
