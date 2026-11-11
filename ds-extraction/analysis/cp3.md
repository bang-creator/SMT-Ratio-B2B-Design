# CP3 — Reconcile + DS Contract + token build

Completed after CP2 approval. No component/prototype code added.

## Reconcile

- Authority order: platform CSS declarations → authenticated CDP render → `@openai/apps-sdk-ui`.
- Outliers excluded: values observed fewer than three times or fewer than two pages.
- Conflicts recorded in `conflicts.md`; no silent selection.
- D1–D5 recorded in `docs/design-system/decisions.md`.

## Contract

- `docs/design-system/tokens.json`: 25 gray primitive tokens, 11 semantic color tokens, 13 type-size tokens, 10 spacing tokens, 10 radii, 4 shadows, 6 motion tokens, layout metrics.
- Every generated token includes provenance and confidence.
- Dark values exist for all semantic colors and gray primitives.
- `DESIGN.md`, `components.md`, `motion.md`, `layout-rules.md`, `voice.md`, `anti-slop.md`, `provenance.md`, `decisions.md` written.

## Build

- `src/tokens/tokens.css`
- `src/tokens/tokens.dark.css`
- `src/tokens/theme.css` with Tailwind v4 palette resets
- `src/tokens/motion.ts`
- `npm run tokens:build` passes.
- `npm run tokens:check` passes (`tokens:ok`).

## CP3 visual baseline proposal

Set the fidelity threshold at **≤2% pixel difference per fixture crop**, matching the spec suggestion. Establish the baseline after component fixtures exist in CP4; no fixture screenshot is fabricated at CP3.

## Gate

Stop here. Next work requires CP3 approval before component implementation, Storybook, chat layer, or prototype scaffolding.
