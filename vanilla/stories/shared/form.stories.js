import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Form', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<form class="ds-stack"><label><span class="ds-label">Name</span><input class="ds-input" value="Ada Lovelace"></label><button class="ds-button ds-button--primary" type="button">Save</button></form>`));
export const States = story('Default / Shared / Form / States', stage('States', `<div class=\"ds-story-grid\"><div><form class="ds-stack"><label><span class="ds-label">Name</span><input class="ds-input" value="Ada Lovelace"></label><button class="ds-button ds-button--primary" type="button">Save</button></form></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
