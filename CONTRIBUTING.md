# Contributing with another AI

## Start from main

```bash
git clone https://github.com/bang-creator/openai-platform-design-system.git
cd openai-platform-design-system
npm install
```

Read `AGENTS.md`, `README.md`, and `docs/design-system/AI-HANDOFF.md` before editing.

## Branch and Storybook flow

Create one branch per feedback item:

```bash
git switch -c ai/<short-task-name>
npm run storybook
```

Use **DS / Public exports / Catalog** as the review page. Update the Catalog story when a shared component changes. Keep product-only experiments out of the shared exports until the owner approves promotion.

Before opening a PR:

```bash
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run ds:verify
npm run build:library
npm run build-storybook
```

Commit, push, open a PR against `main`:

```bash
git add .
git commit -m "describe the component feedback"
git push -u origin ai/<short-task-name>
```

After the owner merges the PR, the next AI starts from the updated main:

```bash
git switch main
git pull --ff-only origin main
git switch -c ai/<next-task-name>
```

Never force-push `main`. Never commit secrets, `node_modules`, generated builds, or browser captures.
