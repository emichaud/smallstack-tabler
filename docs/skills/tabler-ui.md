# Tabler UI — top-level orientation

This is the **entry point** for all Tabler-themed work in SmallStack-Tabler. It does two things:
1. Routes you to the right specialized skill for what you're building.
2. Pins the top-level project rules every Tabler page must follow.

For deep-dive references, see the [`tabler/`](tabler/) subdirectory — start with [`tabler/README.md`](tabler/README.md).

## Quick overview

This project uses [Tabler v1.0.0-beta20](https://tabler.io), an admin UI framework built on Bootstrap 5. Tabler CSS/JS is loaded from a CDN (jsdelivr) by `apps/tabler/templates/tabler/base.html`. Local overrides live in `apps/tabler/static/tabler/css/tabler_overrides.css` and `apps/tabler/static/tabler/js/tabler_theme.js` (the settings-panel engine).

Every page **extends `tabler/base.html`** and uses Tabler component classes (`.card`, `.btn-primary`, `.row-deck row-cards`, etc.). The user can switch theme, color, font, base palette, corner radius, and layout at runtime via the offcanvas settings panel — all persist to localStorage and (for theme) to the user's profile.

## Which skill for which job

| Building this | Open this skill |
|------|-----------------|
| **Getting started** — a new page that extends Tabler base | [`tabler/foundations.md`](tabler/foundations.md) |
| **Theme & color** — accent, dark mode, settings panel, persistence | [`tabler/theming.md`](tabler/theming.md) |
| **Layout** — horizontal, vertical, boxed, condensed, fluid, sticky, RTL | [`tabler/layouts.md`](tabler/layouts.md) |
| **Components** — cards, buttons, modals, alerts, badges, dropdowns, timelines, ribbons, steps | [`tabler/components.md`](tabler/components.md) |
| **Icons & typography** — Tabler Icons, headings, code blocks, markdown | [`tabler/icons-typography.md`](tabler/icons-typography.md) |
| **Forms** — basic + Flatpickr / Choices / Imask / Dropzone / Signature / Star / Slider / Wizard | [`tabler/forms.md`](tabler/forms.md) |
| **Tables** — sortable, paginated, datatables, htmx-driven, CRUD integration | [`tabler/tables.md`](tabler/tables.md) |
| **Charts** — ApexCharts patterns, theme-aware colors, live updates | [`tabler/charts.md`](tabler/charts.md) |
| **Maps & calendar** — jsvectormap, FullCalendar, Sortable.js drag-drop | [`tabler/maps-calendar.md`](tabler/maps-calendar.md) |
| **HTMX integration** — tab load, table refresh, infinite scroll, modal/offcanvas content, toasts, JS re-init | [`tabler/htmx-patterns.md`](tabler/htmx-patterns.md) |
| **Dashboard page** — KPI rows, sparklines, multi-card analytics, live updates | [`tabler/page-dashboards.md`](tabler/page-dashboards.md) |
| **Marketing/landing page** — hero, pricing, features, testimonials, FAQ, CTA | [`tabler/page-landing.md`](tabler/page-landing.md) |
| **Blog/docs/content page** — article, TOC, markdown, slide viewer | [`tabler/page-content.md`](tabler/page-content.md) |
| **API explorer/documentation** — endpoints, request/response, try-it, prism | [`tabler/page-api-explorer.md`](tabler/page-api-explorer.md) |
| **Auth pages** — login, signup, lock, password reset | [`tabler/page-auth.md`](tabler/page-auth.md) |
| **Utility apps** — kanban, todos, calendar UI, file manager, email inbox | [`tabler/page-utility.md`](tabler/page-utility.md) |
| **Customization** — CSS vars, base template, new plugins, local build, CSP | [`tabler/customization.md`](tabler/customization.md) |
| **Something broken** — FOUC, theme persistence, chart dark mode, htmx + Tabler JS, settings sync | [`tabler/troubleshooting.md`](tabler/troubleshooting.md) |

## Project rules (must follow)

These apply to every Tabler page in this project:

1. **Extend `tabler/base.html`** for app pages. **Extend `registration/tabler_auth_base.html`** for auth screens. Don't make a new base.
2. **Use Tabler component classes** — `.card`, `.btn`, `.badge`, `.table`, etc. Don't reinvent them with custom CSS.
3. **Use Bootstrap 5 grid** for layout — `.row`, `.col-md-*`. Use **`.row.row-deck.row-cards`** for any grid of cards (equal heights + correct gutters).
4. **Never hardcode hex colors** in templates. Use `bg-*`, `text-*`, `btn-*` utility classes or the CSS variables (`var(--tblr-primary)`).
5. **Dark mode is automatic.** Custom CSS rules should be scoped under `body.theme-dark` or use Tabler CSS variables that auto-adapt.
6. **`card-table` class** for tables inside cards — removes redundant padding and aligns the table flush.
7. **Keep page-specific CSS in `{% block extra_css %}`.** Don't create new CSS files for one page.
8. **Mark transient UI with `d-print-none`** — navbar, action buttons, pagination, footer. So print views stay clean.
9. **Prefer `-lt` light variants** (`bg-blue-lt`, `bg-green-lt`) for backgrounds — they adapt to both themes and stay readable.
10. **Use `text-secondary` for secondary info**, `text-muted` for tertiary. Don't grayscale manually.
11. **For data persistence settings**, follow the established axes in `tabler_theme.js` (`smallstack-*` keys in localStorage). Don't add ad-hoc storage.
12. **`{% load theme_tags %}`** in every page using `{% breadcrumb %}` / `{% nav_active %}` / `{% querystring %}` / `{% localtime_tooltip %}` / `{% render_paginator %}`.
13. **HTMX swaps that introduce new `data-bs-toggle` nodes** must trigger Bootstrap re-init for tooltips, popovers, and dropdowns. See [`tabler/htmx-patterns.md`](tabler/htmx-patterns.md).
14. **Don't load ApexCharts, Prism, Flatpickr, etc. in `base.html`.** Load per-page in `{% block extra_js %}` / `{% block extra_css %}`.
15. **Forms in admin views**: ensure Django form widgets get `.form-control` / `.form-select` classes — either via form `__init__` or via SmallStack's existing CRUDView templates.

## File locations cheat sheet

| Where | What |
|-------|------|
| `apps/tabler/templates/tabler/base.html` | The canonical page skeleton |
| `apps/tabler/templates/tabler/includes/` | navbar, settings panel, breadcrumbs, messages, cookie banner |
| `apps/tabler/templates/registration/tabler_auth_base.html` | Auth-page base (different from main base) |
| `apps/tabler/templates/smallstack/crud/` | CRUD list/detail/form templates |
| `apps/tabler/static/tabler/css/tabler_overrides.css` | All custom CSS — dark mode, color tweaks, component polish, layout helpers |
| `apps/tabler/static/tabler/js/tabler_theme.js` | Theme engine — settings panel, color/font/base/radius/layout persistence |
| `apps/tabler/static/tabler/css/slides.css` | Slide viewer styles |
| `apps/smallstack/templatetags/theme_tags.py` | `{% breadcrumb %}`, `{% nav_active %}`, `{% querystring %}`, `{% localtime_tooltip %}`, `{% render_paginator %}` |
| `apps/smallstack/templatetags/crud_tags.py` | `{% crud_table %}`, `{% crud_form %}`, `{% sortable_th %}`, etc. |
| `apps/smallstack/context_processors.py` | `brand.*`, `site.*`, `palettes`, `nav_items` available in every template |

## External references catalog

For browsing Tabler's gallery and docs:

- **Live preview demos**: https://preview.tabler.io
- **Component documentation**: https://docs.tabler.io
- **Icon search & SVG copy**: https://tabler.io/icons
- **Source code**: https://github.com/tabler/tabler

Each specialized skill cites the relevant pages.

## Related (outside the `tabler/` subdir)

- [`upstream-workflow.md`](upstream-workflow.md) — merging upstream SmallStack updates into this Tabler downstream
- [`theming-system.md`](theming-system.md) — SmallStack's original CSS variable system (Tabler sits on top of it)
- [`building-themed-pages.md`](building-themed-pages.md) — pre-Tabler page-building reference
- [`adding-your-own-theme.md`](adding-your-own-theme.md) — generic guide for adding any framework alongside SmallStack
- [`htmx-patterns.md`](htmx-patterns.md) — SmallStack's general htmx setup (Tabler-specific patterns are in [`tabler/htmx-patterns.md`](tabler/htmx-patterns.md))
- [`templates.md`](templates.md) — Django template inheritance and blocks
- [`api.md`](api.md) — CRUDView REST API (referenced by [`tabler/page-api-explorer.md`](tabler/page-api-explorer.md))
