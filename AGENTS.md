# Prototype guardrails

- Read `docs/design-system/DESIGN.md` and `docs/design-system/HANDOFF.md` before UI work.
- Source is plain HTML in Storybook stories, CSS in `vanilla/base.css`, JS in `vanilla/design-system.js`, and tokens in `tokens/`.
- UI source cannot contain hex/rgb/oklch literals, arbitrary spacing, or inline styles. Color values belong in `docs/design-system/tokens.json`.
- Controls use the 32px compact height unless platform evidence says otherwise. Motion uses CSS transitions and honors `prefers-reduced-motion`.
- Keep prototypes local. No API calls, framework runtime, or new dependencies.
- Storybook is the only preview surface. Do not add app routes, standalone demos, screenshots, or alternate preview shells.
- Run `npm run tokens:build`, `npm run tokens:check`, `npm run ds:check`, and `npm run ds:verify` before review.

## Feedback promotion

- Apply project feedback locally first while the change is still being evaluated.
- Do not promote a feedback change into the shared design system without explicit owner approval.
- An approved shared change must update the component or token, the Storybook `Default / Shared / Button (and the matching component story)` story, and `docs/design-system/CHANGELOG.md` together.
- Treat the Storybook catalog in `vanilla/stories/` as the Public exports approval boundary.
