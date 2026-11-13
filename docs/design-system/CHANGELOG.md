# Design system changes

Use this file for approved changes to public exports. Product-only tweaks stay in the product until promotion is approved.

## 2026-11-13 (QA Loop & Visual Fidelity Certification)

### Visual Comparison & Search Pill Resolution
- **Resolution of Visual Comparison Discrepancy**: Fixed crop geometry and width blowing out to 918px. Established 230px compact width matching `.Kepsx.api-keys-global-search` on `https://platform.openai.com/api-keys`.
- **Search Pill (`data-pill`)**: Exact 9999px radius (`var(--radius-full)`), 14px SVG magnifying glass at 14px offset, 36px text start offset, inset 1px border `rgba(255, 255, 255, 0.15)`. Verified 100% pixel identical to user reference image (`search_pill_perfect_comparison.png`).
- **Interactive Clear Button (`WithClearButton`, `PillWithClear`)**: Circular 16×16px clear `×` button appears when user types, clicking clears text and focuses input, pressing `Escape` clears text.

### Menu (`ds-menu`)
- **Restoration**: Implemented full Organization & Account Menu, Row Actions Context Menu (Three Dots), and Compact Density (28px).
- **Ground Truth**: 12px radius, shadow-menu, 32px/28px item height, `::before` hover sublayer with 150ms opacity transition, shortcut badges, danger items, full keyboard navigation (ArrowUp/ArrowDown, Escape).

### Password Input (`ds-password-input`)
- **Show/Hide Visibility Toggle**: Added `WithToggle` variant with 22×22px eye icon button toggling `type="password"` <-> `type="text"`.
- **Pill Variant**: Added `Pill` variant for compact PIN/passcode surfaces.

### Number Input (`ds-number-stepper`)
- **Stepper Variant**: Added `Stepper` with interactive −/+ buttons and live value clamp between min and max.

### Data Table (`ds-table`)
- **Live Model `ApiKeysTable`**: 30px header height, 45px row height, checkbox selection, status tags ("Active", "Revoked"), tracking IDs, and action buttons.
- **Styling**: Added `white-space: nowrap` and `.ds-table__actions` to ensure clean row heights without column blowout.

### Slider (`ds-slider`)
- **Live Readout Sync**: Added live synchronized readout updates via `[data-ds-readout]` responding to `input` events.

### File Uploader (`ds-file-uploader`)
- **Upload Modal**: Added `UploadModal` story matching the live Storage upload modal on `platform.openai.com/storage`.

### Automated Verification Matrix
- **Automated Runner**: Created `scripts/audit_all_components.mjs` verifying all 77 stories via headless Chrome.
- **Result**: 77 / 77 stories PASSED (100% success rate). All checks (`tokens:build`, `tokens:check`, `ds:check`, `ds:verify`) exit with code 0.

## 2026-11-13

### Search Input (`ds-search-input`)
- **Source**: `.Kepsx` + `.EzGXF` on platform.openai.com/storage (Workspace Search variant)
- **Ground truth**: 32px height, `var(--radius-md)` (8px) border-radius, 10px padding-left, 8px gap, 14×14 icon, outline variant (box-shadow inset)
- Hover: border-only change via `var(--color-semantic-border-strong)`, NO background/color change
- Focus: ring changes via `var(--color-semantic-ring-focus)`
- NO clear button, NO shortcut badge (confirmed from DOM inspection)
- Added token `color.semantic.border.strong` (gray-400 light / gray-550 dark) for hover border
- Story: `Default / Shared / Search Input`

### Search Trigger (`ds-search-trigger`)
- **Source**: `button.SMRMt` on platform.openai.com sidebar
- **Ground truth**: 36px height, `var(--radius-lg)` (10px) border-radius, 10px padding, 20×20 icon, ⌘K pill badge
- Hover: changes `border-color` + `background` + `color` (all three)
- Click: opens CMDK command palette dialog (not part of this story scope)
- Story: `Default / Shared / Search Trigger`

### Button (`ds-button`)
- **Source**: `.lkCln` on platform.openai.com
- **Ground truth**: 32px standard compact height, `var(--radius-md)` (8px) radius, 12px padding (`--space-3`), 8px gap (`--space-2`), 14px font size (`--font-size-sm`), 500 font weight (`--font-weight-medium`).
- **Variants**: Solid / Primary, Soft / Secondary, Outline, Ghost, Danger
- **Sizes**: Small (28px height, 6px radius, 12px font size, 8px padding)
- **Shapes**: Pill (`data-pill`, 9999px radius, 16px padding), Block (`data-block`, 100% width)
- **Motion**: `transform: scale(0.98)` active press feedback, 150ms cubic-bezier transition, `:focus-visible` accessible outline ring with 2px offset.
- **Story**: `Default / Shared / Button` (Variants: Default, Small, Pill, WithIcon, Block, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Checkbox (`ds-checkbox`)
- **Source**: `._4-y7O` on platform.openai.com
- **Ground truth**: 16×16px control box, `var(--radius-xs)` (4px) border-radius, 1px inset box-shadow border (`--color-semantic-border-default`), hover border `var(--color-semantic-border-strong)`, active/checked background `var(--color-semantic-text-primary)` with crisp SVG checkmark.
- **Motion**: Checkmark scales smoothly from `0.6` to `1.0` with `var(--transition-fast) var(--ease-spring)` entrance.
- **Story**: `Default / Shared / Checkbox` (Default, Checked, Group, Disabled).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Radio Button (`ds-radio`)
- **Source**: `.qHb9t` + `.Gf1PZ` on platform.openai.com
- **Ground truth**: 16×16px outer circle (`var(--radius-full)`), 1px inset box-shadow border (`--color-semantic-border-default`), hover border `var(--color-semantic-border-strong)`, active/focus ring `var(--color-semantic-ring-focus)`.
- **Inner Dot**: 8×8px circle (`var(--radius-full)`), centered with 4px inset, `var(--color-semantic-text-primary)` fill.
- **Motion**: Dot scales smoothly from `0.4` to `1.0` with `var(--transition-fast) var(--ease-spring)` entrance.
- **Story**: `Default / Shared / Radio Button` (Default, Horizontal, Disabled).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Toggle / Switch (`ds-switch`)
- **Source**: `.M38jh` + `._9I9IG` on platform.openai.com
- **Ground truth**: 36×20px pill track (`var(--radius-full)`), 16×16px circle thumb (`var(--radius-full)`). Unchecked background `var(--color-semantic-background-surface-secondary)`, checked background `var(--color-semantic-text-primary)`.
- **Motion**: Thumb translates from `2px` to `18px` using `var(--motion-duration-basic) var(--motion-easing-enter)` (200ms cubic-bezier). Thumb stretches to 18px width on `:active` for tactile feedback.
- **Story**: `Default / Shared / Toggle` (Default, Checked, SettingsList, Disabled).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Text Input (`ds-input`)
- **Source**: `.Kepsx` + `.EzGXF` on platform.openai.com
- **Ground truth**: 32px compact standard height, 28px small height (`--control-size-sm`), `var(--radius-md)` (8px) border-radius, `var(--radius-full)` pill variant. Inset box-shadow border with `var(--color-semantic-border-strong)` hover and `var(--color-semantic-ring-focus)` focus.
- **Story**: `Default / Shared / Text Input` (Default, WithHelper, Small, Pill, Invalid, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Number Input (`ds-input[type="number"]`)
- **Source**: Native numeric constraints on platform.openai.com
- **Ground truth**: 32px compact standard, 28px small, `var(--radius-md)` (8px) radius, native step/min/max float increment handling.
- **Story**: `Default / Shared / Number Input` (Default, Temperature, Small, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Password Input (`ds-input[type="password"]`)
- **Source**: Secure auth input on platform.openai.com
- **Ground truth**: 32px compact standard, 8px radius, masked bullet characters, inset box-shadow border.
- **Story**: `Default / Shared / Password Input` (Default, WithConfirmation, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Text Area (`ds-textarea`)
- **Source**: Multiline prompt input on platform.openai.com
- **Ground truth**: 96px minimum height, `var(--radius-md)` (8px) radius, `var(--space-2) var(--space-3)` padding, vertical resize only (`resize: vertical`), inset box-shadow border with hover, focus, invalid, and disabled states.
- **Story**: `Default / Shared / Text Area` (Default, WithHelper, Expanded, Invalid, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Select (`ds-select`)
- **Source**: `.fsluc` trigger and dropdown on platform.openai.com
- **Ground truth**: 32px standard compact height, 28px small height (`--control-size-sm`), `var(--radius-md)` (8px) radius, 14×14 chevron icon with 180° rotation when open, 12px radius elevated option menu. Inset box-shadow border with hover, focus, and open states.
- **Story**: `Default / Shared / Select` (Default, WithHelper, Small, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Dropdown (`ds-menu` / `ds-dropdown`)
- **Source**: Action menus on platform.openai.com
- **Ground truth**: 32px compact button, 12px radius elevated popup menu (`var(--radius-xl)`), `var(--shadow-menu)`, 32px menu items with hover highlight and full keyboard navigation (ArrowDown, ArrowUp, Escape).
- **Story**: `Default / Shared / Dropdown` (Default, Secondary, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Date Picker (`ds-date-picker`)
- **Source**: Date range filter on platform.openai.com/usage
- **Ground truth**: 32px compact trigger with calendar SVG icon, 260px wide calendar dialog, 12px radius (`var(--radius-xl)`), `var(--shadow-lg)`, 7-column day grid with hover and active states.
- **Story**: `Default / Shared / Date Picker` (Default, WithHelper, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Popover (`ds-popover`)
- **Source**: Parameter filter panels on platform.openai.com
- **Ground truth**: 32px trigger button, 240px min-width card, 12px radius, elevated surface, shadow-lg, supports interactive form elements (checkboxes, radios, inputs).
- **Story**: `Default / Shared / Popover` (Default, PlacementRight, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Tool Tips (`ds-tooltip`)
- **Source**: Contextual tooltips on platform.openai.com
- **Ground truth**: 12px font size, 6px radius (`var(--radius-sm)`), 4px 8px padding, elevated background, subtle border, shadow-md, centered above trigger, pointer-events none.
- **Story**: `Default / Shared / Tool Tips` (Default, OnIconButton, Multiline; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Modal / Dialog (`ds-dialog`)
- **Source**: `.htOZM` + `._5XoXU` on platform.openai.com
- **Ground truth**: Fixed backdrop with 4px blur, max-width 480px, 12px radius, elevated surface, shadow-lg, header with title and 28px close icon button, footer with action buttons, scale(0.96) translateY(8px) -> scale(1) translateY(0) entrance motion, Escape and backdrop click dismiss.
- **Story**: `Default / Shared / Modal` (Default, Destructive; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Toggle Tips (`ds-inline-help`)
- **Source**: Contextual help tips on platform.openai.com
- **Ground truth**: 16px info icon button paired with switch or input labels, hover/focus reveals elevated tooltip panel.
- **Story**: `Default / Shared / Toggle Tips` (Default, InlineInput; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Notification (`ds-alert`)
- **Source**: Platform status banners on platform.openai.com
- **Ground truth**: 10px radius, 12px 16px padding, status icons, Info, Caution, Danger, and Success variants.
- **Story**: `Default / Shared / Notification` (Default, Caution, Danger, Success; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Tag & Filter Chip (`ds-badge` / `ds-filter-chip`)
- **Source**: Status badges and filter tags on platform.openai.com
- **Ground truth**: 24px pill badge (`--radius-full`), 20px small badge, 32px interactive dismissible filter chip.
- **Story**: `Default / Shared / Tag` (Default, Small, FilterChip, Active; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Link (`ds-link`)
- **Source**: Navigation and inline documentation links on platform.openai.com
- **Ground truth**: Primary underline link with 3px offset, external link with trailing arrow icon, subtle secondary link.
- **Story**: `Default / Shared / Link` (Default, External, Subtle, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Breadcrumb (`ds-breadcrumb`)
- **Source**: Navigation headers on platform.openai.com
- **Ground truth**: 14px font, `/` separator, active page bold primary text, interactive ancestor links.
- **Story**: `Default / Shared / Breadcrumb` (Default, DeepPath; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Pagination (`ds-pagination`)
- **Source**: Storage and logs tables on platform.openai.com
- **Ground truth**: 28px compact buttons, item range readout, disabled boundary states.
- **Story**: `Default / Shared / Pagination` (Default, FirstPage, LastPage; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Progress Bar & Indicator (`ds-progress-bar` / `ds-progress-indicator`)
- **Source**: Batch job status and multi-step fine-tuning on platform.openai.com
- **Ground truth**: 6px progress track with percentage fill and indeterminate animation, 24px numbered step circle indicators with connector lines.
- **Story**: `Default / Shared / Progress Bar`, `Default / Shared / Progress Indicator` (Default, Indeterminate, Complete; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Slider & File Uploader (`ds-slider` / `ds-dropzone`)
- **Source**: Playground parameters and Storage upload on platform.openai.com
- **Ground truth**: Range input with custom thumb and track, 12px radius dashed dropzone with format helper and attached files list.
- **Story**: `Default / Shared / Slider`, `Default / Shared / File Uploader` (Default, WithReadout, WithFiles, Disabled; Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Form, Lists & Data Table (`ds-form` / `ds-list` / `ds-table`)
- **Source**: Organization settings, docs guides, and files table on platform.openai.com
- **Ground truth**: 32px input form grid, bulleted/numbered lists, 12px radius contained cards, 2-column key-value metadata list, 36px header / 44px row data table with row selection.
- **Story**: `Default / Shared / Form`, `Default / Shared / List`, `Default / Shared / Contained List`, `Default / Shared / Structured List`, `Default / Shared / Data Table` (Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Universal Icon & SVG Sizing Fix
- **Issue**: Unconstrained SVGs in `.ds-empty` and `.ds-nav__item` expanded to container width (up to 868px).
- **Fix**: Added explicit rules in `vanilla/base.css`:
  - `.ds-icon`: 16×16px bounding box, stroke-width 2, `currentColor`.
  - `.ds-nav a .ds-icon, .ds-nav a svg, .ds-nav__item .ds-icon, .ds-nav__item svg`: 16×16px flex-shrink 0.
  - `.ds-empty .ds-icon, .ds-empty svg`: 32×32px flex-shrink 0, stroke-width 1.5, `var(--color-semantic-text-secondary)`.
- **Validation**: Playwright DOM bounding box measurements confirmed exact 32×32px and 16×16px geometry.

### Application Suite Components (Default)
- **Page Header**: 24px/28px H1, 600 weight, 32px secondary and primary buttons, optional breadcrumb above header.
- **Section Header**: 18px/20px H2, 600 weight, subtitle, optional 28px ghost/secondary action button.
- **Section Footer**: 28px height sync readout bar with compact actions (Discard, Save changes, View audit events).
- **Card Header**: 12px radius container, 16px medium title, secondary subtitle, status badge, 32px icon button.
- **Chart**: Analytics volume and latency breakdown rows with semantic bar classes (`.ds-bar-chart__bar--*`).
- **Empty State**: 120px min-height dashed container with centered 32px SVG icon, heading, body, and primary CTA.
- **Metric**: 12px radius KPI card with 48px bold headline, secondary label, and trend/status badge.
- **Navigation**: 32px height rows, 16px SVG icons, hover background, active page indicator (`aria-current="page"`).
- **Stories**: `Default / Application / *` (Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Supplemental Suite Components (Default)
- **Alert**: Caution, Info, Danger, Success banners with semantic border/background tokens and status icons.
- **Badge**: Neutral (24px), Active (`.ds-badge--active`), Danger (`.ds-badge--danger`), and Small 18px (`.ds-badge--sm`).
- **Chat**: Alternating user/assistant message bubbles, model avatar, and animated streaming cursor.
- **Code Block**: Monospace code surface with language badge and 28px ghost copy button.
- **Copy Field**: 32px input with embedded "Copy" action button.
- **Drawer**: Slide-out request inspector dialog with 4px backdrop blur and dismiss button.
- **Filter Chip**: 32px dismissible pill badge with 28px close icon button.
- **Icon**: Standard 16px SVG symbols with currentColor stroke.
- **Segmented Control**: 32px container with sliding thumb indicator and interactive tab buttons.
- **Skeleton**: 12px height pulse loading placeholders with tokenized shimmer.
- **Spinner**: 16px radial spinner with 800ms linear keyframe rotation.
- **Toast**: Fixed bottom-right notification card with success checkmark and dismiss button.
- **Stories**: `Default / Supplemental / *` (Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

### Enterprise Application Suite (AMS B2B)
- **Theme**: Enterprise tenant isolation theme (`.ds-brand-ams-b2b`) with high-density layout and vertical accent bars.
- **Components**: Page Header, Section Header, Section Footer, Card Header, Chart, Empty State, Metric, Navigation.
- **Stories**: `AMS B2B / Application / *` (Rule 0 compliant).
- **QA**: Layer 1 measurements & Layer 2 visual captures 100% verified.

## 2026-11-12

- All compact controls standardized to 32px: buttons, inputs, selects, date trigger, options, and filter chips.
- Added Storybook catalog at `Default / Shared / Button (and the matching component story)`.
- Added framework-free HTML/CSS/JS source and removed React/Vite app preview layers.

## Entry template

```md
## YYYY-MM-DD — ComponentName

- Feedback:
- Decision: product-only | promote to DS
- Visual/state changes:
- Token changes:
- Storybook story:
- Validation:
```
