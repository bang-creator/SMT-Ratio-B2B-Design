# CP2 — E1–E9 synthesis

Generated 2026-11-11 after CP1 approval. Scope ends here; prototype scaffold and DS Contract build remain gated.

## Stack

- React 19.3.1, React Router 8.4.0, Tailwind CSS insiders banner (`v0.0.0`) observed in platform render.
- Styling: CSS custom properties + Tailwind layers; platform ships 2,072 parsed custom-property declarations across 21 CSS bodies.
- Motion: CSS transitions/keyframes plus runtime Web Animations; 21 keyframes, 227 motion declarations, 206 runtime observations.
- Platform font declarations: OpenAI Sans 400/500/600/700, regular/italic.

## E1 coverage

56 captures: 7 P1 routes × 4 viewports (`1440×900`, `1280×800`, `768×1024`, `390×844`) × light/dark. No remaining `Signing in` captures. Route inventory: 29 routes; 7 P1 routes.

## E4 overlap

`@openai/apps-sdk-ui@0.2.2`: platform 1,077 custom properties; SDK 729; same names 728 (67.6%); same name and value 661 (61.37%); 29 SDK component directories.

## Palette

Platform CSS is neutral-first. Frequent declared values include `#0d0d0d`, `#f3f3f3`, `#212121`, `#fff`, `#000`, grayscale steps `#f9f9f9` through `#101010`, plus semantic accents (`--red-600`, green, pink, purple, blue, caution). E2 reports 175 unique colors; E8 dark render confirms shell `rgb(19,19,19)`, text `rgb(220,220,220)`, secondary `rgb(48,48,48)`, tertiary `rgb(175,175,175)`. Light and dark selectors are explicit via `[data-theme=light]` / `[data-theme=dark]`.

## Typography

- Primary: OpenAI Sans; observed runtime loaded weights 400/500/600, declared 700.
- Fallback: `helvetica, sans-serif`.
- E2 unique font-size values: 81. Common semantic sizes: 14px, 16px, 20px, 24px, 32px; CSS uses a 4px spacing base.

## Spacing, radius, shadow

- E2 unique spacing values: 249; common scale values: 4, 8, 12, 16, 20, 24, 28, 32, 40px.
- E2 radii: 44 values; runtime landmarks: 4px controls, 24px cards/containers, with CSS token aliases (`--radius-md`, `--radius-xl`, `--radius-2xl`).
- E2 shadows: 37 values; runtime shell/card sample includes `rgba(255,255,255,.1) 0 0 0 1px`; CSS frequently uses `--shadow` and `0 2px 4px -1px #00000014`.

## Motion

- Runtime duration distribution: 1200ms (124), 150ms (53), 800ms (21), 1000ms (4), 500ms (1), 250ms (1).
- Easing: linear (157), ease (49). Button color/opacity transitions use 150ms ease. Content reveal/layout uses 800–1200ms linear; layout token patterns include 300ms `var(--cubic-move)` with 0/100ms delays.
- Reduced-motion: CSS contains `@media(prefers-reduced-motion)` overrides. Dedicated reduce replay remains pending before CP3.

## Layout

- Desktop/tablet shell aside: 260px at 1440, 1280, 768 widths.
- Mobile 390px: aside rail 24px off-canvas at x=390; main starts y=54px and occupies viewport remainder.
- Main shell is fixed to viewport; exact breakpoint for rail/drawer transition remains unverified. No semantic `nav`/`header` landmarks in the sampled DOM; shell descendants provide the topbar.

## Font/icon evidence

- Font files and URLs recorded in `analysis/fonts.md`; D3 platform fidelity recommendation: OpenAI Sans.
- Inline SVG dominates. E9 grouped 250 SVG samples by width/height/viewBox/path-count; no icon package/sprite proven. D4 recommendation: preserve observed SVG geometry behind an `Icon` wrapper; defer external icon set.

## D1–D4 recommendations

- **D1 = A:** keep `@openai/apps-sdk-ui/css` as base; 67.6% name overlap and 61.37% name/value overlap clear the 60% threshold. Platform CSS variables remain authoritative for overrides.
- **D2 = yes:** support light/dark. Both schemes were captured; platform CSS has explicit data-theme selectors. Keep route-level theme persistence marked unverified until a settings toggle replay.
- **D3 = OpenAI Sans:** use declared platform font URLs, with Helvetica fallback.
- **D4 = observed inline SVG:** wrap extracted inline SVGs; do not introduce a replacement icon library before E6 interactive provenance probing.

## Evidence limits

- Dembrandt CLI runs against fresh contexts reached platform login/Cloudflare challenge; retained outputs are marked invalid for token extraction. Authenticated CDP render metrics are used for E5 merge and are explicitly labeled in `rendered-merged.json`.
- E6 currently indexes page-level DOM/accessibility states. Interactive hover/focus/open crops are not frozen as component tokens; run those probes before CP3 if component-level fidelity is required.
