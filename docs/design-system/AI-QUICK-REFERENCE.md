# AI Quick Reference

Single-stop cheat sheet for AI agents using the **OpenAI Platform Design System** (vanilla HTML/CSS/JS, zero framework runtime). Read this file + [`AGENTS.md`](../../AGENTS.md) before reading CSS or story files.

---

## 1. Runtime & Setup

```html
<html lang="en" data-theme="dark"> <!-- or "light" -->
<link rel="stylesheet" href="./vanilla/design-system.css" />
<!-- Call mount(root) after inserting DS markup into the DOM -->
<script type="module">
  import { mount } from './vanilla/design-system.js';
  mount(document);
</script>
```

- **Catalog counts**: `33` Shared components (`vanilla/stories/shared/`), `5` Default Application components (`01`–`05` in `vanilla/stories/default/`), `2` SMT Ratio Application components (`vanilla/stories/smt-ratio/application/`).
- **Source of truth**: `docs/design-system/tokens.json` → `tokens/tokens.css` & `tokens/tokens.dark.css`; styles in `vanilla/base.css`; interactive behaviors in `vanilla/design-system.js`.

---

## 2. Hard Rules & Gate Checks

Run before finishing any edit:

```bash
npm run tokens:build && npm run tokens:check && npm run ds:check && npm run build:vanilla
```

| Rule | Detail |
| --- | --- |
| **No color literals** | Zero hex/rgb/oklch literals in CSS, JS, or story HTML. Put colors in `docs/design-system/tokens.json`. Use `black` (not `#000`) in `mask-image`. |
| **No inline `style="..."`** | Never put inline `style` attributes in HTML templates. Notice `String.fromCharCode(35)` for `#` before digits (avoids hex-literal gate). |
| **Compact heights & radii** | Controls `32px` (`sm`: `28px`); radius `--radius-md` (`8px`), cards/tables `--radius-xl` / `--radius-2xl`, pills `--radius-full`. |
| **400 font-weight** | Secondary/tertiary labels, calendar headers/dates, table headers, dropdown items use `var(--font-weight-normal)` (`400`); primary buttons use `var(--font-weight-medium)` (`500`). |
| **SVG icons** | Use inline `<svg>` with `currentColor`. Always keep `fill="none"` on stroke icons inside `.ds-button` (`svg:not([fill="none"])` defaults to `fill: currentColor`). Zero fake Unicode glyphs. |
| **SMT Ratio contract** | Files under `vanilla/stories/smt-ratio/**` and `sidebar.stories.js` must only use `.ds-*` classes defined in `vanilla/base.css` (plus `is-active`, `is-disabled`), never `ds-smt-*` or `ds-analysing*`. |
| **Detached story mounts** | `mount(root)` in stories runs before DOM attachment; defer auto-start timelines with `requestAnimationFrame(() => { if (root.isConnected) ... })`. |

---

## 3. Core Design Tokens (`tokens/tokens.css`)

- **Backgrounds**: `--color-semantic-background-canvas`, `--color-semantic-background-surface`, `--color-semantic-background-surface-elevated`, `--color-semantic-background-surface-secondary`, `--color-semantic-background-sidebar`, `--color-semantic-background-sidebar-active`, `--color-semantic-background-menu`, `--color-semantic-background-menu-hover`, `--color-semantic-background-menu-danger-hover`, `--color-semantic-background-segmented`, `--color-semantic-background-segmented-thumb`
- **Text**: `--color-semantic-text-primary`, `--color-semantic-text-secondary`, `--color-semantic-text-tertiary`, `--color-semantic-text-inverse`, `--color-semantic-text-danger`, `--color-semantic-text-success`, `--color-semantic-text-warning`, `--color-semantic-text-info`, `--color-semantic-text-sidebar`, `--color-semantic-text-sidebar-secondary`
- **Borders & focus**: `--color-semantic-border-subtle`, `--color-semantic-border-default`, `--color-semantic-border-strong`, `--color-semantic-ring-focus`, `--color-semantic-accent-control`
- **Buttons**: `--color-semantic-button-secondary-background` / `-hover` / `-border`, `--color-semantic-button-danger-solid-background` / `-hover` / `-text`, `--color-semantic-button-danger-soft-hover-background`, `--color-semantic-button-ultra-background` / `-hover` / `-text`
- **Badges**: `--color-semantic-badge-{default,green,red,blue,purple,yellow,orange,cyan,success,danger,warning,info}-{background,text,border,dot,halo}`
- **Typography**: `--font-family-sans`, `--font-family-mono`, `--font-size-{3xs,2xs,xs,sm,md,lg}`, `--font-size-heading-{xs,sm,md,lg,xl}`, `--font-size-heading{2xl,3xl}`, `--font-weight-{normal,medium,semibold,bold}`, `--font-line-height-{tight,normal,body}`
- **Spacing, radii, motion, layout**: `--space-{0,1,2,3,4,5,6,7,8,10}`, `--radius-{2xs,xs,sm,md,lg,xl,2xl,3xl,4xl,full}`, `--shadow-{hairline,sm,md,lg,thumb,menu}`, `--motion-duration-{basic,moderate,reveal,content}`, `--motion-easing-{enter,exit,move}`, `--layout-{sidebar-desktop,sidebar-collapsed,sidebar-mobile-rail,topbar-height}`

---

## 4. Layout & Utility Helpers (`vanilla/base.css`)

- Containers & stacks: `.ds-stack` (column, `--space-4`), `.ds-row` (wrap row, `--space-3`), `.ds-grid`, `.ds-card`, `.ds-card-header`
- Typography helpers: `.ds-text`, `.ds-muted`, `.ds-text-accent`, `.ds-text-secondary`, `.ds-label`, `.ds-field-error`
- Flex/spacing helpers: `.ds-flex`, `.ds-inline-flex`, `.ds-items-center`, `.ds-gap-2`, `.ds-ml-auto`, `.ds-mr-2`, `.ds-self-end`
- App shell: `.ds-shell`, `.ds-sidebar`, `.ds-main`

---

## 5. Component Quick Map

### A. Default / Shared (33 components)

| Component | Root & Modifiers | Key Children / Slots | JS Hook (`data-ds-*`) |
| --- | --- | --- | --- |
| **Badge** | `.ds-badge` `--{default,green,red,blue,purple,yellow,orange,cyan,success,danger,warning,info}` `--pill` `--sm` | `.ds-badge__indicator` + `.ds-badge__dot`, `.ds-badge__icon` | — |
| **Breadcrumb** | `.ds-breadcrumb` | `.ds-breadcrumb__link`, `.ds-breadcrumb__separator`, `.ds-breadcrumb__current`, `.ds-breadcrumb__dropdown`, `.ds-breadcrumb__trigger`, `.ds-breadcrumb__badge` | `data-ds-dropdown`, `data-ds-dropdown-value` |
| **Button** | `.ds-button` `--{primary,secondary,outline,ghost,danger,danger-solid,danger-soft,ultra}` `--sm` `--pill` `--icon` `--block` `--loading` `--action` | `.ds-button__spinner`, `.ds-button__sparkles`, `.ds-button__action-{content,morph,label,icon-slot,phase,arrow,spinner,check}`, `.ds-icon-button` | `data-ds-action-button` (`disabled` / `data-disabled`) |
| **Checkbox** | `label.ds-checkbox` | `input[type="checkbox"]`, `.ds-checkbox__control`, `.ds-checkbox__check`, `.ds-checkbox__dash` | — (`disabled`, `indeterminate`) |
| **Code Snippet** | `.ds-code-snippet` `--{singleline,inline,multiline}` | `__header`, `__lang`, `__body`, `__lines`, `__pre`, `__code`, `__copy-btn`, `.ds-code-token--{keyword,function,string,number}` | Copy button wired in JS |
| **Contained List** | `.ds-contained-list` | `__top`, `__title`, `__metrics`, `__table-wrap`, `__table`, `__model`, `__tier-select` | Optional `data-ds-select` |
| **Content Switcher** | `.ds-segmented` `--sm` `--pill` `--block` `--ghost` | `.ds-segmented__thumb`, `button` children | `data-ds-segmented` (emits `ds-change`) |
| **Data Table** | `.ds-table-wrap` > `table.ds-table` | `__col-check`, `__th-content`, `__sortable`, `__sort-icon`, `__actions`, `__empty-row`, `.ds-platform-empty` | Checkbox & sort wired in JS |
| **Date Picker** | `.ds-date-picker` `--navigation` `--single-month` | `__trigger`, `__dialog`, `__presets`, `__preset`, `__dual-calendar` / `__single-calendar`, `__month-header`, `__day` (`--start`/`--end`/`--empty`), `__cell--range-{start,mid,end}` | `data-ds-date-picker`, `data-ds-open` |
| **Dropdown** | `.ds-dropdown` `--sm` | `__trigger`, `__value`, `__menu`, `.ds-search-input`, `__list`, `__item`, `__check` (`--empty`) | `data-ds-dropdown`, `data-ds-dropdown-value`, `data-ds-open` |
| **File Uploader** | `.ds-dropzone` | `__input`, `__icon`, `__text`, `__file-icon` | `data-ds-dropzone` |
| **Filter** | `.ds-filter`, `.ds-filter-bar` | `__trigger`, `__icon`, `__clear`, `__menu`, `__list`, `__item`, `__check`, `.ds-filter-reset`, `.ds-filter-bar__{group,actions}` | `data-ds-filter`, `data-ds-filter-value`, `data-ds-filter-reset`, `data-ds-open`, `data-active` |
| **Form** | `.ds-form-panel` | `.ds-form-section` (`__header`, `__chevron`, `__body`), `.ds-form-row` (`--stack`, `__top`, `__label`, `__helper`), `.ds-form-slider` | Composes Switch, Slider, Dropdown, Segmented |
| **Link** | `a.ds-link` `--external` `--subtle` | `__text`, `__icon` | `aria-disabled="true"` / `.is-disabled` |
| **Menu** | `.ds-menu` `--block` `--top` | `__trigger` (`--icon`), `__content`, `__header`, `__item` (`__item-left`, `__item-right`, `__icon`, `__check`, `__chevron`), `__separator` | `data-ds-menu`, `data-ds-open` |
| **Modal** | `[role="dialog"]` (`hidden`) | `.ds-dialog__backdrop`, `.ds-dialog`, `__header`, `__title`, `__description`, `__body`, `__footer`, `__counter` | `data-ds-dialog-open`, `data-ds-dialog-close` |
| **Notification** | `.ds-callout` / `.ds-toast` `--{default,success,warning,danger,error,info}` `--inline` `--floating` | `__icon`, `__content`, `__title`, `__close` | `data-ds-toast-trigger` |
| **Number Input** | `.ds-number-stepper` | `__btn`, `__input` (`.ds-input`), `.ds-input-group__unit` | `data-ds-number-stepper` |
| **Pagination** | `.ds-pagination` `--inline` | `__left`, `__right`, `__pages`, `__page`, `__btn` (`--nav`), `__ellipsis`, `__rows-per-page`, `__summary`, `__status` | `data-ds-pagination`, `data-ds-pagination-inline`, `data-ds-page-{action,current,total}`, `data-ds-rows-{dropdown,value}` |
| **Popover** | `.ds-popover` `--{top,top-start,top-end,bottom,bottom-start,bottom-end,left,right}` | `__trigger`, `__content` (`hidden`), `__header`, `__title`, `__body`, `__footer` | `data-ds-popover`, `data-ds-popover-close`, `data-ds-open` |
| **Progress Bar** | `.ds-progress-bar` `--indeterminate` | `.ds-progress-bar__fill` | — |
| **Progress Indicator** | `.ds-progress-indicator` `--horizontal` `--vertical` | `.ds-progress-step` (`__indicator`, `__marker`, `__line`, `__content`, `__title`, `__desc`) | `data-ds-progress-indicator` |
| **Radio Button** | `label.ds-radio` | `input[type="radio"]`, `.ds-radio__control`, `.ds-radio__dot`, `.ds-radio__label` | — |
| **Scroll Bar** | `.ds-scroll-area` `--vertical` `--horizontal` | `.ds-scrollbar`, `.ds-scroll-list` / `.ds-scroll-row` / `.ds-scroll-card` | Native CSS styled scrollbars |
| **Search Input** | `.ds-search-input` `--pill` `--block` | `__icon`, `__field`, `__clear` | `data-ds-search-input` |
| **Search Trigger** | `button.ds-search-trigger` | `__icon`, `__label`, `__kbd` | `data-ds-search-trigger` |
| **Sidebar** | `.ds-shell` > `aside.ds-sidebar` + `main.ds-main` | `.ds-sidebar__{header,brand,collapse,search,footer,account,account-popover}`, `.ds-nav` > `.ds-nav__item`, `.ds-cmd-palette*` | `data-ds-sidebar`, `data-ds-sidebar-collapse`, `data-ds-search-{dialog,trigger,input,close}` |
| **Slider** | `input.ds-slider[type="range"]` | `.ds-slider__track`, `.ds-slider__label`, `.ds-slider__readout` | `data-ds-slider`, `data-ds-readout` |
| **Structured List** | `.ds-structured-list` | `__row`, `__key`, `__val` | — |
| **Tabs** | `[data-ds-tabs]` | `.ds-tabs` (`--block`), `.ds-tab`, `.ds-tab__content`, `.ds-tabs__indicator`, `.ds-tabpanel` | `data-ds-tabs` |
| **Text Input** | `.ds-input` `--sm` `--pill` `--multiline` / `.ds-textarea` | `.ds-input-wrap`, `.ds-input-group` (`__prefix`, `__unit`), `.ds-clear-btn`, `.ds-password-toggle`, `.ds-field-error` | `data-ds-clearable`, `data-ds-password-wrap`, `data-ds-password-toggle` |
| **Toggle** | `label.ds-switch` | `input[type="checkbox"]`, `__control`, `__thumb`, `__content`, `__title`, `__desc` | `data-ds-switch` |
| **Tool Tips** | `.ds-tooltip` `--{top,bottom,left,right,bottom-right,...}` | `.ds-tooltip__content` | Pure CSS hover/focus |

### B. Default / Application (`01`–`05`, active)

1. **01 Loading State**: `.ds-loader-viewport` > `.ds-generation-loader` (`__grid`, `__cell`, `__label`)
2. **02 Thinking indicator**: `.ds-thinking-indicator` (`__dot`, `__label`, `__elapsed`)
3. **03 Streaming text**: `.ds-stream-viewport` > `.ds-streaming-text`, `.ds-streaming-token`, `.ds-streaming-code`, `.ds-streaming-caret` (`--done`)
4. **04 Typing Indicator**: `.ds-typing-indicator` `--bubble` `--bare` (`__dots`, `__dot`)
5. **05 Reasoning Effort**: `.ds-reasoning-effort` (`__header`, `__title`, `__pill`, `__track`, `__fill` `--{low,medium,high}`, `__btn`, `__stats`)

### C. SMT Ratio / Application (Preserved & Product-Guarded)

- **Analysing** (`vanilla/stories/smt-ratio/application/analysing.stories.js`): `.ds-tool-run-canvas` > `[data-ds-tool-run].ds-tool-run` (`__root`, `__head`, `__calls`, `__call`, `__live`, `__spinner`, `__aside`, `__kv`, `__list`, `__table`, `.ds-tool-run-shimmer*`). Composes `.ds-button` & `.ds-badge` & `.ds-code-token--*`.
- **Sidebar** (`vanilla/stories/smt-ratio/application/sidebar.stories.js`): `.ds-shell` > `.ds-sidebar` (`data-ds-sidebar`, `data-collapsed`, `.ds-sidebar__brand` + `.ds-sidebar__logo`, `.ds-nav__item`, `.ds-sidebar__account`, `.ds-cmd-palette*` dialog, `.ds-main`).
