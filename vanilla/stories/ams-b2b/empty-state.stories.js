import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Empty state', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<div class="ds-empty"><strong>No data yet</strong><p>Create your first resource to see it here.</p><button class="ds-button ds-button--primary">Create resource</button></div>`));
export const States = story('AMS B2B / Application / Empty state / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
