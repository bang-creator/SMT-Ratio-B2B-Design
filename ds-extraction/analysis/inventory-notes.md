# E0 inventory evidence

- Entry capture: `raw/rea/home-inspect.json` (`rea.web-page-inspection`, target `https://platform.openai.com/home`).
- Bundle route analysis: `raw/rea/bundle/home-routes-summary.json` with complete retained evidence in `raw/rea/bundle/home-bundle.json`.
- Browser target discovery: REA CLI against `http://127.0.0.1:9224`; Chrome `157.0.8103.39`; one platform page target observed.
- Sidebar and nested route links were read from the authenticated Home, Agents, and Usage accessibility snapshots.
- Priority 1: Home, Responses, Decisions, Agents/Vault, Audio/Realtime, Usage, Images. These cover dashboard, playground, table-list, and empty/data states.
- `hasDarkMode` remains `unverified` for every route; current browser capture rendered dark, but persistence and explicit theme support were not tested in E0.
- Project-scoped URLs contain the observed session project ID and should be normalized before later extraction.
