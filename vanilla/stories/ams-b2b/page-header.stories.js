import { story, stage } from '../story-helpers.js';

export default { title: 'AMS B2B / Application / Page header', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('AMS B2B · Default', `<header class="ds-page__header"><div><h1>Page title</h1><p>Supporting description</p></div><button class="ds-button ds-button--primary">Create</button></header>`));
export const States = story('AMS B2B / Application / Page header / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
