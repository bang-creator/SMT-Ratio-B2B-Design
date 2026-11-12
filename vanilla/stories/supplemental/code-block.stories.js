import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Code block', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<pre class="ds-code"><code>const response = await client.responses.create();</code></pre>`));
