# Tabler UI Skills — Router

This directory holds the **comprehensive Tabler skill set** for SmallStack-Tabler. Each file is a focused reference for building one kind of Tabler-themed page or system in this repo.

The entry point for any Tabler work is **[../tabler-ui.md](../tabler-ui.md)** (top-level rules + this router). Specialized references live below.

## Which skill for which job

| If you're working on… | Open this |
|------|-----------|
| Setting up a new page that extends Tabler base | [foundations.md](foundations.md) |
| Picking colors, dark mode, theme persistence, the settings panel | [theming.md](theming.md) |
| Choosing a layout (horizontal navbar, vertical sidebar, boxed, condensed, fluid, sticky, RTL) | [layouts.md](layouts.md) |
| Any Tabler component (cards, buttons, modals, badges, alerts, dropdowns, steps, ribbons, timelines…) | [components.md](components.md) |
| Tabler Icons, typography, code blocks, markdown rendering | [icons-typography.md](icons-typography.md) |
| Forms — basic inputs + Flatpickr/Choices/tom-select/Imask/Dropzone/Signature/Star/Slider/Wizard | [forms.md](forms.md) |
| Tables — sortable, paginated, datatables, List.js, htmx-driven, CRUD integration | [tables.md](tables.md) |
| Charts — ApexCharts patterns, theme-aware colors, live updates | [charts.md](charts.md) |
| Maps (jsvectormap), full calendar (FullCalendar), drag-drop (Sortable.js) | [maps-calendar.md](maps-calendar.md) |
| Wiring HTMX into Tabler (tab loads, modals, offcanvas, infinite scroll, toasts, JS re-init) | [htmx-patterns.md](htmx-patterns.md) |
| Building an **admin dashboard** — stat rows, KPI cards, multi-card analytics | [page-dashboards.md](page-dashboards.md) |
| Building a **marketing/landing page** — hero, pricing, features, testimonials, FAQ | [page-landing.md](page-landing.md) |
| Building a **blog or docs page** — articles, TOC, markdown, slide viewer, related posts | [page-content.md](page-content.md) |
| Building an **API explorer / documentation** page — endpoint list, request/response, prism, copy | [page-api-explorer.md](page-api-explorer.md) |
| Login, signup, lock, password reset | [page-auth.md](page-auth.md) |
| Kanban, todos, calendar UI, file manager, email-style inbox | [page-utility.md](page-utility.md) |
| Overriding Tabler — CSS variables, extending base.html, adding new plugins, local build, CSP | [customization.md](customization.md) |
| Something is broken (FOUC, theme not persisting, chart dark mode, htmx + Tabler JS) | [troubleshooting.md](troubleshooting.md) |

## Quick orientation

**Tabler v1.0.0-beta20** is loaded from a CDN (jsdelivr) by `apps/tabler/templates/tabler/base.html`. It is Bootstrap 5 under the hood — every Bootstrap utility works.

Three files own the Tabler integration:

- `apps/tabler/templates/tabler/base.html` — the canonical page skeleton
- `apps/tabler/static/tabler/css/tabler_overrides.css` — every dark-mode, color, layout polish
- `apps/tabler/static/tabler/js/tabler_theme.js` — the settings-panel engine (theme/color/font/base/radius/layout, all persisted to `localStorage` and synced to user profile)

Every new page in this project should **extend `tabler/base.html`** and use Tabler component classes. Do not write a new CSS framework alongside it.

## Conventions used in every skill file

Each skill file follows the same shape so you can scan it the same way every time:

1. **Use this skill when…** — one-line trigger
2. **Tabler references** — direct links into `preview.tabler.io` / `docs.tabler.io`
3. **In-repo examples** — file paths to real templates/CSS/JS already using the pattern
4. **Copy-pasteable snippets** — Django + Tabler templates that drop into `{% extends "tabler/base.html" %}`
5. **SmallStack integration notes** — how to wire `{% breadcrumb %}`, `{% nav_active %}`, `{% querystring %}`, context processors, CRUDView, etc.
6. **Gotchas** — mistakes specific to this stack

## External references catalog

When a skill cites Tabler upstream, it links to one of these:

- **Preview gallery** — https://preview.tabler.io — see live demos of every page type
- **Component docs** — https://docs.tabler.io — class reference and props
- **Icons** — https://tabler.io/icons — 5000+ stroke-icon search
- **Source** — https://github.com/tabler/tabler — for reading SCSS/JS implementation

## Glossary

| Term | Meaning |
|------|---------|
| **CDN base** | Tabler CSS/JS loaded via `cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20` — no local copy. |
| **Settings panel** | The offcanvas at `#offcanvas-settings`, defined in `tabler/includes/settings.html`. Lets the user change theme/color/font/base/radius/layout at runtime. |
| **Theme engine** | `tabler_theme.js` — persists settings to `localStorage` under the `smallstack-` prefix, syncs to authenticated user profile via htmx. |
| **`theme-dark` class** | Class on `<body>` that activates the dark palette. Toggled by the theme engine, also set by the blocking script in `<head>` to prevent FOUC. |
| **`data-bs-theme`** | Attribute on `<html>` — Bootstrap's own dark-mode flag. Also set early to prevent FOUC. |
| **`data-bs-theme-font/-base/-radius`** | Attributes on `<html>` for font family, gray-palette base, and corner radius. |
| **`row-deck row-cards`** | Equal-height card grid layout. Use these together on any `.row` of cards. |
| **`card-table`** | Table inside a card. Removes card-body padding and aligns the table flush. |
| **`{% breadcrumb %}` / `{% render_tabler_breadcrumbs %}`** | Template tags from `apps/smallstack/templatetags/theme_tags.py` — accumulate breadcrumb items and render them in Tabler markup. |
| **`{% nav_active %}`** | Returns `active` class if the current URL matches a given URL name. |
| **`brand.*`** | Context-processor dict (`apps/smallstack/context_processors.py`) — `brand.name`, `brand.logo`, `brand.favicon`, etc. Always available in templates. |

## Related skills (outside this directory)

- [../theming-system.md](../theming-system.md) — SmallStack's *original* CSS variable system (Tabler now sits on top of it)
- [../building-themed-pages.md](../building-themed-pages.md) — pre-Tabler page building (reference only)
- [../adding-your-own-theme.md](../adding-your-own-theme.md) — generic guide for adding any framework alongside SmallStack
- [../upstream-workflow.md](../upstream-workflow.md) — merging upstream SmallStack into this Tabler downstream
- [../htmx-patterns.md](../htmx-patterns.md) — SmallStack's general htmx patterns (Tabler-specific patterns are in `htmx-patterns.md` here)
