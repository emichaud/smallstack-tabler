# AI Agent Skills

This directory contains reference documentation designed for AI agents (LLMs) working on this codebase. These "skill files" provide structured knowledge about the project's architecture, conventions, and patterns.

## Purpose

When an AI agent is asked to modify or extend this project, these files help it:

- Understand project conventions and patterns
- Follow existing code style and structure
- Make changes that integrate properly with the codebase
- Avoid common mistakes

## Tabler UI Skills (comprehensive)

For Tabler-themed page work, this project ships a full skill set under [`tabler/`](tabler/). Start at the router:

| File | Description |
|------|-------------|
| [tabler-ui.md](tabler-ui.md) | **Start here.** Top-level orientation, which-skill-for-which-job, and project rules every Tabler page must follow. |
| [tabler/README.md](tabler/README.md) | Detailed router and glossary across all Tabler skills |
| [tabler/foundations.md](tabler/foundations.md) | Page architecture, base.html, asset loading, navbar/breadcrumbs wiring, context processors, template tags |
| [tabler/theming.md](tabler/theming.md) | 5 theme axes, 11 accent colors, dark mode, settings panel engine, theme persistence + profile sync |
| [tabler/layouts.md](tabler/layouts.md) | All 10 layout variants (horizontal, vertical, boxed, condensed, fluid, sticky, overlap, RTL) — when to pick which |
| [tabler/components.md](tabler/components.md) | Comprehensive reference: cards, buttons, modals, alerts, dropdowns, tabs, timelines, ribbons, status, etc. |
| [tabler/icons-typography.md](tabler/icons-typography.md) | Tabler Icons (5000+), typography scale, code blocks with Prism, markdown rendering |
| [tabler/forms.md](tabler/forms.md) | Form basics + advanced plugins (Flatpickr, Choices, tom-select, Imask, Dropzone, Signature, Star, Slider, Wizard) |
| [tabler/tables.md](tabler/tables.md) | Sortable, paginated, datatables, List.js, htmx-driven tables, SmallStack CRUD integration |
| [tabler/charts.md](tabler/charts.md) | ApexCharts patterns (line, area, bar, donut, radial, sparkline, heatmap), theme-aware colors, live updates |
| [tabler/maps-calendar.md](tabler/maps-calendar.md) | jsVectorMap, FullCalendar, Sortable.js (drag-drop, kanban) |
| [tabler/htmx-patterns.md](tabler/htmx-patterns.md) | HTMX + Tabler: lazy tabs, modal load, table refresh, toasts, JS re-init after swap |
| [tabler/page-dashboards.md](tabler/page-dashboards.md) | **Page recipe** — admin dashboards with KPI cards, charts, recent-activity tables, live updates |
| [tabler/page-landing.md](tabler/page-landing.md) | **Page recipe** — marketing/landing: hero, pricing, features, testimonials, FAQ, CTAs |
| [tabler/page-content.md](tabler/page-content.md) | **Page recipe** — blog/docs/articles: TOC, markdown, slide viewer, search, related posts |
| [tabler/page-api-explorer.md](tabler/page-api-explorer.md) | **Page recipe** — API documentation with endpoint browser, try-it panel, code examples |
| [tabler/page-auth.md](tabler/page-auth.md) | **Page recipe** — login, signup, lock screen, password reset (uses `tabler_auth_base.html`) |
| [tabler/page-utility.md](tabler/page-utility.md) | **Page recipe** — kanban, todos, calendar UI, file manager, email-style inbox |
| [tabler/customization.md](tabler/customization.md) | Overrides: CSS variables, base.html extensions, new plugins, local Tabler build, CSP, new theme axes |
| [tabler/troubleshooting.md](tabler/troubleshooting.md) | Symptom-indexed fixes: FOUC, theme persistence, chart dark mode, htmx + Tabler JS, settings sync |

## Other Skills

| File | Description |
|------|-------------|
| [cli-tools.md](cli-tools.md) | **Start here for "is there a tool for X?"** — task → tool / failure → tool / tool → docs lookup tables |
| [modern-dark-theme.md](modern-dark-theme.md) | **Read before building any page** — canonical patterns, anti-patterns, variable list for the v0.9.x modern-dark theme |
| [modify-palettes.md](modify-palettes.md) | Add a new color palette or tune an existing one — file map, color-science gotchas, verification |
| [django-apps.md](django-apps.md) | Creating apps, CRUDView + tables2 management pages, title bar pattern |
| [templates.md](templates.md) | Template inheritance, blocks, includes, common patterns |
| [admin-page-styling.md](admin-page-styling.md) | **Definitive UI reference**: buttons, cards, tables, stat cards, action cards, tabs, filter toggles, forms, modals, starter template |
| [theming-system.md](theming-system.md) | CSS variables, palettes, dark mode |
| [building-themed-pages.md](building-themed-pages.md) | Recipe guide: color-mix scale, building pages that fit all modes and palettes |
| [adding-your-own-theme.md](adding-your-own-theme.md) | Adding a custom CSS framework alongside SmallStack's built-in theme |
| [theme-scenarios.md](theme-scenarios.md) | Three theme integration scenarios: public-only, user login, or build on SmallStack |
| [authentication.md](authentication.md) | Custom user model, auth views, protecting views |
| [manage-api-tokens.md](manage-api-tokens.md) | Pick the right token surface (/smallstack/tokens/, CLI, OAuth) by question; permissions matrix; reveal-once flow |
| [htmx-patterns.md](htmx-patterns.md) | htmx setup, CSRF, partials, dual-response views, OOB messages |
| [help-documentation.md](help-documentation.md) | Help system, sections, bundled SmallStack docs |
| [settings.md](settings.md) | Split settings, environment variables, feature flags |
| [timezones.md](timezones.md) | Timezone middleware, per-user timezone, localtime_tooltip tag |
| [background-tasks.md](background-tasks.md) | Django Tasks framework with django-tasks-db backend |
| [scheduler.md](scheduler.md) | **Recurring jobs** — the `@scheduled` decorator, the scheduler UI, cron/interval/once cadences, the tick, overlap/catch-up policies |
| [approvals.md](approvals.md) | **Human-in-the-loop approval gate** — `@approval_kind` + `request_approval()`, the decision console, eligibility rules (assignees/self-approval/staff), the callback + signal + webhook + poll reaction paths, expiry sweep |
| [notifications.md](notifications.md) | **In-app notifications** — the never-raising `notify()` service, the topbar bell + unread badge, the inbox, per-user REST, daily prune |
| [webhooks.md](webhooks.md) | **Webhooks** — a foundational integration surface: outbound event delivery (`enable_webhooks = True`) + inbound receivers (`@webhook_handler`), plus **four extension seams** (`@webhook_transform`/`@webhook_auth`/`@webhook_verifier`/`@webhook_challenge`) that make Zapier/n8n/Stripe/Slack/Event Grid plug-ins, first-class **SmallStack↔SmallStack** pairing (`sc webhook pair`, loop-safe), stable `event_id` dedupe, `Retry-After` + bulk dead-letter replay |
| [rss.md](rss.md) | **RSS/Atom feeds** — symmetric publish + consume surface. Publish a model with `enable_rss = True` (or a curated `Feed`); the enclosure/podcast seam is `rss_item_extra`. Consume external feeds into a model with `register_feed_source` + the collector (`@scheduled` + `manage.py collect_feeds`). Status-page feed is the reference |
| [activity-tracking.md](activity-tracking.md) | HTTP request logging middleware and configuration |
| [logging-audit.md](logging-audit.md) | Logging configuration, audit trail, and **reading logs from a deployment you can't shell into** — JSON output with `request_id` correlation, DB-backed capture, the `/smallstack/logs/` staff viewer, time-boxed capture windows |
| [screenshot-workflow.md](screenshot-workflow.md) | Visual verification with shot-scraper and screenshot_auth |
| [docker-deployment.md](docker-deployment.md) | Docker Compose setup, services, volumes |
| [kamal-deployment.md](kamal-deployment.md) | Kamal deployment configuration, VPS setup, SSL, commands |
| [development-workflow.md](development-workflow.md) | Branching, testing, coverage, documentation, commit style |
| [release-process.md](release-process.md) | Versioning, release checklist, GitHub releases |
| [integration-workflow.md](integration-workflow.md) | Pulling upstream into downstream projects, deploying |
| [api-discovery.md](api-discovery.md) | API discovery endpoints: schema introspection, OpenAPI spec, OPTIONS metadata |
| [custom-api-endpoints.md](custom-api-endpoints.md) | Building non-CRUD API endpoints with the `@api_view` decorator |
| [api-doctor.md](api-doctor.md) | Debug API setup + threat signals via `/smallstack/api/` (Health + Activity) and `python manage.py api_doctor` |
| [dashboard-widgets.md](dashboard-widgets.md) | Dashboard widget protocol: `DashboardWidget` class, Explorer vs standalone registration, data layer, REST API |
| [card-displays.md](card-displays.md) | Card grid displays: `CardDisplay` (key-value), `AvatarCardDisplay`, authoring new card variants |
| [calendar-displays.md](calendar-displays.md) | Month-grid calendar display: `CalendarDisplay` config, ranged vs single-date events, month navigation |
| [update-docs-and-skills.md](update-docs-and-skills.md) | File group map for updating docs/skills after code changes |

### MCP (Model Context Protocol)

| File | Description |
|------|-------------|
| [mcp/enable-mcp-for-a-model.md](mcp/enable-mcp-for-a-model.md) | Opt a CRUDView into MCP via `enable_mcp = True` |
| [mcp/write-a-custom-tool.md](mcp/write-a-custom-tool.md) | Add cross-cutting tools with the `@tool` decorator + `current_context()` |
| [mcp/add-a-write-tool.md](mcp/add-a-write-tool.md) | Expose create/update/delete via factory vs custom write tools |
| [mcp/connect-claude-desktop.md](mcp/connect-claude-desktop.md) | Connect Claude Desktop / Claude.ai Connectors UI to the server |
| [mcp/debug-mcp-failure.md](mcp/debug-mcp-failure.md) | Decision tree for diagnosing connector failures |
| [mcp/add-mcp-to-this-project.md](mcp/add-mcp-to-this-project.md) | Bootstrap MCP in a fresh / non-MCP-aware project |
| [mcp/extend-explorer-for-tokens.md](mcp/extend-explorer-for-tokens.md) | Surface APIToken management via Explorer |
| [mcp/mcp-admin-pages.md](mcp/mcp-admin-pages.md) | Use the `/smallstack/mcp/` Health / Tools / Activity admin pages from a debugging session |
| [mcp/build-mcp-solution.md](mcp/build-mcp-solution.md) | "User wants Claude to do X" → decision tree for CRUDView vs `@tool` + copy-pasteable patterns. Start here when designing new MCP features. |
| [mcp/verify-mcp.md](mcp/verify-mcp.md) | Consolidated verify checklist: doctor, --explain, make mcp-test, admin pages, dashboard widget, Claude Desktop — picks the right path per question |
| [mcp/configure-mcp.md](mcp/configure-mcp.md) | Scenario → `MCP_*` setting map: turn off OAuth, custom theme, kamal-proxy, multi-tenant, verbose logging, autodiscover |

## Usage

AI agents should read relevant skill files before making changes to the corresponding parts of the codebase. For example:

- **Before building any Tabler-themed page → read `tabler-ui.md` first** (it routes you to the right specialized skill under `tabler/`). This downstream uses the Tabler UI framework, NOT the upstream modern-dark theme — `tabler-ui.md` supersedes `modern-dark-theme.md` here
- **Before running ANY operational command** (diagnose, smoke-test, mint token, backup, screenshot, deploy) → read `cli-tools.md` first
- Before creating a new app → read `django-apps.md`
- Before creating templates → read `templates.md`
- Before building any admin/management page → read `admin-page-styling.md` for the SmallStack-base reference, OR `tabler-ui.md` for the Tabler-specific patterns this downstream actually uses
- Before modifying CSS/theming → read `tabler/theming.md` (for the Tabler engine + accent palette) — `theming-system.md` and `modern-dark-theme.md` document the upstream SmallStack theme, which is NOT in use here
- Before adding a new color palette to the upstream theme → read `modify-palettes.md` (rarely needed downstream — our accent palette lives in `tabler/theming.md`)
- Before adding a custom theme (Bootstrap, Tailwind, etc.) → read `adding-your-own-theme.md`
- Before deciding which theme approach to take → read `theme-scenarios.md`
- Before working with auth → read `authentication.md`
- Before answering an API-token question (mint, revoke, where to look) → read `manage-api-tokens.md`
- Before adding htmx interactions → read `htmx-patterns.md`
- Before adding a help page → read `help-documentation.md`
- Before changing settings → read `settings.md`
- Before adding background tasks → read `background-tasks.md`
- Before scheduling recurring work (`@scheduled`) → read `scheduler.md`
- Before gating anything on a human decision (an approval step, an AI-agent HITL gate) → read `approvals.md`
- Before surfacing an in-app "you should see this" message (bell/inbox) → read `notifications.md`
- Before working with activity tracking → read `activity-tracking.md`
- Before taking screenshots → read `screenshot-workflow.md`
- Before deploying with Docker → read `docker-deployment.md`
- Before deploying with Kamal → read `kamal-deployment.md`
- Before developing features → read `development-workflow.md`
- Before releasing a version → read `release-process.md`
- Before pulling upstream into downstream → read `integration-workflow.md`
- Before integrating with the SmallStack API → read `api-discovery.md`
- Before building custom (non-CRUD) API endpoints → read `custom-api-endpoints.md`
- Before debugging an API setup, an empty Swagger, or a "weird traffic" report → read `api-doctor.md`
- Before adding dashboard widgets → read `dashboard-widgets.md`
- Before configuring or building card-grid list displays → read `card-displays.md`
- Before adding a month-grid calendar to a model → read `calendar-displays.md`
- Before updating docs after code changes → read `update-docs-and-skills.md`
- **Before designing any MCP feature** → read `mcp/build-mcp-solution.md` (decision tree + patterns)
- Before exposing a CRUDView to AI clients → read `mcp/enable-mcp-for-a-model.md`
- Before adding a custom MCP tool → read `mcp/write-a-custom-tool.md`
- Before changing any `MCP_*` setting → read `mcp/configure-mcp.md`
- Before saying "MCP works" → read `mcp/verify-mcp.md`
- Before debugging an MCP failure → read `mcp/debug-mcp-failure.md`

## Common combinations

Multi-skill recipes for the headline use cases. Each row is "pick this combination, read these files in this order."

| Goal | Read in this order |
|---|---|
| **Model → web admin + REST + MCP + Search in one class** (the headline pipeline) | `crud-views.md` → `enable-mcp-for-a-model.md` → `search.md` → `api-discovery.md` |
| **End-user CRUD** (Alice signs in and sees only her stuff, on web + REST + MCP) | `building-a-user-facing-site.md` → `mcp/end-user-tools.md` → `crud-views.md` (for `get_list_queryset` + `can_update`/`can_delete`) |
| **Public catalogue** (anonymous visitors can browse + search published rows) | `building-a-user-facing-site.md` (Recipe 4) → `search.md` (Inventory walkthrough, "Recipe 4") |
| **AI/RAG over a custom model** (Claude searches your tickets, finds rows, answers with citations) | `search.md` → `mcp/build-mcp-solution.md` → `mcp/enable-mcp-for-a-model.md` → `mcp/connect-claude-desktop.md` |
| **Both staff + end-user views of the same model** (operator console + customer portal on `Invoice`) | `crud-views.md` (two CRUDView classes on one model, different `url_base`) → `building-a-user-facing-site.md` (the user-facing class) → `search.md` ("Walkthrough: building an Inventory app") |
| **Custom non-CRUD tool** (a "send-email" or "regenerate-report" MCP/REST action) | `custom-api-endpoints.md` (for REST) → `mcp/write-a-custom-tool.md` (for MCP) → `mcp/enable-mcp-for-a-model.md` (for the auth model) |
| **OAuth-issued tokens via the Connectors UI** (Claude Desktop calling your CRUDView) | `mcp/connect-claude-desktop.md` → `mcp/enable-mcp-for-a-model.md` → `mcp/verify-mcp.md` |
| **Theme-correct page across every accent + dark/light combination** (your custom landing page that doesn't break when the accent changes) | `tabler-ui.md` → `tabler/theming.md` → `screenshot-workflow.md` (for the theme-cycle verification) |
| **Add clickable metric tiles + drill-down modals** (the stat cards atop an app's own dashboard page) | `dashboard-cards.md` → `htmx-patterns.md` (for the partial-response endpoint) |
| **Add a per-model dashboard widget** (a tile on the central `/smallstack/` dashboard that summarises your data) | `dashboard-widgets.md` → `crud-views.md` (for `get_list_queryset` if the widget should respect tenancy) |
| **Monitor a subsystem's uptime/health** (a `Service` + `Monitor` on `/smallstack/status/`, or a new status chart) | `status-monitors.md` → `tabler-ui.md` (for visualization partial colors) |
| **Recurring/scheduled job** (`@scheduled` decorator or the scheduler UI; cron/interval/once) | `scheduler.md` |
| **Human approval before an action** (publish gate, refund sign-off, AI agent files → human decides → app reacts) | `approvals.md` → `notifications.md` (how approvers hear about it) → `webhooks.md` (remote reaction) |
| **Notify an external system when data changes** (outbound webhook — Slack/Zapier/a microservice on model create/update/delete; shape the payload with `@webhook_transform`) | `webhooks.md` → `crud-views.md` (for `enable_webhooks` alongside the other flags) |
| **Receive events from an external system** (inbound webhook — Stripe/GitHub POST; verify with `@webhook_verifier`, handshake with `@webhook_challenge`) | `webhooks.md` (the `@webhook_handler` + seam half) |
| **Link two SmallStacks** (loop-safe two-way event flow between instances) | `webhooks.md` → the SmallStack↔SmallStack `sc webhook pair` section |

If a goal isn't covered here yet, the canonical decision tree is in `mcp/build-mcp-solution.md` for AI-touching features, or `from-zero-to-running.md` for project-shape questions.

## For Humans

These files are also useful for developers new to the project. They provide quick references for:

- Understanding how different systems work
- Following established patterns
- Finding the right files to modify

## Contributing

When adding significant new features or systems to the project, consider creating a corresponding skill file to document:

- File locations and structure
- Key concepts and patterns
- Step-by-step procedures
- Configuration options
- Best practices
