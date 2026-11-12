import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Contained list', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-card ds-stack"><strong>Contained list</strong><div class="ds-row"><span>Item one</span><span class="ds-badge">3</span></div><div class="ds-row"><span>Item two</span><span class="ds-badge">8</span></div></div>`));
export const States = story('Default / Shared / Contained list / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-card ds-stack"><strong>Contained list</strong><div class="ds-row"><span>Item one</span><span class="ds-badge">3</span></div><div class="ds-row"><span>Item two</span><span class="ds-badge">8</span></div></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
