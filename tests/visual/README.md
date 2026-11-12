# Visual checks

Extract committed E1 screenshots:

```bash
npm run visual:extract
```

Capture a local route at the same viewport/theme, then compare:

```bash
npm run visual:diff -- reports/fidelity/reference/home-1440-light.png reports/fidelity/local-home-1440-light-v2.png reports/fidelity/diff-home-1440-light-v2.png
```

Threshold: ≤2% changed pixels per fixture crop. Current full-viewport P1 measurements are recorded in `reports/fidelity/README.md`; they remain above threshold because the local product content is still a structured mock rather than a screenshot clone.
