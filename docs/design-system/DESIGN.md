# OpenAI Platform design contract

Read this before implementing UI. Source of truth: `tokens.json`; observed provenance in `provenance.md`.

## Visual rules

- Neutral grayscale foundation. Accent colors carry status and action meaning.
- Use OpenAI Sans. Keep text hierarchy compact: 14px/16px body, 20px section, 24px+ headings.
- Base spacing is 4px. Prefer 4/8/12/16/20/24/28/32/40px steps.
- Controls use small radii; cards and surfaces use 12–24px. Full pills reserved for controls that are explicitly pill-shaped.
- Desktop shell uses a 260px sidebar and 54px topbar. Mobile uses an off-canvas 24px rail.
- Every semantic color has light and dark values. Never hard-code color literals in UI.

## Motion

Use motion tokens in `tokens/tokens.css`. Basic interaction: 150ms ease. Enter: cubic-bezier(.19,1,.22,1). Move: cubic-bezier(.65,0,.35,1). Respect `prefers-reduced-motion`.

## Guardrails

- Use token references, not hex/rgb/oklch literals.
- Do not invent a breakpoint until E8 interaction probing proves it.
- Do not add a replacement icon library; wrap observed inline SVG through `Icon`.
- Keep empty, loading, disabled, error, focus, and dark states explicit.
