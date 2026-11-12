# AI handoff: editing this design system in parallel

This repo is the source of truth for the reusable OpenAI Platform design system. Another AI can edit it safely when it works in its own Git worktree and reads the local instructions first.

## Source to provide

Give the other AI the repository checkout, or the tracked source archive. The required source is:

- `AGENTS.md`: repository rules and the DS feedback promotion boundary.
- `README.md`: install and library usage.
- `package.json`, `package-lock.json`, `vite.config.ts`, `vite.lib.config.ts`, `tsconfig.json`, `style-dictionary.config.mjs`.
- `.storybook/`: Storybook configuration.
- `src/index.ts`: Public exports approval boundary.
- `src/components/ds.tsx`: shared primitives.
- `src/components/product.tsx`: product/data components.
- `src/components/chat/ChatPanel.tsx`: chat interaction fixture.
- `src/components/*.stories.tsx`: component stories and the complete Public exports catalog.
- `src/styles/app.css`: component and shell styling.
- `src/tokens/`: generated token CSS and motion tokens.
- `docs/design-system/`: visual contract, component contract, provenance, handoff, Public exports map, and changelog.
- `scripts/build_tokens.mjs`, `scripts/check_tokens.mjs`, `scripts/check-literals.mjs`: token and guardrail checks.

Do not copy `.secrets/`, `node_modules/`, `dist/`, `dist-package/`, `storybook-static/`, `.playwright-mcp/`, `output/`, or `reports/fidelity/` into another AI's working source. They are credentials, generated dependencies, generated builds, or QA captures.

## Recommended parallel workflow

Run this from the current checkout. It keeps the other AI isolated from this session's files:

```bash
cd "/Users/bangworkinghub/Documents/ChatGPT/OpenAI Design System"
git status
git worktree add ../openai-ds-ai -b codex/ds-ai main
cd ../openai-ds-ai
npm install
npm run storybook
```

Use this Storybook page as the shared review surface:

```text
http://127.0.0.1:6006/?path=/story/ds-public-exports--catalog
```

When the other AI finishes:

```bash
cd "/Users/bangworkinghub/Documents/ChatGPT/OpenAI Design System"
git diff main..codex/ds-ai --stat
git log main..codex/ds-ai --oneline
git cherry-pick <approved-commit>
git worktree remove ../openai-ds-ai
```

Review the diff before cherry-picking. If both AIs edit the same component, choose one owner for `src/components/ds.tsx` and `src/styles/app.css`; merge token changes separately.

## Prompt for the other AI

```text
You are editing the OpenAI Platform Design System repository.

Read AGENTS.md, README.md, docs/design-system/DESIGN.md,
docs/design-system/HANDOFF.md, docs/design-system/PUBLIC_EXPORTS.md,
and docs/design-system/AI-HANDOFF.md before changing code.

Task:
<paste one concrete component or visual feedback item>

Rules:
- Use the existing components and tokens.
- Keep dark mode as the primary reference.
- Keep compact controls at 32px unless the platform evidence or owner says otherwise.
- Apply product-specific experiments locally first.
- Do not add or change a Public export without explicit owner approval.
- If the owner approves promotion, update the component/token, the matching
  DS / Public exports / Catalog tile, and docs/design-system/CHANGELOG.md.
- Do not add network calls, dependencies, inline styles, or color literals.

Validation:
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run ds:verify
npm run build:library
npm run build-storybook

Return:
- changed files
- visual behavior before/after
- validation output
- commit hash
```

## Approval boundary

The other AI may propose any local product change. Shared DS promotion requires owner approval in the Public exports review. The approval record goes in `docs/design-system/CHANGELOG.md`; the component becomes reusable only when its export and Catalog tile are updated.
