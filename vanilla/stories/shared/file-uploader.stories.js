import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / File uploader', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label class="ds-card ds-stack"><strong>Upload file</strong><input class="ds-input" type="file"><span class="ds-muted">PNG, JPG, PDF up to 10 MB</span></label>`));
export const States = story('Default / Shared / File uploader / States', stage('States', `<div class=\"ds-story-grid\"><div><label class="ds-card ds-stack"><strong>Upload file</strong><input class="ds-input" type="file"><span class="ds-muted">PNG, JPG, PDF up to 10 MB</span></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
