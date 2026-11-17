# Framework-free source

Plain HTML/CSS/JS source for prototyping. Runtime has no dependencies. Storybook is the only preview surface.

- `base.css`: editable CSS source.
- `design-system.css`: generated token CSS + base CSS.
- `design-system.js`: data-attribute behaviors.
- `stories/shared/`: 32 shared components.
- `stories/default/`: Default application components (`01`–`05`).
- `stories/smt-ratio/application/`: SMT Ratio application components (`Analysing`, `Sidebar`).

Regenerate and review:

```bash
npm run tokens:build
npm run build:vanilla
npm run storybook
```
