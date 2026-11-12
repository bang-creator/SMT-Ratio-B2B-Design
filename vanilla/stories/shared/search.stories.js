import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Search', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label><span class="ds-label">Search</span><input class="ds-input" type="search" placeholder="Search models"></label>`));
export const States = story('Default / Shared / Search / States', stage('States', `<div class=\"ds-story-grid\"><div><label><span class="ds-label">Search</span><input class="ds-input" type="search" placeholder="Search models"></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
