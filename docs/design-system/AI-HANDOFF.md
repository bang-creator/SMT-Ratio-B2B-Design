# AI handoff: plain HTML/CSS/JS

This repository is intentionally framework-free at runtime. Give another AI the checkout or the GitHub repository and have it read `AGENTS.md`, `README.md`, and this file before editing.

## Source map

- `AGENTS.md`: rules and approval boundary.
- `README.md`: runtime usage.
- `CONTRIBUTING.md`: branch and PR workflow.
- `vanilla/base.css`: editable CSS source.
- `vanilla/design-system.js`: editable interaction source.
- `vanilla/stories/`: only preview/catalog.
- `tokens/`: generated token CSS.
- `docs/design-system/tokens.json`: token source.
- `docs/design-system/DESIGN.md`, `HANDOFF.md`, `PUBLIC_EXPORTS.md`, `CHANGELOG.md`: visual contract and decisions.
- `scripts/build_tokens.mjs`, `scripts/build_vanilla.mjs`, `scripts/check_tokens.mjs`, `scripts/check-literals.mjs`: generation and checks.

Do not add React, TypeScript, a router, a component library, an API client, a second preview, standalone demo pages, or generated screenshots.

## Prompt

```text
You are editing a framework-free HTML/CSS/JS design system.

Read AGENTS.md, README.md, docs/design-system/DESIGN.md,
docs/design-system/HANDOFF.md, docs/design-system/PUBLIC_EXPORTS.md,
and docs/design-system/AI-HANDOFF.md.

Task:
<one concrete component or visual feedback item>

Rules:
- Edit vanilla/base.css, vanilla/design-system.js, tokens, or the Storybook catalog.
- Keep dark mode primary and compact controls at 32px.
- Use tokens for color, spacing, radius, motion, and typography.
- Storybook is the only preview surface.
- Do not promote a product experiment into shared behavior without owner approval.
- If approved, update the catalog and CHANGELOG together.

Run:
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run ds:verify
npm run build-storybook

Return changed files, visual behavior, validation output, and commit hash.
```

## Parallel Git workflow

```bash
git clone https://github.com/bang-creator/openai-platform-design-system.git
cd openai-platform-design-system
npm install
git switch -c ai/<task-name>
npm run storybook
```

Push the branch, open a PR, and merge only after owner review. The next AI starts with `git switch main && git pull --ff-only origin main`.
