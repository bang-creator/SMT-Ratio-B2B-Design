# Platform component extraction: Usage + Responses

Captured from the authenticated Chrome target with REA CDP at 1440×900, dark mode, 2026-11-12.

- Usage: `https://platform.openai.com/usage`
  - Evidence: `ev_a1a12abbf524020705e7cbf994fbcaf94985642e1c0f43a94c1f431caa3ff62f`
  - Screenshot: `ds-extraction/captures/components/usage__1440x900__dark.png`
  - Accessibility: sidebar, search, filter controls, filter clear action, date control, refresh/export actions, empty chart state, metric summary, radio tabs, capability cards.
- Responses: `https://platform.openai.com/chat/edit?models=gpt-6.1-sol`
  - Evidence: `ev_2e19df7b6a7e914383bef788fa868bd3e2895e23127b82c549709da95c3ab66e`
  - Screenshot: `ds-extraction/captures/components/chat-platform__1440x900__dark.png`
  - Accessibility: prompt editor, model/service tier selects, switch controls, add control, tool toggles, empty chat state, composer, attach/run actions.

## Reuse map

| Observed pattern | Library component | Action |
| --- | --- | --- |
| Sidebar, navigation, search | `AppShell`, `Input` | Reused |
| Button, icon button, badge/status | `Button`, `IconButton`, `Badge`, `StatusBadge` | Reused |
| Filter/date/search/select | `FilterBar`, `DatePicker`, `Input`, `Select` | Reused |
| Radio tab strip | `Tabs` | Reused |
| Metric and chart card | `MetricCard`, `ChartCard`, `BarChart` | Reused |
| Prompt/chat/composer | `Textarea`, `ChatPanel` | Reused |
| Menu/dropdown | `Popover`, `Menu` | Fixed: focus, Escape, outside click, arrow keys, ARIA linkage |
| Selected filter pill | token-backed `ds-filter-chip` preview pattern | Added to fixture only; no duplicate primitive |
| Switch | `Switch` | Added dark-first track/thumb styling |

## Token links

The preview uses semantic tokens from `src/tokens/theme.css`, including `background-canvas`, `background-surface`, `background-surface-secondary`, `background-surface-elevated`, `text-primary`, `text-secondary`, `border-subtle`, `border-default`, `ring-focus`, spacing, radius, shadow, and motion tokens. No platform color literals were copied into UI source.

## Preview

Open `/specimen/fixtures/platform-components` while the Vite server is running. It contains the Usage filter/empty/chart/metric patterns, Responses prompt/model/chat patterns, and a compact primitive strip. The fixture is dark-first and responsive.

