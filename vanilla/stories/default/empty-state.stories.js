import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Empty state', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<div class="ds-empty"><strong>No data yet</strong><p>Create your first resource to see it here.</p><button class="ds-button ds-button--primary">Create resource</button></div>`));
export const States = story('Default / Application / Empty state / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
