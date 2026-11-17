---
name: uiarc-ds-clone
description: >-
  Fast-path SOP for cloning interactive motion components (uiarc.dev, reasoning blocks, tool calls, streaming UIs) into the OpenAI Platform Design System on the first pass with minimal token usage: 1-shot frame extraction, 100% shared DS atomic component composition (.ds-button, .ds-badge, .ds-code-token--*), top-pinned zero-jump layout, WAAPI spring physics, and linter trap prevention.
---

# UIArc / Motion Component -> OpenAI DS Fast-Path Protocol

Use this protocol whenever cloning a motion/interactive UI component (e.g., `https://uiarc.dev/components/<slug>`) into `vanilla/stories/smt-ratio/application/` or `vanilla/stories/default/`. Follow every step in order to ship on Pass 1 without layout jumps, button style rewrites, or lint failures.

---

## 1. One-Shot Extraction (Bypass Site Chrome)

1. **Navigate straight to the isolated frame route** when available on `uiarc.dev`:
   - `https://uiarc.dev/components/<slug>/frame` (renders only the fullscreen preview canvas without site chrome).
2. **Extract in ONE browser subagent / Playwright pass**:
   - Complete DOM tree & interactive states (`idle`, `running`, `error`, `approval`, `denied`, `success`).
   - Exact animation keyframes, `linear(...)` spring easing, stagger/delay timings, shimmer gradient stops, and inline SVG paths.
   - Do NOT extract or clone surrounding showcase wrappers, headers, or nav chrome.

---

## 2. First-Pass Shared DS Component Mapping (Zero Custom Overrides)

Map every sub-element directly to canonical Shared components on Pass 1 — **never** build custom `.ds-<comp>__action` / `.ds-<comp>__pill` overrides:

| Role | Exact Canonical DS Class(es) | Notes |
| --- | --- | --- |
| Primary action (`Allow`, `Confirm`) | `ds-button ds-button--primary ds-button--sm` | 28px height, `var(--radius-sm)` (`6px`), `#fff` dark / `#0d0d0d` light, `font-weight: 500` |
| Secondary action (`Retry`, `Deny`, `Cancel`) | `ds-button ds-button--secondary ds-button--sm` | Canonical `#4d4d4d` dark / `#f3f3f3` light, `6px` radius |
| Ghost text (`Run again`, `Show less`, fold toggle) | `ds-button ds-button--ghost ds-button--sm` | Translucent hover automatically handled by DS |
| Ghost icon-only (`Copy`, dismiss) | `ds-button ds-button--ghost ds-button--icon ds-button--sm` | Square icon button |
| Neutral status / tag badge (`Denied`, item tags) | `ds-badge ds-badge--sm ds-badge--default` | `18px` height |
| Error count badge (`1 failed`) | `ds-badge ds-badge--sm ds-badge--red` | `18px` height |
| JSON syntax highlighting | `ds-code-token--string`, `ds-code-token--number`, `ds-code-token--keyword` | Matches Shared `Code Snippet` story |
| Inset code / output wells | `background: var(--color-semantic-background-surface-secondary); border: 1px solid var(--color-semantic-border-subtle);` | Dark surface contrast + `1px` border |

### Critical SVG Rule Inside `.ds-button`
- `vanilla/base.css` defines `.ds-button svg:not([fill="none"]) { fill: currentColor; }`.
- Every stroke-based `<svg>` icon inside `.ds-button` (`Copy`, `Retry`, `Run again`, `Chevron`) **MUST** include `fill="none"`. Omitting it turns stroke icons into solid blocks.

---

## 3. Top-Pinned Zero-Jump Layout & Motion Architecture

### 3.1 Top-Edge Pinning (Zero Vertical Layout Jump)
Never vertically center (`justify-content: center` / `place-items: center`) a container whose height expands or collapses:
```css
.ds-tool-run-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100dvh;
  padding: clamp(32px, 12vh, 112px) var(--space-4) var(--space-8);
}

.ds-tool-run {
  display: grid;
  align-content: start;
  margin: 0 auto;
}
```
With this layout, expanding live previews, unfolded lists/JSON, or collapsing groups only moves the bottom edge — `rect.top` stays locked at `0px` delta.

### 3.2 Detached `mount(root)` Deferral (`story-helpers.js`)
`story()` executes `mount(root)` **before** Storybook attaches `root` into the document (`root.isConnected === false`). Always defer auto-running sequences and bounding-box reads:
```js
requestAnimationFrame(() => {
  if (root.isConnected) startDemo();
  else requestAnimationFrame(() => { if (root.isConnected) startDemo(); });
});
```

### 3.3 Spring Height WAAPI + 2-Line Live Thinking Preview
- **Height expand/collapse**: Measure `fromH = el.hidden ? 0 : el.getBoundingClientRect().height` and `toH = el.scrollHeight`, lock `overflow: hidden`, animate with `el.animate([{ height: `${fromH}px` }, { height: `${toH}px` }], { duration: 380, easing: SPRING_EASING, fill: 'forwards' })`, then cancel animation and clear inline `height`/`overflow` inside `onfinish`.
- **Sequential faded live thinking preview (`reasoning-block` pattern)**:
  - Render a 2-line clipped slot (`max-height: 40px; overflow: hidden`) under each running step.
  - Toggle `data-overflow="true"` when `tail.offsetHeight > slot.clientHeight` to apply `mask-image: linear-gradient(to bottom, transparent 0px, black 16px)`.
  - On each streamed word chunk, compute `delta = newOverflow - prevOverflow` and animate `tail.animate([{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0px)' }], { duration: 220, easing: SPRING_EASING })`.
  - Collapse the completed step's live wrap smoothly (`~320ms`) before starting the next step.
- **Reduced motion**: Always honor `matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(root?.closest?.('[data-reduced-motion="true"]'))` in JS AND declare `@media (prefers-reduced-motion: reduce)` + `[data-reduced-motion="true"]` rules in `vanilla/base.css`.

---

## 4. Linter & Contract Gate Traps (`npm run ds:check`)

`npm run ds:check` runs both `scripts/check-literals.mjs` and `scripts/check-ui-contract.mjs`:

1. **Allowed class prefixes (`check-ui-contract.mjs`)**:
   - Never use `ds-smt-*`, `ds-analysing*`, or un-tokenized utility classes on `vanilla/stories/smt-ratio/` stories.
   - Define canonical feature classes (e.g., `.ds-tool-run`, `.ds-tool-run-canvas`) in `vanilla/base.css` BEFORE running `ds:check`.
2. **Hex / Color literal regex (`check-literals.mjs`)**:
   - `/#[0-9a-fA-F]{3,8}|\brgb\(|\boklch\(/` scans all `.js/.html/.css` in `vanilla/`.
   - **Trap 1**: Issue IDs in demo text like `#1284`, `#1302`, `#1306` match `#0-9a-fA-F`! Write `const HASH = String.fromCharCode(35);` and use `${HASH}1284`.
   - **Trap 2**: CSS mask gradients using `#000` trigger the hex check! Always use keyword `black` and `transparent` in `mask-image`.
3. **Zero `style=` attributes**: Never put `style="..."` in HTML template strings; use CSS classes, `data-*` attributes, WAAPI, or `el.style.setProperty(...)`.
4. **Strict `font-weight: 400`**: Body, labels, titles, headers, badges use `var(--font-weight-normal)` (`400`); buttons keep DS default `500`.

---

## 5. Fast 1-Pass Verification Checklist

Run once after implementation:
```bash
npm run tokens:build && npm run tokens:check && npm run ds:check && npm run ds:verify
```
In Playwright verification (1 run covering both `globals=theme:dark` and `globals=theme:light`):
- Assert `document.querySelector('.ds-<block>').getBoundingClientRect().top + window.scrollY` varies by `<= 0.5px` across initial, live preview, unfolded output, approval, and final collapsed states (adding `window.scrollY` avoids false failures when Playwright scrolls down to click controls past viewport height).
- Assert computed `backgroundColor`, `borderRadius`, and `height` of `.ds-button--secondary` (`Retry`/`Deny`) and `.ds-button--primary` (`Allow`) in both themes (`rgb(77, 77, 77)` / `rgb(255, 255, 255)` dark; `rgb(243, 243, 243)` / `rgb(13, 13, 13)` light), plus `.ds-badge--sm` (`18px`) and SVG `fill="none"`.
- Confirm `http://127.0.0.1:6006/index.json` includes the new story ID and capture screenshots for visual inspection.
