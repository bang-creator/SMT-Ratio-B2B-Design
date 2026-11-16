---
name: assistant-ui-clone
description: Standard Operating Procedure (SOP) for reverse-engineering and cloning components from assistant-ui (https://www.assistant-ui.com/elements) into pure vanilla HTML/CSS/JS with 100% motion, interaction, and visual fidelity, while adhering strictly to OpenAI Platform Design System tokens, 400 font-weight rules, zero color literals, and no external runtime bloat.
---

# Assistant-UI Component Reverse-Engineering & Cloning Protocol

This skill codifies the verified protocol for reverse-engineering and porting UI components from `https://www.assistant-ui.com/elements` into the OpenAI Platform Design System.

---

## 1. Zero-Guess Ground-Truth Extraction

Never approximate DOM structure, CSS rules, transitions, or state variants. Always extract ground truth directly from the source:

### Step 1.1: Fetch Source Code & Demo States from GitHub
For any element `element-slug`:
1. **Component implementation**:
   `curl -s https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/packages/ui/src/components/react/assistant-ui/elements/{element-slug}.tsx`
2. **Demo states & variants**:
   `curl -s https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/components/demo/elements/states/{element-slug}.tsx`
3. **Shared surfaces / helpers** (if referenced):
   `curl -s https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/packages/ui/src/components/react/assistant-ui/elements/surfaces.tsx`

### Step 1.2: Runtime Inspection in Dark Mode & Light Mode
1. Run Playwright script with `colorScheme: 'dark'` and `colorScheme: 'light'` against `https://www.assistant-ui.com/elements/{element-slug}`.
2. Extract:
   - Root and children computed styles (font-size, line-height, colors, borders, shadows, padding, gap).
   - Pseudo-elements (`::before`, `::after`) computed background and animations.
   - Dynamic states (hover, focus, active, transitioning, pulse).
   - Component screenshot in both dark and light modes.

### Step 1.3: Surface Elevation & Color Calibration Protocol (Zero-Guess Surface Rule)
Never approximate Tailwind semantic classes (`bg-popover`, `border-border/60`, `bg-card`) with generic dark colors:
1. **Physical Canvas Rasterization**:
   - Modern browser engines output `oklch(...)` or `oklab(...)` in `getComputedStyle`.
   - Always render color strings onto an offscreen 1x1 `<canvas>` in Chrome and extract physical `getImageData(0,0,1,1).data` to obtain the exact `[R, G, B, A]` bytes.
2. **Assistant-UI Dark Mode Surface Contract**:
   - **Canvas Background**: `oklch(0.17 0.003 106)` -> `hsl(60 3% 6%)` (`#0f0f0e`, lightness ~6%).
   - **Card Surface (`paper` / `popover` / `card`)**: `oklch(0.215 0.003 106)` -> `hsl(30 4% 10%)` (`#1a1918`, lightness ~10.5%).
     - *Critical Rule*: The card surface MUST be visibly elevated (+4.5% lighter) above the dark canvas background. Never use `#000000` or `#09090b` for cards!
   - **Card Border (`border-border/60`)**: `oklab(0.985 ... / 0.06)` -> `hsl(0 0% 100% / 0.06)` (a crisp 6% white hairline outline).
     - *Critical Rule*: Never use murky opaque gray borders (`#27272a`). The border is a translucent white scrim that provides an authentic glass/hairline edge.
   - **Inset Fields & Textareas (`field`)**: `hsl(0 0% 100% / 0.06)` in dark mode, `hsl(0 0% 0% / 0.04)` in light mode.
   - **Sent User Bubble**: `hsl(0 0% 100% / 0.06)` with hover `hsl(0 0% 100% / 0.09)`.
3. **No Nested Stage Boxing**:
   - Card components already possess full container geometry (border-radius, background, border, padding).
   - Render cards cleanly on the canvas stage without enclosing them in bordered nested `.ds-story-stage` wrappers that cause double-border distortion.

---

## 2. Motion & Interactive Architecture Directive

### 2.1 DOM Preservation for Native CSS Transitions
- **CRITICAL**: Never wipe and rebuild DOM (`container.innerHTML = ...`) during continuous updates (e.g. streaming tokens, live counters). Tearing down DOM destroys browser transition states and causes choppy jumps.
- **Rule**: Append or insert new DOM nodes incrementally. Update class names on existing nodes to trigger smooth native CSS transitions (`transition: color 700ms cubic-bezier(0.4, 0, 0.2, 1)`).

### 2.2 Specular Shimmer & Shader Mechanics
- Use `-webkit-mask-image: linear-gradient(black, black)` + `-webkit-mask-clip: text` + `background-clip: text`.
- Pseudo-element `::before` sweeps a specular highlight beam angled at `105deg` across letters.
- The beam must use `var(--color-semantic-shimmer-highlight)` (`#ffffff` with `color-mix` falloff) to achieve authentic illuminated highlights across both dark and light backgrounds.

### 2.3 Motion Safety
- Always guard animations and transitions under `@media (prefers-reduced-motion: reduce)`.

---

## 3. OpenAI Design System Token & Geometry Rules

1. **Strict 400 Font-Weight Rule**:
   - `font-weight: 400` across all labels, body text, badges, and readouts (`AGENTS.md`).
   - Only primary buttons or strong headers use medium/semibold.
2. **Zero Color Literals Gate**:
   - Never write hex (`#...`), rgb, or oklch literals in CSS or JS files.
   - All colors must map to `var(--color-semantic-...)` or `var(--color-primitive-...)`.
   - If a new semantic token is legitimately required (e.g. `shimmer.highlight`), declare it in `docs/design-system/tokens.json` and build via `npm run tokens:build`.
3. **Standard Geometry**:
   - Compact control height: 32px (`var(--height-control-md)` / 32px) or 28px (`var(--height-control-sm)`).
   - Radii: 8px (`var(--radius-md)`), 12px (`var(--radius-xl)`), full pill (`var(--radius-full)`).
4. **No External Library Bloat**:
   - 0 new packages installed in `package.json`. No runtime dependencies. Plain HTML/CSS/JS only.

---

## 4. Storybook Story Structure

Every cloned element file under `vanilla/stories/default/{element-slug}.stories.js` must contain:
1. **Interactive / Live Runner (Default)**:
   - Auto-runs immediately on load with smooth loop (or interactive toggle controls).
   - Real-time motion, transitions, and timers.
2. **Exact State Snapshot Stories**:
   - All states listed in the official assistant-ui demo (e.g., `Default`, `With Timer`, `Long Label` or `Streaming`, `Complete`).
3. **Padded Layout & Stage Presentation**:
   - Wrapped inside standard `stage(...)` or `.ds-story-stage` with consistent typography and clean layout.

---

## 5. Verification & Quality Assurance Protocol

Run verification after every component implementation:
```bash
npm run tokens:build && npm run tokens:check && npm run ds:check && npm run build:vanilla
node scripts/audit_all_components.mjs
```
Capture and verify screenshots in dark and light modes to ensure pixel-perfect fidelity.
