# Public exports review map

Source of truth: [`src/index.ts`](../../src/index.ts). The Storybook catalog mirrors that file and is the review surface for every shared component:

```bash
npm run storybook
```

Open **DS / Public exports / Catalog**. Each tile shows the exported name, the current visual state, and the interaction surface where relevant. Review the catalog before accepting a component change into the shared system.

| Export group | Source | Catalog coverage |
| --- | --- | --- |
| Foundations | `src/components/ds.tsx` | Button, IconButton, Icon, Badge, Heading, Text, Card |
| Forms | `src/components/ds.tsx` | Field, Input, Textarea, Select, Combobox, DatePicker, Checkbox, Radio, Switch |
| Navigation | `src/components/ds.tsx` | Tabs, SegmentedControl, Menu, Popover, Tooltip, Pagination |
| Overlays | `src/components/ds.tsx` | Dialog, Drawer |
| Feedback | `src/components/ds.tsx` | Alert, Spinner, Skeleton, EmptyState, Toast |
| Data and product | `src/components/product.tsx` | SectionHeading, MetricCard, FilterBar, Filter, ChartCard, BarChart, DataTable, CompactSelect, StatusBadge, CodePreview |
| Utility | `src/components/ds.tsx` | Table, CodeBlock, CopyField, PageHeader |
| Chat | `src/components/chat/ChatPanel.tsx` | ChatPanel |

## Promotion rule

1. Apply product-specific feedback locally first.
2. If the change should become shared, update the component, tokens, and Catalog story together.
3. Review the Catalog story at dark and light themes, plus disabled, focus, open, error, and loading states that apply.
4. Promote the change only after the owner approves it. Record the decision in `docs/design-system/CHANGELOG.md`.

This keeps a product experiment separate from the shared contract until it is explicitly approved.
