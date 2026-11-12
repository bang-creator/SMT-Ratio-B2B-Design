import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Shared / Button', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default', `<div class="ds-row"><button class="ds-button ds-button--primary">Primary</button><button class="ds-button ds-button--secondary">Secondary</button><button class="ds-button ds-button--outline">Outline</button><button class="ds-button ds-button--ghost">Ghost</button></div>`));
export const States = story('Default / Shared / Button / States', stage('States', `<div class=\"ds-story-grid\"><div><div class="ds-row"><button class="ds-button ds-button--primary">Primary</button><button class="ds-button ds-button--secondary">Secondary</button><button class="ds-button ds-button--outline">Outline</button><button class="ds-button ds-button--ghost">Ghost</button></div></div><div class=\"ds-empty\"><strong>State placeholder</strong><p>Add loading, error, disabled, and focus states.</p></div></div>`));
