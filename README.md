# OpenAI Platform Design System

Token-backed UI for interface prototyping with plain HTML, CSS, and JavaScript. No React app, router, runtime framework, or API client. Storybook is the only preview surface.

## Start

```bash
npm install
npm run storybook
```

Open:

```text
http://127.0.0.1:6006
```

The Storybook tree is the shared review surface for every component, state, token decision, and motion hook. Start at `Default/Shared` for the shared components, then compare `Default/Application` and `SMT Ratio/Application`.

## Use in a plain HTML project

Copy or package these files:

- `vanilla/design-system.css`
- `vanilla/design-system.js`
- `tokens/tokens.css`
- `tokens/tokens.dark.css`

```html
<link rel="stylesheet" href="./design-system.css">
<script type="module" src="./design-system.js"></script>
```

Use the `ds-*` classes and `data-ds-*` attributes shown in the Storybook catalog. No npm dependency is required at runtime.

## Theme

```html
<html data-theme="dark">
```

Use `data-theme="light"` for light mode. Dark mode is the primary reference.

## Token workflow

```bash
npm run tokens:build
npm run tokens:check
npm run build:vanilla
```

Edit `docs/design-system/tokens.json`, regenerate `tokens/`, then review the catalog.

## Feedback workflow

Product feedback becomes a shared DS change only after owner approval. Update the CSS/JS/token source, the Storybook catalog, and `docs/design-system/CHANGELOG.md` together. Fast AI lookup lives in `docs/design-system/AI-QUICK-REFERENCE.md`; rules live in `AGENTS.md`; the cross-project handoff is in `docs/design-system/HANDOFF.md`; the parallel-AI workflow is in `docs/design-system/AI-HANDOFF.md`.
