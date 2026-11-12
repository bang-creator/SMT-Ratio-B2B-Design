import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Content switcher', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-segmented"><button aria-pressed="true">Overview</button><button aria-pressed="false">Details</button><button aria-pressed="false">Activity</button></div>`));
export const States = story('Default / Shared / Content switcher / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-segmented"><button aria-pressed="true">Overview</button><button aria-pressed="false">Details</button><button aria-pressed="false">Activity</button></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
