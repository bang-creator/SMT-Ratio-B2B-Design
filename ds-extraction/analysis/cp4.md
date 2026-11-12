# CP4 implementation report

Date: 2026-11-11  
Scope: mục 9–13 của `ds_setup_spec_for_agent.md`.

## Delivered

- Vite/React app shell with responsive sidebar, topbar, route outlet, and `/specimen`.
- Product route mocks: `/home`, `/response`, `/decisions`, `/agents`, `/audio`, `/images`, `/usage`.
- Token-backed primitives: Button, IconButton, Input, Textarea, Select, Field, Checkbox, Switch, Badge, Card, Tabs, Alert, Spinner, Skeleton, EmptyState, Table, CodeBlock, PageHeader.
- Storybook catalog in `src/components/ds.stories.tsx`; production Storybook build passes.
- Mock chat with streamed full-content yields, short/long/tool-running/tool-done/tool-error/error/slow-stop/offline/quota/attachment/branch scenarios, retry-safe error handling, and a stop control.
- Debug toolbar in development: light/dark, reduced-motion, and Default/Loading/Empty/Error/No-permission/Long-content screen states.
- Guardrails: `AGENTS.md`, literal scan, token checks, visual-test instructions, fidelity-report template.
- Dark-first chat fidelity fixture at `/specimen/fixtures/chat` with crop comparator `npm run visual:fixture`.
- D1 base is wired to `@openai/apps-sdk-ui/css`; Tailwind v4 is processed through `@tailwindcss/vite`.
- Extended primitive states are catalogued in Storybook: outline Button, Radio, Combobox, SegmentedControl, Drawer, Menu, Pagination, CopyField, DatePicker, and focus-trapped Dialog.

## Deliberate CP4 simplification

The chat skin uses a small local React panel instead of installing `@assistant-ui/react`. The mock preserves the required CP4 behavior surface (thread messages, composer, streaming, scenario selector, error state) while avoiding an unverified dependency/API migration. Replace the panel with assistant-ui primitives when product behavior is approved.

## Fidelity status

CP3 threshold: ≤2% changed pixels per fixture crop. Platform E1 captures remain the reference set. The dark-first Responses chat fixture passes at 1.02%; full-viewport route ratios remain diagnostic because product copy and platform-only assets differ.

## Validation

```text
npm run ds:verify       PASS
npm run build-storybook PASS
npm run tokens:sd:check PASS
npm run visual:fixture  PASS (Responses chat / dark, 1.02% changed pixels)
```

Interaction smoke checks (dark-first, 2026-11-12):

- `/specimen` defaults to dark; body resolves to `rgb(33, 33, 33)` / `rgb(243, 243, 243)`. Toolbar switches light and dark successfully.
- Theme and reduced-motion selections persist through reload in the prototype via local storage; dark remains the default when no preference exists.
- Chat scenario select uses the token-backed `Select`, so its surface remains dark. Enter submits; Shift+Enter keeps a newline.
- Tool running transitions to done; tool error renders an error card. Offline/quota render an alert with Retry; Retry replaces the failed turn instead of duplicating it.
- Slow stream exposes Stop and appends a stopped state after abort. Branch scenario exposes Edit and returns focus to the composer.
- Mobile `390×844` keeps composer actions clickable: debug toolbar moves above content and toast background no longer intercepts pointer input.

Tailwind v4 and `@openai/apps-sdk-ui/css` are now processed through the Vite plugin. Storybook reports only its standard large-chunk advisory; builds complete successfully.
