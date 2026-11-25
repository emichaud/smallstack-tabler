# Changelog — Tabler downstream

All notable changes **made in this repository** are documented here.

This is the Tabler-themed downstream of
[django-smallstack](https://github.com/emichaud/django-smallstack). Changes
inherited from upstream are documented in that project's changelog, a copy of
which is merged into this repo as [`CHANGELOG.md`](CHANGELOG.md) — do not add
downstream entries there, it is overwritten on every upstream merge. This file
covers only what this fork adds: the Tabler chrome (`apps/tabler/`), the
Tabler skill set, and the adaptations each upstream merge needs.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## Versioning

`pyproject.toml` tracks the **upstream** version — it is inherited through
merges and is not bumped here. Releases of this downstream are tagged
`vX.Y.Z-tabler.N`:

- `X.Y.Z` — the upstream SmallStack release this build carries
- `N` — the build of this downstream on top of it, counting from 1

So `v0.23.1-tabler.2` would be a Tabler-only fix on upstream 0.23.1, and
`v0.24.0-tabler.1` the first build after merging upstream 0.24.0. Upstream and
this fork therefore never collide in the tag namespace, and the version line in
`pyproject.toml` never conflicts on a merge.

Releases up to and including `v0.10.3` predate this scheme and reused the bare
`vX.Y.Z` form; those tags are ambiguous with upstream's own tags of the same
name and are kept only for history.

## [Unreleased]

## [0.33.2-tabler.1] - 2026-11-24

Carries upstream **v0.33.2**: directory-managed groups set on the Access
pages, multi-select pickers and a New group dialog, the single sign-on help,
native controls following the dark theme, and access guidance that starts
from user, staff and admin. See [`CHANGELOG.md`](CHANGELOG.md).

### Notes
- Clean merge, no conflicts, no overridden template changed upstream. One
  Access migration applies on `make migrate`.
- Upstream's `color-scheme` declaration was not ported: Tabler's own CSS
  already declares it for both modes, so native checkboxes, selects and date
  pickers follow the theme here already (checked on the group pages).

## [0.33.1-tabler.1] - 2026-11-24

Carries upstream **v0.33.1**, up from v0.32.2: access reviews (attestation),
the audit evidence pack with stored packs, the opt-in review cadence,
directory-managed groups for SSO, groups managed on the Access pages without
Django admin, and session writes to the REST API now needing the CSRF token.
See [`CHANGELOG.md`](CHANGELOG.md) and [`UPGRADING.md`](UPGRADING.md).

### Changed
- `AGENTS.md` takes upstream's reworked access-control row and the new
  `directory-sso.md` row, keeping this fork's upstream-workflow row.
- `tabler_overrides.css`: ported the `widget-status-ok/warning/error`
  dashboard-widget colours (v0.33.1) and the `.filter-toggles` pills the
  Access evidence page and Activity use.

### Notes
- No Tabler template override changed upstream in this range; two Access
  migrations apply on `make migrate` (reviews, evidence bundles, the *Access
  attester* group). The CSP stopgap from 0.32.2-tabler.1 is unchanged.

## [0.32.2-tabler.1] - 2026-11-22

Carries upstream **v0.32.2**, up from v0.29.0: the Access app (groups in code,
every access change recorded, the least-privilege review), the access-control
audit's permission fixes, dashboards (metrics, grids, reports, goals, playlists,
app-shipped defaults), help bubbles, CRUDView model permissions + audit + delete
previews, the showcase app, and a CSP with no `'unsafe-inline'`. See
[`CHANGELOG.md`](CHANGELOG.md) and [`UPGRADING.md`](UPGRADING.md) for those.

### Changed
- **The Tabler shell loads upstream's behaviour layer.** Upstream removed every
  inline handler from its templates (v0.30.0): buttons are `data-ss-action` /
  `data-confirm` / `data-stat-modal` attributes that `smallstack/js/theme.js`
  carries out. `tabler/base.html` now loads `config.js` + `theme.js`, so the
  delete modal, bulk bar, cookie banner, help bubbles and copy buttons work in
  45 upstream templates that render inside Tabler chrome. `config.js` says
  `data-authenticated="false"` on purpose: `tabler_theme.js` keeps owning the
  theme and its profile sync, where theme.js would re-POST on every page load.
- **`base.html` carries no inline `<script>`.** The two first-paint blocks and
  the Bootstrap alias moved to `tabler/js/tabler_init.js`,
  `tabler_body_init.js` and `bootstrap_alias.js`. The head also loads upstream's
  `theme-init.js`, and both first-paint scripts read the profile's theme first
  (profile → this browser → dark, the order upstream's tests hold a shell to),
  so a new browser opens in the saved theme. `tabler_theme.js` mirrors the mode
  to `data-theme`, which upstream's per-page CSS keys its dark rules on.
- **The stat modal is upstream's.** The Bootstrap-modal override of
  `stat_modal.html` is gone; `{% smallstack_modal %}` in the shell renders
  upstream's markup once per page, styled by the `.stat-modal` port in
  `tabler_overrides.css` (now with the `narrow` and `reading` sizes). The three
  hand `{% include %}`s of it were removed.
- **CRUD overrides catch up with upstream's templates:** the list page renders
  `list_accessories_html`, the framework toolbar, the bulk bar and modals, and
  the display-palette script; the detail page has the History link, the delete
  button through the modal, `related_tabs.html` and the delete modal; the
  confirmation page shows what a delete takes with it and no Delete button when
  it is blocked.
- **Navbar:** pages apps register for signed-in users (nav section `main`:
  Calendar, Dashboards ▾, Goals ▾, My blogs) render in the navbar, a dropdown for
  an item with children; "My dashboards" joins the user menu (`#user-dropdown`);
  showcase links reverse quietly so `apps/showcase` can be deleted; the brand is
  a `<div>`, so a page's own `<h1>` is its first.
- **User Manager:** the Invite User button is back on the list, gated on
  `add_user` like Add User; the Timezones page uses upstream's static JS and
  shows the Staff filter and the Users crumb only to `view_user` holders.
- **`tabler_overrides.css`:** ported the v0.30–v0.32 `components.css` rules the
  shell needs (help bubbles, `.title-with-help`, the stat-list rows, modal
  sizes, `.md-table`, `.view-bar`, page tabs, the Activity resource pages,
  `.crud-delete-summary`) and the `--transition-*` aliases.
- The settings panel's reset button reads "Restore defaults" (upstream's tests
  assert "Reset to default" is absent from a page).
- `AGENTS.md` keeps the Tabler framing, takes upstream's Access row and adds the
  inline-JavaScript anti-pattern. `apps/website/` keeps only `home` and this
  fork's `changelog` page; the demo pages are upstream's `apps/showcase/`.

### Known debt
- `CONTENT_SECURITY_POLICY["script-src"]` keeps `'unsafe-inline'` (+
  `cdn.jsdelivr.net` for Tabler): 16 templates under `apps/tabler/templates/`
  still carry inline `<script>` blocks. Move them to `static/` and drop the
  stopgap; the pattern is `docs/skills/templates.md`.

## [0.29.0-tabler.1] - 2026-11-02

Carries upstream **v0.29.0**, up from v0.23.1: blogs and newsletters, the
calendar app, bundled datasets, activity drilldowns, resizable table columns
and agent discovery. See [`CHANGELOG.md`](CHANGELOG.md) for those features.

### Changed
- **`AGENTS.md` now holds this fork's orientation.** Upstream moved its agent
  guidance there, pointing at the modern-dark theme, so the Tabler guidance was
  merged three-way with upstream's text. `CLAUDE.md` takes upstream's thin
  `@AGENTS.md` shape.
- **Fork skills are registered in `docs/skills/local.md`**, upstream's registry
  for forks, so those rows no longer conflict on a merge. `README.md` is
  upstream's plus a Tabler note and "not used here" labels on
  `modern-dark-theme.md` and `modify-palettes.md`.
- **Activity pages use upstream's templates.** All 13 overrides in
  `apps/tabler/templates/activity/` were removed: upstream rewrote the views and
  templates, and the overrides hid the drilldowns and the window picker.
- `upstream-workflow.md` gains the new conflict rules and a post-merge check for
  stale template overrides and unported `components.css` rules.

### Added
- "My blogs" in the navbar user menu, a Blogs card on the profile page, and the
  markdown alternate and `llms.txt` links on help pages, in their Tabler templates.
- `tabler_overrides.css`: upstream's new `components.css` rules (column resize,
  wrap mode, activity drilldowns), the `--series-*` colours, and aliases for the
  variables the blog and calendar styles use.
- `tabler/base.html` loads `table-resize.js`.

### Fixed
- The Tabler CRUD list template had no `#crud-list-content`, the target of the
  sort buttons in `table.html`.
- The calendar Events page showed the display palette twice.

### Upstream merges adapted
- **v0.29.0** (this release) — conflicts in `CLAUDE.md`, `sortable_th.html`,
  `crud_tags.py`, `docs/skills/README.md` and `docs/skills/index.json`. Took
  upstream's `sortable_th` markup and its `th-right` class, and regenerated the
  skill index. Three blog tests now assert on `<option value=…>`, because a bare
  `value="2"` also matched a radius radio in the Tabler settings panel.

### Known gaps
- Public blog pages (`/blog/`) use upstream's standalone theme, not Tabler.
- The Tabler CRUD list template has no filter toolbar or bulk-action bar.
- The activity header buttons lose their border in light mode.

### Verified at this release
3601 passed / 11 skipped under `config.settings.test`; `ruff` and `mypy` clean
across 433 source files; `manage.py check` clean; `api_doctor` 11 ✓ / 0 ⚠ / 0 ✗;
`mcp_doctor` 6 ✓ / 0 ⚠ / 0 ✗.

## [0.23.1-tabler.1] - 2026-10-11

Carries upstream **v0.23.1**. First tagged Tabler build since `v0.10.3`
(2026-06-20), so this entry covers four months of downstream work.

### Changed
- **Admin pages normalized against native Tabler chrome.** Page CTAs are real
  buttons, stat tiles share one treatment, and breadcrumbs are consistent
  across admin pages.
- **`page-header-bleed` now matches the native Tabler header.** The ported
  upstream layout class had drifted from the header Tabler actually renders;
  it is now normalized to it rather than approximating it.
- Form action buttons restyled, and sortable table headers given a hover cue.
- Runbook dashboard styled for Tabler — stat cards, modal, buttons.
- Dev `SITE_DOMAIN` points at `localhost:8007`, this project's port.

### Fixed
- **Tabler v1.4 upgrade regressions** in the dashboard, code pills, modals and
  copy buttons.
- **SmallStack component styles missing under Tabler chrome** ported into
  `tabler_overrides.css`, then a second pass for the remaining CRUD and
  explorer styles plus activity-table polish. Upstream templates reference
  SmallStack vars (`var(--primary)`, `var(--card-bg)`); the overrides alias
  them onto their `--tblr-*` equivalents.
- Profile edit: the timezone dropdown rendered empty, and the time preview was
  mis-aligned.
- `.btn-cancel` inherited raw `<button>` chrome and was unreadable in dark mode.
- Runbook nav registered under `admin` so it appears in the apps grid.

### Upstream merges adapted
- **v0.23.1** (this release) — conflict in `docs/skills/index.json`: took
  upstream's rewritten `background-tasks` entry in this repo's inline-keyword
  style; the 20 `tabler-*` skill entries were preserved. Only one template
  changed downstream (`form_scheduler.html`, a new "Retries on failure" field
  using already-ported `crud-*` classes).
- **v0.21.3** and **v0.16.2** — downstream adaptation commits.

### Verified at this release
2814 passed / 11 skipped under `config.settings.test`; `ruff` and `mypy` clean
across 372 source files; `manage.py check` clean; `api_doctor` 11 ✓ / 0 ⚠ / 0 ✗.

---

Releases below predate the `-tabler.N` scheme.

## [0.10.3] - 2026-06-20

### Fixed
- Dropdown and modal transparency regression introduced in 0.10.2.

## [0.10.2] - 2026-06-20

### Fixed
- Dark-mode vibrancy restored after the Tabler 1.4 upgrade.

## [0.10.1] - 2026-06-20

### Changed
- Chrome aligned to **Tabler 1.4.0**, up from 1.0.0-beta20.

## [0.10.0] - 2026-06-17

### Changed
- Root `CLAUDE.md` rewritten to be Tabler-aware for the upstream v0.10.0 merge —
  routes page work to the Tabler skill set and marks `modern-dark-theme.md` and
  `modify-palettes.md` as not applying to this downstream.

## [0.9.2] - 2026-06-15

### Changed
- Tabler theme adjustments for upstream v0.9.2 — MCP and tokenmgr page support.

## [0.8.35] - 2026-06-09

### Added
- The **Tabler UI skill set** (`docs/skills/tabler/*.md` behind the
  `tabler-ui.md` router): foundations, theming, layouts, components, forms,
  tables, charts, page recipes, htmx patterns, customization, troubleshooting.

## [0.8.34] - 2026-05-11

### Added
- `docs/skills/upstream-workflow.md` — how to merge upstream `django-smallstack`
  without losing the Tabler customizations.

[Unreleased]: https://github.com/emichaud/smallstack-tabler/compare/v0.29.0-tabler.1...HEAD
[0.29.0-tabler.1]: https://github.com/emichaud/smallstack-tabler/compare/v0.23.1-tabler.1...v0.29.0-tabler.1
[0.23.1-tabler.1]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.3...v0.23.1-tabler.1
[0.10.3]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.2...v0.10.3
[0.10.2]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.1...v0.10.2
[0.10.1]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/emichaud/smallstack-tabler/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/emichaud/smallstack-tabler/compare/v0.8.35...v0.9.2
[0.8.35]: https://github.com/emichaud/smallstack-tabler/compare/v0.8.34...v0.8.35
[0.8.34]: https://github.com/emichaud/smallstack-tabler/releases/tag/v0.8.34
