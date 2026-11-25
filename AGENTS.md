# Surgical Focus, Zero-Noise & Quality-First Protocol (Top Priority)

1. **Strict Target Focus (Read & Edit Only What Changes)**:
   - Inspect only the exact file(s), functions, and line ranges directly required for the user's request (`grep` -> targeted `read_file` with `StartLine`/`EndLine`). Never read entire large files or unrelated modules for context you do not need.
   - Edit in-place with minimal, surgical diffs. Never reformat, refactor, rename, or "clean up" adjacent components, unaffected workflow steps, or Design System source (`vanilla/`, `docs/`, `tokens/` stay untouched unless the user explicitly asks to edit the DS).
2. **Zero Unrelated Scanning**:
   - Do NOT scan unrelated directories, run repo-wide audits (`audit_all_components.mjs`), re-read `docs/design-system/*` when classes/tokens are already known, or inspect unaffected UI screens/tabs.
   - Match verification strictly to what was actually modified:
     - **Prototype edits (`smt-ratio-prototype.html`, `smt-ratio-workflows.css`, `smt-ratio-workflows.js`)**: Run `node --check smt-ratio-workflows.js` (only when `.js` changed) and `npm run ds:check`. Do NOT run `tokens:build`, `tokens:check`, `build:vanilla`, `build-storybook`, `ds:verify`, or `audit_all_components.mjs`.
     - **Token edits (`tokens/` or `docs/design-system/tokens.json`)**: Run `npm run tokens:build && npm run tokens:check && npm run ds:check`.
     - **Shared DS edits (`vanilla/`, only when explicitly approved)**: Run `npm run build:vanilla && npm run ds:check`, plus `verify-component.mjs` on the single touched story only.
   - In `agent-desktop`, drill only into the affected region (`snapshot --root '<target-ref>' -i --compact`) rather than dumping full windows or clicking through unrelated steps.
3. **Prune Everything Unnecessary (UI, Reading Load, Code & Output)**:
   - **UI & Minimal Copy (`impeccable` `distill` / `clarify` / `quieter`)**: Follow `.agents/skills/impeccable/reference/{distill,clarify,quieter}.md` — use crisp 1–3 word labels (`Scenario`, `Evidence`, `Negotiation`, `Export`, `Base ratio`), zero instructional hints (`"Click X..."`), zero bilingual parentheticals, zero duplicate badges/labels already shown by a bar/meter/adjacent panel, max 3 signals per collapsed row, and progressive disclosure (`<details>` or explicit `Edit`/`Note` toggle) for secondary inputs, textareas, and debug states so each screen scans in seconds.
   - **Code**: No dead code, speculative abstractions, unused CSS selectors, inline `style="..."` attributes, or leftover scratch scripts.
   - **Communication**: Keep replies concise and direct; do not repeat diffs or narrate unrelated checks.
4. **Uncompromising Quality on the Touched Target**:
   - Put 100% of effort into getting the requested element right on the first pass: exact typography (`font-size`, `font-weight`, semantic `color`), 4px/8px spacing alignment, zero layout jump (`0px` top shift on expand/collapse), complete interactive states (`hover`, `active`, `focus-visible`, `disabled`), smooth GPU motion, and clean accessibility semantics.

---

# Prototype & Design System Guardrails

- **Architecture & Boundaries**:
  - Shared DS lives in `vanilla/base.css`, `vanilla/design-system.js`, `vanilla/stories/`, `tokens/`, and `docs/design-system/`. Consult `docs/design-system/AI-QUICK-REFERENCE.md` only when looking up an unfamiliar `.ds-*` class, token, or `data-ds-*` hook.
  - Keep prototypes local: no external API calls, framework runtimes, or new `package.json` dependencies.
  - Apply project feedback locally in prototype files first; never promote changes to shared DS without explicit owner approval (approved shared changes update component/token + Storybook story + `docs/design-system/CHANGELOG.md`).
  - Product stories under `vanilla/stories/smt-ratio/` must pass `scripts/check-ui-contract.mjs` (via `npm run ds:check`): canonical `.ds-*` classes only, no `ds-smt-*` prefixes, no unclassified raw `<button>`/`<input>`/`<aside>`/`<nav>`/`<main>`, no fake Unicode icons, no hardcoded SVG colors.

- **OpenAI Platform Ground-Truth, Typography & Tokens**:
  - **Source of Truth**: Ground UI patterns in `https://platform.openai.com` (for Home / `Accident case` table views, strictly `https://platform.openai.com/settings/organization/projects`). Never guess styles or blend unrelated page layouts.
  - **Strict Typography (`400` Weight Rule)**: Default to `font-weight: 400` (`var(--font-weight-normal)`) across body copy, secondary/tertiary labels, calendar headers/weekdays/dates, table headers & cells, filter chips, and dropdown items. Use `font-weight: 500` (`var(--font-weight-medium)`) for primary button labels, and `600` only on designated page/modal titles (`20px` `--font-size-heading-md` topbar title). Always pair explicit `--font-size-*` and `--color-semantic-text-*` tokens.
  - **Geometry & Zero Literals**: Compact `32px` standard controls (`var(--height-control-md)`), `28px` small controls (`var(--height-control-sm)`), `8px` control radius (`var(--radius-md)`), `12px` card/table radius (`var(--radius-xl)`), pill `var(--radius-full)`. Zero hex/rgb/oklch literals in CSS/JS — all colors come from `docs/design-system/tokens.json`.
  - **Motion**: CSS transitions with `cubic-bezier(0.16, 1, 0.3, 1)` (`150ms` micro-interactions / `scale(0.98)` active, `200ms` expand/collapse & modals), animating `transform` and `opacity` only (never `width`, `height`, `left`, `top`), honoring `prefers-reduced-motion: reduce` and `[data-reduced-motion="true"]`.

- **Standard Icon Ground Truth & Zero Fabricated SVGs (MANDATORY)**:
  - **Single Source of Truth**: All project icons MUST come directly from the Hugeicons Pro Sharp icon set exported at `/Users/bangworkinghub/Downloads/Document/Icon/fill/` (and `/Users/bangworkinghub/Downloads/Document/Icon/stroke/` if explicitly needed, defaulting to `fill`).
  - **Zero Fabricated/Invented Icons**: Never invent, guess, hand-code arbitrary SVG paths, or use fake Unicode icons. Always read the exact SVG file from `/Users/bangworkinghub/Downloads/Document/Icon/fill/` and inline the vector markup.
  - **Theme-Aware Colors**: Ensure SVG colors use `currentColor` (e.g. `fill="currentColor"` or `stroke="currentColor"`) instead of hardcoded hex values (`#141B34`).
  - **Figma Source**: If a required icon has not yet been exported, export it from the Hugeicons Pro Sharp Figma file (`VgYNo30JGOtva3obo3qsvu`, node `13977:9793`) into `/Users/bangworkinghub/Downloads/Document/Icon/fill/` before using it.

- **Component Composition & Anti-Gate Hygiene**:
  - Reuse canonical `.ds-*` primitives unmodified: `.ds-table` (with `.ds-table__col-check` + `.ds-checkbox` and `.ds-table__col-actions`), borderless `.ds-badge.ds-badge--pill`, `.ds-search-input.ds-search-input--pill`, `.ds-filter` (`[data-ds-filter]`), `.ds-filter-reset`, `.ds-button` (`--primary` / `--secondary` / `--outline` / `--ghost` / `--icon`, keeping `fill="none"` on button SVGs), and `.ds-code-token--*`.
  - For motion/cloning tasks (`uiarc.dev`, reasoning blocks, streaming UIs), read `.agents/skills/uiarc-ds-clone/SKILL.md` only when working on those components: inspect `/frame` directly, pin expandable containers to the top (`justify-content: flex-start`, `0px` shift), defer detached `mount(root)` timelines with `requestAnimationFrame`, use `String.fromCharCode(35)` for `#` before digits in JS, and use `black` in `mask-image`.

- **Live UI Inspection (`agent-desktop` — Subtree Only, No Blind Screenshots)**:
  - Use `agent-desktop` (run `agent-desktop skills get desktop` and `agent-desktop skills get platform` once before first use in a session if needed) instead of Playwright screenshot scripts.
  - Scope every snapshot and ref action (`@<snapshot_id>:e<N>`) strictly to the target window and edited subtree (`--skeleton` -> `--root '<ref>' -i --compact`), and re-snapshot only that subtree to verify state changes.
