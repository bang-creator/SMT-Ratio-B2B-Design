# OpenAI UI Audit — Standing Project Rules

This rule is ALWAYS ACTIVE for all component design, implementation, refinement, and verification in this workspace.

---

## 0. Mandatory Screenshot & Live Platform Ground-Truth Protocol (Anti-Guessing Rule)

1. **Locate on Live Platform First**: Never approximate or recreate a component purely from visual appearance in a screenshot. You MUST determine where that component resides on `https://platform.openai.com` (e.g., Usage filter at `/usage`, API keys management at `/api-keys`, storage buckets at `/storage`, project/org settings at `/settings`).
2. **Extract Authentic Platform Design Contracts**:
   - Determine the exact DOM structure, hierarchy, and ARIA roles used by OpenAI Platform.
   - Map styling to verified design tokens from `docs/design-system/tokens.json`.
3. **Strict Typography Ground-Truth (Full 400 Weight Rule)**:
   - OpenAI Platform uses an understated, clean aesthetic with **`font-weight: 400` (normal)** across almost all secondary and tertiary UI elements:
     - Calendar month/year headers: `font-size: var(--font-size-sm)` (14px), **`font-weight: 400`** (`var(--font-weight-normal)`). Do NOT make them bold/semibold.
     - Calendar weekday headers: `font-size: var(--font-size-xs)` (12px), **`font-weight: 400`** (`var(--font-weight-normal)`).
     - Calendar date numbers (resting, hovered, in-range, and start/end endpoints): `font-size: var(--font-size-xs)` (12px/13px), **`font-weight: 400`** (`var(--font-weight-normal)`). Start and end date circles use solid background pills but retain **font-weight: 400**.
     - Filter and preset menu items: `font-size: var(--font-size-sm)` (14px), **`font-weight: 400`** (`var(--font-weight-normal)`) for both inactive and active states.
     - Table headers, filter chips, dropdown menus: **`font-weight: 400`**.
4. **Color & Elevation Contracts**:
   - Popover surface: `var(--color-semantic-background-menu)` / `var(--color-semantic-background-surface-elevated)` with `var(--color-semantic-border-subtle)` and `var(--shadow-menu)`.
   - Date range selection strip: continuous connected track with tokenized selection background (dark: `#414141` / `var(--color-primitive-gray-400)`, light: `var(--color-primitive-gray-100)`).
   - Selected endpoints: circular badge (`var(--color-primitive-gray-1000)` bg, `var(--color-primitive-gray-0)` text).
   - Disabled future dates: `opacity: 0.35` with `var(--color-semantic-text-tertiary)` and `cursor: not-allowed`.
   - Today indicator: discrete 3px dot centered underneath the date number.

---

## 1. The 11 Audit Categories & Core Criteria

1. **Typography**: Exact tokens (`--font-size-*`, `--font-line-height-*`, 400 regular weight for secondary/filter/date elements, 500 for primary buttons).
2. **Color & Palette**: Tokenized colors from `docs/design-system/tokens.json`. Zero raw hex/rgb literals.
3. **Spacing & Layout**: 4px/8px modular scale. Flexbox alignment, zero arbitrary margins.
4. **Borders & Shapes**: Compact 8px (`var(--radius-md)`), 12px table/container (`var(--radius-xl)`), full pill (`var(--radius-full)`). 1px subtle borders.
5. **Shadows & Elevation**: Tokenized elevation (`--shadow-menu`, `--shadow-popover`, `--shadow-modal`).
6. **Geometry & Dimensions**: Compact 32px height for default controls, 28px for small controls. 30px table header, 45px table row.
7. **Interactive States**: Resting, hover, active (scale 0.98), focus-visible (2px offset ring), disabled (opacity 0.5, cursor not-allowed).
8. **Motion & Animation**: CSS transitions with `cubic-bezier(0.16, 1, 0.3, 1)`, 150ms-200ms, GPU accelerated (`transform`, `opacity`), full reduced-motion support.
9. **Accessibility & Semantics**: Semantic HTML tags, ARIA roles, states (`aria-expanded`, `aria-selected`, `aria-disabled`), keyboard navigation.
10. **State Management**: Clean JavaScript lifecycle, teardown on unmount, event delegation.
11. **Responsive & Adaptability**: Fluid sizing, overflow handling, mobile/tablet/desktop behavior.

---

## 2. Incremental Refinement Directive

- **NEVER rebuild from scratch**: Do not discard working components.
- **Audit in-place**: Identify deviations through computed style comparison against live platform and adjust tokens/CSS/JS directly.

---

## 3. Scoped Verification Protocol (Target-Only, Zero Unrelated Scans)

Verify only what was touched — never run repo-wide component sweeps (`audit_all_components.mjs`) or rebuild untouched layers unless explicitly requested:
- **Prototype files only (`smt-ratio-*`)**:
  ```bash
  npm run ds:check
  ```
  (plus `node --check smt-ratio-workflows.js` only when JS changed, and targeted `agent-desktop snapshot --root '<target-ref>' -i --compact` on the edited region).
- **Token changes (`tokens/` or `docs/design-system/tokens.json`)**:
  ```bash
  npm run tokens:build && npm run tokens:check && npm run ds:check
  ```
- **Single shared DS component change (`vanilla/`, when explicitly approved)**:
  ```bash
  npm run build:vanilla && npm run ds:check
  node .agents/skills/openai-ui-audit/scripts/verify-component.mjs <story-id> [theme=dark|light] [selector]
  ```
