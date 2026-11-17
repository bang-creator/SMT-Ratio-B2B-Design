# Prototype guardrails

- Read `docs/design-system/AI-QUICK-REFERENCE.md` first for classes, tokens, and `data-ds-*` hooks; check `docs/design-system/DESIGN.md` and `docs/design-system/HANDOFF.md` when broader context is needed.
- Source is plain HTML in Storybook stories, CSS in `vanilla/base.css`, JS in `vanilla/design-system.js`, and tokens in `tokens/`.
- UI source cannot contain hex/rgb/oklch literals, arbitrary spacing, or inline styles. Color values belong in `docs/design-system/tokens.json`.
- Controls use the 32px compact height unless platform evidence says otherwise. Motion uses CSS transitions and honors `prefers-reduced-motion`.
- Keep prototypes local. No API calls, framework runtime, or new dependencies.
- Storybook is the only preview surface. Do not add app routes, standalone demos, screenshots, or alternate preview shells.
- Run `npm run tokens:build`, `npm run tokens:check`, `npm run ds:check`, and `npm run ds:verify` before review.
- Product stories under `vanilla/stories/smt-ratio/` must pass the `scripts/check-ui-contract.mjs` anti-hallucination gate (executed automatically by `npm run ds:check`): only canonical `.ds-*` classes defined in `vanilla/base.css` are permitted, no ad-hoc prefixes (`ds-smt-*`), no raw unclassified `<button>`/`<input>`/`<aside>`/`<nav>`/`<main>` tags, no fake Unicode icon glyphs, and no hardcoded SVG colors.

## OpenAI UI Audit — Standing Project Standard (Always Active)

Apply the **OpenAI UI Audit** protocol automatically across all components, variants, properties, and states in this project without needing explicit invocation:

1. **Zero-Guess Ground-Truth Directive**:
   - Single source of truth is strictly `https://platform.openai.com`. Do not approximate or invent styles, metrics, or interactions.
   - Ground all typography, DOM hierarchy, ARIA roles, and states directly in platform evidence.

2. **Strict Typography (400 Weight Rule)**:
   - OpenAI Platform uses an understated, clean aesthetic with **`font-weight: 400` (normal)** across almost all secondary and tertiary UI elements:
     - Calendar month/year headers: `font-size: var(--font-size-sm)` (14px), `font-weight: 400` (`var(--font-weight-normal)`). Do not make them bold/semibold.
     - Calendar weekday headers: `font-size: var(--font-size-xs)` (12px), `font-weight: 400` (`var(--font-weight-normal)`).
     - Calendar dates (resting, hover, range, endpoints): `font-weight: 400` (`var(--font-weight-normal)`).
     - Table headers, filter chips, dropdown menu items: `font-weight: 400` (`var(--font-weight-normal)`).
     - Primary button labels: `font-weight: 500` (`var(--font-weight-medium)`).

3. **Geometry & Token Contracts**:
   - Standard control height: compact 32px (`var(--height-control-md)` / 32px).
   - Small control height: compact 28px (`var(--height-control-sm)` / 28px).
   - Standard radii: 8px (`var(--radius-md)`), table/card container 12px (`var(--radius-xl)`), pill `var(--radius-full)`.
   - Never use hex/rgb/oklch literals in CSS or JS. All colors must be tokenized in `docs/design-system/tokens.json`.

4. **Motion & Interaction Standards**:
   - Clean, smooth, lightweight motion using CSS transitions with standard easing `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Duration: 150ms for micro-interactions (hover, active scale(0.98)), 200ms for expand/collapse, modals.
   - GPU-accelerated transforms (`transform`, `opacity`). Never animate `width`, `height`, `left`, `top`.
   - Always honor `prefers-reduced-motion: reduce` and `[data-reduced-motion="true"]`.

5. **Incremental Refinement Directive**:
   - Never discard working prototypes or rebuild components from scratch.
   - Refine existing CSS, JS, and HTML in-place through targeted audits and optimizations.

6. **Continuous QA Verification Loop**:
   - Automatically run verification after every component change:
     ```bash
     npm run tokens:build && npm run tokens:check && npm run ds:check && npm run build:vanilla
     node scripts/audit_all_components.mjs
     ```
   - For single-component inspection:
     ```bash
     node .agents/skills/openai-ui-audit/scripts/verify-component.mjs <story-id> [theme=dark|light] [selector]
     ```

## Fast-Path Cloning & Motion Component Rules (Low-Token / Zero-Rework)

Read `.agents/skills/uiarc-ds-clone/SKILL.md` before building or cloning interactive motion components (`uiarc.dev`, reasoning blocks, tool calls, streaming UIs):

- **Direct `/frame` Extraction**: For `uiarc.dev`, inspect `https://uiarc.dev/components/<slug>/frame` directly in a single pass rather than clicking fullscreen or scraping site chrome.
- **Pass-1 Shared Component Composition**: Map buttons (`Deny`/`Retry` -> `.ds-button.ds-button--secondary.ds-button--sm`; `Allow` -> `.ds-button.ds-button--primary.ds-button--sm`; `Run again`/`Show more` -> `.ds-button.ds-button--ghost.ds-button--sm`; `Copy` -> `.ds-button.ds-button--ghost.ds-button--icon.ds-button--sm`), badges (`.ds-badge.ds-badge--sm` `--default`/`--red`), and JSON tokens (`.ds-code-token--*`) immediately on the first pass instead of writing custom button/pill CSS. Always keep `fill="none"` on `<svg>` icons inside `.ds-button`.
- **Top-Pinned Zero-Jump Layout**: Never vertically center expandable/collapsible containers. Use `justify-content: flex-start` on the canvas and `margin: 0 auto; align-content: start;` on the block so `getBoundingClientRect().top` stays locked (`0px` shift).
- **Detached `mount(root)` Timing**: `story()` in `vanilla/stories/story-helpers.js` runs `mount(root)` before attaching to DOM; defer auto-start timelines via `requestAnimationFrame(() => { if (root.isConnected) start(); })`.
- **Anti-Gate Regex & Naming Hygiene**: Use canonical `.ds-*` class names defined in `vanilla/base.css` (never `ds-smt-*` or `ds-analysing*`); use `String.fromCharCode(35)` for `#` before digits (e.g., `#1284` triggers `check-literals.mjs` hex regex); use `black` (not `#000`) in `mask-image`; never write inline `style="..."` HTML attributes.

## Feedback promotion

- Apply project feedback locally first while the change is still being evaluated.
- Do not promote a feedback change into the shared design system without explicit owner approval.
- An approved shared change must update the component or token, the Storybook `Default / Shared / Button (and the matching component story)` story, and `docs/design-system/CHANGELOG.md` together.
- Treat the Storybook catalog in `vanilla/stories/` as the Public exports approval boundary.
