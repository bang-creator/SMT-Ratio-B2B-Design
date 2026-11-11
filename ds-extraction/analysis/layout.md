# E8 layout metrics

Source: `analysis/layout.json`, authenticated CDP; 7 P1 routes × 4 viewports.

- Desktop/tablet sidebar: **260px** wide, x=0.
- Mobile 390px sidebar rail: **24px**, x=390 (off-canvas/closed rail), top offset 54px, height viewport−54px.
- Mobile main: y=54px, height viewport−54px.
- Main shell is fixed and viewport-sized; body scroll dimensions match viewport in the sampled states.
- Breakpoint inference: sidebar presentation changes between 768px and 390px; exact breakpoint remains unverified.

## Frequent viewport values

- `390px`: aside width `24px`, x `390px` (7 observations)
- `768px`: aside width `260px`, x `0px` (7 observations)
- `1280px`: aside width `260px`, x `0px` (7 observations)
- `1440px`: aside width `260px`, x `0px` (7 observations)

No `header`/`nav` element landmarks were exposed; topbar is represented by app shell descendants. Use selector-level E6 probing before freezing token names.
