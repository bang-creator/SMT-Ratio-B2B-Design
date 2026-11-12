import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Toast', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-toast" role="status"><span>Changes saved.</span><button class="ds-button ds-button--ghost">Undo</button></div>`));
