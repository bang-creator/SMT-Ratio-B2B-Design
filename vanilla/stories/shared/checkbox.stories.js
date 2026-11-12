import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Checkbox', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label class="ds-check"><input type="checkbox" checked><span>Enabled option</span></label>`));
export const States = story('Default / Shared / Checkbox / States', stage('States', `<div class=\"ds-story-grid\"><div><label class="ds-check"><input type="checkbox" checked><span>Enabled option</span></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
