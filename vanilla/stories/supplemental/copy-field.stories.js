import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Copy field', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-copy-field"><input class="ds-input" value="proj_demo_123" readonly><button class="ds-button ds-button--secondary">Copy</button></div>`));
