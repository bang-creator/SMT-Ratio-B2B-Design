import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Breadcrumb', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<nav class="ds-breadcrumb" aria-label="Breadcrumb"><a href="#">Workspace</a><span aria-hidden="true">/</span><strong>Current page</strong></nav>`));
export const States = story('Default / Shared / Breadcrumb / States', stage('States', `<div class=\"ds-story-grid\"><div><nav class="ds-breadcrumb" aria-label="Breadcrumb"><a href="#">Workspace</a><span aria-hidden="true">/</span><strong>Current page</strong></nav></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
