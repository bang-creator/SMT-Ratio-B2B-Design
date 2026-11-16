import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 25 File Tree',
  parameters: { layout: 'padded' },
};

const CHEVRON_DOWN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const FOLDER_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path></svg>`;
const FILE_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ds-tool-timeline__step-icon" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;

const FULL_NODES = [
  { path: 'packages', name: 'packages', depth: 0, kind: 'folder' },
  { path: 'packages/react', name: 'react', depth: 1, kind: 'folder' },
  { path: 'packages/react/composer.tsx', name: 'composer.tsx', depth: 2, kind: 'file', additions: 14, deletions: 3 },
  { path: 'packages/react/thread.tsx', name: 'thread.tsx', depth: 2, kind: 'file', additions: 28, deletions: 12 },
  { path: 'packages/core', name: 'core', depth: 1, kind: 'folder' },
  { path: 'packages/core/use-draft.ts', name: 'use-draft.ts', depth: 2, kind: 'file', additions: 42 },
];

const SIMPLE_NODES = [
  { path: 'src', name: 'src', depth: 0, kind: 'folder' },
  { path: 'src/index.ts', name: 'index.ts', depth: 1, kind: 'file', additions: 12 },
];

function renderFileTree({
  nodes = FULL_NODES,
  totalAdditions = 84,
  totalDeletions = 15,
} = {}) {
  const filesCount = nodes.filter((n) => n.kind === 'file').length;

  const nodesHtml = nodes
    .map((node) => {
      const depthClass = `ds-tree-depth-${Math.min(node.depth, 4)}`;
      if (node.kind === 'folder') {
        return `
          <div class="ds-file-tree__node ${depthClass}">
            ${CHEVRON_DOWN}
            ${FOLDER_ICON}
            <span class="ds-truncate">${node.name}</span>
          </div>
        `;
      }
      return `
        <div class="ds-file-tree__node ${depthClass}">
          ${FILE_ICON}
          <span class="ds-truncate">${node.name}</span>
          <span class="ds-code-diff__stats ds-ml-auto">
            ${node.additions ? `<span class="ds-diff-stat-add">+${node.additions}</span>` : ''}
            ${node.deletions ? `<span class="ds-diff-stat-remove">−${node.deletions}</span>` : ''}
          </span>
        </div>
      `;
    })
    .join('');

  return `
    <div data-slot="file-tree" class="ds-file-tree" title="Click header to toggle scope">
      <div class="ds-file-tree__header ds-file-tree-clickable">
        <span>${filesCount} files changed</span>
        <span class="ds-code-diff__stats">
          <span class="ds-diff-stat-add">+${totalAdditions}</span>
          <span class="ds-diff-stat-remove">−${totalDeletions}</span>
        </span>
      </div>
      <div>
        ${nodesHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive File Tree
 * Hierarchical file tree with folder expansion and line change indicators.
 * Click header to toggle between multi-package repository tree and single-module view.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let isFull = true;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>25 File Tree (Interactive Repository Scope)</code></header>
        <div class="ds-tree-target">
          ${renderFileTree({ nodes: FULL_NODES, totalAdditions: 84, totalDeletions: 15 })}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-tree-target');

    const bindHeader = () => {
      const header = target.querySelector('.ds-file-tree-clickable');
      if (header) {
        header.addEventListener('click', () => {
          isFull = !isFull;
          target.innerHTML = renderFileTree(
            isFull
              ? { nodes: FULL_NODES, totalAdditions: 84, totalDeletions: 15 }
              : { nodes: SIMPLE_NODES, totalAdditions: 12, totalDeletions: 0 }
          );
          bindHeader();
        });
      }
    };

    bindHeader();
    return root;
  },
};

/**
 * Simple: Compact single-module view
 */
export const Simple = story(
  'Default / Application / 25 File Tree / Simple',
  stage('Single Module', renderFileTree({ nodes: SIMPLE_NODES, totalAdditions: 12, totalDeletions: 0 }))
);
