# Merge Issues: SmallStack v0.7.1 into smallstack-tabler

**Date**: 2026-03-08
**Upstream**: `github.com/emichaud/django-smallstack` v0.7.1 (commit `d21bb96`)
**Downstream**: `smallstack-tabler` (Tabler dark admin theme project)

---

## Conflict Summary

Only one conflict occurred during `git merge origin/main`:

| File | Type | Resolution |
|------|------|------------|
| `uv.lock` | Content conflict | Took upstream version, ran `uv sync --all-extras` |

`config/settings/base.py` auto-merged cleanly — our one-line addition
(`apps.preview` in `INSTALLED_APPS`) and upstream's changes
(`BACKUP_DOWNLOAD_ENABLED`, formatting) were in different sections.

---

## Issue 1: CDN vs Vendor Contradiction

**Severity**: Minor (guidance mismatch, not a breakage)

The new v0.7.1 theming docs explicitly say:

> Vendor framework CSS/JS locally in `static/css/` and `static/js/` — avoid CDNs.
> — `docs/skills/theming-system.md:357`

Our `smallstack-tabler` project loads everything via CDN:
- Tabler CSS/JS from `cdn.jsdelivr.net/npm/@tabler/core@1.2.0`
- Chart.js from `cdn.jsdelivr.net/npm/chart.js@4.4.7`
- Inter font from `fonts.googleapis.com`

**Impact**: Not broken, but inconsistent with upstream guidance.

**Recommendation**: Either:
- (a) Vendor the assets locally to match upstream convention, or
- (b) Update upstream docs to say "Vendor locally for production; CDN is acceptable for prototyping and development" — this is more realistic and what most teams actually do

---

## Issue 2: Parallel Theme Path Convention

**Severity**: Minor (naming mismatch)

The new v0.7.1 docs recommend putting parallel theme bases in `templates/website/`:

> Create `templates/website/base_<framework>.html`
> — `docs/skills/theming-system.md:348`

Our project uses `templates/tabler/base.html` — a dedicated directory rather
than a file inside `website/`. Both work, but a new developer reading the docs
and then looking at this project would see two different conventions.

**Recommendation**: The docs could acknowledge both patterns:
- `templates/website/base_tabler.html` — simple, single-file themes
- `templates/<theme>/base.html` + `templates/<theme>/includes/` — themes with their own partials (navbar, footer, etc.)

The dedicated directory approach scales better when a theme has multiple includes.

---

## Issue 3: Documentation Hierarchy Still Unclear

**Severity**: Minor (not new to v0.7.1, but still unresolved)

Theming documentation now exists in four places with overlapping content:
1. `docs/theming.md` — original theming guide
2. `docs/skills/theming-system.md` — AI skills version (most detailed)
3. `apps/help/smallstack/theming.md` — in-app help (user-facing)
4. `README.md` — brief mention

All three doc files now have a "Creating a Parallel Theme" section, but with
slightly different wording and detail levels. No guidance on which is the
canonical source.

**Recommendation**: Add a note to `README.md`:

```markdown
## Documentation

| Location | Audience | Update frequency |
|----------|----------|-----------------|
| `README.md` | New developers | Quick start only |
| `docs/skills/` | AI agents + developers | Canonical technical reference |
| `apps/help/smallstack/` | End users (in-app) | User-facing guides |
```

---

## Issue 4: `staticfiles/` Warning During Tests

**Severity**: Cosmetic (61 warnings, no failures)

Every test emits:
```
UserWarning: No directory at: .../smallstack-tabler/staticfiles/
```

This happens because WhiteNoise expects `STATIC_ROOT` (`staticfiles/`) to exist
but `collectstatic` hasn't been run. Not new to v0.7.1 — existed before — but
the warning count increased from ~30 to 61 with the new test coverage.

**Recommendation**: Either:
- Add `mkdir -p staticfiles` to `make setup`, or
- Suppress the warning in `config/settings/test.py`

---

## Issue 5: `create_dev_superuser` Password in `.env.example`

**Severity**: Minor (confusing default)

The new `.env.example` has:
```env
DEV_SUPERUSER_PASSWORD=change-me-for-dev
```

But `make setup` creates the superuser with password `admin` (hardcoded in the
management command), not `change-me-for-dev`. The `.env.example` implies the
variable controls the password, but the management command may or may not read it.

**Recommendation**: Verify `create_dev_superuser` actually reads
`DEV_SUPERUSER_PASSWORD` from the environment. If it doesn't, either:
- Make it read the env var, or
- Remove/comment the line from `.env.example` to avoid confusion

---

## Post-Merge Verification

| Check | Result |
|-------|--------|
| `python manage.py migrate` | 3 new migrations applied (smallstack 0002-0004) |
| `python manage.py check` | No issues |
| `pytest` | 108 passed, 0 failed |
| Home page renders | Confirmed (Tabler dark theme intact) |
| Preview app renders | Confirmed |
| SmallStack default pages | Confirmed (help, profile, admin all work) |

---

## Files Changed by Upstream (Notable)

New files that may be useful for this project:
- `docs/skills/development-workflow.md` — branching, testing, commit style
- `docs/skills/release-process.md` — versioning, release checklist
- `docs/skills/integration-workflow.md` — pulling upstream into downstream
- `apps/smallstack/management/commands/screenshot_auth.py` — authenticated screenshots

New setting:
- `BACKUP_DOWNLOAD_ENABLED` (default `True`) — controls backup file downloads
