import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Badge', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<span class="ds-badge">New</span>`));
