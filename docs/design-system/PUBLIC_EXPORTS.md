# Storybook component map

Storybook is the only review surface. The tree mirrors the product split:

```text
Default
├── Shared                 33 base components
├── Application            8 Default-only components
└── Supplemental           existing exports outside the required list
AMS B2B
└── Application            8 brand-specific component slots
```

Each component is one Storybook CSF file. Component states and variants are child stories in the same file. Empty slots render a visible `State placeholder` or `Reserved in the catalog` tile so future AI agents know where to add source-matched markup.

## Shared components

Breadcrumb, Button, Checkbox, Contained list, Content switcher, Date picker, Data table, Dropdown, File uploader, Form, Link, List, Menu, Modal, Notification, Number input, Pagination, Password input, Popover, Progress bar, Progress indicator, Radio button, Search, Select, Slider, Structured list, Tabs, Tag, Text area, Text input, Toggle, Toggle tips, Tool tips.

## Application components

Page header, Card header, Section header, Section footer, Navigation, Chart, Metric, Empty state. Default and AMS B2B keep separate stories because application composition can vary by brand while shared components remain common.

## Source map

- `vanilla/stories/shared/` — shared components.
- `vanilla/stories/default/` — Default application components.
- `vanilla/stories/ams-b2b/` — AMS B2B application components.
- `vanilla/stories/supplemental/` — existing exports outside the required shared/application lists.
- `vanilla/base.css` — editable CSS source.
- `vanilla/design-system.js` — editable interaction source.
- `tokens/` — generated token CSS.

Review the matching story against `https://platform.openai.com/` before promoting a change to the shared system.
