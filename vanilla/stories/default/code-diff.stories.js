import { story, stage } from '../story-helpers.js';

export default {
  title: 'Default / Application / 23 Code Diff',
  parameters: { layout: 'padded' },
};

const FILES = [
  {
    filename: 'use-draft.ts',
    additions: 5,
    deletions: 2,
    lines: [
      { kind: 'context', text: 'export function useDraft(threadId: string) {' },
      { kind: 'removed', text: '  const key = "draft";' },
      { kind: 'added', text: '  const key = `draft:${threadId}`;' },
      { kind: 'removed', text: '  const [state, setState] = useState("");' },
      { kind: 'added', text: '  const [draft, setDraft] = useState(() => localStorage.getItem(key) ?? "");' },
      { kind: 'added', text: '  useEffect(() => localStorage.setItem(key, draft), [key, draft]);' },
      { kind: 'added', text: '  return [draft, setDraft] as const;' },
      { kind: 'context', text: '}' },
    ],
  },
  {
    filename: 'composer-store.ts',
    additions: 4,
    deletions: 0,
    lines: [
      { kind: 'added', text: 'import { create } from "zustand";' },
      { kind: 'added', text: '' },
      { kind: 'added', text: 'export const ' + 'useComposerStore = create((set) => ({' },
      { kind: 'added', text: '  text: "",' },
      { kind: 'added', text: '  setText: (text) => set({ text }),' },
      { kind: 'added', text: '}));' },
    ],
  },
  {
    filename: 'legacy-adapter.ts',
    additions: 0,
    deletions: 3,
    lines: [
      { kind: 'removed', text: '// Deprecated adapter from v0.2' },
      { kind: 'removed', text: 'export class LegacyAdapter {' },
      { kind: 'removed', text: '  transform(req) { return req; }' },
      { kind: 'removed', text: '}' },
    ],
  },
];

function renderCodeDiff({
  filename = 'use-draft.ts',
  additions = 5,
  deletions = 2,
  lines = FILES[0].lines,
} = {}) {
  const GUTTER = {
    context: '',
    added: '+',
    removed: '−',
  };

  const linesHtml = lines
    .map(
      (l) => `
    <div class="ds-code-diff__line ds-code-diff__line--${l.kind}">
      <span class="ds-code-diff__gutter">${GUTTER[l.kind]}</span>
      <span>${l.text}</span>
    </div>
  `
    )
    .join('');

  return `
    <div data-slot="code-diff" class="ds-code-diff" title="Click header to cycle file diff">
      <div class="ds-code-diff__header ds-code-diff-clickable">
        <span class="ds-code-diff__filename">${filename}</span>
        <span class="ds-code-diff__stats">
          <span class="ds-diff-stat-add">+${additions}</span>
          <span class="ds-diff-stat-remove">−${deletions}</span>
        </span>
      </div>
      <div class="ds-code-diff__viewport">
        ${linesHtml}
      </div>
    </div>
  `.trim();
}

/**
 * Default: Interactive Code Diff
 * Click header to cycle across different file diff scenarios.
 */
export const Default = {
  render: () => {
    const root = document.createElement('div');
    root.className = 'ds-story';

    let fileIdx = 0;

    root.innerHTML = `
      <section class="ds-story-stage">
        <header><code>23 Code Diff (Interactive File Cycling)</code></header>
        <div class="ds-diff-target">
          ${renderCodeDiff(FILES[fileIdx])}
        </div>
      </section>
    `;

    const target = root.querySelector('.ds-diff-target');

    const bindHeader = () => {
      const header = target.querySelector('.ds-code-diff-clickable');
      if (header) {
        header.addEventListener('click', () => {
          fileIdx = (fileIdx + 1) % FILES.length;
          target.innerHTML = renderCodeDiff(FILES[fileIdx]);
          bindHeader();
        });
      }
    };

    bindHeader();
    return root;
  },
};

/**
 * PureAdditions: Only additions
 */
export const PureAdditions = story(
  'Default / Application / 23 Code Diff / Pure Additions',
  stage('Pure Additions', renderCodeDiff(FILES[1]))
);

/**
 * PureDeletions: Only deletions
 */
export const PureDeletions = story(
  'Default / Application / 23 Code Diff / Pure Deletions',
  stage('Pure Deletions', renderCodeDiff(FILES[2]))
);
