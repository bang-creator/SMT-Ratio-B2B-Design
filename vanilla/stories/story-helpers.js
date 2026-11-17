import { mount } from '../design-system.js';

export const reserved = (name) => `
  <div class="ds-empty ds-story-reserved" data-component="${name}">
    <strong>${name}</strong><p>Reserved in the catalog. Add the source-matched markup and states here.</p>
  </div>`;

export const story = (titleOrHtmlOrFn, maybeHtml, parameters = {}) => ({
  parameters: { layout: 'padded', ...(typeof maybeHtml === 'object' && maybeHtml !== null ? maybeHtml : parameters) },
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    let content = '';
    if (typeof titleOrHtmlOrFn === 'function') {
      content = titleOrHtmlOrFn();
    } else if (maybeHtml !== undefined && typeof maybeHtml === 'string') {
      content = maybeHtml;
    } else if (typeof titleOrHtmlOrFn === 'string') {
      content = titleOrHtmlOrFn;
    }
    root.innerHTML = content;
    mount(root);
    return root;
  },
});

export const stage = (labelOrContent, maybeContent) => {
  const content = maybeContent !== undefined ? maybeContent : labelOrContent;
  return `<section class="ds-story-stage">${content}</section>`;
};
