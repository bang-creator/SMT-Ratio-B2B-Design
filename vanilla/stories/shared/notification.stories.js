import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Notification', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-alert" role="status">Your changes were saved.</div>`));
export const States = story('Default / Shared / Notification / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-alert" role="status">Your changes were saved.</div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
