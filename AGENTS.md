# AGENTS.md — SmallStack-Tabler

You're a coding agent working inside a Django SmallStack project **with the Tabler UI framework as its theme**. This downstream replaces SmallStack's built-in modern-dark palette system with [Tabler](https://tabler.io) — Bootstrap 5–based admin UI, 5000+ stroke icons, runtime theme switching (dark/light, 11 accents, 5 base palettes, 10 layouts). Use the Tabler skill set for any page work; the upstream `modern-dark-theme.md` does NOT apply here. This is the tool-neutral [AGENTS.md](https://agents.md/) — Claude Code loads it through `CLAUDE.md`, Codex, Cursor, Copilot, Gemini CLI and friends read it directly; the per-topic skills under `docs/skills/` are also installed as Agent Skills in `.agents/skills/` (and `.claude/skills/`).

## Read-first skills

When the user asks you to do any of these, read the matching skill file BEFORE writing code:

| If the user wants to… | Read first |
|---|---|
| **Build any page, component, card, table, modal, badge** | `docs/skills/tabler-ui.md` — router into `docs/skills/tabler/*.md`. **IGNORE `modern-dark-theme.md` and `modify-palettes.md`** — those describe the upstream SmallStack base theme, which this downstream does NOT use |
| Build/edit any page, form, table, modal, or interactive control — make it **accessible** (a11y / WCAG) | `docs/skills/accessibility.md` |
| Change the accent color, dark-mode behavior, or settings panel | `docs/skills/tabler/theming.md` |
| Wire HTMX into Tabler (tab loads, modals, offcanvas, re-init after swap) | `docs/skills/tabler/htmx-patterns.md` |
| Build a dashboard with KPI cards, charts | `docs/skills/tabler/page-dashboards.md` + `docs/skills/tabler/charts.md` |
| Add a form with Flatpickr/Choices/tom-select/Imask/Dropzone/etc. | `docs/skills/tabler/forms.md` |
| Build a sortable / paginated / htmx-driven table | `docs/skills/tabler/tables.md` |
| Run any operational task (diagnose, smoke-test, mint, backup, screenshot, deploy) | `docs/skills/cli-tools.md` |
| Create a new Django app with admin pages | `docs/skills/django-apps.md` |
| Add a CRUDView (model → admin + REST + MCP) | `docs/skills/django-apps.md` + `apps/smallstack/docs/building-crud-pages.md` |
| Add keyword search + an MCP search tool to a model | `docs/skills/search.md` |
| Expose a filtered queryset as typed rows/columns for a dashboard/report/chart UI (`@dataset`) | `docs/skills/datasets.md` |
| Put due dates / expiries / maintenance windows on the shared **calendar** (`@calendar_dataset`, saved views, `.ics`), or drop a calendar onto **your own page or a dashboard** (`{% calendar_card %}`, the `calendar` card) | `docs/skills/calendar.md` |
| Build a **KPI**, a grid **dashboard**, a **KPI report** or a **goal list** over datasets — stored filter trees → values (or have an agent build one via MCP/REST) | `docs/skills/dashboards.md` |
| **Publish a dashboard card type** of your own — a chart over a JS library, a gauge, a table, a navigation card (`register_component_type`) | `docs/skills/card-types.md` |
| **Ship default metrics, dashboards, goal lists or reports with your app**, kept in step without overwriting people's edits (`dashboard_defaults.py`, `register_defaults`) | `docs/skills/app-defaults.md` |
| Add stat cards / metric tiles + drill-down modals to a dashboard page | `docs/skills/dashboard-cards.md` |
| Add a dashboard widget (the central `/smallstack/` dashboard) | `docs/skills/dashboard-widgets.md` |
| Monitor a subsystem's uptime/health on `/smallstack/status/` (Service + Monitor, or a status chart) | `docs/skills/status-monitors.md` |
| Open a maintenance window / SLA-exclude a deploy (`manage.py maintenance`, Kamal hooks) | `docs/skills/status-monitors.md` |
| Test the task queue / heartbeat backend locally (worker + heartbeat harness) | `docs/skills/background-tasks.md` |
| Schedule recurring work (`@scheduled`, cron/interval/once, the scheduler UI + tick) | `docs/skills/scheduler.md` |
| Gate an action on a **human approval** (`@approval_kind`, the decision console, agent-files-human-decides) | `docs/skills/approvals.md` |
| Show a signed-in user an **in-app notification** (topbar bell + inbox, `notify()`) | `docs/skills/notifications.md` |
| **Any integration work** (Zapier/n8n/Slack/Stripe/GitHub/Azure, or SmallStack↔SmallStack) — read this FIRST | `docs/skills/webhooks.md` |
| Notify an external system when a model changes — **outbound webhooks** (`enable_webhooks = True`); shape the payload with `@webhook_transform` | `docs/skills/webhooks.md` |
| Receive/verify an inbound webhook (`@webhook_handler`; provider signatures via `@webhook_verifier`, handshakes via `@webhook_challenge`) | `docs/skills/webhooks.md` |
| **Build a blog or a newsletter** — markdown posts, per-blog feeds, double-opt-in email, runbook→blog publishing | `docs/skills/blog.md` |
| **Publish a blog, podcast or changelog as an RSS/Atom feed** (a curated `Feed` over your own scoped queryset; enclosures via `FeedItem(extra_kwargs=…)`) | `docs/skills/rss.md` |
| **Consume an external RSS/Atom feed** into a model on a schedule (`register_feed_source`, the collector) | `docs/skills/rss.md` |
| Expose a model to AI clients via MCP | `docs/skills/mcp/build-mcp-solution.md` |
| Add a custom REST endpoint (non-CRUD) | `docs/skills/custom-api-endpoints.md` |
| Debug a "Swagger is empty" / "MCP can't see my tools" / "weird traffic" report | `docs/skills/api-doctor.md` or `docs/skills/mcp/debug-mcp-failure.md` |
| Take a screenshot to verify UI work | `docs/skills/screenshot-workflow.md` |
| Set up auth or protect a view | `docs/skills/authentication.md` |
| Pull upstream `django-smallstack` updates into this Tabler downstream | `docs/skills/upstream-workflow.md` |
| Add a **permission check**, declare a **group** an app ships, review **who can do what** (least privilege, audit evidence), run or report on the periodic **access review** (attestation for SOC 2 / PCI), produce the **audit evidence pack**, put the review **on a schedule** (quarterly open + stored pack + reminders/escalation, the `access.review.signed` webhook) | `docs/skills/access-control.md` |
| Put the app behind **Entra / Okta / Google / an auth proxy** so IT assigns groups in the directory — any SSO backend, middleware or claims hook (`directory_role`, `sign_in`, the Entra manifest) | `docs/skills/directory-sso.md` |

The full skill index lives at `docs/skills/README.md`.

## What this project is

A **Tabler-themed downstream** of upstream [django-smallstack](https://github.com/emichaud/django-smallstack). Same backend, MCP server, API admin, token manager, CRUDView library, dashboards — but the UI chrome is Tabler instead of the SmallStack default theme. New pages, components, and customizations should follow Tabler patterns.

Upstream SmallStack supports four kinds of apps from one codebase:

- **Scheduler systems** — `django-tasks-db` is pre-wired; `manage.py db_worker` runs background jobs
- **Websites** — themed admin shell with **Tabler** chrome (dark/light, 11 accents, 5 layouts switchable via settings panel)
- **API servers** — REST emitted from CRUDViews; OpenAPI 3.0.3 schema; Swagger UI at `/api/docs/`; ReDoc at `/api/redoc/`; admin at `/smallstack/api/`
- **MCP servers** — JSON-RPC + OAuth 2.0 + PKCE at `/mcp`; Claude Desktop and Claude.ai Connectors UI work without setup
- **Webhooks** — a foundational integration surface: outbound signed delivery (`enable_webhooks = True`) + inbound receivers (`@webhook_handler`), **four extension seams** (`@webhook_transform`/`@webhook_auth`/`@webhook_verifier`/`@webhook_challenge`) that make Zapier/n8n/Stripe/Slack/Event Grid plug-ins, first-class **SmallStack↔SmallStack** pairing (`sc webhook pair`, loop-safe), stable `event_id` dedupe, `Retry-After` + bulk dead-letter replay; `webhook_doctor`, `sc webhook`

- **Blogs + newsletters** — per-user blog channels of markdown posts (`apps/blog/`): a three-tier visibility ladder (private / members / public), scheduled publishing, per-blog RSS/Atom/JSON feeds, an anonymous JSON read API, and a newsletter with double opt-in and a durable resumable sender. Runbook documents publish into a blog and can stay in sync.

- **Human-in-the-loop approvals** — a generic side-car gate (`apps/approvals/`): apps or AI agents file an `ApprovalRequest` (`@approval_kind` + `request_approval()`), a human decides in the themed console (or the `{% approval_card %}` embed), and the app reacts via per-kind callback, signal, webhook event, or polling. Fan-out to in-app notifications (`apps/notifications/`: topbar bell + inbox) and branded email.

The headline pattern: **one `CRUDView` declaration produces HTML admin pages, REST endpoints, and MCP tools** from a single model. Flip `enable_api = True` / `enable_mcp = True` / `enable_webhooks = True` flags on a CRUDView subclass and the surfaces light up.

## Quick start

```bash
make setup     # uv sync + migrate + create dev superuser (admin/admin)
make run       # dev server on port 8005 (PORT= to change; this project uses 8007)
```

`make setup` is idempotent. Re-run it anytime.

## Project structure

All custom apps in `apps/`, registered as `apps.<name>`:

- `apps/accounts/` — Custom User model, auth views, login/signup
- `apps/smallstack/` — Theme, CRUDView library, navigation, dashboard, displays, APIToken model — the framework core
- `apps/tabler/` — **Tabler theme integration**: bridge `smallstack/base.html`, navbar, settings panel, `tabler_overrides.css` (SmallStack-var aliases, dark/light mode, layout variants, the rules ported from upstream `components.css`), `tabler_theme.js` (settings engine). The shell also loads upstream's `config.js` + `theme.js`, the `data-ss-action` behaviour layer every upstream template relies on
- `apps/preview/` — Tabler preview pages (design reference)
- `apps/activity/` — RequestLog middleware and admin
- `apps/approvals/` — Human-in-the-loop approval gate (`@approval_kind` + decision console) at `/smallstack/approvals/requests/`
- `apps/notifications/` — In-app notifications (topbar bell + inbox) at `/smallstack/notifications/`
- `apps/telemetry/` — DB-backed log capture (`LogRecord`) + the `/smallstack/logs/` staff viewer + time-boxed capture windows; `log_capture` / `prune_logs`
- `apps/api/` — `/smallstack/api/` health + activity admin + `api_doctor` command
- `apps/explorer/` — Generic CRUD browser at `/smallstack/explorer/`
- `apps/heartbeat/` — Uptime monitoring + `/status/`
- `apps/help/` — Markdown docs at `/smallstack/help/`
- `apps/mcp/` — MCP JSON-RPC server + OAuth + `/smallstack/mcp/` admin
- `apps/profile/` — UserProfile + theme/palette preferences
- `apps/tasks/` — Background-task helpers
- `apps/tokenmgr/` — Self-service API token UI at `/smallstack/tokens/`
- `apps/usermanager/` — User CRUD at `/smallstack/manage/users/`
- `apps/access/` — Access: groups declared in code, every access change recorded, the least-privilege findings, periodic access reviews at `/smallstack/access/`
- `apps/webhooks/` — Outbound event delivery (`enable_webhooks`) + inbound receivers (`@webhook_handler`) at `/smallstack/webhooks/`
- `apps/blog/` — Blogs + newsletters (label: `smallstack_blog`); console at `/smallstack/blog/` (lands on the posts list), public reading at `/blog/`
- `apps/calendar/` — Calendar (label: `smallstack_calendar`): datasets with a date axis merged on one grid at `/smallstack/calendar/`, saved views, events + `.ics` API; `{% calendar_card %}` + a `calendar` dashboard card put one on any page
- `apps/dashboards/` — Dashboards (label: `smallstack_dashboards`): Metrics (stored filter trees over datasets → KPI values), grid dashboards, KPI reports, goal lists (targets judged on target / at risk / missed, with a meeting view) at `/smallstack/dashboards/`; `{% metric_card %}`; MCP agent tools
- `apps/website/` — Project-specific pages — **edit freely** (the others are framework-provided)
- `apps/showcase/` — SmallStack's demo pages (about, getting started, prompts, starter, public search) — **don't build on it**; a project deletes it (the directory, its `INSTALLED_APPS` line and its `include()` in `config/urls.py`)

Settings split in `config/settings/`:
- `smallstack.py` — App-level config (branding, feature flags, palette default, MCP/API toggles)
- `base.py` — Django infrastructure
- `development.py` / `production.py` / `test.py` — environment overrides

## Conventions to follow

- **User model**: `settings.AUTH_USER_MODEL`. Never `from django.contrib.auth.models import User`.
- **Protected views**: `LoginRequiredMixin` or `StaffRequiredMixin` (in `apps/smallstack/mixins.py`).
- **URL namespaces**: `app_name = "<id>"` in `urls.py`, reference as `{% url 'id:name' %}`.
- **Signals**: separate `signals.py`, imported in `apps.py:ready()`.
- **Tests**: `apps/<name>/tests/test_*.py`. `pytest.mark.django_db` when DB is touched.
- **Templates**: extend `tabler/base.html` for new pages, or `smallstack/base.html` to inherit through the Tabler bridge. Use `{% load theme_tags %}` for breadcrumbs / nav_active.
- **Types**: prefer strongly typed code where practical — annotate function
  signatures (params + return) on new and edited code; reach for `Any` only
  when the type genuinely can't be expressed. The project typechecks with
  **mypy + django-stubs** over every app (`[tool.mypy]` in `pyproject.toml`;
  migrations/tests excluded, untyped bodies not checked — so annotating a
  function is what opts its body into checking). `make lint` runs ruff, **mypy**,
  and the skill-index check; all three must be green before reporting work done,
  and the pre-commit hook enforces the same gate.
  **The ratchet:** the apps listed under `[[tool.mypy.overrides]]` in
  `pyproject.toml` (access, activity, approvals, blog, calendar, dashboards,
  datasets, feeds, notifications, runbook, scheduler, showcase, webhooks; the
  list there is authoritative) are fully annotated and checked strictly — an
  unannotated function there fails lint. New apps start on that list. Run
  `make typecheck-strict` to see what the lenient global config hides and to
  find the next app to add; never remove one.
  **Downstream:** a project built on SmallStack must carry the `[tool.mypy]`
  block and run `uv run mypy` in its lint target, or its own code drifts
  silently — clones from before v0.9 never had the gate.
- **New skill file**: add a row to `local.md` beside the skills README (this fork's own
  registry, so it never conflicts with upstream's `docs/skills/README.md`) and run
  `make skills-index` (those two tables are the source of truth; `index.json` is
  generated from them). `make lint` fails on an unregistered skill file — the
  index agents consult must never be a subset of what's on disk.

## Theming — Tabler, not modern-dark

This project's UI chrome is **Tabler v1.4.0**, loaded from a CDN by `apps/tabler/templates/tabler/base.html` (CSS, JS, and `tabler-themes.min.css` for full accent-color cascade), plus rsms.me variable Inter for glyph parity with `preview.tabler.io`. Local customizations live in:

- `apps/tabler/static/tabler/css/tabler_overrides.css` — dark mode, accent colors, layout variants, and **SmallStack-var aliases** so upstream templates that reference `var(--primary)`, `var(--card-bg)`, `var(--body-fg)`, etc. render correctly inside Tabler chrome
- `apps/tabler/static/tabler/js/tabler_theme.js` — the runtime settings engine (theme/color/font/base/radius/layout, persisted to localStorage and to the user's profile)

**Theming the right way:**
- Extend `tabler/base.html` (or `smallstack/base.html`, which bridges to Tabler)
- Use Tabler component classes (`.card`, `.btn-primary`, `.row-deck row-cards`, `.badge bg-green-lt`)
- Use the `--tblr-*` CSS variables (`var(--tblr-primary)`, `var(--tblr-card-bg)`, `var(--tblr-body-color)`, `var(--tblr-muted)`, `var(--tblr-border-color)`)
- Or use the SmallStack-style aliases (`var(--primary)`, `var(--card-bg)`, `var(--body-fg)`) — they map to the Tabler equivalents in both light and dark modes
- For new layout/form classes used by upstream templates, ports live in `tabler_overrides.css` (`.page-header-bleed`, `.crud-form`, `.list-toolbar`)

**Read `docs/skills/tabler-ui.md` before writing a new page.** It's a thin router that points you to the specific skill (foundations, components, charts, forms, tables, dashboards, htmx-patterns, etc.) for what you're building. The upstream `modern-dark-theme.md` and `modify-palettes.md` describe the SmallStack base theme — they are NOT in use here.

## Tools you'll reach for

All `manage.py` commands run as `uv run python manage.py <name>`. The full reference is `apps/smallstack/docs/cli-reference.md`; the agent's decision tree is `docs/skills/cli-tools.md`.

Most-used:

```bash
make run                                         # dev server (port 8005 / set PORT for 8007)
make test                                        # full pytest suite
make lint                                        # ruff + mypy + skill-index check (the full static gate)
make lint-fix                                    # ruff check --fix
make typecheck                                   # mypy alone
make migrate                                     # apply migrations
make migrations                                  # create new ones
make skills-index                                # rebuild docs/skills/index.json from its README
make backup                                      # SQLite snapshot with retention
uv run python manage.py api_doctor               # health-check the REST surface
uv run python manage.py mcp_doctor               # health-check the MCP surface
uv run python manage.py shell                    # shell_plus with auto-imports
uv run python manage.py screenshot_auth          # auth.json for shot-scraper
shot-scraper http://localhost:8007/ -o out.png   # browser screenshot
uv run python manage.py sc ls                    # every CRUDView model (the framework CLI)
uv run python manage.py sc doctor all            # api + mcp + search health in one
```

The **`sc` CLI** (`manage.py sc` / the `sc` shim) is the framework front door for the shell: generic CRUD over any registered CRUDView (`sc ls/get/describe/new/set/rm`, same validation + audit as REST/MCP) plus ops verbs (`doctor/backup/token/status/index`) and `sc commands` discovery. Prefer it over ad-hoc `manage.py shell` snippets — see `docs/skills/sc-cli.md`.

If you find yourself about to write a bash one-liner for "back up the SQLite database" or "validate the OpenAPI spec," **stop and check `docs/skills/cli-tools.md` first**. There's almost certainly a built-in tool for it.

## Visual verification

When you edit UI code, screenshot to verify before reporting done. The dev server must be running on port 8007 (this project's convention). Use shot-scraper with multi-step login:

```bash
shot-scraper multi - <<'EOF'
- url: http://localhost:8007/accounts/login/
  javascript: |
    document.querySelector('[name=username]').value = 'admin';
    document.querySelector('[name=password]').value = 'admin';
    document.querySelector('[type=submit]').click();
  wait: 2000
- url: http://localhost:8007/smallstack/your-page/
  output: /tmp/check.png
  width: 1400
  height: 900
EOF
```

Then read the resulting PNG. Tabler supports runtime theme/color/layout switching via the settings gear in the top-right — verify both `dark` and `light` modes if your page might be palette-sensitive. To force a mode in the screenshot, inject `localStorage.setItem('smallstack-theme', 'light')` in a `javascript:` block before the navigation.

## Don't do these (the anti-patterns)

The biggest recurring mistakes when AI builds Tabler pages in this codebase:

1. **Following `modern-dark-theme.md`** — that describes the upstream SmallStack base theme. Use `tabler-ui.md` instead.
2. **Hard-coded hex colors in inline styles or CSS** — use `var(--tblr-primary)` or the SmallStack aliases (`var(--primary)`). The accent is user-switchable, so hard-coded amber breaks the page on every other color choice.
3. **Forgetting to re-init Bootstrap JS after htmx swaps** — tooltips, popovers, and dropdowns auto-init on page load only. New nodes from htmx swaps need explicit re-init. See `docs/skills/tabler/htmx-patterns.md`.
4. **Reinventing components** — Tabler has cards, buttons, badges, alerts, dropdowns, modals, offcanvas, tabs, accordions, timelines, ribbons, status indicators, empty states, steps. Don't write a custom one. See `docs/skills/tabler/components.md`.
5. **Hand-rolling backup scripts / OpenAPI validators / token-mint scripts** — there's already a `manage.py` command for it (check `docs/skills/cli-tools.md`).
6. **Importing `django.contrib.auth.models.User` directly** — always `settings.AUTH_USER_MODEL` or `get_user_model()`.
7. **Inline JavaScript in new templates** — a `<script>…</script>` block or `onclick="…"`. Upstream's CSP `script-src` is `'self'` only; this fork still carries `'unsafe-inline'` as a stopgap because the Tabler templates in `apps/tabler/templates/` predate that rule. Don't add to the debt: put new scripts in `static/`, pass server values as `data-` attributes (`document.currentScript.dataset`) or with `json_script`, and use `data-confirm` / `data-ss-action` / `data-stat-modal` instead of handlers. The recipe is in `docs/skills/templates.md`.

## When you're stuck

| Problem | Where to look |
|---|---|
| Page looks unstyled / wrong after a new template was added | The template probably uses SmallStack `var(--primary)` etc. — check `tabler_overrides.css` has the aliases (it should). For layout classes like `.page-header-bleed` or `.crud-form`, see the ported styles in `tabler_overrides.css`. |
| Dropdown / tooltip / popover dead after an htmx swap | Need re-init. See `docs/skills/tabler/htmx-patterns.md` for the canonical handler. |
| `/api/docs/` is empty | At least one CRUDView needs `enable_api = True`. Run `python manage.py api_doctor --explain`. |
| Claude Desktop can't see MCP tools | Run `python manage.py mcp_doctor`. The Server registry / Orphan files cards point at the fix. |
| New migrations not applying | `make migrate`. Or `python manage.py makemigrations <app>` if you added/changed models. |
| Tests fail because of `Database access not allowed` | Add `pytestmark = pytest.mark.django_db` to the test module. |
| Tests fail with `ModuleNotFoundError: openapi_spec_validator` | `uv sync --all-extras` to install dev dependencies. |
| Upstream tests asserting "batteries-included" content fail in this downstream | They're marked `@pytest.mark.starter_content` and skipped by default via pytest config — this is expected. |
| Want to verify in the browser before reporting "done" | shot-scraper with the login chain. See "Visual verification" above. |

## What's checked into git vs. generated

- ✓ tracked: `apps/`, `config/`, `templates/`, `static/` (your own files), `Makefile`, `pyproject.toml`, `uv.lock`, `docs/skills/`
- ✗ ignored: `.venv/`, `db.sqlite3`, `staticfiles/`, `htmlcov/`, `__pycache__/`, `backups/`, `localhost*.png` (shot-scraper dev screenshots)

When generating screenshots or working data, write to `/tmp/` so it stays out of the working tree.

## Related docs

- `docs/skills/tabler-ui.md` — **read first for any page work in this Tabler downstream**. Router into the specialized skills.
- `docs/skills/tabler/README.md` — detailed map of every Tabler skill (foundations, theming, layouts, components, forms, tables, charts, page recipes, customization, troubleshooting)
- `docs/skills/upstream-workflow.md` — how to merge upstream `django-smallstack` updates without losing Tabler customizations
- `CHANGELOG-tabler.md` — this fork's own changelog and its `vX.Y.Z-tabler.N` versioning scheme. Downstream entries go here; `CHANGELOG.md` is upstream's and is overwritten on every merge
- `apps/smallstack/docs/cli-reference.md` — every `manage.py` command + Make target + system tool, with options and examples
- `apps/smallstack/docs/mcp.md` — Model Context Protocol overview
- `apps/smallstack/docs/building-crud-pages.md` — the CRUDView walkthrough
- `docs/skills/README.md` — the full skill-file index
- `README.md` — repo-level project description (for humans new to SmallStack)
