import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Tag', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-row"><span class="ds-badge">Default</span><span class="ds-filter-chip">Filter <button class="ds-icon-button" aria-label="Remove filter">×</button></span></div>`));
export const States = story('Default / Shared / Tag / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-row"><span class="ds-badge">Default</span><span class="ds-filter-chip">Filter <button class="ds-icon-button" aria-label="Remove filter">×</button></span></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
