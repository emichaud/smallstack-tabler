# Upstream Documentation Fixes Plan

Proposed changes to `smallstack/` (the base repo) based on issues found
during the `smallstack-tabler` project setup.

---

## Priority 1: Blocking Issues

### 1A. Fix the `.env` onboarding flow

**Problem**: README step 2 says `cp .env.example .env` but the file doesn't exist.
Setup works without it, making the step confusing and unnecessary.

**Proposed changes**:
- [ ] Create `.env.example` with all configurable settings, commented with defaults:
  ```env
  # SECRET_KEY=          # Auto-generated in dev, set explicitly in production
  # DEBUG=True
  # SITE_NAME=SmallStack
  # BRAND_NAME=SmallStack
  # SMALLSTACK_COLOR_PALETTE=django
  # SMALLSTACK_SIDEBAR_ENABLED=True
  # SMALLSTACK_LOGIN_ENABLED=True
  # ...
  ```
- [ ] Update README step 2 to say:
  > **Optionally configure environment:**
  > ```bash
  > cp .env.example .env
  > # Edit .env to customize — all settings have sensible defaults
  > ```
- [ ] Add `.env` to `.gitignore` if not already there

**Files touched**: `.env.example` (new), `README.md`, `.gitignore`

---

### 1B. Add "Creating a New Theme" documentation

**Problem**: Docs cover color customization and CSS framework swapping, but not
how to create a parallel theme that coexists with the default. This is the most
common real-world use case.

**Proposed changes**:
- [ ] Add new section to `docs/theming.md` after "Swapping to a Different CSS Framework":

  ```markdown
  ## Creating a New Theme

  SmallStack supports multiple themes as parallel base templates. Each theme
  is a self-contained set of templates and static assets.

  ### Directory Structure
  templates/<theme>/
  ├── base.html              # Theme's master layout
  └── includes/
      ├── navbar.html        # Theme-specific navigation
      └── footer.html        # Theme-specific footer

  static/<theme>/
  └── css/
      └── overrides.css      # Theme-specific styles

  ### Step 1: Create the base template
  (example of a minimal base.html loading a CSS framework via CDN)

  ### Step 2: Add static assets
  (note that static/<theme>/ is automatically available)

  ### Step 3: Use the theme
  (show {% extends "<theme>/base.html" %} pattern)

  ### Coexistence
  Both themes work simultaneously — different pages can extend different
  base templates. SmallStack core pages (help, profile, admin) continue
  using the default theme.
  ```

- [ ] Add corresponding section to `docs/skills/theming-system.md`
- [ ] Add a brief mention in the in-app help content if it covers theming

**Files touched**: `docs/theming.md`, `docs/skills/theming-system.md`

---

## Priority 2: Quick Wins

### 2A. Document default superuser credentials

**Problem**: `make setup` creates `admin/admin` but credentials aren't mentioned
anywhere a new developer would see them.

**Proposed changes**:
- [ ] Add to README after the `make setup` step:
  > This creates a development superuser (`admin` / `admin`).
  > **Do not use these credentials in production.**
- [ ] Optionally: have `create_dev_superuser` print the credentials to stdout
  (check if it already does — it printed "Successfully created development
  superuser: admin" but not the password)

**Files touched**: `README.md`, optionally `apps/accounts/management/commands/create_dev_superuser.py`

---

### 2B. Update Docker Compose syntax

**Problem**: `docker-compose` (V1, hyphenated) is deprecated. Modern Docker uses
`docker compose` (V2, space).

**Proposed changes**:
- [ ] Update `README.md`: `docker compose up -d`
- [ ] Update `Makefile` docker targets:
  ```makefile
  docker-up:
  	docker compose up -d --build

  docker-down:
  	docker compose down
  ```
- [ ] Update `docs/docker_deployment.md` if it uses V1 syntax

**Files touched**: `README.md`, `Makefile`, `docs/docker_deployment.md`

---

### 2C. Add `docs/skills/README.md`

**Problem**: The `docs/skills/` directory has no explanation of what it is or
who it's for. It's clearly for AI coding assistants but a human browsing the
repo wouldn't know.

**Proposed changes**:
- [ ] Create `docs/skills/README.md`:
  ```markdown
  # AI Skills Documentation

  These files are structured reference docs designed for AI coding
  assistants (Claude Code, GitHub Copilot, etc.) and human developers.

  Each file covers a specific subsystem with enough detail for an AI
  to make correct changes without prior context. They follow a
  consistent format: overview, file locations, patterns, examples.

  ## Available Skills
  - `django-apps.md` — Creating new Django apps
  - `theming-system.md` — CSS variables, dark mode, palettes
  - `templates.md` — Template inheritance and blocks
  - `authentication.md` — Auth patterns and mixins
  - `help-documentation.md` — Help/docs system
  - `screenshot-workflow.md` — Visual verification with shot-scraper
  ```

**Files touched**: `docs/skills/README.md` (new)

---

## Priority 3: Structural Improvements

### 3A. Document the documentation hierarchy

**Problem**: Docs exist in three places (README, `docs/`, `/help/`) with
overlapping coverage and no explanation of which is canonical.

**Proposed changes**:
- [ ] Add a section to README:
  ```markdown
  ## Documentation

  | Location | Audience | Purpose |
  |----------|----------|---------|
  | `README.md` | New developers | Quick start, project overview |
  | `docs/` | Developers + AI | Detailed technical reference |
  | `/help/` (in-app) | End users | Usage guides, visible at runtime |
  ```

**Files touched**: `README.md`

---

### 3B. Downstream-friendly palette extension

**Problem**: Adding a color palette requires editing 4 files in SmallStack core,
which creates merge conflicts for derived projects.

**Proposed changes** (two options, pick one):

**Option A: Document the limitation**
- [ ] Add a note to `docs/skills/theming-system.md`:
  > **For derived projects**: Palette additions modify core files. Consider
  > contributing new palettes upstream, or use the CSS override approach
  > (add `html[data-palette="X"]` rules in your project's CSS) for
  > project-specific palettes.

**Option B: Add a registration hook** (more work)
- [ ] Allow `palettes.yaml` to be extended via a project-level file
- [ ] Allow `PALETTE_CHOICES` to be configured via settings
- [ ] This is a code change, not just docs — scope it separately if desired

**Recommended**: Option A for now, Option B as a future enhancement.

**Files touched**: `docs/skills/theming-system.md`

---

## Implementation Order

1. **1A** (.env.example) — 10 min, immediate clarity improvement
2. **2A** (superuser credentials) — 5 min, one-line README edit
3. **2B** (docker compose syntax) — 5 min, find-and-replace
4. **1B** (new theme docs) — 30 min, biggest content addition
5. **2C** (skills README) — 10 min, new file
6. **3A** (doc hierarchy) — 5 min, small README table
7. **3B** (palette extension) — 5 min for Option A, larger scope for Option B

**Total estimated effort**: ~1 hour for all Priority 1 + 2 items.

---

## Open Questions

- Should the theming docs include a concrete example (e.g., "Adding Bootstrap"
  or "Adding Tabler") as a worked tutorial, or keep it generic?
- Should `create_dev_superuser` print the password to stdout, or is that a
  security concern even in dev?
- Is there appetite for Option B on palette extension, or is documenting the
  limitation sufficient for now?
