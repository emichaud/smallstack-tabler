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

## What Lives Where

- **Upstream (django-smallstack)**: Core apps, base templates, settings, Explorer, CRUD framework, help system, activity tracking, deployment scaffolding
- **Tabler (this repo)**: `apps/tabler/` (theme app), Tabler template overrides, `tabler_overrides.css`, `tabler_theme.js`, preview app, tabler-specific deploy config

## Rules

1. **Never push tabler-specific commits to upstream.** Upstream stays generic.
2. **Generic fixes go upstream first.** If you find a bug that isn't theme-specific, fix it in django-smallstack, release, then merge into tabler.
3. **Template overrides live in `apps/tabler/templates/`.** The tabler app is first in `INSTALLED_APPS` so its templates take priority.
4. **Keep merges frequent.** Small, regular merges are easier to resolve than large catch-up merges.
