import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Section header', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<div class="ds-section-heading"><div><h2>Section title</h2><p class="ds-muted">Section description</p></div></div>`));
export const States = story('Default / Application / Section header / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
