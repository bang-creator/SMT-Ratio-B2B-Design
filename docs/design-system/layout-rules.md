# Layout rules

- Shell viewport: fixed app frame with 54px topbar.
- Sidebar: 260px at 768px and above in sampled states.
- Mobile: 390px capture shows a 24px off-canvas rail at x=390; main begins at y=54px.
- Content: use flexible min-width 0 columns; never allow tables or chat composer to overflow the page frame.
- Settings/forms: label and control align in a compact two-column row on desktop; stack below the proven mobile breakpoint.
- Tables/lists: sticky header only when the page provides a scroll container; preserve 14px body text and 4px spacing base.
- Exact drawer breakpoint remains unverified; keep it configurable until interactive E8 probing.
