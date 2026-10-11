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

[Unreleased]: https://github.com/emichaud/smallstack-tabler/compare/v0.23.1-tabler.1...HEAD
[0.23.1-tabler.1]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.3...v0.23.1-tabler.1
[0.10.3]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.2...v0.10.3
[0.10.2]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.1...v0.10.2
[0.10.1]: https://github.com/emichaud/smallstack-tabler/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/emichaud/smallstack-tabler/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/emichaud/smallstack-tabler/compare/v0.8.35...v0.9.2
[0.8.35]: https://github.com/emichaud/smallstack-tabler/compare/v0.8.34...v0.8.35
[0.8.34]: https://github.com/emichaud/smallstack-tabler/releases/tag/v0.8.34
