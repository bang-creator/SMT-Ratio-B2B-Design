# Fidelity report

Status: baseline captured for the first P1 routes.

CP3 approved the threshold at ≤2% pixel difference per crop. Capture the same route, viewport, and theme as E1, then record changed pixels and the token correction here. Platform reference captures remain under `ds-extraction/captures/pages/e1/`.

Reference screenshots are extracted from the committed E1 REA JSON artifacts with `npm run visual:extract`. Local screenshots use the same 1440×900 light viewport through the Playwright-connected browser. Pixelmatch uses `threshold: 0.1`, `includeAA: false`.

| Route | Reference | Local | Changed pixels | Ratio | ≤2% |
|---|---:|---:|---:|---:|---:|
| Home | `home-1440-light.png` | `local-home-1440-light-v2.png` | 142,299 | 10.98% | no |
| Responses | `responses-1440-light.png` | `local-responses-1440-light-v2.png` | 39,718 | 3.06% | no |
| Agents | `agents-1440-light.png` | `local-agents-1440-light-v2.png` | 26,595 | 2.05% | no |
| Usage | `usage-1440-light.png` | `local-usage-1440-light-v2.png` | 34,689 | 2.68% | no |

The comparison is full-viewport evidence, so product-copy, imagery, and data-density differences contribute to the ratio. The shell alignment pass moved the local frame to a full-height sidebar and removed the horizontal global topbar; exact fixture crops remain the next fidelity target.
