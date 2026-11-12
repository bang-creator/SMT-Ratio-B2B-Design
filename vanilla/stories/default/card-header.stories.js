import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Card header', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<div class="ds-card"><div class="ds-section-heading"><div><h2>Card title</h2><p class="ds-muted">Supporting description</p></div><button class="ds-button ds-button--ghost">More</button></div></div>`));
export const States = story('Default / Application / Card header / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
