import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Section footer', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<footer class="ds-row"><span class="ds-muted">Last updated today</span><button class="ds-button ds-button--secondary">View all</button></footer>`));
export const States = story('AMS B2B / Application / Section footer / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
