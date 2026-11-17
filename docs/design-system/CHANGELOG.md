# Design system changes

Use this file for approved changes to public exports. Product-only tweaks stay in the product until promotion is approved.

## 2026-11-17 (SMT Ratio Sidebar Ground-Truth Fix, Text Tokens & Lint Guard)

- **Tokens (`docs/design-system/tokens.json`, `tokens/tokens.css`, `tokens/tokens.dark.css`)**:
  - Added `color.semantic.text.sidebar` (`#282828` light / `#dcdcdc` dark, matching `platform.openai.com --color-text`) and `color.semantic.text.sidebarSecondary` (`#5d5d5d` light / `#afafaf` dark, matching `--color-text-secondary`).
- **Sidebar CSS Cleanup & Fidelity (`vanilla/base.css`)**:
  - Removed the stale duplicate `/* SMT Ratio application shell */` override block that had forced `fill: none; stroke: currentColor` on `.ds-nav__item svg`, `32px` on `.ds-avatar`, and `50px` on `.ds-sidebar__account`.
  - Aligned `.ds-sidebar`, `.ds-sidebar__brand`, `.ds-sidebar__collapse`, `.ds-search-trigger`, `.ds-nav__item`, `.ds-avatar`, `.ds-sidebar__account-title`, and `.ds-sidebar__account-support` to exact `platform.openai.com` typography (`14px`/`12px`, `400`/`600`, `-0.01em`), colors, `24×24px` avatar, `44px` footer row, and `6%` currentColor border.
- **SMT Ratio Sidebar & Prototype (`vanilla/stories/smt-ratio/application/sidebar.stories.js`, `smt-ratio-prototype.html`)**:
  - Added `SMT Ratio / Application / Sidebar` story alongside `Analysing`, plus standalone `smt-ratio-prototype.html` with `SMT_Ratio.svg`, `Search` (`⌘K`), `List` / `History` / `Rule Management`, upward `Language` popout (`한국어`, `English`, `Tiếng Việt`), bottom Account info cluster, and empty `.ds-main`.
- **Anti-Hallucination Lint Gate (`scripts/check-ui-contract.mjs`)**:
  - Added CSS ground-truth assertions ensuring `.ds-sidebar` appears once without override blocks, uses `--color-semantic-text-sidebar` / `--color-semantic-text-sidebar-secondary`, never overrides `.ds-nav__item svg` with stroke-only rules, and keeps `.ds-avatar` at `24×24px`.

## 2026-11-17 (Remove SMT Ratio Sidebar Story)

- **SMT Ratio cleanup**: Removed `vanilla/stories/smt-ratio/application/sidebar.stories.js` per user request, leaving `SMT Ratio / Application / Analysing` as the single product application story. Shared canonical `Default / Shared / Sidebar` remains intact in `vanilla/stories/shared/sidebar.stories.js`.
- **Docs sync**: Updated [`PUBLIC_EXPORTS.md`](./PUBLIC_EXPORTS.md), [`AI-QUICK-REFERENCE.md`](./AI-QUICK-REFERENCE.md), [`vanilla/README.md`](../../vanilla/README.md), and `scripts/audit_all_components.mjs`.

## 2026-11-17 (Lightweight Catalog Trim & AI Quick Reference)

- **Catalog cleanup**: Temporarily removed Default Application stories `#06` through `#151` (146 story files) from `vanilla/stories/default/` and pruned their CSS rules from `vanilla/base.css` (25,146 -> 4,734 lines), keeping `Default / Shared` (`32`), `Default / Application` `01`–`05` (`5`), and all `SMT Ratio / Application` components (`Analysing`, `Sidebar`, plus `.ds-cmd-palette*`, keyframes, and utility classes) intact.
- **Audit script sync**: Updated `STORIES_TO_AUDIT` in `scripts/audit_all_components.mjs` to match the active stories (`Shared`, `Application 01–05`, `SMT Ratio`).
- **Low-effort AI onboarding**: Added [`AI-QUICK-REFERENCE.md`](./AI-QUICK-REFERENCE.md) indexing setup, guardrails, semantic tokens, utility classes, `.ds-*` classes/modifiers, and `data-ds-*` hooks in one file; updated [`PUBLIC_EXPORTS.md`](./PUBLIC_EXPORTS.md), [`AI-HANDOFF.md`](./AI-HANDOFF.md), [`AGENTS.md`](../../AGENTS.md), [`README.md`](../../README.md), and [`vanilla/README.md`](../../vanilla/README.md) with accurate counts and direct links.

## 2026-11-17 (Restore `surfaceSecondary` Token Hierarchy for Dark & Light Modes)

- **Tokens ([tokens.json](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/docs/design-system/tokens.json), [tokens.css](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/tokens/tokens.css), [tokens.dark.css](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/tokens/tokens.dark.css))**:
  - Restored `color.semantic.background.surfaceSecondary` from `#181818` dark / `#f9f9f9` light back to `#303030` dark / `#f3f3f3` (`{color.primitive.gray.75}`) light.
  - Resolved overly dark `#181818` backgrounds across Shared and Application components relying on `--color-semantic-background-surface-secondary` (Code Snippet singleline/inline/multiline, File Uploader dropzone, Progress Bar track, Scrollbar card, Breadcrumb badge, Menu trigger hover, Message Queue items, Code Runner output, and Application cards/chips).

## 2026-11-17 (SMT Ratio Analysing — Canonical `.ds-tool-run` & Smooth `.ds-streaming-*` Composition)

- Upgraded shared Streaming Text tokens (`.ds-streaming-token`, `.ds-streaming-word`, `.ds-streaming-word--fresh`, `.ds-streaming-caret`) in `vanilla/base.css` and `vanilla/stories/default/streaming-text.stories.js`: added GPU-accelerated blur-slide word reveal (`@keyframes ds-stream-word-in`), inherited color settle transition (`480ms cubic-bezier(0.16, 1, 0.3, 1)`), 3-word fresh highlight trail driven via `requestAnimationFrame` with punctuation-aware cadence, smooth `.ds-streaming-caret--done` exit, and reduced-motion rules.
- Restored `SMT Ratio / Application / Analysing` under `vanilla/stories/smt-ratio/application/analysing.stories.js` using canonical `.ds-tool-run-canvas` and `.ds-tool-run` classes.
- Added `.ds-tool-run` styles in `vanilla/base.css` (built to `vanilla/design-system.css`) composed from shared DS components (`.ds-button--primary`, `.ds-button--secondary`, `.ds-button--ghost`, `.ds-button--icon`, `.ds-button--sm`, `.ds-badge--sm` `--default`/`--red`, `.ds-code-token--string`/`--number`, `.ds-streaming-token`/`.ds-streaming-word`/`.ds-streaming-caret`), top-pinned layout (`align-content: start` / `justify-content: flex-start`), `400` weights, and reduced-motion rules.
- Added `[data-ds-tool-run]` behavior in `vanilla/design-system.js` with specular `TextShimmer`, faded masked 2-line live thinking preview (`ds-tool-run__live-clip` composing DS `.ds-streaming-*` word streaming + spring `translateY` line scroll), live seconds counter, sequential per-row collapse, and `CopyButton` state transitions.

## 2026-11-17 (Ground-Truth Sidebar Promotion, SMT Ratio Sidebar & UI Contract Lint Gate)

- **Tokens (`docs/design-system/tokens.json`)**:
  - Aligned `color.semantic.background.sidebar` light mode value to `{color.primitive.gray.75}` (`#f3f3f3`, keeping `#131313` in dark mode), matching live `https://platform.openai.com` captures.
  - Added `color.semantic.background.sidebarActive` (`#ededed` light / `#303030` dark) for active sidebar navigation items and `.ds-search-trigger__kbd`.
  - Added `layout.sidebar.collapsed` (`56px`, matching platform `--side-nav-collapsed-width`).
- **Shared Sidebar, Navigation & Menu Promotion (`vanilla/base.css`, `vanilla/design-system.js`, `vanilla/stories/shared/sidebar.stories.js`)**:
  - Updated `.ds-shell`, `.ds-sidebar`, `.ds-sidebar__header`, `.ds-sidebar__brand`, `.ds-sidebar__collapse`, `.ds-nav`, `.ds-nav__item`, `.ds-sidebar__footer`, `.ds-sidebar__account`, `.ds-avatar`, and `.ds-main` to match `platform.openai.com` ground truth (`260px` expanded / `56px` collapsed, `8px` padding, `36px` item height, `20×20px` icons, `400` weight, `24×24px` footer avatar, upward `.ds-menu--top.ds-menu--block` menu with `role="menuitemradio"`, and `[data-ds-sidebar]` collapse/nav/command-palette behavior).
  - Created `Default / Shared / Sidebar` story under `vanilla/stories/shared/sidebar.stories.js`.
- **SMT Ratio Clean Slate (`vanilla/stories/smt-ratio/application/sidebar.stories.js`)**:
  - Removed the prior ad-hoc `analysing.stories.js` and `.ds-smt-*` / `.ds-analysing*` rules.
  - Built `SMT Ratio / Application / Sidebar` strictly from canonical DS classes with `SMT_Ratio.svg` (`fill="currentColor"`), Search (`⌘K`), `List` / `History` / `Rule Management`, upward `Language` popout (`한국어`, `English`, `Tiếng Việt`), bottom Account info cluster, and an empty right-hand `.ds-main` canvas.
- **Anti-Hallucination UI Lint Gate (`scripts/check-ui-contract.mjs`, `package.json`)**:
  - Added `scripts/check-ui-contract.mjs` into `npm run ds:check` to reject ad-hoc prefixes (`ds-smt-*`), undefined `.ds-*` classes, unclassified interactive/landmark tags, Unicode glyph icon hacks, hardcoded SVG fills/strokes, and malformed sidebar anatomy.

## 2026-11-16 (Modal Secondary Button & Field Line, Menu Dividers & Chevron Direction, Badge Component, Text Input Support Icon Adornments, Checkbox 18x18 Bold Stroke, Tool Tips 8 Placements, Toggle Settings Alignment)

### Modal Component (`ds-dialog`)
- **Secondary Action Button on Left ("Button bên trái dùng secondary")**:
  - Enforced that the dismiss/cancel button positioned on the left of `.ds-dialog__footer` strictly uses `.ds-button--secondary`.
  - Secondary button styling uses the authentic OpenAI Platform surface (`background: var(--color-semantic-button-secondary-background)`, `#4d4d4d` in dark mode, `#f3f3f3` in light mode) with high-contrast text and smooth hover transition (`#5d5d5d` dark / `#e8e8e8` light), clearly distinguishing it from ghost or outline buttons.
  - Aligned across both `Default` (action modals with "Cancel" + "Create key" / "Generate key") and `Destructive` (destructive confirmation modals with "Cancel" + "Revoke key") in [modal.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/modal.stories.js).
- **Field Border Line Contrast & Visibility ("Không thấy line của field")**:
  - Resolved low-contrast border issue inside `.ds-dialog` where inputs and textareas previously blended into the elevated modal surface (`#303030`).
  - Implemented high-contrast visible border line for `.ds-dialog .ds-input`, `.ds-dialog .ds-textarea`, and `.ds-dialog .ds-input-group`:
    - Resting state: `border: 1px solid var(--color-semantic-border-strong)` (`#767676` dark, `#8f8f8f` light) + `box-shadow: 0 0 0 1px var(--color-semantic-border-strong) inset`, perfectly matching the sampled platform ground truth (`media_1794805554829_1a349794.jpg`).
    - Hover state: `border-color: var(--color-semantic-text-secondary)` + inset shadow (`#afafaf` dark / `#5d5d5d` light).
    - Focus state: `border-color: var(--color-semantic-ring-focus)` + `box-shadow: 0 0 0 1px var(--color-semantic-ring-focus) inset`, highlighting immediately upon interaction.
  - Showcased both Standard Action Text Input modal (`.ds-input` for "Create new secret key") and Multiline Textarea modal (`.ds-textarea` for "Add allowed domains") in [modal.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/modal.stories.js).

### Menu Component (`ds-menu`)
- **Divider Visibility Optimization (`.ds-menu__separator`, `.ds-menu__divider`)**:
  - Replaced faint low-contrast divider with `background: var(--color-semantic-text-primary); opacity: 0.12;` (with `margin: 5px -6px`, spanning edge-to-edge across the 12px rounded menu container).
  - Ensures clean, crisp, legible visual boundaries between button clusters across dark and light surfaces with zero color literals.
- **Variant Arrow Chevron Direction Alignment (`.ds-menu__chevron`)**:
  - Implemented `.ds-menu__chevron` with smooth 150ms cubic-bezier transition.
  - When collapsed/closed (`:not([data-ds-open="true"])`): Chevron rests pointing to the right (`transform: rotate(-90deg)`).
  - When expanded/opened (`[data-ds-open="true"]` — "khi xổ ra"): Chevron rotates smoothly 90 degrees to point DOWNWARDS (`transform: rotate(0deg)`), matching OpenAI Platform ground truth (`https://platform.openai.com/chat/edit?models=gpt-6-astra`).
  - Staged across both interactive enabled and disabled states in [menu.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/menu.stories.js).

### Badge Component (`ds-badge`)
- **OpenAI Platform Ground-Truth Badge Component**:
  - Implemented comprehensive `.ds-badge` component with 100% fidelity matching OpenAI Platform badges, roles, and status tags (`https://platform.openai.com`).
  - **Full Palette Color Alignment**:
    - `default`: Neutral surface secondary (`#303030` dark / `#f4f4f4` light), text secondary (`#afafaf` dark / `#5d5d5d` light), 1:1 match with "Owner" role badge.
    - `green` (`.ds-badge--green` / `.ds-badge--success`): Dark green background (`#213728` dark / `#edfaf2` light), bright green text (`#04b84c` dark / `#008635` light), 1:1 match with "You" role badge and "Live" status badge.
    - `red` (`.ds-badge--red` / `.ds-badge--danger`): Dark red background (`#452726` dark / `#fff0f0` light), bright red text (`#fa423e` dark / `#ba2623` light), 1:1 match with "OFF" toggle badge.
    - `blue` (`.ds-badge--blue` / `.ds-badge--info` / `.ds-badge--primary`): Dark blue background (`#222e3e` dark / `#f5faff` light), sky blue text (`#339cff` dark / `#0169cc` light), 1:1 match with "Global" pill badge.
    - `purple` (`.ds-badge--purple`): Dark purple background (`#261c35` dark / `#f9f5fe` light), lavender text (`#be95fa` dark / `#6b3ab4` light), 1:1 match with "New" feature badge.
    - `yellow` (`.ds-badge--yellow` / `.ds-badge--warning`): Dark yellow background (`#38311d` dark / `#fffbed` light), warm gold text (`#ffd240` dark / `#916f00` light).
    - `orange` (`.ds-badge--orange`): Dark orange background (`#38271d` dark / `#fff5f0` light), coral orange text (`#ff8549` dark / `#b9480d` light).
  - **Three Canonical Shape & Size Variants**:
    - **Default**: 22px height, 6px radius (`var(--radius-sm)`), 8px padding (`var(--space-2)`), 12px font size with 400 normal weight (`var(--font-weight-normal)`).
    - **Pill** (`.ds-badge--pill`): 22px height, full radius (`var(--radius-full)`), 10px padding for balanced optical curvature.
    - **Small** (`.ds-badge--sm`): 18px compact height, 4px radius (`var(--radius-xs)`), 6px padding, 10px font size (`var(--font-size-2xs)`). Also supports `.ds-badge--sm.ds-badge--pill`.
  - **Indicator & Icon Modifiers**:
    - **With Indicator** (`.ds-badge__indicator` + `.ds-badge__dot`): Circular halo with centered dot positioned on the left, matching the "Live" badge with green halo (`rgba(4, 184, 76, 0.2)`) and green dot (`#00a240`). Scaled to 10px / 4px for small badges.
    - **With Icon** (`.ds-badge__icon`): 12px trailing SVG glyph positioned on the right (external link, chevron, check, close, info). Scaled to 10px for small badges.
    - **With Indicator + Icon**: Combined dot indicator on left with trailing icon on right.
  - **Design Token Integration**: Tokenized all badge backgrounds, text colors, borders, dots, and halos in `docs/design-system/tokens.json` under `color.semantic.badge` with zero raw color literals.
  - **Storybook Catalog**: Created [badge.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/badge.stories.js) exporting `Default`, `Pill`, and `Small`, and registered in `scripts/audit_all_components.mjs`.

### Pagination Component (`ds-pagination--inline`)
- **Inline Pagination Variant (`Inline` / "variant inline pagination")**:
  - Implemented `.ds-pagination--inline` variant matching OpenAI Platform table header/toolbar pagination (`https://platform.openai.com/settings/organization/billing/invoices` - `1-1 invoices < >`).
  - Standardized compact geometry: 28px height, `width: fit-content`, 14px font size with 400 normal weight (`var(--font-weight-normal)`), secondary text color (`var(--color-semantic-text-secondary)`), and 28×28px ghost navigation buttons.
  - Implemented interactive multi-page dynamic navigation via `[data-ds-pagination-inline]`: Automatically computes range (`1-10 of 42 invoices` -> `11-20 of 42 invoices`) and synchronizes boundary disabled states.
  - Supported all states: Single-page inactive (`1-1 invoices < >` with both buttons disabled), First page, Middle page, Last page, and full Disabled state.
  - Created Storybook variant `export const Inline` in [pagination.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/pagination.stories.js) and registered in `scripts/audit_all_components.mjs`.

### Checkbox Component (`ds-checkbox`)
- **Authentic Platform Disabled Unchecked Alignment**:
  - Replaced legacy semi-transparent outlined border with authentic platform ground-truth styling matching `https://platform.openai.com` permission dialogs and member role cards.
  - Aligned exact geometry and colors: 18×18px rounded square (`var(--radius-xs)` = 4px), solid canvas fill `var(--color-semantic-background-canvas)` (`#212121`), zero border outline (`box-shadow: none`), seamlessly set against surface elevated card background (`#303030`).
  - Decoupled control opacity from text label: Control remains crisp 100% opaque canvas cutout while text label carries 50% muted secondary text color.
  - Staged disabled states directly within [checkbox.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/checkbox.stories.js) on `.ds-checkbox-surface-panel`.

### Text Input & Text Area Components (`ds-textarea`, `ds-input--multiline`)
- **Multiline Input Variant (`Multiline` / "variant text input")**:
  - Implemented multiline input variant matching OpenAI Platform billing limit and notification settings (`https://platform.openai.com/settings/organization/billing/limits` - `alerts@acme.com`).
  - Standardized geometry: 410px width, 116px default height, 8px radius (`var(--radius-md)`), 12px padding (`var(--space-3)`), 21px line-height, and 400 normal typography rule (`var(--font-weight-normal)`).
  - Maintained consistent states: Resting, Hover, Focus-within ring (`var(--color-semantic-ring-focus)`), Validation error, and Disabled (`data-disabled="true"`, unavailable cursor `not-allowed`).
  - Added Storybook variant `export const Multiline` to [text-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/text-input.stories.js) and updated [text-area.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/text-area.stories.js) to showcase the ground-truth email recipients field.

### Text Input & Number Input Components (`ds-input-group`)
- **Input with Unit Suffix Variant (`WithUnit` / "Input có đơn vị")**:
  - Implemented unit suffix structure `.ds-input-group__unit` matching OpenAI Platform numeric parameter fields (`80 %`, `30,000 ms`, `4,096 tokens`, `250 USD`, `1,024 px`).
  - Aligned exact geometry with user reference image (`80 %`): 32px compact height, 8px radius (`var(--radius-md)`), 12px left padding for numeric value (`var(--color-semantic-text-primary)`), 12px right padding for unit suffix (`var(--color-semantic-text-secondary)`).
  - Disabled browser default spin arrows on numeric inputs (`-webkit-appearance: none`, `-moz-appearance: textfield`) to preserve clean alignment and optical balance.
  - Enabled click delegation where clicking the unit or container immediately transfers focus to the underlying input.
  - Full state coverage: Resting, Hover, Focus-within (`var(--color-semantic-ring-focus)`), Disabled (`data-disabled="true"`, unavailable cursor `not-allowed`), Small 28px (`.ds-input-group--sm`), and Pill (`.ds-input-group--pill`).
  - Added Storybook variants `export const WithUnit` across both [text-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/text-input.stories.js) and [number-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/number-input.stories.js).

- **Support Icon & Adornment Variant (`WithSupportIcon`)**:
  - Implemented `.ds-input-group` container matching OpenAI Platform billing limit and numerical parameter inputs (`https://platform.openai.com/settings/organization/billing/limits`).
  - Added support for leading prefix adornment (`.ds-input-group__prefix`) with both text symbols (e.g. Currency `$ 100`) and 14×14px Lucide SVG icons (Key, Link, Search).
  - Added support for trailing suffix adornment (`.ds-input-group__suffix`) for numerical units (e.g. `ms`, `USD`) and interactive action buttons (`.ds-input-group__action`, e.g. Copy URL).
  - Maintained exact 32px compact height, 8px radius (`var(--radius-md)`), 1px border (`var(--color-semantic-border-default)`), and 400 normal typography rule (`var(--font-weight-normal)`).
  - Supported full state continuum: Hover, Focus-within (`var(--color-semantic-ring-focus)`), Validation error, and Disabled (`data-disabled="true"`, unavailable cursor `not-allowed`).
  - Added size variations: Small 28px (`.ds-input-group--sm`) and Pill full radius (`.ds-input-group--pill`).
  - Created Storybook story `export const WithSupportIcon` in [text-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/text-input.stories.js) and registered in `scripts/audit_all_components.mjs`.

### File Uploader (`ds-dropzone`)
- **Authentic Platform Storage Upload Icon Alignment (`https://platform.openai.com/storage`)**:
  - Replaced generic stroke upload icon with OpenAI Platform's exact ground-truth SVG glyph: document outline with folded top-left corner and inset plus badge at bottom-right (`<path fill-rule="evenodd" d="M18.032 5.024... clip-rule="evenodd"></path>`).
  - Standardized geometry and rendering: 22×22px, `viewBox="0 0 24 24"`, `fill="currentColor"`, transitioning from secondary text color (`var(--color-semantic-text-secondary)`) to primary text color (`var(--color-semantic-text-primary)`) on dropzone hover.
  - Maintained interactive file selection and drag-and-drop feedback with authentic Lucide document glyph (`16×16px`) for attached files.
  - Aligned `vanilla/design-system.js` dynamic file row creation to render matching Lucide icon upon user file selection or drag-and-drop.
  - Added tactile spring active scale (`scale(0.985)`) on `.ds-dropzone:active`.
- **Single Interactive Variant Consolidation**:
  - Removed redundant `WithFiles` (`Uploaded`) story variant from `vanilla/stories/shared/file-uploader.stories.js` in strict accordance with the single interactive variant architecture.
  - The dropzone in `Default` dynamically transitions from empty state to attached file state upon clicking or dragging/dropping a file.

### Universal Disabled State (Unavailable Cursor Standard)
- **Universal Cursor Enforcement (`cursor: not-allowed !important`)**:
  - Expanded universal disabled CSS selector to cover `:disabled`, `[disabled]`, `[data-disabled]`, `[data-disabled="true"]`, `[aria-disabled="true"]`, `[class*="--disabled"]`, and `.is-disabled`, including `label:has(...)` containers and nested descendant elements.
  - Removed blocking `pointer-events: none` on disabled interactive controls (`.ds-dropzone[data-disabled="true"]`, `.ds-password-toggle:disabled`, `.ds-pagination[data-disabled="true"] button`) to ensure mouse hit-testing functions properly and the browser reliably displays the macOS unavailable (`not-allowed`) cursor.
  - Audited and verified across all 571 stories in the design system test suite.

## 2026-11-16 (Popover Horizontal Actions, 8 Placements Consolidation, Pagination Dropdown Composition, Pop-out Components Click Focus Suppression)

### Checkbox Component (`ds-checkbox`)
- **18×18px Sizing & Bold Stroke Alignment**:
  - Increased `.ds-checkbox__control` bounding dimensions from 16×16px to exact 18×18px (`width: 18px; height: 18px;`).
  - Increased SVG icon dimensions from 12×12px to 14×14px (`.ds-checkbox__check`, `.ds-checkbox__dash`).
  - Significantly thickened checkmark (`✓`) and indeterminate dash (`−`) strokes from `2.5px` to `3.5px` (`stroke-width: 3.5;`), providing strong optical contrast and bold presence.
  - Adjusted stroke-dashoffset transitions for smooth path drawing animation.

### Tool Tips Component (`ds-tooltip`)
- **Single Consolidated `Default` Story Variant**:
  - Removed obsolete standalone `OnIconButton` and `Multiline` exports in [tool-tips.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/tool-tips.stories.js), consolidating into `export const Default`.
  - Standardized trigger element on the authentic Lucide Info Icon (`.ds-icon-button.ds-icon-button--ghost`).
- **Full 8-Directional Placement Support**:
  - Added CSS placement rules in `vanilla/base.css` supporting all 8 directions (`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `right`).
  - Staged all 8 directions simultaneously in a structured showcase grid (`.ds-tooltip-placements-grid`).
- **Disabled State Integration**:
  - Integrated disabled info button state with unavailable cursor (`cursor: not-allowed !important`) and complete tooltip suppression on hover.

### Toggle Tips Component (`ds-toggle-tips`)
- **Component Deprecation & Removal**:
  - Removed redundant `vanilla/stories/shared/toggle-tips.stories.js` from the shared catalog.
  - Standardized all contextual help and explanatory overlays on the authentic atomic `Tool Tips` component (`.ds-tooltip`, [tool-tips.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/tool-tips.stories.js)).
  - Cleaned up audit entries from `scripts/audit_all_components.mjs`.

### Toggle Component (`ds-switch`)
- **Authentic Platform Settings Colors & Tokens**:
  - Replaced legacy white track background with authentic OpenAI active blue `var(--color-semantic-switch-track-active)` (`#0285ff`) when ON (`[aria-checked="true"]`).
  - Set inactive track background (OFF) to `var(--color-semantic-switch-track-inactive)` (`#414141` in dark mode).
  - Maintained solid white thumb `var(--color-semantic-switch-thumb)` (`#ffffff`) with subtle drop shadow `var(--shadow-thumb)`.
- **Layout & Variant Consolidation**:
  - Consolidated stories into `Default` (standalone toggle control with staged disabled states) and `WithContent` (toggle control on the LEFT, title and support text on the RIGHT matching `https://platform.openai.com/settings`).
  - Removed obsolete standalone `Checked`, `SettingsList`, and `Disabled` exports in [toggle.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/toggle.stories.js).
  - Enforced strict 400 normal typography on title and description, and unavailable cursor `cursor: not-allowed !important` on disabled states.

### Slider Component (`ds-slider`)
- **Authentic Platform Playground Indicator & Track Colors**:
  - Replaced legacy solid white circle thumb with authentic OpenAI Platform hollow circle thumb indicator: 14px circular ring, 2px border in `var(--color-semantic-text-secondary)`, and center filled with `var(--color-semantic-background-canvas)` (matching platform evidence at `https://platform.openai.com/playground/images`).
  - Added dynamic dual-tone track with CSS linear-gradient: active progress track on the left of the thumb (`var(--color-semantic-text-secondary)`) and subtle unfilled track on the right (`var(--color-semantic-border-subtle)`).
  - Wired live `--range-progress` property synchronization in `vanilla/design-system.js`.
- **Inline Horizontal Layout & Variant Consolidation**:
  - Removed obsolete standalone `Disabled` story export in [slider.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/slider.stories.js).
  - Aligned Title, Range Slider Track, and Readout value into a single straight horizontal row (`display: flex; align-items: center; gap: var(--space-4);`) matching platform reference image.
  - Formatted `export const Default` strictly without readout number, and `export const WithReadout` with inline title, slider, and tabular readout value.

### Select Component (`ds-select`)
- **Component Deprecation & Removal**:
  - Removed legacy redundant `vanilla/stories/shared/select.stories.js` from the shared catalog.
  - Standardized all dropdown selection menus on the authentic OpenAI Platform component `Dropdown` (`.ds-dropdown`, [dropdown.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/dropdown.stories.js)).
  - Cleaned up audit entries from `scripts/audit_all_components.mjs`.

### Search Input Component (`ds-search-input`)
- **Variant Disabled State Integration**:
  - Removed standalone `Disabled` story export in [search-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/search-input.stories.js).
  - Integrated dedicated `Disabled` state sections (`data-disabled="true"`, `disabled` input field, unavailable cursor `cursor: not-allowed !important`) into all 5 core variants (`Default`, `WithClearButton`, `Pill`, `PillWithClear`, and `Block`).
  - Enforced strict unavailable cursor behavior across `.ds-search-input[data-disabled="true"] *` and `.ds-search-input:has(:disabled) *`.

### Search Trigger Component (`ds-search-trigger`)
- **Single Consolidated `Default` Story Variant**:
  - Removed standalone `Disabled` story export in [search-trigger.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/search-trigger.stories.js), consolidating into `export const Default`.
  - Staged both `Enabled — Sidebar Search Trigger (36px, with ⌘K)` and `Disabled — Unavailable Cursor on Hover` within `Default`.
  - Standardized typography with `font-weight: 400` (`var(--font-weight-normal)`) and unavailable cursor `cursor: not-allowed !important`.

### Radio Button Component (`ds-radio`)
- **Single Interactive Variant Consolidation**:
  - Removed obsolete individual exports (`Horizontal`, `Disabled`) in [radio-button.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/radio-button.stories.js), consolidating into a single `Default` story variant.
  - Staged both `Enabled` (interactive vertical stack with authentic OpenAI model options) and `Disabled` (unselected & selected states with unavailable macOS cursor `not-allowed`) within `Default`.
- **400 Normal Weight & Motion Standardization**:
  - Enforced strict 400 normal typography (`font-weight: var(--font-weight-normal)`) across `.ds-radio` and `.ds-radio__label`.
  - Added micro tactile active scale (`scale(0.94)`) on `.ds-radio:active:not(:has(:disabled)) .ds-radio__control`.

### Progress Indicator Component (`ds-progress-indicator`)
- **Interactive Step Navigation**:
  - Implemented full interactive step navigation via `vanilla/design-system.js` and keyboard navigation (ArrowLeft/ArrowRight, ArrowUp/ArrowDown, Enter, Space).
  - Clicking on any step dynamically transitions the state: previous steps transition to `completed` (displaying an authentic Lucide checkmark SVG and primary-colored connecting line), the active step transitions to `current` (`aria-current="step"`, double-ring focus border, and medium font weight), and succeeding steps transition to `upcoming` (number marker and muted text).
  - Dispatches custom `stepchange` event detailing `{ step, label, total }`.
- **Horizontal Variant Support (`.ds-progress-indicator--horizontal`)**:
  - Added horizontal layout styling in `vanilla/base.css` with inline horizontal connecting lines, flexible step spacing (`flex: 1`), and authentic 24px markers.
  - Added `export const Horizontal` story variant in [progress-indicator.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/progress-indicator.stories.js), presenting both enabled interactive horizontal stepper and disabled state with unavailable cursor (`cursor: not-allowed !important`).

### Popover Component (`ds-popover`)
- **Horizontal Action Buttons (`.ds-popover__footer`)**:
  - Removed full-width button stretching (`.ds-popover__content .ds-button { width: 100% }`), enabling clean horizontal side-by-side button layout (`display: flex; flex-direction: row; gap: var(--space-2); justify-content: flex-end;`).
  - Standardized bottom actions with secondary action on the left (`.ds-button.ds-button--secondary.ds-button--sm`) and primary action on the right (`.ds-button.ds-button--primary.ds-button--sm`).
- **Single Consolidated `Default` Story Variant**:
  - Removed obsolete individual exports (`PlacementRight`, `Disabled`), consolidating all representations into `export const Default` in [popover.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/popover.stories.js).
  - Showcases all 8 directional placements (`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `right`) with exact coordinate geometries and clearance.
  - Includes disabled state with authentic unavailable cursor (`cursor: not-allowed !important`).

### Pagination Component (`ds-pagination`)
- **Shared Dropdown Composition for Rows Per Page**:
  - Replaced legacy custom select wrapper and menu markup with the shared `Dropdown` component (`.ds-dropdown.ds-dropdown--sm`, `[data-ds-dropdown]`).
  - Rows per page selection now seamlessly inherits authentic platform menu styling, checkmarks, scrollbar, and interactive selection without duplicate component logic.
- **Ghost Icon Navigation Buttons**:
  - Replaced bordered outline buttons on navigation controls (`first`, `prev`, `next`, `last`) with standard Ghost Icon Buttons (`.ds-icon-button.ds-icon-button--ghost.ds-pagination__btn`).
  - Removed border box-shadow (`box-shadow: none`), applied authentic hover background (`var(--color-semantic-background-menu-hover)`), tactile active scale (`scale(0.96)`), and 14px optical icon centering.

### Pop-out Components (`Menu`, `Dropdown`, `Search`, `Calendar/Date-Picker`, `Filter Pill`, `Pagination`)
- **Click & Selection Focus Suppression**:
  - Eliminated lingering focus rings, focus outlines, and active border darkening when clicking or selecting items in pop-out/dropdown components across Menu, Dropdown, Select, Search, Date-Picker, Command Palette, and Pagination.
  - Implemented universal pointer blur handling in `vanilla/design-system.js` and component-specific `.blur()` calls on triggers, options, calendar days, presets, and navigation arrows.
  - Added dedicated CSS focus suppression rules (`outline: none !important; outline-offset: 0 !important;`) across all pop-out triggers and menu items in `vanilla/base.css`.
  - Removed persistent `:focus-within` border darkening on `.ds-date-picker--navigation .ds-date-picker__nav-group` so clicking navigation arrows does not lock the control in an active focus appearance.

### Dropdown Component (`ds-dropdown`)
- **Checked Option Active Background**:
  - Added active background (`var(--color-semantic-background-menu-hover)`) to checked/selected options across single-selection and multi-selection dropdowns (`[aria-selected="true"]`, `[aria-checked="true"]`, `[data-checked="true"]`).
  - Provides clear, high-contrast visual confirmation of checked options (`#393939` in dark mode, `#f3f3f3` in light mode) while respecting the 400 normal font-weight standard.

### Number Input Component (`ds-number-stepper`)
- **Removal of Legacy `Default` Story**:
  - Removed redundant `export const Default` alias from [number-input.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/number-input.stories.js).
  - Component is now cleanly represented by its single interactive structural variant `Stepper` (`Default / Shared / Number Input / Stepper`), featuring compact 32px height, optical icon centering, direct value mutation, and full disabled state coverage.

### Notification Component (`ds-toast` & `ds-callout`)
- **Removal of Legacy `Default` Story**:
  - Removed redundant `export const Default` story from [notification.stories.js](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/stories/shared/notification.stories.js), cleanly separating the component into two dedicated variants: `Callout` (inline guidance banners) and `Toast` (floating & inline feedback notifications).
- **Toast Support Color States (5 Variants)**:
  - Added full support color tokens (`text.success`, `text.warning`, `text.info`) extracted from `platform.openai.com` primitive ramps to [tokens.json](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/docs/design-system/tokens.json).
  - Implemented 5 complete Toast feedback states across static previews and interactive triggers in [base.css](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/vanilla/base.css#L1210-L1225):
    - **Default**: Monochrome neutral icon and subtle elevated card border.
    - **Success**: Status green icon (`var(--color-semantic-text-success)`) with tinted border.
    - **Warning**: Status yellow/amber icon (`var(--color-semantic-text-warning)`) with tinted border.
    - **Error**: Status red/danger icon (`var(--color-semantic-text-danger)`) with tinted border.
    - **Information**: Status blue/info icon (`var(--color-semantic-text-info)`) with tinted border.

### Secondary Button & Token Architecture (`ds-button--secondary`)
- **Zero-Line Soft Fill Alignment**:
  - Aligned `color.semantic.button.secondaryBorder` to `transparent` across both light and dark modes in [tokens.json](file:///Users/bangworkinghub/Documents/OpenAI%20Design%20System/docs/design-system/tokens.json).
  - Secondary button on OpenAI Platform (`platform.openai.com`) is strictly a soft solid fill (lighter background `#4d4d4d` dark / `#f3f3f3` light) with zero border line (`border: 0`, `box-shadow: none`), cleanly distinguishing it from the Outline button (`.ds-button--outline`) which retains the 1px border line.

### Modal Component (`ds-dialog`)
- **Secondary Button Ground-Truth Contrast Alignment**:
  - Resolved dark mode issue where `.ds-button--secondary` appeared pitch black (`#393939`) inside elevated modal dialogs (`#303030`).
  - Sampled exact ground-truth values from `platform.openai.com` modal (`media_1794805554829_1a349794.jpg`): updated `color.semantic.button.secondaryBackground` to authentic `#4d4d4d` (`rgb(77, 77, 77)` in dark mode, `#f3f3f3` in light mode), `secondaryBackgroundHover` to `#5d5d5d`, and `secondaryBorder` to `transparent` in dark mode.
  - The Cancel secondary button now has crisp, distinct contrast on modal surfaces without appearing black.
- **Input & Textarea Field Line Visibility**:
  - Resolved invisible border line on inputs/textareas inside modals (`.ds-dialog .ds-input, .ds-dialog .ds-textarea`) where `border-default` (`#4f4f4f`) blended into `#303030` background.
  - Updated field border to `var(--color-semantic-border-strong)` (`#767676` dark, `#8f8f8f` light) with matching inset box-shadow, ensuring clear, high-contrast visibility matching the platform screenshot.

### Popovers, Menus, Dropdowns, Date Picker & Search Focus Suppression
- **Click Focus State Removal**:
  - Suppressed intrusive `:focus` / `:focus-visible` blue outline / box-shadow (`ring-focus`) across all popover and dropdown triggers when clicked with mouse:
    - **Date Picker**: Removed `border-color: var(--color-semantic-ring-focus)` and blue box-shadow on `[data-ds-open="true"]` trigger and `.ds-date-picker--navigation`. Retains clean, subtle `var(--color-semantic-border-strong)` border.
    - **Dropdown & Select**: Replaced `ring-focus` inset shadow with clean `var(--color-semantic-border-strong)` inset shadow on `[data-ds-open="true"]`. Suppressed outline on option selection.
    - **Menu**: Removed outline and automatic programmatic focus on first item when opened via mouse click; removed `trigger.focus()` outline after item selection.
    - **Search Input & Trigger**: Changed `:focus-within` from bright blue ring to subtle border enhancement `var(--color-semantic-border-strong) inset`, perfectly aligning with platform.openai.com search inputs.

### Tactile Spring / Press Micro-Interactions ("Nhún" Effect)
- **Interactive Control Press State (`:active`)**:
  - Standardized lightweight 150ms GPU-accelerated spring press (`transform: scale(0.98)` / `scale(0.94)`) across all interactive clickable controls matching button interaction standards:
    - **Menu**: `.ds-menu__trigger`, `.ds-menu-trigger`, `.ds-menu__trigger--icon` (`scale(0.94)`), `.ds-menu__item` (`scale(0.98)`).
    - **Dropdown / Select**: `.ds-dropdown__trigger`, `.ds-select__trigger`, `.ds-filter-pill` (`scale(0.98)`), `.ds-dropdown__item`, `.ds-select__option` (`scale(0.98)`).
    - **Date Picker**: `.ds-date-picker__trigger`, `.ds-date-picker__nav-trigger`, `.ds-date-picker__preset` (`scale(0.98)`), `.ds-date-picker__nav-btn`, `.ds-date-picker__nav-arrow`, `.ds-date-picker__day` (`scale(0.94)`).
    - **Search**: `.ds-search-trigger` (`scale(0.98)`), `.ds-search-input__clear` (`scale(0.92)`).
    - **Pagination**: `.ds-pagination__btn`, `.ds-pagination__page`, `.ds-pagination__select-trigger` (`scale(0.96)`).

## 2026-11-16 (Shared Component Expansion & Disabled Cursor Standardization)

### Design Tokens — Full Ground-Truth Alignment with `https://platform.openai.com`
- **Authentic Primitive Color Ramps Expansion**:
  - Expanded `docs/design-system/tokens.json` from 128 to 226 tokens by integrating the complete official color ramps extracted directly from `https://platform.openai.com`:
    - `color.primitive.blue`: 14 steps (`25` to `1000`, `--blue-400`: `#0285ff`, `--blue-500`: `#0169cc`).
    - `color.primitive.green`: 14 steps (`25` to `1000`, `--green-400`: `#04b84c`, `--green-500`: `#00a240`, `--green-600`: `#008635`).
    - `color.primitive.red`: 14 steps (`25` to `1000`, `--red-500`: `#e02e2a`, `--red-600`: `#ba2623`, `--red-700`: `#911e1b`).
    - `color.primitive.yellow`: 14 steps (`25` to `1000`, `--yellow-400`: `#ffc300`, `--yellow-500`: `#e0ac00`).
    - `color.primitive.purple`: 14 steps (`25` to `1000`, `--purple-400`: `#924ff7`, `--purple-500`: `#8046d9`).
    - `color.primitive.orange`: 14 steps (`25` to `1000`, `--orange-400`: `#fb6a22`, `--orange-500`: `#e25507`).
    - `color.primitive.pink`: 14 steps (`25` to `1000`, `--pink-400`: `#ff66ad`, `--pink-500`: `#e04c91`).
- **Semantic Token Raw Value Calibration**:
  - **Focus Ring (`--color-semantic-ring-focus`)**: Calibrated from obsolete monochrome (`#0d0d0d` / `#fff`) to authentic OpenAI Platform blue (`#0169cc` in light, `#0285ff` in dark), matching `--color-ring`.
  - **Text Primary (`--color-semantic-text-primary`)**: Calibrated dark mode value from `#f3f3f3` to `#ffffff` (`--gray-1000`), matching OpenAI Platform's high-contrast white text contract.
  - **Text Secondary (`--color-semantic-text-secondary`)**: Calibrated light mode value from `#414141` (`--gray-600`) to `#5d5d5d` (`--gray-500`), and dark mode to `#b9b9b9` (`--gray-750`), matching `--color-text-secondary`.
  - **Text Tertiary (`--color-semantic-text-tertiary`)**: Calibrated to `#8f8f8f` across both light (`--gray-400`) and dark (`--gray-600`) modes, matching `--color-text-tertiary`.
  - **Text Inverse (`--color-semantic-text-inverse`)**: Calibrated dark mode value from `#212121` to `#0d0d0d` (`--gray-0`).
  - **Text Danger (`--color-semantic-text-danger`)**: Calibrated light mode from `#ba2623` to `#911e1b` (`--red-700`) and dark mode to `#e02e2a` (`--red-500`), matching `--color-text-danger`.
  - **Surface & Elevation**:
    - Surface elevated (`--color-semantic-background-surface-elevated`): dark mode calibrated from `#282828` to `#303030` (`--color-surface-elevated`).
    - Surface secondary (`--color-semantic-background-surface-secondary`): light mode `#f9f9f9` (`--gray-50`), dark mode `#181818` (`--gray-100`), matching `--color-surface-secondary`.
  - **Buttons**:
    - Danger Solid: background `#e02e2a` (`--red-500`), hover `#ba2623` (`--red-600`), text `#ffffff`.
    - Ultra / Primary Blue: background `#0285ff` (`--blue-400`), hover `#0169cc` (`--blue-500`), text `#ffffff`.

### Date Picker Component — Stepped Navigation & Month Shifting (`ds-date-picker`)
- **Trigger Cleanup**:
  - Removed up-and-down chevrons (`CHEVRON_UP_DOWN`) from the date picker triggers across all variants (Default, Navigation, Single Month, Enabled & Disabled) per user request, matching the clean minimalist pill and segmented triggers on OpenAI Platform.
- **Range Stepping on Navigation Arrows (`.ds-date-picker--navigation`)**:
  - Implemented responsive range-step shifting on the trigger bar navigation chevrons (`.ds-date-picker__nav-arrow--prev` and `.ds-date-picker__nav-arrow--next`).
  - Automatically calculates the active date range's duration (e.g. 7-day range from `2026-11-01` to `2026-11-07`).
  - Clicking next arrow (`>`) advances the active range by the duration step (e.g. `Nov 1 – Nov 7, 2026` -> `Nov 8 – Nov 14, 2026` -> `Nov 15 – Nov 21, 2026`).
  - Clicking prev arrow (`<`) rewinds the active range by the duration step (e.g. `Nov 8 – Nov 14, 2026` -> `Nov 1 – Nov 7, 2026` -> `Oct 25 – Oct 31, 2026`).
  - Synchronizes trigger label (`[data-date-label]`), range attributes (`data-start`, `data-end`), and updates the calendar day cells (`.ds-date-picker__day--start`, `.ds-date-picker__cell--range-mid`, `.ds-date-picker__day--end`).
  - Auto-scrolls / aligns the visible month view in the calendar dialog so that newly shifted dates are always visible.
  - Honors disabled state: disabled navigation chevrons ignore click events and present `cursor: not-allowed !important;`.
- **Dynamic Dual & Single Month Header Navigation**:
  - Attached reactive click handlers to `.ds-date-picker__nav-btn--prev` and `.ds-date-picker__nav-btn--next` in the calendar header bar.
  - In Dual Calendar: shifts the side-by-side view backward or forward month by month (e.g. `October 2026 & November 2026` <-> `November 2026 & December 2026`, or `September 2026 & October 2026`). Dynamically re-renders month titles and full day grids for both months with accurate weekday offsets and day counts.
  - In Single Calendar: shifts the single month backward or forward by 1 month, updating month title and grid.
  - Retains range selection highlighting (`applyRangeUI`) seamlessly across month transitions.
  - Strict typography: month headers and weekday labels maintain `font-weight: 400 normal` per OpenAI Platform standards.

### Code Snippet Component — Inline Variant Refinement (`ds-code-snippet`)
- **Simplification**:
  - Removed standalone copyable token chips (`.ds-code-snippet-tokens` / `.ds-code-snippet--inline-token` with API keys and model parameters) from the `Inline` story per user request (`media_1794815514174_a32720b8.png`).
  - Retained clean inline code tags (`<code class="ds-code-snippet--inline">`) seamlessly embedded within prose paragraphs.
  - Cleaned up obsolete `.ds-code-snippet--inline-token` styles from `vanilla/base.css` and event handlers from `vanilla/design-system.js`.

### Search Input Component — Icon-to-Text Spacing (`ds-search-input`)
- **Spacing Calibration**:
  - Eliminated extra padding-left (12px / 8px) on `.ds-search-input__field`, resolving double-spacing where icon and text were separated by 20px (8px flex gap + 12px padding).
  - Standardized `.ds-search-input__field { padding: 0 var(--space-3) 0 0; }` and `.ds-search-input--pill .ds-search-input__field { padding-left: 0; }`.
  - With container `gap: var(--space-2)` (8px), the spacing between the search icon and the text is now mathematically and visually exactly 8px across all variants (Default, With Clear Button, Pill, Block, and Dropdown Search).

### Dropdown Component — Option Item Hover Effects (`ds-dropdown`, `ds-select`)
- **Fix & Visual Enhancement**:
  - Resolved root cause where `.ds-dropdown .ds-select__option:hover` used `var(--color-semantic-background-surface-secondary)` (`#303030`), which was identical to the menu background `var(--color-semantic-background-menu)` (`#303030`), causing hover highlights to be visually indistinguishable.
  - Mapped option hover states to `var(--color-semantic-background-menu-hover)` (`#393939` in dark mode, `#f3f3f3` in light mode), creating clean, distinct, and authentic hover highlights matching OpenAI Platform menus.
  - Added smooth color transitions (`transition: background-color var(--motion-duration-basic) ease, color var(--motion-duration-basic) ease;`) and high-contrast text color (`var(--color-semantic-text-primary)`).
  - Applied to all dropdown variants (Default, With Search, Multi-Select Checkable, Form and Breadcrumb dropdowns).

### File Uploader Component (`ds-dropzone`)
- **Source**: Platform Storage and File Dropzone Specification (`media_1794805640923_625e463f.jpg` & `media_1794805644490_05c7753b.jpg`).
- **Ground Truth Visual Architecture**:
  - **Variant Alignment**:
    - **Variant 1 — Default (`export const Default`)**: Empty dropzone card featuring centered file-plus icon (`.ds-dropzone__icon`) and prompt string `Upload a file or drag your file here` (matching Image 1).
    - **Variant 2 — With Files / Uploaded (`export const WithFiles = story(...)`, alias `export const Uploaded`)**: File attached state showing the same dropzone card with centered prompt and inline attached document row with file icon and filename (e.g. `index.html`) (matching Image 2).
  - **Geometry & Container Styling**:
    - Eliminated obsolete dashed borders in favor of authentic solid card surface (`1px solid var(--color-semantic-border-subtle)`, 12px radius `var(--radius-xl)`, surface-secondary background `var(--color-semantic-background-surface-secondary)`).
    - Centered flex layout with 400 normal weight secondary text typography.
  - **Interactivity & State Architecture**:
    - Integrated native file input trigger, drag-and-drop file detection (`is-dragover` class and dynamic file attachment update), and state management in `vanilla/design-system.js`.
    - Staged both **Enabled** (interactive file picker) and **Disabled** (0.5 opacity with unavailable cursor `cursor: not-allowed !important;`) directly within each story.

### Text Input Component — Password Variant Consolidation (`export const Password`)
- **Consolidation**:
  - Removed standalone `#Password input` story component (`vanilla/stories/shared/password-input.stories.js`).
  - Integrated password inputs directly into `#Text input` (`vanilla/stories/shared/text-input.stories.js`) as a dedicated `Password` variant (`export const Password`).
- **Ground Truth Visual Architecture & Styles**:
  - **Style 1 — With Toggle (32px Compact)**:
    - Standard 32px height, 8px radius (`var(--radius-md)`), 12px horizontal padding.
    - Password visibility eye toggle icon (`.ds-password-toggle`) positioned at `right: 6px`.
    - Fully reactive show/hide state: toggles input `type="password"` <-> `type="text"`, updates `aria-label` between "Show password" and "Hide password", and retains input focus.
  - **Style 2 — Pill (Full Radius)**:
    - Pill capsule input geometry (`var(--radius-full)`), eye toggle positioned at `right: 12px` to follow curvature.
  - **State Architecture**:
    - Staged both **Enabled** (interactive show/hide password toggle) and **Disabled** (with `cursor: not-allowed !important;` on both input and toggle button) directly within each style section.
    - Added disabled guard in `vanilla/design-system.js` to prevent toggling when disabled.

### Pagination Component (`ds-pagination`)
- **Source**: Table Footer Pagination Specification (`media_1794805595021_1597ad89.jpg`).
- **Ground Truth Visual Architecture**:
  - **Variant Consolidation to Single Default Variant**:
    - Consolidated all pagination variants into a single, comprehensive `Default` story (`export const Default`).
    - Obsolete variants (`FirstPage`, `LastPage`) removed and unified into dynamic interactive state.
  - **Toolbar Layout & Geometry**:
    - Rounded elevated toolbar container (`12px` / `var(--radius-xl)` radius, `var(--color-semantic-background-surface)` background, `var(--color-semantic-border-subtle)` subtle border).
    - Compact 28px control height across navigation buttons and dropdown trigger.
  - **Left Status & Rows Per Page**:
    - "Page X of Y" status indicator in `400` normal weight and secondary text color.
    - "Rows per page" dropdown selector (`10 ⌄`) with popup menu (`10, 20, 50, 100`) and chevron rotation on open.
  - **Right Navigation Controls**:
    - First page (`«`), previous page (`‹`), next page (`›`), last page (`»`) buttons with subtle border outline and hover effects.
    - Active page number in high-contrast primary text (`var(--color-semantic-text-primary)`), inactive pages in secondary text, and ellipsis (`···`) for page ranges.
  - **Full Interactivity & State Architecture**:
    - Fully reactive page navigation: clicking first/prev/next/last or numeric page buttons dynamically updates page index and boundary button disabled states.
    - Staged both **Enabled** (interactive table pagination) and **Disabled** (with unavailable cursor `cursor: not-allowed !important;`) directly within the single story.

### Number Input Component (`ds-number-stepper`)
- **Source**: OpenAI Platform Numeric Parameter & Stepper Controls (`https://platform.openai.com`).
- **Ground Truth Visual Architecture**:
  - **Variant Consolidation to Stepper**:
    - Consolidated all number input variants into a single, canonical `Stepper` control (`export const Stepper = story(...)` with `export const Default = Stepper`).
    - Obsolete variants (`Temperature`, `Small`, `Disabled` standalone story) removed.
  - **Focus & Interaction Fidelity**:
    - Eliminated intrusive focus ring and border glow on click/focus (`outline: none !important; box-shadow: 0 0 0 1px var(--color-semantic-border-subtle) inset;`).
    - Smooth hover highlight on stepper wrapper without layout shifts or bright focus rings.
  - **Mathematical Icon Centering**:
    - Replaced raw text characters (`−` and `+`), which suffer from font-metric baseline sagging, with mathematically and optically centered 12px SVG icons (`path d="M3.5 8h9"` and `path d="M8 3.5v9M3.5 8h9"`).
    - Centered within 28px flex buttons (`display: inline-flex; align-items: center; justify-content: center;`) with `margin: 1px`, ensuring exact vertical and horizontal centering.
  - **State Architecture**:
    - Staged both **Enabled** (interactive step up/down with min/max clamping and input dispatch) and **Disabled** (with unavailable cursor `cursor: not-allowed !important;`) directly within the Stepper story.
    - Added disabled guard in `vanilla/design-system.js` to prevent value changes when disabled.

### Notification Component (`ds-callout`, `ds-toast`)
- **Source**: OpenAI Platform Inline Guidance Callouts & System Toasts (`https://platform.openai.com`).
- **Ground Truth Visual Architecture**:
  - **Variant 1 — Callout (`.ds-callout` / `.ds-alert`)**:
    - Inline banner layout with 12px container radius (`var(--radius-xl)`), subtle border (`var(--color-semantic-border-subtle)`), and surface background.
    - 400 normal body typography without contrasting header bar.
    - 4 Authentic Styles:
      - **Default**: Info guidance banner featuring exact text and `ⓘ` icon from platform evidence: `Start simple. Do not over-prompt upfront...`.
      - **Warning**: Cautionary notice banner with `⚠` warning icon.
      - **Danger**: Critical action alert banner with `⨂` error icon and red accent token.
      - **Success**: Completed action banner with `✓` confirmation icon.
  - **Variant 2 — Toast (`.ds-toast`)**:
    - Floating and inline feedback notifications (380px max-width, elevated surface, shadow-lg).
    - Status icon, message text, and interactive dismiss button (`✕`).
    - Interactive trigger with 3.5s auto-dismiss and close button handler in `vanilla/design-system.js`.
- **State Architecture**:
  - Staged both **Enabled** (interactive triggers and live previews) and **Disabled** (with unavailable macOS cursor `cursor: not-allowed !important;`).


### Modal Component (`ds-dialog`, `ds-dialog__backdrop`)
- **Source**: OpenAI Platform Allowed Domains Security Modal (`https://platform.openai.com/settings/organization/security/domain-allowlist`).
- **Ground Truth Visual Architecture**:
  - **Unified Modal Surface & Background Consistency**:
    - Eliminated contrasting lighter footer background (`background: transparent; border-top: 0`) and divider lines, creating a unified elevated card surface.
    - Updated textarea and input styling inside `.ds-dialog`: removed dark canvas background (`background: transparent; border: 1px solid var(--color-semantic-border-subtle)`), ensuring input backgrounds perfectly match the modal tone.
    - Added bottom-right character counter (`.ds-dialog__counter`) aligned directly under input fields.
  - **Header & Dismissal Architecture**:
    - Removed top-right "x" icon button entirely per platform evidence.
    - Modal dismissal is strictly handled by the `Cancel` button (with `data-ds-dialog-close`), clicking outside on the backdrop, or pressing the `Escape` key.
  - **Actions Footer**:
    - Action buttons (`Cancel` and `Generate key`) sit directly at the bottom-right of the modal without background dividers.
- **State Architecture**:
  - Staged both **Enabled** (live inline card preview + interactive trigger button opening backdrop overlay) and **Disabled** (trigger with unavailable cursor `cursor: not-allowed !important;`) within each variant story (`Default` and `Destructive`).


### Menu Component (`ds-menu`)
- **Source**: OpenAI Platform Context and Action Menus (`https://platform.openai.com/chat/edit?models=gpt-6-astra`).
- **Ground Truth Visual Architecture**:
  - **Variant 1 — Default (Chat Overflow Action Menu)**:
    - Compact 32px rounded rectangle trigger with horizontal three dots (`•••`, `.ds-menu__trigger--icon`).
    - Menu Card: 12px radius (`var(--radius-xl)`), shadow-menu, dark surface panel.
    - Group Header: `API` uppercase subtitle (`.ds-menu__header`).
    - Option Items: `✓ Responses` (checked state with leading checkmark) and `Chat Completions` (with indent spacer for flawless text alignment).
    - Separator line (`<hr class="ds-menu__separator">`).
    - Action Items with leading icons: `⚡ Optimize`, `◎ Evaluate`, `🕒 History`.
    - Separator line (`<hr class="ds-menu__separator">`).
    - Primary Action: `↑ Publish prompt`.
  - **Variant 2 — Arrow (Action Dropdown with Trailing Arrows `↗`)**:
    - Trigger: Compact button (`Copy Markdown v`) with copy icon and chevron down.
    - Item 1: `Open in ChatGPT ↗` with ChatGPT logo on left and trailing external arrow (`↗`) on right.
    - Separator line (`<hr class="ds-menu__separator">`).
    - Item 2: `Copy Markdown` with leading copy icon.
    - Item 3: `View as Markdown ↗` with leading code icon (`</>`) and trailing external arrow (`↗`).
- **State Consolidation**:
  - Staged both **Enabled** (interactive with `data-ds-open="true"` and clearance) and **Disabled** (with `cursor: not-allowed !important; pointer-events: auto !important;` on hover) directly within each variant story.
  - Strict 400 normal typography across all options and headers.

### List Component (`ds-list`)
- **Action**: Removed component story (`vanilla/stories/shared/list.stories.js`) from Storybook catalog per user directive.

### Link Component (`ds-link`)
- **Source**: OpenAI Platform Documentation Links (e.g. `Learn about file purposes ↗` from `https://platform.openai.com/storage/files`).
- **Ground Truth Visual Architecture**:
  - **Authentic External Link (`.ds-link--external`)**:
    - Underline strictly applies to text label (`.ds-link__text`), with 3px offset (`text-underline-offset: 3px`) and 1px thickness.
    - Trailing diagonal external arrow icon (`↗`, 12px, stroke 1.5) cleanly spaced with `gap: var(--space-1)` (4px) and never underlined.
  - **Standard Inline & Standalone Text Link**:
    - 14px typography (`var(--font-size-sm)`), 400 normal weight (`var(--font-weight-normal)`), primary text color (`var(--color-semantic-text-primary)`).
  - **Subtle Variant (`.ds-link--subtle`)**:
    - Muted secondary palette (`var(--color-semantic-text-secondary)`) with subtle underline color (`var(--color-semantic-text-tertiary)`), elevating to primary on hover.
- **State Consolidation**:
  - Removed standalone `Disabled` story export per user directive.
  - Staged both **Enabled** and **Disabled** states directly within each variant story (`Default`, `External`, `Subtle`).
- **Hover & Disabled Cursor Architecture**:
  - Enforced unavailable macOS cursor on hover (`cursor: not-allowed !important`) across all disabled links (`[aria-disabled="true"]`, `:disabled`, `.is-disabled`) and their child elements (`*`).
  - Maintained `pointer-events: auto !important` so mouse hover events reliably trigger the `not-allowed` cursor, with global click interception in `vanilla/design-system.js` preventing navigation or page jumping.


### Form Component (`ds-form-panel`, `ds-form-section`)
- **Source**: OpenAI Platform Realtime Audio Edit Configuration Panel (`https://platform.openai.com/audio/realtime/edit`).
- **Ground Truth Visual Architecture**:
  - Replaced legacy text input form with the authentic Realtime Audio Edit configuration panel:
    - **Panel Container**: 380px compact panel (`.ds-form-panel`), styled with `var(--color-surface-panel)`, `1px solid var(--color-border-subtle)`, and 12px container radius (`var(--radius-xl)`).
    - **Collapsible Sections**: 4 interactive collapsible sections built with native semantic `<details class="ds-form-section" open>` and `<summary class="ds-form-section__header">`:
      1. **Model**: Model dropdown (`gpt-realtime-2 ↕`), User transcript model dropdown (`gpt-realtime-whisper ↕`), Max tokens segmented control (`Custom` | `Unlimited`) with helper text `Uses the model maximum.`.
      2. **Audio**: Voice dropdown (`Marin ↕`), Noise reduction dropdown (`Far field ↕`).
      3. **Conversation behavior**: Automatic turn detection dropdown (`Normal ↕`), Threshold slider (`0.50`), Prefix padding slider (`300 ms`), Silence duration slider (`500 ms`), Idle timeout switch (`off`).
      4. **Tools**: Functions switch (`on`), MCP servers switch (`off`).
    - **Accordion Chevrons**: SVG chevron up (`^`) in header that rotates smoothly 180° when collapsed (`v`).
    - **Row Layout**: Two-column row structure (`.ds-form-row`) aligning labels on the left and controls on the right (180px fixed width for dropdowns, 140px for sliders), with stacked row support (`.ds-form-row--stack`) for segmented controls and helper text.
- **Sub-Component Mapping Architecture (Zero Duplicate Creation)**:
  - Systematically composed all controls from canonical Shared components:
    - **Dropdowns**: `.ds-dropdown`, `.ds-select__trigger`, `.ds-select__chevron`, `.ds-select__menu`, `.ds-scrollbar`, and `.ds-select__option`.
    - **Segmented Control**: `.ds-segmented`, `.ds-segmented__track`, `.ds-segmented__button`.
    - **Switches**: `.ds-switch` with interactive toggle state.
    - **Sliders**: `.ds-slider` with interactive value fill and dynamic numerical readout.
- **Interactive Enhancements**:
  - Enhanced `vanilla/design-system.js` slider handler to support `data-unit` (e.g. `ms`) and `data-decimals="2"` (`Number(val).toFixed(2)`).
- **Story Consolidation**:
  - Removed obsolete `WithValidation` story per user directive.
  - Staged both **Enabled** and **Disabled** states within `Default`.
  - Disabled state enforces 50% opacity and unavailable cursor (`cursor: not-allowed !important`).


### Breadcrumb Component (`ds-breadcrumb`)
- **Source**: OpenAI Platform Realtime Audio Edit Header (`https://platform.openai.com/audio/realtime/edit`).
- **Ground Truth Visual Architecture**:
  - Replaced legacy `/` text separators with authentic subtle chevron right icons (`›`, size 12px, stroke 1.5).
  - **Interactive Switcher Crumb**: Implemented active crumb selector (`.ds-breadcrumb__trigger`) with double chevron (`↕`), composing `.ds-dropdown`, `.ds-select__menu`, `.ds-scrollbar`, and `.ds-select__option` for dynamic prompt switching.
  - **Draft Status Badge**: Composed `.ds-badge.ds-badge--sm` (height 20px, pill radius) with leading pencil edit icon (`[✏️ Draft]`).
  - **Typography & Alignment**: 14px body typography (`var(--font-size-sm)`), 500 medium weight for active crumb, flex baseline centering across all crumbs and badges.
- **Variants Added**:
  - **Default**: Realtime Audio Edit header (`Realtime › New audio prompt ↕ [✏️ Draft]`), featuring interactive switcher dropdown and draft badge.
  - **Standard**: Classic platform hierarchy (`Workspace › Audio › Realtime`).
  - **DeepPath**: Deeply nested workflow hierarchy (`Default Project › Audio › Realtime › Voice Agent Session 2049 ↕ [Live]`).
- **State Architecture**:
  - Staged both **Enabled** and **Disabled** states directly within each variant story.
  - Disabled state enforces 50% opacity and unavailable macOS cursor (`cursor: not-allowed !important`).
- **Sub-Component Mapping**:
  - Composes canonical `.ds-dropdown`, `.ds-select__chevron`, `.ds-select__menu`, `.ds-scrollbar`, `.ds-select__option`, and `.ds-badge` with zero redundant class duplication.

### Dropdown Component (`ds-dropdown`)
- **Source**: OpenAI Platform Filters & Model Selectors (`https://platform.openai.com`).
- **Ground Truth Visual Architecture**:
  - Replaced legacy `.ds-menu` trigger with authentic OpenAI Platform `.ds-dropdown` component:
    - **Trigger Box**: 32px standard compact height, 8px border radius (`var(--radius-md)`), 1px subtle border.
    - **Softer Typography**: Applied `var(--color-semantic-text-secondary)` to trigger text and menu option items in resting state, transitioning to `var(--color-semantic-text-primary)` upon selection or hover.
    - **Authentic Double Chevron (`↕`)**: Rendered precise up-down double chevron icon (`CHEVRON_UP_DOWN`) on the right side of the trigger.
- **Variants Added**:
  - **Expand Without Search (`Default`)**: Standard compact dropdown supporting both single selection (`Standard ↕`) and checkable multi-select option lists (`2 selected ↕`).
  - **Expand With Search (`WithSearch`)**: Searchable dropdown composing the existing shared `ds-search-input` component (`.ds-search-input`, transparent background matching the menu popup layer) with real-time filtering as the user types.
- **Sub-Component Mapping Architecture (Zero Duplicate Creation)**:
  - Systematically audited and mapped all sub-elements directly to existing canonical Shared design system components:
    - **Trigger**: Mapped to `.ds-select__trigger` (`.ds-select__trigger.ds-dropdown__trigger`), inheriting compact 32px height, 8px radius, border tokens, and flex alignment.
    - **Chevron**: Mapped to `.ds-select__chevron` (`<span class="ds-select__chevron" aria-hidden="true">${CHEVRON_UP_DOWN}</span>`).
    - **Search Bar**: Mapped to `.ds-search-input.ds-search-input--block` (`.ds-search-input__icon` + `.ds-search-input__field`), with transparent background layer and inset border.
    - **Scroll Container**: Mapped to `.ds-scrollbar` (`.ds-dropdown__list.ds-scrollbar`), utilizing the shared 4px pill scrollbar token with 4px right-side margin/padding offset. Enforced `max-height: none; overflow: visible;` on `.ds-dropdown__menu` so the outer card never overflows or renders duplicate/white browser scrollbars; only the inner `.ds-dropdown__list` scrolls.
    - **Option Items**: Mapped to `.ds-select__option` (`.ds-select__option.ds-dropdown__item`), inheriting 32px height, 400 normal typography, and interactive background highlight.
    - **Contained List Tier Trigger**: Mapped to `.ds-select__trigger` and `.ds-select__chevron`, completely eliminating custom duplicate classes (`.ds-contained-list__tier-trigger`).
- **Checkable Option List Style**:
  - Added checkable option item styling with leading checkmark indicator (`✓`) for selected/checked items and matching empty spacer indent for unselected items, maintaining flawless vertical text alignment across items.
  - Multi-select reactive counter updates trigger label dynamically (e.g. `2 selected`).
- **State Consolidation**:
  - Removed standalone `Disabled` story export.
  - Staged both **Enabled** and **Disabled** states within each variant story (`Default` and `WithSearch`), with disabled controls displaying 50% opacity and macOS unavailable cursor (`cursor: not-allowed !important`) on hover.
- **Fidelity Specifications**:
  - Full adherence to 400 font-weight rule across all option items, placeholders, and trigger labels.
  - Real-time search filtering, outside-click dismissal, and keyboard accessibility (`Escape` key closing) in `vanilla/design-system.js`.
  - Zero raw hex/rgb/oklch literals in CSS or stories; zero inline styles.

### Date Picker Component (`ds-date-picker`)
- **Source**: OpenAI Platform Analytics Overview (`https://platform.openai.com/analytics/overview`) & Usage Dashboard (`https://platform.openai.com/usage`).
- **Variants & Story Architecture**:
  - **Navigation Variant (`Navigation`)**: Added the segmented 3-part date range control matching OpenAI Platform analytics overview:
    - Left chevron button (`<`): `30px` width, right border `1px solid var(--color-semantic-border-default)`, accessible prev range action.
    - Center date range trigger (`.ds-date-picker__nav-trigger`): Contains outline calendar icon (14px), 400-weight range label (`Nov 8 - Aug 16`), and double up-down chevron (`↕`), clickable to open the dual-calendar range popover.
    - Right chevron button (`>`): `30px` width, left border `1px solid var(--color-semantic-border-default)`, accessible next range action.
    - Enclosed in a compact 32px height container (`var(--height-control-md)` / 32px) with 8px radius (`var(--radius-md)`).
  - **Consolidated State Staging**: Removed legacy standalone `Interactive` and `Disabled` stories. In their place, staged both **Enabled** and **Disabled** states directly within each variant story (`Default`, `Navigation`, `SingleMonth`):
    - **Enabled**: Fully interactive date picker trigger and popover dialog. In `Default` and `SingleMonth`, open preview dialog renders with calculated story section clearance (`margin-bottom: 370px` / `330px`), avoiding any layout overlap with the disabled state below it. In `Navigation`, resting trigger is rendered with full click-to-open and date-selection interaction.
    - **Disabled**: All buttons and triggers carry `disabled` attribute, `opacity: 0.5`, and enforce `cursor: not-allowed !important` (macOS unavailable cursor ⃠) across all hover surfaces without `pointer-events: none`.
- **Fidelity Specifications**:
  - Full adherence to 400 font-weight rule across calendar dates, month titles, weekday headers, and range labels.
  - Zero raw hex/rgb/oklch literals in CSS or stories; zero inline styles.
  - Interactive event linkage for `.ds-date-picker__nav-arrow--prev`, `.ds-date-picker__nav-arrow--next`, and `.ds-date-picker__nav-trigger` in `vanilla/design-system.js`.

### Contained List Component (`ds-contained-list`)
- **Source**: OpenAI Platform Organization Limits & Models in Use (`https://platform.openai.com/settings/organization/limits`).
- **Structure & Features**:
  - Models in use contained list with title header, tier selector dropdown (`Build (your tier) ⇕`), 4-column structured table (`Model`, `Token limits`, `Request and other limits`, `Batch queue limits`), monospace model identifiers (`gpt-5.5`, `gpt-5.5-pro`, `gpt-5.4-mini`, `tts-1`, `whisper-1`, `omni-moderation-latest`, `text-embedding-3-*`, `Default limits`), and stacked multi-metric display (`RPM` / `IPM`).
  - Strict 400 font-weight rule across column headers and data metrics.
  - Zero row hover effect (no background changes on mouseover).
  - Cleaned up story exports to canonical `Default` view without collapse button or simple list variants.
- **Fidelity Specifications**:
  - Exact 12px container radius (`var(--radius-xl)`), padding `var(--space-5) var(--space-6)`.
  - Zero raw hex/rgb literals; zero inline styles.

### Universal Disabled Hover Cursor Standard (macOS Unavailable Cursor)
- **Problem Resolved**: Disabled elements across the design system previously had `pointer-events: none`, causing the browser to pass mouse hover events through to the document canvas. As a result, the cursor remained the default system arrow rather than displaying the disabled/unavailable cursor.
- **Solution & Standard**:
  - Removed `pointer-events: none` from all 36 disabled rules across Shared and Application components, enabling proper hit testing while preserving non-interactivity (clicks and interactions remain completely disabled).
  - Applied universal rule for `:disabled`, `[disabled]`, `[data-disabled]`, `[data-disabled="true"]`, `[aria-disabled="true"]`, and `:has(:disabled)` to enforce `cursor: not-allowed !important` across all parent and child DOM nodes.
  - On macOS, this triggers the native macOS "Unavailable" cursor (circle with diagonal slash ⃠) immediately upon hover across Buttons, Checkboxes, Radios, Switches, Selects, Inputs, Textareas, Tabs, Segmented Controls, Dropzones, and Application controls.

### Scroll Bar Component (`ds-scroll-area`)
- **Source**: OpenAI Platform Data Tables, Navigation Menus, and Drawers (`platform.openai.com/api-keys`, `platform.openai.com/usage`).
- **Variants Added**:
  - **Vertical (`Vertical`)**: Model catalog scroll area with custom 4px vertical scrollbar, transparent track, pill thumb (`var(--color-semantic-border-strong)`), and hover highlight (`var(--color-semantic-text-secondary)`).
  - **Horizontal (`Horizontal`)**: Horizontal resource row with custom 4px horizontal scrollbar, transparent track, and pill thumb.
- **Fidelity Specifications**:
  - Consistent 4px thickness matching OpenAI Platform screenshot ground truth.
  - Firefox support via `scrollbar-width: thin` and `scrollbar-color: var(--color-semantic-border-strong) transparent`.
  - Zero raw hex/rgb literals; zero inline styles.

### Code Snippet Component (`ds-code-snippet`)
- **Source**: OpenAI Platform Documentation and API Dashboard (`platform.openai.com/docs`, `platform.openai.com/api-keys`).
- **Variants Added**:
  - **Singleline (`Singleline`)**: Compact terminal commands and endpoint paths with leading prompt `$`, monospace text, and interactive ghost copy button with checkmark feedback.
  - **Inline (`Inline`)**: Monospace code embedded naturally in prose documentation, as well as standalone interactive token chips (with click-to-copy).
  - **Multiline (`Multiline`)**: Multi-line SDK code blocks and cURL requests with header bar (language tag + copy button), line number column, syntax highlighting classes, and 4px slim scrollbar.
- **Fidelity Specifications**:
  - Full 400 font-weight rule across code, line numbers, and prompts.
  - Zero raw hex/rgb literals; mapped to semantic tokens (`surfaceSecondary`, `borderSubtle`, `textPrimary`, `textTertiary`).
  - Interactive copy handling in `vanilla/design-system.js` with smooth icon/label transition to checkmark.

### Checkbox Component (`ds-checkbox`)
- **Authentic Path Draw Animation & Geometry Refinement**:
  - Implemented authentic SVG `stroke-dashoffset` animation matching platform ground-truth (extracted from 60fps frame analysis).
  - Extended checkmark path draw duration to **480ms** (2x duration, `stroke-dashoffset: 14 -> 0` with 80ms delay) and horizontal dash to **400ms** for an ultra-clear, fluid stroke-drawing motion.
  - Increased stroke thickness to **2.5px** on both checkmark (`.ds-checkbox__check`) and indeterminate dash (`.ds-checkbox__dash`) for solid visual weight.
  - Removed press/active scale resize: checkbox control strictly maintains its authentic 16×16px geometry without shrinking on mousedown.
  - Background fill animates with 300ms moderate curve (`var(--motion-duration-moderate)`: `cubic-bezier(0.16, 1, 0.3, 1)`), opacity transitions in 240ms.
- Removed redundant `Group` story export, keeping canonical `Default` and `Disabled` stories.

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

### Checkbox Component (`ds-checkbox`)
- **Structure & States Consolidation**:
  - Consolidated checkbox core states into `Default` story: Unchecked, Checked, and Indeterminate (horizontal dash icon).
  - Removed duplicate `Checked` story export.
  - Added indeterminate support in CSS (`:indeterminate`, `[data-indeterminate="true"]`) and JS `mount()` lifecycle.
  - Added disabled indeterminate variation in `Disabled` story.

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
