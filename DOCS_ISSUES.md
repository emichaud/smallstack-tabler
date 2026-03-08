# SmallStack Documentation Issues

Issues found while setting up the `smallstack-tabler` project, following all
onboarding and theming documentation in the SmallStack repo.

---

## Phase 2: Initial Setup (README.md)

### 1. Missing `.env.example` file
- **File/Section**: README.md → Quick Start → Step 2
- **Severity**: Major
- **Issue**: The README instructs `cp .env.example .env` but no `.env.example` file exists in the repository. Setup works fine without it (due to `python-decouple` defaults), but a new developer would be confused.
- **Suggestion**: Either create a `.env.example` with commented defaults, or remove/update step 2 to say "Optionally create a `.env` file to override defaults."

### 2. `make setup` works without `.env` — undocumented
- **File/Section**: README.md → Quick Start
- **Severity**: Minor
- **Issue**: The `.env` file is listed as a prerequisite step, but `make setup` succeeds without it since all settings have sensible defaults via `python-decouple`. This is actually great — but the docs make it seem required.
- **Suggestion**: Clarify that `.env` is optional for local development. Move the `.env` step to an "Optional Configuration" section.

### 3. Default superuser credentials not documented in README
- **File/Section**: README.md → Quick Start
- **Severity**: Minor
- **Issue**: `make setup` runs `create_dev_superuser` which creates an `admin` user, but the README doesn't mention the username or password. A developer has to check the management command source to find credentials.
- **Suggestion**: Add a note after `make setup`: "This creates a dev superuser: `admin` / `admin` (DO NOT use in production)."

### 4. Docker Compose command uses deprecated syntax
- **File/Section**: README.md → Docker Deployment
- **Severity**: Minor
- **Issue**: Uses `docker-compose up -d` (V1 syntax). Modern Docker uses `docker compose up -d` (V2, no hyphen).
- **Suggestion**: Update to `docker compose up -d` or note both variants.

---

## Phase 4: Theming Documentation (docs/theming.md, docs/skills/theming-system.md)

### 5. No documentation on creating a completely new theme
- **File/Section**: docs/theming.md → "Swapping to a Different CSS Framework"
- **Severity**: Major
- **Issue**: The section on swapping CSS frameworks covers removing current CSS and adding a new framework, but doesn't explain how to create a parallel theme that can coexist with the default. There's no concept of theme directories, theme selection, or multiple base templates. The actual pattern (create a new `templates/<theme>/base.html` and extend from it) works but is undocumented.
- **Suggestion**: Add a "Creating a New Theme" section that explains:
  - Create `templates/<theme>/base.html` as an alternative base
  - Create `static/<theme>/css/` for theme-specific styles
  - Templates extend the new base: `{% extends "theme/base.html" %}`
  - The default SmallStack theme remains available

### 6. Theme docs don't mention CDN loading pattern
- **File/Section**: docs/theming.md → "Swapping to a Different CSS Framework"
- **Severity**: Minor
- **Issue**: Only shows adding local static files. No example of loading a CSS framework via CDN, which is the most common approach for getting started.
- **Suggestion**: Add a CDN example alongside the static file example.

### 7. Palette system docs assume modifying upstream files
- **File/Section**: docs/skills/theming-system.md → "Adding a New Palette"
- **Severity**: Minor
- **Issue**: Adding a palette requires editing `palettes.yaml`, `palettes.css`, `models.py`, and `views.py` — all in the SmallStack core (`apps/smallstack/` and `apps/profile/`). For derived projects, this creates merge conflicts with upstream. No guidance on how to extend palettes from a downstream project.
- **Suggestion**: Document a pattern for downstream palette extension, or note that palette additions should be contributed upstream.

### 8. No mention of `STATICFILES_DIRS` for new theme assets
- **File/Section**: docs/theming.md
- **Severity**: Minor
- **Issue**: When adding theme-specific static files in `static/<theme>/`, it works because `STATICFILES_DIRS` includes the whole `static/` directory. But this isn't explained, and a developer might wonder if they need to register their theme's static directory separately.
- **Suggestion**: Add a note: "Static files in `static/` are automatically available. Create `static/<theme>/css/` for your theme-specific styles."

---

## General Documentation Quality

### 9. In-app help vs. repo docs overlap
- **File/Section**: README.md, docs/, /help/ app
- **Severity**: Minor
- **Issue**: Documentation exists in three places: README.md, `docs/` directory, and the in-app `/help/` system. Some topics are covered differently in each. The README points to `/help/` but `docs/` has the most detailed theming info.
- **Suggestion**: Add a note in README clarifying the documentation hierarchy: README for quickstart, `docs/` for AI/developer skills, `/help/` for in-app user guidance.

### 10. `docs/skills/` purpose not explained
- **File/Section**: docs/skills/
- **Severity**: Minor
- **Issue**: The `docs/skills/` directory contains detailed reference docs labeled as "AI assistant skill files" but there's no README or explanation of what these are, how they're used, or who they're for.
- **Suggestion**: Add a brief `docs/skills/README.md` explaining these are structured reference docs for AI coding assistants (Claude, Copilot, etc.) and human developers alike.
