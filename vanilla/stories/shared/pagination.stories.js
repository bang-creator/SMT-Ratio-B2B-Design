import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Pagination', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<nav class="ds-pagination" aria-label="Pagination"><button class="ds-button ds-button--ghost">Previous</button><span aria-current="page">2 / 4</span><button class="ds-button ds-button--ghost">Next</button></nav>`));
export const States = story('Default / Shared / Pagination / States', stage('States', `<div class=\"ds-story-grid\"><div><nav class="ds-pagination" aria-label="Pagination"><button class="ds-button ds-button--ghost">Previous</button><span aria-current="page">2 / 4</span><button class="ds-button ds-button--ghost">Next</button></nav></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
