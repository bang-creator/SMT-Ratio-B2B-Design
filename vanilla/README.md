# Framework-free source

Plain HTML/CSS/JS source for prototyping. Runtime has no dependencies. Storybook is the only preview surface.

- `base.css`: editable CSS source.
- `design-system.css`: generated token CSS + base CSS.
- `design-system.js`: data-attribute behaviors.
- `stories/shared/`: 33 shared components.
- `stories/default/`: Default application components.
- `stories/ams-b2b/`: AMS B2B application components.
- `stories/supplemental/`: existing exports outside the required list.

Regenerate and review:

```bash
npm run tokens:build
npm run build:vanilla
npm run storybook
```
