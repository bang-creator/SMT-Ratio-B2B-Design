# Fidelity report

Status: baseline captured for the first P1 routes.

CP3 approved the threshold at ≤2% pixel difference per crop. Capture the same route, viewport, and theme as E1, then record changed pixels and the token correction here. Platform reference captures remain under `ds-extraction/captures/pages/e1/`.

Reference screenshots are extracted from the committed E1 REA JSON artifacts with `npm run visual:extract`. Local screenshots use the same 1440×900 viewport through the Playwright-connected browser. Pixelmatch uses `threshold: 0.1`, `includeAA: false`. Dark mode is the priority theme.

| Route | Reference | Local | Changed pixels | Ratio | ≤2% |
|---|---:|---:|---:|---:|---:|
| Home | `home-1440-light.png` | `local-home-1440-light-v2.png` | 142,299 | 10.98% | no |
| Responses | `responses-1440-light.png` | `local-responses-1440-light-v2.png` | 39,718 | 3.06% | no |
| Agents | `agents-1440-light.png` | `local-agents-1440-light-v2.png` | 26,595 | 2.05% | no |
| Usage | `usage-1440-light.png` | `local-usage-1440-light-v2.png` | 34,689 | 2.68% | no |

## Dark priority baseline

| Route | Reference | Local | Changed pixels | Ratio | ≤2% |
|---|---:|---:|---:|---:|---:|
| Home | `home-1440-dark.png` | `local-home-1440-dark-v4.png` | 207,894 | 16.04% | no |
| Responses | `responses-1440-dark.png` | `local-responses-1440-dark-v3.png` | 40,980 | 3.16% | no |
| Agents | `agents-1440-dark.png` | `local-agents-1440-dark-v3.png` | 23,202 | 1.79% | yes |
| Usage | `usage-1440-dark.png` | `local-usage-1440-dark-v3.png` | 25,740 | 1.99% | yes |

Dark semantic tokens now follow the observed Platform palette: canvas/surface `#212121`, sidebar `#131313`, secondary surface `#303030`, subtle border `#303030`, default border `#4f4f4f`. The token selector specificity bug was fixed so the toolbar's Dark choice actually overrides `:root` light values. Home now uses the observed Get started, usage summary, model, and updates structure; the remaining diff is dominated by missing Platform hero imagery and exact content assets.

The comparison is full-viewport evidence, so product-copy, imagery, and data-density differences contribute to the ratio. The shell alignment pass moved the local frame to a full-height sidebar and removed the horizontal global topbar; exact fixture crops remain the next fidelity target.

## Fixture crops

Fixture comparison uses `npm run visual:fixture` and the same `threshold: 0.1`, `includeAA: false` settings. The first dark-first fixture isolates the Responses chat surface at `x=669, y=142, width=739, height=540`, excluding route-specific shell and platform-only loading chrome.

| Fixture | Reference | Local | Changed pixels | Ratio | ≤2% |
|---|---|---|---:|---:|---:|
| Responses chat / dark | `reports/fidelity/fixtures/chat/reference-dark.png` | `reports/fidelity/fixtures/chat/local-dark.png` | 4,161 | 1.04% | yes |

Re-run:

```bash
npm run visual:fixture -- \
  reports/fidelity/reference/responses-1440-dark.png \
  reports/fidelity/local-responses-1440-dark-v4.png \
  669 142 739 540 \
  reports/fidelity/fixtures/chat/diff-dark.png
```
