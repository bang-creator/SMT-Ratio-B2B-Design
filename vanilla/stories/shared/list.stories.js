import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / List', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<ul class="ds-stack"><li>First item</li><li>Second item</li><li>Third item</li></ul>`));
export const States = story('Default / Shared / List / States', stage('States', `<div class=\"ds-story-grid\"><div><ul class="ds-stack"><li>First item</li><li>Second item</li><li>Third item</li></ul></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
