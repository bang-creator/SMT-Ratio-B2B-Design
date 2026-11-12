# Vanilla build

This folder runs with plain HTML, CSS, and JavaScript. No React, React DOM, Vite, or Storybook is required at runtime.

```bash
npm run build:vanilla
python3 -m http.server 8080 -d vanilla
```

Open `http://127.0.0.1:8080`. Reusable styling uses the same `ds-*` classes and generated token files as the React package. Behavior uses `data-ds-*` attributes for switches, custom selects, tabs, menus, and dialogs.
