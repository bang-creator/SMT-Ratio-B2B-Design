# Codex <-> Antigravity Annotation Bridge Protocol

Background, zero-copy-paste protocol connecting **OpenAI Codex** (running `localhost` in its built-in browser with multi-element UI annotations and UI inspector property overrides) with **Antigravity** (which receives batches automatically via Reactive Wakeup, applies token-accurate edits, verifies Design System gates, and sends completion ACKs).

---

## 1. Architecture & Agent Roles

| Agent | Role | Permitted Workspace Actions |
| --- | --- | --- |
| **Codex** | **Fast-Path DOM / UI-Panel Relay (Zero Repo Scan)** | Reads zero files and runs zero `grep`/`find` scans. Packages annotation DOM targets + UI inspector panel values directly into JSON and runs `node "/Users/bangworkinghub/Documents/OpenAI Design System/scripts/codex-bridge.mjs" send`. **NEVER edits product source files.** |
| **Antigravity** | **Design System Token Mapper, Code Executor & QA Verifier** | Runs `node scripts/codex-bridge.mjs listen-once` in background (`IsDaemon: false`, FS + HTTP `:4174`), sends `ack` immediately upon wake-up, maps raw values onto canonical OpenAI Design System tokens/classes, edits source files, runs QA gates, marks `complete`, and re-arms `listen-once`. |

### Dual Transport Layout (`.codex-bridge/` + Localhost HTTP `:4174`)

1. **Primary (Atomic POSIX Queue)**: `send` writes `.codex-bridge/tmp/<batchId>.tmp` and renames into `.codex-bridge/inbox/<batchId>.json`.
2. **Automatic Fallback (`127.0.0.1:4174`)**: If Codex's Seatbelt sandbox blocks writing to `.codex-bridge/`, `send` automatically falls back to `POST http://127.0.0.1:4174/batch` served by the armed `listen-once` process.

```text
.codex-bridge/
  listener.json          # Live PID + startedAt + httpPort of Antigravity's armed listen-once process
  tmp/<batchId>.tmp      # Staging file before atomic rename
  inbox/<batchId>.json   # Validated batch awaiting Antigravity pickup
  active/<batchId>.json  # Batch claimed by Antigravity and currently being executed
  ack/<batchId>.json     # Stage tracker: delivered_to_watcher -> confirmed_by_antigravity -> completed
  history/<batchId>.json # Archived completed batches
```

---

## 2. JSON Payload Schema (`schemaVersion: 1`, Fast-Path)

`scripts/codex-bridge.mjs send` normalizes missing defaults and **automatically resolves `sourceMapping`** in `<20ms` across `smt-ratio-prototype.html`, `smt-ratio-workflows.js`, `smt-ratio-workflows.css`, and `vanilla/base.css` (zero `node_modules/` scanning).

### Top-Level Fields

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `batchId` | Optional (auto-generated if omitted) | `string` | Unique batch ID (`[a-zA-Z0-9._-]+`). |
| `pageContext` | Optional (defaults to `http://localhost:4173/`) | `object` | Recommended: `url`, `theme` (`"dark"` \| `"light"`), `viewport` (`{ width, height }`), `activeState` (visible screen/tab/modal state). |
| `globalPrompt` | Optional | `string` | Verbatim user instruction covering the whole prompt. |
| `annotations` | **Required** | `array` (min `1`) | Ordered list matching pin order `#1..#N`. |

### Per-Annotation Object (`annotations[i]`)

| Field | Required | Description |
| --- | --- | --- |
| `index` | Optional (defaults to `i + 1`) | 1-based annotation pin number (`1..N`). |
| `label` | Optional | Short human-readable element label (e.g. `"Create new case CTA button"`). |
| `comment` | Optional (aliases: `note`, `instruction`) | Verbatim annotation text entered on the pin. |
| `domTarget` | **Required** (or shorthand top-level `selector`) | Object identifying the exact DOM node:<br>- `selector` (**required**, non-empty CSS selector)<br>- `tagName` (optional — auto-inferred from `selector` if omitted)<br>- `elementId` (`string \| null`)<br>- `classList` (`string[]`)<br>- `attributes` (`Record<string, string>`)<br>- `textSnippet` (`string`)<br>- `occurrenceHint` (`string`, e.g. `"Toolbar right action"` or `"Row 3 status column"`)<br>- `boundingBox` (`{ x, y, width, height } \| null`)<br>- `xpath` / `ancestorPath` (optional structural tie-breakers) |
| `uiPanelChanges` | Optional (aliases: `uiChanges`, `styles`, `changes`) | Exact before/after values from Codex's annotation UI customization panel. Accepts either:<br>- Array of `{ property, cssProperty?, before?, after, unit?, note? }`, OR<br>- Object `{ [property]: { before?, after } \| value }` |
| `computedStylesSnapshot` | Optional | Key computed CSS values around the target (`fontSize`, `fontWeight`, `padding`, `gap`, `borderRadius`, `height`, `color`, `backgroundColor`). |
| `sourceMapping` | **Optional (auto-resolved in `<20ms`)** | Automatically populated by `codex-bridge.mjs` from `domTarget` (`primaryFile`, `lineStart`, `lineEnd`, `matchedSelectorOrSymbol`, `codeExcerpt`, `relatedFiles`). Codex does **not** need to scan the repo. |

---

## 3. Realistic 2-Annotation Batch Example

```json
{
  "pageContext": {
    "url": "http://localhost:4173/",
    "theme": "dark",
    "viewport": { "width": 1440, "height": 900 },
    "activeState": "Home — Accident case resource table"
  },
  "globalPrompt": "Tune toolbar CTA spacing and pill badge padding on the resource table view.",
  "annotations": [
    {
      "index": 1,
      "label": "Toolbar Create new case button",
      "comment": "Tighten horizontal padding slightly and ensure icon-to-label gap matches compact spec.",
      "domTarget": {
        "selector": "button.ds-button.ds-button--primary[data-action=\"create-case\"]",
        "tagName": "button",
        "elementId": null,
        "classList": ["ds-button", "ds-button--primary"],
        "attributes": { "type": "button", "data-action": "create-case" },
        "textSnippet": "Create new case",
        "occurrenceHint": "Top filter bar right-hand primary CTA",
        "boundingBox": { "x": 1244, "y": 72, "width": 148, "height": 32 }
      },
      "uiPanelChanges": [
        { "property": "padding-inline", "cssProperty": "padding-inline", "before": "12px", "after": "16px", "unit": "px" },
        { "property": "gap", "cssProperty": "gap", "before": "8px", "after": "6px", "unit": "px" }
      ],
      "computedStylesSnapshot": {
        "height": "32px",
        "fontSize": "14px",
        "fontWeight": "500",
        "borderRadius": "8px"
      },
      "sourceMapping": {
        "primaryFile": "smt-ratio-prototype.html",
        "lineStart": 1660,
        "lineEnd": 1665,
        "matchedSelectorOrSymbol": "button.ds-button.ds-button--primary[data-action=\"create-case\"]",
        "codeExcerpt": "<button type=\"button\" class=\"ds-button ds-button--primary\" data-action=\"create-case\">",
        "relatedFiles": [
          { "file": "vanilla/base.css", "lineStart": 119, "lineEnd": 120, "role": "shared-button-styles" }
        ]
      }
    },
    {
      "index": 2,
      "label": "Row 1 scenario pill badge",
      "comment": "Slightly reduce vertical padding while keeping pill corners.",
      "domTarget": {
        "selector": "tbody tr:nth-child(1) td:nth-child(3) span.ds-badge.ds-badge--pill",
        "tagName": "span",
        "elementId": null,
        "classList": ["ds-badge", "ds-badge--pill", "ds-badge--default"],
        "attributes": {},
        "textSnippet": "Intersection T-bone",
        "occurrenceHint": "First row of Accident case table, Scenario column",
        "boundingBox": { "x": 512, "y": 176, "width": 142, "height": 22 }
      },
      "uiPanelChanges": [
        { "property": "padding-block", "cssProperty": "padding-block", "before": "3px", "after": "2px", "unit": "px" },
        { "property": "font-weight", "cssProperty": "font-weight", "before": "400", "after": "400" }
      ],
      "sourceMapping": {
        "primaryFile": "smt-ratio-prototype.html",
        "lineStart": 1708,
        "lineEnd": 1710,
        "matchedSelectorOrSymbol": "<span class=\"ds-badge ds-badge--pill ds-badge--default\">Intersection T-bone</span>",
        "codeExcerpt": "<td><span class=\"ds-badge ds-badge--pill ds-badge--default\">Intersection T-bone</span></td>",
        "relatedFiles": [
          { "file": "vanilla/base.css", "lineStart": 1028, "lineEnd": 1045, "role": "badge-pill-css" }
        ]
      }
    }
  ]
}
```

---

## 4. Exact CLI Commands

### Codex Commands (Fast-Path Relay — Absolute Path Safe From Any Working Directory)

```bash
# Check listener & queue status
node "/Users/bangworkinghub/Documents/OpenAI Design System/scripts/codex-bridge.mjs" status

# Start localhost preview on port 4173 only if not already serving
node "/Users/bangworkinghub/Documents/OpenAI Design System/scripts/codex-bridge.mjs" serve --port 4173

# Validate, auto-resolve sourceMapping (<20ms), queue, and return immediately on delivery (~0.2s)
node "/Users/bangworkinghub/Documents/OpenAI Design System/scripts/codex-bridge.mjs" send <<'EOF'
{ ...valid JSON payload... }
EOF
```

### Antigravity Commands (Execution Loop)

```bash
# 1. Arm one-shot background listener (MUST use IsDaemon: false so exit triggers Reactive Wakeup)
node scripts/codex-bridge.mjs listen-once

# 2. Immediately confirm receipt after wakeup
node scripts/codex-bridge.mjs ack <batchId> --message "Antigravity da nhan batch va dang xu ly"

# 3. Verify Design System compliance after applying edits
npm run tokens:build && npm run tokens:check && npm run build:vanilla && npm run ds:check

# 4. Archive batch & mark completed, then immediately re-arm listen-once
node scripts/codex-bridge.mjs complete <batchId> --summary "Updated ..."
```

---

## 5. Design System Translation Rules (Antigravity Side)

Codex's UI customization panel outputs literal values (`16px`, `#18181b`, `8px`, `400`, etc.). Before editing code, Antigravity **must** translate literals into repository contracts (`AGENTS.md` & `docs/design-system/AI-QUICK-REFERENCE.md`):

1. **Colors**: Never paste hex/rgb/oklch literals in CSS, JS, or story HTML. Map to `--color-semantic-*` or `--color-primitive-*` in `docs/design-system/tokens.json` (and rebuild via `npm run tokens:build` if a new token is warranted).
2. **Spacing & Radii**: Map pixel values to canonical tokens (`--space-1` `4px`, `--space-2` `8px`, `--space-3` `12px`, `--space-4` `16px`, `--radius-md` `8px`, `--radius-xl` `12px`, `--radius-full` pill).
3. **Typography (400 Weight Rule)**: Keep secondary/tertiary text, table headers/cells, badges, and menu items at `var(--font-weight-normal)` (`400`); primary buttons use `var(--font-weight-medium)` (`500`).
4. **Canonical Classes & Zero Inline Styles**: Use `.ds-*` classes defined in `vanilla/base.css`. Never inject `style="..."` attributes or ad-hoc `ds-smt-*` classes.
5. **Local vs Shared Promotion**: Apply prototype feedback to `smt-ratio-prototype.html` / `smt-ratio-workflows.css` / `smt-ratio-workflows.js` unless changing shared `.ds-*` primitives is explicitly required and approved.
