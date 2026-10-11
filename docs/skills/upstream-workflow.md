# Upstream Workflow — SmallStack Tabler

## Overview

**smallstack-tabler** is a derivative work of [django-smallstack](https://github.com/emichaud/django-smallstack). It replaces the default SmallStack theme with the [Tabler](https://tabler.io) admin UI framework while inheriting all upstream features (Explorer, CRUD views, activity tracking, help system, etc.).

## Repository Structure

| Repo | Purpose | URL |
|------|---------|-----|
| `django-smallstack` | Upstream base project (generic, open-source) | github.com/emichaud/django-smallstack |
| `smallstack-tabler` | Tabler-themed derivative | github.com/emichaud/smallstack-tabler |

## Git Remotes

```
origin    git@github.com:emichaud/smallstack-tabler.git   (tabler — push here)
upstream  https://github.com/emichaud/django-smallstack   (base — pull from here)
```

## Merging Upstream Changes

When upstream releases a new version:

```bash
git fetch upstream main
git log --oneline HEAD..upstream/main   # Review incoming changes
git merge upstream/main                 # Merge
# Resolve conflicts (typically template extends and uv.lock)
uv sync
uv run python manage.py migrate
uv run pytest
git push origin main
```

### Common Conflict Patterns

| File | Resolution |
|------|-----------|
| `templates/website/*.html` | Keep `{% extends "tabler/base.html" %}` (upstream uses `website/base.html`) |
| `uv.lock` | Accept upstream's version, then run `uv lock` to reconcile |
| `config/settings/base.py` | Accept upstream structural changes; tabler-specific settings live in `apps/tabler/` |
| `config/deploy.yml` | Accept upstream docs/comments; keep tabler deploy config |

## Releasing This Downstream

Upstream's `docs/skills/release-process.md` does **not** apply here. It tells you
to bump `pyproject.toml`, `apps/help/smallstack/_config.yaml` and `README.md` —
that is upstream's own process, and following it in this fork produces a version
line that conflicts on every merge. It is merged in from upstream, so it cannot
be corrected in place; this section is the downstream process.

### Versioning scheme

`pyproject.toml` tracks the **upstream** version. It is inherited through merges
and is never bumped here. Releases of this fork are tagged:

```
vX.Y.Z-tabler.N
```

- `X.Y.Z` — the upstream SmallStack release this build carries
- `N` — the build of this downstream on top of it, counting from 1

| Situation | Next tag |
|-----------|----------|
| Merged upstream v0.24.0 | `v0.24.0-tabler.1` |
| Tabler-only fix on upstream 0.23.1 | `v0.23.1-tabler.2` |

Two things fall out of this: the tag namespace never collides with upstream's
(which also runs `vX.Y.Z`), and the `version =` line in `pyproject.toml` is
never a conflict, because only upstream ever changes it.

Tags up to and including `v0.10.3` predate this scheme and reused the bare
`vX.Y.Z` form. They are ambiguous with upstream's tags of the same name — keep
them for history, don't extend the pattern.

### Release steps

```bash
# 1. Merge upstream and verify (see "Merging Upstream Changes" above).
#    Do not report a release green until all four are clean:
uv run pytest                   # addopts pins --ds=config.settings.test
make lint                       # ruff + mypy
uv run python manage.py check
uv run python manage.py api_doctor

# 2. Add the entry to CHANGELOG-tabler.md -- NOT CHANGELOG.md.
#    CHANGELOG.md is upstream's and is overwritten on every merge.
#    Record the upstream version this build carries, the downstream
#    changes, and the merge adaptations.

# 3. Commit, then tag the release commit.
git tag -a v0.23.1-tabler.1 -F - <<'NOTES'
<summary line>

<what upstream brought, what the Tabler side changed, verification>
NOTES

# 4. Push the branch, then the ONE tag.
git push origin main
git push origin refs/tags/v0.23.1-tabler.1
```

> **Never `git push --tags` from this repo.** This clone accumulates upstream's
> tags through fetches (`v0.13.x`, `v0.14.x`, …). `--tags` pushes them into the
> fork's namespace, where they look like downstream releases and are then
> indistinguishable from the pre-`v0.10.3` ones that genuinely are. Push the
> single ref by name.

To tell a real downstream tag from an inherited upstream one:

```bash
git merge-base --is-ancestor <tag> upstream/main && echo upstream || echo tabler
```

### GitHub release

```bash
gh release create v0.23.1-tabler.1 --repo emichaud/smallstack-tabler \
  --verify-tag --title "v0.23.1-tabler.1 — Tabler build of upstream v0.23.1" \
  --notes-file <notes>
```

`--verify-tag` fails rather than creating a tag, so the release can only point
at the tag you already pushed and reviewed.

## What Lives Where

- **Upstream (django-smallstack)**: Core apps, base templates, settings, Explorer, CRUD framework, help system, activity tracking, deployment scaffolding
- **Tabler (this repo)**: `apps/tabler/` (theme app), Tabler template overrides, `tabler_overrides.css`, `tabler_theme.js`, preview app, tabler-specific deploy config

## Rules

1. **Never push tabler-specific commits to upstream.** Upstream stays generic.
2. **Generic fixes go upstream first.** If you find a bug that isn't theme-specific, fix it in django-smallstack, release, then merge into tabler.
3. **Template overrides live in `apps/tabler/templates/`.** The tabler app is first in `INSTALLED_APPS` so its templates take priority.
4. **Keep merges frequent.** Small, regular merges are easier to resolve than large catch-up merges.
5. **Downstream changelog entries go in `CHANGELOG-tabler.md`.** `CHANGELOG.md` is upstream's file and is overwritten on every merge — anything written there is lost or conflicts.
6. **Never bump `pyproject.toml`'s version here, and never `git push --tags`.** See "Releasing This Downstream" above.
