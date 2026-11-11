# Prototype guardrails

- Read `docs/design-system/DESIGN.md` and `components.md` before UI work.
- Use components in `src/components/**` and tokens in `src/tokens/**`.
- UI source cannot contain hex/rgb/oklch literals, arbitrary spacing, or inline style props.
- Motion uses `src/tokens/motion.ts`; honor reduced motion.
- Keep mock data local. No real API calls.
- Run `npm run tokens:build`, `npm run tokens:check`, `npm run ds:check`, and `npm run build` before review.
