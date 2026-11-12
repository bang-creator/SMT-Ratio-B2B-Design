import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Navigation', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<nav class="ds-nav"><a href="#" aria-current="page">Overview</a><a href="#">Settings</a><a href="#">Usage</a></nav>`));
export const States = story('AMS B2B / Application / Navigation / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
