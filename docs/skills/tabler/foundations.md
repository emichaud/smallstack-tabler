# Tabler Foundations — page architecture, base.html, asset loading

**Use this skill when** creating any new Tabler-themed page in this repo, wiring a new Django view to a template, or understanding how the base template stack fits together.

## Tabler references

- Docs: https://docs.tabler.io/ui/base/page — the page wrapper, header, body, footer pattern
- Preview: https://preview.tabler.io/index.html — the canonical horizontal-navbar dashboard
- Docs: https://docs.tabler.io/getting-started/installation — how Tabler's CSS/JS is meant to be loaded

## In-repo examples

- `apps/tabler/templates/tabler/base.html` — the canonical skeleton every page extends
- `apps/tabler/templates/tabler/includes/navbar.html` — top navbar with logo, content nav, apps grid, settings, user menu
- `apps/tabler/templates/tabler/includes/breadcrumbs.html` — Tabler breadcrumb markup
- `apps/tabler/templates/tabler/includes/messages.html` — Django messages → Tabler alerts
- `apps/tabler/templates/tabler/includes/cookie_banner.html` — bottom-fixed cookie banner
- `apps/tabler/templates/tabler/includes/settings.html` — offcanvas theme settings panel
- `apps/tabler/templates/smallstack/dashboard.html` — minimal example of extending base
- `apps/tabler/templates/activity/dashboard.html` — full dashboard example

## The page skeleton

Every page in this project starts with:

```django
{% extends "tabler/base.html" %}
{% load static theme_tags %}

{% block title %}My Page{% endblock %}

{% block breadcrumbs %}
  {% breadcrumb "Home" "website:home" %}
  {% breadcrumb "My Section" "myapp:index" %}
  {% breadcrumb "My Page" %}
  {% render_tabler_breadcrumbs %}
{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col">
        <div class="page-pretitle">Section</div>
        <h2 class="page-title">My Page</h2>
      </div>
      <div class="col-auto ms-auto d-print-none">
        <div class="btn-list">
          <a href="#" class="btn btn-primary">Primary action</a>
        </div>
      </div>
    </div>
  </div>
</div>
{% endblock %}

{% block content %}
<div class="row row-deck row-cards">
  <!-- cards here -->
</div>
{% endblock %}

{% block extra_css %}{% endblock %}
{% block extra_js %}{% endblock %}
```

## Blocks defined by `tabler/base.html`

| Block | Purpose |
|-------|---------|
| `title` | Page title (gets `\| {{ brand.name }}` appended automatically) |
| `extra_css` | Page-specific `<link>` or inline `<style>` — keep minimal |
| `body_class` | Extra classes on `<body>` (rarely needed; settings panel handles dark mode) |
| `navbar` | Override the top navbar. Default is `tabler/includes/navbar.html`. Override for auth pages or print-only views. |
| `breadcrumbs` | Use `{% breadcrumb %}` then `{% render_tabler_breadcrumbs %}` — see "Breadcrumbs" below |
| `page_header` | The `.page-header` block — title, pretitle, action buttons |
| `content` | Main content — should contain `<div class="row row-deck row-cards">` for card grids |
| `extra_js` | Page-specific JS. Loaded **after** Tabler JS and the theme engine. |

## Container and grid

- `.container-xl` — max-width content container (default for the navbar, header, body, footer)
- `.row.row-deck.row-cards` — the canonical card-grid row
  - `row-deck` makes all cards the same height
  - `row-cards` applies card-appropriate gutters (~`1rem`)
- Column shorthand: `col-12 col-md-6 col-lg-4` etc. — standard Bootstrap 5 grid

## Asset loading (what's already loaded)

`tabler/base.html` loads, in order:

1. **Blocking theme script** (inline `<script>` in `<head>`) — reads `localStorage` and sets `data-bs-theme`, `data-bs-theme-font/-base/-radius` on `<html>` *before* render, preventing FOUC
2. **Favicon** — from `{% static brand.favicon %}`
3. **Inter font** — Google Fonts preconnect + stylesheet
4. **Tabler CSS** — CDN
5. **`tabler_overrides.css`** — local overrides
6. `{% block extra_css %}`
7. (in `<body>`) **Second inline script** — adds `theme-dark` class to `<body>` + applies `layout-boxed/condensed/fluid` from `localStorage`
8. **HTMX** (`smallstack/js/htmx.min.js`, vendored — not CDN)
9. **Tabler JS** — CDN
10. **`tabler_theme.js`** — the settings-panel engine
11. `{% block extra_js %}`

You do **not** need to load Tabler CSS or HTMX yourself — they are already there.

## Breadcrumbs

The breadcrumb pattern uses two tags from `apps/smallstack/templatetags/theme_tags.py`:

```django
{% load theme_tags %}

{% block breadcrumbs %}
  {% breadcrumb "Home" "website:home" %}             {# label + URL name #}
  {% breadcrumb "Users" "usermanager:index" %}        {# 2nd level #}
  {% breadcrumb user.username %}                      {# leaf, no URL #}
  {% render_tabler_breadcrumbs %}                     {# emits the Tabler markup #}
{% endblock %}
```

The `{% breadcrumb %}` tag accepts:
- A label (string or expression)
- Optionally a URL name (resolves via `reverse()`)
- Optionally URL args: `{% breadcrumb "Detail" "myapp:detail" obj.pk %}`

Each `{% breadcrumb %}` call **accumulates** in `context["breadcrumbs"]`; `{% render_tabler_breadcrumbs %}` renders them with Tabler's `.breadcrumb` + `.breadcrumb-arrows` markup.

## Active nav state

`{% nav_active 'url-name' ['other-url-name' ...] %}` returns the string `"active"` if the current URL matches. It handles namespaces (`help:detail` matches anything under `/help/`).

```django
<a href="{% url 'help:index' %}"
   class="nav-link {% nav_active 'help:index' 'help:detail' %}">Help</a>
```

## The navbar

`tabler/includes/navbar.html` is composed of three regions:

1. **Brand** — logo + `{{ brand.name }}`
2. **Content nav (center)** — Home, Help dropdown (Documentation, Changelog, About, Source), About (anonymous only)
3. **Right side** — Apps grid dropdown (staff only, populated from `nav_items` context var, "admin" section), theme-settings gear, user dropdown

The apps grid is driven by `nav_items` from the `branding()` context processor in `apps/smallstack/context_processors.py`. Items appear automatically when an app registers itself with the NavRegistry — see `apps.<appname>.apps.py` `ready()` in any admin app.

To **replace** the navbar entirely on a page, override the `navbar` block:

```django
{% block navbar %}
<header class="navbar"> <!-- custom --> </header>
{% endblock %}
```

To **hide** it (for print views, embedded views), use:

```django
{% block navbar %}{% endblock %}
```

## Context processors — what's available in every template

From `apps/smallstack/context_processors.py`:

| Variable | What's in it |
|----------|--------------|
| `brand.name` | Brand display name (string) |
| `brand.logo`, `brand.logo_dark` | Logo image paths (use with `{% static %}`) |
| `brand.icon`, `brand.favicon` | Icon paths |
| `brand.social_image`, `brand.tagline` | OG image, tagline |
| `brand.privacy_url`, `brand.terms_url` | Footer links |
| `brand.cookie_banner` | Cookie consent config |
| `brand.signup_terms_notice` | Signup-page T&C text |
| `site.name`, `site.domain`, `site.use_https` | Django Sites framework values |
| `smallstack_version` | Package version string |
| `smallstack_signup_enabled` | Bool — show signup link? |
| `smallstack_docs_enabled` | Bool — show help/docs nav? |
| `smallstack_login_enabled` | Bool — show login? |
| `nav_items` | Registered nav items (grouped by section: `admin`, `account`, etc.) |
| `website_nav_items` | Marketing-side nav items |
| `sidebar_state`, `sidebar_state_forced` | Sidebar collapsed/expanded |
| `palettes`, `color_palette`, `system_color_palette` | Available palettes from `palettes.yaml` |

Use these instead of hard-coding values:

```django
<title>{% block title %}{% endblock %} | {{ brand.name }}</title>
<img src="{% static brand.logo %}" alt="{{ brand.name }}">
```

## Wiring a view

A typical Django view that returns a Tabler page:

```python
# apps/myapp/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def my_dashboard(request):
    return render(request, "myapp/dashboard.html", {
        "stats": compute_stats(),
        "recent": recent_items(request.user),
    })
```

```python
# apps/myapp/urls.py
from django.urls import path
from . import views

app_name = "myapp"

urlpatterns = [
    path("", views.my_dashboard, name="dashboard"),
]
```

Use the app's URL namespace (`app_name`) so `{% url 'myapp:dashboard' %}` and `{% nav_active 'myapp:dashboard' %}` work.

## CRUDView integration

If you're building a list/detail/create/edit set, use SmallStack's `CRUDView` — Tabler templates for it already exist:

- `apps/tabler/templates/smallstack/crud/object_list.html`
- `apps/tabler/templates/smallstack/crud/object_detail.html`
- `apps/tabler/templates/smallstack/crud/object_form.html`
- `apps/tabler/templates/smallstack/crud/object_confirm_delete.html`

See **[tables.md](tables.md)** and **[forms.md](forms.md)** for details on customizing these.

## Common page patterns

Pick the right starting point for what you're building:

| Building | Start from |
|----------|------------|
| Internal admin dashboard | [page-dashboards.md](page-dashboards.md) |
| Marketing/landing page | [page-landing.md](page-landing.md) |
| Article, blog post, doc page | [page-content.md](page-content.md) |
| API endpoint browser | [page-api-explorer.md](page-api-explorer.md) |
| Auth screens | [page-auth.md](page-auth.md) |
| Kanban / todo / file-mgr / inbox-style | [page-utility.md](page-utility.md) |

## Gotchas

- **Always `{% load theme_tags %}`** before using `{% breadcrumb %}` / `{% nav_active %}` / `{% render_tabler_breadcrumbs %}` / `{% querystring %}` / `{% render_paginator %}`. The base template loads it for its own use, but Django requires each template to load tags it uses directly.
- **`{% load static %}`** is similarly required if your page calls `{% static %}`.
- **Don't put content in `<body>` directly** — it must go inside `{% block content %}` so the page wrapper, navbar, header, footer all render.
- **`.container-xl` is already in the navbar, header, body, footer** — don't wrap your `{% block content %}` in another `.container-xl`.
- **No CDN fallback.** If the CDN is unreachable, Tabler doesn't load. See [customization.md](customization.md) for switching to a local build.
- **Inline JS in `extra_js` runs AFTER Tabler JS.** Bootstrap components (dropdowns, tabs, offcanvas) auto-init from `data-bs-*` attributes — you don't need to call constructors manually.
- **Anything in `{% block navbar %}{% endblock %}` removes the default include** — if you customize it, you also lose the apps grid, settings gear, and user menu. Prefer editing `tabler/includes/navbar.html` directly for global changes.

## Related skills

- [theming.md](theming.md) — for the dark mode, color schemes, settings panel
- [layouts.md](layouts.md) — for switching between horizontal, vertical, boxed, condensed, etc.
- [components.md](components.md) — for every component (cards, buttons, etc.)
- [customization.md](customization.md) — for adding new blocks, replacing the navbar, etc.
