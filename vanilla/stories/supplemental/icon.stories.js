import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Icon', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<span class="ds-icon" aria-label="Check">✓</span>`));
