import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Spinner', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<span class="ds-spinner" role="status" aria-label="Loading"></span>`));
