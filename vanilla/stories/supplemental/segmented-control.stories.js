import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Segmented control', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-segmented"><button aria-pressed="true">Day</button><button aria-pressed="false">Week</button></div>`));
