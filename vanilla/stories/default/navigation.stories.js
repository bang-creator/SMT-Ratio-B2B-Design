import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / Navigation',
  parameters: { layout: 'padded' },
};

/* Source: Sidebar navigation links on platform.openai.com
 * Ground truth:
 * - 14px font, 500 weight, 32px item height
 * - Hover highlight, active item styling */

export const Default = story(
  'Default / Application / Navigation / Default',
  stage(
    'Sidebar Primary Navigation',
    `<nav class="ds-nav ds-stack" aria-label="Main sidebar navigation">
      <a href="#" class="ds-nav__item" aria-current="page">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>Overview</span>
      </a>
      <a href="#" class="ds-nav__item">
        <svg viewBox="0 0 24 24" class="ds-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        <span>API Keys</span>
      </a>
      <a href="#" class="ds-nav__item">
        <svg viewBox="0 0 24 24" class="ds-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        <span>Storage & Files</span>
      </a>
      <a href="#" class="ds-nav__item">
        <svg viewBox="0 0 24 24" class="ds-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span>Settings</span>
      </a>
    </nav>`
  )
);

export const Horizontal = story(
  'Default / Application / Navigation / Horizontal',
  stage(
    'Horizontal Tabs Navigation',
    `<nav class="ds-nav ds-row" aria-label="Section navigation">
      <a href="#" class="ds-nav__item" aria-current="page">General</a>
      <a href="#" class="ds-nav__item">Rate limits</a>
      <a href="#" class="ds-nav__item">Usage & Billing</a>
      <a href="#" class="ds-nav__item">Security</a>
    </nav>`
  )
);
