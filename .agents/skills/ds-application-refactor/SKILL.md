---
name: ds-application-refactor
description: >-
  Standard Operating Procedure (SOP) for applying the OpenAI Platform Design System to all Application components (#001 - #151): consolidating multi-state stories into a single interactive variant, composing shared atomic components (button, badge, input, beacon), mapping strict semantic design tokens (typography, geometry, colors, authentic spacing), ensuring reactive linkage from Shared to Application, and executing rigorous foreground verification without background tasks.
---

# DS Application Refactor — 100% Design System Application Standard

This skill defines the mandatory protocol for refactoring all 151 application components in the OpenAI Platform Design System. The goal is to transform separate static variant stories into unified, state-interactive application components that strictly compose atomic Shared components and adhere 100% to design system token contracts.

---

## 1. Core Principles & Refactor Directives

### 1.1. Single-Story Interactive State Consolidation (Rule 1)
- **Eliminate Redundant State Stories**: If an application component currently has multiple stories that are simply different data states of the same variant (e.g. Empty, Populated, Long List, No Cancel, Readonly), collapse them into **ONE primary story** (`Default`).
- **Natural In-Component Interaction (No Elaborate Mock Panels)**:
  - Do NOT build fancy external state toolbars, debug panels, or artificial switchers.
  - Make the component naturally interactive through its own native controls (e.g. clicking the cancel `[x]` button removes items from the queue until it naturally displays the empty state; providing a clean, subtle reset button when empty).

### 1.2. Shared Component Composition (Rule 2)
- **Direct Shared Component Mapping**: All subcomponents inside Application views must directly compose the canonical Shared component classes:
  - Status Beacons: `.ds-beacon.ds-beacon--accent` (composing `.ds-beacon__ping` and `.ds-beacon__dot`).
  - Buttons: `.ds-button` (`.ds-button--primary`, `.ds-button--secondary`, `.ds-button--ghost`, `.ds-button--sm`, `.ds-button--pill`).
  - Small Pill Icon-Only Ghost Buttons: `.ds-button.ds-button--ghost.ds-button--sm.ds-button--pill.ds-button--icon` (size 24px, full radius, 14px SVG, resting opacity 0.65, hover opacity 1 with dynamic translucent background `color-mix(in srgb, currentColor 12%, transparent)`, active `scale(0.96)`). Used for dismiss `[x]`, action arrows, inline tools.
  - **Translucent Opacity Hover Standard (Rule for all Ghost Controls)**: Never use solid opaque background tokens for `.ds-button--ghost` or `.ds-icon-button` hover (which blend invisibly into surface-secondary cards/rows). Always use dynamic translucent opacity overlays (`color-mix(in srgb, currentColor 10-12%, transparent)`) so hover is clearly visible across ANY background surface (canvas, surface, surface-secondary, or elevated).
  - Icon buttons: `.ds-icon-button` (`.ds-icon-button--sm` 24px, 32px standard).
  - Badges & Tags: `.ds-badge` (`.ds-badge--sm`).
  - Inputs & Controls: `.ds-input`, `.ds-select`, `.ds-checkbox`, `.ds-toggle`.
- **Zero Raw Ad-hoc Buttons**: Never create ad-hoc `<button>` elements with isolated, custom styles when a shared button or icon button class exists.

### 1.3. Accurate Token & Spacing Mapping (Rule 3)
- **Authentic Proportion & Left-Flush Geometry ("Sát Lề Bên Này")**:
  - Keep the authentic container structure: `max-width: 384px`, left-aligned in stage.
  - All children (Running Card, Header, Queue Items) are 100% full-width within the 384px bounds, flush with the left and right margins.
  - Relax spacing moderately to avoid feeling overly tight while preserving authentic ground-truth balance:
    - Container: `max-width: 384px`, `gap: var(--space-2)` (8px).
    - Card: `padding: var(--space-3)` (12px), `border-radius: var(--radius-2xl)` (16px), `border: 1px solid var(--color-semantic-border-subtle)`.
    - Subtle List Items: `padding: 10px 10px 10px 14px`, `border-radius: var(--radius-2xl)` (16px), `background: var(--color-semantic-background-surface-secondary)`, inner gap `10px`.
    - Metadata Header: `padding: 0 var(--space-1)` (4px), `font-size: 11px`.
    - List item gap: `var(--space-2)` (8px).
    - Action buttons (`[x]`, arrow): `ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon` (24px).
- **Natural Typography (No Artificial Strict 400 Rule)**:
  - Apply authentic font sizes and weights matching platform specifications:
    - Running titles and card headers: `font-size: 13.5px`, `font-weight: var(--font-weight-medium)` (500).
    - Secondary item text: `font-size: 13.5px`, `font-weight: var(--font-weight-normal)` (400), `color: var(--color-semantic-text-secondary)`.
    - Monospace labels and counters: `font-family: var(--font-family-mono)`, `font-size: 11px`, `font-variant-numeric: tabular-nums`, `letter-spacing: var(--font-tracking-tight)`.
    - Action buttons: `font-weight: var(--font-weight-medium)` (500).

### 1.4. Reactive Shared-to-Application Linkage (Rule 4)
- **Single Source of Truth in CSS & Shared Stories**:
  - Because Application components use the shared base classes (`.ds-beacon`, `.ds-button`, `.ds-icon-button`, `.ds-badge`, etc.), any modification in `vanilla/base.css` or shared stories automatically and immediately reflects across all Application components.

---

## 2. Reference Implementation Standard: Message Queue (#011)

```html
<div data-slot="message-queue" class="ds-message-queue">
  <!-- 1. Running Card with Shared Beacon -->
  <div class="ds-message-queue__running-card">
    <span class="ds-beacon ds-beacon--accent" aria-hidden="true">
      <span class="ds-beacon__ping"></span>
      <span class="ds-beacon__dot"></span>
    </span>
    <span class="ds-message-queue__running-title">${running}</span>
    <span class="ds-message-queue__status-label">running</span>
  </div>

  <!-- 2. Subtle Metadata Header -->
  <div class="ds-message-queue__header">
    <span class="ds-message-queue__meta">${queued.length} queued</span>
    <span class="ds-message-queue__meta">sends when this finishes</span>
  </div>

  <!-- 3. List with Shared Small Pill Icon-Only Ghost Buttons -->
  <ul class="ds-message-queue__list">
    <li class="ds-message-queue__item" data-id="${msg.id}">
      <span class="ds-message-queue__item-index">${index + 1}</span>
      <span class="ds-message-queue__item-text">${msg.text}</span>
      <button type="button" aria-label="Send now" class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon">
        <svg class="ds-message-queue__arrow" ...></svg>
      </button>
      <button type="button" aria-label="Remove..." class="ds-button ds-button--ghost ds-button--sm ds-button--pill ds-button--icon" data-cancel-id="${msg.id}">
        <svg ...></svg>
      </button>
    </li>
  </ul>

  <!-- 4. Natural In-place Reset Action (when empty) -->
  <div class="ds-flex ds-justify-center ds-pt-2">
    <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-queue-reset-btn">Reset queue</button>
  </div>
</div>
```
  <div class="ds-flex ds-justify-center ds-pt-2">
    <button type="button" class="ds-button ds-button--ghost ds-button--sm ds-queue-reset-btn">Reset queue</button>
  </div>
</div>
```

---

## 3. Step-by-Step Refactoring Workflow per Component

For each component from #001 to #151:

1. **Ground-Truth Check**:
   - Inspect the component source in `scratch/assistant-ui/elements/<component>.tsx` or `vanilla/stories/default/<component>.stories.js`.
   - Identify authentic dimensions, gaps, paddings, and subcomponents.

2. **Consolidate Variant Stories**:
   - Merge separate state stories into a single interactive `Default` story.
   - Keep the presentation clean, authentic, and free of artificial toolbars.
   - Wire native event listeners so user interaction (clicks, toggles) updates the view directly.

3. **Map Shared Components**:
   - Use `.ds-beacon`, `.ds-icon-button`, `.ds-button`, `.ds-badge`, `.ds-input`, etc.

4. **Verify Tokens & Spacing in `vanilla/base.css`**:
   - Ensure all colors map to `var(--color-semantic-*)`.
   - Ensure all spacings map to design tokens and exact ground-truth values.
   - Ensure `prefers-reduced-motion` and `[data-reduced-motion="true"]` rules are active.

5. **Foreground Local Validation**:
   - Run: `npm run build:vanilla && npm run tokens:check && npm run ds:check`.

6. **Playwright Foreground Verification**:
   - Run a synchronous Playwright script in foreground (`WaitMsBeforeAsync: 10000`).
   - Verify initial geometry, interactive state transition, and visual screenshot captures.
