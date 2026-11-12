import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Skeleton', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-stack"><span class="ds-skeleton ds-skeleton--60"></span><span class="ds-skeleton ds-skeleton--40"></span></div>`));
