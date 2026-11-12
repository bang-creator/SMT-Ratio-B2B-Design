import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Alert', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-alert ds-alert--caution">Caution message</div>`));
