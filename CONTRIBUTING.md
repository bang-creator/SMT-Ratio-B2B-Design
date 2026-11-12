# Contributing with another AI

## Start

```bash
git clone https://github.com/bang-creator/openai-platform-design-system.git
cd openai-platform-design-system
npm install
npm run storybook
```

Read `AGENTS.md`, `README.md`, and `docs/design-system/AI-HANDOFF.md` before editing.

## Branch and Storybook flow

```bash
git switch -c ai/<short-task-name>
```

Use **Default / Shared / Button (and the matching component story)** as the only review page. Product-only experiments stay out of the shared catalog until the owner approves promotion.

Before opening a PR:

```bash
npm run tokens:build
npm run tokens:check
npm run ds:check
npm run ds:verify
```

Commit and push:

```bash
git add .
git commit -m "describe the component feedback"
git push -u origin ai/<short-task-name>
```

After merge:

```bash
git switch main
git pull --ff-only origin main
git switch -c ai/<next-task-name>
```

Never force-push `main`. Never commit secrets, dependencies, build output, screenshots, or alternate previews.
