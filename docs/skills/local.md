# Fork-local skills — SmallStack-Tabler

This fork's own skill registry. Upstream never ships this file, so rows here never conflict on a merge. `make skills-index` folds them into `index.json` and the Agent Skills tree.

**This fork's UI is Tabler.** For page, component and theming work these skills replace `modern-dark-theme.md`, `modify-palettes.md`, `theming-system.md` and `admin-page-styling.md`, which describe the upstream base theme. For releases and merges, `upstream-workflow.md` replaces `release-process.md`.

## Tabler UI Skills

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

## Fork Workflow

| File | Description |
|------|-------------|
| [upstream-workflow.md](upstream-workflow.md) | **This repo's fork workflow.** Merging upstream without losing the Tabler chrome, and how THIS downstream versions + releases (`vX.Y.Z-tabler.N`, `CHANGELOG-tabler.md`) |
