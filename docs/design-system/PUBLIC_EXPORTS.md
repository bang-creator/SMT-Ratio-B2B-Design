# Storybook component map

Storybook is the only review surface. The tree mirrors the product split:

```text
Default
├── Shared                 33 base components
└── Application            5 components (01–05)
SMT Ratio
└── Application            2 brand-specific product components (Analysing, Sidebar)
```

Start with [`AI-QUICK-REFERENCE.md`](./AI-QUICK-REFERENCE.md) for exact `.ds-*` classes, `data-ds-*` hooks, and semantic tokens. Each component is one Storybook CSF file, with component states and variants as child stories in the same file.

## Shared components (33)

Badge, Breadcrumb, Button, Checkbox, Code Snippet, Contained List, Content switcher, Data Table, Date Picker, Dropdown, File Uploader, Filter, Form, Link, Menu, Modal, Notification, Number Input, Pagination, Popover, Progress Bar, Progress Indicator, Radio Button, Scroll Bar, Search Input, Search Trigger, Sidebar, Slider, Structured List, Tabs, Text Input, Toggle, Tool Tips.

## Application components

- **Default (`01`–`05`)**: 01 Loading State, 02 Thinking indicator, 03 Streaming text, 04 Typing Indicator, 05 Reasoning Effort. (`#06`–`#151` were temporarily removed to keep the design system lightweight.)
- **SMT Ratio (`2`)**: Analysing, Sidebar. Preserved as brand-specific application components while shared components remain common.

## Source map

- `vanilla/stories/shared/` — 33 shared components.
- `vanilla/stories/default/` — 5 Default application components (`01`–`05`).
- `vanilla/stories/smt-ratio/application/` — 2 SMT Ratio application components (`Analysing`, `Sidebar`).
- `vanilla/base.css` — editable CSS source.
- `vanilla/design-system.js` — editable interaction source.
- `tokens/` — generated token CSS.

Review the matching story against `https://platform.openai.com/` before promoting a change to the shared system.
