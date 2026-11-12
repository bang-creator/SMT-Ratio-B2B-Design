import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Toggle', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<label class="ds-check ds-switch"><span>Enabled</span><button class="ds-switch__control" type="button" role="switch" aria-checked="true" data-ds-switch><span></span></button></label>`));
export const States = story('Default / Shared / Toggle / States', stage('States', `<div class=\"ds-story-grid\"><div><label class="ds-check ds-switch"><span>Enabled</span><button class="ds-switch__control" type="button" role="switch" aria-checked="true" data-ds-switch><span></span></button></label></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
