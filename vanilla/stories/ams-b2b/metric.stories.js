import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Metric', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<div class="ds-card"><span class="ds-metric__label">Requests</span><p class="ds-metric__value">12,480</p><span class="ds-metric__detail ds-muted">+12% this week</span></div>`));
export const States = story('AMS B2B / Application / Metric / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
