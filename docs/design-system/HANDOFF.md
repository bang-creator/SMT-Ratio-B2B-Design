# Design system handoff

## What to install

The package is local and versioned as `openai-platform-design-system@0.1.0`.

```bash
cd "/Users/bangworkinghub/Documents/ChatGPT/OpenAI Design System"
npm install
npm run build:library
cd ../your-next-project
npm install "../OpenAI Design System"
```

Import the stylesheet once from the app root:

```tsx
import 'openai-platform-design-system/styles.css';
```

Then import components from the package root:

```tsx
import { Button, Card, DatePicker, Field, Input, Select, Switch } from 'openai-platform-design-system';
```

## Theme and visual contract

- Dark is the default review mode: `document.documentElement.dataset.theme = 'dark'`.
- Light mode: set `data-theme="light"` on the document root.
- Compact control height is 32px. Textareas and chat surfaces keep their content-driven height.
- Platform dark surfaces: sidebar/topbar `#131313`, canvas/chat `#212121`, elevated/composer `#303030`.
- Active control blue: `#0285ff`.
- Use tokens from `src/tokens`; do not add component-local color or spacing literals.
- Use the existing `Select` and `DatePicker` primitives. Native browser popup surfaces are intentionally hidden behind token-backed controls.

## Feedback workflow

During product work, implement feedback in the product first when the decision is still local. When the owner approves a shared change:

1. Update the primitive or token in `src/components` / `docs/design-system/tokens.json`.
2. Update the matching Storybook Catalog tile and any state story.
3. Check dark and light themes, focus, disabled, open, loading, and error states.
4. Add an approved entry to `docs/design-system/CHANGELOG.md`.
5. Rebuild the package and run the checks below.

The approval boundary is the Public exports list in [`src/index.ts`](../../src/index.ts), reviewed in **DS / Public exports / Catalog**. A component is shared only after it is present there and approved.

## Commands

```bash
npm run storybook
npm run build:library
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run ds:verify
npm run build-storybook
```

## Runtime boundary

`ChatPanel` is a mock interaction layer covering streaming, stop, retry, tool, attachment, and branch states. Connect it to the consuming product's API/runtime rather than adding network calls to the design-system package.

For parallel work with another AI, follow [`AI-HANDOFF.md`](AI-HANDOFF.md).
