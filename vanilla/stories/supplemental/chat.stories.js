import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Supplemental / Chat', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Existing export', `<div class="ds-chat"><div class="ds-chat__messages"><div class="ds-message ds-message--assistant">How can I help?</div><div class="ds-message ds-message--user">Show usage</div></div><div class="ds-chat__composer"><textarea class="ds-textarea" placeholder="Message"></textarea><button class="ds-button ds-button--primary">Send</button></div></div>`));
