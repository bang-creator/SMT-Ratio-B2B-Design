import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Link', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-stack"><a href="#">Default link</a><a href="#" aria-disabled="true">Secondary link</a></div>`));
export const States = story('Default / Shared / Link / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-stack"><a href="#">Default link</a><a href="#" aria-disabled="true">Secondary link</a></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
