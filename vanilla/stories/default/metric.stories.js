import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Metric', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<div class="ds-card"><span class="ds-metric__label">Requests</span><p class="ds-metric__value">12,480</p><span class="ds-metric__detail ds-muted">+12% this week</span></div>`));
export const States = story('Default / Application / Metric / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
