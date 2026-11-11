# E9 icons

- Runtime SVG observations: see index
- Approximate unique geometry groups: 26
- Source: authenticated CDP DOM across 7 P1 routes × 4 viewports.
- Inline SVG dominates; no sprite/icon package was proven by E9.

D4 recommendation: retain observed inline SVG geometry behind an `Icon` wrapper; defer external icon set selection until component extraction confirms provenance.

Deduplication caveat: groups use width/height/viewBox/path-count; exact path hashes were not retained by policy-safe capture.
