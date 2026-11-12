import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Navigation', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<nav class="ds-nav"><a href="#" aria-current="page">Overview</a><a href="#">Settings</a><a href="#">Usage</a></nav>`));
export const States = story('Default / Application / Navigation / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
