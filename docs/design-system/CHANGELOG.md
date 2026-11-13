# Design system changes

Use this file for approved changes to public exports. Product-only tweaks stay in the product until promotion is approved.

## 2026-11-13 (QA Loop & Visual Fidelity Certification)

### Data Table Component (`ds-table`)
- **Source**: OpenAI Platform API Keys & Storage Table Model (`platform.openai.com/api-keys`).
- **Fidelity Specifications**:
  - **400 Font-Weight & Soft Typography**: All table cells enforce `font-weight: 400` (`var(--font-weight-normal)`) and `color: var(--color-semantic-text-secondary)` (#afafaf in dark mode), removing artificial bolds on resource names and keys.
  - **Darker Header with Sort & Info Indicators**: Table header `thead th` styled with darker background `var(--color-semantic-table-header-background)` (#181818 in dark mode / #f9f9f9 in light mode), sortable column (`.ds-table__sortable` with toggle chevron `Created ˅`), and info icons `ⓘ` on `Last used` and `Monthly spend`.
  - **Divider-Only Geometry (No Outer Border)**: Eliminated outer bounding wrapper border; table relies strictly on horizontal 1px divider lines (`var(--color-semantic-table-divider)`, #303030 in dark mode) between rows.
  - **Custom Scrollbar**: Implemented platform-styled 6px scrollbar on `.ds-table-wrap` (`::-webkit-scrollbar` and `scrollbar-width: thin`) with `var(--color-semantic-background-surface-secondary)` track and `var(--color-semantic-border-strong)` rounded thumb.
  - **Interactive Checkbox Selection**: Checkboxes in header and rows allow selecting individual rows (triggering `data-selected="true"`) or all rows at once.
  - **Row Actions**: Interactive inline action buttons including Copy Tracking ID (`.ds-table__copy-btn`), Edit key icon button, and Danger Delete trashcan icon button.
  - **Empty State**: Dedicated platform empty state (`.ds-platform-empty`) with 40px rounded icon container, title, description, and primary action button.
- **Tokens Added**: Added `color.semantic.table` tokens in `docs/design-system/tokens.json`: `headerBackground`, `rowHoverBackground`, `rowSelectedBackground`, and `divider`.
- **Ultra Button Sparkle Velocity**: Further accelerated `.ds-button--ultra` particle speed to `0.6s - 0.9s` duration with negative delays for instant, high-energy horizontal star flow.

### Button Component Suite (`ds-button`)
- **Structure & Style Sections**:
  - Divided each variant (`Default`, `Pill`, `Small`) into distinct style sections (`Primary`, `Secondary`, `Outline`, `Ghost`, `Danger (Outline)`, `Danger (Solid)`, `Ultrafast`).
  - Added SF Mono 12px headings (`.ds-story-section > header code`) for each style section to establish clear visual hierarchy and ease management.
  - Added interactive `disabled` (`:disabled`) and `loading` (`.ds-button--loading` with `.ds-button__spinner`) states alongside icon placement variations in every style row.
  - Removed duplicate `Icon Button` story export (icon-only buttons are natively covered in each style row).
- **Hierarchy & Structure**: Re-architected strictly as `Component (Button) -> Variants (Story) -> Styles -> Icon Variations (text-only, trái, phải, 2 bên, only)`. States (hover, active/pressed, focus, disabled, loading) are experienced purely through interactive testing without cluttering the catalog.
- **Strict 32px Standard Height**: Migrated `.ds-button--secondary` from external CSS border to `box-shadow: 0 0 0 1px ... inset`, ensuring 100% height equality (exactly 32px) across Primary, Secondary, Outline, Ghost, Danger, and Ultra.
- **Ultra Animated Refinement**:
  - Small, unblurred 2px particle stars (`.ds-button__sparkle`) with constant 0.55 opacity (no flickering, no scaling changes).
  - Smooth looping motion from left to right across the button (`@keyframes ds-sparkle-move`).
  - Darker tint on hover (`filter: brightness(0.85)`) without outer glow box-shadow.
- **Complete Variants Matrix**:
  - `Default` (32px standard height): Primary, Secondary, Outline, Ghost, Danger Soft, Danger Solid, Ultra.
  - `Pill` (border-radius: full): Full radius across all styles and icon placements.
  - `Small` (28px compact height): Dense layout across all styles and icon placements.
  - `IconButton` (32px & 28px icon-only): Dedicated matrix across Ghost, Primary, Secondary, Outline, Danger Soft, Danger Solid, and Ultra.
- **Semantic Tokens**: Tokenized button colors in `docs/design-system/tokens.json`: `ultraBackground`, `ultraBackgroundHover`, `ultraText`, `dangerSolidBackground`, `dangerSolidBackgroundHover`, `dangerSolidText`, and `dangerSoftHoverBackground`.
- **Compliance**: Zero inline styles, zero color literals, verified passing `npm run ds:verify`.

### Chart & Data Visualization System (`ds-chart`)
- **Source**: OpenAI Platform Dashboard Overview (`platform.openai.com`) and Usage Dashboard (`platform.openai.com/usage`).
- **New Variants & Interactive Systems**:
  - `Default` (Home Activity Area Chart): Interactive SVG time-series curve with gradient fill, horizontal dashed grid lines, dynamic mouse-tracking cursor line (`.ds-chart-area__cursor-line`), snapping cursor dot (`.ds-chart-area__cursor-dot`), floating breakdown popover tooltip (`.ds-chart-tooltip`), and Arrow key stepping.
  - `DailyCosts` (Usage Daily Spend Stacked Bar Chart): 14 daily vertical stacked bar columns (`.ds-chart-col`) segmented by model (`gpt-4o`, `gpt-4o-mini`, `o3-mini`, `text-embedding-3`), reference soft-limit threshold line at $15.00, interactive column hover highlighting with sibling dimming, full breakdown floating tooltip, keyboard navigation (ArrowLeft/Right), and interactive series legend filtering.
  - `CumulativeSpend` (Monthly Budget Burn-up): Cumulative spend curve tracking actual spend against soft limit ($100) and hard limit ($120) with projected burn trajectory to end of month.
  - `ModelDistribution` (Usage Model Share Donut): SVG Donut ring (`.ds-chart-donut`) with segmented model arcs, dynamic center readout displaying spend and share, and interactive legend rows that highlight matching arcs on hover.
  - `Comparison` (Horizontal TTFT & Generation Latency): Multi-segmented horizontal bar chart breaking down Time to First Token vs Token Generation Time with interactive row hover and tooltips.
- **Tokens**: Added `color.semantic.chart` tokens (`seriesPrimary` #0285ff, `seriesSecondary` #10a37f, `seriesTertiary` #ab68ff / dark #b87cf8, `seriesQuaternary` #f59e0b / dark #fbbf24, `seriesMuted` #767676 / dark #8f8f8f, `threshold` #ba2623 / dark #fa423e).
- **AMS B2B Variant**: Added `AMS B2B / Application / Chart` with `Default` (PTU Cluster Utilization) and `Throughput` (Provisioned Throughput TPM live telemetry).
- **Compliance**: 0 inline styles, 0 hex/rgb literals in component source, respects `prefers-reduced-motion` and compact 32px control standards.

### Date Picker Component (`ds-date-picker`)
- **Source**: Live OpenAI Platform Usage Date Picker (`platform.openai.com/usage`).
- **Fidelity Redesign to 100% Platform Match**:
  - **Zero-Guess Skill Protocol**: Updated `.agents/skills/component-audit/SKILL.md` with Section 0 ("Mandatory Screenshot & Live Platform Ground-Truth Protocol") and created global Antigravity Skill `openai-ui-qa`.
  - **Larger Date Font Size**: Scaled date numbers from 12px to 14px (`var(--font-size-sm)`), creating clear visual distinction from 12px weekday headers.
  - **Circular Hover Outline**: Implemented 1px solid circular outline on hover (`border-color: var(--color-semantic-ring-focus)`) with transparent background on resting dates, matching live platform.
  - **Outer Border & Divider**: Updated `.ds-date-picker__dialog` and `.ds-date-picker__presets` to use `var(--color-semantic-border-default)`, ensuring a crisp, visible outer border and vertical pane separator.
  - **Range Strip Physics ("Bo, không tròn")**: Replaced 9999px pill semi-circle caps with subtle 6px rounded corners (`var(--radius-sm)`), accurately reflecting the live platform's rectangular bo range styling.
  - **Soft Typography & Contrast**: Softened month title and calendar dates to `var(--color-semantic-text-secondary)` (#dcdcdc) and weekdays to `var(--color-semantic-text-tertiary)` (#afafaf).
  - **Single Month Restoration**: Fixed `SingleMonth` story to render all 30 days of November 2026, proper 264px container geometry, open-by-default display, and single-click date selection.
  - **Full 400 Typography Contract**: Enforced `font-weight: 400` (`var(--font-weight-normal)`) across all calendar dates, active/start/end circle badges, month navigation titles, weekday labels, and preset list items.
  - **Semantic Tokens**: Introduced tokenized range colors in `docs/design-system/tokens.json` (`color.semantic.datePicker.rangeBackground`, `rangeText`, `presetActiveBackground`), resolving in dark mode to `#414141` / `#ffffff` and in light mode to `#ededed` / `#0d0d0d`.
  - **Layout & Column Alignment**: Segmented the navigation bar into dual month headers sitting directly over each 224px month view. Previous chevron positioned on the far left of October; Next chevron positioned on the far right of November.
  - **Range Strip Physics**: Connected continuous selection track with automatic row-wrap caps (`:nth-child(7n+1)` left radius, `:nth-child(7n)` right radius). Start day on Saturday 7 retains clean circle; Sunday 8 caps smoothly; Friday 13 ends with 50% linear-gradient behind the white circular badge.
  - **Clean Component Isolation**: Removed external filter tabs and utility buttons (reset, download), keeping the story focused purely on the Date Picker component.
  - **Popover Dialog (`.ds-date-picker__dialog`)**: Horizontal 2-pane structure with left presets list and right dual-month calendar view using `var(--color-semantic-background-menu)`.
  - **Left Presets**: `Week to date`, `Month to date`, `Last 7 days` (with checkmark `✓` and active pill background), `Last 14 days`, `Last 30 days`.
  - **Right Dual Calendar**: 2 months side-by-side (October 2026 & November 2026) with `<` and `>` month navigation chevrons.
  - **Full Interactive Date Range Selection**:
    - All calendar days across both months are fully enabled and clickable.
    - Two-click range selection: First click sets start date, hover previews range, second click sets end date and updates the range strip.
    - Solid circular badges for start and end days with high-contrast text and 400 weight.
    - "Today" indicator dot below current date (Nov 13).
    - Presets sync: Clicking presets dynamically updates the selected range and trigger label; custom selection clears preset checkmark.

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
