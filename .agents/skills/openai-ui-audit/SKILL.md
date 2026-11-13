---
name: openai-ui-audit
description: >-
  OpenAI UI Audit: Comprehensive 100% fidelity audit checklist, procedures, and zero-guess ground-truth extraction protocol for OpenAI Platform (https://platform.openai.com) Design System components. Use whenever implementing, auditing, testing, or verifying OpenAI Platform components, matching exact typography (400 weights), tokens, geometry, states, motion, and visual comparisons.
---

# OpenAI UI Audit — 100% Fidelity Component Audit Standard

This skill defines the mandatory protocol for auditing, extracting, cloning, and verifying components from the live OpenAI Platform (`https://platform.openai.com`) into the prototype design system.

Every component must satisfy **all 101 criteria across 11 foundational categories** before it can be considered compliant.

---

## 0. Mandatory Screenshot & Live Platform Ground-Truth Protocol (Anti-Guessing Rule)

> [!IMPORTANT]
> **Zero-Guess Directive for User Screenshots**:
> Whenever a user attaches a screenshot or asks to implement/fix a component:
> 1. **Locate on Live Platform First**: Never attempt to approximate or recreate a component purely from visual appearance in a screenshot. You MUST determine where that component resides on `https://platform.openai.com` (e.g., Usage filter at `/usage`, API keys management at `/api-keys`, storage buckets at `/storage`, project/org settings at `/settings`).
> 2. **Extract Authentic Platform Design Contracts**:
>    - Determine the exact DOM structure, hierarchy, and ARIA roles used by OpenAI Platform.
>    - Map styling to verified design tokens from `docs/design-system/tokens.json`.
> 3. **Strict Typography Ground-Truth (Full 400 Weight Rule)**:
>    - OpenAI Platform uses an understated, clean aesthetic with **`font-weight: 400` (normal)** across almost all secondary and tertiary UI elements:
>      - Calendar month/year headers: `font-size: var(--font-size-sm)` (14px), **`font-weight: 400`** (`var(--font-weight-normal)`). Do NOT make them bold/semibold.
>      - Calendar weekday headers: `font-size: var(--font-size-xs)` (12px), **`font-weight: 400`** (`var(--font-weight-normal)`).
>      - Calendar date numbers (resting, hovered, in-range, and start/end endpoints): `font-size: var(--font-size-xs)` (12px/13px), **`font-weight: 400`** (`var(--font-weight-normal)`). Start and end date circles use solid background pills but retain **font-weight: 400**.
>      - Filter and preset menu items: `font-size: var(--font-size-sm)` (14px), **`font-weight: 400`** (`var(--font-weight-normal)`) for both inactive and active states.
> 4. **Color & Elevation Contracts**:
>    - Popover surface: `var(--color-semantic-background-menu)` / `var(--color-semantic-background-surface-elevated)` with `var(--color-semantic-border-subtle)` and `var(--shadow-menu)`.
>    - Date range selection strip: continuous connected track with tokenized selection background (dark: `#414141` / `var(--color-primitive-gray-400)`, light: `var(--color-primitive-gray-100)`).
>    - Selected endpoints: circular badge (`var(--color-primitive-gray-1000)` bg, `var(--color-primitive-gray-0)` text).
>    - Disabled future dates: `opacity: 0.35` with `var(--color-semantic-text-tertiary)` and `cursor: not-allowed`.
>    - Today indicator: discrete 3px dot centered underneath the date number.

---

## 1. The 11 Audit Categories & 101 Mandatory Criteria

### Category 1: Typography (10 Criteria)
1. **Font family**: Must map to `var(--font-family-sans)` (OpenAI Sans fallback stack) or `var(--font-family-mono)`.
2. **Font size**: Measured in px/rem, mapped to `--font-size-*` (e.g. `var(--font-size-sm)` = 14px, `var(--font-size-xs)` = 12px).
3. **Font weight**: Measured exact numeric weight (e.g. 400 normal, 500 medium, 600 semibold). Must be identical across state transitions unless explicitly varied by design contract. For secondary controls/tabs/dates, use `var(--font-weight-normal)` (400) as observed on platform.
4. **Line height**: Exact unitless or px value, mapped to `--font-line-height-*`.
5. **Letter spacing**: Normal or tracking token (`var(--font-tracking-normal)` = 0em, `var(--font-tracking-tight)` = -0.025em).
6. **Text color**: Tokenized text color for inactive, active, hover, and disabled states.
7. **Text alignment**: `text-align: left | center | right`.
8. **Text transform**: `text-transform: none | uppercase | lowercase | capitalize`.
9. **Text decoration**: `text-decoration: none | underline`.
10. **Text overflow**: `text-overflow: ellipsis | clip`, `white-space: nowrap`, `overflow: hidden`.

### Category 2: Color & Appearance (9 Criteria)
11. **Foreground / Text color**: Primary (`var(--color-primitive-gray-1000)` / `--color-semantic-text-primary`), Secondary (`--color-semantic-text-secondary`).
12. **Border color**: Default, subtle, focus ring, transparent, or none.
13. **Icon color**: Matches text or dedicated token.
14. **Fill / Stroke**: SVG stroke-width, stroke-linecap, stroke-linejoin.
15. **Opacity**: Explicit resting and disabled opacity (`0.5`), hover highlight opacity (`0.5`).
16. **Gradient**: Tokenized gradients where applicable.
17. **Shadow / Elevation**: Inset or drop shadow mapped to `--shadow-*` (e.g. `var(--shadow-thumb)` = `0 1px 4px -1px rgb(0 0 0 / 0.2)`).
18. **Blur / Backdrop filter**: Translucent backdrops where applicable.
19. **Overlay**: Recessed track or backdrop overlay.

### Category 3: Shape & Geometry (8 Criteria)
20. **Width / Height**: Compact standard 32px (`var(--space-8)`), small 28px (`var(--space-7)`), auto, or full width.
21. **Min-width / Max-width**: Bounding constraints.
22. **Min-height / Max-height**: Bounding vertical constraints.
23. **Border width & style**: 0, 1px solid, etc.
24. **Border radius**: Track radius (`var(--radius-md)` = 8px), thumb/item radius (`var(--radius-sm)` = 6px), pill (`var(--radius-full)` = 9999px).
25. **Corner shape**: Rounded vs Pill vs Square.
26. **Aspect ratio**: Where fixed proportions apply.
27. **Clipping / Overflow**: `overflow: hidden`, clipping masks, hidden scrollbars.

### Category 4: Spacing (6 Criteria)
28. **Padding**: Top, right, bottom, left (e.g. track padding 2px, item padding `0 12px` / `0 16px`).
29. **Margin**: Outer layout spacing.
30. **Gap**: Flex / grid gap between items (e.g. 2px).
31. **Row gap / Column gap**: Grid or flex wrap spacing.
32. **Inset spacing**: Inner control spacing / badge spacing.
33. **Content spacing**: Gap between leading icon and label text (`var(--space-1)` = 4px).

### Category 5: Layout & Structure (9 Criteria)
34. **Display**: `inline-flex`, `flex`, `grid`, `block`.
35. **Direction**: `row`, `column`.
36. **Alignment**: `align-items: center`.
37. **Justification**: `justify-content: center | space-between | flex-start`.
38. **Position**: `position: relative`, sliding thumb `position: absolute`.
39. **Z-index**: Thumb `z-index: 1`, options `z-index: 2`.
40. **Wrapping**: `flex-wrap: nowrap`.
41. **Distribution**: `flex: 1 1 0%` for block/full-width variants.
42. **Responsive behavior**: Adapts to container width or scrolls cleanly.

### Category 6: Content & Composition (9 Criteria)
43. **UI Elements**: Icons, Labels, Badges, Sliding Thumb.
44. **Element hierarchy**: Primary label vs sublabel vs badge count.
45. **Element order**: Leading icon -> Label text -> Count badge -> Trailing icon.
46. **Leading elements**: Optional icons or indicators.
47. **Trailing elements**: Badges or chevron.
48. **Optional elements**: Removable or toggled sub-elements.
49. **Content type**: Plain text, SVG icons, badges.
50. **Placeholder / Default content**: Meaningful realistic platform labels.
51. **Empty state**: Clean fallback when items are empty.

### Category 7: Interaction & Behavior (11 Criteria)
52. **Click / Tap**: Immediate activation, triggers sliding thumb translation.
53. **Hover**: Sub-layer `::before` activates with `opacity: 0.5`, text color becomes bright primary.
54. **Focus / Focus-visible**: Accessible focus ring (`outline: 2px solid var(--color-semantic-accent-control); outline-offset: 2px;`).
55. **Press / Active**: Feedback on mousedown (`transform: scale(0.97)` on `::before`).
56. **Drag & Drop**: If applicable.
57. **Keyboard interaction**: ArrowLeft, ArrowRight, ArrowUp, ArrowDown cycles focus and activates; Enter/Space activates.
58. **Scroll behavior**: Hidden scrollbars for overflowing containers.
59. **Expand / Collapse**: If applicable.
60. **Selection behavior**: Single-select radio/tabgroup behavior.
61. **Validation behavior**: Disabled options cannot be selected or focused via arrows.
62. **Trigger / Action**: Dispatches `ds-change` custom event with `value` and `index`.

### Category 8: States (11 Criteria)
63. **Default / Resting**: Inactive button has secondary text, no background thumb.
64. **Hover**: Hover highlight appears, text lightens.
65. **Focus**: Focus ring visible on keyboard navigation.
66. **Active / Pressed**: Mousedown squash feedback.
67. **Selected / On**: Elevated thumb card positioned underneath, primary text color.
68. **Disabled**: `opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none`, no hover highlight.
69. **Loading**: If applicable.
70. **Error**: If applicable.
71. **Success**: If applicable.
72. **Empty**: If applicable.
73. **Read-only**: If applicable.

### Category 9: Variants & Properties (9 Criteria)
74. **Size**: Medium 32px (Default compact), Small 28px (Daybreak SM).
75. **Type / Hierarchy**: Standard vs Ghost.
76. **Style**: Filled track vs Transparent ghost track.
77. **Hierarchy**: High emphasis vs secondary.
78. **Emphasis**: Primary card thumb vs subtle ghost thumb.
79. **Orientation**: Horizontal (standard) vs Vertical.
80. **Icon position**: Leading icon, Text only, Icon only.
81. **Shape variant**: Standard rounded (8px track / 6px thumb) vs Pill (`border-radius: var(--radius-full)`).
82. **Boolean properties**: `data-block` (full width), `data-pill` (pill shape), `data-size="sm"`, `data-variant="ghost"`.

### Category 10: Motion & Animation (10 Criteria)
83. **Behavior**: Clean, intentional, lightweight UI transitions with physical grounding and zero unnecessary bounce.
84. **Duration**: Strictly tokenized: `--motion-duration-basic` (150ms), `--motion-duration-moderate` (300ms), `--motion-duration-reveal` (800ms), `--motion-duration-content` (1200ms).
85. **Delay**: Interaction delays mapped to design tokens, avoiding sluggish response feel.
86. **Easing / Timing function**: Exact cubic-bezier curves: `--motion-easing-enter` (`cubic-bezier(0.19, 1, 0.22, 1)`), `--motion-easing-exit` (`cubic-bezier(0.8, 0, 0.4, 1)`), `--motion-easing-move` (`cubic-bezier(0.65, 0, 0.35, 1)`), and tab curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
87. **Transition**: Explicit transition properties (`color`, `background-color`, `border-color`, `transform`, `box-shadow`) without `transition: all`.
88. **Transform**: Scale feedback on active/pressed states (`scale(0.97)` or `scale(0.98)`), sliding indicator translation via `translateX(...)`.
89. **Animation sequence**: Keyframed loops (e.g. pulse, spin) or choreographed entrances with discrete stages.
90. **Entrance / Exit animation**: Dialog, popover, drawer, and tooltip fade/scale transitions with explicit transform origins (`top left`, `top right`, etc.).
91. **Micro-interaction**: Smooth sub-layer highlights (e.g. `::before` opacity from 0 to 0.5), subtle icon fills.
92. **Reduced motion behavior**: Strict conformance with `prefers-reduced-motion` and `[data-reduced-motion="true"]` clamping all durations to `0.01ms !important`.

### Category 11: Responsive & Adaptability (9 Criteria)
93. **Usability**: Touch-friendly tap targets, readable contrast, and thumb-accessible controls across device widths.
94. **Breakpoints**: Desktop (> 768px), Tablet, and Mobile (<= 767px) adaptation (sidebar collapsed to rail, headers restyled).
95. **Fluid sizing**: `width: 100%`, `max-width`, and `min-width: 0` constraints to avoid flex child blowout.
96. **Content reflow**: Natural wrapping without horizontal page breakage; multi-column forms folding into single column.
97. **Element visibility**: Strategic hiding (e.g. text labels collapsing to icon-only rails on mobile viewports).
98. **Layout transformation**: Inline flex rows converting to block stacks or scrollable strips on constraint boundaries.
99. **Mobile / Tablet / Desktop behavior**: Drawers instead of modals or full-screen overlays when viewport height or width is constrained.
100. **Overflow handling**: Clean `overflow-x: auto` for overflowing tab bars with invisible scrollbars; truncation with ellipsis for dynamic labels.
101. **Density adaptation**: Standard 32px compact height preserving ergonomics across dense desktop dashboards and touch devices.

---

## 2. Standardized Ground-Truth Extraction Suite (Zero-Guess Protocol)

> [!CAUTION]
> **Strict Anti-Guessing Directive**:
> Under NO circumstances should any style, metric, padding, margin, or font weight be estimated or inferred heuristically. If a direct DOM evaluation is blocked by a worker sandbox, use one of the 3 verified ground-truth extraction channels below.
> 
> **Incremental Refinement Directive**:
> Do NOT discard existing working code or rebuild components from scratch. Always perform targeted, in-place auditing and refinement to optimize fidelity, code cleanliness, and performance while preserving working features.

### Installed Ground-Truth Tooling Suite
The project workspace is equipped with the following authoritative extraction tools:
1. **`playwright` & `@playwright/test`**: Full browser automation and layout geometry engine.
2. **`chrome-devtools-mcp` & Chrome DevTools Plugin**: Direct WebSocket connection to Chrome DevTools Protocol (CDP) for native `CSS.getComputedStyleForNode`, `DOM.getBoxModel`, and `CSS.getMatchedStylesForNode`.
3. **`dembrandt`**: Dedicated CLI for extracting design tokens, typography scales, colors, and layout metrics directly from web pages.
4. **REA (Reverse Engineer Anything)**: Protocol for passive web bundle reverse-engineering, module inspection, and network payload analysis.

---

### The 3 Ground-Truth Extraction Channels

#### Channel 1: Authenticated Production Stylesheet Extraction (Direct Author CSS)
OpenAI Platform compiles component styles into static bundles under `/static/*.css`. Using `page.request.get(stylesheetUrl)` within the authenticated browser session retrieves the exact 100% production stylesheet:
- Declared classes (e.g. `.r2DuD`, `.nCgbF`, `.PXVXS`, `.k-Psc`)
- Declared custom properties (e.g. `--segmented-control-gutter: 2px`, `--segmented-control-transition-duration: .3s`)
- Exact padding, margin, height, transition easings (`cubic-bezier(0.16, 1, 0.3, 1)`), and zero-height spacers (`.RZnns`).

#### Channel 2: Physical Layout Geometry via Playwright `boundingBox()`
To determine exact pixel spacing (e.g., text baseline/bottom to underline indicator), query the browser engine's computed layout coordinates:
```javascript
const btn = page.getByRole('radio', { name: 'Files' });
const span = btn.locator('span').first();
const thumb = page.locator('div[data-tab-switcher-thumb], .PXVXS').first();

const btnBox = await btn.boundingBox();
const spanBox = await span.boundingBox();
const thumbBox = await thumb.boundingBox();

const exactMetrics = {
  btnHeight: btnBox.height,
  spanHeight: spanBox.height,
  spanTopFromBtnTop: spanBox.y - btnBox.y,
  spanBottomFromBtnBottom: (btnBox.y + btnBox.height) - (spanBox.y + spanBox.height),
  spanBottomToThumbTop: thumbBox ? (thumbBox.y - (spanBox.y + spanBox.height)) : null,
};
```

#### Channel 3: Chrome DevTools Protocol (CDP) via MCP
Use `get_css_styles` or `evaluate_script` through the `chrome-devtools-plugin` to inspect computed styles from Chrome's V8 engine:
- `CSS.getComputedStyleForNode`: Reads exact computed styles including font-weight numbers (400 vs 500 vs 600).
- `DOM.getBoxModel`: Returns exact quad arrays for content, padding, border, and margin.

---

## 3. Strict Verification & Sign-off Checklist

Before approving any component clone:
1. **Source of Truth Check**: If tokens on platform differ from `tokens.json`, update `docs/design-system/tokens.json` first, run `npm run tokens:build`.
2. **Zero Color Literals**: Run `npm run ds:check` (0 inline styles, 0 hex/rgb literals in `vanilla/`).
3. **No Dummy State Stories**: Component story file must organize stories by **Variants & Properties** (`Default`, `Small`, `Pill`, `Block`, `WithIcons`, `Ghost`). All states (resting, hover, focus, active, disabled) must be demonstrated **interactively via behavior**.
4. **Full Verification Pipeline**: `npm run ds:verify` must exit with code 0.
5. **Interactive Browser QA**: Subagent navigates to Storybook, clicks options, triggers keyboard navigation, inspects hover styles and computed font-weight, capturing before/after screenshots.

---

## 4. Visual Comparison QA Protocol (Side-by-Side Reference Audit)

When reference images/screenshots are provided or captured from the source of truth, the audit MUST execute visual QA verification:

1. **Pixel-Level Geometry & Color Inspection**:
   - Parse reference images with `pngjs` or layout bounding boxes to verify:
     - Exact outer border-radius (e.g. Pill/Capsule `var(--radius-full)` vs Rounded `var(--radius-md)`).
     - Padding from outer border curve to leading icon (for pill components, minimum 14px-15px so elements never clip into circular caps).
     - Gap between icon and placeholder text.
     - Clearance for trailing badges (e.g. `⌘K` shortcut badge) with proper trailing padding.
2. **Side-by-Side Visual Artifact Generation**:
   - Capture clean crops of the reference source component.
   - Capture matching viewport/theme crops of the rendered Storybook clone across states (Resting, Hover, Focus).
   - Generate composite comparison images or artifacts comparing reference vs clone.
3. **Behavioral Hover & Focus Consistency**:
   - Verify hover visual feedback (border color highlight, subtle background highlight, text brightness).
   - Verify focus ring alignment and outline offsets.
   - Verify that shortcut chips or clear buttons adapt dynamically without breaking flex boundaries.

---

## 5. Automated Verification Tooling

To run automated assertions on any story:
```bash
# Verify component geometry and computed typography
node .agents/skills/openai-ui-audit/scripts/verify-component.mjs <story-id> [theme=dark|light] [selector]

# Full design system check
npm run tokens:check && npm run ds:check && npm run build:vanilla
```
