# E4 overlap: platform ↔ @openai/apps-sdk-ui

- SDK version: `0.2.2`
- Platform custom properties: **1077**
- SDK custom properties: **729**
- Same variable names: **728 / 1077 = 67.6%**
- Same name + same value: **661 / 1077 = 61.37%**
- SDK top-level component directories: **29**

## Decision input

D1 recommendation: **A — retain `@openai/apps-sdk-ui/css` as base**, because same-name overlap exceeds the 60% threshold and same-name/value overlap is 61.37%. Platform variables remain authoritative for overrides.
