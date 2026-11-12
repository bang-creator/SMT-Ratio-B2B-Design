import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Filter chip', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<span class="ds-filter-chip">Status: Ready <button class="ds-icon-button" aria-label="Remove">×</button></span>`));
