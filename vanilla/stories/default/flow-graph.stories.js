import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 49 Flow Graph',
  parameters: { layout: 'padded' },
};

const COL_W = 96;
const ROW_H = 58;
const NODE_W = 78;
const NODE_H = 30;

function computeCenter(node) {
  return {
    x: node.column * COL_W + NODE_W / 2,
    y: node.row * ROW_H + NODE_H / 2,
  };
}

function renderEdges(nodes, edges, activeCount) {
  const visibleNodes = nodes.slice(0, activeCount);
  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  return edges
    .map((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return '';

      const isLive = visibleIds.has(edge.from) && visibleIds.has(edge.to);
      const a = computeCenter(from);
      const b = computeCenter(to);
      const midX = (a.x + b.x) / 2;
      const d = `M ${(a.x + NODE_W / 2).toFixed(1)} ${a.y.toFixed(1)} C ${midX.toFixed(1)} ${a.y.toFixed(1)}, ${midX.toFixed(1)} ${b.y.toFixed(1)}, ${(b.x - NODE_W / 2).toFixed(1)} ${b.y.toFixed(1)}`;

      return `
        <path
          d="${d}"
          class="ds-flow-graph__edge ${isLive ? 'ds-flow-graph__edge--live' : 'ds-flow-graph__edge--pending'}"
          data-live="${isLive}"
        />
      `;
    })
    .join('');
}

function renderNodes(nodes, activeIndex) {
  return nodes
    .map((node, i) => {
      let state = node.state;
      if (activeIndex !== undefined) {
        state = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending';
      }
      const posClass = `ds-flow-pos-c${node.column}-r${node.row}`;

      return `
        <div
          class="ds-flow-node ${posClass} ds-flow-node--${state}"
          data-node-id="${node.id}"
          data-state="${state}"
        >
          <span>${node.label}</span>
        </div>
      `;
    })
    .join('');
}

const DEFAULT_NODES = [
  { id: 'ingest', label: 'Ingest', column: 0, row: 0, state: 'done' },
  { id: 'vectorize', label: 'Vectorize', column: 1, row: 0, state: 'done' },
  { id: 'rerank', label: 'Rerank', column: 1, row: 1, state: 'done' },
  { id: 'synthesize', label: 'Synthesize', column: 2, row: 0, state: 'active' },
  { id: 'output', label: 'Output', column: 3, row: 0, state: 'pending' },
];

const DEFAULT_EDGES = [
  { from: 'ingest', to: 'vectorize' },
  { from: 'ingest', to: 'rerank' },
  { from: 'vectorize', to: 'synthesize' },
  { from: 'rerank', to: 'synthesize' },
  { from: 'synthesize', to: 'output' },
];

function renderFlowGraph({
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  activeIndex,
  activeCount = 5,
} = {}) {
  return `
    <div data-slot="flow-graph" class="ds-flow-graph">
      <div class="ds-flow-graph__stage">
        <svg aria-hidden="true" class="ds-flow-graph__svg" viewBox="0 0 366 88">
          ${renderEdges(nodes, edges, activeCount)}
        </svg>
        ${renderNodes(nodes, activeIndex)}
      </div>
    </div>
  `;
}

function bindFlowEvents(root, nodes, edges) {
  let activeIdx = 3; // 'synthesize'

  function update() {
    const target = root.querySelector('.ds-flow-target');
    if (target) {
      target.innerHTML = renderFlowGraph({
        nodes,
        edges,
        activeIndex: activeIdx,
        activeCount: activeIdx + 1,
      });
      attach();
    }
  }

  function attach() {
    root.querySelectorAll('.ds-flow-node').forEach((nodeEl, i) => {
      nodeEl.addEventListener('click', () => {
        activeIdx = i;
        update();
      });
    });
  }

  attach();
}

export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';
    root.innerHTML = `
      <section class="ds-story-stage">
<div class="ds-flow-target">
          ${renderFlowGraph({ nodes: DEFAULT_NODES, edges: DEFAULT_EDGES, activeIndex: 3, activeCount: 4 })}
        </div>
      </section>
    `;
    bindFlowEvents(root, DEFAULT_NODES, DEFAULT_EDGES);
    return root;
  },
};
