import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Chart', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<div class="ds-bar-chart"><div class="ds-bar-chart__row"><span>Mon</span><span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--high"></span></span><strong>84</strong></div><div class="ds-bar-chart__row"><span>Tue</span><span class="ds-bar-chart__track"><span class="ds-bar-chart__bar ds-bar-chart__bar--medium"></span></span><strong>57</strong></div></div>`));
export const States = story('AMS B2B / Application / Chart / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
