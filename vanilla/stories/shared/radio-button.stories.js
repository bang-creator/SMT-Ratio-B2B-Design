import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Radio button', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-stack"><label class="ds-check"><input type="radio" name="shared-radio" checked><span>Option A</span></label><label class="ds-check"><input type="radio" name="shared-radio"><span>Option B</span></label></div>`));
export const States = story('Default / Shared / Radio button / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-stack"><label class="ds-check"><input type="radio" name="shared-radio" checked><span>Option A</span></label><label class="ds-check"><input type="radio" name="shared-radio"><span>Option B</span></label></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
