import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Drawer', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-drawer__backdrop" role="dialog" aria-modal="true"><aside class="ds-drawer ds-drawer--right"><div class="ds-dialog__header"><h2>Drawer</h2><button class="ds-icon-button" aria-label="Close">×</button></div></aside></div>`));
