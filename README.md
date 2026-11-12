# OpenAI Platform Design System

Reusable React components and dark-first tokens extracted from the OpenAI Platform UI.

## Use in the next project

Build the package once:

```bash
npm install
npm run build:library
```

Install it from a sibling project:

```bash
npm install "../OpenAI Design System"
```

Use the primitives:

```tsx
import { Button, Card, Field, Input, Select, Switch } from 'openai-platform-design-system';

export function SettingsPanel() {
  return (
    <Card title="Project settings">
      <Field label="Project name"><Input defaultValue="Default project" /></Field>
      <Field label="Model">
        <Select defaultValue="gpt-6.1-sol">
          <option>gpt-6.1-sol</option>
          <option>gpt-6-luna</option>
        </Select>
      </Field>
      <Switch label="Store logs" defaultChecked />
      <Button>Save settings</Button>
    </Card>
  );
}
```

Import `openai-platform-design-system/styles.css` once from the app entry or root layout. Components are token-backed and default to the dark platform theme; set `document.documentElement.dataset.theme = 'light'` for the light token set.

## Local development

```bash
npm run dev
npm run storybook
```

Preview the extracted Usage and Responses surfaces at `/specimen/fixtures/platform-components`.

For the reusable-project contract and feedback workflow, read [`docs/design-system/HANDOFF.md`](docs/design-system/HANDOFF.md). Review the complete shared component list in Storybook under **DS / Public exports / Catalog**; its promotion rule is documented in [`docs/design-system/PUBLIC_EXPORTS.md`](docs/design-system/PUBLIC_EXPORTS.md).

For parallel editing with another AI, use [`docs/design-system/AI-HANDOFF.md`](docs/design-system/AI-HANDOFF.md). It lists the source files, isolated worktree commands, review boundary, and a ready-to-paste prompt.

For GitHub branch, Storybook, PR, and post-merge workflow, read [`CONTRIBUTING.md`](CONTRIBUTING.md).
