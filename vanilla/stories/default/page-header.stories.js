import { story, stage } from '../story-helpers.js';

export default { title: 'Default / Application / Page header', parameters: { layout: 'padded' } };
export const Default = story('Default', stage('Default · Default', `<header class="ds-page__header"><div><h1>Page title</h1><p>Supporting description</p></div><button class="ds-button ds-button--primary">Create</button></header>`));
export const States = story('Default / Application / Page header / States', stage('States', `<div class=\"ds-empty\"><strong>State placeholder</strong><p>Add brand-specific states and variants.</p></div>`));
