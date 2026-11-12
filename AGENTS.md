# Prototype guardrails

- Read `docs/design-system/DESIGN.md` and `components.md` before UI work.
- Use components in `src/components/**` and tokens in `src/tokens/**`.
- UI source cannot contain hex/rgb/oklch literals, arbitrary spacing, or inline style props.
- Motion uses `src/tokens/motion.ts`; honor reduced motion.
- Keep mock data local. No real API calls.
- Run `npm run tokens:build`, `npm run tokens:check`, `npm run ds:check`, and `npm run build` before review.

## Feedback promotion

- Apply project feedback locally first while the change is still being evaluated.
- Do not promote a feedback change into the shared design system without explicit owner approval.
- An approved shared change must update the component or token, the Storybook `DS / Public exports / Catalog` story, and `docs/design-system/CHANGELOG.md` together.
- Treat `src/index.ts` as the Public exports approval boundary.
