import { mount } from '../design-system.js';

export const reserved = (name) => `
  <div class="ds-empty ds-story-reserved" data-component="${name}">
    <strong>${name}</strong><p>Reserved in the catalog. Add the source-matched markup and states here.</p>
  </div>`;

export const story = (title, html, parameters = {}) => ({
  title,
  parameters: { layout: 'padded', ...parameters },
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = html;
    mount(root);
    return root;
  },
});

export const stage = (label, content) => `<section class="ds-story-stage"><header><code>${label}</code></header>${content}</section>`;
