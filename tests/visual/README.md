# Visual checks

Extract committed E1 screenshots:

```bash
npm run visual:extract
```

Capture a local route at the same viewport/theme, then compare:

```bash
npm run visual:diff -- reports/fidelity/reference/home-1440-light.png reports/fidelity/local-home-1440-light-v2.png reports/fidelity/diff-home-1440-light-v2.png
```

Threshold: ≤2% changed pixels per fixture crop. Dark mode is the priority baseline. Current full-viewport P1 measurements are recorded in `reports/fidelity/README.md`; Agents and Usage now pass the dark full-viewport threshold, while Home and Responses still need fixture-level content matching.

For a focused crop, run `npm run visual:fixture -- <reference.png> <local.png> <x> <y> <width> <height> <diff.png>`.
