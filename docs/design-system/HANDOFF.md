# Design system handoff

## Runtime contract

This is a prototyping system. Runtime source is plain HTML, CSS, and JavaScript. Storybook is the only preview surface. No React, router, API client, or framework runtime is required.

Use:

- `vanilla/base.css`: editable component and layout CSS.
- `vanilla/design-system.css`: generated token CSS plus `base.css`.
- `vanilla/design-system.js`: small data-attribute behavior layer.
- `tokens/tokens.css`: light primitives and semantics.
- `tokens/tokens.dark.css`: dark overrides.
- `docs/design-system/tokens.json`: token source of truth.
- `vanilla/stories/`: complete Storybook catalog.

## Commands

```bash
npm install
npm run storybook
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run build:vanilla
npm run build-storybook
```

## Visual contract

- Dark first; light is secondary.
- Compact controls use 32px height.
- Sidebar/topbar `#131313`, canvas/chat `#212121`, elevated/composer `#303030`.
- Active blue `#0285ff`.
- Colors and spacing come from tokens; no literals in component source.
- Respect `prefers-reduced-motion`.

## Feedback workflow

1. Apply product feedback in the Storybook catalog story first.
2. Ask the owner whether it becomes shared DS behavior.
3. If approved, update `vanilla/base.css` or `vanilla/design-system.js`, tokens when needed, the catalog story, and `docs/design-system/CHANGELOG.md`.
4. Re-run all checks before the PR.

For another AI working in parallel, follow [`AI-HANDOFF.md`](AI-HANDOFF.md).
