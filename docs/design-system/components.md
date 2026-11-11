# Component contract (CP3 baseline)

Evidence index: `ds-extraction/analysis/components.json`. Components remain contract-level; implementation is CP4.

| Component | Source | Anatomy | Required states |
|---|---|---|---|
| AppShell | platform-observed | sidebar, topbar, page frame | expanded, mobile rail, light, dark |
| SidebarItem | platform-observed | icon, label, active surface | default, hover, active, focus |
| PageHeader | platform-observed | title, supporting action | default, compact |
| Button | platform-observed + apps-sdk-ui | label, optional icon | solid, outline, ghost, disabled, loading, focus |
| IconButton | platform-observed | icon, accessible label | default, hover, focus, disabled |
| Input/Textarea | platform-observed | label, control, help/error | default, focus, invalid, disabled |
| Select/Popover | apps-sdk-ui + platform vars | trigger, menu, option | closed, open, highlighted, disabled |
| Tabs/SegmentedControl | platform-observed | list, tab, active indicator | default, active, focus |
| Table | platform-observed | header, row, cell, empty | default, loading, empty, selected |
| Dialog/Drawer | apps-sdk-ui + Radix behavior | overlay, surface, close | closed, open, focus trap |
| Alert/Toast | platform-observed | status icon, message, action | info, caution, danger, success |
| Chat layer | assistant-ui + platform skin | thread, message, composer | streaming, error, tool-running, tool-done |

All components use `tokens.json`; no implementation or component code is included before CP3 approval.
